---
name: 믿음의 게임, 실행
description: An orderly Korean knowledge magazine. A dark navy frame holds soft-gray reading ground, white cards, and one deep teal accent.
colors:
  frame: "#0f141c"
  frame-raised: "#171e29"
  frame-line: "#263041"
  frame-line-hover: "#3a4558"
  frame-hover: "#1c2431"
  frame-text: "#eef1f5"
  frame-muted: "#a7b0bd"
  frame-faint: "#8a94a3"
  frame-quiet: "#4a5568"
  bg: "#f6f7f9"
  surface: "#ffffff"
  surface-hover: "#fbfcfd"
  sunk: "#eff1f4"
  line: "#e4e7ec"
  line-strong: "#cdd3db"
  line-hover: "#b4bcc7"
  placeholder: "#6b7380"
  ink: "#121821"
  ink-soft: "#384150"
  muted: "#5d6674"
  accent: "#0d7a6f"
  accent-strong: "#0a6158"
  accent-soft: "#e4f3f0"
  accent-line: "#c6e6e0"
  accent-on-dark: "#5fd0c0"
  accent-on-dark-hover: "#7edccf"
  danger: "#b42318"
typography:
  display:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.35rem + 3.4vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.35rem + 1.5vw, 2.375rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.035em"
  title:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 1.2rem + 0.6vw, 1.625rem)"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-0.03em"
  title-sm:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "-0.025em"
  body-reading:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.85
    letterSpacing: "-0.008em"
  body:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "-0.006em"
  label:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.3
  caption:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.4
    fontFeature: "'tnum'"
rounded:
  sm: "8px"
  md: "10px"
  card: "14px"
  lg: "20px"
  pill: "999px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 3rem)"
  wide: "74rem"
  measure: "42rem"
  card-pad: "1.5rem"
  grid-gap: "1.25rem"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0.625rem 1.125rem"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "{colors.accent-strong}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0.625rem 1.125rem"
    height: "2.75rem"
  button-secondary-hover:
    backgroundColor: "{colors.surface-hover}"
  button-primary-on-frame:
    backgroundColor: "{colors.accent-on-dark}"
    textColor: "{colors.frame}"
    rounded: "{rounded.md}"
  button-primary-on-frame-hover:
    backgroundColor: "{colors.accent-on-dark-hover}"
  button-secondary-on-frame:
    backgroundColor: "{colors.frame-raised}"
    textColor: "{colors.frame-text}"
    rounded: "{rounded.md}"
  button-sm:
    padding: "0.4375rem 0.875rem"
    height: "2.375rem"
  button-lg:
    padding: "0.75rem 1.5rem"
    height: "3.125rem"
  chip:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-strong}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "0.125rem 0.625rem"
    height: "1.625rem"
  filter-option:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.pill}"
    padding: "0.375rem 1rem"
    height: "2.5rem"
  filter-option-active:
    backgroundColor: "{colors.frame}"
    textColor: "{colors.surface}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "1.5rem 1.5rem 1.25rem"
  card-feature:
    backgroundColor: "{colors.frame-raised}"
    textColor: "{colors.frame-text}"
    rounded: "{rounded.lg}"
    padding: "1.75rem"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "clamp(1.75rem, 4vw, 2.75rem)"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1rem"
    height: "3rem"
  toc-link:
    textColor: "{colors.muted}"
    rounded: "{rounded.sm}"
    padding: "0.4375rem 0.625rem"
  toc-link-active:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-strong}"
  nav-link:
    textColor: "{colors.frame-muted}"
    rounded: "{rounded.sm}"
    padding: "0.5rem 0.875rem"
  nav-link-active:
    backgroundColor: "{colors.frame-raised}"
    textColor: "{colors.frame-text}"
  toast:
    backgroundColor: "{colors.frame}"
    textColor: "{colors.frame-text}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.125rem"
---

# Design System: 믿음의 게임, 실행

## Overview

**Creative North Star: "The Orderly Knowledge Magazine"**

