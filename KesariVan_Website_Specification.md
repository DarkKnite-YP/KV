# Kesari Van Website — Master Design & Implementation Specification

**Purpose:** A comprehensive handoff for Stitch, Antigravity, or a development team to design and build the Kesari Van website. This document consolidates page decisions, content, UX, architecture, functionality, and important revisions from our planning.

**Brand:** Kesari Van  
**Domain:** `kesarivan.in` (planned)  
**Orchard location:** Umbhel, Kamrej, Surat, Gujarat, India  
**Primary focus:** Seasonal mango commerce, real orchard storytelling, and a limited tree-adoption experience.

---

## 0. Instruction to the design/build agent

Build a premium, warm, editorial, mobile-first website for **Kesari Van**, a real mango orchard in Surat, Gujarat. This is not a generic ecommerce template, not a resort/tourism site, and not a conventional corporate agriculture website. It should feel like an invitation into a real orchard: honest, quiet, nature-connected, thoughtfully designed, and trustworthy.

Use this specification as the source of truth. Do not invent operational claims, reviews, certifications, product stock, shipping promises, published journal posts, or tree availability. Where content is marked **verify**, **placeholder**, or **finalize before launch**, do not present it as confirmed live copy. Use authentic Kesari Van photography wherever available; temporary imagery must be clearly replaceable and must not look like a fabricated orchard record.

Create responsive layouts for desktop, tablet, and mobile. Mobile is the priority; roughly 85% of anticipated traffic is mobile. Do not merely shrink desktop layouts.

### Deliverable expectations
- Complete responsive website design and implementation.
- All listed routes and core flows.
- Reusable components and shared design system.
- Supabase-backed data, authentication, and admin functionality.
- Accessible forms, validation, loading, empty, success, error, and failure states.
- SEO basics and share metadata for public content pages.
- Production-safe payment and inventory flows.
- Clear distinction between approved brand/content decisions and operational/legal details still requiring confirmation.

---
## 1. Brand foundation

### 1.1 Brand facts
- Kesari Van is a mango orchard established/planted in October 2023, converted from former sugarcane land.
- Located in Umbhel, Kamrej, Surat, Gujarat, India—not Gir.
- The mango variety is **Gir Kesar**, known as the Queen of Mangoes. Do not imply the orchard is located in Gir.
- Approximately 900+ trees are present. Variety counts are provisional and should be verified before publishing.
- Orchard varieties include Kesar, Sonpari, Totapuri, Alphonso, Rajapuri, and additional varieties; publish only confirmed inventory.
- Farming practices include soil-care practices, drip irrigation, pruning, and individual fruit protection bags.
- **Do not claim certified organic.** The orchard is not currently represented as certified organic.
- Tree adoption is a seasonal program: proposed price ₹6,499 per tree, minimum harvest guarantee 25 kg, excess eligible yield above the guarantee belongs to the adopter, shipping separately. Final shortfall, cancellation, substitution, harvest and shipping rules must be finalized.
- The orchard is a real working farm. Visits are by prior request and confirmation, not instant tourist bookings.

### 1.2 Brand personality
Archetypes: **Caregiver + Sage + Creator**.\nVoice: warm, patient, curious, knowledgeable, calm, honest, grounded. Avoid aggressive selling, overpromising, inflated claims, fake urgency, excessive exclamation marks, or generic AI-sounding phrases.

### 1.3 Brand phrases
Use these consistently but not excessively:
- **Connect with the Soil.** A brand expression that may appear in Contact, footer, communications, packaging, and campaign copy.
- **Our gates are as open as our process.** Orchard invitation/transparency expression.
- **A summer worth waiting for.** Mango-season campaign expression.
- **It's not just a farm; it's an experience.** Brand sentiment, use carefully.
- **A little closer to nature. A little closer to where your food comes from.** Closing brand sentiment.

### 1.4 Visual identity
Color palette:
- Orchard Green `#344B36` — primary brand, buttons, nav accents.
- Deep Forest `#243629` — deep surfaces and contrast.
- Dawn Gold `#D6A64B` — restrained accent.
- Mango Cream `#F7F2E8` — primary background.
- Earth Brown `#806247` — secondary earthy accent.
- Soft Sage `#DCE4D6` — secondary cards/panels.
- Charcoal `#292A25` — text.

Typography:
- **Cormorant Garamond** for editorial/display headings.
- **Manrope** for body text, navigation, forms, and UI.

Visual direction: premium editorial, earthy, whitespace-rich, natural light, quiet typography, restrained animation, soft corners, subtle texture. Avoid overdesigned cards, heavy gradients, excessive icons, bright ecommerce colors, or stock-photo-heavy appearance.

### 1.5 Photography and motion
- Authentic orchard photos and videos are preferred and should be easy to replace/upload from admin.
- Hero videos/cinemagraphs: no audio, defer loading, static fallback, mobile-specific crop/asset where practical, respect reduced-motion settings, and prioritize performance.
- Do not create fake customer testimonials or fake orchard records.
- Avoid autoplay video on content cards or article pages.
- Product and adopted-tree imagery should be real photos of the relevant items/trees where possible.

---
## 2. Sitewide experience and navigation

### Header
Desktop navigation:
- Shop Mangoes
- Our Orchard
- Our Story
- Adopt a Tree
- Journal

Header utilities: search (if implemented), account icon, cart icon with live count. Logo links to homepage. Header may transition from transparent over hero to solid/cream on scroll, but remain discreet and readable.

Mobile: logo, cart, hamburger/menu. Menu should be compact, accessible, and thumb-friendly.

Optional announcement bar: “A little piece of the orchard, coming to your home.” Use only when there is a meaningful announcement.

### Footer
Include:
- Shop Mangoes
- Our Orchard
- Our Story
- Farming Practices
- Adopt a Tree
- Journal
- Visit
- Contact
- FAQ
- Terms & Conditions
- Tree Adoption Terms
- Shipping & Delivery
- Cancellation & Refund
- Privacy Policy
- Contact details and social links only when verified/configured
- Brand phrase **Connect with the Soil.**

### Shared UX rules
- Clear, persistent cart state.
- Show shipping as separate where applicable and disclose before payment.
- Avoid false stock scarcity. Only display actual inventory/availability.
- Preserve a user's intended destination through authentication.
- Use backend-derived states for orders, payment, adoption and tree availability.
- Buttons must have real behavior; avoid decorative fake controls.
- Include loading, empty, validation, success, error, retry and offline/network states where relevant.
- Accessible focus states, labels, keyboard navigation, contrast, reduced motion, and semantic structure.

