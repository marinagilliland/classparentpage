// Reads one month of a Finalsite calendar element (the website platform many private
// schools use) and returns plain events. No dependencies, so it runs anywhere.

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', hellip: '…' };
export function decode(s) {
  return String(s || '')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m)
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const pad = n => String(n).padStart(2, '0');

// "2026-11-10T08:30:00-05:00" → "8:30 AM" (clock time as published, no timezone math)
function clock(iso) {
  const m = /T(\d{2}):(\d{2})/.exec(iso || '');
  if (!m) return '';
  const h = +m[1];
  return `${h % 12 || 12}:${m[2]} ${h < 12 ? 'AM' : 'PM'}`;
}

/**
 * @param {string} html  response of /fs/elements/<id>?cal_date=YYYY-MM-01&page_id=…
 * @param {string} month 'YYYY-MM' — grid overflow days from other months are dropped
 * @returns {{date:string,title:string,allDay:boolean,time:string,id:string}[]}
 */
export function parseFinalsiteMonth(html, month) {
  const out = [];
  const seen = new Set();
  const boxes = String(html).split(/class="fsCalendarDaybox\b/).slice(1);
  for (const box of boxes) {
    const d = /class="fsCalendarDate"[^>]*>/.exec(box);
    if (!d) continue;
    const attr = name => (new RegExp(`data-${name}="(\\d+)"`).exec(d[0]) || [])[1];
    const y = attr('year'), mo = attr('month'), day = attr('day');
    if (!y || mo === undefined || !day) continue;
    const date = `${y}-${pad(+mo + 1)}-${pad(+day)}`; // Finalsite months are 0-based
    if (month && !date.startsWith(month)) continue;

    for (const info of box.split(/class="fsCalendarInfo"/).slice(1)) {
      const a = /class="fsCalendarEventTitle[^"]*"([^>]*)>([\s\S]*?)<\/a>/.exec(info);
      if (!a) continue;
      const titleAttr = /title="([^"]*)"/.exec(a[1]);
      const title = decode(titleAttr ? titleAttr[1] : a[2]);
      if (!title) continue;
      const id = (/data-occur-id="(\d+)"/.exec(a[1]) || [])[1] || '';
      const k = `${date}|${id || title}`;
      if (seen.has(k)) continue;
      seen.add(k);
      const allDay = /fsAllDayEvent/.test(info);
      const start = (/datetime="([^"]+)"[^>]*class="fsStartTime"/.exec(info) || [])[1];
      const end = (/datetime="([^"]+)"[^>]*class="fsEndTime"/.exec(info) || [])[1];
      const time = allDay ? '' : [clock(start), clock(end)].filter(Boolean).join(' – ');
      out.push({ date, title, allDay, time, id });
    }
  }
  return out.sort((x, y) => x.date.localeCompare(y.date) || (x.allDay === y.allDay ? 0 : x.allDay ? -1 : 1));
}
