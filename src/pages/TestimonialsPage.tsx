import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeCheck, MessageSquare, Quote } from 'lucide-react';
import SEO from '../components/SEO';
import { Stars } from '../components/ProductReviews';
import { accountApi, type Review, type ReviewSummary } from '../services/accountApi';
import { getProductById } from '../data/products';

// Reviews from verified buyers only (see netlify/functions/reviews.mjs).
const TestimonialsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [summary, setSummary] = useState<ReviewSummary>({ count: 0, average: 0 });

  useEffect(() => {
    accountApi
      .getRecentReviews()
      .then((d) => {
        setReviews(d.reviews);
        setSummary(d.summary);
      })
      .catch(() => setReviews([]));
  }, []);

  const productsReviewed = new Set((reviews || []).map((r) => r.productId)).size;

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <SEO
        title="Customer Reviews | Cafe at Once"
        description="Reviews of Cafe at Once nitrogen-preserved Arabica coffee from verified buyers."
        url="https://cafeatonce.com/testimonials"
        breadcrumbs={[
          { name: 'Home', url: 'https://cafeatonce.com' },
          { name: 'Reviews', url: 'https://cafeatonce.com/testimonials' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary to-background py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Customer <span className="text-primary">Reviews</span>
            </h1>
            <p className="text-lg text-foreground/70">
              Every review here comes from someone who bought from us, marked as a verified purchase.
            </p>
          </div>
        </div>
      </section>

      {/* Stats: only real numbers, only once there are reviews */}
      {summary.count > 0 && (
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              {[
                { number: summary.average.toFixed(1), label: 'Average rating', stars: true },
                { number: String(summary.count), label: summary.count === 1 ? 'Verified review' : 'Verified reviews' },
                { number: String(productsReviewed), label: productsReviewed === 1 ? 'Product reviewed' : 'Products reviewed' },
              ].map((stat) => (
                <div key={stat.label} className="bg-card border border-border rounded-xl p-4 sm:p-6 text-center">
                  <div className="font-heading text-3xl sm:text-4xl font-bold text-primary mb-1">{stat.number}</div>
                  {stat.stars && (
                    <div className="flex justify-center mb-1">
                      <Stars value={summary.average} />
                    </div>
                  )}
                  <div className="text-sm text-foreground/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="pb-16 pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {reviews === null ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" aria-label="Loading reviews" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="max-w-xl mx-auto text-center bg-card border border-border rounded-2xl p-10">
              <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Our first reviews are on their way</h2>
              <p className="text-foreground/70 mb-6">
                We only show reviews from verified buyers, so this page fills up as customers share their experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/orders" className="px-6 py-3 bg-primary text-white font-bold rounded-full">
                  Bought from us? Write a review
                </Link>
                <Link to="/products" className="px-6 py-3 border border-border rounded-full text-foreground">
                  Shop coffee
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review, index) => {
                  const product = getProductById(review.productId);
                  return (
                    <motion.article
                      key={review.id}
                      className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all flex flex-col"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(index, 6) * 0.08, duration: 0.4 }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <Stars value={review.rating} />
                        <Quote className="h-6 w-6 text-primary/20 flex-shrink-0" />
                      </div>
                      {review.title && <h3 className="font-heading font-bold text-foreground mb-2">{review.title}</h3>}
                      <p className="text-foreground/70 leading-relaxed flex-1 whitespace-pre-line">"{review.text}"</p>
                      <div className="mt-4 pt-4 border-t border-border text-sm">
                        <p className="font-medium text-foreground">{review.name}</p>
                        <p className="inline-flex items-center gap-1 text-green-700">
                          <BadgeCheck className="h-3.5 w-3.5" /> Verified purchase
                        </p>
                        {product && (
                          <p>
                            <Link to={`/products/${product.id}`} className="text-primary hover:underline">
                              {product.name}
                            </Link>
                          </p>
                        )}
                      </div>
                    </motion.article>
                  );
                })}
              </div>
              <p className="text-center mt-10 text-foreground/70">
                Bought from us?{' '}
                <Link to="/orders" className="text-primary font-medium hover:underline">
                  Review your order
                </Link>
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default TestimonialsPage;
