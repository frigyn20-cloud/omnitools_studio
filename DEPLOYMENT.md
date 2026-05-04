# OmniTool Studio: Vercel Launch and Monetization Guide

This project is ready to upload to GitHub and deploy on Vercel as a static React/Vite website. The Perplexity embedded preview can fail because it serves the site through a special proxy path, but the project is configured for a normal public domain on Vercel.

## What is included

- Multi-tool website with calculators, converters, and utilities.
- Separate public pages for tools, SEO guide pages, blog articles, About, Contact, Privacy, and Terms.
- English and Spanish interface/content switcher.
- Light mode by default, with optional dark mode.
- Google AdSense display ad units using publisher ID `ca-pub-8213468056702327`.
- `ads.txt`, `robots.txt`, `sitemap.xml`, and Vercel rewrite settings.

## Files you should edit before launch

### Replace the domain placeholder

After you know your final domain, replace every `https://your-domain.com` inside:

- `client/public/sitemap.xml`
- `client/public/robots.txt`

Example:

```txt
https://your-domain.com
```

becomes:

```txt
https://omnitoolstudio.com
```

Do not add a slash at the end when replacing the base domain.

### Add your public contact email

Open `client/src/App.tsx` and search for:

```txt
Before launching on your own domain
```

Replace that Contact page paragraph with your public support email. Use an email you are comfortable putting online, for example:

```txt
For questions, feedback, or business inquiries, contact: hello@your-domain.com
```

### AdSense code is already installed

The AdSense loader script is already in `client/index.html`, the display ad units are already in the shared `AdSlot` component in `client/src/App.tsx`, and `client/public/ads.txt` already contains:

```txt
google.com, pub-8213468056702327, DIRECT, f08c47fec0942fa0
```

## GitHub upload steps

1. Go to GitHub and sign in.
2. Click the `+` button in the top-right corner.
3. Click `New repository`.
4. Repository name: `omnitool-studio`.
5. Set it to `Public`.
6. Do not add a README, `.gitignore`, or license on GitHub because this project already has files.
7. Click `Create repository`.
8. On the new repository page, click `uploading an existing file`.
9. Unzip this project ZIP on your computer first.
10. Open the unzipped `omnitool-studio` folder.
11. Drag all files and folders from inside `omnitool-studio` into GitHub.
12. Scroll down and click `Commit changes`.

Important: upload the contents inside the folder, not the ZIP file itself.

## Vercel deployment steps

1. Go to Vercel and sign in with GitHub.
2. Click `Add New`.
3. Click `Project`.
4. Select your `omnitool-studio` GitHub repository.
5. Click `Import`.
6. Use these project settings:
   - Framework Preset: `Other` or `Vite`
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
7. Click `Deploy`.
8. Wait for deployment to finish.
9. Click the Vercel URL and test:
   - Home page loads.
   - `/tools` loads.
   - `/discount-calculator` loads.
   - `/blog/how-to-calculate-a-discount` loads.
   - Language selector works.
   - Dark mode toggle works.

## Custom domain steps

1. Buy a domain from Namecheap, GoDaddy, Google Domains/Squarespace, Cloudflare, or another registrar.
2. In Vercel, open your project.
3. Go to `Settings`.
4. Click `Domains`.
5. Add your domain, for example `omnitoolstudio.com`.
6. Vercel will show DNS records to add at your domain registrar.
7. Copy those DNS records exactly.
8. Wait until Vercel shows the domain as valid.
9. After the domain works, update `sitemap.xml` and `robots.txt` with your real domain, commit the changes to GitHub, and let Vercel redeploy.

## Google Search Console setup

1. Go to Google Search Console.
2. Add your domain as a property.
3. Verify ownership using the DNS method Google provides.
4. Submit your sitemap:

```txt
https://your-real-domain.com/sitemap.xml
```

5. Use URL inspection for your homepage and request indexing.

## Google AdSense setup

1. Make sure the site is live on your own domain.
2. Make sure About, Contact, Privacy, and Terms pages are visible.
3. Make sure the Contact page has a real public email.
4. Go to Google AdSense.
5. Add your website domain.
6. Confirm that AdSense detects the script already installed in `client/index.html`.
7. Confirm that `https://your-real-domain.com/ads.txt` opens and shows your `pub-8213468056702327` line.
8. Submit the site for review.

Do not expect ads to show immediately. Google must review and approve the website first.

## Local test commands

If you want to test on your computer:

```bash
npm install
npm run build
npm start
```

The production files are created in:

```txt
dist/public
```

## Final pre-launch checklist

- Domain connected to Vercel.
- `sitemap.xml` uses your real domain.
- `robots.txt` points to your real sitemap.
- Contact page has a public email.
- Privacy and Terms pages are accessible.
- Google Search Console is connected.
- Sitemap is submitted.
- AdSense script is present in `client/index.html`.
- `ads.txt` shows `pub-8213468056702327`.
- Site pages load on mobile and desktop.
