---
title: Landing Page Systems
tags:
  - marketing
  - saas
  - conversion
  - web-dev
created: '2026-04-12T00:00:00.000Z'
updated: '2026-04-12T00:00:00.000Z'
---

# Landing Page Systems

## The Philosophy

Landing pages are where [[Tech-Stack-Preferences]] meets [[Local-Business-Optimization]].

## What Makes a Great Landing Page?

### The Formula
1. **Clear Value Proposition** - What do you get?
2. **Social Proof** - Trust indicators
3. **Single CTA** - One action to take
4. **Mobile First** - 90%+ Indonesian users
5. **Fast Loading** - < 2 seconds on 4G

## Components

### Hero Section
```typescript
// Above the fold
- Headline: 6-8 words, benefit-focused
- Subheadline: What + Who + Result
- CTA: Single action, contrasting color
- Visual: Product screenshot or lifestyle image
```

### Social Proof
- Customer logos
- Testimonial quotes
- Review counts (Google, Tokopedia)
- "Used by X businesses"

### Problem/Solution
```
Problem: "Struggling to get event photos?"
Solution: "Photobooth that delivers instantly"
Result: "Happy guests, viral sharing"
```

### Pricing Display
See [[Local-Business-Optimization]] for IDR pricing tips.

## Tech Implementation

### Stack (from [[Tech-Stack-Preferences]])
- **Framework**: Next.js 16 (PPR for fast loads)
- **Styling**: Tailwind CSS (smaller bundles)
- **Animations**: Framer Motion (smooth, performant)
- **Forms**: React Hook Form + Zod validation
- **Analytics**: Vercel Analytics or Plausible

### Performance Must-Haves
```typescript
// next.config.js
cacheComponents: true  // PPR for static shell

// Image optimization
import Image from 'next/image'
// WebP, lazy loading, responsive

// Font optimization
import { Inter } from 'next/font/google'
// Self-host, no blocking
```

## Conversion Optimization

### A/B Testing
**Tools**: Vercel Speed Insights, PostHog

**Test elements**:
- Headline variants
- CTA button color
- Pricing display
- Form field count
- Social proof placement

### Lead Capture
**For Indonesian market**:
```typescript
// WhatsApp over email
const contactMethods = {
  primary: "WhatsApp",
  fallback: "Email",
  reason: "Email not culturally adopted"
}
```

## Template Library

### Service Business (Aethers)
- Hero: "Transform Your Business Digitally"
- CTA: "Get Free Consultation"
- Proof: Case studies, client logos

### Product (Photobooth SaaS)
- Hero: "Event Photos, Instantly Delivered"
- CTA: "Try Demo Free"
- Proof: Sample galleries, event photos

### E-commerce
- Hero: Products + Lifestyle
- CTA: "Shop Now with Free Shipping"
- Proof: Reviews, ratings, sold count

## Integration Points

### With [[Business-Entities]]
- Aethers: Showcase services, lead form
- DGT_LZ: Case studies, portfolio
- ARI_DEV: Blog, projects

### With [[AI-Systems-Roadmap]]
- AI-powered copy suggestions
- Dynamic pricing based on lead score
- Chatbot for qualification

## Next Steps

1. Build template library
2. Create case studies from shipped projects
3. Develop pricing calculator (IDR-aware)
4. Add WhatsApp integration
5. Launch A/B testing program

## Related Notes

- [[Business-Ideas]] - Revenue models
- [[Photobooth-SaaS-Plan]] - Flagship product
