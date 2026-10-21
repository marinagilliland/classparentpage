// ═════════════════════════════════════════════════════════════════════
//  CLASS PARENT PAGE — config.js
//
//  This is the ONLY file you need to edit. Everything below is a fictional
//  demo class ("Maple Grove Academy") so you can see how it all fits together.
//  Replace it with your own class, then add teacher photos to /assets.
//
//  Tips
//  • Any text left blank ('') or any empty list [] is simply hidden.
//  • Keep the quotes and commas. If the page goes blank, a missing comma
//    or quote here is the usual culprit.
//  • The page password is NOT set here. It's an environment variable
//    (SITE_PASSWORD) in Vercel, so it never ends up on GitHub.
// ═════════════════════════════════════════════════════════════════════

export default {
  // A short, unique id for this class (letters, numbers, dashes).
  // Used for the login cookie and calendar downloads.
  slug: 'maple-grove-prek4-rivera-chen',

  // ── SCHOOL ───────────────────────────────────────────────────────────
  school: {
    name: 'Maple Grove Academy',
    short: 'MGA',                                 // shown in small labels; '' to use the full name
    calendarUrl: 'https://example.com/calendar',  // "Open school calendar" button ('' to hide)
    keyDatesUrl: '',                              // optional link to a printable calendar / PDF
  },

  // ── CLASS ────────────────────────────────────────────────────────────
  class: {
    name: "Ms. Rivera & Ms. Chen's Pre-K4",       // the big title
    grade: 'Pre-K4',                              // small label above the title
    year: '2026–2027',
    tagline: 'Our little corner of the internet for class families.',
    intro:
      "Hi families! We're so excited to spend this year learning, playing and growing with your kiddos. Here are a few of our favorite things — just in case you ever want to know.",
  },

  // ── TEACHERS ─────────────────────────────────────────────────────────
  // One block per teacher (one, two, or more). Photo: put a portrait image in
  // /assets and point to it, e.g. 'assets/ms-rivera.jpg'. Square-ish or 4:5 works best.
  // Favorites: blank values are hidden. Add, remove or reorder rows freely — icon is any emoji.
  // `plenty: true` styles a row as "please don't buy more of these".
  teachers: [
    {
      displayName: 'Ms. Rivera',
      fullName: 'Ana Rivera',
      photo: 'assets/teacher-1.svg',
      favorites: [
        { icon: '🎂', label: 'Birthday', value: 'March 14' },
        { icon: '🍽️', label: 'Restaurants', value: 'Chipotle, the taco truck on Main St.' },
        { icon: '☕', label: 'Coffee order', value: 'Iced oat latte, extra shot' },
        { icon: '🍿', label: 'Snacks', value: 'Dark chocolate almonds, kettle corn' },
        { icon: '🥤', label: 'Drinks', value: 'Sparkling water (lime)' },
        { icon: '🎨', label: 'Color', value: 'Sunflower yellow' },
        { icon: '🌸', label: 'Flowers & plants', value: 'Sunflowers, pothos' },
        { icon: '🎁', label: 'Gift cards', value: 'Target, Amazon, local bookstore' },
        { icon: '💖', label: 'Never enough of', value: 'Glue sticks and dry-erase markers' },
        { icon: '📦', label: 'Already has plenty of', value: 'Mugs and candles', plenty: true },
      ],
    },
    {
      displayName: 'Ms. Chen',
      fullName: 'Grace Chen',
      photo: 'assets/teacher-2.svg',
      favorites: [
        { icon: '🎂', label: 'Birthday', value: 'October 2' },
        { icon: '🍽️', label: 'Restaurants', value: 'Panera, any good pho spot' },
        { icon: '☕', label: 'Coffee order', value: 'Hot chai latte' },
        { icon: '🍿', label: 'Snacks', value: 'Pretzels, clementines' },
        { icon: '🥤', label: 'Drinks', value: 'Unsweet iced tea' },
        { icon: '🎨', label: 'Color', value: 'Teal' },
        { icon: '🌸', label: 'Flowers & plants', value: 'Tulips, succulents' },
        { icon: '🎁', label: 'Gift cards', value: 'Starbucks, HomeGoods' },
        { icon: '💖', label: 'Never enough of', value: 'Colorful pens and sticky notes' },
        { icon: '📦', label: 'Already has plenty of', value: 'Tote bags', plenty: true },
      ],
    },
  ],

  // Things the classroom could use. Shown under "Helping Out". [] to hide.
  classWishlist: ['Washable markers', 'Picture books', 'Play-Doh and tools', 'Stickers', 'Sensory bin fillers'],

  // ── CLASS PARENT ─────────────────────────────────────────────────────
  classParent: {
    name: 'Jordan',               // '' to hide
    email: 'classparent@example.com', // shows an "Email Jordan" button; '' to hide
    note: "Volunteer opportunities, party plans and gift collections will come straight to your inbox from me. Questions anytime — just reply or email!",
  },

  // ── LINKS ────────────────────────────────────────────────────────────
  // Buttons in the header + cards under "Helping Out". Leave url '' to hide.
  links: [
    { icon: '🎁', label: 'Classroom Wishlist', url: 'https://example.com/wishlist', note: 'Supplies and treats the class could use.' },
    { icon: '💸', label: 'Class Venmo', url: '', note: 'For class gifts and parties.' },
  ],

  // ── THEME ────────────────────────────────────────────────────────────
  // preset: 'groovy' | 'seashells' | 'ocean' | 'garden' | 'rainbow' | 'space'
  // overrides: change any color, e.g. { colors: { primary: '#2E86AB' } }
  // (all theme keys are in themes.js)
  theme: {
    preset: 'groovy',
    overrides: {},
  },

  // ── CALENDAR ─────────────────────────────────────────────────────────
  calendar: {
    // Where school dates come from:
    //   'manual'    → just the `events` list below (simplest; works for any school)
    //   'ics'       → a public iCal/.ics feed (Google Calendar, Outlook, most school sites)
    //   'finalsite' → a school website built on Finalsite (see README)
    //   'none'      → hide the school calendar section
    // With 'ics' or 'finalsite', the page re-checks the school every few hours and
    // uses `events` below as a backup if the school's site can't be reached.
    source: 'manual',

    ics: {
      url: '', // e.g. 'https://calendar.google.com/calendar/ical/…/public/basic.ics'
    },
    // Your school's time zone (used to show event times from iCal feeds correctly).
    timeZone: 'America/New_York',
    finalsite: {
      origin: '',      // e.g. 'https://www.yourschool.org'
      elementId: null, // number — see README "Finalsite schools"
      pageId: null,    // number
    },

    // Months the calendar covers (YYYY-MM).
    firstMonth: '2026-08',
    lastMonth: '2027-06',

    // How many days ahead the "This week" banner looks.
    bannerDays: 7,

    // ── Filtering (most useful for live school-wide calendars) ──
    // Patterns are case-insensitive (regular expressions).
    // 1) Anything matching `show` is always shown.  2) Otherwise anything matching
    // `hide` is hidden.  3) Everything else is shown.
    // Families can tick "Show all school events" to see everything.
    show: ['Pre-?K', 'Lower School', 'Elementary', 'All School', 'School Closed', 'No School',
      'Early (Dismissal|Release)', 'Spirit', 'Picture Day', 'Family', 'Report Card', 'Conference'],
    hide: ['Varsity', '\\bJV\\b', 'Athletic', 'Football', 'Basketball', '\\bSAT\\b', '\\bACT\\b', 'AP Exam',
      'Exams', 'Upper School', 'Middle School', 'High School', 'Senior', 'Junior', 'College', 'Prom',
      'Graduation', 'Alumni', 'Board Meeting', 'Faculty Meeting'],
    // Titles that mean "no school" (shown with a "No school" tag).
    closedWhen: ['School Closed', 'No School', 'Holiday', 'Break$'],
    // Hide these on no-school days (e.g. a weekly spirit day that lands on a holiday).
    hideOnClosedDays: ['Spirit Day'],

    // ── Your dates ──
    // date: 'YYYY-MM-DD'. Optional: end (for multi-day), note, closed: true (no school).
    events: [
      { date: '2026-08-24', title: 'First Day of School' },
      { date: '2026-09-07', title: 'Labor Day', closed: true },
      { date: '2026-09-18', title: 'Picture Day', note: 'Smiles on!' },
      { date: '2026-10-09', title: 'Fall Festival', note: '4:00–6:00 PM on the playground' },
      { date: '2026-10-12', title: 'Teacher Workday', note: 'No school for students', closed: true },
      { date: '2026-10-21', title: 'Pajama Day', note: 'Comfy PJs + school shoes' },
      { date: '2026-10-23', title: 'Early Release', note: 'Dismissal at 12:00 PM' },
      { date: '2026-10-29', title: 'Parent-Teacher Conferences', note: 'Sign-up link coming by email' },
      { date: '2026-10-30', title: 'Book Character Parade', note: 'Dress as a favorite book character' },
      { date: '2026-11-11', title: 'Veterans Day', closed: true },
      { date: '2026-11-20', title: 'Early Release', note: 'Dismissal at 12:00 PM' },
      { date: '2026-11-23', end: '2026-11-27', title: 'Thanksgiving Break', closed: true },
      { date: '2026-12-11', title: 'Holiday Sing-Along', note: '9:30 AM in the gym' },
      { date: '2026-12-21', end: '2027-01-01', title: 'Winter Break', closed: true },
      { date: '2027-01-04', title: 'School Resumes' },
      { date: '2027-01-18', title: 'MLK Jr. Day', closed: true },
      { date: '2027-02-12', title: 'Valentine Exchange', note: 'Cards for every friend' },
      { date: '2027-02-15', title: "Presidents' Day", closed: true },
      { date: '2027-03-15', end: '2027-03-19', title: 'Spring Break', closed: true },
      { date: '2027-04-22', title: 'Earth Day Garden Planting' },
      { date: '2027-05-07', title: 'Teacher Appreciation Day' },
      { date: '2027-05-31', title: 'Memorial Day', closed: true },
      { date: '2027-06-04', title: 'Last Day of School', note: 'Early release' },
    ],

    // Weekly reminders (weekday: 0=Sun, 1=Mon … 5=Fri). Skipped on no-school days.
    // Used with 'manual', and as backup for live calendars.
    recurring: [
      { weekday: 5, title: 'Spirit Day Friday', note: 'Wear school colors', from: '2026-08-28', until: '2027-06-04' },
    ],
  },

  // Class-only dates (parties, field trips…). Always shown, mixed in with school dates.
  classEvents: [
    { date: '2026-10-30', title: 'Class Fall Party', note: '10:30 AM in the classroom' },
    { date: '2026-11-13', title: 'Field Trip: Pumpkin Patch', note: 'Permission slips due Nov 6' },
  ],
};
