# Project concept artwork

Generated on 17 November 2026 with the built-in image generation tool. These images illustrate projects in development; they are not screenshots of released software. Each project has its own visual identity and a composition chosen to explain its main purpose. The images appear on homepage and directory cards and at larger size inside project detail previews.

## Assets

Final images live in `public/projects/`. Each project has a `-concept.webp` image (1536 x 1024) and a `-concept-640.webp` card image (640 x 427). Explicit dimensions, descriptive alternative text, lazy loading, and static WebP delivery preserve layout and keep image delivery independent of a runtime optimisation service.

| Project | Full image | Card image |
| --- | --- | --- |
| SlotBreeze | `public/projects/slotbreeze-concept.webp` | `public/projects/slotbreeze-concept-640.webp` |
| ProofHuddle | `public/projects/proofhuddle-concept.webp` | `public/projects/proofhuddle-concept-640.webp` |
| EnquiryWing | `public/projects/enquirywing-concept.webp` | `public/projects/enquirywing-concept-640.webp` |
| UptimePerch | `public/projects/uptimeperch-concept.webp` | `public/projects/uptimeperch-concept-640.webp` |

Original generated PNGs are preserved locally under the ignored `artifacts/project-artwork-v2/source/` directory. Only the optimised WebP assets and this prompt record are intended for version control. Private project PDFs remain excluded.

## Art direction

- SlotBreeze: a warm cream, sage, and terracotta home-service website showing the customer choosing a service, date, and available time before confirming a booking.
- ProofHuddle: a charcoal and burnt-orange creative review workspace with a poster proof, anchored feedback, version context, and an explicit approval decision.
- EnquiryWing: a lavender and plum workflow showing the original enquiry, extracted facts, missing details, a suggested response, and human approval.
- UptimePerch: a dark forest monitoring console showing observed service health, response times, an interruption, recovery, and release context.

The project subject takes priority over matching the portfolio website's palette. All visuals remain labelled as illustrative concepts, and all four projects remain in development.

## Final generation prompts

### slotbreeze

```text
Use case: ui-mockup.
Asset type: a project-specific landscape image for a software portfolio, reused in a thumbnail and a large illustrative product preview.
Create a complete original, carefully art-directed 1536 x 1024 landscape digital product visual, 3:2 aspect ratio. It must communicate the product's actual purpose at a glance. Use a flat front-facing interface, edge-to-edge with a narrow 2 percent surround. This is a designed software concept, not an actual released application screenshot. Information hierarchy, precise readable typography, thoughtful spacing, realistic workflow content, and original graphic design are essential. No need to match a blue portfolio website. No generic common dashboard template, no pointless KPI blocks, no floating UI shards, no device frames, no laptops, no people with malformed hands, no robots, no AI star symbols, no glowing particles, no glassmorphism, no decorative rainbow gradients, no random objects, no fake corporate logos, no watermark. Use the exact product name correctly. Keep body copy short and legible. Do not add a promotional headline outside the application.
Project: SlotBreeze, a service business website with online appointment booking. Show the CUSTOMER booking experience, not an internal calendar dashboard.
Visual identity: warm cream, muted sage, rich terracotta actions, soft daylight, calm approachable typography. A home-services product that feels tangible and welcoming.
Layout: a minimal white masthead with exact wordmark "SlotBreeze", small navigation "Services", "How it works", "My booking". Below, two balanced halves. Left: an editorial photograph of a naturally lit tidy living room, pale oak furniture, linen sofa, a clean wooden floor, a single folded cloth and an understated cleaning caddy near the doorway; believable architectural photography without people, CGI gloss, or excessive plants. The photograph occupies the upper left and is neatly framed as part of the business website. Under it, the concise heading "A clean home, on your schedule." and two short service rows "Home cleaning" and "Deep cleaning", with simple line icons and a small selected state on Home cleaning.
Right: a prominent well-crafted booking panel titled "Book your home clean". A three-step line "Service / Date & time / Confirm", with Date & time selected. A proper November 2026 month calendar grid with weekday headings and the 17th selected in terracotta. Below it three clear available-time buttons "09:00", "11:00", "14:00", with 11:00 selected. Small booking summary "Home cleaning", "Tuesday, 17 November", "11:00 - 13:00", then one solid terracotta action "Confirm booking". Avoid prices, payment widgets or staff dashboards. Tiny footer "Booking concept". Ensure the service, available time, and confirmation journey dominate. It must unmistakably look like useful home-service booking software.
```

