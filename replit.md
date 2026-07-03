# Birthday Gift

A handcrafted, cinematic digital birthday gift — three full-screen immersive pages (Curiosity → Wonder → Warmth) built for mobile, designed to be shared via WhatsApp.

## Run & Operate

- `pnpm --filter @workspace/birthday-gift run dev` — run the birthday gift app
- `pnpm run typecheck` — full typecheck across all packages

## Customization

All user-facing content lives in one file: `artifacts/birthday-gift/src/config.ts`

- `name` — the birthday person's name (used in constellation + heading)
- `wish` — the personal birthday wish shown above the vinyl player
- `caption` — short caption below the vinyl player
- `songTitle` / `artistName` — displayed on the record label
- `musicFile` — path or URL to the audio file (leave empty to skip music)
- `albumArt` — optional image URL
- `whatsappNumber` — defaults to `9003083386`
- `whatsappMessage` — the prefilled WhatsApp reply message

## Stack

- React + Vite (mobile-first, scroll-snap, no backend)
- Framer Motion for all animations
- Canvas API for constellation / particle system (Page 2)
- CSS animations for teddy bear, vinyl record spin, floating particles

## Where things live

- `artifacts/birthday-gift/src/config.ts` — all customizable content
- `artifacts/birthday-gift/src/pages/PageOne.tsx` — Night sky + teddy bear
- `artifacts/birthday-gift/src/pages/PageTwo.tsx` — Constellation + name reveal
- `artifacts/birthday-gift/src/pages/PageThree.tsx` — Vinyl record player + WhatsApp CTA
- `artifacts/birthday-gift/src/components/` — TeddyBear, VinylPlayer, ConstellationCanvas, particles

## Architecture decisions

- No backend, no database — fully browser-side, shareable via a single URL
- CSS scroll-snap (y mandatory) drives the three-page experience — one section per screen-height
- IntersectionObserver fires each page's animation sequence when it enters the viewport
- VinylPlayer only spins/plays when an audio file is configured; otherwise shows a toast

## User preferences

- WhatsApp number: 9003083386 (hardcoded in config.ts)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
