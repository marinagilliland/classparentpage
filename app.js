import CONFIG from './config.js';
import { resolveTheme, themeCss, fontsHref } from './themes.js';

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const has = v => v !== undefined && v !== null && String(v).trim() !== '';

// ── Theme ──────────────────────────────────────────────────
const theme = resolveTheme(CONFIG.theme);
$('theme-vars').textContent = themeCss(theme);
$('fonts').href = fontsHref(theme);

const motifs = theme.motifs || [theme.motif];
const tints = ['var(--secondary)', 'var(--extra)', 'var(--accent)', 'var(--primary)'];
function decorate(host, spots) {
  host.innerHTML = spots.map(([x, y, s], i) =>
    `<div class="motif" style="left:${x}%;top:${y}%;width:${s}px;height:${s}px;color:${theme.tintMotifs ? tints[i % tints.length] : 'var(--secondary)'};transform:rotate(${(i % 2 ? -1 : 1) * i * 11}deg)">${motifs[i % motifs.length]}</div>`).join('');
  if (theme.sparkle) {
    const sp = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12z"/></svg>';
    host.innerHTML += [[20, 18], [60, 12], [80, 40], [35, 75], [12, 45], [95, 85], [55, 60]]
      .map(([x, y], i) => `<span class="sparkle" style="left:${x}%;top:${y}%;animation-delay:${i * 0.4}s">${sp}</span>`).join('');
  }
  if (theme.bubbles) {
    host.innerHTML += [[8, 18, 0], [22, 12, 3], [38, 20, 6], [55, 14, 1.5], [70, 22, 4.5], [86, 16, 2.5], [94, 10, 7]]
      .map(([x, s, d]) => `<span class="bubble" style="left:${x}%;width:${s}px;height:${s}px;animation-delay:${d}s"></span>`).join('');
  }
}
decorate($('hero-decor'), [[3, 8, 70], [90, 6, 56], [93, 60, 78], [1, 66, 50], [46, 84, 40], [68, 1, 34], [30, 2, 28], [80, 82, 44]]);
document.body.classList.toggle('has-wave', !!theme.wave);

// ── Text + hero ────────────────────────────────────────────
const cls = CONFIG.class, school = CONFIG.school;
const teachers = (CONFIG.teachers || []).filter(t => has(t.displayName));
const names = teachers.map(t => t.displayName);
const nameList = names.length > 1 ? names.slice(0, -1).join(', ') + ' & ' + names.at(-1) : names[0] || '';
document.title = `${cls.name} · Class Page`;
$('brand').textContent = cls.name;
$('eyebrow').textContent = [school.short || school.name, cls.grade, cls.year].filter(has).join(' · ');
$('class-name').textContent = cls.name.replace(/-/g, '‑'); // keep "Pre-K4" on one line
$('tagline').textContent = cls.tagline;
$('hero-photos').classList.toggle('duo', teachers.length > 1);
$('hero-photos').innerHTML = teachers.map((t, i) => `
  <figure class="photo">
    <div class="frame"><img src="${esc(t.photo)}" alt="${esc(t.photoAlt || t.displayName)}" loading="${i ? 'lazy' : 'eager'}"></div>
    <figcaption class="badge">${esc(t.displayName)}</figcaption>
  </figure>`).join('');
$('meet-title').textContent = teachers.length > 1 ? 'Meet Your Teachers' : `Meet ${nameList}`;
$('nav-meet').textContent = teachers.length > 1 ? 'Meet the Teachers' : `Meet ${nameList}`;

const links = (CONFIG.links || []).filter(l => has(l.url));
$('hero-btns').innerHTML =
  `<a class="btn primary" href="#meet">✦ ${teachers.length > 1 ? 'Teacher favorites' : esc(nameList) + "'s favorites"}</a>` +
  `<a class="btn" href="#calendar">📅 School dates</a>` +
  links.map(l => `<a class="btn" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.icon)} ${esc(l.label)}</a>`).join('');

