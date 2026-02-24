import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TestimonialsPageTechForward: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Rahul Sharma',
      role: 'Fitness Enthusiast',
      rating: 5,
      text: 'Perfect for my gym sessions! I can have quality coffee anywhere without carrying bulky equipment. The taste is amazing!',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      name: 'Priya Patel',
      role: 'Working Professional',
      rating: 5,
      text: 'Being sugar-free and gluten-free makes this perfect for my health-conscious lifestyle. Love the convenience!',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      name: 'Arjun Mehta',
      role: 'Travel Blogger',
      rating: 5,
      text: 'As someone always on the move, Cafe at Once is a game-changer. Compact, convenient, and consistently great taste.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      role: 'Entrepreneur',
      rating: 5,
      text: 'The 5-second promise is real! Perfect for busy mornings when I need quality coffee fast.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80',
    },
    {
      id: 5,
      name: 'Vikram Singh',
      role: 'Software Engineer',
      rating: 5,
      text: 'Finally, a coffee solution that matches my tech-savvy lifestyle. Innovative, convenient, and tastes great!',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80',
    },
    {
      id: 6,
      name: 'Ananya Iyer',
      role: 'Content Creator',
      rating: 5,
      text: 'Love carrying this during shoots! Quick, mess-free, and delivers cafe-quality coffee every time.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary to-background py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Customer <span className="text-primary">Reviews</span>
            </h1>
            <p className="text-lg text-foreground/70">
              See what our customers are saying about their Cafe at Once experience
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { number: '50K+', label: 'Happy Customers' },
              { number: '4.9', label: 'Average Rating', icon: '⭐' },
              { number: '98%', label: 'Would Recommend' },
              { number: '10K+', label: 'Five Star Reviews' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-card border border-border rounded-xl p-6 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <div className="font-heading text-3xl sm:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                  {stat.icon && <span className="ml-1">{stat.icon}</span>}
                </div>
                <div className="text-sm text-foreground/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-foreground">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-foreground/60">{testimonial.role}</p>
                  </div>
                  <Quote className="h-6 w-6 text-primary/20" />
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>

                <p className="text-foreground/70 leading-relaxed">
                  "{testimonial.text}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TestimonialsPageTechForward;
