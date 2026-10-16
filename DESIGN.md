---
name: 믿음의 게임, 실행
description: A day-shaped reading site where night ink owns the frame, morning paper owns the reading column, and one sun amber marks what is active.
colors:
  night: "#0f1622"
  night-raised: "#162030"
  night-line: "#263248"
  night-text: "#e8ecf2"
  night-muted: "#a5b0c1"
  night-faint: "#8692a9"
  paper: "#f5f6f3"
  paper-sunk: "#eceee9"
  line: "#d6dbd2"
  ink: "#18202c"
  ink-soft: "#3a4452"
  muted: "#566170"
  sun: "#e9a23b"
  sun-soft: "#f4d7a6"
  sun-ink: "#855508"
  dusk: "#5b6b82"
  error: "#b3261e"
typography:
  display:
    fontFamily: "'Hahmlet Variable', 'Noto Serif KR', 'AppleMyungjo', serif"
    fontSize: "clamp(2.5rem, 1.6rem + 3.6vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "'Hahmlet Variable', 'Noto Serif KR', 'AppleMyungjo', serif"
    fontSize: "clamp(2rem, 1.4rem + 2.2vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  title:
    fontFamily: "'Hahmlet Variable', 'Noto Serif KR', 'AppleMyungjo', serif"
    fontSize: "clamp(1.5rem, 1.2rem + 1vw, 1.875rem)"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.025em"
  prose-heading:
    fontFamily: "'Hahmlet Variable', 'Noto Serif KR', 'AppleMyungjo', serif"
    fontSize: "1.625rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  body-read:
    fontFamily: "'Hahmlet Variable', 'Noto Serif KR', 'AppleMyungjo', serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.95
  body:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.5
  time-mark:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
    fontFeature: "'tnum'"
rounded:
  control: "3px"
  container: "4px"
  pin: "50%"
spacing:
  gutter: "clamp(1.25rem, 4vw, 4rem)"
  measure: "40rem"
  wide: "76rem"
  row: "2rem"
  section: "clamp(3rem, 6vw, 5rem)"
components:
  button-primary:
    backgroundColor: "{colors.night}"
    textColor: "{colors.night-text}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1.5rem"
    height: "3rem"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0.5rem 1.125rem"
    height: "2.75rem"
  button-outline-pressed:
    backgroundColor: "{colors.night}"
    textColor: "{colors.night-text}"
  button-sun:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.night}"
    rounded: "{rounded.control}"
    padding: "0.5rem 1.25rem"
    height: "2.75rem"
  filter-tab:
    textColor: "{colors.ink-soft}"
    typography: "{typography.body}"
    padding: "0.5rem 0"
    height: "2.75rem"
  filter-tab-active:
    textColor: "{colors.ink}"
  nav-link:
    textColor: "{colors.night-muted}"
    rounded: "{rounded.control}"
    padding: "0.5rem 0.875rem"
  nav-link-hover:
    backgroundColor: "{colors.night-raised}"
    textColor: "{colors.night-text}"
  input:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1rem"
    height: "3rem"
  disclaimer-box:
    backgroundColor: "{colors.paper-sunk}"
    textColor: "{colors.ink}"
    rounded: "{rounded.container}"
    padding: "clamp(1.25rem, 3vw, 1.75rem)"
  disclaimer-row-night:
    backgroundColor: "{colors.night-raised}"
    textColor: "{colors.night-muted}"
    rounded: "{rounded.container}"
    padding: "1.25rem 1.5rem"
  diagram-plate:
    backgroundColor: "{colors.night}"
    textColor: "{colors.night-text}"
    rounded: "{rounded.control}"
    padding: "1.75rem 1.5rem 1.25rem"
---

# Design System: 믿음의 게임, 실행

## Overview

**Creative North Star: "The Day Chart"**

The site is drawn as one day. Every article is placed at the hour its habit happens (07:00, 18:30, 23:00) or marked "언제든" (anytime), and a single 24-hour line is the site's map: on the home masthead it carries the article pins and a live "지금" marker, on interior mastheads it closes the night zone as a static 00–24 scale, and on the article page it becomes the reading-progress line, segmented into 24 hours. Thumbnail card grids and image sliders are not part of this world; the index is a ruled list keyed by time.