### proofhuddle

```text
Use case: ui-mockup.
Asset type: a project-specific landscape image for a software portfolio, reused in a thumbnail and a large illustrative product preview.
Create a complete original, carefully art-directed 1536 x 1024 landscape digital product visual, 3:2 aspect ratio. It must communicate the product's actual purpose at a glance. Use a flat front-facing interface, edge-to-edge with a narrow 2 percent surround. This is a designed software concept, not an actual released application screenshot. Information hierarchy, precise readable typography, thoughtful spacing, realistic workflow content, and original graphic design are essential. No need to match a blue portfolio website. No generic common dashboard template, no pointless KPI blocks, no floating UI shards, no device frames, no laptops, no people with malformed hands, no robots, no AI star symbols, no glowing particles, no glassmorphism, no decorative rainbow gradients, no random objects, no fake corporate logos, no watermark. Use the exact product name correctly. Keep body copy short and legible. Do not add a promotional headline outside the application.
Project: ProofHuddle, client feedback, revisions, and approval of a specific deliverable version. The image must immediately communicate CREATIVE WORK UNDER REVIEW.
Visual identity: charcoal creative workspace, warm white proof, burnt-orange controls and annotation markers; editorial design studio aesthetic. Crisp typography. A distinct review canvas, not a calendar or generic business dashboard.
Layout: full-width narrow charcoal toolbar with exact product name "ProofHuddle" in warm white at left, project title "Studio launch / Poster review" near center, and version control "V1   V2   V3" with V3 clearly selected at right. The main 70 percent is a dark charcoal review canvas with a large beautiful flat artboard centered on it. The proof is a genuinely art-directed typographic exhibition poster: large black serif letters "FORM & FIELD", cream stock, a terracotta geometric arch, a small moss-green circle, fine editorial spacing, small text "Design exhibition / 18-22 June". The poster must look intentional and memorable. Two small orange numbered comment pins labelled "1" and "2" sit on precise locations on the poster. Do not obscure the poster heading.
The right 30 percent is a warm white client review sidebar titled "Feedback on V3". Two clearly separated comments with plain initial circles: "ML" beside "The composition works well." and "JR" beside "Can we give the date more space?" A small reply field below "Add feedback". The lower right approval section shows exact label "Decision for version 3", a dominant burnt-orange button "Approve version", and a quiet secondary "Request changes". Across the bottom of canvas a compact version history "V1 shared / V2 revised / V3 awaiting approval". Tiny "Concept preview" footer. No stock photography or charts. The visual story must be a design proof, anchored comments, versioning and an explicit final decision.
```

### enquirywing

