// Theme presets. Pick one in config.js → theme.preset.
// Each theme: colors, fonts, a little decorative "motif" SVG, and a few style knobs.

const daisy = `<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="currentColor">${[0,45,90,135,180,225,270,315]
  .map(r => `<ellipse cx="32" cy="14" rx="7" ry="13" transform="rotate(${r} 32 32)"/>`).join('')}</g><circle cx="32" cy="32" r="9" fill="var(--accent)"/></svg>`;

const shell = `<svg viewBox="0 0 64 64" aria-hidden="true"><path fill="currentColor" d="M32 6c-14 0-24 12-24 26 0 6 3 12 8 16h32c5-4 8-10 8-16C56 18 46 6 32 6z"/><g stroke="var(--surface)" stroke-width="2.5" stroke-linecap="round" fill="none"><path d="M32 12v34M22 15l5 31M42 15l-5 31M14 24l9 22M50 24l-9 22"/></g><rect x="22" y="46" width="20" height="8" rx="4" fill="currentColor"/></svg>`;

const leaf = `<svg viewBox="0 0 64 64" aria-hidden="true"><path fill="currentColor" d="M10 54C10 26 28 10 56 8c0 28-16 46-46 46z"/><path d="M14 50L46 18" stroke="var(--surface)" stroke-width="3" stroke-linecap="round"/></svg>`;

const rainbow = `<svg viewBox="0 0 64 40" aria-hidden="true"><g fill="none" stroke-width="7" stroke-linecap="round"><path d="M6 38a26 26 0 0 1 52 0" stroke="currentColor"/><path d="M15 38a17 17 0 0 1 34 0" stroke="var(--accent)"/><path d="M24 38a8 8 0 0 1 16 0" stroke="var(--extra)"/></g></svg>`;

const star = `<svg viewBox="0 0 64 64" aria-hidden="true"><path fill="currentColor" d="M32 4l7.6 17.5L58 24l-14 12.6L48 56 32 46 16 56l4-19.4L6 24l18.4-2.5z"/></svg>`;

// Under-the-sea pieces for the Seashells theme.
const scallop = `<svg viewBox="0 0 64 64" aria-hidden="true"><path fill="currentColor" d="M32 8C17 8 6 20 6 34c0 4 1 8 3 11l23 11 23-11c2-3 3-7 3-11C58 20 47 8 32 8z"/><g fill="none" stroke="var(--surface)" stroke-width="3" stroke-linecap="round" opacity=".85"><path d="M32 14v38M21 17l7 34M43 17l-7 34M12 28l15 22M52 28L37 50"/></g><path fill="currentColor" d="M24 52h16l-3 7H27z"/></svg>`;
const starfish = `<svg viewBox="0 0 64 64" aria-hidden="true"><path fill="currentColor" stroke="currentColor" stroke-width="7" stroke-linejoin="round" d="M32 7l7 17 18 2-14 11 5 18-16-10-16 10 5-18L7 26l18-2z"/><g fill="var(--surface)" opacity=".8"><circle cx="32" cy="18" r="2"/><circle cx="32" cy="31" r="2.6"/><circle cx="44" cy="29" r="2"/><circle cx="20" cy="29" r="2"/><circle cx="25" cy="43" r="2"/><circle cx="39" cy="43" r="2"/></g></svg>`;
const fish = `<svg viewBox="0 0 64 64" aria-hidden="true"><path fill="currentColor" d="M50 32 62 20v24z"/><ellipse cx="30" cy="32" rx="24" ry="16" fill="currentColor"/><path d="M24 18q6 14 0 28" stroke="var(--surface)" stroke-width="3" fill="none" opacity=".7"/><circle cx="16" cy="28" r="5" fill="var(--surface)"/><circle cx="15" cy="28" r="2.5" fill="var(--ink)"/><path d="M8 37q4 3 8 0" stroke="var(--ink)" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`;
const turtle = `<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="currentColor"><ellipse cx="10" cy="32" rx="7" ry="6"/><ellipse cx="22" cy="16" rx="6" ry="4" transform="rotate(-35 22 16)"/><ellipse cx="22" cy="48" rx="6" ry="4" transform="rotate(35 22 48)"/><ellipse cx="44" cy="16" rx="6" ry="4" transform="rotate(35 44 16)"/><ellipse cx="44" cy="48" rx="6" ry="4" transform="rotate(-35 44 48)"/><path d="M54 32l8-3v6z"/></g><ellipse cx="33" cy="32" rx="20" ry="16" fill="currentColor"/><g fill="none" stroke="var(--surface)" stroke-width="2.5" opacity=".75"><path d="M26 22l14 0 6 10-6 10H26l-6-10z"/></g><circle cx="8" cy="30" r="1.8" fill="var(--ink)"/></svg>`;

