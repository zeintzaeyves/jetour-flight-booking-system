# Jetour design system

Reference page: `/styleguide` (not indexed). Tokens live in `app/globals.css`.

The look is the original Jetour dark glass style: a near-black canvas, translucent white "glass"
cards with blur, pill-shaped controls, soft sky-blue glows, Helvetica, and white primary buttons.
The site is dark-only.

## Principles
- Dark, quiet, generous whitespace. White for primary actions, **one** sky accent for the conversion action.
- Hierarchy through type weight and spacing. Glass + subtle glow instead of heavy shadows.
- Every interactive element has a visible focus ring, a >= 40px target, and a label.

## Tokens
| Role | Token | Use |
|---|---|---|
| Canvas | `background` (#050706), `surface` | page, faint section lift |
| Glass | `card` (white 4.5%, blurred) | cards, panels, forms |
| Primary | `primary` (white) | default buttons, logo mark |
| Accent | `brand`, `brand-soft`, `brand-ink` | Search/Book CTA, links, info |
| Status | `success`, `warning`, `destructive` + `*-soft`/`*-ink` | badges, alerts |
| Line | `border`, `input`, `ring` | dividers, fields, focus |

Contrast rules learned the hard way: use `*-ink` colours for **text** on dark (the solid
`destructive` red is only for fills; as text it is 3.3:1). `brand-foreground` is dark on the sky fill.

## Type (Helvetica, as in the original)
`text-display` > `text-headline` > `text-title` > body (16) > `text-sm` > `text-eyebrow`.
Use `tabular-nums` for prices and times. Do not add ad-hoc `text-[..]` sizes.

## Components
- Buttons are pills: `default` (white), `brand` (sky, one per view), `outline` (glass), `ghost`, `destructive`.
- Inputs and selects are 48px pills with a white/10 fill; textareas are rounded-[1.5rem]. Errors use
  `aria-invalid` + helper text in `text-danger-ink` (never colour alone).
- Cards are rounded-[1.75rem] glass (`bg-card` adds the backdrop blur globally).
- Status: always `<StatusBadge status=... />`. Money: `formatPeso()`.
- Layout: `Container`, `Section`, `PageHeader`. Ambient glows are fixed behind every page in `globals.css`.
