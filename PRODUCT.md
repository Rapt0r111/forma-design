# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated by user; session choice: Next.js and React with local server persistence, two linked demo surfaces.

## Users

Primary audiences, equally: (1) potential employers and clients of the maker, judging craft from a working portfolio; (2) demo visitors acting as interior-design customers or studio operators on the fictional FORMA / ПОТОК surfaces.

## Product Purpose

Show two linked projects in place of a rejected joinery site: a public interior-studio enquiry experience (FORMA) and an enquiry-management application (ПОТОК). Success is a visitor completing estimate → stored enquiry → visible deal status, without mistaking the demo for paid work.

## Positioning

The path from public area×package estimate to a persisted CRM card with changeable status. A neighbouring portfolio of stills cannot copy that loop.

## Operating Context

Local Next.js app at `127.0.0.1:4320`. No sign-in. Studio operators of the demo use `/desk`. Enquiries persist in local JSON (`data/leads.json`). Russian UI. No outbound email, SMS, or payments.

## Capabilities and Constraints

FORMA: area 20–500 m² × three packages (concept 2 500 ₽/m², full design 4 500 ₽/m², supervision 6 000 ₽/m²), then a local enquiry with name, contact, optional note, and a required demo-consent checkbox.

ПОТОК: list and board of enquiries; statuses new / contact / proposal / won; notes; CSV export; create enquiry. Status and notes persist through the local API.

Fictional studio and synthetic examples. No claims of paid work. Local-only demonstration, no external messages. Budget for new purchases: zero unless the user later changes that. Production authentication and deployment are outside this local demo.

## Brand Commitments

Names locked: **FORMA** (interior studio), **ПОТОК** (CRM). Old joinery design rejected. Quality guided by user-binding references https://21st.dev/, https://motionsites.ai/, https://ui.shadcn.com/, and https://impeccable.style/. Voice: Russian, honest about demo status. Exact visual system is not product truth; record it in DESIGN.md when asked.

## Evidence on Hand

Three interior photographs as visual references (`public/interior.jpg`, `public/living.jpg`, `public/detail.jpg`), not completed commissions. No real clients, testimonials, or conversion results. Existing GitHub audit is separate from these concepts.

## Product Principles

- Serve the employer and the demo customer in the same build; neither audience is a leftover.
- The estimate-to-status loop must actually work.
- Label the demo; never invent clients, reviews, or paid outcomes.
- Motion is purposeful and respects reduced motion and keyboard use.
- Keep FORMA and ПОТОК as one product pair, not two disconnected sites.

## Accessibility & Inclusion

Keyboard-accessible flows and `prefers-reduced-motion` are required. No WCAG level was confirmed.