---
## 3. Sitemap and route architecture

```text
/
/our-story
/orchard
/farming-practices
/shop
/shop/:product-slug
/cart
/checkout
/order-success
/track-order
/adopt-a-tree
/adopt-a-tree/how-it-works
/adopt-a-tree/checkout
/adoption-success
/visit
/visit/book
/journal
/journal/:slug
/contact
/faq
/shipping
/refund-policy
/privacy-policy
/terms
/adoption-terms
/account
/account/orders
/account/orders/:id
/account/profile
/account/addresses
/account/adoptions
/account/adoptions/:id
/account/visits
/admin
/admin/products
/admin/inventory
/admin/orders
/admin/orders/:id
/admin/adoptions
/admin/customers
/admin/journal
/admin/visits
/admin/settings
```

**Authentication pages are not custom pages.** Login/register UI is handled by the configured Supabase Auth flow. `/account` is the customer account experience after authentication. Account subpages are implementation scope and do not require individual design-review pages.

**Orchard Visit Guidelines are not a standalone page.** Rules are covered in Visit page, FAQ, and applicable policies.

**Journal article template is part of the Journal system.** It is not required as a separate design-review deliverable, but route `/journal/:slug` must be implemented.

---
## 4. Page specifications

### Page 01 — Homepage `/` (APPROVED & LOCKED)
**Goal:** Establish emotional connection, explain what Kesari Van is, and guide visitors toward mangoes, orchard, adoption, or stories.

**Hero:**
Eyebrow: `GIR KESAR · GROWN IN SURAT, GUJARAT`  
Headline: **“Welcome to an orchard that is writing its next season.”**  
Copy: “Every tree has a beginning. Every season brings a new story. And somewhere among these leaves, the next summer is taking shape.”  
CTAs: **Taste the Harvest**; **Explore the Orchard**.
Use authentic orchard hero video/cinemagraph, static fallback, mobile crop, no audio.

**Sections, in order:**
1. Header/nav.
2. Hero.
3. Flower/fruit moment: “Every mango you have ever eaten... once looked like this.” Supporting line: “This flower may become someone's summer.” CTA: Follow the Journey.
4. Gir Kesar introduction: “Gir Kesar, the Queen of Mangoes, grown in Surat.” Supporting sentiment: “A summer worth waiting for.”
5. Origin: “From sugarcane fields to a future rooted in mango trees.” Tell the 2023 transformation story.
6. Farming philosophy: “Not everything needs to be hurried. Some things need to grow.”
7. Tree adoption: “What if you were part of the story?”
8. Orchard section: “Every tree has a season. Every orchard has a story.”
9. Farming teaser: “Good mangoes begin with good care.” Highlights: Thoughtful Pruning, Water With Purpose, Protection & Care.
10. Journal: “There is always something growing.”
11. Visit: “Some things are better experienced in person.”
12. Closing: “A little closer to nature. A little closer to where your food comes from. Welcome to Kesari Van.”

**Products featured:**
- Premium Kesar — 10 kg; mangoes 200 g onwards.
- Golden Kesar — 10 kg; mangoes 250 g onwards, individually protected.
- Signature Harvest — 12 mangoes; mangoes 300 g onwards.
Use dynamic pricing/availability. Shipping separate. Do not show invented prices or stock states.

Homepage is approved and locked. Do not alter its concept/content without explicit reopening.


### Page 02 — Our Story `/our-story` (APPROVED & LOCKED)
Editorial story page. Founder story embedded; no separate founder page.

Hero headline: **“Every orchard begins with a decision.”**  
Copy: “Ours began with the thought that this land could grow into something different—not just a crop for a season, but something that would take years to grow, and years to mean something.”

Sections:
- **From sugarcane fields to a future rooted in mango trees.** Explain the 2023 decision and transformation.
- **Meet Yash. The person growing this dream.** Founder introduction, authentic portrait optional.
- Philosophy: “We are not just farming. We are curating an ecosystem.” Intro: “Every leaf tells a story of care. Every fruit carries the work of an entire season. We believe good mangoes begin with a healthy growing environment—built through observation, thoughtful practices, and care for the orchard as a whole.”
- Principles: Nourish the Soil (soil health/organic soil practices, no certification claim); Water With Purpose (drip irrigation); Prune With Precision (canopy, balanced growth, airflow); Protect What Grows (individual fruit bag protection).
- Close philosophy: “Care is not one action. It is everything we do, throughout the season.” CTA to Farming Practices.
- **A young orchard. A long-term vision.** Trees, knowledge, and vision are growing.
- Location: “Rooted in Surat. Growing Gir Kesar.” Umbhel, Kamrej, Surat.
- Invitation: “The best way to understand an orchard is to be a part of it.”
- Close: “Our gates are as open as our process.”
Approved and locked.


### Page 03 — Orchard `/orchard` (PRESENTED; NOT LOCKED)
Hero eyebrow: `OUR ORCHARD · SURAT, GUJARAT`  
Headline: **“A little world beneath the canopy.”**  
Copy: “Nearly a thousand trees. Countless leaves. One orchard growing, season by season.”  
CTAs: Explore Orchard; Plan Visit.
Sections:
- “Not an estate frozen in time. A living orchard in progress.” Explain orchard planted in 2023 and still growing.
- Variety: “One orchard. Many varieties. A season of discovery.” Kesar, Sonpari, Totapuri, Alphonso and other verified varieties only.
- “More happens here than meets the eye.” Gallery: new growth, flowering, first fruits, quiet orchard moments.
- Seasonal cycle: New Growth → Flowering → Fruit Development → Harvest.
- Care: “Growing is a responsibility.” Soil, drip, pruning, fruit bagging.
- Location: Umbhel, Kamrej, Surat, Gujarat, India. Visits by prior arrangement.
- Closing: “Our gates are as open as our process.”


### Page 04 — Farming Practices `/farming-practices` (PRESENTED; NOT LOCKED)
Hero: **“Good mangoes begin long before the harvest.”** Copy about soil, water, tree growth, and decisions.
Sections:
- Philosophy: “We don't just grow mangoes. We care for the environment they grow in.” Observe before acting; care through season; grow with intention.
- Soil: “Everything begins beneath our feet.” Organic soil-care practices support soil life. Do not claim certified organic.
- Water: “Every drop has a purpose.” Drip irrigation.
- Pruning: “Sometimes, growth needs direction.” Canopy shape, airflow, light, balanced growth.
- Protection: “Every fruit deserves a little protection.” Individual fruit bags.
- Between seasons: “The orchard is always teaching us something.” Observe, learn, adapt.
- Transparency: “We believe you should know how your mangoes grow.” Real updates and seasonal photos.
- Close: “Care is not one action. It's everything we do, throughout the season.”


