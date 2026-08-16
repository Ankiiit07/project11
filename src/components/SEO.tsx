import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  product?: {
    name: string;
    description: string;
    price: number;
    currency?: string;
    images: string[];
    category: string;
    brand: string;
    rating?: number;
    reviewCount?: number;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    sku?: string;
  };
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
}

const SEO: React.FC<SEOProps> = ({
  title = '@once Business - Premium Coffee Concentrates',
  description = 'Experience premium coffee in 5 seconds with @once Business coffee concentrates. No sugar, no additives, just pure coffee convenience.',
  keywords = 'coffee, coffee concentrate, instant coffee, premium coffee, barista coffee, coffee on the go, healthy coffee, sugar free coffee',
  image = '/favicon.svg',
  url = 'https://tranquil-bonbon-7645e7.netlify.app',
  type = 'website',
  product,
  breadcrumbs = []
}) => {
  // Generate structured data
  const generateStructuredData = () => {
    const structuredData = [];

    // Organization structured data
    const organizationData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "@once Business",
      "url": "https://tranquil-bonbon-7645e7.netlify.app",
      "logo": "https://tranquil-bonbon-7645e7.netlify.app/favicon.svg",
      "description": "Premium coffee concentrates for the modern coffee lover",
      "sameAs": [
        "https://wa.me/917979837079"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-7979837079",
        "contactType": "customer service",
        "availableLanguage": "English, Hindi"
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressRegion": "India"
      }
    };
    structuredData.push(organizationData);

    // Product structured data
    if (product) {
      const productData: any = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": product.images,
        "brand": {
          "@type": "Brand",
          "name": product.brand
        },
        "category": product.category,
        "sku": product.sku,
        "mpn": product.sku,
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": product.currency || "INR",
          "availability": `https://schema.org/${product.availability || 'InStock'}`,
          "url": url,
          "seller": {
            "@type": "Organization",
            "name": "@once Business"
          }
        }
      };

      if (product.rating && product.reviewCount) {
        productData.aggregateRating = {
          "@type": "AggregateRating",
          "ratingValue": product.rating,
          "reviewCount": product.reviewCount,
          "bestRating": 5,
          "worstRating": 1
        };
      }

      structuredData.push(productData);
    }

    // Breadcrumb structured data
    if (breadcrumbs.length > 0) {
      const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": crumb.url
        }))
      };
      structuredData.push(breadcrumbData);
    }

    // Website structured data
    const websiteData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "@once Business",
      "url": "https://tranquil-bonbon-7645e7.netlify.app",
      "description": "Premium coffee concentrates for the modern coffee lover",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://tranquil-bonbon-7645e7.netlify.app/products?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    };
    structuredData.push(websiteData);

    return structuredData;
  };

  const structuredData = generateStructuredData();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="@once Business" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="@once Business" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@oncebusiness" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      <meta name="theme-color" content="#8B7355" />
      <meta name="msapplication-TileColor" content="#8B7355" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://checkout.razorpay.com" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
      
      {/* Structured Data */}
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </Helmet>
  );
};

export default SEO; 