import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';

const HowToMakeCoffeeWithoutMachine: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pb-16">
      <SEO 
        title="How to Make Coffee Without a Machine (5 Methods) | Cafe at Once"
        description="No espresso machine? No problem. Here are 5 ways to make excellent coffee anywhere — including the fastest method yet."
        url="https://cafeatonce.com/blog/how-to-make-coffee-without-machine"
        type="article"
        breadcrumbs={[
          { name: "Home", url: "https://cafeatonce.com" },
          { name: "Blog", url: "https://cafeatonce.com/insights" },
          { name: "How to Make Coffee Without a Machine", url: "https://cafeatonce.com/blog/how-to-make-coffee-without-machine" }
        ]}
        howTo={{
          name: "How to Make Coffee Without a Machine",
          description: "Multiple methods to make excellent coffee without expensive equipment",
          totalTime: "PT5M",
          steps: [
            { name: "French Press Method", text: "Add coarse ground coffee to French press, pour hot water, steep for 4 minutes, press and serve" },
            { name: "Pour Over Method", text: "Place filter in dripper, add medium ground coffee, pour hot water in circular motions, let drip through" },
            { name: "Cowboy Coffee", text: "Boil water, add coarse ground coffee, let settle for 4 minutes, pour carefully avoiding grounds" },
            { name: "Cold Brew Method", text: "Combine coarse ground coffee with cold water, steep for 12-24 hours, strain and serve over ice" },
            { name: "Press Tube Method", text: "Remove cap from Cafe at Once tube, position over cup, press firmly, add water and stir" }
          ]
        }}
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
            Brewing Guide
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-6">
            How to Make Coffee Without a Machine (5 Methods)
          </h1>
          <p className="text-xl text-foreground/70 mb-6">
            No espresso machine? No problem. Here are 5 ways to make excellent coffee anywhere — 
            including the fastest method yet.
          </p>
          <div className="flex items-center gap-6 text-sm text-foreground/60">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              January 2026
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              6 min read
            </span>
          </div>
        </motion.header>

        <div className="aspect-video bg-secondary rounded-2xl overflow-hidden mb-12">
          <img
            src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80"
            alt="Making coffee without a machine"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Method 1: French Press (4 minutes)
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              [Step-by-step instructions for French press brewing]
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Method 2: Pour Over (3-4 minutes)
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              [Step-by-step instructions for pour-over brewing]
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Method 3: Cowboy Coffee (5 minutes)
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              [Step-by-step instructions for traditional cowboy/campfire coffee]
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Method 4: Cold Brew (12+ hours)
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              [Step-by-step instructions for cold brew preparation]
            </p>
          </section>

          <section className="mb-12 bg-primary/5 p-8 rounded-xl border border-primary/20">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Method 5: Press Tube (5 seconds)
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The fastest method — and arguably the best tasting. <Link to="/products" className="text-primary hover:underline">Cafe at Once press tubes</Link> contain 
              real brewed Arabica coffee, nitrogen-preserved for freshness. No grinding, no steeping, no equipment.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-foreground/80">
              <li>Remove the cap from the Cafe at Once tube</li>
              <li>Position tube over your cup</li>
              <li>Press firmly to dispense the concentrate</li>
              <li>Add 300ml of water (hot, cold, or room temperature)</li>
              <li>Stir and enjoy</li>
            </ol>
          </section>
        </div>

        <div className="bg-secondary rounded-2xl p-8 mt-12">
          <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
            The Fastest Way to Real Coffee
          </h3>
          <p className="text-foreground/70 mb-6">
            When time matters but quality can't be compromised, Cafe at Once delivers real brewed coffee in 5 seconds. 
            No machine needed — just press and go.
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

export default HowToMakeCoffeeWithoutMachine;
