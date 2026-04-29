# SERENDIPITY — Hair Atelier (PRD)

## Original Problem Statement
Build a modern, elegant, fully responsive website for a professional hair salon. Sections: Header (logo + nav + scroll animation), Hero (background image, animated CTA), Services (corte, tinte, peinados, tratamientos with hover effects), Gallery (images with lightbox/zoom), Testimonials (auto carousel), Contact (form + map + WhatsApp), Footer (socials, contact, hours). Animations: scroll fade/slide/zoom, hover effects, transitions, initial loader, auto carousel. Optional: dark/light mode, booking system, parallax.

## User Choices
- Style: Unisex modern — black + gold + white (luxury aesthetic)
- Brand name: SERENDIPITY
- Booking system: Full system (service → stylist → date/time → confirmation)
- Gallery images: Unsplash stock
- Dark/Light mode: Yes (dark default)

## Architecture
- **Backend**: FastAPI + MongoDB (collections: `bookings`, `contact_messages`); static catalogs for services, stylists, gallery, testimonials. Endpoints: `/api/services`, `/api/stylists`, `/api/gallery`, `/api/testimonials`, `/api/bookings/availability`, `/api/bookings` (POST + GET), `/api/contact`.
- **Frontend**: React 19 + Tailwind + shadcn/ui + framer-motion. Fonts: Playfair Display (headings) + Outfit (body). Custom theme via CSS variables (gold #D4AF37 dark / #C59B27 light).

## Implemented (Dec 2025)
- Initial loader animation (SERENDIPITY wordmark + gold underline reveal)
- Sticky glassmorphic header with theme toggle, desktop & mobile nav
- Hero with Ken Burns image background, parallax feel, animated entry, gradient overlay, scroll cue
- Services grid (4 cards, gold hover, ArrowUpRight rotation)
- Bento gallery (masonry columns) with framer-motion reveal + Dialog lightbox (a11y compliant)
- Testimonials auto-carousel (5s rotation) + dot navigation + decorative marquee
- 4-step booking flow (service → stylist → calendar/time slots → form/summary → confirmation card with reservation code)
- Contact form (validated, persists to MongoDB) + Google Maps iframe + animated pulsing WhatsApp FAB
- Footer (hours, address, social icons)
- Dark/light theme persisted in localStorage; defaults to dark
- All elements have `data-testid` attributes
- Backend regression test suite (11 cases passing)

## Tested
- 100% backend pytest (11/11)
- 100% frontend E2E flows: booking complete cycle, theme toggle, gallery lightbox, contact submission, mobile menu, navigation

## Backlog (P1 / P2)
- P1: Email confirmation for bookings (Resend/SendGrid integration)
- P1: Admin dashboard to view/cancel bookings
- P2: Real Google Maps API key for live map
- P2: Image upload for own gallery / stylist photos
- P2: Loyalty program / gift cards
- P2: Online payment via Stripe at booking time
