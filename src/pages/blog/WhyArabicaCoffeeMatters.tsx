import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';

const WhyArabicaCoffeeMatters: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <SEO 
        title="Why Arabica Coffee Matters: A Guide to Coffee Quality | Coffee@Once"
        description="Not all coffee beans are created equal. Learn why Arabica is the gold standard — and what to look for in your next cup."
        url="https://cafeatonce.com/blog/why-arabica-coffee-matters"
        type="article"
        breadcrumbs={[
          { name: "Home", url: "https://cafeatonce.com" },
          { name: "Blog", url: "https://cafeatonce.com/insights" },
          { name: "Why Arabica Coffee Matters", url: "https://cafeatonce.com/blog/why-arabica-coffee-matters" }
        ]}
      />

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
            Coffee Knowledge
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Why Arabica Coffee Matters: A Guide to Coffee Quality
          </h1>
          <p className="text-xl text-foreground/70 mb-6">
            Not all coffee beans are created equal. Learn why Arabica is the gold standard — 
            and what to look for in your next cup.
          </p>
          <div className="flex items-center gap-6 text-sm text-foreground/60">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              January 2026
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              5 min read
            </span>
          </div>
        </motion.header>

        <div className="aspect-video bg-secondary rounded-2xl overflow-hidden mb-12">
          <img
            src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80"
            alt="Arabica coffee beans"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Arabica vs Robusta: The Two Main Species
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              When you buy coffee, you're typically getting one of two species: Arabica or Robusta. 
              While Robusta is easier to grow and has higher caffeine content, Arabica accounts for 
              about 60% of world coffee production — and for good reason.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              The Arabica Flavour Profile
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              [Content describing Arabica's complex, nuanced flavours — fruity, floral, acidic notes vs Robusta's harsh, bitter profile]
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Growing Conditions: Why Arabica Is Harder to Cultivate
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              [Content about altitude requirements, climate sensitivity, hand-picking necessity]
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Reading Coffee Labels: What to Look For
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              [Guide to identifying quality Arabica: single-origin, altitude information, roast dates]
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Why Coffee@Once Uses 100% Arabica
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              At <Link to="/products" className="text-primary hover:underline">Coffee@Once</Link>, we use exclusively 100% Arabica beans. 
              Our <Link to="/blog/what-is-nitrogen-preserved-coffee" className="text-primary hover:underline">nitrogen-preservation process</Link> is 
              specifically designed to capture and maintain the delicate aromatics and complex flavour profile 
              that makes Arabica special.
            </p>
          </section>
        </div>

        <div className="bg-secondary rounded-2xl p-8 mt-12">
          <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
            Experience 100% Arabica — Preserved at Peak Freshness
          </h3>
          <p className="text-foreground/70 mb-6">
            Coffee@Once uses only premium Arabica beans, brewed and nitrogen-preserved to lock in 
            the complex flavours that define great coffee.
          </p>
          <Link 
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors"
          >
            Shop 100% Arabica Coffee
          </Link>
        </div>
      </article>
    </div>
  );
};

export default WhyArabicaCoffeeMatters;