// ── Teachers + favorites ───────────────────────────────────
$('intro').textContent = cls.intro;
$('intro').hidden = !has(cls.intro);
$('teachers').innerHTML = teachers.map(t => {
  const favs = (t.favorites || []).filter(f => has(f.value));
  return `<article class="teacher">
    <header class="t-head">
      <img class="t-pic" src="${esc(t.photo)}" alt="" loading="lazy">
      <div><h3>${esc(t.displayName)}</h3>${has(t.fullName) ? `<p>${esc(t.fullName)}</p>` : ''}</div>
    </header>
    <div class="favs">${favs.length
      ? favs.map(f => `<div class="fav${f.plenty ? ' plenty' : ''}"><div class="i">${esc(f.icon)}</div><div class="l">${esc(f.label)}</div><div class="v">${esc(f.value)}</div></div>`).join('')
      : `<div class="fav"><div class="i">✏️</div><div class="l">Coming soon</div><div class="v">Favorites are on their way!</div></div>`}</div>
  </article>`;
}).join('');

// ── Dates ──────────────────────────────────────────────────
const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const key = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const monthKey = d => key(d).slice(0, 7);
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const addMonths = (m, n) => { const [y, mo] = m.split('-').map(Number); return monthKey(new Date(y, mo - 1 + n, 1)); };
const monthName = m => parse(m + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
const today = new Date(); today.setHours(0, 0, 0, 0);

const SC = CONFIG.calendar || {};
const LIVE = SC.source === 'ics' || SC.source === 'finalsite';
const rx = list => (list || []).map(p => { try { return new RegExp(p, 'i'); } catch { return null; } }).filter(Boolean);
const SHOW = rx(SC.show), HIDE = rx(SC.hide), CLOSED = rx(SC.closedWhen);
const firstMonth = SC.firstMonth || monthKey(today), lastMonth = SC.lastMonth || addMonths(monthKey(today), 10);
let showAll = false;

const isRelevant = title => SHOW.some(r => r.test(title)) || !HIDE.some(r => r.test(title));

// "Unity Day (Wear orange …)" → title "Unity Day", note "Wear orange …"; "School Closed-Winter Break" → "School Closed — Winter Break"
function tidy(raw) {
  let title = raw.replace(/([a-z])-(?=[A-Z][a-z]{2,})/g, '$1 — ').replace(/^School Closed — /, '');
  let note = '';
  const m = /^(.+?)\s*\(([^()]+)\)\s*$/.exec(title);
  if (m) { title = m[1]; note = m[2]; }
  return { title, note };
}

// Per-day items → { date, title, note, closed, relevant }
function fromLive(e) {
  const t = tidy(e.title);
  return { raw: e.title, date: e.date, title: t.title, note: [e.time, t.note].filter(has).join(' · '), closed: CLOSED.some(r => r.test(e.title)), relevant: isRelevant(e.title) };
}
function expandBackup(month) {
  const out = [], closedDays = new Set();
  (SC.events || []).filter(e => has(e.date) && has(e.title)).forEach(e => {
    for (let d = parse(e.date); d <= parse(e.end || e.date); d = addDays(d, 1)) {
      if (monthKey(d) !== month) continue;
      out.push({ date: key(d), title: e.title, note: e.note || '', closed: !!e.closed, relevant: true });
      if (e.closed) closedDays.add(key(d));
    }
  });
  const [y, mo] = month.split('-').map(Number);
  for (let d = new Date(y, mo - 1, 1); d.getMonth() === mo - 1; d = addDays(d, 1)) {
    (SC.recurring || []).forEach(r => {
      if (d.getDay() !== r.weekday || closedDays.has(key(d))) return;
      if (has(r.from) && d < parse(r.from)) return;
      if (has(r.until) && d > parse(r.until)) return;
      out.push({ date: key(d), title: r.title, note: r.note || '', closed: false, relevant: true });
    });
  }
  return out;
}
const classItems = month => (CONFIG.classEvents || []).filter(e => has(e.date) && has(e.title)).flatMap(e => {
  const out = [];
  for (let d = parse(e.date); d <= parse(e.end || e.date); d = addDays(d, 1)) if (monthKey(d) === month) out.push({ date: key(d), title: e.title, note: e.note || '', closed: !!e.closed, relevant: true, cls: true });
  return out;
});

const cache = {};
function loadMonth(month) {
  return cache[month] ||= (async () => {
    let items, live = false;
    if (LIVE) {
      try {
        const r = await fetch(`/api/school-calendar?month=${month}`, { headers: { Accept: 'application/json' } });
        if (r.ok) { items = (await r.json()).events.map(fromLive); live = true; }
      } catch { /* fall through to backup */ }
    }
    if (!items) items = expandBackup(month);
    const closedDays = new Set(items.filter(i => i.closed).map(i => i.date));
    const ON_CLOSED = rx(SC.hideOnClosedDays);
    items = items.filter(i => i.closed || !closedDays.has(i.date) || !ON_CLOSED.some(r => r.test(i.raw || i.title)));
    return { live, items: [...items, ...classItems(month)] };
  })();
}

// Merge back-to-back days with the same title into one ranged event (weekends in between are fine).
function bridges(end, next) {
  for (let d = addDays(end, 1); d < next; d = addDays(d, 1)) if (d.getDay() !== 0 && d.getDay() !== 6) return false;
  return next > end;
}
function merge(items) {
  const seen = new Set();
  const days = items.filter(i => { const k = i.date + '|' + i.title; if (seen.has(k)) return false; seen.add(k); return true; })
    .sort((a, b) => a.title.localeCompare(b.title) || a.date.localeCompare(b.date));
  const out = [];
  for (const i of days) {
    const last = out[out.length - 1];
    if (last && last.title === i.title && bridges(last.endD, parse(i.date))) { last.endD = parse(i.date); continue; }
    out.push({ ...i, start: parse(i.date), endD: parse(i.date) });
  }
  return out.sort((a, b) => a.start - b.start || (b.closed - a.closed) || a.title.localeCompare(b.title));
}
const visible = items => items.filter(i => showAll || i.relevant);

// ── This-week banner ──
const dayLabel = d => key(d) === key(today) ? 'Today' : key(d) === key(addDays(today, 1)) ? 'Tmrw' : d.toLocaleDateString('en-US', { weekday: 'short' });
async function renderWeek() {
  const end = addDays(today, (SC.bannerDays || 7) - 1);
  const months = [...new Set([monthKey(today), monthKey(end)])];
  const all = (await Promise.all(months.map(loadMonth))).flatMap(m => m.items)
    .filter(i => i.relevant && i.date >= key(today) && i.date <= key(end));
  const evs = merge(all);
  $('week-chips').innerHTML = evs.length
    ? evs.map(e => `<span class="chip${e.closed ? ' closed' : ''}" title="${esc(e.note)}"><span class="d">${dayLabel(e.start)}</span>${esc(e.title)}</span>`).join('')
    : `<span class="empty">Nothing on the school calendar this week — enjoy! ✌️</span>`;
}

// ── Month view ──
let current = monthKey(today) < firstMonth ? firstMonth : monthKey(today) > lastMonth ? lastMonth : monthKey(today);
let shown = [];
const rangeText = e => key(e.start) === key(e.endD) ? '' : ` (through ${e.endD.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`;
function evRow(e, idx) {
  const note = [e.closed && !/no school/i.test(e.note) ? 'No school' : '', e.note].filter(has).join(' · ');
  return `<div class="ev${e.closed ? ' closed' : ''}${e.cls ? ' class-ev' : ''}${e.endD < today ? ' past' : ''}">
    <div class="date"><small>${e.start.toLocaleDateString('en-US', { weekday: 'short' })}</small><b>${e.start.getDate()}</b></div>
    <div><div class="t">${esc(e.title)}${esc(rangeText(e))}</div>${has(note) ? `<div class="n">${esc(note)}</div>` : ''}</div>
    <button class="add" type="button" data-i="${idx}" title="Add to my calendar" aria-label="Add ${esc(e.title)} to my calendar">＋</button>
  </div>`;
}
async function renderMonth() {
  $('month-label').textContent = monthName(current);
  $('prev-month').disabled = current <= firstMonth;
  $('next-month').disabled = current >= lastMonth;
  $('months').innerHTML = `<p class="loading">Loading ${esc(monthName(current))}…</p>`;
  const want = current;
  const { live, items } = await loadMonth(current);
  if (want !== current) return; // user clicked ahead
  shown = merge(visible(items));
  $('months').innerHTML = shown.length ? shown.map(evRow).join('') : `<p class="loading">Nothing on the calendar for our class this month.</p>`;
  const sname = school.short || school.name;
  $('cal-status').textContent = live
    ? `Live from the ${sname} calendar · refreshes every few hours`
    : LIVE ? `Couldn't reach the ${sname} calendar right now — showing saved key dates.` : `Key dates for ${cls.year || 'this school year'}`;
  $('cal-status').classList.toggle('warn', !live && LIVE);
  // Warm up the next month so clicking ahead is instant.
  if (current < lastMonth) loadMonth(addMonths(current, 1));
}
$('prev-month').onclick = () => { current = addMonths(current, -1); renderMonth(); };
$('next-month').onclick = () => { current = addMonths(current, 1); renderMonth(); };
$('show-all').onchange = e => { showAll = e.target.checked; renderMonth(); };

$('cal-sub').textContent = LIVE
  ? `Pulled straight from the ${school.name} calendar and filtered to what matters for our class.`
  : `School dates and class events, all in one place.`;
$('show-all').closest('label').hidden = !LIVE;
has(school.calendarUrl) ? $('school-cal').href = school.calendarUrl : $('school-cal').remove();
has(school.keyDatesUrl) ? $('school-keydates').href = school.keyDatesUrl : $('school-keydates').remove();
if (!has(school.calendarUrl) && !has(school.keyDatesUrl)) $('school-card').remove();
else $('school-blurb').textContent = `Everything happening across ${school.short || school.name}.`;

if (SC.source === 'none') {
  ['calendar', 'week-banner', 'nav-cal'].forEach(id => { if ($(id)) $(id).style.display = 'none'; });
} else {
  renderWeek();
  renderMonth();
}

// ── .ics downloads ─────────────────────────────────────────
const icsDate = d => key(d).replace(/-/g, '');
const icsText = s => String(s || '').replace(/[\;,]/g, m => '\\' + m).replace(/\n/g, '\\n');
function ics(events) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Class Page//EN', 'CALSCALE:GREGORIAN', `X-WR-CALNAME:${icsText(cls.name)}`];
  events.forEach(e => lines.push('BEGIN:VEVENT', `UID:${CONFIG.slug}-${icsDate(e.start)}-${icsText(e.title).replace(/\W+/g, '')}@classpage`,
    `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${icsDate(e.start)}`, `DTEND;VALUE=DATE:${icsDate(addDays(e.endD, 1))}`,
    `SUMMARY:${icsText((e.closed ? 'No School: ' : '') + e.title)}`, ...(has(e.note) ? [`DESCRIPTION:${icsText(e.note)}`] : []),
    'TRANSP:TRANSPARENT', 'END:VEVENT'));
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
function download(name, text) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/calendar' }));
  a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
$('ics-all').onclick = async () => {
  const btn = $('ics-all'), label = btn.textContent;
  btn.disabled = true; btn.textContent = 'Gathering dates…';
  const months = [];
  for (let m = monthKey(today) < firstMonth ? firstMonth : monthKey(today); m <= lastMonth; m = addMonths(m, 1)) months.push(m);
  const items = (await Promise.all(months.map(loadMonth))).flatMap(m => m.items).filter(i => i.relevant && i.date >= key(today));
  download(`${CONFIG.slug}-school-dates.ics`, ics(merge(items)));
  btn.disabled = false; btn.textContent = label;
};
$('months').addEventListener('click', ev => {
  const b = ev.target.closest('.add'); if (!b) return;
  const e = shown[+b.dataset.i];
  download(`${e.title.replace(/\W+/g, '-').toLowerCase()}.ics`, ics([e]));
});

// ── Helping out ────────────────────────────────────────────
const cp = CONFIG.classParent || {};
const wish = (CONFIG.classWishlist || []).filter(has);
$('help-cards').innerHTML =
  (wish.length ? `<div class="card wish"><div class="ic">🧺</div><h3>Our Classroom Could Use</h3><ul>${wish.map(w => `<li>${esc(w)}</li>`).join('')}</ul></div>` : '') +
  links.map(l => `<div class="card"><div class="ic">${esc(l.icon)}</div><h3>${esc(l.label)}</h3><p>${esc(l.note)}</p>
    <a class="btn primary" href="${esc(l.url)}" target="_blank" rel="noopener">Open ↗</a></div>`).join('') +
  `<div class="card parent"><div class="ic">💌</div><h3>Volunteering</h3><p>${esc(cp.note)}</p>
    ${has(cp.email) ? `<a class="btn primary" href="mailto:${esc(cp.email)}">Email ${esc(has(cp.name) ? cp.name : 'the class parent')}</a>` : ''}</div>`;

$('footer').innerHTML = `Made with 💛 for the families of ${esc(cls.name)}` +
  (has(cp.name) ? ` · Class parent: ${esc(cp.name)}` : '') + ` · <a href="/logout">Log out</a>`;
