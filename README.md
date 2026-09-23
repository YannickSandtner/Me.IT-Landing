# Intellectual Twin in Insurance — Landing Page

A bilingual (EN/DE), dependency-free landing page presenting human-governed
Intellectual Twins for the insurance industry. The page is the original repo
site with two intentional changes:

1. The former client logos are removed — the hero lockup now reads
   "Me.IDs · For Insurance".
2. The former client use-case section is replaced by proposed use cases for
   the three lines of business — composite (property, motor, liability),
   life (incl. pension and disability) and health — plus cross-line topics
   (succession & onboarding, leadership knowledge).

## Structure

```
├── index.html                  # Single-page site (data-en/data-de localization)
├── styles.css                  # All styling, responsive
├── script.js                   # Language switch, form success handling
├── assets/                     # Logos, portraits, og image, QR code
├── staticwebapp.config.json    # Azure Static Web Apps fallback config
├── .nojekyll                   # For GitHub Pages
├── .github/workflows/          # Deployment workflows (from the source archive)
└── tests/validate.cjs          # Static validation script
```

## Page sections

1. Nutzenversprechen (hero with Jenga visual and lockup)
2. Die demografische Herausforderung
3. Funktionsweise / Vom Wissen zu Skills (Actor Twin, Compound Knowledge Fabric, Agentic Butler) with governance box
4. Vorgeschlagene Use Cases für die Versicherung — one card per line of business (Komposit, Leben, Kranken, Übergreifend)
5. Vorgehensmodell (proposed 90-day pilot)
6. Kontakt (FormSubmit form)

## Local validation

```
node tests/validate.cjs
```

Checks document structure, EN/DE attribute pairing, the five sections, the
four use-case cards, the generic hero lockup, absence of former client-brand
references, and asset availability (binaries warn only).

## Localization

Text pairs live on the elements as `data-en` / `data-de`. `script.js` applies
the active language, remembers the choice in `localStorage` and falls back to
the browser language.

## Assets

Binary assets (portraits, og image, QR code, Jenga photo) are copied from the
original source archive. The former client logos (`signal-iduna-logo.png`,
`signal-iduna-mark.png`) are intentionally no longer referenced and can be
omitted when copying assets from the source archive.

## Deployment

Azure Static Web Apps (`.github/workflows/azure-static-web-apps.yml`) and
GitHub Pages (`.github/workflows/pages.yml`) workflows are taken from the
source archive unchanged.
