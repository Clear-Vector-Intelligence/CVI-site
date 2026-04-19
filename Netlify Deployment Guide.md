# CVI Site — Netlify Deployment Guide

Complete walkthrough for deploying `cvi-site` from GitHub to Netlify on iPad. This guide takes you from “no Netlify account” to “live site at clearvectorintelligence.com” in roughly 45–60 minutes.

You can pause at any point. The phases are deliberately ordered so you can safely stop after Phase 2 (live at a Netlify URL) and do Phase 3 (custom domain) whenever you’re ready.

-----

## How Netlify’s preview system works

Before you start, understand the workflow you’re setting up. It changes how you’ll think about edits forever.

**Every time you commit a change on GitHub, Netlify does two things:**

1. **Production build** — rebuilds and publishes the live site at your production URL
1. **Deploy preview** — creates a temporary “preview” URL for that specific change so you can inspect it

**There’s no separate “publish” button.** A commit to the `main` branch goes live automatically. But you can work around this in two ways:

- **Option A (recommended for you):** Use GitHub branches. Make changes on a branch like `preview`, get a preview URL, test it, then merge to `main` to go live.
- **Option B (simpler but less safe):** Commit straight to `main`. Your changes go live immediately — no preview.

For routine small changes (fixing a typo, updating a price), Option B is fine. For larger changes (new section, layout redesign), Option A gives you a safety net.

I’ll show you Option B first (simpler), then explain Option A at the end.

-----

## Prerequisites checklist

Before starting, confirm you have:

- [ ] GitHub account with `cvi-site` repo under `Clear-Vector-Intelligence` organisation
- [ ] Repo is **public** (you made this change earlier)
- [ ] All website files uploaded: `index.html`, `privacy.html`, `terms.html`, `styles.css`, `script.js`, `README.md`, plus `assets/favicon.svg` and `assets/logo-email.png`
- [ ] Access to Cloudflare where your domain’s DNS is managed
- [ ] Operator email (`operations@clearvectorintelligence.com`) accessible for verification emails

-----

## Phase 1 — Create Netlify account (5 minutes)

1. On your iPad, open Safari and go to **netlify.com**
1. Tap **“Sign up”** (top-right)
1. You’ll see several sign-up options. Choose **“Sign up with GitHub”** — this is the smoothest path because it auto-connects your GitHub account for deployments later.
1. You’ll be redirected to GitHub. It’ll ask if you want to authorise Netlify. Tap **“Authorize Netlify”**.
1. GitHub bounces you back to Netlify. It may ask a few setup questions:
- **“What kind of work do you do?”** → “Solo developer” or “Founder” (doesn’t matter, just continue)
- **“What are you interested in building?”** → “Static sites” or similar
1. You land on the Netlify dashboard. Account created.

**Important:** The email Netlify uses is whatever your GitHub account uses. If you used your personal email for GitHub, that’s your Netlify login. You can add additional emails later under Settings.

-----

## Phase 2 — Connect GitHub repo and deploy (10 minutes)

Now connect the repo so Netlify can deploy it.

1. On the Netlify dashboard, look for a button like **“Add new site”** or **“Import an existing project”** — tap it.
1. A menu appears. Choose **“Import from Git”** (not “Deploy manually”).
1. Netlify asks which Git provider. Tap **“Deploy with GitHub”**.
1. You may need to authorise Netlify to access your GitHub account (second time, because the first was for login only — this second one is for repo access). Tap **“Authorize”** again.
1. GitHub presents a page asking which repositories Netlify can access. Two options:
- **“All repositories”** — Netlify can see every repo you own
- **“Only select repositories”** — choose specific ones
   
   Choose **“Only select repositories”** for safety, then scroll down and select **`Clear-Vector-Intelligence/cvi-site`**. Tap **Save/Install**.
1. Back in Netlify, you’ll now see `cvi-site` in the list. Tap it.
1. Netlify shows a “Site configuration” screen with these fields:
- **Branch to deploy:** `main` (this should auto-populate correctly)
- **Base directory:** leave blank
- **Build command:** leave blank (it’s a static site — no build step)
- **Publish directory:** leave blank (Netlify will use the repo root)
- **Functions directory:** leave blank
   
   All defaults are correct for your site.
1. Tap **“Deploy site”** (or similar button at the bottom).
1. Netlify shows a “Deploying” screen with a progress log. You’ll see lines like:
- “Building…”
- “Deploying…”
- “Site is live ✨”
   
   This takes about 30–60 seconds.
1. When it finishes, Netlify gives you a randomly generated URL like `https://luminous-unicorn-abc123.netlify.app`. **Tap the URL** — your CVI site should load.

**Congratulations — the site is live.** Before moving on, do a 5-minute check:

- Load the site in Safari. Does everything render correctly?
- Tap the privacy and terms links. Do those pages load?
- Check the logo, the hero section, the service cards
- Scroll to the footer, check it looks right
- Try it on different screen sizes if you can (rotate iPad to landscape)

If anything looks broken, the cause is almost certainly a file missing from GitHub or a typo in a path. Check the GitHub repo for completeness before moving on.

-----

## Phase 3 — Rename the Netlify site (optional but recommended) (2 minutes)

The random name is ugly. Let’s give it a cleaner subdomain.

1. In Netlify, go to your site’s dashboard (tap the site name in the left sidebar).
1. Tap **“Site configuration”** or **“Site settings”** (may be under a gear icon).
1. Find the section **“Site name”** or **“Site details”**.
1. Tap **“Change site name”**.
1. Enter something like `cvi-clearvector` or `clearvectorintelligence`. Netlify will check availability.
1. Save.

Your site is now accessible at `https://cvi-clearvector.netlify.app` (or whatever you chose). This is a nicer backup URL — you can keep using it even after your custom domain is set up.

-----

## Phase 4 — Configure custom domain (15 minutes)

This is the part that requires a bit of focus because you’re working across two tools (Netlify + Cloudflare).

### Step 4a — Add domain in Netlify

1. On your Netlify site dashboard, find **“Domain management”** (usually in the left sidebar or under “Site configuration”).
1. Tap **“Add a domain”** or **“Add custom domain”**.
1. Enter: `clearvectorintelligence.com` (no `www`, no `https://`)
1. Netlify asks if you own the domain. Confirm yes.
1. Netlify adds the domain to your site. You’ll see a warning like “DNS not configured yet” — that’s expected. We’ll fix it in the next step.

### Step 4b — Get Netlify’s DNS values

Netlify will show you the DNS records you need to create. There are two main types of records:

**For the root domain (`clearvectorintelligence.com`):**

- Type: `A` record
- Points to one of Netlify’s load balancer IPs, typically `75.2.60.5` (Netlify will tell you the exact IP to use — use whatever Netlify shows you, not this value)

**For the www subdomain (`www.clearvectorintelligence.com`):**

- Type: `CNAME` record
- Points to your Netlify site URL (e.g. `cvi-clearvector.netlify.app`)

**Screenshot these values** or copy them carefully — you need the exact values Netlify gives you. Netlify occasionally changes the IPs, so don’t use the `75.2.60.5` value from this guide; use whatever Netlify currently shows.

### Step 4c — Configure DNS in Cloudflare

Now switch to your Cloudflare dashboard on iPad Safari.

1. Open **dash.cloudflare.com** and log in
1. Click on your `clearvectorintelligence.com` domain
1. Go to the **DNS** section (left sidebar)
1. You may have existing DNS records — if so, note what they currently point to. You’ll be replacing or updating them.

**Add/update the A record for the root domain:**

1. If there’s an existing `A` record for `@` (or `clearvectorintelligence.com`), tap **“Edit”**. If not, tap **“Add record”**.
1. Configure:
- **Type:** A
- **Name:** `@` (this represents the root domain)
- **IPv4 address:** the IP Netlify gave you
- **Proxy status:** **DNS only** (grey cloud, not orange)
1. Save

**Add/update the CNAME record for www:**

1. If there’s an existing `CNAME` record for `www`, tap **“Edit”**. If not, tap **“Add record”**.
1. Configure:
- **Type:** CNAME
- **Name:** `www`
- **Target:** your Netlify subdomain (e.g. `cvi-clearvector.netlify.app`)
- **Proxy status:** **DNS only** (grey cloud, not orange)
1. Save

**Why “DNS only” (grey cloud)?**

Cloudflare’s orange-cloud “proxied” mode routes traffic through Cloudflare’s CDN. This conflicts with Netlify’s CDN and SSL certificate issuance. Using grey cloud (DNS only) means Cloudflare just handles DNS resolution, and traffic goes directly to Netlify. This is the correct setup for Netlify-hosted sites.

If you want Cloudflare’s extra features (firewall, analytics) later, there are specific configurations to make it work with Netlify — but start with grey cloud. You can upgrade later.

### Step 4d — Wait for DNS propagation

DNS changes take time to propagate globally. Usually 5–15 minutes, sometimes up to 2 hours.

1. Back in Netlify, refresh the domain management page.
1. You should see the domain status change from “Waiting” to “DNS configured” (may need a few refreshes).
1. Once DNS is configured, Netlify automatically provisions a free SSL certificate from Let’s Encrypt. This takes another 5–15 minutes.

### Step 4e — Test the live domain

After 15–30 minutes:

