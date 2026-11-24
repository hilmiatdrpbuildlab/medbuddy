---
name: VitalsBrief
description: Your lab results and wearable trends, organised into one page your GP can read in 30 seconds.
colors:
  deep-teal: "#0B5D63"
  primary-soft: "#E3F0EF"
  terracotta-action: "#C24E35"
  on-action: "#FFFFFF"
  range-amber: "#8A4B00"
  range-amber-soft: "#FFF1D6"
  confirmed-green: "#1F6B4A"
  confirmed-green-soft: "#E2F2EA"
  range-band: "#D6E6E6"
  danger: "#9B2C1F"
  cool-ground: "#F4F7F8"
  surface: "#FFFFFF"
  surface-alt: "#EDF2F3"
  sunken: "#E6EDEE"
  hairline: "#DCE5E7"
  teal-ink: "#0E2A2E"
  ink-secondary: "#4A6266"
  ink-tertiary: "#5C7276"
  paper: "#FFFFFF"
  paper-ink: "#14202A"
  paper-ink-secondary: "#55626B"
  paper-rule: "#D9DEE2"
typography:
  large-title:
    fontFamily: "SF Pro, Roboto, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: "38px"
    letterSpacing: "-0.4px"
  title:
    fontFamily: "SF Pro, Roboto, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: "28px"
    letterSpacing: "-0.2px"
  title3:
    fontFamily: "SF Pro, Roboto, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 600
    lineHeight: "24px"
  headline:
    fontFamily: "SF Pro, Roboto, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: "22px"
  body:
    fontFamily: "SF Pro, Roboto, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: "24px"
  callout:
    fontFamily: "SF Pro, Roboto, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "22px"
  subhead:
    fontFamily: "SF Pro, Roboto, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: "20px"
  footnote:
    fontFamily: "SF Pro, Roboto, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "18px"
  caption:
    fontFamily: "SF Pro, Roboto, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
  value:
    fontFamily: "SF Pro, Roboto, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: "22px"
    fontFeature: "tnum"
  big-value:
    fontFamily: "SF Pro, Roboto, system-ui, sans-serif"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: "40px"
    letterSpacing: "-0.5px"
    fontFeature: "tnum"
rounded:
  paper: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  hero: "20px"
  xl: "22px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  section: "24px"
  xxl: "28px"
  xxxl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.terracotta-action}"
    textColor: "{colors.on-action}"
    typography: "{typography.headline}"
    rounded: "{rounded.lg}"
    padding: "0 20px"
    height: "54px"
  button-secondary:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.deep-teal}"
    typography: "{typography.headline}"
    rounded: "{rounded.lg}"
    padding: "0 20px"
    height: "54px"
  button-small:
    typography: "{typography.subhead}"
    rounded: "{rounded.lg}"
    padding: "0 16px"
    height: "44px"
  button-plain:
    backgroundColor: "transparent"
    textColor: "{colors.deep-teal}"
    typography: "{typography.headline}"
    rounded: "{rounded.lg}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.deep-teal}"
    rounded: "{rounded.lg}"
    height: "54px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "16px"
  list-group:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
  list-row:
    typography: "{typography.body}"
    padding: "13px 16px"
    height: "52px"
  hero-card:
    backgroundColor: "{colors.deep-teal}"
    textColor: "{colors.on-action}"
    rounded: "{rounded.hero}"
    padding: "18px"
  pill:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.deep-teal}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "4px 9px"
  flag-label:
    backgroundColor: "{colors.range-amber-soft}"
    textColor: "{colors.range-amber}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "3px 8px"
  segmented:
    backgroundColor: "{colors.sunken}"
    typography: "{typography.subhead}"
    padding: "3px"
    height: "42px"
  tab-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-tertiary}"
  toast:
    backgroundColor: "{colors.teal-ink}"
    textColor: "{colors.cool-ground}"
    typography: "{typography.subhead}"
    rounded: "{rounded.pill}"
    padding: "11px 16px"
---

# Design System: VitalsBrief

## Overview

**Creative North Star: "The Position, Not the Verdict"**

VitalsBrief is a calm, native-feeling iOS-style utility in deep teal ink on white and a cool near-white ground. Every lab value is shown as a position inside the lab's own range: a soft teal band on a gray track with a single marker dot. Nothing scores, rings, or alarms. The register is a modern bank or hospital app: grouped lists, hairline separators, softly rounded white surfaces, system type with tabular figures, and Lucide line icons at a light stroke.