### Page 05 — Shop `/shop` (PRESENTED; NOT LOCKED)
Hero eyebrow: `THE SEASON'S COLLECTION`  
Headline: **“A summer worth waiting for.”**  
Copy: “Picked only when nature says they're ready.”  
CTAs: Explore the Collection; Our Growing Story.
Products:
1. Premium Kesar — 10 kg; mangoes from 200 g onwards; classic Gir Kesar.
2. Golden Kesar — 10 kg; mangoes from 250 g onwards; each mango individually protection-bagged.
3. Signature Harvest — 12 mangoes; 300 g onwards; handpicked premium selection; “Only for true mango lovers...”
Include comparison guide/table, Why Kesari Van, harvest → selection → packing → delivery journey, choosing guide, adoption cross-sell, dynamic journal section (hide if no published posts), closing “Summer begins somewhere.” Dynamic prices and stock; shipping separately. No false scarcity.


### Page 06 — Product detail `/shop/:product-slug` (APPROVED & LOCKED)
Reusable product detail template.
Desktop: image gallery left, purchase/details right. Mobile: stacked gallery, details, sticky Add to Cart CTA.
Example Golden Kesar:
- `Gir Kesar · Kesari Van, Surat`
- Title `Golden Kesar`
- `10 kg box · Individual protection for every mango`
- `Mangoes 250 g onwards`
- Dynamic price
- Copy: “Picked only when nature says they're ready.”
- Bullets: Gir Kesar; each mango protected with bag; minimum size 250 g; 10 kg collection; shipping separate.
Product variants/specs: Premium Kesar 10 kg / 200 g+; Golden Kesar 10 kg / 250 g+ / individually bagged; Signature Harvest 12 mangoes / 300 g+ / premium selection.
Features: authentic product gallery, thumbnails, swipe/zoom; quantity control; Add to Cart; secure checkout; availability; product rationale; accordions for details, size, packaging, verified ripening/storage guidance, shipping and delivery; PIN-based estimates where supported; related products. No invented details. Sticky mobile CTA.
Approved and locked.


### Page 07 — Cart `/cart` (PRESENTED; NOT LOCKED)
Hero: **“A little sunshine, almost on its way.”**  
Copy: “Take a moment to check your collection. Your mangoes are waiting for the season to be right.”
Cart items show image, name, specification, price, quantity, remove. Backend inventory checks. Summary: subtotal, shipping calculated separately, total; PIN serviceability recheck; proceed checkout; continue shopping.
Empty state: **“Your basket is still growing.”** CTA back to shop.
Cart persists before authentication; mobile checkout CTA may be sticky. Prevent invalid quantities and stale stock; clearly message cart changes.


### Page 08 — Checkout `/checkout` (PRESENTED; AUTH FLOW REVISED)
Checkout must use the **same Supabase Auth system** as the rest of the website. No custom OTP form or duplicated OTP logic.
Flow:
1. Customer adds items to cart without signing in.
2. At checkout, if not authenticated, trigger configured Supabase Auth flow.
3. Existing user signs in; new user registers through same provider/flow.
4. Return to checkout after auth, preserving cart and intended destination.
5. Confirm customer/contact details and delivery address.
6. Check PIN serviceability and calculate shipping separately.
7. Review order and pay using Razorpay.
8. Backend verifies payment and creates/updates order state; success route only after authoritative confirmation.
Security/implementation: server-side payment validation, Razorpay signature verification, webhook handling, idempotency, inventory validation/locking, payment states, no client-side authority for paid status. Guest checkout is not allowed. Cart should merge safely with account cart after login without losing products/quantities or duplicating items.


### Page 09 — Order Confirmation `/order-success` (PRESENTED; NOT LOCKED)
Hero: **“Your summer just got a little closer.”**
Copy: “Thank you for choosing mangoes grown with care. Your order has been placed, and we'll keep you updated as it makes its way from our orchard to your home.”
Show order ID, confirmed state, summary, product, quantities, amount, address, payment state. Timeline: Order Placed → Preparing → On Its Way → Delivered; highlight actual backend state. CTAs Track My Order (`/account/orders/:id`) and Continue Exploring (`/shop`). Only authoritative backend success; handle pending/failure states; refresh must not duplicate order.


### Page 10 — Adopt a Tree `/adopt-a-tree` (PRESENTED; concept modified)
Hero eyebrow: `A SEASON WITH YOUR OWN TREE`  
Headline: **“What if this season, you had a tree of your own?”**  
Copy: “Know the tree your mangoes grow on. Follow its journey through the season, see how it's cared for, and experience the trust of knowing where your mangoes come from. A little closer to nature. A little closer to what you eat.”  
Buttons: Adopt Your Tree (scroll to selection); How It Works.
Include: the tree adoption experience, specific-tree selection, inclusions, 25 kg minimum guarantee, excess yield, weekly orchard updates, visit opportunity, price, FAQ, How It Works, closing CTA.
**Tree-selection system:** approximately 900+ orchard trees; launch adoption collection contains only 100 real trees. Each tree must have actual photo and unique Tree ID (KV-001…KV-100 or actual ID inventory). Customer chooses a specific available tree. No fabricated photos/availability.
Availability: Available / Reserved (temporary checkout hold) / Adopted (unavailable). Detail view shows actual photo, Tree ID, variety, location, fee, guarantee, inclusions, status, CTA.
Suggested message: “900+ trees. Only 100 get a story of their own this season.” or “Out of 900+ trees, only 100 are yours to choose from.” Use only if the actual rollout remains 100 and inventory is accurate. No fake scarcity.


### Page 11 — How Tree Adoption Works `/adopt-a-tree/how-it-works` (PRESENTED; MODIFIED)
Hero eyebrow: `100 TREES · ONE SEASON`  
Headline: **“What if you could choose the tree your mangoes come from?”**  
Copy: “Out of more than 900 trees at Kesari Van, we're opening just 100 trees for adoption this season. Choose the one you like. Give it a place in your season. Follow its growth, see how it is cared for, and know the tree behind the mangoes that reach your home.”
CTA: Choose Your Tree; How It Works.
Selection grid: 100 cards, real photo, Tree ID, status; filters All / Available / Adopted. Selecting a card opens detail with photo, ID, variety, orchard location, fee, guarantee, weekly update/visit benefits, availability.
Process: browse trees → select a specific tree → Supabase authentication if needed → review/accept terms and payment → tree linked after verified payment → orchard-wide weekly update shared by WhatsApp/email to all adopters → harvest/fulfilment of guarantee and any eligible surplus.
FAQ, close: “You know the mango. Now know the tree.”
**Backend:** atomic reservation, reservation expiry, unique tree-season adoption, payment-confirmed assignment, release on failure/expiry. Adoption dashboard does not contain an individualized weekly feed; customer account holds ID/photo/status/confirmation/certificate/harvest-delivery/visit functions.


