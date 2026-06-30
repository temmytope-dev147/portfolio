# Quadri Temmytope — Portfolio

Personal portfolio website: a single Node/Express app that serves the static
site (HTML/CSS/JS) and a small `/api/send` endpoint that powers the contact
form.

## Project structure

```
.
├── index.html        # Main page
├── style.css         # Styles
├── main.js           # Front-end interactivity (typed text, testimonials, contact form, etc.)
├── server.js         # Express server — serves static files + /api/send
├── package.json
├── render.yaml        # Render deploy config (optional, see below)
├── .env.example       # Copy to .env for local SMTP testing
├── Images/            # Site images
└── NuruNewCVR.pdf     # Downloadable CV
```

## Running locally

```bash
npm install
npm start
```

Then open http://localhost:5000.

To test the contact form sending real emails, copy `.env.example` to `.env`
and fill in SMTP credentials (e.g. a Gmail address + an "App Password"),
then restart the server. Without SMTP configured, the form will still load
fine but will return a friendly "email is not configured yet" message.

## Pushing to GitHub

```bash
git init
git add .
git commit -m "Initial commit: portfolio site"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

(`.env` is already excluded via `.gitignore`, so your real credentials never
get committed — only `.env.example` is tracked.)

## Deploying on Render

1. Push this repo to GitHub (see above).
2. In the Render dashboard, click **New +** → **Web Service**, and connect
   your GitHub repo.
3. Render should auto-detect the included `render.yaml`. If asked manually,
   use:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Runtime:** Node
4. Add the following Environment Variables in the Render dashboard (under
   the service's **Environment** tab) so the contact form can send emails:
   - `SMTP_HOST` — e.g. `smtp.gmail.com`
   - `SMTP_PORT` — e.g. `587`
   - `SMTP_SECURE` — `false` (use `true` only if your provider requires port 465)
   - `SMTP_USER` — your sending email address
   - `SMTP_PASS` — your SMTP password / app password
   - `EMAIL_TO` — the address you want messages delivered to (defaults to qtemmytope@gmail.com)
5. Deploy. Render will give you a live URL like
   `https://quadri-portfolio.onrender.com`.

Render automatically sets `PORT` for you — `server.js` already reads
`process.env.PORT`, so no changes are needed there.

## Notes / things you may want to personalize before going live

- Update the GitHub and Instagram links in `index.html` (currently `#`
  placeholders) to your real profile URLs.
- The `og:url` meta tag points to a GitHub Pages URL — update it to your
  final Render (or custom) domain once deployed.
- Testimonial avatars currently show initials (no client photos were
  included in the upload) — drop real photos into `Images/` and swap the
  `.t-author-avatar` divs back to `<img>` tags if you'd like.
