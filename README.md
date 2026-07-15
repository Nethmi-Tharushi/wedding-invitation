# Elegant Wedding Invitation — React + Vite

A complete mobile-first wedding invitation website designed for easy Vercel deployment.

## Project structure

- `src/App.jsx` — complete page layout and behavior
- `src/invitation.js` — edit all wedding information here
- `src/components/` — countdown, floral decorations and petal animation
- `src/styles.css` — responsive design and animation styling
- `public/` — place photos, music and other static files here
- `vercel.json` — Vercel SPA routing configuration

## Customize the invitation

Open `src/invitation.js` and change:

- Couple names and initials
- Wedding date and display date
- Ceremony and reception times
- Venue and Google Maps URL
- WhatsApp RSVP number
- Dress code and schedule

## Add the couple photo

1. Add your image as `public/couple.jpg`.
2. In `src/App.jsx`, replace the `portrait-placeholder` block with:

```jsx
<img className="portrait-placeholder" src="/couple.jpg" alt="The wedding couple" />
```

You can also use `.png` or `.webp`; update the filename accordingly.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Production build

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push the project to GitHub or upload it directly to Vercel.
2. Choose the **Vite** framework preset.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Deploy.

The project does not require a backend or database. WhatsApp RSVP opens a pre-filled message, and Add to Calendar generates an `.ics` file in the browser.