### Page 12 — Adoption Checkout `/adopt-a-tree/checkout` (PRESENTED; NOT LOCKED)
Hero: **“Almost part of the orchard.”**
Carry selected Tree ID through the flow. Steps: browse → select → Supabase Auth if unauthenticated → review → accept terms → pay ₹6,499 → adoption confirmation.
Show selected tree card with photo, ID, variety, price, 25 kg minimum guarantee, change-tree link. Customer details, mobile/email, delivery address. Shipping separate. Adoption benefit summary. Required terms consent (unchecked by default): season, guarantee, excess harvest, shipping, finalized shortfall/refund/harvest terms. Razorpay payment.
Backend: hold/atomic assignment, verified payment, unique tree-season, release reservation on failed/expired checkout, authenticated account ownership, adoption ID. Preserve selected tree and destination through login.


### Page 13 — Adoption Success `/adoption-success` (PRESENTED; NOT LOCKED)
Hero: **“It's official. You have a tree of your own.”**  
Copy: “Somewhere in our orchard, a tree now has your name connected to it. Thank you for becoming a part of Kesari Van. Your season with us has begun.”
Show actual tree confirmation card: Tree KV-021 (sample only), photo, ID, Gir Kesar, ₹6,499, 25 kg minimum, adoption ID, season. Next steps: adoption confirmed; orchard-wide updates; follow season; harvest/delivery. Buttons View My Adoption; Explore Orchard; Plan Visit.
Only verified success. No duplicate assignment on refresh. Handle pending/failure. Weekly updates are orchard-wide video/update once weekly, sent collectively via email and WhatsApp (not individual per-tree web feed). Account stores tree ID/photo/status, confirmation/certificate, harvest/delivery, visit access.


### Page 14 — Orchard Visit `/visit` (PRESENTED; ALSO REVIEWED AS A MAJOR PAGE LATER)
Hero eyebrow: `COME A LITTLE CLOSER`  
Headline: **“Some things are better experienced in person.”**  
Copy: “Walk beneath the trees. See where your mangoes grow. Experience the orchard beyond the box that reaches your home.”  
CTAs: Plan Your Visit; Take a Look Around.
Philosophy: **“It's not a tourist attraction. It's our orchard.”** Explain Kesari Van is a real working orchard; seasonal conditions and daily farm activity vary.
Highlights: walk beneath trees; see how mangoes grow; discover varieties; see pruning, irrigation, fruit protection and orchard care.
Seasonal gallery: New Growth, Flowering, Fruit Development, Harvest. Each visit depends on the actual season.
Location: Umbhel, Kamrej, Surat, Gujarat, India. Map pin must be verified before production. Visits by prior request and confirmation.
Visit process: submit request → preferred date and visitors → orchard review → confirmation or alternate date → visit only after confirmation.
Request form: name, mobile, email (optional), preferred date, number of visitors, optional message. Save to Supabase and admin. Status: Pending / Confirmed / Reschedule / Declined. Acknowledgement after submission, but no instant booking or payment.
Guidelines: prior confirmation required; comfortable footwear; supervise children; respect orchard/property/staff; do not pick fruit or enter restricted areas unless allowed. Weather, safety, and farm operations can affect visits. Orchard Visit Guidelines are **not a separate standalone page**.
Closing: **“We'll leave the gate open for you.”**
Design: authentic photography, relaxed editorial, no tourism aesthetic, mobile-first request form, no fake calendar availability.


### Page 15 — Journal `/journal` (PRESENTED; ALSO REVIEWED AS A MAJOR PAGE LATER)
Hero eyebrow: `NOTES FROM THE ORCHARD`  
Headline: **“There is always something growing.”**  
Copy: “Some stories are about mangoes. Some are about the trees, the people, the weather, the mistakes, and the little things we learn along the way. At Kesari Van, the orchard is always changing. This is where we share a little of that journey. No forced publishing schedule. Only real stories worth sharing.”
Featured story: dynamically selected by admin; cover, title, excerpt, read link. Never use fake published stories.
Categories/filters: All Stories; Orchard Updates; Growing Mangoes; Farming Practices; Life at Kesari Van; Behind the Scenes.
Story cards: real cover image, category, title, excerpt, publication date, reading time, read story link.
Example themes (not published content): orchard waking/new flush; pruning; individual fruit protection; building Kesari Van.
Seasonal groupings: flowering, fruit development, orchard care, harvest; dynamic tags, not rigid category.
Optional **A Note from the Orchard**: short personal observation. Show only when a real note exists; no AI-generated filler.
Load more: initial 6 articles, then 6; filter resets pagination; only published posts; empty state for no results; no infinite scroll.
Empty state: “There are stories taking shape. We're out in the orchard, busy growing a few. Come back when the next story is ready.”
Closing: **“Every season leaves a story behind.”** CTA Explore the Orchard; secondary Shop Mangoes.
Admin CMS: draft/published/archived, cover and multiple images, captions/alt, category, tags, season, featured, excerpt, rich content blocks, date, slug, SEO, preview, publish/unpublish, related-story control or automatic related articles.
Mobile: single column, full-width feature, horizontal category filters, comfortable reading, no autoplay videos.


### Page 16 — Individual Journal Article `/journal/:slug` (PRESENTED; TEMPLATE HANDLED WITH JOURNAL SYSTEM)
Editorial article header: category, title, subtitle, date, reading time, cover. Content supports paragraphs, headings, images/captions, lists, quotes, links, video embeds. Sample pruning story is layout-only, not a published article. Footer: related stories, links to Orchard/Farming/Shop, share/copy link, breadcrumbs, SEO. Admin preview and mobile reading width. No fixed promotional CTA.


### Page 17 — Contact `/contact` (PRESENTED; NOT LOCKED)
Hero headline: **“Connect with the Soil.”**  
Copy: “Whether you have a question about our mangoes, want to adopt a tree, plan a visit, or simply want to know more about Kesari Van—we're here.”
Form: name, mobile, email, category, message. Submit to Supabase, generate reference number, admin notification. Provide direct WhatsApp/email contact only when actual official details are configured. Include orchard location, FAQ teaser, and contact paths for mango orders, adoption, visits, general questions. Brand phrase “Connect with the Soil.” is a recurring expression, not limited to this page.