Color owns territory rather than decorating it. Night ink owns the frame (masthead, footer, diagram plates); morning paper owns the reading column. The only active color is the sun amber, which appears where something is current, chosen, or next: the next pin, the active filter, the read portion of the progress line, the current TOC entry, the "오늘의 실행" marker. Everything else is drawn with 1px hairlines, tabular time marks, and a Korean serif for reading set against a Korean sans for interface.

The mood is calm and evidence-led, close to a quality knowledge magazine: generous leading, a 40rem reading measure, minimal rounding, no shadows, and one easing curve.

**Key Characteristics:**
- Two zones by color: night frame, paper reading column; never a third surface family.
- One active color (sun amber) with a darker text variant (sun-ink) for paper.
- The 24-hour line recurs as map, masthead scale, and progress line.
- 1px hairlines carry structure; shadows are absent.
- Tabular-figure time marks precede titles wherever an article is listed.
- Serif (Hahmlet) for reading and headings, sans (Pretendard) for UI, labels, and numerals.

## Colors

A cool blue-black night and a faintly green-grey paper, split by one warm amber that only ever signals state.

### Primary
- **Sun Amber** (sun): The single active color. Next pin on the day band, active filter underline, progress fill, current TOC dot, nav current-page dot, focus outline, the "오늘의 실행" marker, link underline color, and the brand's "실행". On night it can carry text (feature "읽기" link, time marks); on paper it never carries text.
- **Sun Ink** (sun-ink): The text-safe amber for paper. Time marks, list markers, filter counts when active, the partial-read flag state, "더 알아보기" links, policy section numbers.
- **Sun Soft** (sun-soft): Text selection on paper only.

### Secondary
- **Dusk Slate** (dusk): Inactive pin rings on the day band, diagram secondary bars and fills, scrollbar thumb. The quiet counterpart to the sun inside diagrams.

### Neutral
- **Night Ink** (night): Masthead, footer, diagram plates, primary buttons, the pressed reaction button, numbered action badges.
- **Night Raised** (night-raised): Nav hover fill, the footer disclaimer row, diagram node fills.
- **Night Line** (night-line): Every hairline inside the night zone: header bottom border, day-band track and ticks, masthead hour scale, meta separators, feature divider.
- **Night Text / Night Muted / Night Faint** (night-text, night-muted, night-faint): Headings and current items; slogans, ledes, nav at rest; hour labels and the copyright line.
- **Paper** (paper): Body background and the sticky reading bar.
- **Paper Sunk** (paper-sunk): Recessed panels on paper: disclaimer box, reaction panel, resume notice, collapsed tablet TOC, contact status.
- **Line** (line): Row separators, control borders at rest, TOC dot rings, progress-line hour segments.
- **Ink / Ink Soft / Muted** (ink, ink-soft, muted): Headings and body; category labels and secondary body; descriptions, meta, hints.
- **Error Red** (error): Invalid field border and error text on the contact form. Not yet a custom property.

### Named Rules
**The One Sun Rule.** Amber means "active, current, or next." If an element is not in one of those states, it is not amber. Decorative amber is a defect.

**The Territory Rule.** Night owns the frame, paper owns the reading. A night surface inside the paper zone is allowed only as a plate that carries the day's own content (diagram plates, pressed states, action badges), never as a decorative band.

**The Ink-for-Text Rule.** On paper, amber text uses sun-ink; raw sun is reserved for fills, lines, and outlines.

## Typography

**Display Font:** Hahmlet Variable (with Noto Serif KR, AppleMyungjo, serif)
**Body Font:** Pretendard Variable (with Apple SD Gothic Neo, Malgun Gothic, sans-serif)
**Label/Mono Font:** Pretendard with tabular figures for every clock time

**Character:** A sturdy, slightly calligraphic Korean serif carries everything meant to be read, while a neutral grotesque handles navigation, labels, and numbers. Tight negative tracking on serif headings, keep-all word breaking everywhere.

