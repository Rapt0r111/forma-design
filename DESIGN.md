---
name: FORMA
description: Night showroom for an interior studio and its CRM — dark walls, glowing plates, champagne brass.
colors:
  champagne-brass: "#e4c28a"
  olive-wash: "#c9d7a8"
  accent-ink: "#16140f"
  night-void: "#090a08"
  night-room: "#10110e"
  night-panel: "#171814"
  ivory: "#f4efe6"
  ivory-dim: "#b8b3a8"
  stone: "#8c877c"
  hairline: "rgba(244, 239, 230, 0.1)"
  hairline-strong: "rgba(244, 239, 230, 0.18)"
  glass: "rgba(12, 13, 11, 0.58)"
  glass-fill: "rgba(255, 255, 255, 0.06)"
  danger: "#e07a6a"
  ok: "#8fbfa0"
typography:
  display:
    fontFamily: "Cormorant Garamond, Iowan Old Style, Palatino, Georgia, serif"
    fontSize: "clamp(52px, 8.4vw, 118px)"
    fontWeight: 500
    lineHeight: 0.92
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Cormorant Garamond, Iowan Old Style, Palatino, Georgia, serif"
    fontSize: "clamp(32px, 4.6vw, 56px)"
    fontWeight: 500
    lineHeight: 1.1
  title:
    fontFamily: "Cormorant Garamond, Iowan Old Style, Palatino, Georgia, serif"
    fontSize: "28px"
    fontWeight: 500
    lineHeight: 1.15
  body:
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.22em"
rounded:
  sm: "12px"
  md: "22px"
  lg: "24px"
  pill: "999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "28px"
  section: "110px"
components:
  button-primary:
    backgroundColor: "{colors.champagne-brass}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "52px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "#ecd4a2"
    textColor: "{colors.accent-ink}"
  button-glass:
    backgroundColor: "{colors.glass-fill}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "52px"
  button-dark:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.night-void}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "52px"
  input:
    backgroundColor: "rgba(255, 255, 255, 0.04)"
    textColor: "{colors.ivory}"
    rounded: "{rounded.sm}"
    padding: "14px"
  card:
    backgroundColor: "{colors.night-room}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.lg}"
    padding: "32px"
  nav-pill:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.pill}"
    padding: "8px 10px 8px 22px"
    height: "64px"
---

# Design System: FORMA

## Overview

**Creative North Star: "The Night Showroom"**

FORMA is an after-hours gallery. Walls are near-black olive (`#090a08`). Interiors on the plates are the only real light. Champagne brass is the metal of the room — rare, warm, never yellow spray. The UI recedes so a photograph can sell the space; type is a caption, not a billboard farm.

Density is sparse. Large serif display, short body, generous section air (`110px` vertical). Motion is cinematic and bound to scroll or hover on inner content — nothing jumps the layout. ПОТОК shares the same night and the same metal; it is quieter, more desk than showroom, but not a second brand.

Confirmed rejections: the old joinery site; beige AI landing pages; neon SaaS chrome; fake clients as decoration.

**Key Characteristics:**
- Dark olive-black rooms, ivory type, one metal
- Photographs lead; chrome is glass and hairline
- Cormorant Garamond for display, Manrope for work
- Pill CTAs, 22–24px rooms, no layout-shifting hover
- Honest demo labels stay visible

## Colors

Night walls, warm ivory type, one brass, one olive wash. Color-scheme is dark.

### Primary
- **Champagne brass** (`#e4c28a`): CTAs, eyebrows, progress, selection, focus ring. The only metal that may call for a click.

### Secondary
- **Olive wash** (`#c9d7a8`): atmospheric orbs and rare washes. Never a second CTA color.

### Neutral
- **Night void** (`#090a08`): page ground.
- **Night room** (`#10110e`): elevated boards, cards, lookbook.
- **Night panel** (`#171814`): nested panels.
- **Ivory** (`#f4efe6`): primary text.
- **Ivory dim** (`#b8b3a8`): supporting copy.
- **Stone** (`#8c877c`): meta, hints, timestamps.
- **Hairline** (`rgba(244, 239, 230, 0.1)` / strong `0.18`): borders.
- **Glass** (`rgba(12, 13, 11, 0.58)`): nav and overlays with blur.
- **Danger** (`#e07a6a`) / **Ok** (`#8fbfa0`): form error and success only.
- **Accent ink** (`#16140f`): text on brass.

### Named Rules
**The One Metal Rule.** Champagne brass is used on ≤10% of any screen. If a second gold appears, one of them is wrong.

**The Photo Is The Work Rule.** Do not cover a hero plate with colored panels. Type sits in the vignette; the interior stays readable.

## Typography

**Display Font:** Cormorant Garamond (Iowan Old Style, Palatino, Georgia)
**Body Font:** Manrope (ui-sans-serif, system-ui)

**Character:** Editorial serif for the room’s name; geometric sans for the work of estimating and operating. Italic serif is reserved for emphasis words (`форма`, package names in headlines), not whole paragraphs.