Density is moderate and list-led. Screens are a single scrolling column on the cool ground with a 16px gutter and 24px between sections, a large in-content title on top-level tabs, and the screen's one primary action pinned in a hairline-topped footer above the tab bar. Colour does almost no decorative work: teal is identity and interaction, one warm terracotta fills only the primary action, and amber appears only when a value sits outside the lab's range, always paired with words and an arrow.

The second material is paper. The GP Brief and the source lab document render as true A4 sheets (595 x 842 pt) in fixed paper colours that never follow dark mode, lifted off the app by the system's only soft drop shadow. What the user previews is what the doctor receives.

**Key Characteristics:**
- Deep teal identity on white and cool near-white, with full dark-mode counterparts.
- The RangeBar (lab range band + value marker) recurs in lists, detail charts, review, and the printed brief.
- One warm terracotta primary button per screen, pinned above the tab bar.
- Amber + words + arrow for "outside lab range"; never red, never colour alone.
- iOS grouped-list grammar: white groups with hairline borders, inset separators, chevrons.
- System sans with tabular figures for every number.
- Flat app surfaces; the paper sheet is the only thing that casts a real shadow.

## Colors

A restrained teal-on-cool-white palette with one warm action colour and one status colour that only ever means "outside the lab's range". Brand colours (deep teal, terracotta, and their dark-mode variants) live in `mobile/src/config/brand.ts` so they can change after the trademark check; everything else lives in `mobile/src/theme/index.ts`.