### Page 18 — FAQ `/faq` (PRESENTED; NOT LOCKED)
Categories: All; Mangoes; Orders & Delivery; Tree Adoption; Orchard Visits; Payments. Search/category accordion, editable through admin, SEO, contact link.
Questions/answer topics:
- Variety: Gir Kesar; grown in Surat.
- Seasonal availability; size variation; product comparisons; not certified organic.
- Delivery regions: Gujarat, Maharashtra, Rajasthan, Madhya Pradesh, subject to serviceability.
- Shipping separate; tracking; cancellation by order status; packaging.
- Adoption: selected tree; 100 out of 900+ only if actual rollout; specific-tree selection; ₹6,499; 25 kg guarantee; eligible excess belongs adopter subject final terms; shortfall resolution to be finalized; orchard-wide updates via WhatsApp/email; visits by prior arrangement; shipping separate.
- Visits: prior booking, child supervision, working orchard.
- Payment methods configured; payment details handled by provider; failure/pending states.
Closing phrase: “Connect with the Soil.”


### Page 19 — Shipping & Delivery `/shipping` (PRESENTED; NOT LOCKED)
Hero: **“A little journey from the orchard to you.”**
Coverage: Gujarat, Maharashtra, Rajasthan, Madhya Pradesh, subject to PIN serviceability. PIN checker.
Packing:
- Premium Kesar 10 kg, mangoes 200 g+.
- Golden Kesar 10 kg, mangoes 250 g+, individual protection bags.
- Signature Harvest 12 mangoes, 300 g+ handpicked.
Journey: Harvest → Selection → Packing → Dispatch → Delivery.
Shipping is separate. Charges depend on PIN, weight/box, courier; do not show invented charges or estimate where no reliable calculation exists. Delivery windows must be based on actual courier/operational configuration, not blanket promises.
Tracking in account: Order Placed → Preparing → On Its Way → Delivered.\nRipening/storage guidance must be verified. Damage/issue reporting: order number, photos, contact promptly under finalized policy. Backend: PIN, rates, tracking, status, region configuration, contact issues. Include delivery attempt/recipient availability, failed perishable delivery, damage-reporting window, courier/weather disruptions, and clear harvest/dispatch/delivery distinctions in final copy.


### Page 20 — Cancellation & Refund `/refund-policy` (PRESENTED; NOT LOCKED)
Hero: **“We believe trust grows when things are clear.”**
Policy topics:
- Mango order cancellation request before processing; once preparation/dispatch advances, cancellation may be restricted due perishability, subject to final fair policy and law.
- Incorrect address and customer responsibility; delivery attempt/perishable shipment handling.
- Damaged/poor product reporting promptly with order number and photos/video; review and refund/replacement/agreed remedy.
- Delivery issues table, process Contact → Review → Resolution → Refund.
- Refund timelines to be verified and published.
- Adoption: payment confirmation, tree unavailable, cancellation stage, guarantee shortfall, excess yield, shipping. These must be specifically addressed and not left vague.
Admin states: Issue Received → Under Review → Approved/Declined → Refund Initiated → Completed.
No blanket “non-refundable” terms without legal/operational review. Page presented, not locked.


### Page 21 — Privacy Policy `/privacy-policy` (PRESENTED; NOT LOCKED)
Hero: **“Your information deserves the same care as our trees.”**
Policy sections:
1. Information collected: name, mobile, email, addresses, PIN, orders, Tree ID, visit request, messages, account/auth information.
2. Uses: account, OTP/authentication, orders, shipping, tracking, adoption, updates, support, visits, analytics, legal compliance.
3. Payment: handled by payment provider; do not store full card/payment credentials.
4. Authentication and security.
5. Adoption information.
6. Email/WhatsApp communications; marketing consent separate.
7. Providers (payment, logistics, email, WhatsApp, hosting, etc.)—list actual configured vendors, no data sale claim only if true.
8. Security practices.
9. Cookies/analytics.
10. Retention.
11. Access/correction/deletion/opt-out rights.
12. Children.
13. Changes.
14. Privacy contact.
UX: desktop sticky TOC; mobile compact expandable TOC; accessible from footer, forms, login, checkout. Final content must reflect actual vendors, cookie behavior, retention, consent and be reviewed against applicable Indian privacy/data protection law (including DPDP obligations as applicable).


### Page 22 — Terms & Conditions `/terms` (PRESENTED; NOT LOCKED)
Hero eyebrow: `THE DETAILS THAT KEEP THINGS CLEAR`  
Headline: **“A little clarity goes a long way.”**  
Intro: “These terms explain how Kesari Van's website, mango collections, orders, and services work. By using our website or placing an order, you agree to the applicable terms described here.”
Sections:
1. About Kesari Van: website offers mango products, seasonal produce, tree adoption, orchard content, visit requests; operated from Gujarat, India.
2. Acceptance: website use, account, order or service means acceptance of terms/policies.
3. Eligibility & accounts: accurate information, OTP account, secure access, no fraud/misuse; certain services may require 18+.
4. Products & availability: agricultural availability, seasonal variation; photographs illustrative; specs on product page; prices/availability may change before acceptance; subject to inventory/fulfilment.
5. Orders & payments: checkout; displayed price; shipping separately unless stated; payment verified; fraud/duplicate/irregular transactions; applicable policies govern cancellations/refunds.
6. Natural variation: size, shape, colour, aroma, texture, ripening vary; natural variation distinct from damage/incorrect product.
7. Shipping & delivery: serviceability, courier, seasonal conditions; link Shipping Policy.
8. Tree adoption: separate seasonal service with separate Tree Adoption Terms.
9. Orchard visits: prior confirmation, farm instructions, safety, children supervised, restricted areas; cancellation/rescheduling due weather, activities or safety.
10. Intellectual property: photos, branding, logos, text, design, videos owned/licensed; no unauthorized reproduction/commercial use.
11. Website use: no unauthorized access, disruption, malicious content, form abuse or impersonation.
12. Limitations: agricultural factors beyond control; limitations must not contradict explicit promises or consumer rights.
13. Changes: publish updates; no improper retrospective alteration of existing commitments.
14. Governing law/disputes: India law; finalize dispute/jurisdiction clause legally.
15. Contact.
UX: narrow reading column, sticky TOC desktop, compact TOC mobile, numbered sections, links to related policies, effective date. No animations/popups. Legal review required before launch.
Legal footer structure should link Terms, Tree Adoption Terms, Shipping, Cancellation & Refund, Privacy, Orchard Visit information.