### Hierarchy
- **Display** (600, step-5 clamp 2.5–4.5rem, 1.14–1.18, -0.035em): Home masthead title, article title, interior page titles. Night zone only.
- **Headline** (600, step-4 clamp 2–3rem, 1.2, -0.03em): Section heads on paper, such as the article index head.
- **Title** (600, step-3 clamp 1.5–1.875rem, 1.35, -0.025em): Article row titles, featured article title, section heads of secondary blocks.
- **Prose Heading** (600, 1.625rem, 1.4): h2 inside articles; 1.5rem in about/policy documents; 1.375rem under 640px.
- **Body Read** (400, 1.1875rem, 1.95): Article prose in serif, max 40rem. Documents use 1.125rem / 1.9; under 640px prose drops to 1.0625rem / 1.9.
- **Body** (400, 1rem, 1.6): Interface copy; descriptions run at 1.75–1.8 leading.
- **Label** (700, 0.875–0.9375rem): TOC heads, disclaimer titles, share labels, footer headings. Sentence case; no uppercase, no letter-spaced small caps.
- **Time Mark** (600, tabular figures, 1.5rem in index rows, inline size elsewhere): Clock times in sun-ink on paper, sun on night; "언제든" in muted at 500.

### Named Rules
**The Serif-Reads, Sans-Operates Rule.** If a reader reads it as content, it is Hahmlet; if they act on it or scan it as data, it is Pretendard.

**The Tabular Clock Rule.** Every clock time is set in tabular figures so a column of times aligns.

## Layout

A single centered wrap (max 76rem plus gutters, gutter clamp 1.25–4rem). The home masthead splits 7:5 (title and slogan left, featured article right behind a 1px night-line divider) and collapses to one column under 900px, with the divider moving to the top. The day band spans the full wrap at the bottom of the night zone.

Articles sit in a two-column grid: a 40rem prose measure plus a 15rem sticky TOC on the right (top 5rem). Under 1100px the TOC moves above the prose as a collapsible paper-sunk box. Interior pages share one masthead pattern: display title, lede at 40rem, then the 00–24 hour scale on a night-line rule; under 720px every other hour label is hidden.

The article index is a three-column ruled list (8.5rem time column, flexible title column, 8rem meta column) that drops to two columns at 860px and narrows the time column to 4.25rem at 560px. Rows breathe at 2rem block padding. Sections step apart with clamp(3rem, 6vw, 5rem); the footer sits clamp(4rem, 10vw, 8rem) below content. On phones, filter tabs scroll horizontally edge to edge and diagrams bleed to the screen edges with horizontal scroll.

## Elevation & Depth

The system is flat. There are no drop shadows anywhere; depth is conveyed by zone color (night against paper), by tonal recess (paper-sunk panels, night-raised rows), and by 1px hairlines. The sticky reading bar is opaque paper with a 1px line border, not a blur or shadow.

### Named Rules
**The Hairline Rule.** Structure is drawn with 1px lines: ink rules open a section or list, line-color rules separate rows. Heavier strokes belong only to the 2px day-band track and progress line.

**The No-Halo Rule.** Active marks use a 1px sun outline at 3px offset (next pin, "오늘의 실행" marker), never a glow or blurred ring.

## Shapes

Corners are nearly square. Controls (buttons, nav links, inputs, the resume notice, diagram plates, TOC box) take 3px; bordered containers (disclaimer box, reaction panel, footer disclaimer row, about contact block) take 4px. Pills do not exist. Circles are reserved for meaning: day-band pins, TOC state dots, the nav current-page dot, numbered action badges, and the "오늘의 실행" sun. The progress flag is a 2px staff with a small triangular pennant.

## Components

### Buttons
Quiet, square-shouldered, and dark rather than colored.
- **Shape:** Nearly square (3px).
- **Primary:** Night fill with night-text, 600 weight, 3rem tall, 0.75rem 1.5rem padding; an icon inside takes sun. Used for form submit and the 404 return.
- **Outline:** Paper fill, 1px line border, ink text, 2.75rem tall (2.5rem for share and copy); hover darkens the border to ink-soft; active scales to 0.97.
- **Pressed toggle:** A pressed reaction flips to night fill and night-text with the icon filled sun.
- **Sun:** Sun fill with night text, used only as the single primary action inside a night block (about page contact).
- **Focus:** Global 2px sun outline at 3px offset.