This is a category-standard Korean knowledge magazine played straight. A dark navy frame (masthead, page heads, article heads, diagrams, footer) bookends every page; between those bands sits a soft cool-gray reading ground carrying white cards with hairline borders and quiet offset shadows. Trust comes from order: one typeface (Pretendard Variable) with a precise weight and tracking ladder, tabular numerals for every time, count, and percentage, and a single deep teal accent that marks what is selected, current, or actionable.

Density is magazine-comfortable, not dashboard-tight: three-column card grids at desktop, a 42rem reading measure with a sticky table-of-contents card, generous section padding. The frame recurs at the top and bottom of every route, so each page reads as navy, then gray, then navy.

The world explicitly refuses AI-landing defaults: no purple neon gradients, no glows, no eyebrow labels over headings. Hierarchy is carried by size, weight, and tracking alone.

**Key Characteristics:**
- Navy frame bands at top and bottom of every page; soft gray body between them.
- White cards with a 1px hairline border, 14px corners, and a faint two-layer shadow.
- One accent hue, deep teal, with a separate lighter teal for use on navy.
- One typeface, Pretendard Variable, tightened tracking on all headings.
- Tabular numerals for times, counts, dates, reading minutes, and progress.
- Motion is short and ease-out; hover lifts are pointer-gated; reduced motion keeps opacity only.

## Colors

A cool, near-neutral blue-gray system with a single deep teal voice.

### Primary
- **Deep Teal** (accent): selected and current state, primary buttons, time marks, list markers, links (as Deep Teal Strong), the reading progress fill, the brand mark tile.
- **Deep Teal Strong** (accent-strong): primary hover, link text in prose, chip text, active TOC text. The text-safe teal.
- **Teal Mist** (accent-soft) and **Teal Mist Line** (accent-line): chip ground, active TOC ground, resume notice and form status ground and border, text selection.
- **Lagoon on Navy** (accent-on-dark) and its hover (accent-on-dark-hover): the teal used on the frame: headline second line, brand "실행", primary button on navy, time marks, next-pin on the day timeline, diagram emphasis.

### Neutral
- **Frame Navy** (frame): masthead, page/article heads, footer, diagram figures, toast, the sliding active filter pill.
- **Raised Navy** (frame-raised) / **Navy Hover** (frame-hover): featured card and footer disclaimer surface on the frame; active and hover nav link ground.
- **Navy Line** (frame-line) / **Navy Line Hover** (frame-line-hover): every divider and border on the frame.
- **Frame Text / Frame Muted / Frame Faint / Frame Quiet**: text ladder on navy (headings, ledes and body, hour labels and copyright, diagram fills only).
- **Soft Gray** (bg): page reading ground. **White** (surface): cards, panels, inputs, sticky progress bar. **Sunk Gray** (sunk): hover ground for quiet links, arrow chip, progress track, contact aside.
- **Hairline** (line), **Strong Hairline** (line-strong), **Hover Hairline** (line-hover): card borders and internal dividers; button and input borders; hover border.
- **Ink** (ink), **Soft Ink** (ink-soft), **Muted** (muted), **Placeholder** (placeholder): heading text, reading body text, secondary text and metadata, input placeholder.
- **Signal Red** (danger): form error text and invalid border only.

### Named Rules
**The One Teal Rule.** Teal is the only chromatic color. It marks selection, currency, and action; it never decorates. On navy it switches to Lagoon on Navy, never the light-ground teal.

**The Frame Bookend Rule.** Navy is structural: it holds the top and bottom of every page and the diagrams inside articles. It is never a card on the gray ground, except the active filter pill.

## Typography

**Display Font:** Pretendard Variable (with Pretendard, Apple SD Gothic Neo, Malgun Gothic, system-ui)
**Body Font:** the same family
**Label/Mono Font:** the same family, tabular numerals via `tnum`

**Character:** One Korean grotesque doing every job; hierarchy is built from weight (400 / 500 / 600 / 650 / 700) and progressively tighter tracking as size grows. Korean text uses `word-break: keep-all` and balanced headings.