```text
Use case: ui-mockup.
Asset type: a project-specific landscape image for a software portfolio, reused in a thumbnail and a large illustrative product preview.
Create a complete original, carefully art-directed 1536 x 1024 landscape digital product visual, 3:2 aspect ratio. It must communicate the product's actual purpose at a glance. Use a flat front-facing interface, edge-to-edge with a narrow 2 percent surround. This is a designed software concept, not an actual released application screenshot. Information hierarchy, precise readable typography, thoughtful spacing, realistic workflow content, and original graphic design are essential. No need to match a blue portfolio website. No generic common dashboard template, no pointless KPI blocks, no floating UI shards, no device frames, no laptops, no people with malformed hands, no robots, no AI star symbols, no glowing particles, no glassmorphism, no decorative rainbow gradients, no random objects, no fake corporate logos, no watermark. Use the exact product name correctly. Keep body copy short and legible. Do not add a promotional headline outside the application.
Project: EnquiryWing, an AI-assisted enquiry organiser that prepares a useful reply for a HUMAN to approve. The image must convey a progression from a messy incoming request to organised facts to a reviewed response.
Visual identity: pale lavender and warm white surfaces, dark plum typography, deep purple actions, a small muted golden accent on the human-review stage. Friendly intelligent business software with editorial discipline. No dark left navigation bar.
Layout: a slim top header with exact wordmark "EnquiryWing", short navigation "Enquiries", "Replies", "Settings", small user-initial circle "AK". Main page title "A useful next step for every enquiry." Underneath create three large aligned vertical columns with substantial readable content. Numbered section headers with a thin, subtle connecting line or arrows between them: "1 / Incoming enquiry", "2 / Organised brief", "3 / Human review".
First column resembles a simple incoming message: sender label "New website enquiry", subject "Can customers book online?", and text exactly "We run a cleaning business and want customers to book a service on our website. Where should we start?" A small footer "Original message".
Second column has a precise structured brief: "Service" followed by "Booking website", "Budget" followed by "Not provided", "Timeline" followed by "Not provided". A distinct small section "Questions to ask" with two lines "Which services can customers book?" and "Do you have an existing website?". This must look like clear extraction of the actual message, not invented information or lead scoring.
Third column is slightly visually emphasised with a very pale golden header label "Awaiting your review". Main label "Suggested reply". Short draft text exactly "Thanks for getting in touch. Which services would you like customers to book, and do you have an existing website?" Below, an unobtrusive human reviewer row "AK / Business owner", a small editable pencil icon, and a deep purple button "Approve reply". Small explanatory line "You review every reply before it is sent." Tiny footer "Concept preview". No automatic sending claims, confidence percentages, invented budgets, robotic characters, or email platform logos. Make the human decision at the end of the workflow visually obvious.
```

### uptimeperch

```text
Use case: ui-mockup.
Asset type: a project-specific landscape image for a software portfolio, reused in a thumbnail and a large illustrative product preview.
Create a complete original, carefully art-directed 1536 x 1024 landscape digital product visual, 3:2 aspect ratio. It must communicate the product's actual purpose at a glance. Use a flat front-facing interface, edge-to-edge with a narrow 2 percent surround. This is a designed software concept, not an actual released application screenshot. Information hierarchy, precise readable typography, thoughtful spacing, realistic workflow content, and original graphic design are essential. No need to match a blue portfolio website. No generic common dashboard template, no pointless KPI blocks, no floating UI shards, no device frames, no laptops, no people with malformed hands, no robots, no AI star symbols, no glowing particles, no glassmorphism, no decorative rainbow gradients, no random objects, no fake corporate logos, no watermark. Use the exact product name correctly. Keep body copy short and legible. Do not add a promotional headline outside the application.
Project: UptimePerch, website availability monitoring, incident detection, recovery, and release visibility. The image must read immediately as a purposeful monitoring console watching real services.
Visual identity: deep forest-black #10211D background, warm off-white type, quiet mint and muted lime status marks, amber only for incident history. Serious restrained operations software. Dark theme done with excellent contrast and sparse borders, no neon glow, no gradients, no cyberpunk look. Refined monospaced numbers with clean sans-serif section titles.
Layout: narrow full-width top bar with exact wordmark "UptimePerch" and navigation "Overview", "Monitors", "Incidents", "Releases". Large but modest status line with a mint dot "All services responding" and smaller timestamp "Last checked 30 seconds ago". Dominant central service table: columns "Service", "Last 24 hours", "Response". Three rows "Company website", "Customer portal", "Booking API"; each has a long narrow strip of 24 little tick rectangles and a response time "184 ms", "236 ms", "192 ms". Mostly muted mint ticks. Customer portal has three amber ticks near the middle followed by mint recovery ticks. Status next to its name "Recovered". This is historical observed check data, no invented uptime percentage.
Below, left 60 percent contains a precise line graph titled "Response time", a low mint line with one meaningful amber-highlighted spike, y-axis in milliseconds, x-axis "00:00", "06:00", "12:00", "18:00". Right 40 percent an elegant incident-and-release timeline showing exact entries "10:58 / Production release v0.3.2", "11:07 / Portal interruption detected", "11:42 / Service recovered". Quiet thin connecting rule, mint recovery dot and amber incident dot. Bottom a slim link row "View incident history" and "Public status page". Tiny "Concept preview" footer. No money numbers, server photographs, clouds, globes, circuitry, random gauges, or unrelated analytics. The service health, interruption and recovery are the story.
```