### Chips
None. Category filtering uses text tabs (see Navigation).

### Cards / Containers
There are no cards. Lists are ruled rows; the whole row is the link target, and hover draws a 1px sun underline under the title from left (0.5s ease-out).
- **Disclaimer box:** At the end of every article and in the policy page: paper-sunk fill, 1px ink border, 4px radius, sans type, a sun-ink info icon beside a bold title, bullet list in ink-soft, and a dated footnote under a 1px line rule.
- **Footer disclaimer row:** The same content compressed into a full-width night-raised row with a 1px night-line border and a sun link.
- **Recessed panels:** Reaction panel (4px, 2rem padding), resume notice and status (3px), all paper-sunk, no border.
- **Diagram plate:** One per article; a night plate inside the paper column with stroked SVG (night-muted lines, night-text curve, sun for the emphasized path) and a caption under a night-line rule.

### Inputs / Fields
- **Style:** White fill, 1px line border, 3px radius, 3rem tall, 0.75rem 1rem padding, sun-ink caret; hover darkens the border.
- **Focus:** Border turns ink. (Currently also carries a 3px translucent amber ring; see drift note.)
- **Error:** Error-red border and a 0.875rem error-red message beneath.

### Navigation
- **Header:** Night bar, 4.5rem tall (3.75rem under 720px), 1px night-line bottom rule. Brand mark is a horizon with a sun circle; "실행" set in sun.
- **Links:** Night-muted at rest, night-text on night-raised fill on hover; the current page gets night-text plus a 5px sun dot beneath.
- **Filter tabs:** Text-only buttons on paper, 2.75rem hit area, counts in muted; the active tab goes ink and bold with a 2px sun underline that scales in from the left, sitting on the list's 1px ink rule.
- **TOC:** Ink-ruled head, entries with a 7px ring dot; the current entry fills the dot with sun.

### Day Band (signature)
A 24-hour track (2px night-line with hour ticks) at the bottom of the home masthead. Articles hang as pins: dusk-ringed dots with a time mark and a moment label on a 1px night-line stem. The elapsed part of the day fills with an amber gradient and a white "지금" stem marks the current time; the pin nearest ahead becomes sun-filled with the 1px outline. The fill draws once with the exponential ease-out (1.6s) and is static under reduced motion. Under 720px moment labels and odd hours hide.

### Reading Bar (signature)
Appears after the article masthead scrolls away: an opaque paper bar with a 1px line border showing the title and a sun-ink percentage, above a 2px line segmented into 24 hour cells that fills with sun as the reader progresses. A returning reader sees an ink flag at the point they stopped and a resume notice at the top of the prose.

### Action List
"오늘의 실행" closes each article: a 1px ink rule, a sun dot with the 1px outline, then numbered steps with night badges carrying sun numerals, separated by line rules.

## Do's and Don'ts

### Do:
- **Do** place every listed article behind its time mark (tabular, sun-ink on paper, sun on night) or "언제든" in muted.
- **Do** keep amber for active, current, or next states, and use sun-ink for amber text on paper.
- **Do** draw structure with 1px hairlines: ink to open a list or section, line between rows, night-line inside the night zone.
- **Do** keep controls at 3px and bordered containers at 4px.
- **Do** end every article with the "오늘의 실행" list followed by the bordered disclaimer box.
- **Do** keep reading text in Hahmlet at a 40rem measure with 1.9–1.95 leading.
- **Do** use the single ease-out curve (cubic-bezier(0.16, 1, 0.3, 1)) for the few motions, and freeze them under reduced motion.

### Don't:
- **Don't** introduce thumbnail card grids or image sliders for article listing; the ruled, time-keyed list is the index.
- **Don't** use pill shapes or large radii.
- **Don't** add drop shadows, glows, or blurred halos; active marks use a 1px outline at 3px offset.
- **Don't** add a third surface family or a second accent color.
- **Don't** set amber (sun) text on paper.
- **Don't** set UI labels in uppercase or letter-spaced small caps.