### Hierarchy
- **Display** (500, `clamp(52px, 8.4vw, 118px)`, 0.92): FORMA hero only.
- **Headline** (500, `clamp(32px, 4.6vw, 56px)`, 1.1): section titles, lookbook names, CRM page title.
- **Title** (500, ~28px): project names, card titles, wordmark `FORMA` at 26px / 0.14em.
- **Body** (400, 15px studio / 14px desk, 1.5): copy. Lead text 16–17px.
- **Label** (600, 11px, 0.22em, uppercase): eyebrows, step indicators, CRM meta.

### Named Rules
**The Caption Rule.** Body never competes with display. If a paragraph is longer than ~75ch, it is too wide for this system.

## Layout

Showroom pages use a fluid inset of `6%` (capped around 1480px content at 1700px+). Section padding is `110px` vertical (`72px` below 700px). Two-column stories (intro, estimate, approach) split roughly 1.15 / 0.85. Bento is two columns; packages three; lookbook is one full slide at a time.

ПОТОК: fixed 248px sidebar, sticky 68px top bar, content max ~1760px. Board is four equal columns.

Breakpoints observed: `1700px`, `1100px`, `760px` (desk), `700px` (studio). Scroll padding `88px` for the pill nav.

**The Air Rule.** Prefer one generous gap over three tight ones. If a cluster feels busy, remove a rule, not a pixel.

## Elevation & Depth

Tonal layers first: void → room → panel. Large ambient shadow (`0 30px 80px rgba(0,0,0,0.45)`) only when a surface lifts (estimate workspace, lookbook plate, hovering card). Glass is a material on the nav and overlays (`blur(22px)`), not a trend overlay on photographs. At rest, cards are flat aside from a hairline.

### Shadow Vocabulary
- **Lift** (`0 30px 80px rgba(0,0,0,0.45)`): workspace, lookbook, cinematic plates.
- **Hover card** (`0 18px 40px rgba(0,0,0,0.2–0.28)`): pack, bento, desk cards — border also shifts to brass.
- **Nav** (`0 18px 50px rgba(0,0,0,0.28)`): pill chrome.
- **Brass glow** (`0 14px 40px rgba(228,194,138,0.18)`): primary button only.

### Named Rules
**The Lift-On-Intent Rule.** Shadows appear when the visitor is about to act or when a plate is the subject. Decorative drop shadows on static copy are out.

## Shapes

Rooms are softly architectural: `22px` default, `24px` for bento/lookbook, `12px` for fields. Primary actions and the nav are full pills (`999px`). Hairlines, not heavy frames. Brand mark is a rounded square (8px inner rect) with an F stroke in brass.

**The Pill-For-Action Rule.** If it submits or navigates as a primary act, it is a pill. If it contains a story (card, photo, form), it is a rounded rectangle.

## Components

### Buttons
Refined, restrained, magnetic on the inner label only.

- **Shape:** pill (`999px`), min-height `52px`, padding `0 22px`, Manrope 13px/600.
- **Primary:** brass fill, accent-ink type, brass glow. Hover `#ecd4a2`. Optional shine sweep. Focus: double ring bg + brass.
- **Glass:** white 6% fill, hairline, inset highlight, backdrop blur.
- **Dark:** ivory fill on night (CRM / system accent cards).
- **Block:** full width, `16px` radius exception for the estimate column.

### Cards / Containers
- **Corner Style:** `22–24px`
- **Background:** night-room; selected pack gets a brass wash.
- **Shadow Strategy:** lift-on-intent.
- **Border:** hairline; hover/selected brass 0.35–0.45 alpha.
- **Internal Padding:** `28–32px` marketing, `16px` desk cards.

### Inputs / Fields
- **Style:** translucent fill, `12px` radius, `14px` padding, ivory type, brass caret.
- **Focus:** brass border, no layout jump.
- **Error:** danger text; checkbox/radio use brass accent-color.

### Navigation
Studio: floating glass pill, compact after 48px scroll. Wordmark FORMA + rounded-square mark. Links 13px ivory-dim, brass underline on hover. Mobile: mark + gold «Меню» chip.

Desk: 248px glass sidebar, brand ПОТОК + CRM chip, active item brass wash.

### Signature: Lookbook
One plate at a time. Vertical scroll drives horizontal translation of three full slides (`translate3d(calc(var(--sp) * -66.666%), 0, 0)`). Never stack the three interiors in overlapping 3D. On small screens, stack slides; do not pin.

### Signature: Eyebrow
11px uppercase, 0.22em, brass, 22px rule to the left.

## Do's and Don'ts

### Do:
- **Do** keep photographs full-bleed or large 16:10 plates with a dark vignette, not postage stamps in a 3D pile.
- **Do** use champagne brass for the thing the visitor should do next.
- **Do** animate inner labels, opacity, and scroll-linked transforms — never padding or layout on hover.
- **Do** label the demo in the chrome (tag, consent, CRM «ДЕМО»).
- **Do** share night + brass between FORMA and ПОТОК so they read as one pair.

### Don't:
- **Don't** introduce a second CTA color or a light marketing theme.
- **Don't** invent testimonials, client counts, or completed-commission claims in the UI.
- **Don't** overlap gallery cards, filmstrips, and captions in one cramped row.
- **Don't** use layout-shifting hover (`translateY` on the box, extra padding-left).
- **Don't** set body copy in Cormorant; italic display is for a word, not a paragraph.
