# Product

<!-- impeccable:product-schema 1 -->

## Platform

ios

One branded design ships identically to iOS and Android (confirmed 2026-11-23). Native behaviour is kept per OS: safe areas, edge-swipe / system Back, haptics, native sheets. A web export framed as a phone is the backup pitch build.

## Stack

React Native + Expo (SDK 58, TypeScript), Expo Router, i18next (EN / NL / FR), expo-print for the GP Brief PDF. Read-only GP Brief web page for the QR flow on Cloudflare Pages. No backend; the demo runs fully offline on bundled synthetic data. Source: docs/DEMO_PLAN.md.

## Users

- **Primary (in the product story):** Belgian / EU patients who receive lab results through fragmented portals (Helena, MijnGezondheid, CoZo, lab PDFs) full of jargon, own an Apple Watch or Garmin, and have a 15-minute huisarts (GP) visit coming up. Persona: Sophie Janssens, 34, Gent, persistently tired.
- **Secondary:** the GP who receives the one-page brief at the start of a consult.
- **Audience of this demo build:** investors (angels, health VCs, imec.istart) watching a ±3-minute pitch with the phone mirrored to a big screen.

## Product Purpose

Working name VitalsBrief (temporary; trademark check pending). Turns scattered lab reports and wearable data into one organised timeline, then a one-page GP Brief the patient hands or shows (QR) to their doctor. Demo success: an investor understands the problem and the solution in ±3 minutes and sees a product that looks ready to ship and regulation-safe.

## Positioning

"Organizer, not interpreter": the product organises, standardises and presents the patient's own results and wearable trends; it never diagnoses, scores risk or flags abnormality, which keeps Phase 1 outside EU MDR 2017/745 and lets it launch in ~6 months.

## Operating Context

- Lab reports arrive as PDFs, photos of paper reports, portal shares, or forwarded email (personal forwarding address).
- Every extracted value is confirmed by the user against the source document.
- Brief is consumed by a GP in a short consult: printed, emailed, or opened via a read-only QR link valid 7 days.
- Pitch setting: mirrored phone, possibly offline; presenter uses hidden Demo controls (speed, reset, trigger inbound email).

## Capabilities and Constraints

- Demo scope: full Phase 1 flow; Phase 2 (Travel Med-Passport, Family Health Tree) as teasers only. No interaction checker, crowdfunding, or risk scores.
- OCR/AI, HealthKit and Garmin sync are simulated on synthetic data; must be presented honestly as a product demo with sample data.
- Data modelled with LOINC codes and UCUM units.
- MDR-safe microcopy is binding: never "abnormal", "risk", "detect", "diagnose", "alert"; use "Below / above the lab's range", "We organize your results", neutral numbers vs baseline, "Encrypted in transit and at rest, processed in the EU". Test explanations are fixed, general, identical for everyone, badge "Reviewed by a GP".
- GDPR Art. 9 per-purpose consent (lab data, wearable data, AI processing). EU AI Act "AI-generated content" notice.
- Languages: English default, Dutch and French switchable at runtime, local number/date formats (decimal comma in NL/FR).

## Brand Commitments

- Name, logo and primary colour live in one config file so they can change after the EUIPO/BOIP check. "MedBuddy" is not used.
- Calm, clean, trustworthy like a modern bank or hospital app; not a busy fitness app.
- Pinned visual direction from DEMO_PLAN.md (confirmed by the user): deep teal primary, white and very light gray grounds, one warm accent for primary buttons, amber plus text (never red, never colour alone) for out-of-range, Lucide line icons, rounded cards with generous space, clean charts with a gray lab-range band, dark mode.

## Evidence on Hand

- docs/DEMO_PLAN.md (plan), brief.txt (strategy), feasibility_study.pdf.
- All persona data, lab reports, labs ("Labo Noord", "Centrum Klinische Biologie") and values are synthetic and must stay labelled as sample data. No real lab names/logos, no customer, partner, or clinical-validation claims. Clinical advisor review of numbers and explanations is still pending.

## Product Principles

1. Organise, never interpret: show the lab's own range and flag, never a verdict.
2. The user stays in control: confirm, edit, and trace every number to its source.
3. One primary action per screen, summary first, detail on tap.
4. Feedback is always visible: progress, checkmarks, haptics, saved states; no empty screen without explanation.
5. Demo must not fail: offline, deterministic, resettable.

## Accessibility & Inclusion

WCAG 2.2 AA contrast; body ≥16 pt with OS font scaling respected; touch targets ≥44×44 pt; status never by colour alone; screen-reader labels on charts; Reduce Motion honoured.
