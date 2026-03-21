import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';

const InstantVsBrewedCoffee: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <SEO 
        title="Instant Coffee vs Brewed Coffee: What's Really in Your Cup? | Coffee@Once"
        description="A deep dive into how instant coffee is made — and why real brewed coffee (even portable) delivers a superior experience."
        url="https://cafeatonce.com/blog/instant-vs-brewed-coffee-difference"
        type="article"
        breadcrumbs={[
          { name: "Home", url: "https://cafeatonce.com" },
          { name: "Blog", url: "https://cafeatonce.com/insights" },
          { name: "Instant vs Brewed Coffee", url: "https://cafeatonce.com/blog/instant-vs-brewed-coffee-difference" }
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
            Coffee Education
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Instant Coffee vs Brewed Coffee: What's Really in Your Cup?
          </h1>
          <p className="text-xl text-foreground/70 mb-6">
            A deep dive into how instant coffee is made — and why real brewed coffee (even portable) 
            delivers a superior experience.
          </p>
          <div className="flex items-center gap-6 text-sm text-foreground/60">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              January 2026
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              7 min read
            </span>
          </div>
        </motion.header>

        <div className="aspect-video bg-secondary rounded-2xl overflow-hidden mb-12">
          <img
            src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80"
            alt="Comparison of instant and brewed coffee"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              The Uncomfortable Truth About Instant Coffee
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              Instant coffee is everywhere — it's cheap, fast, and convenient. But have you ever wondered 
              what actually goes into that powder? The journey from coffee bean to instant granule involves 
              processes that strip away much of what makes coffee special.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              How Instant Coffee Is Made
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              [Content explaining freeze-drying and spray-drying processes, loss of volatile compounds, typical bean quality used]
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              What Brewed Coffee Preserves
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              [Content about oils, aromatics, and flavour compounds retained in proper brewing methods]
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              The Third Option: Preserved Brewed Coffee
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              [Introduction to <Link to="/blog/what-is-nitrogen-preserved-coffee" className="text-primary hover:underline">nitrogen-preserved coffee</Link> as a bridge between convenience and quality]
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Taste Test: Side-by-Side Comparison
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              [Blind taste test results comparing instant, fresh brewed, and <Link to="/products" className="text-primary hover:underline">Coffee@Once</Link>]
            </p>
          </section>
        </div>

        <div className="bg-secondary rounded-2xl p-8 mt-12">
          <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
            Taste Real Brewed Coffee — Anywhere
          </h3>
          <p className="text-foreground/70 mb-6">
            Coffee@Once is real brewed Arabica coffee, preserved at peak freshness. 
            Not instant. Not a compromise. Just press and enjoy.
          </p>
          <Link 
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors"
          >
            Try Coffee@Once
          </Link>
        </div>
      </article>
    </div>
  );
};

export default InstantVsBrewedCoffee;
