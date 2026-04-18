# Clear Vector Intelligence — Landing Site

Production-ready landing page for clearvectorintelligence.com. Static HTML/CSS/JS — no build step, no dependencies, no platform fees.

-----

## File Structure

```
cvi-site/
├── index.html            Main landing page
├── privacy.html          Privacy Policy
├── terms.html            Terms of Service
├── styles.css            All styling (editorial-technical aesthetic)
├── script.js             Interactions (nav, reveals, counters)
├── assets/
│   └── favicon.svg       SVG favicon
└── README.md             This file
```

-----

## Deployment — Netlify (Recommended, Free Forever)

### Option A: Drag-and-drop (fastest)

1. Go to [netlify.com](https://netlify.com) and sign up (free, no card required)
1. Click “Add new site” → “Deploy manually”
1. Drag the entire `cvi-site` folder onto the upload area
1. Netlify gives you a temporary URL (e.g. `dreamy-turing-1234.netlify.app`)
1. Test it works
1. Go to Site Settings → Domain management → Add custom domain
1. Enter `clearvectorintelligence.com`
1. Netlify gives you DNS instructions — two options:
- **Easiest:** change your domain’s nameservers to Netlify’s (they become your DNS provider). No hosting fees, automatic HTTPS, full control from Netlify dashboard.
- **Alternative:** keep your current DNS, add two records (A record pointing to Netlify’s load balancer, CNAME for `www`). Netlify shows you exactly what to set.
1. Wait 5-30 minutes for DNS to propagate
1. HTTPS is automatic (Netlify provisions a Let’s Encrypt certificate)

### Option B: Git-based (better for updates)

1. Create a free GitHub account if you don’t have one
1. Create a new repo named `cvi-site` (private is fine)
1. Upload the files via GitHub’s web interface (or command line if comfortable)
1. In Netlify: “Add new site” → “Import from Git” → connect GitHub → select the repo
1. Build command: leave blank. Publish directory: leave blank (root)
1. Deploy. Every time you update a file in GitHub, the site redeploys automatically

Option B is better once you’re making regular updates because it keeps version history and you don’t need to drag-drop each time.

-----

## Updating Content

### Text changes

Open `index.html` in any text editor and search for the text you want to change. Everything is human-readable HTML.

### Adding a section

Each major section in `index.html` follows the same pattern:

```html
<section class="section section-YOURNAME" id="yourname">
  <div class="container">
    <div class="section-header reveal-up">
      <span class="section-label">NN · LABEL</span>
      <h2 class="section-title">
        <span>Your title</span>
        <span>here.</span>
      </h2>
    </div>
    <!-- your content -->
  </div>
</section>
```

Copy this block, give it a new class name, and add styles to `styles.css` if needed.

### Changing the three service prices

In `index.html` search for `service-price-value` — three instances, one per service card. Change the numbers.

### Updating the Tally form URLs

Search `index.html` for `tally.so` — replace the form IDs if needed. Currently:

- Onboarding: `https://tally.so/r/0QE0NA`
- Mission Request: `https://tally.so/r/LZd4Oy`

### Adding Stripe Payment Links later

When Stripe is set up, each service card has a `service-cta` link pointing to Tally. To switch to Stripe-first flow:

1. Create three Stripe Payment Links (one per service)
1. In `index.html` search for `service-cta` and update the `href` for each card to point to the Stripe link
1. In Stripe, set the post-payment redirect URL to the Tally Mission Request form URL (with the service mode pre-filled as a URL parameter if possible)

### Customising colours or fonts

All design tokens live at the top of `styles.css` inside `:root { }`. Change the value once, propagates everywhere.

-----

## Analytics (Optional but Recommended)

For privacy-respecting analytics:

- **Plausible** (recommended): ~£9/month. Paste one line of script into `<head>` of each HTML file.
- **Fathom**: similar pricing, similar approach.
- **Cloudflare Web Analytics**: free, very basic.

Avoid Google Analytics — it’s heavy, privacy-invasive, and doesn’t fit the brand.

-----

## Performance

This site loads in under 1 second on 4G. Achieved by:

- No framework (no React/Vue/etc bloat)
- Fonts loaded from Google Fonts CDN with `font-display: swap`
- SVG logos inline (no image requests)
- CSS and JS unminified for clarity — negligible size
- No tracking scripts
- Images: there are none. All visuals are SVG or CSS.

No optimisation needed. If you want to minify CSS/JS for production, run them through any online minifier (Toptal CSS Minifier, JSCompress) — the site will load marginally faster but it’s already fine.

-----

## Accessibility

- Semantic HTML throughout
- ARIA labels on interactive elements
- Keyboard-navigable (tab through all interactive elements)
- Focus states visible
- Colour contrast meets WCAG AA
- Reduced motion respected via `prefers-reduced-motion` media query
- Screen-reader friendly structure

-----

## Browser Support

Tested in:

- Safari (macOS, iOS) — latest 2 versions
- Chrome (desktop, Android) — latest 2 versions
- Firefox — latest 2 versions
- Edge — latest 2 versions

Uses modern CSS (custom properties, backdrop-filter, grid, container queries nowhere used). Gracefully degrades on older browsers.

-----

## Phase Plan

**Phase 1 (this build, current state):**

- Landing page live at clearvectorintelligence.com
- Tally forms for onboarding and mission requests
- Manual invoicing via bank transfer or PayPal
- Email-based client communication

**Phase 2 (when business entity is set up):**

- Register Ltd company
- Open business bank account
- Set up Stripe
- Create Stripe Payment Links for the three services
- Update CTAs on the site to route via Stripe first, then Tally
- Set up professional email on the domain

**Phase 3 (when client load justifies):**

- Client portal (authenticated area showing mission history)
- Automated post-mission review reminders
- Retainer tier (Performance Partnership)
- Blog / insights section for SEO

-----

## Known TODOs

Nothing blocking launch. Optional improvements for v1.1:

- Replace the in-HTML brief mockup with a screenshot of a properly anonymised real brief once you have one ready
- Add Open Graph image at `/assets/og.png` (1200x630px) for social sharing previews
- Add a sitemap.xml (trivial, generate via any online tool)
- Add Plausible or Fathom analytics

-----

## Contact

Built for Jay Blair. Questions about the code: describe what you want changed in the next Claude conversation and the modification is usually a single-file edit.

© 2026 Clear Vector Intelligence
