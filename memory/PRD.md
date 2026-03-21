# Coffee@Once SEO Implementation - PRD

## Original Problem Statement
Implement comprehensive SEO strategy for Coffee@Once (cafeatonce.com) - India's first nitrogen-preserved brewed Arabica coffee brand.

## Architecture & Tech Stack
- **Framework**: Vite + React + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: Zustand, React Query
- **Animation**: Framer Motion
- **Deployment**: Netlify

## User Personas
1. **Premium Frequent Travellers** - Flights, remote locations, hotels
2. **Remote Workers** - Need quality coffee without café access
3. **Coffee Purists** - Refuse to compromise on taste

## Core Requirements (Static)
- Meta titles & descriptions for all pages
- Organization, Product, HowTo, FAQPage schema (JSON-LD)
- Internal linking with exact anchor text
- Blog post stubs with SEO metadata
- Image alt text optimization

## What's Been Implemented (Jan 2026)

### 1. Meta Tags & Schema Markup
- [x] Updated `index.html` with new meta title, description, and Organization schema
- [x] Enhanced `SEO.tsx` component with:
  - Organization schema
  - Product schema with additionalProperty
  - HowTo schema
  - FAQPage schema
  - Breadcrumb schema
  - Updated brand name from "@once Business" to "Coffee@Once"

### 2. Homepage SEO Optimization
- [x] Core tagline: "Real Coffee. No Machine. No Compromise. Just Press."
- [x] Updated hero copy with nitrogen-preservation messaging
- [x] Added key product benefits: 12-month shelf life, TSA safe, any water temp
- [x] HowTo schema for using press tube

### 3. FAQ Page Created
- [x] New `/faq` route with 8 comprehensive FAQs
- [x] FAQPage schema markup
- [x] Covers: product basics, nitrogen preservation, shelf life, TSA compliance, ingredients

### 4. Blog Post Stubs Created (5 posts)
1. `/blog/what-is-nitrogen-preserved-coffee` - Featured article
2. `/blog/best-portable-coffee-travellers-india` - Travel guide
3. `/blog/instant-vs-brewed-coffee-difference` - Education
4. `/blog/how-to-make-coffee-without-machine` - Brewing guide with HowTo schema
5. `/blog/why-arabica-coffee-matters` - Coffee knowledge

### 5. Internal Linking Strategy
- [x] Homepage links to FAQ and blog posts
- [x] Footer includes FAQ and top 3 blog posts
- [x] Insights page links to all blog articles
- [x] Product pages link to FAQ
- [x] About page links to nitrogen preservation blog post
- [x] Shop page links to FAQ

### 6. Page-Specific SEO
- [x] Products page: Updated title, description
- [x] Product detail pages: Product + HowTo + FAQ schema
- [x] About page: SEO meta tags and internal links
- [x] Insights/Blog page: SEO meta and article links

### 7. Image Alt Text
- [x] Hero image: "Coffee@Once nitrogen-preserved Arabica coffee press tube being held"
- [x] Product images: Descriptive alt text pattern

## Prioritized Backlog

### P0 - Critical (Next Sprint)
- [ ] Write full body content for "What Is Nitrogen-Preserved Coffee?" blog post
- [ ] Submit sitemap to Google Search Console
- [ ] Verify rich results with Google's Rich Results Test

### P1 - High Priority
- [ ] Write remaining blog post body content
- [ ] Add product-specific FAQs to each product page
- [ ] Implement product comparison table
- [ ] Add testimonials with Review schema

### P2 - Medium Priority
- [ ] Create dedicated landing pages for variants (Americano, Latte, Mocha)
- [ ] Add collection/category page copy
- [ ] Implement breadcrumb navigation UI

## Next Tasks
1. Test all schema markup with Google's Rich Results Test
2. Verify meta tags with metatags.io
3. Write complete blog post content (priority: nitrogen-preserved coffee)
4. Publish second blog post within 2 weeks
5. Commit to monthly blog publishing schedule
