NORTHWINDS TRAVEL CO. — DEVELOPER UPLOAD PACKAGE
==================================================

PROJECT STRUCTURE
-----------------
After extracting this ZIP you should see exactly these files:

    Northwinds-Travel-Co-Website/
    ├── index.html         ← main page (HTML)
    ├── style.css          ← all site styling
    ├── app.js             ← navigation + interaction logic
    ├── assets/
    │   └── logo.jpg       ← NW monogram logo
    └── README.txt         ← this file

If any of those files appear missing, the ZIP did not finish downloading
or extracting fully — re-download and try again.

UPLOAD INSTRUCTIONS (Hostinger)
-------------------------------
1. Log into Hostinger → File Manager → public_html
2. Upload ALL of these to public_html (NOT the folder, just the contents):
       index.html
       style.css
       app.js
       assets/   (the entire folder including logo.jpg)
3. Visit your domain — site loads instantly.

The relative paths inside index.html are:
    href="style.css"
    src="app.js"
    src="assets/logo.jpg"

So `style.css`, `app.js`, and the `assets/` folder MUST sit next to
`index.html` in whichever directory you upload to.

PRE-LAUNCH CHECKLIST
--------------------
[ ] Replace placeholder phone `+10000000000` with real number.
[ ] Replace placeholder email `hello@northwindstravelco.com`.
[ ] Update WhatsApp link `https://wa.me/10000000000`.
[ ] Connect the inquiry form — currently mailto. Consider Formspree,
    Netlify Forms, or a CRM endpoint.
[ ] Add Google Analytics / Plausible snippet before `</head>`.
[ ] Set up custom domain DNS at Hostinger.
[ ] Add SPF / DKIM / DMARC DNS records for your email.

BRAND
-----
Forest green #0f3431, gold accents — luxury travel positioning. Logo:
gold/white "NW" monogram with plane and gold contrails on forest green.

POSITIONING
-----------
Northwinds is intentionally a STANDALONE travel brand. The site does NOT
publicly mention Legacy Care Africa, Uzazi, or Nyumbani.

EDITING
-------
Plain HTML, CSS, and JavaScript. No build step, no frameworks.