### Page 23 — Tree Adoption Terms `/adoption-terms` (APPROVED)
Dedicated agreement for seasonal adoption of a specific mango tree. Separate from general website terms.
Hero eyebrow: `TREE ADOPTION · SEASONAL AGREEMENT`  
Headline: **“A tree of your own. A season to share.”**  
Intro: explain selected tree, benefits, harvest guarantee, responsibilities, seasonal commitment.
Key terms panel:
- Adoption fee: ₹6,499/season (current proposed program figure).
- One individually selected tree.
- Variety: Gir Kesar.
- Minimum harvest guarantee: 25 kg.
- Excess eligible harvest beyond 25 kg belongs to adopter.
- Shipping charged separately.
- Term: one mango season.

Full sections:
1. Nature of adoption: seasonal agricultural participation; no land, orchard, permanent tree ownership/property rights.
2. Tree selection: customer chooses available Tree ID/photo; subject to availability/payment; ID linked after confirmation; substitutions follow policy.
3. Adoption period: one designated season; no automatic renewal.
4. Fee/payment: ₹6,499 unless different displayed price; payment verification; shipping separately; taxes/charges disclosed.
5. Minimum harvest guarantee: 25 kg. Explain how shortfall is fulfilled; exact mechanism is still to be finalized. Guarantee must not be contradicted by agricultural disclaimer.
6. Excess harvest: eligible yield above 25 kg belongs to adopter; final terms must define measurement, all fruit inclusion, communication, shipments, and shipping costs.
7. Orchard care & risks: reasonable care; weather, flowering, fruit drop, pests/disease, tree health, environmental events affect yield/timing, but do not override guarantee.
8. Updates: orchard-wide seasonal video/information shared collectively via WhatsApp/email; no individualized weekly feed guaranteed.
9. Visits: request-based, availability and confirmation; not unlimited or guaranteed dates; guidelines apply.
10. Harvest/fulfilment: describe timing, staggered harvest, guarantee calculation, selection/packing, surplus, shipping. Timing is season-dependent.
11. Shipping: separately charged; PIN serviceability, rates, courier, readiness, weather; perishable delivery and failed delivery handled by Shipping/Refund policies.
12. Substitution: notify adopter; explain reason; offer comparable tree if feasible; adopter choice/resolution as defined. No silent substitution.
13. Cancellation/refund: stage-specific, fair and legal; distinguish before allocation, after assignment, farm-side cancellation, shortfall, failed/duplicate payment. Do not assume all payments non-refundable.
14. Adopter responsibilities: accurate contact/delivery, access to communications, timely details, visits conduct, understand seasonal/no property ownership.
15. Force majeure: severe weather, floods, drought, disasters, transport, government restrictions, etc. Explain communication and handling of guarantees; do not use as automatic guarantee cancellation.
16. Privacy: linked Privacy Policy.
17. Acceptance: required unchecked checkbox at adoption checkout; record terms version, user, Tree ID, timestamp, adoption transaction securely.
18. Changes: future seasons; no improper retrospective changes.
19. Governing law: India; legal review.
20. Contact: **Connect with the Soil.**

Design: narrow readable column, desktop sticky section nav, mobile jump-to-section, top key-term summary, links to general terms/shipping/refund/privacy/orchard visit. No clutter.
**Critical unresolved operational decisions:** shortfall source/fulfilment, entire-orchard poor season handling, cap or no cap on quantity, excess-yield calculation, cancellation after Tree ID assignment, tree death/unusable tree substitution/refund, number of shipments, shipping costs for guarantee/excess. Must be decided and accurately disclosed before launch.
Approved as a page concept/content structure. Legal wording still requires professional review and unresolved business rules must be finalized.


### Login/Register — REMOVED AS A CUSTOM PAGE
No bespoke login/register page design or custom OTP screen. Use the configured Supabase Auth flow as the single authentication mechanism across the site. Authentication provider/method should be selected/configured within Supabase and the auth experience integrated consistently.

### Page 25 — My Account Dashboard `/account` (PRESENTED; account subpages DELEGATED)
Account system is a personalized customer area. Do not review each account subpage separately; design/build the entire account system with consistent components.
Purpose: customer can see orders, track order, see adopted tree, adoption status, delivery details, visit requests, profile and support.
Dashboard overview cards: My Orders count; My Trees count; Addresses shortcut; Profile shortcut. Counts are dynamic, not hard-coded.
Welcome: “Welcome back.” plus personalized first name when available. Copy: “A little space to keep track of everything growing with us.”
Active orders first: product image, name/spec, order ID, status, amount, quantity, backend progress timeline Order Confirmed → Preparing → Dispatched → Delivered (actual status). View Order Details. Delivered orders move to history. Empty state CTA Explore Mangoes.
Adopted trees section: “Somewhere in the orchard, there's a tree connected to you.” Show actual adopted tree photo/ID, variety, season, adoption status, minimum guarantee, View My Tree. Detail includes ID/photo, date/status, confirmation/certificate, terms, harvest/delivery info, visit request access, relevant updates. No individual weekly feed; collective update communications. No-adoption state CTA Explore Tree Adoption.
Recent orders: compact list of order ID/date/status; View All Orders. Account navigation:
- Overview
- My Orders
- My Adopted Trees
- My Addresses
- My Profile
- My Orchard Visits
- Help & Contact
- Logout
Desktop sidebar; mobile compact menu/tabs, vertical content cards.
Address shortcut: name, mobile, address, city/state/PIN, label, default; add/edit/remove/default. Prevent unsafe deletion if tied to pending transaction.
Profile: name, authenticated mobile, email, verification status as applicable, profile updates, communication preferences, logout. Mobile change uses secure Supabase process.
Visit requests: pending/confirmed/reschedule/completed/cancelled; requested date, visitors, message; CTA request visit.
Empty states for no orders/no adoption; calm encouraging copy and CTAs.
Technical: profile, orders, order items, statuses, adoptions, tree records, addresses, visit requests all user-linked. RLS restricts customer to own records. Never trust client-supplied user IDs. Admin roles separately authorized. Payment state not customer-editable. Secure logout/session handling.
Design: brand palette, Cormorant/Manrope, soft cards, subtle shadows, real photography, responsive independently. Dashboard subpages `/account/orders`, `/account/orders/:id`, `/account/adoptions`, `/account/adoptions/:id`, `/account/addresses`, `/account/profile`, `/account/visits` are implementation scope, not individual review pages.

