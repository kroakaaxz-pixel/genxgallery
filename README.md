# Gen X Gallery

Premium framed prints for people who care about what's on their walls. Pop culture, automotive, anime, and typographic art — gallery-ready.

## Tech Stack

- **Vite** — Fast builds, instant HMR, minimal config
- **React** — Component model, small bundle for a storefront
- **React Router** — Client-side routing, no overhead
- **CSS Modules** — Scoped styles, no framework bloat, full editorial control

No Tailwind, no heavy UI libraries. Just clean, maintainable code.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — editorial hero, featured frames, category teasers, brand story |
| `/catalogue` | All products with category filter and price/name sorting |
| `/category/:id` | Category page (cars, anime, posters) with editorial header |
| `/product/:id` | Product detail — size/material selection, add to cart |
| `/customize` | Customization studio — browse designs or upload your own, live preview |
| `/cart` | Shopping cart with quantity controls and order summary |
| `/about` | Brand story page |
| `*` | Styled 404 page |

## What's Functional

- Browse all 13 sample products across 3 categories
- Filter by category, sort by price/name
- Product detail with size and frame material selection
- Add to cart with proper state management
- Cart with quantity controls, remove items, order summary
- Customization page: browse existing designs OR upload your own photo
- Live preview that updates frame color, size, and orientation
- Responsive design (mobile/tablet/desktop)
- Scroll-to-top on navigation
- Micro-interactions (hover states, image zoom, fade overlays)

## What's Mocked

- **Product images** — Uses Unsplash placeholder images (not actual product photography)
- **Checkout** — "Proceed to Checkout" button has no payment integration
- **Photo upload** — Front-end only via `uploadImage()` utility. File is read as Data URL for preview; no server storage. See below for swap-in guide.
- **Shipping/Returns/FAQ links** — Point to `#` (non-functional)
- **Social links** — Point to `#` (non-functional)
- **Search** — Header search icon is decorative (no search implementation)

## Photo Upload — Future Swap-In

Upload logic is isolated in `src/hooks/uploadImage.js`. The current implementation reads files as Data URLs for preview only.

To implement real storage:

1. **Validate**: Check MIME type (`image/jpeg`, `image/png`, `image/webp`, `image/avif`) and file size (10MB max)
2. **Upload**: Use a signed-upload flow (POST `/api/upload/sign` → PUT to S3/R2 signed URL) or a server-proxied POST to `/api/upload`
3. **Providers**: AWS S3, Cloudflare R2, Uploadthing, or Supabase Storage
4. **Return**: Public URL of the stored image, used as preview src and stored in cart state
5. **Replace**: Swap the `reader.readAsDataURL()` call in `uploadImage()` with your actual upload call

The `validateFile()` and `formatFileSize()` helpers are already exported for reuse.

## Design Decisions

- **Palette**: Cream base (`#FAF8F5`), ink-black text (`#1A1A1A`), warm red accent (`#C23B22`), text-safe accent (`#B0341F` for small text — WCAG AA 6.5:1)
- **Typography**: Playfair Display (serif, display) + Inter (sans, body)
- **Layout**: Asymmetric grids, generous whitespace, editorial-style image cropping
- **Motion**: Subtle hover states, smooth image transitions, no gratuitous animation
- **Accessibility**: Focus-visible outlines on all interactive elements, contrast-compliant accent colors for small text

## Project Structure

```
src/
├── components/     # Header, Footer, ProductCard
├── pages/          # Home, Catalogue, Category, ProductDetail, Customize, Cart, About, NotFound
├── data/           # Product data, categories, frame options
├── context/        # Cart state management
├── hooks/          # Upload utility (uploadImage.js)
└── styles/         # Global CSS variables and resets
```
