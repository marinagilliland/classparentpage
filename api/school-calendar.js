// GET /api/school-calendar?month=YYYY-MM
// Fetches one month of the school's calendar (iCal feed or Finalsite site) and
// returns clean JSON. Sits behind the password (middleware.js). Vercel's CDN
// caches each month for 6 hours, so the school's site is only asked occasionally.
import CONFIG from '../config.js';
import { parseFinalsiteMonth } from '../lib/finalsite.js';
import { parseIcsMonth } from '../lib/ics.js';

const HEADERS = { 'User-Agent': 'Mozilla/5.0 (compatible; ClassParentPage/1.0)', Accept: 'text/calendar,text/html,*/*' };

async function get(url, extraHeaders = {}) {
  const r = await fetch(url, { headers: { ...HEADERS, ...extraHeaders }, signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error(`School calendar answered ${r.status}`);
  return r.text();
}

export default async function handler(req, res) {
  const month = String(req.query.month || '');
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return res.status(400).json({ error: 'Use ?month=YYYY-MM' });

  const cal = CONFIG.calendar || {};
  try {
    let events;
    if (cal.source === 'ics') {
      const url = String(cal.ics?.url || '').replace(/^webcal:/i, 'https:');
      if (!/^https:\/\//i.test(url)) throw new Error('Set calendar.ics.url in config.js');
      const text = await get(url);
      if (!text.includes('BEGIN:VCALENDAR')) throw new Error('That link is not an iCal feed');
      events = parseIcsMonth(text, month, { timeZone: cal.timeZone });
    } else if (cal.source === 'finalsite') {
      const fs = cal.finalsite || {};
      if (!fs.origin || !fs.elementId || !fs.pageId) throw new Error('Set calendar.finalsite origin, elementId and pageId in config.js');
      const url = `${fs.origin.replace(/\/$/, '')}/fs/elements/${fs.elementId}?cal_date=${month}-01` +
        `&is_draft=false&is_load_more=false&page_id=${fs.pageId}&parent_id=${fs.elementId}`;
      const html = await get(url, { 'X-Requested-With': 'XMLHttpRequest' });
      if (!html.includes('fsCalendar')) throw new Error('School site sent an unexpected page');
      events = parseFinalsiteMonth(html, month);
    } else {
      return res.status(404).json({ error: 'No live calendar configured (calendar.source is manual or none)' });
    }
    res.setHeader('Cache-Control', 'public, s-maxage=21600, stale-while-revalidate=86400');
    return res.status(200).json({ month, fetchedAt: new Date().toISOString(), events });
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ month, error: String(err?.message || err) });
  }
}
