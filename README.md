# AI Meeting Notes Summarizer

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

To start the development server:

npm run dev

or
yarn dev

or
pnpm dev

or
bun dev

text

Open [http://localhost:3000](http://localhost:3000) in your browser to access the app.

You can begin customization by editing `app/page.tsx`. Your changes will automatically reflect in the browser.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) for automatic font optimization.

---

## Features

- Upload meeting transcripts (`.txt`, `.pdf`, `.docx`)
- Preview extracted transcript text
- Input a custom instruction or prompt for AI summarization
- Generate a structured summary using Groq or OpenAI models
- Edit the AI-generated summary before sharing
- Email the summary directly from the app with a built-in form
- Modern, responsive UI for a streamlined workflow

---

## Folder Structure

app/ # App Router files (UI, page.tsx, route handlers)
pages/api/upload.ts # Classic Node.js/Express API route for file uploads (PDF, DOCX, TXT parsing)

text

> **Note:** PDF/DOCX upload and parsing is only supported via `pages/api/upload.ts`.

---

## Environment Variables

Create a `.env.local` file:

GROQ_API_KEY=your_groq_api_key
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

text
- Get a Groq key at [Groq Console](https://console.groq.com/keys)
- Use Ethereal or Gmail SMTP credentials for email (see docs)

---

## Learn More

To learn more about Next.js, check out:

- [Next.js Documentation](https://nextjs.org/docs) — all features and APIs
- [Learn Next.js](https://nextjs.org/learn) — interactive tutorial
- [Next.js GitHub](https://github.com/vercel/next.js) — contributions and feedback welcome!

---

## Deploy on Vercel

The fastest way to deploy your Next.js app is on [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

See [deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---