### Major page — Orchard Visit `/visit` (REVIEWED AGAIN; SAME ROUTE AS PAGE 14, NOT A NEW ROUTE)\nThis is a major customer-facing page, but it is the same Visit page above. Do not create a duplicate page or route.
Hero eyebrow: `COME A LITTLE CLOSER`  
Headline: **“Some things are better experienced in person.”**  
Copy: “Walk beneath the trees. See where your mangoes grow. Experience the orchard beyond the box that reaches your home.”  
CTAs: Plan Your Visit; Take a Look Around.
Philosophy: **“It's not a tourist attraction. It's our orchard.”** Real working farm, seasonal variability.
Highlights: walk beneath trees; see mango growth; discover varieties; see irrigation, pruning, fruit protection, everyday care.
Season gallery: New Growth, Flowering, Fruit Development, Harvest.
Location Umbhel, Kamrej, Surat, Gujarat; prior request and confirmation; verified map pin.
Visit request flow and fields as above. Save in Supabase, admin manage, status. No instant booking. Acknowledgement only.
Visit conduct/safety guidance embedded here and FAQ; no standalone Orchard Visit Guidelines page.
Close: **“We'll leave the gate open for you.”**

### Major page — Journal `/journal` (REVIEWED AGAIN; SAME ROUTE AS PAGE 15, NOT A NEW ROUTE)
This is the journal hub above, not a duplicate route. Main concept: **“There is always something growing.”** Editorial storytelling, authentic orchard content, featured article, category filters, cards, seasonal grouping, optional orchard note, load-more, empty state, closing CTA, CMS. No fake stories. Article route `/journal/:slug` is handled as a template within this system.

---
## 5. Account subpages (build scope, not individual review pages)
### Orders list `/account/orders`
List customer orders, active first or clearly grouped; order ID, date, item preview, total, status, view details; filter/history if needed. Empty state links to shop.
### Order details `/account/orders/:id`
Full order items, amounts, address snapshot, payment status, tracking, backend-driven timeline, support/contact for issues. Never expose another user's order; RLS/authorization.
### Adopted trees `/account/adoptions`
List all adopted trees with photo, Tree ID, season, status, link to details. Empty state adoption CTA.
### Adoption details `/account/adoptions/:id`
Tree photo/ID, variety, adoption season/date/status, confirmation/certificate, terms, harvest/delivery status, visit request; updates are orchard-wide, not individualized feed.
### Addresses `/account/addresses`
CRUD, default address, validation, safe removal.
### Profile `/account/profile`
Update name/email/preferences; phone identity via secure Supabase auth flow.
### Visit requests `/account/visits`
Past/upcoming request list and status; details and cancellation/reschedule request if supported.
These pages should share account navigation, mobile patterns, empty/error/loading states.

---
## 6. Authentication & checkout architecture (important change)
**Supabase Auth is the single authentication system.** Do not build custom Login/Register pages, custom OTP verification screens, or duplicated authentication logic in checkout.
- Integrate the Supabase Auth flow configured for the project.
- Existing users sign in; new users register using the same auth experience/provider.
- Authentication state centrally managed.
- Protected checkout, adoption checkout, and account routes.
- Preserve intended destination after auth.
- Preserve cart contents, quantities, and selected Tree ID across auth.
- Account data, orders, and adoptions link to authenticated Supabase user ID.
- Supabase session security; route protection is not sufficient by itself.
- RLS and backend authorization are mandatory.
- No guest checkout: customer must authenticate before completing checkout.
- Cart can exist pre-authentication and safely merge after sign-in without losing items or duplicating lines.
- Mobile-number changes require secure auth-supported flow; do not directly edit identity fields.

---
## 7. Tree Adoption inventory and transaction logic

- Orchard has ~900+ trees, subject to verification.
- Launch collection: 100 actual trees, subject to confirmation before launch.
- Every tree card/photo/ID must correspond to real inventory.
- ID convention suggested: KV-001…KV-100 (verify actual assigned IDs).
- Customer selects exact tree.
- Status: Available → Reserved (checkout hold) → Adopted.
- Hold expires after configurable period; release if payment fails or checkout expires.
- Assignment only after verified payment.
- Use atomic reservation and uniqueness constraints for tree/season adoption; prevent two customers adopting same tree.
- No fake scarcity or fake tree photos.
- Adoption price ₹6,499/season, 25 kg minimum, excess eligible yield to adopter, shipping separately (current proposed terms).
- Admin can manage photos, ID, variety, status, season, reservations, adoption.
- Tree substitution must be communicated; no silent replacement.

**Weekly updates:** Create one orchard-wide update/video weekly (when operationally feasible) and send collectively to all adopters by WhatsApp and email. Do not create an individual weekly update feed for every adopted tree on the website. Optional special-case personal updates may be considered separately, not promised at launch. Consent, WhatsApp templates/opt-in, email preferences, unsubscribe/marketing separation must be handled correctly.

---
## 8. Technical architecture (proposed)
- Frontend: React + Vite.
- Hosting: Cloudflare Pages.
- Repository: private GitHub repo.
- Backend/data/auth/storage: Supabase (database, Auth, Storage, Edge Functions, RLS).
- Payments: Razorpay.
- Domain: `kesarivan.in`; `www` redirects to canonical domain. No launch subdomains. Admin under `/admin`; no separate `api.kesarivan.in`.
- Secrets remain server-side. Payment verification, signatures/webhooks, idempotency, inventory/checkout transactions are backend enforced.
- Customer-facing frontend cannot mark payment as paid.
- Order/payment state machine must distinguish pending, failed, paid/confirmed, processing, dispatched, delivered, cancelled/refunded as appropriate.
- Inventory checks at cart and checkout; avoid overselling.
- Admin role separate from customer. RLS and authorization policies on all sensitive tables.
- Supabase Auth is shared for commerce, adoption, account, and visit access where required.

### Suggested data domains
- Profiles
- Products
- Product inventory
- Product media
- Cart/cart items (persistent/temporary strategy)
- Orders
- Order items (snapshot product details at purchase)
- Payments/payment events
- Addresses
- Trees
- Tree reservations
- Adoptions
- Adoption season records/terms version
- Visit requests
- Journal articles/categories/tags/media
- Contact enquiries
- Shipping zones/rates/serviceability
- Communication preferences/consent
- Orchard updates (collective content and delivery logs as appropriate)
- Refund/cancellation requests
- Admin settings/audit events

