import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Leaf, Award, TrendingUp, BookOpen, Video } from 'lucide-react';
import { Link } from 'react-router-dom';

const InsightsPageTechForward: React.FC = () => {
  const insights = [
    {
      id: 1,
      title: 'The Science Behind Coffee Concentrate',
      excerpt: 'Discover how our precision extraction process captures the full flavor profile...',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80',
      category: 'Science',
      readTime: '5 min read',
    },
    {
      id: 2,
      title: 'Health Benefits of Black Coffee',
      excerpt: 'Explore the numerous health benefits of drinking pure, sugar-free coffee...',
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80',
      category: 'Health',
      readTime: '4 min read',
    },
    {
      id: 3,
      title: 'Perfect Coffee Brewing Techniques',
      excerpt: 'Master the art of brewing with our expert tips and techniques...',
      image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80',
      category: 'Brewing',
      readTime: '6 min read',
    },
    {
      id: 4,
      title: 'Coffee Culture Around the World',
      excerpt: 'Journey through different coffee traditions and cultures globally...',
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80',
      category: 'Culture',
      readTime: '7 min read',
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary to-background py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Coffee <span className="text-primary">Insights</span>
            </h1>
            <p className="text-lg text-foreground/70">
              Dive deep into the world of coffee with expert articles, brewing guides, and industry insights
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
                alt="Featured"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full w-fit mb-4">
                Featured
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
                The Complete Guide to Coffee Concentrate
              </h2>
              <p className="text-foreground/70 mb-6 leading-relaxed">
                Everything you need to know about our revolutionary coffee concentrate technology, 
                from the extraction process to the perfect serve.
              </p>
              <div className="flex items-center gap-4 text-sm text-foreground/60 mb-6">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  10 min read
                </span>
                <span>•</span>
                <span>January 2026</span>
              </div>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-all w-fit">
                Read Article
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {insights.map((insight, index) => (
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
                  <button className="text-primary hover:text-primary/80 font-medium text-sm transition-colors">
                    Read More →
                  </button>
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
