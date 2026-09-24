import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Coffee, Leaf, Award, Users, Globe, Heart } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              About @once Business
            </h1>
            <p className="text-xl text-primary-light max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing the way busy professionals enjoy premium coffee. 
              Our mission is to deliver barista-quality coffee in just 5 seconds, anywhere you are.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2020 by coffee enthusiasts and busy professionals, @once Business was born 
                  from a simple frustration: the time it takes to make quality coffee when you're always on the go.
                </p>
                <p>
                  After countless hours of research and development, we created our revolutionary concentrate 
                  system that delivers authentic coffee flavors without compromising on quality or convenience.
                </p>
                <p>
                  Today, we're proud to serve thousands of professionals who refuse to settle for mediocre 
                  coffee, even when time is their most precious resource.
                </p>
              </div>
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
              >
                Try Our Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/4226867/pexels-photo-4226867.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Coffee preparation"
                className="w-full rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <Coffee className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-bold text-gray-900">5 Seconds</div>
                    <div className="text-sm text-gray-600">Perfect Coffee</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-light rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                <Leaf className="h-8 w-8 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Purity</h3>
              <p className="text-gray-600">
                No sugar, no additives, no compromises. Just pure, premium coffee 
                made from the finest Arabica beans.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-light rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                <Award className="h-8 w-8 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality</h3>
              <p className="text-gray-600">
                Every concentrate is crafted to deliver the perfect balance of flavor, 
                aroma, and strength that coffee lovers expect.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-light rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                <Users className="h-8 w-8 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600">
                We're building a community of coffee lovers who value quality, 
                convenience, and the perfect cup every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600">The passionate people behind @once Business</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Chen',
                role: 'Founder & CEO',
                image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=300',
                bio: 'Former Starbucks executive with 15 years in the coffee industry.'
              },
              {
                name: 'Marcus Rodriguez',
                role: 'Head of Product',
                image: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=300',
                bio: 'Coffee scientist and flavor expert with a passion for innovation.'
              },
              {
                name: 'Emily Watson',
                role: 'Head of Operations',
                image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=300',
                bio: 'Supply chain expert ensuring quality from bean to cup.'
              }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 text-center group hover:shadow-md transition-shadow">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="bg-gradient-to-r from-green-50 to-green-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Globe className="h-8 w-8 text-green-600" />
                <h2 className="text-3xl font-bold text-gray-900">Sustainability Commitment</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p>
                  We believe great coffee shouldn't come at the expense of our planet. 
                  That's why we're committed to sustainable practices at every step.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Heart className="h-5 w-5 text-green-600 mr-2" />
                    Direct trade partnerships with coffee farmers
                  </li>
                  <li className="flex items-center">
                    <Heart className="h-5 w-5 text-green-600 mr-2" />
                    100% recyclable packaging materials
                  </li>
                  <li className="flex items-center">
                    <Heart className="h-5 w-5 text-green-600 mr-2" />
                    Carbon-neutral shipping options
                  </li>
                  <li className="flex items-center">
                    <Heart className="h-5 w-5 text-green-600 mr-2" />
                    Supporting reforestation projects
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/4226861/pexels-photo-4226861.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Sustainable coffee farming"
                className="w-full rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Coffee Experience?</h2>
          <p className="text-xl text-primary-light mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've already discovered the perfect balance 
            of quality and convenience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-white text-primary hover:bg-cream-dark font-semibold rounded-lg transition-colors"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/subscription"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-primary font-semibold rounded-lg transition-colors"
            >
              Start Subscription
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;