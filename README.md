# OmniTool Studio

OmniTool Studio is a public utility website with calculators, converters, quick tools, SEO guide pages, blog articles, English/Spanish language support, light/dark mode, and installed Google AdSense display ad units.

## Deploy on Vercel

Use these Vercel settings:

- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist/public`

The project includes `vercel.json` so clean URLs like `/discount-calculator` and `/blog/how-to-calculate-a-discount` work after deployment.

## Before going live

Open `DEPLOYMENT.md` and follow the full launch checklist. The most important steps are:

1. Replace `https://your-domain.com` in `client/public/sitemap.xml` and `client/public/robots.txt`.
2. Add your public contact email on the Contact page.
3. Deploy to Vercel.
4. Connect your custom domain.
5. Submit the sitemap to Google Search Console.
6. Apply to Google AdSense.
7. Confirm `ads.txt` is visible at `/ads.txt` and shows `pub-8213468056702327`.

## Local test

```bash
npm install
npm run build
npm start
```
