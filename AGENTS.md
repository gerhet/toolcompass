# ToolCompass – Projektkontext

## Deployment
- **Plattform:** Vercel (vercel.json)
- **Build:** `npm run build` (minifiziert styles.css via clean-css)
- **Domain:** toolcompass.org
- **Git:** https://github.com/gerhet/toolcompass.git

## Stack
- **Statisches HTML/CSS/JS** – kein Framework, kein Build-Tool außer CSS-Minifier
- **Analytics:** Google Analytics 4 (G-4JVNJKQYCG) – via consent.js, DSGVO-konform
- **Werbung:** Google AdSense (ca-pub-1934902732899980) – via consent.js
- **Icons:** Lucide Icons via SVG-Sprite (`/assets/icons/lucide-sprite.svg`)
- **Styles:** `/styles.css` (einzige externe CSS-Datei)
- **Consent-Manager:** `/assets/js/consent.js` – Google Consent Mode v2

## Seitenstruktur
- **Tool-Seiten:** 25+ Ordner mit jeweils eigener `index.html` (z.B. `/bmi-rechner/`, `/spritrechner/`)
- **Kategorie-Seiten:** `/baustelle-projekt/`, `/buero-verwaltung/`, `/kunden-marketing/`, `/tools-ausruestung/`
- **Blog:** `/blog/` – Guide-Artikel zu jedem Tool
- **Guides:** `/guides/` – Ratgeber-Seiten (4 Stück)
- **Specials:** `/about.html`, `/impressum/`, `/datenschutz/`, `/404.html`

## Wichtige Konventionen
- Jede Seite hat `<h1>` mit `<span>` für Branding und `<span class="h1-sub">` für Subtitle
- Security-Header via Vercel: X-Content-Type-Options, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy
- Breadcrumb-JSON-LD auf allen Seiten (Schema.org BreadcrumbList)
- Blog-Links auf Tool-Seiten als `.related-content` vor FAQ-Bereich
- Interne Verlinkung: jede Tool-Seite hat `<nav>` mit Link zur Startseite und ggf. zur Kategorie

## Offene Punkte
1. **CSP (Content Security Policy)** fehlt – riskant wegen AdSense-Drittanbietern
2. **HTML-Minifizierung** nicht umgesetzt
3. **consent.js:** Google CMP (TCF) könnte für AdSense langfristig nötig werden
4. Blog-Seiten haben keine Breadcrumb-JSON-LD (nur Tool-Seiten & Guides)
5. Performance-Optimierung (Bilder, Lazy-Loading) nicht geprüft

## Letzte Änderungen (28b3cd6)
- H1-Überschriften auf >30 Zeichen verlängert (36 Seiten)
- H1-Subtitles an Fließtext angeglichen (17 Seiten)
- Breadcrumb-JSON-LD auf allen ~40 Seiten
- Kategorie-Navi auf 13 Tool-Seiten ergänzt
- Blog-Guide-Links auf 26 Tool-Seiten
- Security-Header in vercel.json
- CSS-Minifizierung (-22%), Build-Pipeline
- 404-Seite erstellt