export const THEMES = {
  // The original look: retro 70s groovy with a calm sage background.
  groovy: {
    label: 'Groovy',
    colors: {
      bg: '#E6EDDF', surface: '#FFFBF3', ink: '#3A2A1F', muted: '#7A6656',
      primary: '#E8743B', onPrimary: '#FFFFFF', secondary: '#E79AAA', accent: '#F2C14E', extra: '#5E9C93',
    },
    fonts: { heading: "'Shrikhand', cursive", body: "'Quicksand', sans-serif", google: ['Shrikhand', 'Quicksand:wght@500;600;700'] },
    radius: '26px', border: '3px', hardShadow: true, sparkle: true, motif: daisy,
  },
  // Cute under-the-sea for little ones (shells, fish, starfish, turtles + bubbles).
  seashells: {
    label: 'Seashells',
    colors: {
      bg: '#DDF3F4', surface: '#FFFCF5', ink: '#173A5E', muted: '#4F6B85',
      primary: '#F2735F', onPrimary: '#FFFFFF', secondary: '#F7A8B8', accent: '#FFD166', extra: '#5CC6D0',
    },
    fonts: { heading: "'Fredoka', sans-serif", body: "'Nunito', sans-serif", google: ['Fredoka:wght@600;700', 'Nunito:wght@500;600;700;800'] },
    radius: '28px', border: '3px', hardShadow: true, sparkle: false, bubbles: true, wave: true, tintMotifs: true,
    motif: scallop, motifs: [scallop, fish, starfish, turtle],
  },
  ocean: {
    label: 'Under the Sea',
    colors: {
      bg: '#E4F1F1', surface: '#FFFDF8', ink: '#16324A', muted: '#5C7486',
      primary: '#1F7A8C', onPrimary: '#FFFFFF', secondary: '#F28C7A', accent: '#F5CB6B', extra: '#7CC6C0',
    },
    fonts: { heading: "'Baloo 2', cursive", body: "'Nunito', sans-serif", google: ['Baloo+2:wght@700;800', 'Nunito:wght@500;600;700'] },
    radius: '22px', border: '3px', hardShadow: true, sparkle: false, motif: shell,
  },
  garden: {
    label: 'Garden',
    colors: {
      bg: '#F3EFE3', surface: '#FFFFFF', ink: '#2F3A2B', muted: '#6E7563',
      primary: '#5E8C4F', onPrimary: '#FFFFFF', secondary: '#E8A9A0', accent: '#F0D27A', extra: '#9DB88A',
    },
    fonts: { heading: "'Fraunces', serif", body: "'Nunito', sans-serif", google: ['Fraunces:opsz,wght@9..144,700;9..144,900', 'Nunito:wght@500;600;700'] },
    radius: '20px', border: '2px', hardShadow: false, sparkle: false, motif: leaf,
  },
  rainbow: {
    label: 'Boho Rainbow',
    colors: {
      bg: '#F4ECE2', surface: '#FFFCF7', ink: '#4A3428', muted: '#86705F',
      primary: '#C8694A', onPrimary: '#FFFFFF', secondary: '#D9A48F', accent: '#E3B75C', extra: '#8FA898',
    },
    fonts: { heading: "'Fredoka', sans-serif", body: "'Nunito', sans-serif", google: ['Fredoka:wght@600;700', 'Nunito:wght@500;600;700'] },
    radius: '24px', border: '2px', hardShadow: false, sparkle: false, motif: rainbow,
  },
  space: {
    label: 'Outer Space',
    colors: {
      bg: '#E9E7F5', surface: '#FFFFFF', ink: '#1E1A4A', muted: '#615C8A',
      primary: '#4B3FB5', onPrimary: '#FFFFFF', secondary: '#F08BB3', accent: '#F7C948', extra: '#58B4D9',
    },
    fonts: { heading: "'Lilita One', cursive", body: "'Nunito', sans-serif", google: ['Lilita+One', 'Nunito:wght@500;600;700'] },
    radius: '22px', border: '3px', hardShadow: true, sparkle: true, motif: star,
  },
};

function merge(base, extra) {
  const out = { ...base };
  for (const [k, v] of Object.entries(extra || {})) {
    out[k] = v && typeof v === 'object' && !Array.isArray(v) ? merge(base[k] || {}, v) : v;
  }
  return out;
}

export function resolveTheme(cfg = {}) {
  const base = THEMES[cfg.preset] || THEMES.groovy;
  return merge(base, cfg.overrides);
}

export function themeCss(t) {
  const c = t.colors;
  return `:root{
  --bg:${c.bg};--surface:${c.surface};--ink:${c.ink};--muted:${c.muted};
  --primary:${c.primary};--on-primary:${c.onPrimary};--secondary:${c.secondary};--accent:${c.accent};--extra:${c.extra};
  --font-heading:${t.fonts.heading};--font-body:${t.fonts.body};
  --radius:${t.radius};--bw:${t.border};
  --shadow:${t.hardShadow ? '6px 6px 0 var(--ink)' : '0 10px 30px -12px rgba(0,0,0,.25)'};
  --shadow-sm:${t.hardShadow ? '3px 3px 0 var(--ink)' : '0 4px 14px -6px rgba(0,0,0,.25)'};
}`;
}

export function fontsHref(t) {
  return 'https://fonts.googleapis.com/css2?' + t.fonts.google.map(f => 'family=' + f).join('&') + '&display=swap';
}
