# MechFlow — Landing

Marketing landing site for **MechFlow**, the industrial machine-operations platform for machinery manufacturers (machine lifecycle tracking, global fleet, real-time updates, team & permissions, reporting).

Dark, industrial "machine-panel" identity — rust/amber on deep slate, zero border-radius — derived from the real product.

## Stack

- **SvelteKit** + **Svelte 5 (Runes)** + **TypeScript**
- **TailwindCSS v4**
- `adapter-static` (prerendered marketing site)
- **WebGL thermal shader** hero (raw GLSL, no deps)
- **D3 `geo-orthographic`** customers globe (real app component, self-contained)
- **Motion** for scroll/load reveals
- **jsPDF** live sample-report export
- **@tabler/icons-svelte** (same icons as the app)
- Fonts: Space Grotesk (display), Inter (body), Geist Mono (data)

## Develop

```bash
npm install
npm run dev
```

> Requires Node 20.19+ / 22.12+ (Vite 8).

## Build

```bash
npm run build      # prerenders to ./build
npm run preview
```

## Sections

Hero (shader) → global footprint (globe) → capabilities → every module + roles/permissions → social proof → lifecycle flow → CTA → footer.
