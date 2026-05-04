# OmniTool Studio: Vercel Launch Guide

This project is ready to upload to GitHub and deploy on Vercel as a static React/Vite website.

## What is included

- Multi-tool website with calculators, converters, and utilities.
- 25 focused SEO landing pages with the tool near the top, instructions, examples, and equations.
- Blog articles, About, Contact, Privacy, and Terms pages.
- English and Spanish interface/content switcher.
- Light mode by default, with optional dark mode.
- `robots.txt`, `sitemap.xml`, and Vercel rewrite settings.
- No ad blocks and no AdSense code.

## Production details already set

- Website domain in sitemap and robots: `https://omnitoolstudio.com`
- Public contact email: `kirill.moiseev.prof@gmail.com`

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
9. Test these pages:
   - `/`
   - `/tools`
   - `/percent-off-calculator`
   - `/50-percent-off-calculator`
   - `/age-calculator`
   - `/hourly-to-salary-calculator`
   - `/mb-to-gb-converter`
   - `/blog/how-to-calculate-a-discount`
   - `/sitemap.xml`
   - `/robots.txt`

## Custom domain steps

1. In Vercel, open your project.
2. Go to `Settings`.
3. Click `Domains`.
4. Add `omnitoolstudio.com`.
5. Vercel will show DNS records to add at your domain registrar.
6. Copy those DNS records exactly.
7. Wait until Vercel shows the domain as valid.

## Google Search Console setup

1. Go to Google Search Console.
2. Add `omnitoolstudio.com` as a domain property.
3. Verify ownership using the DNS method Google provides.
4. Submit this sitemap:

```txt
https://omnitoolstudio.com/sitemap.xml
```

5. Use URL inspection for the homepage and several new SEO pages, then request indexing.

## Local test commands

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
- `sitemap.xml` uses `https://omnitoolstudio.com`.
- `robots.txt` points to `https://omnitoolstudio.com/sitemap.xml`.
- Contact page lists `kirill.moiseev.prof@gmail.com`.
- Privacy and Terms pages are accessible.
- All 25 SEO pages load.
- Google Search Console is connected.
- Sitemap is submitted.
- Site pages load on mobile and desktop.
