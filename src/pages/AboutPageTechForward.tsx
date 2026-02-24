import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Target, Heart, Zap, Coffee } from 'lucide-react';

const AboutPageTechForward: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary to-background py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              About <span className="text-primary">Cafe at Once</span>
            </h1>
            <p className="text-lg sm:text-xl text-foreground/70 leading-relaxed">
              We're revolutionizing coffee consumption with precision-engineered concentrates 
              that deliver barista-quality coffee in just 5 seconds. No machines, no mess—just 
              pure coffee perfection.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Our <span className="text-primary">Story</span>
              </h2>
              <div className="space-y-4 text-foreground/70 leading-relaxed">
                <p>
                  Founded with a vision to make premium coffee accessible to everyone, everywhere, 
                  Cafe at Once was born from a simple question: Why should great coffee be complicated?
                </p>
                <p>
                  We spent years perfecting our coffee concentrate technology, working with master 
                  roasters and food scientists to create a product that captures the full flavor 
                  profile of freshly brewed coffee in a convenient, portable format.
                </p>
                <p>
                  Today, we're India's #1 coffee concentrate brand, trusted by thousands of coffee 
                  lovers who refuse to compromise on quality or convenience.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80"
                alt="Coffee preparation"
                className="rounded-2xl shadow-2xl w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-foreground text-white py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              Our <span className="text-primary">Values</span>
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: 'Quality First',
                description: '100% Arabica beans sourced from premium coffee regions',
              },
              {
                icon: Zap,
                title: 'Innovation',
                description: 'Pioneering coffee concentrate technology for modern lifestyles',
              },
              {
                icon: Heart,
                title: 'Customer Focus',
                description: 'Your satisfaction and coffee experience is our priority',
              },
              {
                icon: Target,
                title: 'Sustainability',
                description: 'Committed to eco-friendly practices and packaging',
              },
              {
                icon: Users,
                title: 'Community',
                description: 'Building a community of coffee lovers across India',
              },
              {
                icon: Coffee,
                title: 'Authenticity',
                description: 'No sugar, no additives—just pure, natural coffee',
              },
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-white/70">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '50K+', label: 'Happy Customers' },
              { number: '5s', label: 'Brew Time' },
              { number: '100%', label: 'Natural Ingredients' },
              { number: '4.9★', label: 'Average Rating' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <div className="font-heading text-4xl sm:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-foreground/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPageTechForward;
