
# Documa Design System

## What Documa is

Documa is a Spanish-language product that turns raw, unstructured notes — typed,
pasted, or dictated by voice — into finished formal documents. The user picks a
Word template, dictates or pastes messy notes plus a few photos, and an AI
distributes and redrafts that free text into the template's placeholders while
photos are auto-fit into image slots without distortion. The pitch line from the
demo: *"Dicta o pega notas en crudo y sube tus fotos: la IA reparte y redacta el
texto, y las imágenes se ajustan solas sin deformarse."*

Two artifacts were provided as source of truth for this design system:

- `PROYECTO DOCUMA/demo-rellenador-plantillas DOCUMA.html` — a fully working,
  self-contained interactive demo of the product's core loop (pick a template,
  dictate/paste notes, upload photos, generate, watch the document type itself
  in, download). This is the **primary visual and interaction source** for
  everything in this design system — every color, type spec, spacing value,
  animation, and component shape below was extracted directly from this file.
- `PROYECTO DOCUMA/manual-arquitectura-produccion-escalable DOCUMA.md` — a
  technical architecture manual (NestJS/Clean Architecture, BullMQ queues,
  docxtemplater, an AI adapter over Claude, ONLYOFFICE editor integration). It
  is backend/engineering-facing and contributed **product understanding**
  (the two placeholder kinds — `{{texto}}` and `{%%imagen}` — the "202
  Accepted / async job" model, the reflow-over-fixed-coordinates philosophy)
  but no visual material.

No Figma file, GitHub repo, logo, icon set, or additional screens were
attached. Everything here is inferred from that single demo screen and the
architecture doc. **If you have a Figma link, a repo, or brand assets for
Documa, attach them and this system should be rebuilt/expanded against them —
the single demo file is a good but incomplete source.**

There is currently **one product surface**: the Documa web demo/workbench
(template picker → notes input → generated document preview). The manual
describes a fuller product (template library, ONLYOFFICE editor, account/auth,
billing) that has no corresponding screen in the source — those are *not*
represented here; do not invent them.

## No logo provided

No logo, wordmark, or brand mark file was attached anywhere in the source. Per
design-system policy, none was drawn or approximated. Wherever a mark would
normally go, the wordmark **"Documa"** is set in Space Grotesk 600 — see
`assets/README.md`.

---

## Content fundamentals

Copy in the source is **entirely in Spanish** (`lang="es"`), written in a
plain, direct, slightly technical register — closer to a tool's UI copy than
marketing prose.

- **Voice:** second person informal (*tú*), e.g. *"elige el formato a
  rellenar"*, *"dicta o escribe"*. No corporate "usted" formality.
- **Casing:** sentence case throughout — labels, buttons, and headings never
  use Title Case or ALL CAPS for running text. ALL CAPS is reserved
  exclusively for mono-font metadata chrome (eyebrows, tags, slot labels —
  e.g. `OBJETIVO DEL PERIODO`), always paired with letter-spacing, never for
  body prose.
  ALL CAPS in the source is always `text-transform: uppercase` +
  `letter-spacing` applied in CSS, never typed in caps in the copy itself.
- **Terse, functional labels:** "Repartir y generar documento", "Elegir
  foto", "Cambiar", "Reiniciar demo" — verb-first, no filler words.
- **Explanatory captions do real work**, they aren't decoration: every field
  has a small gray `<span>` qualifier inline with its label, e.g. *"Plantilla
  — elige el formato a rellenar"*, *"Notas en crudo — dicta o escribe"*.
  Pattern: **bold-ish label + em dash + plain-language clarification.**
- **Honesty about limits and failure modes is explicit, not hidden.** The
  demo tells the user outright it's a 3-generation demo and explains why
  ("igual que el modelo de prueba de nuestra fuente de inspiración"), and the
  AI prompt itself instructs: *"Si para un punto no hay información, usa
  exactamente `_Pendiente de completar_`. No inventes datos."* — never
  fabricate; say plainly what's missing.
- **No emoji anywhere.** The only non-text glyphs are typographic symbols
  used as functional chrome — `{ }`, `{{ }}`, `{%% }`, `✓`, `+` — never emoji,
  never decorative icons standing in for words.
  the checkmark and empty-state braces are the closest thing to iconography
  used, and both are plain Unicode characters set in the mono font, not
  images. **Overall vibe:** a technical instrument, not a lifestyle brand —
  confident, slightly dry, unafraid to show its own mechanics (showing the
  raw `{{placeholder}}` tokens in the UI instead of hiding them).

---

## Visual foundations

**Overall vibe:** a clean, contemporary tool built around one literal sheet
of paper. The chrome around the document is technical/editorial (monospace
tags, thin hairlines, a stamped completion mark); the document itself reads
like an actual formal letter. A light, bright shell keeps focus on the
content rather than the tool's own mood — energy comes from one vivid brand
color, not from a dark/moody backdrop.

**Color:** light and vivid — a deliberate pivot from this system's first draft
(a dark ink shell with muted teal/amber), which was tried, along with three
further muted/earthy variants, and rejected on visual-direction review; this
palette is the current source of truth. `--surface-app` (`#FAFAFC`, barely-
tinted white) is the shell background; `--surface-raised` (`#EFF1F6`, a soft
cool gray) holds input panels; `--surface-paper` is pure white (`#FFFFFF`)
for the document itself — still a distinct surface from the shell around it,
just brighter. One vivid primary accent, **indigo** (`#4338CA` / `#4F46E5`
bright), used for the CTA, active/focus states, and links — nothing else
competes with it. **Orange** (`#F2660D`) is a secondary accent reserved for
*scarcity and attention*: the remaining-generations counter and the
"pending / needs input" state — never used for primary actions. A neutral
gray scale carries all secondary/supporting text on both the shell and the
paper. A single vivid **rose-red** (`#E11D48`) appears only for the
live-recording mic state and inline error text. No purple-blue gradients, no
muted/desaturated "safe" tones — colors here are confident and saturated.

**Type:** three families, each with exactly one job, never interchanged —
see `tokens/typography.css`. Space Grotesk for anything that announces
(brand name, document title, button labels); Inter for body copy and
paragraph-length UI text; JetBrains Mono for anything that is *metadata* —
tags, eyebrows, slot labels, counters, placeholder tokens. This tri-font
split is the single most identifying typographic trait of the brand — mono
is never used for prose, and Space Grotesk is never used for a paragraph.

**Spacing:** dense but not cramped; a workbench, not a marketing page. Two
even columns (`grid-template-columns: 1fr 1fr`) with a ~20px gutter, content
capped at 1180px. Fields stack with generous ~18–20px rhythm; internal
component padding runs tighter (10–14px).

**Backgrounds:** flat color only. No photographic hero imagery, no gradients
used decoratively (the one gradient in the source, on a "spent" stamp, is a
diagonal strike-through pattern, not a background effect), no hand-drawn
illustration, no repeating texture/pattern. The only "image" content in the
product is user-uploaded photos dropped into image slots.

**Animation:** used sparingly and always to represent the AI/mechanical
process actually happening, never as ornament.
- The generated document **types itself in** character-by-character (a
  variable-speed reveal with a blinking text caret) — this *is* the product's
  signature motion and should be treated as core brand motion, not a generic
  loading state.
- A soft **pulse** (scale + opacity, 1.1s ease-in-out) marks the live
  recording dot while dictating.
- Uploaded images **fade in** (`opacity` 0→1, 0.5s ease) once loaded, rather
  than popping in.
- The "Generado ✓" stamp **scales and rotates in** on a bounce curve
  (`cubic-bezier(.2,1.3,.5,1)`, 0.4s) — the one moment of playful
  overshoot in an otherwise restrained system.
- Ordinary interactive transitions (hover/border/background) are flat
  0.18s ease — brisk, no easing personality.

**Hover / press states:** hover deepens or brightens border/text color
(never a background tint or shadow) — e.g. a template row's border shifts
from hairline to vivid indigo on hover, and gets a soft indigo-tinted fill
plus inset accent bar when active/selected. Buttons brighten on hover
(`--indigo-600` → `--indigo-500`). Disabled state is a flat `opacity:
.4–.45` plus `cursor: not-allowed` — no grayscale filter, no separate
disabled palette.

**Borders & radius:** hairline `1px` borders everywhere (`--border-hairline-*`),
occasionally `1.5px` for emphasis (stamp circles) or `2px` for the strongest
rule (masthead divider, doc-head divider, "Generado" stamp border). Corner
radius is a small, consistent `4px` (`--radius-base`) almost everywhere;
`3px` for tighter nested chrome (image frames, thumbnails); fully round only
for the circular generation-stamps and the pill-shaped mic button. Nothing
in the source uses a large "friendly" radius.

**Shadows / elevation / blur:** **none.** There is no `box-shadow`,
`backdrop-filter`, or translucency-as-depth anywhere in the source. Depth and
hierarchy come entirely from flat color contrast and hairline borders — an
important, deliberate constraint to preserve. Do not add drop shadows to
cards/buttons when extending this system.

**Cards / rows:** the closest thing to a "card" is the template list row and
the generated-document panel. Both are flat-filled rectangles with a
hairline border and `4px` radius — no shadow, no gradient. Selected/active
state adds a colored inset-left accent bar (`box-shadow: inset 3px 0 0
var(--brand-primary-hover)`) plus a soft brand-tinted wash rather than
changing the whole surface color.

**Imagery vibe:** the product has no illustration or photography of its own
— all imagery is user-supplied content dropped into image slots, shown
`object-fit: contain` inside a bordered frame so nothing is ever cropped or
stretched. No filters, no forced monochrome/grain treatment are applied to
user photos.

**Transparency/blur:** used exactly once, subtly — the active template row
uses an 8%-alpha indigo wash (`--brand-primary-wash`) as a selection
background, layered under the accent bar. No blur effects anywhere.

**Fixed/layout rules:** a two-column "workbench" (input | output) that
collapses to a single column under 860px. Header and footer are simple
full-width bands, not sticky/fixed.

---

## Iconography

There is **no icon system, icon font, or SVG icon set** anywhere in the
source. Documa's "iconography" is entirely typographic:

- Braces and template-token syntax stand in for icons: `{ }` marks the empty
  document state, `{{campo}}` chips mark text placeholders in-flow, `{%%campo}`
  marks image placeholders — always set in JetBrains Mono.
- A plain Unicode checkmark (`✓`) marks the completed/"Generado ✓" stamp.
  A plain `+` marks an empty image-upload thumbnail.
- **No emoji, anywhere, for any purpose.**

Because no icon set was defined by the source, **do not introduce one**
(no Lucide/Heroicons/Material substitution) when extending this system —
continue expressing state and affordance through mono-font symbols and
color/border changes, consistent with the restrained, symbol-over-glyph
language established above. If a future screen genuinely needs a
pictographic icon (e.g. a settings gear), flag it as a gap rather than
inventing a style unilaterally.

---

## Assets

`assets/` contains no logo (see "No logo provided" above) and no icons or
illustrations (see "Iconography" above) — there was nothing to copy from the
source. It holds only `assets/README.md` documenting that absence so future
contributors don't assume something was missed.

## Fonts

Space Grotesk, Inter, and JetBrains Mono are all standard, freely-licensed
Google Fonts — exactly as loaded in the source demo (via `@import` from
`fonts.googleapis.com`). `tokens/typography.css` loads them the same way
rather than shipping binaries, since these are stock webfonts, not a custom
type cut. **If Documa has a custom/licensed typeface it uses in production
that wasn't reflected in this demo, replace this import and flag it here.**

---

## Index

```
Documa Design System/
├── readme.md                  — this file
├── SKILL.md                   — portable skill wrapper (Claude Code compatible)
├── styles.css                 — root stylesheet entry (@import list only)
├── tokens/
│   ├── colors.css             — neutral/indigo/orange/red palette + aliases
│   ├── typography.css         — Space Grotesk / Inter / JetBrains Mono scale
│   ├── spacing.css            — spacing scale, radii, layout constants
│   └── effects.css            — motion, border-width, state tokens (no shadows)
├── guidelines/                — foundation specimen cards (Design System tab)
├── assets/
│   └── README.md              — notes the absence of logo/icon assets
├── components/
│   ├── core/
│   │   ├── Button             — primary / ghost / disabled
│   │   └── TemplateCard       — selectable template row w/ token preview
│   ├── forms/
│   │   ├── TextArea           — notes input incl. focus state
│   │   ├── MicButton          — voice-dictation toggle (idle/recording/unsupported)
│   │   └── Dropzone           — drag-and-drop file upload w/ click-to-browse fallback
│   ├── document/
│   │   ├── DocSlot            — text placeholder slot (empty/filling/pending/filled)
│   │   ├── ImageSlot          — auto-fit image placeholder in the document
│   │   └── ImagePoint         — upload dropzone row (input side)
│   └── feedback/
│       ├── StampCounter       — circular "generations remaining" stamps
│       └── LimitNotice        — demo-limit-reached panel
└── ui_kits/
    └── documa-web/            — the Documa workbench, recreated from primitives
        └── index.html
```
