// Password gate (Vercel Routing Middleware).
// Set SITE_PASSWORD in Vercel → Project → Settings → Environment Variables.
import { next } from '@vercel/functions';
import CONFIG from './config.js';
import { resolveTheme, themeCss, fontsHref } from './themes.js';

// Everything is protected except the stylesheet + favicon the login page needs.
export const config = { matcher: ['/((?!styles\\.css$|favicon\\.svg$).*)'] };

const COOKIE = 'classpage_auth';
const DAYS = 60;

async function tokenFor(password) {
  const data = new TextEncoder().encode(`${password}|${CONFIG.slug}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function loginPage({ error = false, status = 200 } = {}) {
  const theme = resolveTheme(CONFIG.theme);
  const art = theme.motifs || [theme.motif];
  const tints = ['var(--secondary)', 'var(--extra)', 'var(--accent)', 'var(--primary)'];
  const motifs = [[6, 12, 90], [84, 8, 70], [88, 70, 100], [4, 74, 64]]
    .map(([x, y, s], i) => `<div class="motif" style="left:${x}%;top:${y}%;width:${s}px;height:${s}px;color:${theme.tintMotifs ? tints[i % 4] : 'var(--secondary)'};transform:rotate(${i * 20}deg)">${art[i % art.length]}</div>`).join('');
  const teacherNames = (CONFIG.teachers || []).map(t => t.displayName).filter(Boolean);
  const who = teacherNames.length > 1 ? teacherNames.slice(0, -1).join(', ') + ' & ' + teacherNames.at(-1) : teacherNames[0] || 'the teacher';
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow">
<title>${esc(CONFIG.class.name)} · Families Only</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${fontsHref(theme)}"><link rel="stylesheet" href="/styles.css"><style>${themeCss(theme)}</style></head>
<body><main class="login">${motifs}
<form class="box" method="POST" action="/login">
  <span class="eyebrow">${esc([CONFIG.school.short || CONFIG.school.name, CONFIG.class.grade, CONFIG.class.year].filter(Boolean).join(' · '))}</span>
  <h1>${esc(CONFIG.class.name).replace(/-/g, '&#8209;')}</h1>
  <p>This is the private page for ${esc(CONFIG.class.name)} families — school dates, class news and favorites from ${esc(who)}. Enter the class password to come on in.</p>
  ${error ? '<div class="err" role="alert">Hmm, that password didn\'t work. Try again?</div>' : ''}
  <label class="sr" for="pw">Class password</label>
  <input id="pw" name="password" type="password" placeholder="Class password" autocomplete="current-password" required autofocus>
  <button class="btn primary" type="submit">Let me in ✦</button>
</form></main></body></html>`;
  return new Response(html, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
}

const cookieHeader = (value, maxAge) =>
  `${COOKIE}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;

export default async function middleware(request) {
  const password = process.env.SITE_PASSWORD;
  if (!password) {
    return new Response('This page is locked until SITE_PASSWORD is set in Vercel.', { status: 503 });
  }
  const url = new URL(request.url);
  const expected = await tokenFor(password);

  if (url.pathname === '/logout') {
    return new Response(null, { status: 303, headers: { Location: '/', 'Set-Cookie': cookieHeader('', 0) } });
  }

  if (url.pathname === '/login' && request.method === 'POST') {
    const form = await request.formData();
    const tried = String(form.get('password') || '');
    if ((await tokenFor(tried)) === expected) {
      return new Response(null, { status: 303, headers: { Location: '/', 'Set-Cookie': cookieHeader(expected, DAYS * 86400) } });
    }
    return loginPage({ error: true, status: 401 });
  }

  const cookies = request.headers.get('cookie') || '';
  const match = cookies.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([a-f0-9]+)`));
  if (match && match[1] === expected) return next();

  // Not logged in: show the login page for page visits, block everything else (photos, config, etc.).
  const wantsPage = url.pathname === '/' || url.pathname.endsWith('.html') || url.pathname === '/login';
  return wantsPage ? loginPage() : new Response('Not found', { status: 404 });
}