### Admin scope
- Products
- Inventory
- Orders and order details
- Adoptions/tree inventory/reservations
- Customers
- Journal CMS
- Visit requests
- Contact enquiries
- Settings (shipping/serviceability, rates, seasons, configurable content, communication, etc.)
- Order status updates and customer communication
- Orchard-wide update creation/sending workflow
- Refund/cancellation case workflow
- Role and permission controls

---
## 9. Payment, inventory, and reliability requirements
- Razorpay integration through secure backend functions.
- Verify payment signatures and webhooks.
- Idempotent order/payment handling; repeated webhooks or refreshes must not create duplicates.
- Inventory validation and reservation/locking where necessary.
- Never trust client-submitted total, paid state, stock, tree availability, or customer ID.
- Show pending payment clearly; do not show success until authoritative backend state.
- Handle payment failure, cancellation, network interruption, webhook delay, duplicate payment, and stock change.
- Preserve user intent and cart across retries.
- Refund states should be recorded and surfaced accurately.

---
## 10. Legal architecture
Footer/legal links should be separate:
1. Terms & Conditions `/terms` — website/general commerce.
2. Tree Adoption Terms `/adoption-terms` — specific tree adoption agreement.
3. Shipping & Delivery `/shipping` — serviceability, charges, packing, delivery, failed perishable delivery, damage reporting.
4. Cancellation & Refund `/refund-policy` — order-stage cancellations, damaged produce, adoption cancellations, shortfall, payment failures.
5. Privacy Policy `/privacy-policy` — data, auth, providers, consent, cookies, retention, rights.
6. Orchard visit guidelines embedded in Visit page and FAQ, not standalone.

Rent A Tree's legal-page structure was reviewed as a reference for operational specificity (not copy to reuse). Their terms emphasize the service nature, tree assignment, seasonal scope, responsibilities, agricultural risks, delivery, and dispute handling. Kesari Van should tailor its policies to its own tree-selection model and guarantees; do not blindly copy a competitor's cancellation rules. Final legal documents should be reviewed for applicable Indian laws and consumer/data-protection obligations.

---
## 11. SEO, performance, accessibility, analytics
- Unique page titles, descriptions, canonical URLs, Open Graph/share images.
- Journal article structured metadata; product metadata where appropriate.
- Avoid indexing admin/account pages or sensitive user content.
- Sitemap and robots configuration.
- Optimize real imagery (responsive sizes, modern formats, lazy loading below fold).
- Hero video: defer, static fallback, mobile alternative, no audio, reduced-motion.
- Avoid excessive JS and animation; prioritize Core Web Vitals.
- Accessible heading hierarchy, alt text, form labels, focus states, keyboard operation, contrast, reduced-motion support.
- Analytics must be configured transparently and respect privacy/consent requirements. Track key funnel events without leaking sensitive personal information.

---
## 12. Implementation priority
### Phase 1 — Core launch
- Sitewide shell, header/footer, responsive design system.
- Homepage, story, orchard, farming, shop, product detail.
- Cart, checkout, payment, order confirmation.
- Supabase Auth integration.
- Account overview and key account functionality.
- Tree adoption pages, selection, checkout, confirmation, backend reservation/payment logic.
- Visit page/request workflow.
- Journal CMS/hub/article template.
- Contact, FAQ, legal policy pages.
- Admin essentials.
- QA, security, responsive, performance, deployment.
### Phase 2 — Enhancements (do not let these delay launch unless explicitly prioritized)
- More sophisticated journal search.
- Additional account convenience features.
- Advanced analytics/marketing automation.
- Personalized tree updates beyond collective weekly orchard updates.
- Additional visual/interactive orchard experiences.

---
## 13. Content and operational items that must be verified before launch
- Exact tree count and variety breakdown.
- Actual adoption inventory of 100 trees and unique IDs/photos.
- Product prices and live inventory.
- Actual packing specifications and weights/counts.
- Shipping zones, serviceability, rate calculation, courier, realistic delivery estimates.
- Harvest/dispatch/delivery windows and operational process.
- Ripening and storage instructions.
- Official WhatsApp/email/contact details and communication consent.
- Visit availability, map location/pin, safety guidance, and confirmation workflow.
- Tree adoption shortfall method, whole-orchard shortfall scenario, excess yield calculation, quantity caps (if any), cancellation after allocation, tree replacement/refund, number of shipments, shipping charges for guarantee/excess.
- Final cancellation/refund timeframes and evidence requirements.
- Legal wording, governing law/dispute provisions, privacy vendor list, retention, cookie/analytics, DPDP and consumer-law review.
- Any certification claims—do not add without actual certification.
- Published Journal stories—only genuine articles.

---
## 14. Review status ledger

### Approved & locked
- Page 01 Homepage
- Page 02 Our Story
- Page 06 Individual Product Page
- Page 23 Tree Adoption Terms (concept/structure approved; final legal wording still review required)

### Presented, not explicitly locked
- Page 03 Orchard
- Page 04 Farming Practices
- Page 05 Shop
- Page 07 Cart
- Page 08 Checkout (updated to Supabase Auth)
- Page 09 Order Confirmation
- Page 10 Adopt a Tree
- Page 11 How Adoption Works
- Page 12 Adoption Checkout
- Page 13 Adoption Success
- Page 14 Orchard Visit
- Page 15 Journal
- Page 16 Individual Journal Article (handled as journal template)
- Page 17 Contact
- Page 18 FAQ
- Page 19 Shipping & Delivery
- Page 20 Refund & Cancellation
- Page 21 Privacy Policy
- Page 22 Terms & Conditions
- Page 25 My Account Dashboard (account subpages delegated to implementation)

### Removed / skipped / consolidated
- Custom Login/Register page: **removed**. Supabase Auth flow is used.
- Custom checkout OTP verification UI: **removed**. Checkout uses the same Supabase Auth flow.
- Page 24 Orchard Visit Guidelines: **skipped as a standalone page**; rules embedded in Visit and FAQ.
- Page 26 Orchard Visit: not a new route/page; duplicate review of existing `/visit` concept.
- Page 27 Journal: not a new route/page; duplicate review of existing `/journal` concept.
- Account subpages: not individually reviewed; handled as part of the account system.

---
## 15. Final design/build direction
The finished site should feel like Kesari Van: an orchard growing in real time, not a business pretending to be larger or more polished than it is. Premium design should come from thoughtful typography, real photography, consistency, trust, whitespace, and excellent functionality—not inflated marketing.

Build the real commerce and adoption flows first, ensure payments/auth/data security are correct, and make every public page support the central brand idea: **Connect with the Soil.**
