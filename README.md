# Portfolio

Personal portfolio built with Next.js (App Router), TypeScript, Tailwind CSS and Framer Motion. Monochrome, system-blueprint visual language with a scroll-driven hero and an auto-playing project carousel.

## Structure

- `/` — hero, experience timeline, architecture stage, project carousel, contact
- `/projects/[slug]` — individual case study pages
- `/about`, `/resume`, `/contact` — supporting pages
- `/api/contact` — contact form submission handler (Resend)

Project content lives in `src/data/portfolio.ts`. Project showcase videos live in `public/video/`; their unconverted source PNG sequences (not shipped to the deployed build) live in `assets/project-sequences/`.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

The contact form (`/api/contact`) sends mail via [Resend](https://resend.com). Set these in `.env.local`:

```bash
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
NEXT_PUBLIC_SITE_URL=  # optional, defaults to http://localhost:3000
```

## Scripts

```bash
npm run dev     # start the dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```
