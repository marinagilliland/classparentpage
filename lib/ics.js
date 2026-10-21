// Reads a public iCal (.ics) feed — Google Calendar, Outlook, most school sites —
// and returns one item per day for a given month. No dependencies.
//
// Supports: all-day and timed events, multi-day events, UTC and TZID times,
// cancelled events, EXDATE, and common RRULEs (DAILY / WEEKLY with BYDAY /
// MONTHLY / YEARLY with INTERVAL, COUNT and UNTIL).

const pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
const utcDay = (y, m, d) => new Date(Date.UTC(y, m - 1, d));
const addDays = (d, n) => new Date(d.getTime() + n * 86400000);
const DAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

function unescapeText(s) {
  return String(s || '').replace(/\\n/gi, ' ').replace(/\\([,;\\])/g, '$1').replace(/\s+/g, ' ').trim();
}

// Parse a DTSTART/DTEND-style value into { day (UTC midnight Date), allDay, minutes (local clock) }.
function parseWhen(params, value, timeZone) {
  const v = String(value || '').trim();
  const dOnly = /^(\d{4})(\d{2})(\d{2})$/.exec(v);
  if (dOnly || /VALUE=DATE(?!-)/i.test(params)) {
    const m = /^(\d{4})(\d{2})(\d{2})/.exec(v);
    if (!m) return null;
    return { day: utcDay(+m[1], +m[2], +m[3]), allDay: true, minutes: null };
  }
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?(Z)?$/.exec(v);
  if (!m) return null;
  let [y, mo, d, h, mi] = [+m[1], +m[2], +m[3], +m[4], +m[5]];
  if (m[7] && timeZone) {
    // UTC time → the school's local clock time.
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date(Date.UTC(y, mo - 1, d, h, mi)));
    const get = t => +parts.find(p => p.type === t).value;
    [y, mo, d, h, mi] = [get('year'), get('month'), get('day'), get('hour'), get('minute')];
  }
  return { day: utcDay(y, mo, d), allDay: false, minutes: h * 60 + mi };
}

const clock = min => `${Math.floor(min / 60) % 12 || 12}:${pad(min % 60)} ${min < 720 ? 'AM' : 'PM'}`;

function parseRRule(s) {
  const r = {};
  for (const part of String(s || '').split(';')) {
    const [k, v] = part.split('=');
    if (k && v) r[k.toUpperCase()] = v;
  }
  return r;
}

// Start days of every occurrence that could touch [from, to].
function occurrences(start, rule, exdates, from, to) {
  if (!rule) return [start];
  const freq = rule.FREQ, interval = Math.max(1, +rule.INTERVAL || 1);
  const count = rule.COUNT ? +rule.COUNT : Infinity;
  let until = null;
  if (rule.UNTIL) {
    const m = /^(\d{4})(\d{2})(\d{2})/.exec(rule.UNTIL);
    if (m) until = utcDay(+m[1], +m[2], +m[3]);
  }
  const byDay = rule.BYDAY ? rule.BYDAY.split(',').map(x => DAYS.indexOf(x.replace(/^[+-]?\d+/, ''))).filter(i => i >= 0) : null;
  const out = [];
  let n = 0;
  const push = d => {
    if (until && d > until) return false;
    if (n >= count) return false;
    n++;
    if (!exdates.has(ymd(d)) && d >= addDays(from, -40) && d <= to) out.push(d);
    return d <= to;
  };
  const limit = 3000;
  if (freq === 'DAILY') {
    for (let i = 0, d = start; i < limit; i++, d = addDays(d, interval)) if (!push(d)) break;
  } else if (freq === 'WEEKLY') {
    const days = byDay && byDay.length ? byDay.sort() : [start.getUTCDay()];
    const weekStart = addDays(start, -start.getUTCDay());
    outer: for (let w = 0; w < limit; w++) {
      const base = addDays(weekStart, w * 7 * interval);
      for (const wd of days) {
        const d = addDays(base, wd);
        if (d < start) continue;
        if (!push(d)) break outer;
      }
    }
  } else if (freq === 'MONTHLY') {
    for (let i = 0; i < limit; i++) {
      const d = utcDay(start.getUTCFullYear(), start.getUTCMonth() + 1 + i * interval, start.getUTCDate());
      if (d.getUTCDate() !== start.getUTCDate()) continue; // e.g. the 31st in a short month
      if (!push(d)) break;
    }
  } else if (freq === 'YEARLY') {
    for (let i = 0; i < 200; i++) {
      const d = utcDay(start.getUTCFullYear() + i * interval, start.getUTCMonth() + 1, start.getUTCDate());
      if (!push(d)) break;
    }
  } else {
    return [start];
  }
  return out;
}

