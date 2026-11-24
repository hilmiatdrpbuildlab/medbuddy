---
version: 1
slug: "mobile-src-app"
primary_target: "mobile/src/app"
related_targets: []
---

## Scope

VitalsBrief investor demo app (mobile/src/app, all routes). Mode: Operate. Build path: code-led (no image generation).

## Surface

Audience: investors watching a mirrored phone; story persona Sophie. Task: import lab report → confirm values → Labs organizer + trend → wearable trends → one-page GP Brief + QR. Constraints: MDR-safe copy, EN/NL/FR, offline, Demo controls.

## Direction contract

THESIS: A lab result is a position inside the lab's own range, never a verdict. Refuses the fitness-app dashboard of rings, scores and red alerts.
OWN-WORLD: Deep teal ink (#0B4F55 family) on white and cool near-white (#F4F7F8), hairline separators, 16–20 pt rounded surfaces, apricot accent reserved for the single primary button, amber + words for "outside lab range". System sans (SF/Roboto) with tabular figures; Lucide 1.75 stroke icons.
STORY: Sophie's scattered reports become one timeline she verified herself; the investor sees organising, not diagnosing, and the brief a GP can read in 30 seconds.
FIRST VIEWPORT: Home: large-title greeting, Next GP visit row with brief status, latest results as range-bar rows, primary "Add lab report" button pinned above the tab bar.
FORM: seed: none (pinned) — "satu warna utama teal/biru tua, latar putih dan abu-abu sangat muda, satu warna aksen hangat untuk tombol utama… amber + teks 'Below lab range'" and for the first screen "Home: sapaan, kartu \"Next GP visit\", ringkasan 3 hasil terbaru, tombol besar *Add lab report*, kartu teaser Travel Passport & Family Tree" (docs/DEMO_PLAN.md, confirmed by user 2026-11-23). Signature move: the RangeBar (lab range band + value marker) recurring in list, detail chart band, review, and printed brief; the brief rendered as a true A4 sheet.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
