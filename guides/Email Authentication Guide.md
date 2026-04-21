# Email Authentication Setup — DKIM, SPF, DMARC

Complete guide for setting up email authentication between Google Workspace and Cloudflare for `clearvectorintelligence.com`. The goal is to stop your emails landing in recipients’ spam folders.

**Diagnosis of your current stuck state:** DKIM stuck “authenticating” for 2 weeks is almost certainly a Cloudflare+Google formatting issue with 2048-bit keys, not a propagation delay. The fix is specific and well-documented.

-----

## Why your emails go to spam — the three records

Three DNS records work together to authenticate your emails:

- **SPF** (Sender Policy Framework) — tells receiving servers which servers are allowed to send email from your domain
- **DKIM** (DomainKeys Identified Mail) — cryptographic signature proving the email wasn’t tampered with and came from your domain
- **DMARC** (Domain-based Message Authentication, Reporting & Conformance) — policy that tells receiving servers what to do when SPF or DKIM fail

**What happens without them:**

- Gmail, Outlook, and most modern providers score unauthenticated emails as likely spam
- Google requires all senders to set up SPF or DKIM — without at least one, deliverability drops significantly
- Messages sent via your system scripts (brief delivery, welcome emails, invoices) get flagged

**What this setup achieves:**

- Emails from `operations@clearvectorintelligence.com` and other CVI addresses arrive in inboxes, not spam
- Recipients see your professional domain instead of “via gmail.com”
- You get reports on email failures via DMARC

-----

## The Cloudflare + Google DKIM problem (why yours is stuck)

This is the critical technical issue. Most DKIM TXT records can have up to 255 characters. You can not enter a 2048-bit key as a single text string with a 255-character TXT record limit.

A 2048-bit DKIM key is typically 400+ characters. Cloudflare’s handling of long TXT records has a specific quirk:

- When you paste a 2048-bit key into Cloudflare, it may display the value wrapped in double quotes
- Double quotes in the TXT UI are cosmetic. Cloudflare’s dashboard displays TXT record values wrapped in double quotes. They’re a display convention - the actual DNS response doesn’t include them.
- BUT — if you accidentally paste the key WITH quotes around it, or if it contains invisible characters or line breaks, Cloudflare may store it wrong

The symptom is exactly what you’re experiencing: Google keeps saying “authenticating” forever because Google’s verifier can see a TXT record exists but cannot parse it correctly.

**Two approaches to fix this:**

1. **Use 1024-bit key (easier, always works)** — avoids the character limit entirely
1. **Use 2048-bit key (more secure, needs careful pasting)** — better long-term, slightly harder to set up

I’ll show you both. Start with the 1024-bit approach to get it working today, then optionally upgrade to 2048-bit later.

-----

## Phase 1 — Audit your current DNS records (10 minutes)

Before making changes, let’s see what you currently have. This helps avoid breaking something else.

### Step 1a — Open Cloudflare DNS

1. On iPad Safari, go to `dash.cloudflare.com`
1. Log in and select `clearvectorintelligence.com`
1. Go to the **DNS** section (left sidebar → Records)

### Step 1b — Take stock of existing records

Look for these specific records and note what they say:

- Any **MX records** — should point to Google’s mail servers
- Any **TXT record on the root domain** (`@` or `clearvectorintelligence.com`) — this is your SPF record
- Any **TXT record at `google._domainkey`** — this is the stuck DKIM record
- Any **TXT record at `_dmarc`** — this is your DMARC policy (may not exist yet)

**Write these down** or screenshot so you have a backup before making changes.

### Step 1c — Check MX records are correct first

Google Workspace needs these 5 MX records for the root domain:

|Priority|Mail server      |
|--------|-----------------|
|1       |`smtp.google.com`|

Wait — recent Google Workspace uses a single MX record now. But older accounts may still have the 5-record setup:

|Priority|Mail server              |
|--------|-------------------------|
|1       |`aspmx.l.google.com`     |
|5       |`alt1.aspmx.l.google.com`|
|5       |`alt2.aspmx.l.google.com`|
|10      |`alt3.aspmx.l.google.com`|
|10      |`alt4.aspmx.l.google.com`|

Either is fine. What matters is that mail is being delivered to your Google Workspace (which it is — you’re receiving mail at `operations@clearvectorintelligence.com`).

Do NOT change MX records unless they’re wrong.

-----

## Phase 2 — Remove the stuck DKIM record (5 minutes)

We’re going to delete the stuck record and start fresh.

### Step 2a — Delete existing google._domainkey TXT record

1. In Cloudflare DNS, find the TXT record at `google._domainkey`
1. Tap the three-dot menu or **Edit** button
1. Tap **Delete**
1. Confirm

The stuck DKIM record is now gone. Google will start failing DKIM authentication on outgoing emails immediately — don’t panic, this is temporary. We’ll have a working record within 30 minutes.

