import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';

const NitrogenPreservedCoffee: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pb-16">
      <SEO 
        title="What Is Nitrogen-Preserved Coffee? | Cafe at Once Blog"
        description="Learn how nitrogen washing locks in freshness, aroma, and flavour — without refrigeration or additives. The science behind Cafe at Once explained."
        url="https://cafeatonce.com/blog/what-is-nitrogen-preserved-coffee"
        type="article"
        breadcrumbs={[
          { name: "Home", url: "https://cafeatonce.com" },
          { name: "Blog", url: "https://cafeatonce.com/insights" },
          { name: "What Is Nitrogen-Preserved Coffee?", url: "https://cafeatonce.com/blog/what-is-nitrogen-preserved-coffee" }
        ]}
      />

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/insights" 
          className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Insights
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Coffee Science
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-6">
            What Is Nitrogen-Preserved Coffee?
          </h1>
          <p className="text-xl text-foreground/70 mb-6">
            Learn how nitrogen washing locks in freshness, aroma, and flavour — without refrigeration or additives. The science behind Cafe at Once explained.
          </p>
          <div className="flex items-center gap-6 text-sm text-foreground/60">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              January 2026
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              8 min read
            </span>
          </div>
        </motion.header>

        {/* Featured Image */}
        <div className="aspect-video bg-secondary rounded-2xl overflow-hidden mb-12">
          <img
            src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80"
            alt="Nitrogen-preserved coffee being prepared"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Introduction: The Problem with Traditional Coffee
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              Coffee begins to lose its freshness the moment it's brewed. Oxygen exposure leads to oxidation, 
              which degrades the delicate oils and aromatic compounds that give coffee its distinctive flavour. 
              This is why freshly brewed coffee tastes so different from coffee that's been sitting for hours. 
              But what if there was a way to pause time — to preserve that just-brewed freshness indefinitely?
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Enter <Link to="/products" className="text-primary hover:underline">nitrogen-preserved coffee</Link> — 
              a revolutionary approach that's changing how we think about portable, premium coffee.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              How Nitrogen Preservation Works
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              [Full body content to be written — explaining the nitrogen-washing process, 
              how it differs from freeze-drying or spray-drying, and why it preserves flavour better than any other method.]
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Why Nitrogen Instead of Other Gases?
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              [Content explaining nitrogen's inert properties, food-grade safety, and why it's superior to vacuum sealing or other preservation methods.]
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              The Difference You Can Taste
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              [Content describing the taste profile of nitrogen-preserved coffee vs instant coffee, with specific tasting notes.]
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Perfect for Travellers and Coffee Purists
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              [Content targeting the primary persona — frequent flyers, remote workers, hotel travellers who demand quality.]
            </p>
          </section>
        </div>

        {/* CTA Section */}
        <div className="bg-secondary rounded-2xl p-8 mt-12">
          <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
            Experience Nitrogen-Preserved Coffee
          </h3>
          <p className="text-foreground/70 mb-6">
            Ready to taste the difference? Try Cafe at Once — India's first nitrogen-preserved 
            Arabica coffee in a portable press tube.
          </p>
          <Link 
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors"
          >
            Shop Cafe at Once
          </Link>
        </div>
      </article>
    </div>
  );
};

export default NitrogenPreservedCoffee;
