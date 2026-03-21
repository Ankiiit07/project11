import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Coffee, Thermometer, Clock, Package, Leaf, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const faqs = [
    {
      question: "What is Cafe at Once?",
      answer: "Cafe at Once is India's first nitrogen-preserved brewed Arabica coffee in a portable press tube. It's real coffee — not instant powder — preserved using nitrogen washing to lock in freshness for up to 12 months without refrigeration.",
      icon: Coffee
    },
    {
      question: "How does nitrogen preservation work?",
      answer: "Our proprietary nitrogen-washing process replaces oxygen with food-grade nitrogen, preventing oxidation and preserving the coffee's natural oils, aroma, and flavour. This is the same technology used in premium craft beers and wines — now applied to coffee for the first time in India.",
      icon: ShieldCheck
    },
    {
      question: "Do I need hot water to use Cafe at Once?",
      answer: "No — Cafe at Once works with any water temperature. Hot, cold, or room temperature. Simply press the tube into your cup, add water, stir, and enjoy. Perfect for travel, camping, or anywhere you don't have access to a kettle.",
      icon: Thermometer
    },
    {
      question: "How long does Cafe at Once last?",
      answer: "Each tube has a shelf life of 12 months from the date of manufacture. No refrigeration required. Store in a cool, dry place away from direct sunlight.",
      icon: Clock
    },
    {
      question: "Is Cafe at Once TSA/flight safe?",
      answer: "Yes — Cafe at Once tubes are fully TSA compliant and carry-on safe. Each tube contains 16g of coffee concentrate, well under liquid limits. Perfect for frequent flyers who refuse to compromise on coffee quality.",
      icon: Package
    },
    {
      question: "What's in Cafe at Once? Any additives?",
      answer: "Just one ingredient: 100% brewed Arabica coffee. Zero sugar. Zero additives. Zero preservatives. Zero artificial flavourings. We believe real coffee doesn't need anything else.",
      icon: Leaf
    },
    {
      question: "How much coffee does one tube make?",
      answer: "One full press makes approximately 300ml of coffee (standard large cup). For a smaller serving, use a half press for approximately 150ml. Adjust water quantity to your preferred strength.",
      icon: Coffee
    },
    {
      question: "What's the difference between Americano, Latte, and Mocha variants?",
      answer: "Americano is our classic black coffee — bold, pure, and unsweetened. Latte is designed to be mixed with milk for a creamier experience. Mocha includes natural cocoa notes for chocolate lovers. All variants are sugar-free and preservative-free.",
      icon: Coffee
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-16">
      <SEO 
        title="FAQ | Cafe at Once — Nitrogen-Preserved Coffee Questions Answered"
        description="Everything you need to know about Cafe at Once nitrogen-preserved Arabica coffee. How it works, shelf life, ingredients, and more."
        url="https://cafeatonce.com/faq"
        faq={faqs.map(f => ({ question: f.question, answer: f.answer }))}
        breadcrumbs={[
          { name: "Home", url: "https://cafeatonce.com" },
          { name: "FAQ", url: "https://cafeatonce.com/faq" }
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary to-background py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Frequently Asked <span className="text-primary">Questions</span>
            </h1>
            <p className="text-lg text-foreground/70">
              Everything you need to know about Cafe at Once nitrogen-preserved coffee
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const Icon = faq.icon;
              const isOpen = openIndex === index;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="bg-card border border-border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-secondary/50 transition-colors"
                    aria-expanded={isOpen}
                    data-testid={`faq-question-${index}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="font-heading text-lg font-semibold text-foreground pr-4">
                        {faq.question}
                      </h2>
                    </div>
                    <ChevronDown 
                      className={`h-5 w-5 text-foreground/60 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pl-20">
                      <p className="text-foreground/70 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Our team is here to help. Reach out to us anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary hover:bg-cream-dark font-semibold rounded-full transition-colors"
              data-testid="faq-contact-btn"
            >
              Contact Us
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-primary font-semibold rounded-full transition-colors"
              data-testid="faq-shop-btn"
            >
              Shop Cafe at Once
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