1. Open Safari and go to `https://clearvectorintelligence.com`
1. Your CVI site should load
1. Check the SSL certificate — should be valid (green padlock)
1. Also test `https://www.clearvectorintelligence.com` — should also work (typically redirects to the non-www version)

**If it doesn’t work after 30 minutes:**

- Re-check your DNS records in Cloudflare — typos are the #1 cause
- Make sure proxy status is grey (DNS only), not orange
- Try an incognito window (iPad → Private Browsing) to avoid cache issues
- Try `dnschecker.org` in Safari and check whether your DNS records are visible globally

-----

## Phase 5 — Configure HTTPS and redirect settings (5 minutes)

Once your custom domain works:

### Force HTTPS

1. In Netlify, go to **Domain management → HTTPS**
1. Enable **“Force HTTPS redirect”**

This ensures anyone typing `http://clearvectorintelligence.com` (insecure) is automatically redirected to `https://clearvectorintelligence.com` (secure). Modern browsers expect this.

### Set primary domain

1. In **Domain management**, you’ll see `clearvectorintelligence.com` and `www.clearvectorintelligence.com` listed
1. Make sure `clearvectorintelligence.com` (without www) is marked as **Primary**
1. This means `www.` will redirect to the non-www version. Consistent, cleaner URLs.

-----

## Phase 6 — Update emailTemplates.gs to use the live domain (2 minutes)

Now that `clearvectorintelligence.com` is live, update your email logo URL to point at your own domain instead of GitHub.

1. Upload `logo-email.png` to your `cvi-site` repo under `assets/` (if not already there — you did this earlier)
1. Wait a minute for Netlify to redeploy
1. Verify it’s accessible at `https://clearvectorintelligence.com/assets/logo-email.png` — you should see the logo
1. Open Operations.gsheet → Extensions → Apps Script
1. Open `emailTemplates.gs`
1. Find this line near the top:
   
   ```javascript
   const EMAIL_LOGO_URL = 'https://raw.githubusercontent.com/Clear-Vector-Intelligence/cvi-site/main/assets/logo-email.png';
   ```
1. Replace with:
   
   ```javascript
   const EMAIL_LOGO_URL = 'https://clearvectorintelligence.com/assets/logo-email.png';
   ```
1. Save
1. Send yourself a test email — verify the logo still renders (it will, because the image is at both URLs, but emails will now reference your own domain)

-----

## Phase 7 — The safe workflow for future edits (optional but recommended) (5 minutes)

This is Option A from the intro — using branches so you can preview changes before they go live.

### Setting up once

1. On your GitHub repo (`Clear-Vector-Intelligence/cvi-site`), tap the branch dropdown at the top-left of the file list. Currently shows `main`.
1. Tap **“View all branches”** or tap into the dropdown
1. In the search/create box, type `preview`
1. Tap **“Create branch: preview from main”**

You now have two branches:

- `main` — what’s live on `clearvectorintelligence.com`
- `preview` — where you’ll stage changes before they go live

### Netlify auto-creates preview URLs for branches

Netlify should automatically build and deploy every branch that has commits. Check this:

1. In Netlify, go to **Site configuration → Build & deploy → Branches**
1. Under **“Branches and deploy contexts”**, you should see options for deploy previews
1. Make sure **“All”** branches are deployed, or explicitly add `preview` to the list of branches to deploy

### Making edits safely

Whenever you have a change to make:

1. On GitHub, switch to the `preview` branch (branch dropdown at top-left of file list)
1. Navigate to the file you want to edit
1. Tap the pencil icon to edit
1. Paste/type your changes
1. Commit — choose **“Commit directly to preview branch”**
1. Wait 30–60 seconds. In Netlify, check the Deploys list. You’ll see a new “Branch deploy” for the `preview` branch with a URL like `https://preview--cvi-clearvector.netlify.app`
1. Open that URL on Safari, test your change thoroughly
1. When happy, go back to GitHub and create a **“Pull request”** from `preview` → `main`. Merge it.
1. When merged, the change deploys to the live site (`clearvectorintelligence.com`) automatically within 60 seconds

### When you want to make a quick change

For a one-character fix or something trivial, you can still commit directly to `main` if you’re confident. Branches are optional, not required.

-----

## What happens when you commit to GitHub

Just to make the mental model crystal clear, here’s what occurs on every commit:

**Commit to `main` branch:**

1. GitHub receives the commit
1. GitHub notifies Netlify via webhook
1. Netlify pulls the latest code from `main`
1. Netlify builds (instant for a static site — no build step)
1. Netlify deploys the new version to `clearvectorintelligence.com`
1. Site is live — about 30–60 seconds total

**Commit to `preview` branch (or any non-main branch):**

