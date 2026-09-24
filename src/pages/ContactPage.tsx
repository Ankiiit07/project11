import React, { useState } from 'react';
import { useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HelpCircle } from 'lucide-react';
// import WhatsAppButton from '../components/WhatsAppButton';
// import { whatsappService } from '../services/whatsappService';
import { supabaseService } from '../services/supabaseService';
import DeliveryOptions from '../components/DeliveryOptions';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general',
    phone: '',
    address: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showDeliveryOptions, setShowDeliveryOptions] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isSubmitted) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isSubmitted]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === 'address' && e.target.value.length > 10) {
      setShowDeliveryOptions(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await supabaseService.sendContactMessage(formData);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-cream page-container">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Message Sent!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for contacting us! We'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  name: '',
                  email: '',
                  subject: '',
                  message: '',
                  category: 'general',
                  phone: '',
                  address: ''
                });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream page-container pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-primary/20 to-primary-dark/20 rounded-full blur-3xl animate-pulse"></div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 relative z-10 animate-fade-in">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed relative z-10 animate-slide-up">
            Have questions about our products or need support? We're here to help you 
            get the perfect coffee experience.
          </p>
          <div className="absolute -bottom-4 right-1/4 w-16 h-16 bg-gradient-to-r from-amber-400/30 to-orange-500/30 rounded-full blur-2xl animate-bounce"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-dark/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 relative z-10">Contact Information</h2>
              <div className="space-y-6 relative z-10">
                <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300 group/item">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover/item:bg-primary group-hover/item:scale-110 transition-all duration-300">
                    <Mail className="h-6 w-6 text-primary group-hover/item:text-white transition-colors duration-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">cafeatonce@gmail.com</p>
                    <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300 group/item">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover/item:bg-primary group-hover/item:scale-110 transition-all duration-300">
                    <Phone className="h-6 w-6 text-primary group-hover/item:text-white transition-colors duration-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600">+917979837079</p>
                    <p className="text-sm text-gray-500">Mon-Fri, 9AM-6PM IST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300 group/item">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover/item:bg-primary group-hover/item:scale-110 transition-all duration-300">
                    <MapPin className="h-6 w-6 text-primary group-hover/item:text-white transition-colors duration-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Address</h3>
                    <p className="text-gray-600">
                      Powai<br />
                      Mumbai, MH 400076
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300 group/item">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover/item:bg-primary group-hover/item:scale-110 transition-all duration-300">
                    <Clock className="h-6 w-6 text-primary group-hover/item:text-white transition-colors duration-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Help</h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-center gap-2"><HelpCircle className="w-4 h-4" /> Shipping & Delivery</li>
                <li className="flex items-center gap-2"><HelpCircle className="w-4 h-4" /> Returns & Refunds</li>
                <li className="flex items-center gap-2"><HelpCircle className="w-4 h-4" /> Payment Methods</li>
                <li className="flex items-center gap-2"><HelpCircle className="w-4 h-4" /> Product Information</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8">
              {/* form fields... (unchanged) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" placeholder="Your name" required />
                </div>
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" placeholder="you@example.com" required />
                </div>
                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                  <input id="subject" name="subject" type="text" value={formData.subject} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" placeholder="How can we help?" required />
                </div>
                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                  <select id="category" name="category" value={formData.category} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Related</option>
                    <option value="product">Product Information</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                  <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" placeholder="Your phone number" />
                </div>
                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <input id="address" name="address" type="text" value={formData.address} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" placeholder="Street, City, State, ZIP" />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea id="message" name="message" rows={6} value={formData.message} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" placeholder="Your message" required />
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                {showDeliveryOptions && <DeliveryOptions address={formData.address} />}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;