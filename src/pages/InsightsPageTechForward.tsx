import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Leaf, Award, TrendingUp, BookOpen, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const InsightsPageTechForward: React.FC = () => {
  const insights = [
    {
      id: 1,
      title: 'What Is Nitrogen-Preserved Coffee?',
      excerpt: 'Learn how nitrogen washing locks in freshness, aroma, and flavour — without refrigeration or additives.',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80',
      category: 'Science',
      readTime: '8 min read',
      link: '/blog/what-is-nitrogen-preserved-coffee',
    },
    {
      id: 2,
      title: 'Best Portable Coffee for Travellers in India',
      excerpt: 'Forget sachets and bad hotel coffee. Discover the best portable coffee solutions for Indian travellers.',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80',
      category: 'Travel',
      readTime: '10 min read',
      link: '/blog/best-portable-coffee-travellers-india',
    },
    {
      id: 3,
      title: 'Instant vs Brewed Coffee: The Real Difference',
      excerpt: "A deep dive into how instant coffee is made — and why real brewed coffee delivers a superior experience.",
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80',
      category: 'Education',
      readTime: '7 min read',
      link: '/blog/instant-vs-brewed-coffee-difference',
    },
    {
      id: 4,
      title: 'How to Make Coffee Without a Machine',
      excerpt: 'No espresso machine? No problem. Here are 5 ways to make excellent coffee anywhere.',
      image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80',
      category: 'Brewing',
      readTime: '6 min read',
      link: '/blog/how-to-make-coffee-without-machine',
    },
    {
      id: 5,
      title: 'Why Arabica Coffee Matters',
      excerpt: "Not all coffee beans are created equal. Learn why Arabica is the gold standard.",
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80',
      category: 'Knowledge',
      readTime: '5 min read',
      link: '/blog/why-arabica-coffee-matters',
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-4 pb-16">
      <SEO 
        title="Coffee Insights & Blog | Cafe at Once"
        description="Expert articles on coffee science, brewing techniques, and travel-ready coffee solutions. Learn about nitrogen-preserved coffee and more."
        url="https://cafeatonce.com/insights"
        breadcrumbs={[
          { name: "Home", url: "https://cafeatonce.com" },
          { name: "Coffee Insights", url: "https://cafeatonce.com/insights" }
        ]}
      />
      
      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary to-background py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Coffee <span className="text-primary">Insights</span>
            </h1>
            <p className="text-lg text-foreground/70">
              Dive deep into the world of coffee with expert articles on nitrogen preservation, brewing guides, and travel-ready coffee solutions
            </p>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-card border border-border rounded-2xl overflow-hidden grid lg:grid-cols-2 gap-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-video lg:aspect-auto">
              <img
                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80"
                alt="Nitrogen-preserved coffee science"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full w-fit mb-4">
                Featured
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
                What Is Nitrogen-Preserved Coffee?
              </h2>
              <p className="text-foreground/70 mb-6 leading-relaxed">
                Learn how nitrogen washing locks in freshness, aroma, and flavour — without refrigeration or additives. 
                The science behind Cafe at Once explained.
              </p>
              <div className="flex items-center gap-4 text-sm text-foreground/60 mb-6">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  8 min read
                </span>
                <span>•</span>
                <span>January 2026</span>
              </div>
              <Link 
                to="/blog/what-is-nitrogen-preserved-coffee"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-all w-fit"
              >
                Read Article
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {insights.slice(1).map((insight, index) => (
              <motion.article
                key={insight.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={insight.image}
                    alt={insight.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-medium px-2.5 py-1 bg-primary/10 text-primary rounded-full">
                      {insight.category}
                    </span>
                    <span className="text-xs text-foreground/60">{insight.readTime}</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {insight.title}
                  </h3>
                  <p className="text-sm text-foreground/70 mb-4">{insight.excerpt}</p>
                  <Link 
                    to={insight.link}
                    className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                  >
                    Read More →
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 sm:py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Watch & <span className="text-primary">Learn</span>
            </h2>
            <p className="text-foreground/70 text-lg">Visual guides to help you brew the perfect cup</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-card border border-border rounded-2xl overflow-hidden">
              <video
                src="https://res.cloudinary.com/dtcsms7zn/video/upload/v1751395895/526c3573288b46a0a85fec27d8630925.HD-1080p-7.2Mbps-15882571_1_lxeljd.mp4"
                controls
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InsightsPageTechForward;