### Step 2b — Stop authentication in Google Admin Console

1. On iPad Safari, go to `admin.google.com`
1. Log in with your admin account (the one with super admin privileges)
1. Navigate: **Apps → Google Workspace → Gmail → Authenticate email**
1. Select domain: `clearvectorintelligence.com`
1. If there’s a “Stop authentication” button, tap it. This tells Google to stop trying to verify the old key.

If you don’t see “Stop authentication”, that means authentication was never fully enabled — which is fine, that’s what we’re fixing.

-----

## Phase 3 — Generate a fresh DKIM key (5 minutes)

### Step 3a — Generate new key in Admin Console

Still in **Apps → Google Workspace → Gmail → Authenticate email** with `clearvectorintelligence.com` selected:

1. Tap **Generate new record**
1. You’ll see a dialogue with options:
- **DKIM key bit length:** Choose **1024** for your first attempt (see explanation below)
- **Prefix selector:** Leave as `google` (default)
1. Tap **Generate**

**Why 1024-bit for first attempt:**

A 1024-bit key fits in a single TXT string (under 255 characters). This eliminates the Cloudflare quoting problem entirely. 1024-bit is less secure than 2048-bit in theory, but still secure in practice for DKIM — the use case doesn’t require maximum cryptographic strength. Once you confirm the setup works, you can optionally regenerate with 2048-bit and apply the extra formatting care it requires.

### Step 3b — Copy the values

Google shows you a screen with the TXT record details. Copy these exactly:

- **DNS host name (TXT record name):** `google._domainkey`
- **TXT record value:** A long string starting with `v=DKIM1; k=rsa; p=...`

**Critical**: Copy the value using tap-hold → Select All → Copy. Make sure you don’t accidentally grab any surrounding whitespace, quotes, or line breaks.

**Do NOT tap “Start authentication” yet.** We need to add the DNS record first.

-----

## Phase 4 — Add the DKIM record to Cloudflare (5 minutes)

### Step 4a — Create the TXT record

1. Back in Cloudflare DNS, tap **Add record**
1. Configure:
- **Type:** TXT
- **Name:** `google._domainkey` (just this — don’t type the full domain; Cloudflare auto-appends it)
- **Content:** Paste the value from Google (starting with `v=DKIM1; k=rsa; p=...`)
- **TTL:** Auto
- **Proxy status:** N/A (TXT records can’t be proxied)

**Critical paste check:**

The content field should contain the DKIM value as one continuous string. Check:

- **No quotes at the start or end** — Cloudflare adds display quotes automatically, don’t type your own
- **No line breaks in the middle** — should be one unbroken line, even if it wraps visually in the field
- **No leading or trailing spaces**
- **No smart quotes** — iPad sometimes converts `"` to `"` — these look the same but break DKIM

1. Tap **Save**

### Step 4b — Verify the record was saved correctly

1. Back in the DNS records list, find your new `google._domainkey` TXT record
1. Tap to view it
1. Compare the value character-by-character with what Google showed you
1. It should start `v=DKIM1; k=rsa; p=` and end with `AB` or similar (the end of a base64-encoded key)

If there’s any discrepancy — especially invisible characters or line breaks — delete the record and recreate it.

### Step 4c — Test the DNS record has propagated

This is a critical step your previous attempts probably skipped. We verify the record is correct BEFORE asking Google to authenticate.

**Using Google’s own verification tool:**

1. On iPad Safari, go to `https://toolbox.googleapps.com/apps/dig/`
1. In the **Name** field: enter `google._domainkey.clearvectorintelligence.com`
1. Click **TXT**
1. You should see a result showing your DKIM key value

**What you’re checking for:**

- The record **exists** and returns a TXT value
- The value **matches exactly** what Google Admin Console showed you
- No weird escaping like `\"` or `\\` in the output

If the record doesn’t appear, wait 10 minutes and try again. DNS propagation usually takes 5–15 minutes globally but can take up to an hour.

**If the record appears but has weird characters:**

This is the classic Cloudflare problem. Delete the TXT record in Cloudflare, start over, and be extra careful about the paste — use a text editor to remove any invisible characters first.

-----

## Phase 5 — Start DKIM authentication (2 minutes)

Only once the dig tool confirms your record is correct:

1. Back in Google Admin Console → **Apps → Google Workspace → Gmail → Authenticate email**
1. Select `clearvectorintelligence.com`
1. Tap **Start authentication**
1. Google verifies the record (usually within seconds to minutes)

**Expected result:** Within 10 minutes, the status should change to **“Authenticating email”** with a green checkmark, not the stuck “Authenticating” with no checkmark.

**If it works:** DKIM is live. Any email sent from your Google Workspace accounts will now be cryptographically signed.