### Hierarchy
- **Display** (700, clamp 2.25rem to 3.75rem, 1.2, -0.04em): home headline and page heads; article titles use the same family at clamp(2rem, 1.3rem + 2.7vw, 3.25rem), 1.25.
- **Headline** (700, clamp 1.75rem to 2.375rem, 1.25, -0.035em): section titles on the gray ground ("모든 아티클").
- **Title** (700, clamp 1.375rem to 1.625rem, 1.4, -0.03em): prose h2, featured-card title, panel titles.
- **Title Small** (700, 1.125rem, 1.5, -0.025em): card titles, pager titles; 1.0625rem with -0.02em for principle and disclaimer headings.
- **Body Reading** (400, 1.125rem, 1.85, -0.008em): article prose in Soft Ink within the 42rem measure; 1.0625rem under 640px. Policy and about pages use 1.0625rem / 1.85.
- **Body** (400, 1rem, 1.65): base UI text; card descriptions and ledes on cards use 0.9375rem / 1.7 in Muted.
- **Label** (600, 0.9375rem): buttons, nav, form labels.
- **Caption** (600, 0.8125rem, tabular): chips, counts, progress percentage, dates.

### Named Rules
**The Tightening Ladder Rule.** Heading tracking tightens with size: -0.02em at small headings, -0.025em at card titles, -0.03em at titles, -0.035em at headlines, -0.04em at display. Body stays near zero.

**The Tabular Numbers Rule.** Every time, count, date, percentage, and reading-minutes value is set in tabular numerals.

## Layout

Content sits in a centered wrap of 74rem plus a fluid gutter (clamp(1.25rem, 4vw, 3rem)). The home masthead is a 7:5 grid (headline left, featured card right) above a 24-hour article timeline, collapsing to one column below 900px. The article index is a three-column card grid (1.25rem gap), two columns at 1024px and one at 640px (0.875rem gap). Articles use a 42rem prose column with a 16rem sticky TOC card on the right; below 1100px the TOC moves above the prose as a collapsible card. The privacy page mirrors this with the TOC on the left; contact uses a form plus 18 to 22rem aside. Vertical rhythm between sections is fluid (roughly clamp(3.5rem, 7vw, 5.5rem)); the footer sits clamp(4.5rem, 10vw, 7.5rem) below content. On mobile the filter group scrolls horizontally edge to edge with masked ends, and article diagrams bleed to the viewport edge and scroll sideways.

## Elevation & Depth

A hybrid: depth is mostly tonal (navy frame against gray ground, white cards on gray, raised navy on navy) with soft, offset, two-layer shadows that read as paper resting on a desk, never as glow.

### Shadow Vocabulary
- **Rest** (`box-shadow: 0 1px 2px rgb(16 24 40 / 0.04), 0 1px 3px rgb(16 24 40 / 0.05)`): every card, panel, TOC card, filter group, primary and secondary buttons, sticky progress bar.
- **Lift** (`box-shadow: 0 2px 4px rgb(16 24 40 / 0.04), 0 14px 28px -10px rgb(16 24 40 / 0.14)`): card and pager hover on fine pointers.
- **Float** (`box-shadow: 0 4px 8px rgb(16 24 40 / 0.06), 0 20px 40px -12px rgb(16 24 40 / 0.22)`): the toast.
- **Frame Drop** (`box-shadow: 0 24px 48px -24px rgb(0 0 0 / 0.5)`): the featured card on navy only.

### Named Rules
**The Paper Not Glow Rule.** Shadows are neutral navy-gray, low-opacity, and offset downward. No colored shadows, no glows, no hard offsets.

## Shapes

Gently rounded, consistent by role: 8px for small interactive rows (nav links, TOC links, back link, focus ring at 4px), 10px for buttons, inputs, toast, and notices, 14px for cards, TOC cards, diagrams, and disclaimers, 20px for large panels (featured card, principles panel, contact form, respond box). Chips, filter groups, count badges, the arrow chip, and numbered action markers are full pills or circles (999px). Borders are 1px hairlines everywhere; dividers inside cards are hairlines too. Diagrams lose their radius and bleed edge to edge under 640px.

## Components

