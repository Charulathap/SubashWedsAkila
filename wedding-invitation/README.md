# Subash & Akila — Wedding Invitation

A single-page, animated wedding invitation site (envelope intro, countdown,
gallery, timeline, family tree, RSVP-free contact/share buttons).

## 📁 Project structure

```
wedding-invitation/
├── index.html              ← the page itself (structure/content only)
├── assets/
│   ├── css/
│   │   └── style.css       ← ALL styling (colors, animations, layout)
│   ├── js/
│   │   └── script.js       ← ALL behavior (envelope open, countdown, gallery, sparkles…)
│   └── images/             ← put your real photos here (see "Adding your photos")
├── vercel.json              ← tells Vercel this is a static site
└── README.md                ← this file
```

**Do not rename `assets/css/style.css` or `assets/js/script.js`** (or the
folders they sit in) — `index.html` links to them by that exact path. If you
do rename something, update the matching `<link>`/`<script>` tag in
`index.html`.

## ▶️ Run it locally

You can't just double-click `index.html` in some browsers because of how
fonts/audio load — use a tiny local server instead:

**Option A — Python (already on most machines):**
```bash
cd wedding-invitation
python3 -m http.server 8000
```
Then open http://localhost:8000

**Option B — Node:**
```bash
cd wedding-invitation
npx serve .
```

## ☁️ Deploy to Vercel (get a shareable link)

**Option A — Vercel CLI:**
```bash
npm i -g vercel
cd wedding-invitation
vercel
```
Follow the prompts (link/create a project). Vercel auto-detects this as a
static site because of `vercel.json` — no build step needed. It gives you a
`https://your-project.vercel.app` link instantly, and a fresh one every time
you run `vercel --prod`.

**Option B — Vercel dashboard (no CLI):**
1. Push this folder to a GitHub repo.
2. Go to https://vercel.com/new and import that repo.
3. Framework Preset: **Other**. Build command: *(leave empty)*. Output
   directory: `./`.
4. Click Deploy — you'll get a live link to share with guests.

## 🖼️ Adding your real photos

1. Drop your photo files into `assets/images/` (e.g. `couple-1.jpg`,
   `couple-2.jpg`…).
2. In `index.html`, find the `<div class="gallery-track">` block and change
   each `<img src="https://images.unsplash.com/...">` to
   `<img src="assets/images/couple-1.jpg">` etc.

## ✏️ Editing details later (names, date, numbers, etc.)

Everything text-based (names, date, venue, phone numbers, WhatsApp
messages) lives directly in `index.html` as plain text/links — search for
the value you want to change (e.g. `8098440756`) and update it. No rebuild
step is needed; just save and refresh.

## ⚠️ Keeping the style intact

- Never delete the `<link rel="stylesheet" href="assets/css/style.css">` tag
  or the `<script src="assets/js/script.js"></script>` tag in `index.html`.
- Keep `style.css` and `script.js` inside `assets/css/` and `assets/js/`
  respectively — the paths are relative.
- The Google Fonts `<link>` tags in `<head>` must stay for the typography
  (Cormorant Garamond / Great Vibes / Marcellus) to load.