/**
 * @param {string} text    the .ics file
 * @param {string} month   'YYYY-MM'
 * @param {object} [opts]  { timeZone: 'America/New_York' } — converts UTC times to local clock times
 * @returns {{date:string,title:string,allDay:boolean,time:string,id:string}[]}
 */
export function parseIcsMonth(text, month, opts = {}) {
  const [y, m] = month.split('-').map(Number);
  const from = utcDay(y, m, 1), to = addDays(utcDay(y, m + 1, 1), -1);
  const lines = String(text).replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '').split(/\r?\n/);

  const events = [];
  let cur = null;
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') { cur = { exdates: new Set() }; continue; }
    if (line === 'END:VEVENT') { if (cur) events.push(cur); cur = null; continue; }
    if (!cur) continue;
    const i = line.indexOf(':');
    if (i < 0) continue;
    const head = line.slice(0, i), value = line.slice(i + 1);
    const [name, ...rest] = head.split(';');
    const params = rest.join(';');
    switch (name.toUpperCase()) {
      case 'SUMMARY': cur.title = unescapeText(value); break;
      case 'UID': cur.uid = value.trim(); break;
      case 'STATUS': cur.status = value.trim().toUpperCase(); break;
      case 'RRULE': cur.rrule = parseRRule(value); break;
      case 'RECURRENCE-ID': cur.recurrenceId = true; break;
      case 'DTSTART': cur.start = parseWhen(params, value, opts.timeZone); break;
      case 'DTEND': cur.end = parseWhen(params, value, opts.timeZone); break;
      case 'EXDATE':
        for (const v of value.split(',')) {
          const w = parseWhen(params, v, opts.timeZone);
          if (w) cur.exdates.add(ymd(w.day));
        }
        break;
    }
  }

  const out = [];
  const seen = new Set();
  for (const e of events) {
    if (!e.start || !e.title || e.status === 'CANCELLED') continue;
    // Length in days (all-day DTEND is exclusive).
    let spanDays = 1;
    if (e.end) {
      const diff = Math.round((e.end.day - e.start.day) / 86400000);
      spanDays = e.start.allDay ? Math.max(1, diff) : Math.max(1, diff + (e.end.minutes === 0 && diff > 0 ? 0 : 1));
    }
    const time = e.start.allDay ? '' :
      [clock(e.start.minutes), e.end && !e.end.allDay && Math.round((e.end.day - e.start.day) / 86400000) === 0 ? clock(e.end.minutes) : '']
        .filter(Boolean).join(' – ');
    for (const s of occurrences(e.start.day, e.recurrenceId ? null : e.rrule, e.exdates, from, to)) {
      for (let k = 0; k < spanDays && k < 60; k++) {
        const d = addDays(s, k);
        if (d < from || d > to) continue;
        const date = ymd(d);
        const dedupe = `${date}|${e.title}|${time}`;
        if (seen.has(dedupe)) continue;
        seen.add(dedupe);
        out.push({ date, title: e.title, allDay: e.start.allDay, time: k === 0 ? time : '', id: e.uid || '' });
      }
    }
  }
  return out.sort((a, b) => a.date.localeCompare(b.date) || (a.allDay === b.allDay ? 0 : a.allDay ? -1 : 1));
}