### Primary
- **Deep Teal** (deep-teal): identity and interaction. Tab-bar active tint, plain and secondary button text, icon tint inside soft-teal icon tiles, chart lines and in-range markers, progress fill, and the solid ground of the Next GP visit hero card. In dark mode it becomes a light aqua (#5CC3C2) for text and lines, while the hero ground becomes a deep teal (#124547).
- **Soft Teal** (primary-soft): the quiet tint behind secondary buttons, icon tiles in rows, and neutral-teal pills.

### Secondary
- **Terracotta Action** (terracotta-action): the fill of the single primary button ("Add lab report", "Make brief", "Confirm"). Becomes apricot (#F4A672) with dark text (#2A0E07) in dark mode. White on terracotta measures about 6.5:1.

### Tertiary
- **Range Amber** (range-amber) on **Range Amber Soft** (range-amber-soft): the outside-lab-range state only. The value text turns amber, the RangeBar marker turns amber, and a soft amber pill says "Below lab range" / "Above lab range" with an arrow. Dark mode: #F2B649 on #2E220C.
- **Confirmed Green** (confirmed-green / confirmed-green-soft): user-confirmed and saved states (check marks, "ok" pills). Never used to mean a healthy result.
- **Range Band** (range-band): the lab's reference range drawn as a band on the RangeBar and behind the trend line (at 75% opacity).

### Neutral
- **Cool Ground** (cool-ground): the app background behind every screen and the sticky footer.
- **Surface** (surface): cards, list groups, tab bar.
- **Surface Alt** (surface-alt): pressed rows, neutral pills, the "recent" zone in wearable charts.
- **Sunken** (sunken): the RangeBar track, segmented-control well, progress track, the document pane in review.
- **Hairline** (hairline): every border and separator, drawn at the platform hairline width.
- **Teal Ink** (teal-ink), **Ink Secondary** (ink-secondary), **Ink Tertiary** (ink-tertiary): primary text, subtitles, and footnotes/chevrons/inactive tabs. All three are teal-tinted, never pure gray.
- **Paper set** (paper, paper-ink, paper-ink-secondary, paper-rule): fixed print colours for the A4 brief and lab document, identical in light and dark mode.

### Named Rules
**The Range Is Amber and Words Rule.** Outside the lab's range is shown by amber value text, an amber marker, and a pill with an arrow and the words "Below/Above lab range". All three appear together. Red is never used for a lab value; `danger` is reserved for destructive actions.

**The One Warm Button Rule.** Terracotta fills the screen's single primary button. Secondary actions use soft teal, plain teal text, or a hairline outline. Beyond that button, terracotta appears only as the dot in the logo mark.

**The Paper Does Not Dim Rule.** The A4 sheet keeps its white paper and dark print ink in dark mode; it is a document, not a themed surface.

## Typography

**Display Font:** System (SF Pro on iOS, Roboto on Android, system-ui on web)
**Body Font:** System, same family
**Label/Mono Font:** none; numbers use the system face with tabular figures

**Character:** One native family across the whole app, so the product reads as a trustworthy platform utility rather than a branded campaign. Hierarchy comes from size and weight, plus tight negative tracking on the two largest sizes.

### Hierarchy
- **Large Title** (700, 32px / 38px, -0.4px): the in-content title on top-level tabs ("Good morning, Sophie").
- **Title** (700, 22px / 28px, -0.2px): the key line inside the hero card and sheet titles.
- **Title 3** (600, 19px / 24px): secondary screen headings.
- **Headline** (600, 17px / 22px): list-group titles and button labels.
- **Body** (400, 17px / 24px): row titles and running text.
- **Callout / Subhead** (400, 16px and 15px): row subtitles, screen subtitles, small-button labels, segmented options.
- **Footnote** (400, 13px / 18px): lab-range lines, group footers, provenance ("From Labo Noord, 23 Nov").
- **Caption** (500, 12px / 16px): pill and flag-label text.
- **Value / Big Value** (600 17px, 700 34px, tabular figures): lab and wearable numbers.

### Named Rules
**The Tabular Figures Rule.** Every number that can be compared (values, ranges, dates in lists, chart labels, brief tables) uses tabular figures.

**The Scale Respect Rule.** Text honours OS font scaling up to 1.6x; body copy never drops below 16px.

## Layout

A single scrolling column on the cool ground. Content padding is 16px at the sides, 16px at the top under a native header (safe-area top + 12px on tab screens), and 24px between sections. A screen with a primary action places it in a sticky footer: 16px side padding, 12px top, a hairline top border, on the cool ground. Within lists, rows pad 16px horizontally and 13-14px vertically, with a minimum height of 52px; separators are inset 16px from the leading edge. Gaps inside components run on a 4px rhythm, mostly 8, 10 and 12px. Touch targets are at least 44 x 44px everywhere, including chart points (invisible 44px hit areas over each dot).

## Elevation & Depth

The app is flat. Depth comes from tonal layering: white surfaces with a hairline border on the cool ground, sunken wells for tracks and segmented controls, and pressed states that shift to surface-alt rather than lifting. Real shadows exist in exactly three places, each with a purpose.

### Shadow Vocabulary
- **Paper lift** (`shadow: 0 6px 18px rgba(11, 42, 46, 0.16)`, Android elevation 5): the A4 brief sheet and its thumbnails. It is the only large shadow in the system.
- **Floating toast** (`shadow: 0 4px 12px rgba(0, 0, 0, 0.18)`, elevation 4): the confirmation toast and inbound banner that float over content.
- **Segment thumb** (`shadow: 0 1px 4px rgba(0, 0, 0, 0.08)`, elevation 1): the selected option in a segmented control.

### Named Rules
**The Only Paper Casts a Shadow Rule.** Cards, groups, and buttons never carry shadows. If something needs separation, use a hairline border or a tonal step.

## Shapes

Softly rounded rectangles throughout. Cards, list groups, and every button share a 16px radius; the hero card sits slightly rounder at 20px. Small inner elements step down (12px for the inset bar inside the hero card, 10px for row icon tiles, 9-11px for segmented controls). Status elements are full pills. The A4 paper is almost square-cornered (4px), so it reads as a sheet rather than an app card. RangeBar tracks and bands use fully rounded ends; markers are circles with a 2.5px ring in the surface colour.

## Components

### Buttons
Large, calm, and full-width when they are the screen's main action.
- **Shape:** 16px radius; 54px tall (44px when small), 20px side padding (16px small), 8px gap to an optional 20px Lucide icon.
- **Primary:** terracotta fill, white headline-weight label.
- **Secondary:** soft teal fill, deep teal label. Used for paired actions (Share / Print) and inline "Connect" or "Save".
- **Plain:** no fill, deep teal label. Used for "See all", "Cancel", "Skip".
- **Outline:** transparent with a 1px hairline border and teal label (e.g. "Continue with email").
- **Press:** opacity 0.82 and scale 0.985 (plain buttons do not scale); disabled at 0.45 opacity. Every press fires a light haptic.
- **Platform exception:** a solid black button exists only for "Sign in with Apple", following Apple's own guideline.

### Chips (Pills and Flag Labels)
- **Pill:** full radius, 4px x 9px padding, caption text, optional 13px icon. Tones: primary (soft teal), amber, ok (soft green), neutral (surface-alt with secondary ink) for "Coming soon" and "Offline".
- **Flag Label:** the amber pill with an arrow and "Below/Above lab range". Renders nothing when a value is within range.

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** surface (white / #132023 dark).
- **Shadow Strategy:** none (see Elevation).
- **Border:** platform hairline in the hairline colour.
- **Internal Padding:** 16px.
- **Pressed:** opacity 0.85.

### Lists (Grouped)
The main content container. An optional headline-weight title with a right-aligned plain action sits above a white, hairline-bordered 16px group; rows are separated by hairlines inset 16px; an optional footnote sits below in tertiary ink. Rows carry an optional 34px icon tile (10px radius, soft-teal or soft-amber ground, 19px icon at 1.9 stroke), title and subtitle, an optional tabular value, and a chevron when tappable. Pressed rows tint to surface-alt.

### Navigation
- **Tab bar:** four tabs (Home, Labs, Trends, Brief) on the surface colour with a hairline top border. 24px Lucide icons; active in deep teal at 2.2 stroke, inactive in tertiary ink at 1.8 stroke; 11px semibold labels. Tab presses fire a haptic.
- **Segmented control:** sunken well, 11px radius, 3px padding; the selected option is a raised surface thumb (9px radius) with semibold ink text, others medium secondary ink. Minimum 36px tall.
- **Icon button:** 44px circular hit area, 22px icon at 1.9 stroke, surface-alt when pressed.

### RangeBar (signature)
The lab's own range drawn as a position, never a verdict. A sunken track (8px, or 6px compact) with fully rounded ends; the lab range as a range-band segment placed so it occupies roughly the middle 55% of the track; and a circular marker (14px, or 12px compact) ringed in the surface colour, deep teal when within range and amber outside it. It is hidden from screen readers, since the row's label speaks the value, range, flag and date. In a test row it sits between the name/value line and the flag/range footnote.

### Trend Chart
One deep teal line (2.5px, round joins) over the range band, with the lab range labelled in 11px secondary ink. Points are 5px dots (6.5px when selected, with a 16% halo), amber when outside range, each labelled with its value above and month below. Wearable charts are smaller and neutral: a 2px teal line, a dashed tertiary-ink baseline, and a surface-alt zone marking recent weeks.

### Next GP Visit Hero
The one solid-colour block in the app: deep teal ground, 20px radius, 18px padding, white text. A calendar icon with a semibold subhead label, the visit date and time in Title, the doctor in subhead at 85% opacity, and an inset 44px bar (white at 14%, 12px radius) showing brief status with a chevron.

### A4 Paper Sheet
The GP Brief and the source lab document are drawn at true A4 proportion (595:842), scaled to width, with 40pt margins. They use the paper colour set, a 2pt deep teal rule under the title, small uppercase tracked table headers, hairline row rules, amber "↓ Below / ↑ Above" text beside out-of-range values, and a QR code with the disclaimer in the footer. Uppercase tracking belongs to this print medium and its table conventions only.

### Toast
A dark ink pill floating 96px above the bottom inset, with a check icon and semibold subhead text in the ground colour. It fades and rises 12px in over 220ms, holds for 1.7s, and fades out over 200ms.

## Do's and Don'ts

### Do:
- **Do** show every lab value as a RangeBar position against the lab's own range, with the range written in a footnote ("Lab range 30–100 ng/mL").
- **Do** pair amber with words and an arrow every time a value sits outside the range.
- **Do** keep exactly one terracotta primary button per screen, pinned in the sticky footer.
- **Do** build content from grouped lists: white 16px-radius groups, hairline borders, separators inset 16px.
- **Do** use Lucide line icons at 1.75-2.2 stroke, tinted deep teal or secondary ink.
- **Do** use tabular figures for every comparable number.
- **Do** give every tappable thing a 44px target and a light haptic.
- **Do** read brand colours from `config/brand.ts`, never redefine them per screen.

### Don't:
- **Don't** use red, or colour alone, to mark a lab value. Amber plus words is the only out-of-range signal.
- **Don't** build fitness-dashboard devices: rings, scores, gauges, or alert banners.
- **Don't** put shadows on cards, groups, or buttons. Only the paper sheet, floating toasts, and the segmented thumb carry shadows.
- **Don't** theme the A4 paper for dark mode.
- **Don't** use terracotta for anything other than the primary action fill and the dot in the logo mark.
- **Don't** introduce a second typeface; the system family carries all hierarchy.
