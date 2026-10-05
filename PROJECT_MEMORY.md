# Project Memory: FabFashion B2B Website

## 1. Project Overview & Architecture
- **Repository**: FabFashion Website (Static HTML5/CSS3/Vanilla JS + Vercel Deployment)
- **Production URL**: https://www.fabfashionfabrics.com
- **Design System**: Cormorant Garamond & Montserrat, luxury textile theme with gold accents (#C9A84C, #7A5C17), cream background (#FDFAF5), and dark charcoal (#1A1410).
- **Target Metrics**: 95–100 Google PageSpeed Insights, WCAG 2.2 AA accessibility, DPDP Act 2023 / GDPR compliance.

## 2. Core File Index
- index.html: Main landing showroom with hero, fabric catalog preview, stats, factory infrastructure, contact form, newsletter.
- collections.html: Full filterable fabric catalog (Cotton, Blends, Linen, Custom).
- about.html: Heritage, mission, weaving craftsmanship story.
- whyus.html: Competitive advantages, export capabilities, quality controls.
- infrastructure.html: Factory machinery, spinning, weaving, testing facilities.
- capabilities.html: Mill capacity, custom weave development specifications.
- contact.html: Inquiries form, contact details, Google Map embed.
- faq.html: Fabric trade, sampling, MOQ, export FAQ accordion.
- privacy.html: DPDP Act 2023 / GDPR compliant privacy policy with Grievance Officer details.
- terms.html: B2B commercial terms, 7-day inspection/replacement policy, Mumbai jurisdiction.
- 404.html: Custom luxury error page with direct catalog recovery links and 4-column footer.
- admin.html: Internal dashboard for managing inquiries, subscriber lists, and collections.
- config.js: Supabase & environment configuration endpoint.
- style.css / style.min.css: Core stylesheet & minified bundle.
- app.js / app.min.js: Client interactivity, modal handlers, contact submission, cookie consent, admin auth.
- vercel.json: Edge routing, CSP, HSTS, security headers, form API proxies.

## 3. Offices & Locations
- Corporate & Sales Office (Mumbai): Office No 402, Ajmera Midtown, Popatwadi Corner, Kalbadevi Road, Mumbai — 400002.
- Main Office (Ichalkaranji): 13/167/06 Rajmahal, Awade Nagar, Ichalkaranji, Kolhapur, Maharashtra, India — 416115.

## 4. Chronological Change Log
- Session 1:
  - Created legal suite (privacy.html, terms.html, 404.html).
  - Implemented DPDP Act 2023 compliance, Cookie consent banner, and Grievance Officer contacts.
  - Replaced plain-text admin password with Web Crypto SHA-256 salted hashing.
  - Replaced legacy unthrottled intervals with IntersectionObserver & requestAnimationFrame.
  - Added security headers (HSTS, CSP, X-Frame-Options, nosniff) in vercel.json.
  - Added second address: Main Office (Ichalkaranji) across all pages.
- Session 2:
  - Fixed desktop navigation links breaking into 2 lines (white-space: nowrap !important;).
  - Restored clean 6 desktop navigation links (Home, Our Fabrics, About Us, Why Us, Infrastructure, Contact Us).
  - Fixed 404 footer 4-column horizontal grid (.container .footer-grid).
  - Trimmed transparent padding from images/logo.png.
  - Fixed admin login card and dashboard sidebar logo horizontal stretching bug in style.css and admin.html.
  - Recompiled style.min.css and bumped cache-buster to ?v=14.
- Session 3:
  - Added Supabase URL and anon key into config.js with public client key security note.
  - Disabled contact form submit buttons by default on homepage (index.html) and contact page (contact.html) until consent checkbox is checked.
  - Added event listener on consent checkbox to toggle submit button disabled state dynamically.
  - Upgraded sendEnquiryEmail in app.js with a direct FormSubmit fallback if running outside Vercel proxy.
  - Minified app.js into app.min.js via Terser and bumped cache-buster version to ?v=15 across all HTML files.
- Session 4:
  - Completed comprehensive 21-Phase Technical SEO & Performance Optimization without altering visual layout or adding new pages.
  - Phase 1 Crawler Visibility: Embedded full static HTML fallback for fabric cards on collections.html and homepage gallery; updated live counter HTML so true verified statistics (50+, 60K+, 42+, 15L+) exist in initial response before JS execution.
  - Phase 2 & 3: Standardized exact titles & meta descriptions across all 6 core pages (/index.html, /collections.html, /about.html, /whyus.html, /infrastructure.html, /contact.html).
  - Phase 4 & 5: Optimized <h1> (exact single H1 per page) and H2/H3 semantic structure across all pages.
  - Phase 6-10: Optimized contextual B2B keywords, fabric cards attributes (Composition, GSM, Construction, Application), descriptive ALT text, and JSON-LD structured data (Organization, ManufacturingBusiness, LocalBusiness, ItemList/Product, BreadcrumbList).
  - Phase 11-14: Cleaned robots.txt, updated sitemap.xml to match canonical URLs exactly, verified self-referencing canonical tags and Open Graph/Twitter metadata.
  - Recompiled app.min.js & style.min.css with cache-buster version ?v=16 across all HTML files.