**If it’s still stuck after an hour:**

- Your DNS record has an issue. Don’t wait — troubleshoot now.
- Go back to the dig tool (`toolbox.googleapps.com/apps/dig/`)
- Query the record again
- Compare value to what’s in Admin Console
- If they don’t match, delete and re-add the Cloudflare record

-----

## Phase 6 — Verify SPF is set up (5 minutes)

SPF is often already working for Google Workspace users, but let’s verify.

### Step 6a — Check existing SPF record

1. In Cloudflare DNS, look for a TXT record on the root domain (`@` or `clearvectorintelligence.com`) starting with `v=spf1`

It should look something like:

```
v=spf1 include:_spf.google.com ~all
```

If it does, SPF is working. Skip to Phase 7.

### Step 6b — If SPF doesn’t exist, add it

1. Add a new TXT record in Cloudflare:
- **Type:** TXT
- **Name:** `@` (root domain)
- **Content:** `v=spf1 include:_spf.google.com ~all`
- **TTL:** Auto
1. Save

**What the parts mean:**

- `v=spf1` — SPF version 1
- `include:_spf.google.com` — Google’s mail servers are authorised senders
- `~all` — soft-fail anything else (better than `-all` during initial setup; can harden later)

### Step 6c — Verify SPF

1. Go to `mxtoolbox.com/spf.aspx`
1. Enter `clearvectorintelligence.com`
1. Tap check
1. Should show “SPF record published” with a pass

-----

## Phase 7 — Set up DMARC (5 minutes)

DMARC ties SPF and DKIM together and tells receivers what to do when they fail.

### Step 7a — Check if DMARC exists

In Cloudflare DNS, look for a TXT record at `_dmarc` (subdomain `_dmarc.clearvectorintelligence.com`).

If it doesn’t exist, create it.

### Step 7b — Create DMARC record

Add a new TXT record:

- **Type:** TXT
- **Name:** `_dmarc`
- **Content:** `v=DMARC1; p=none; rua=mailto:operations@clearvectorintelligence.com; pct=100; sp=none; aspf=r;`
- **TTL:** Auto

**What the parts mean:**

- `v=DMARC1` — DMARC version 1
- `p=none` — **monitoring mode only**, don’t take action yet. This is critical for initial setup — you want to see DMARC reports before enforcing anything
- `rua=mailto:...` — where DMARC aggregate reports should be sent (daily email summaries of pass/fail stats)
- `pct=100` — apply the policy to 100% of emails
- `sp=none` — same policy for subdomains
- `aspf=r` — SPF alignment mode relaxed

### Step 7c — Monitor for 2–4 weeks, then harden

Leave the policy at `p=none` for 2–4 weeks. During that time, you’ll receive daily DMARC reports at `operations@`. These are XML files showing which senders are using your domain.

After you confirm:

- All your legitimate senders (Google Workspace, any SMTP services) are passing SPF and DKIM
- No legitimate senders are failing

Upgrade the policy to quarantine, then reject:

**Step 1 — Quarantine (after 2 weeks):** Change `p=none` to `p=quarantine`. This tells receivers to put failing emails in spam.

**Step 2 — Reject (after another 2 weeks):** Change `p=quarantine` to `p=reject`. This tells receivers to bounce failing emails entirely. Maximum protection against spoofing.

**Do NOT jump straight to `p=reject`.** If any legitimate sender is misconfigured, you’ll bounce your own emails.

-----

## Phase 8 — Test end-to-end (5 minutes)

Once DKIM, SPF, and DMARC are all set up, test deliverability.

### Step 8a — Use mail-tester

1. On iPad Safari, go to `mail-tester.com`
1. It shows you a unique test email address
1. Send an email from your CVI Gmail account (e.g. `operations@clearvectorintelligence.com`) to that address
1. Back on mail-tester, tap **Then check your score**

**Target score: 9/10 or higher.**

You’ll see individual checks:

- SPF pass
- DKIM signature valid
- DMARC alignment
- Not on any blacklists
- HTML/content passes spam checks

If any fail, mail-tester explains exactly what’s wrong.

### Step 8b — Send a test email to your personal Gmail

1. From your CVI Google Workspace account, send an email to your personal Gmail address
1. Open the email in personal Gmail
1. Tap the three-dot menu → **Show original**
1. Look for:
- `SPF: PASS`
- `DKIM: PASS`
- `DMARC: PASS`

If all three show PASS, your setup is working correctly.

### Step 8c — Test CVI’s automated emails

Finally, trigger an email from your Apps Script system (e.g. send a welcome email via the onboarding flow):

1. Open the email in personal Gmail
1. Show original
1. Verify SPF and DKIM pass
1. Check it landed in the inbox, not spam

-----

## Troubleshooting

### DKIM still stuck after the fix

Most common causes:

**1. Invisible characters in the TXT record**

Copy the DKIM value from Google, paste it into iOS Notes, then copy FROM Notes into Cloudflare. This strips hidden formatting.

**2. Smart quotes**

iPad’s autocorrect sometimes converts quotes. When pasting into Cloudflare, check the field for `"` or `"` (smart quotes) instead of `"` (straight quote). Should be no quotes at all.

**3. Auto-appended domain**

If you typed `google._domainkey.clearvectorintelligence.com` in the Name field, Cloudflare appends your domain again making it `google._domainkey.clearvectorintelligence.com.clearvectorintelligence.com`.

Only enter `google._domainkey` in the name field.

**4. Wrong selector**

Google Workspace’s default selector is `google`. If you changed it when generating the key, the record name has to match (e.g. `cvi._domainkey` if you used `cvi` as selector).

### Emails still go to spam after DKIM passes

DKIM fixing is the biggest lever, but other factors matter:

- **Sender reputation** — a brand-new domain has no history. First 30 days of sending build reputation. Avoid sending to huge lists immediately.
- **Content quality** — subject lines like “URGENT” or “FREE” trigger spam filters
- **Low send volume** — you’re fine. High-volume senders have stricter requirements.
- **Recipient engagement** — if recipients don’t open your first few emails, your sender score drops

Give it 2–4 weeks of normal sending patterns before judging deliverability.

### Want to upgrade to 2048-bit later

Once 1024-bit is working:

1. In Admin Console, tap **Generate new record** and choose **2048-bit**
1. Copy the new value (it’ll be longer — 400+ characters)
1. In Cloudflare, edit the `google._domainkey` TXT record
1. Paste the new value **exactly as Google shows it**, no quotes added, no line breaks
1. Cloudflare handles the splitting automatically - just paste the full value as one continuous string
1. Save, wait 15 minutes, verify with dig tool
1. Google Admin Console should remain authenticated — the new key replaces the old

If 2048-bit gets stuck, revert to 1024-bit. Not worth the hassle for a solo operator.

-----

## Summary checklist

**Phase 1-2 — Audit and cleanup:**

- [ ] Log in to Cloudflare DNS, note existing records
- [ ] Verify MX records point to Google Workspace
- [ ] Delete existing `google._domainkey` TXT record
- [ ] In Google Admin Console, stop authentication (if running)

**Phase 3-4 — Fresh DKIM:**

- [ ] Generate new 1024-bit DKIM key in Admin Console
- [ ] Copy TXT value carefully
- [ ] Add TXT record in Cloudflare as `google._domainkey`
- [ ] Check value character-by-character
- [ ] Verify with Google dig tool (`toolbox.googleapps.com/apps/dig/`)

**Phase 5 — Authenticate:**

- [ ] Tap “Start authentication” in Admin Console
- [ ] Verify green checkmark appears within 10 minutes

**Phase 6 — SPF:**

- [ ] Verify SPF record exists: `v=spf1 include:_spf.google.com ~all`
- [ ] Test with mxtoolbox.com/spf.aspx

**Phase 7 — DMARC:**

- [ ] Add DMARC record at `_dmarc` with `p=none` policy
- [ ] Plan to review reports in 2–4 weeks and harden

**Phase 8 — End-to-end test:**

- [ ] Score 9+ on mail-tester.com
- [ ] Show original in Gmail shows SPF, DKIM, DMARC all PASS
- [ ] CVI automated email arrives in inbox, not spam

-----

## Tomorrow’s sequence

Suggested order for tomorrow:

1. **First, do Netlify Phases 1–3** (get the site live at a Netlify URL) — ~30 minutes
1. **Then do email authentication Phases 1–5** (fix DKIM) — ~30 minutes
1. **Then do Netlify Phase 4** (custom domain) — ~20 minutes
1. **Wait for DNS propagation** (30 minutes) while having lunch
1. **Then do email auth Phases 6–8** (SPF, DMARC, testing) — ~20 minutes
1. **Then do Netlify Phases 5–6** (HTTPS, update email templates) — ~15 minutes

Total: ~2 hours of focused work plus 30 minutes of DNS waiting time.

You can do it all in one sitting or spread across the day.

-----

## Why this matters for CVI specifically

CVI sends several types of automated emails:

- Welcome emails to new clients
- Mission request acknowledgements
- Brief delivery with PDF attachments
- Invoices
- Review reminders
- Payment confirmations

These are transactional emails to high-value clients. If any land in spam, the client experience breaks — they think you forgot them, or the brief never arrived, or the invoice is lost. Setting DKIM/SPF/DMARC correctly once means your deliverability is solid for all of these automatically.

Bulk senders (thousands of emails/day) have stricter DMARC requirements, but you’re well under that threshold. For your use case, the standard setup above is all you need.