1. GitHub receives the commit
1. Netlify builds it
1. Netlify publishes it at a branch-specific URL like `preview--cvi-clearvector.netlify.app`
1. Production site at `clearvectorintelligence.com` is UNCHANGED
1. You preview, test, then merge to main when happy

-----

## Troubleshooting

### “DNS not configured” won’t go away

- Wait longer — up to 2 hours for global DNS propagation
- Double-check the A record IP and CNAME target match what Netlify specified
- Ensure Cloudflare proxy is grey cloud (DNS only), not orange
- Try clearing Safari cache: Settings → Safari → Clear History and Website Data

### SSL certificate won’t provision

- Netlify requires DNS to be fully configured before it can provision SSL
- Wait 15 minutes after DNS is confirmed
- If still failing, in Netlify go to Domain management → HTTPS → tap “Renew certificate”

### Site loads but styles are missing

- Check that `styles.css` is at the repo root, not inside a subfolder
- View page source on iPad (hold-tap → Developer Tools in Safari is limited — easier to check the GitHub repo structure)
- Verify the `<link rel="stylesheet" href="styles.css">` path matches the actual file location

### Images don’t load

- Check that `assets/` folder exists in the GitHub repo
- Verify image filenames match exactly (case-sensitive) — `Logo.png` won’t match `logo.png`
- In Safari, try loading the image URL directly: `https://clearvectorintelligence.com/assets/favicon.svg`

### Email logo shows broken image

- Check the URL in `emailTemplates.gs` matches the actual hosted location
- Verify the image loads directly in Safari when you paste the URL
- Make sure the GitHub repo is still public (if using GitHub raw URL)

### I broke the live site

- Go to Netlify → Deploys
- Find a previous successful deploy
- Tap the three-dot menu → **“Publish deploy”**
- The site rolls back to that version instantly
- Fix the broken commit on GitHub, push the fix, site redeploys automatically

-----

## Summary checklist

Phase 1 — Netlify account

- [ ] Sign up for Netlify with GitHub
- [ ] Authorise Netlify to access GitHub

Phase 2 — Deploy from GitHub

- [ ] Import `cvi-site` repo
- [ ] Confirm deploy settings (defaults are fine)
- [ ] First deploy completes successfully
- [ ] Test site at Netlify’s auto-generated URL

Phase 3 — Rename site

- [ ] Change site name to `cvi-clearvector` or similar

Phase 4 — Custom domain

- [ ] Add `clearvectorintelligence.com` in Netlify
- [ ] Copy DNS values from Netlify
- [ ] Update A record in Cloudflare (grey cloud)
- [ ] Update CNAME record in Cloudflare (grey cloud)
- [ ] Wait 15–30 min for propagation
- [ ] Test live domain

Phase 5 — HTTPS

- [ ] Force HTTPS redirect
- [ ] Set `clearvectorintelligence.com` as primary (non-www)

Phase 6 — Update emails

- [ ] Verify `logo-email.png` at `clearvectorintelligence.com/assets/logo-email.png`
- [ ] Update `EMAIL_LOGO_URL` in `emailTemplates.gs`

Phase 7 — Branch workflow (optional)

- [ ] Create `preview` branch on GitHub
- [ ] Verify Netlify auto-builds branch deploys
- [ ] Make a test commit to `preview`, verify preview URL works

-----

## What this setup costs

All of this is free:

- **Netlify Starter plan** — free forever, includes unlimited sites, 100 GB bandwidth/month, automatic SSL, deploy previews
- **GitHub Free plan** — unlimited public/private repos, unlimited collaborators on public repos
- **Cloudflare Free plan** — DNS, SSL at Cloudflare level (not needed since Netlify provides it)

You only start paying if you exceed 100 GB/month of bandwidth on Netlify. For a landing page, that’s effectively impossible — 100 GB is roughly 10,000+ unique visitors per day.

-----

## What to do if tomorrow goes wrong

If something blocks you mid-setup and you can’t figure it out:

1. **Don’t panic** — nothing you do can cause permanent damage at this stage
1. **The current state is fine** — your DNS records still point where they did before (assuming you haven’t changed them yet). Your site on GitHub is unchanged.
1. **You can always delete the Netlify site and start over** — no cost, no data lost
1. **Send me the error messages or screenshots** in the next Claude chat and I can diagnose

The riskiest step is Phase 4 (DNS change). If you’re not sure about something there, pause and ask before continuing. A misconfigured DNS record can make your domain unreachable for minutes or hours. No permanent damage — DNS changes are always reversible — but it can be stressful.

**Safe testing approach:** Do Phases 1–3 tomorrow. Stop at the end of Phase 3 with the site live at `cvi-clearvector.netlify.app`. Play with it, show people, iterate. Then do Phase 4 (DNS) when you’re confident.
