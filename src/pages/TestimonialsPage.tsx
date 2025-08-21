import React from 'react';
import { Star, Quote, ArrowLeft, ArrowRight } from 'lucide-react';

const TestimonialsPage: React.FC = () => {
  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const testimonials = [
    {
      id: 1,
      name: 'Keshav Lodha',
      role: 'Student',
      company: 'Wells Fargo',
      image:
        'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751820365/1722080230663_f6snqi.jpg',
      rating: 5,
      text: "The convenience of Cafe at Once coffee is unmatched! As someone who works long hours, having perfect coffee in just 5 seconds has been a game-changer. The taste is incredible and it's completely sugar-free.",
      location: 'Mumbai',
    },
    {
      id: 2,
      name: 'Sheen Sara Abraham',
      role: 'Marketing Manager',
      company: 'Digital Agency',
      image:
        'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751820364/1721480541186_igpprs.jpg',
      rating: 5,
      text: "I've tried many instant coffees, but Cafe at Once is different. It's the healthiest option I've found in India - no sugar, no gluten, just pure coffee goodness. Perfect for my busy lifestyle!",
      location: 'Delhi',
    },
    {
      id: 3,
      name: 'Aditya Dusane',
      role: 'Entrepreneur',
      company: 'Startup Founder',
      image:
        'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751820364/1715056163445_fuvtno.jpg',
      rating: 5,
      text: "The quality is outstanding! Being health-conscious, I love that it's completely natural with no additives. The concentrate system is brilliant - I can enjoy barista-quality coffee anywhere.",
      location: 'Bangalore',
    },
    {
      id: 4,
      name: 'Abhinav',
      role: 'Product Manager',
      company: 'Play Simple',
      image:
        'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751820364/1643918673426_vvh15x.jpg',
      rating: 5,
      text: 'As a professional, I appreciate products that prioritize health. Cafe at Once coffee is sugar-free, gluten-free, and gives me the energy I need during long shifts. Highly recommended!',
      location: 'Mumbai',
    },
    {
      id: 5,
      name: 'Soham Phirke',
      role: 'Fitness Trainer',
      company: 'Elite Fitness',
      image:
        'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751820364/1749711543211_ojrbpn.jpg',
      rating: 5,
      text: 'Perfect for my pre-workout routine! No sugar means it fits perfectly into my diet plan. The convenience factor is amazing - I can prepare it anywhere, anytime.',
      location: 'Pune',
    },
    {
      id: 6,
      name: 'Prerana Dagia',
      role: 'Student',
      company: 'SDA bocconi',
      image:
        'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751820796/1723207507951_chrfcp.jpg',
      rating: 5,
      text: "The taste is exceptional! I love how it's made from 100% Arabica beans. Being gluten-free is a bonus for my dietary needs. Cafe at Once has become my daily coffee companion.",
      location: 'Hyderabad',
    },
  ];

  return (
    <div className="min-h-screen bg-cream page-container pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="relative">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              What Our Customers Say
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover why thousands of Indians have made Cafe at once their daily
              coffee choice. Real stories from real customers who love our
              healthy, convenient coffee.
            </p>
          </div>
        </section>

        {/* Featured Testimonial */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <img
                    src="https://res.cloudinary.com/dtcsms7zn/image/upload/v1751797651/WhatsApp_Image_2025-07-06_at_15.19.53_od7ony.jpg"
                    alt="Happy customers with Cafe at Once coffee"
                    className="w-64 h-64 object-cover rounded-xl shadow-2xl"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <Quote className="h-12 w-12 text-primary-light mb-4 mx-auto md:mx-0" />
                  <blockquote className="text-2xl md:text-3xl font-medium mb-6 leading-relaxed">
                    "Cafe at Once has revolutionized our coffee experience. The
                    convenience, health benefits, and amazing taste make it the
                    perfect choice for our busy lifestyle."
                  </blockquote>
                  <div className="flex items-center justify-center md:justify-start space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-6 w-6 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <cite className="text-primary-light text-lg">
                    - Satisfied Cafe at Once Customers
                  </cite>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Customer Reviews
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of satisfied customers across India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-gray-500">
                      {testimonial.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <blockquote className="text-gray-700 leading-relaxed">
                  "{testimonial.text}"
                </blockquote>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Trusted by Thousands
              </h2>
              <p className="text-lg text-gray-600">
                Our numbers speak for themselves
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  10,000+
                </div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  4.9/5
                </div>
                <div className="text-gray-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <div className="text-gray-600">Cities Served</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <div className="text-gray-600">Natural & Healthy</div>
              </div>
            </div>
          </div>
        </section>

        {/* Health Benefits Testimonials */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Health-Conscious Customers Love Us
            </h2>
            <p className="text-lg text-gray-600">
              Hear from customers who chose Cafe at Once for its health benefits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  SF
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Sugar-Free Benefits
                  </h3>
                  <p className="text-sm text-gray-600">
                    Diabetic-friendly choice
                  </p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic">
                "As a diabetic, finding sugar-free coffee that actually tastes
                good was challenging. Cafe at once is a blessing - no sugar, no
                compromise on taste!"
              </blockquote>
              <cite className="text-sm text-gray-600 mt-2 block">
                - Rajesh M., Mumbai
              </cite>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  GF
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Gluten-Free Choice
                  </h3>
                  <p className="text-sm text-gray-600">
                    Perfect for celiac diet
                  </p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic">
                "Having celiac disease limits my food choices. Cafe at Once
                being gluten-free means I can enjoy my coffee without any
                worries. Thank you!"
              </blockquote>
              <cite className="text-sm text-gray-600 mt-2 block">
                - Meera S., Delhi
              </cite>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Happy Customers</h2>
          <p className="text-xl text-primary-light mb-8 max-w-2xl mx-auto">
            Experience India's healthiest coffee and see why thousands of
            customers love Cafe at Once
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="inline-flex items-center px-8 py-4 bg-white text-primary hover:bg-cream-dark font-semibold rounded-lg transition-colors"
            >
              Try Cafe at Once Coffee
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-primary font-semibold rounded-lg transition-colors"
            >
              Contact Us
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TestimonialsPage;
