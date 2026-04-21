# Tally Form Theming Guide — Match CVI Brand

Apply these settings to each of your four Tally forms to match the CVI website visually. You're on the Free plan, so this guide uses only free-plan features. A Pro upgrade would allow custom CSS for pixel-perfect matching, but isn't necessary for launch.

## Forms to theme

Apply these settings to each:

1. **Onboarding** — ID `0QE0NA`
2. **Mission Request** — ID `LZd4Oy`
3. **Mission Review** — ID `aQBqLB`
4. **Feedback** — ID `zxKPWM`

---

## The CVI brand reference

Before you start, here are the colours and fonts you'll use across every form.

**Brand colours:**
- Navy Deep (primary): `#0A1628`
- Navy (secondary): `#1B2A4A`
- Blue (accent): `#4A9FD4`
- Cream (background): `#FAF7F0`
- White: `#FFFFFF`
- Muted (secondary text): `#8899A8`

**Fonts:**
- Display (headings): **Fraunces**
- Body (questions, labels, answers): **Manrope**
- Mono (codes, references): **JetBrains Mono**

All three are in the Google Fonts library that Tally uses.

---

## Step-by-step: theming one form

Repeat these steps for each of the four forms.

### Step 1: Open the form editor

1. Go to `tally.so` on iPad Safari
2. Log in with `operations@clearvectorintelligence.com`
3. Click the form you want to theme
4. Click **"Edit form"** at the top

### Step 2: Open the customisation panel

1. At the top of the form builder, click **"Customize"**
2. A side panel opens with theme options

### Step 3: Apply the theme settings

Set each option as follows:

**Theme / Colours:**

- **Form background:** `#FAF7F0` (cream)
- **Question text colour:** `#1B2A4A` (navy)
- **Answer text colour:** `#1B2A4A` (navy)
- **Button background:** `#1B2A4A` (navy)
- **Button text colour:** `#FFFFFF` (white)
- **Accent colour (focus states, selections):** `#4A9FD4` (blue)

If Tally asks for hex codes, include the `#` — if it asks for values without `#`, omit it.

**Fonts:**

- **Question font:** Fraunces (search for "Fraunces" in the dropdown)
- **Body/answer font:** Manrope (search for "Manrope")

If Tally only allows one font choice globally, use **Manrope** — it's readable and matches the site body text.

**Logo:**

1. In the customisation panel, look for **"Logo"** or **"Cover image"**
2. Upload your CVI logo file
   - For the logo area, use the cream/navy logo variant
   - For cover image, keep it subtle — a solid colour image works well
3. Size: logo 40–60px tall works well

**Layout:**

- **Form width:** Medium or Standard (whatever Tally's default is)
- **Page layout:** One question per page (Tally's "conversational" mode) if available on Free plan

### Step 4: Progress bar and branding

- **Progress bar:** Enable if available — matches the brand's "sharp, precise" tone
- **Powered by Tally badge:** Unfortunately can't remove on Free plan. Free plan keeps the small Tally badge at the bottom. This is a normal trade-off — most forms use Typeform/Google Forms which have the same issue.

### Step 5: Thank you page

After each form, the thank-you message matters. Customise as follows:

**For Onboarding:**
> Your profile is now in our system.
> 
> A welcome email with your personal mission request link is on its way to your inbox. Please keep that email safe — it contains your bookmark link for all future missions.

**For Mission Request:**
> Request received.
> 
> Your Mission Intelligence Brief will arrive within 24 hours. If your mission is time-sensitive, I will respond sooner.

**For Mission Review:**
> Thank you.
> 
> Your feedback helps calibrate the system for future missions.

**For Feedback:**
> Appreciated.
> 
> Feedback shapes how CVI evolves. Thank you for taking the time.

### Step 6: Save and test

1. Click **Save** or **Publish**
2. Open the form in a new tab
3. Check it on iPad Safari (the device most clients will use)
4. Check colour contrast — navy text on cream should be easily readable
5. Submit a test response to make sure it still feeds into your Apps Script webhook correctly

---

## What it'll look like after theming

You'll get a form that:

- Has cream background matching website cards
- Navy heading in Fraunces (matching site body)
- Navy buttons with white text (matching site CTAs)
- Blue accent on focus states (matching site links)
- Subtle, professional appearance that visually follows from the site

Limitations on Free plan:

- Button corner radius stays at Tally default (slight rounding, not sharp-cornered like the site)
- Input field borders use Tally default (slightly different from site form styling)
- Some spacing and padding may not exactly match the site
- Small "Powered by Tally" badge appears at the bottom

These are acceptable for launch. 95% of visitors won't notice. Pro clients will recognise your attention to colour + typography which are the main things.

---

## After themeing all four forms

**Check these specific things:**

1. Send yourself a test onboarding — does the welcome email from the Apps Script also render correctly with the logo? (If not, check email logo URL)
2. Use your own tokenised mission request link (from your welcome email) — does the form render correctly with your details pre-filled?
3. Try submitting a mission request — does the brief generation trigger correctly?
4. Open the Tally form on a friend's phone — does it look good on a device that's never seen the site?

If everything looks good and submits correctly, you're done.

---

## Pro plan decision — when to upgrade

Upgrade to Tally Pro ($24/month) ONLY if:

- You have 10+ active clients asking for pixel-perfect branded forms
- You need to remove the "Powered by Tally" badge for a prestigious client
- You want custom CSS for precise styling to match the site perfectly
- You're hitting a specific limitation you can't work around

Don't upgrade just because "Pro is better". £19/month × 12 = £228/year. At that point, investing the same money in other parts of the business is probably better return.

---

## Longer-term: migration to in-house forms

You asked if there's a better way than 4 different Tally forms. Yes — eventually.

**Honest assessment:** Once you have the site live and 10-20 clients, consider rebuilding forms natively into the website. This would:

- Eliminate Tally entirely (one less service)
- Give you full visual control
- Integrate cleanly with tokenised client links
- Keep everything under `clearvectorintelligence.com`

**But it's not a launch blocker.** Tally works, webhooks are live, and the time you'd spend building in-house forms is better spent on launch + first 10 clients right now.

**When to consider migration:**
- You're at 10+ active clients
- You have desktop access consistently
- You have a week of clear time to dedicate to the rebuild
- Preferably v2 or v3 of the business

I'll keep this flagged as a future project. It's genuinely worth doing at some point — just not right now.

---

## Summary checklist

For each form (4 total):

- [ ] Background colour: `#FAF7F0`
- [ ] Question colour: `#1B2A4A`
- [ ] Answer colour: `#1B2A4A`
- [ ] Button background: `#1B2A4A`
- [ ] Button text: `#FFFFFF`
- [ ] Accent colour: `#4A9FD4`
- [ ] Font: Fraunces (headings) + Manrope (body), or Manrope only
- [ ] Logo uploaded
- [ ] Thank-you page customised
- [ ] Published + tested

Total time: about 15 minutes per form once you've done the first. All four forms should take 45–60 minutes.
