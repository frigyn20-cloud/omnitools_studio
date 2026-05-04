# OmniTool Studio

OmniTool Studio is a public utility website with calculators, converters, quick tools, 25 focused SEO guide pages, blog articles, English/Spanish language support, and light/dark mode.

## Deploy on Vercel

Use these Vercel settings:

- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist/public`

The project includes `vercel.json` so clean URLs like `/discount-calculator` and `/blog/how-to-calculate-a-discount` work after deployment.

## Before going live

Open `DEPLOYMENT.md` and follow the full launch checklist. The most important steps are:

1. Confirm `client/public/sitemap.xml` and `client/public/robots.txt` use `https://omnitoolstudio.com`.
2. Confirm the Contact page lists `kirill.moiseev.prof@gmail.com`.
3. Deploy to Vercel.
4. Connect your custom domain.
5. Submit the sitemap to Google Search Console.
6. Test the 25 SEO pages listed in `sitemap.xml`.

## Local test

```bash
npm install
npm run build
npm start
```