### Buttons
Calm and solid; they press, they do not bounce.
- **Shape:** 10px corners, minimum height 2.75rem (2.375rem small, 3.125rem large).
- **Primary:** Deep Teal ground, white text, Rest shadow; hover to Deep Teal Strong. On navy: Lagoon on Navy ground with navy text, no shadow.
- **Secondary:** White ground, Strong Hairline border, Ink text, Rest shadow; hover shifts to Hover Hairline and near-white. On navy: Raised Navy with Navy Line.
- **Press:** `scale(0.97)` over 160ms ease-out (`cubic-bezier(0.23, 1, 0.32, 1)`), only when motion is allowed. Reaction and share buttons follow the same shape and press; a pressed reaction turns Teal Mist with a teal border.

### Chips
- **Style:** Teal Mist pill, Deep Teal Strong caption text (0.8125rem, 600). On navy: teal at 12% alpha with Lagoon text.
- **Use:** article category only, plus small count badges in the same treatment.

### Category Filter (signature)
A white pill group with a hairline border and Rest shadow holds the category options. A navy pill slides beneath the active option (280ms, `cubic-bezier(0.77, 0, 0.175, 1)`) and resizes to its width; the active label turns white and its count Lagoon. On change, visible cards rise 8px into place with opacity, staggered about 35ms, 240ms ease-out; under reduced motion they fade only.

### Cards / Containers
- **Corner Style:** 14px (cards), 20px (panels).
- **Background:** White on gray; Raised Navy for the featured card on the frame.
- **Shadow Strategy:** Rest at rest; Lift plus a 3px rise on fine-pointer hover (featured card rises 2px and shifts its border).
- **Border:** 1px Hairline; the whole card is the link target via a stretched title link, with the focus ring drawn on the card.
- **Internal Padding:** 1.5rem (1.25rem on mobile); a hairline divides body from meta foot. A round Sunk Gray arrow chip in the foot turns teal on hover.

### Inputs / Fields
- **Style:** White ground, Strong Hairline border, 10px corners, min height 3rem, 1rem text, teal caret.
- **Focus:** border and 2px outline in Deep Teal.
- **Error:** Signal Red border and small red message beneath; consent sits in a Soft Gray inset row.

### Navigation
Right-aligned text links on the navy bar in Frame Muted, 0.9375rem / 500; hover and current page sit on a Raised Navy 8px tile in Frame Text (current at 600). The brand is a teal rounded-square mark plus the wordmark with "실행" in Lagoon. Mobile keeps the same row with tighter padding; the mark hides under 380px.

### Article Reading Kit
- **Progress bar:** a sticky white bar slides in once reading starts, showing the title, a teal pill percentage, and a 3px track that fills with teal; a small ink flag marks where the reader last stopped.
- **TOC card:** white 14px card; the current section's link sits on Teal Mist in Deep Teal Strong.
- **Today's action (오늘의 실행):** the heading carries a teal 8px tile with a check; its list becomes a white card with numbered teal circles and hairline separators.
- **Diagram:** a Frame Navy figure (14px) with Lagoon emphasis strokes and muted labels, captioned under a navy hairline.

### Toast
A navy 10px pill-like bar with a Lagoon check rises 12px from the bottom center (280ms ease-out) and leaves after 2.2s; Float shadow.

## Do's and Don'ts

### Do:
- **Do** bookend every page with the navy frame and keep reading content on Soft Gray with white cards.
- **Do** use Deep Teal only for selected, current, and actionable states; switch to Lagoon on Navy on the frame.
- **Do** set every time, count, date, and percentage in tabular numerals.
- **Do** tighten heading tracking with size (-0.02em to -0.04em) and keep a single family.
- **Do** gate hover lifts behind `(hover: hover) and (pointer: fine)` and transforms behind `prefers-reduced-motion: no-preference`; under reduced motion keep opacity only.
- **Do** use `cubic-bezier(0.23, 1, 0.32, 1)` for entering and pressing, `cubic-bezier(0.77, 0, 0.175, 1)` for on-screen movement, 150 to 280ms durations, and `scale(0.97)` on press.
- **Do** draw icons as inline 1.7-stroke line SVGs in currentColor.

### Don't:
- **Don't** use purple neon gradients, glows, or colored shadows.
- **Don't** put eyebrow or kicker labels above headings; hierarchy comes from size, weight, and tracking.
- **Don't** introduce a second accent hue or a second typeface.
- **Don't** use hard offset shadows or heavy borders; borders are 1px hairlines.
- **Don't** use emoji or text glyphs as icons.
