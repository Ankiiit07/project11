import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, MapPin, Clock, ArrowLeft } from 'lucide-react';

const OrderTrackingPageTechForward: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orderId) {
      // Simulate fetching tracking data
      setLoading(true);
      setTimeout(() => {
        setTrackingData({
          orderId,
          status: 'shipped',
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          trackingNumber: `SHIP${orderId}`,
          timeline: [
            { status: 'Order Placed', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), completed: true },
            { status: 'Processing', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), completed: true },
            { status: 'Shipped', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), completed: true },
            { status: 'Out for Delivery', date: null, completed: false },
            { status: 'Delivered', date: null, completed: false },
          ],
        });
        setLoading(false);
      }, 1000);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!orderId || !trackingData) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Package className="h-16 w-16 text-foreground/40 mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Order Not Found
            </h2>
            <p className="text-foreground/70 mb-8">
              We couldn't find tracking information for this order.
            </p>
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Track Your <span className="text-primary">Order</span>
          </h1>
          <p className="text-foreground/70">
            Order ID: <span className="font-medium text-foreground">#{trackingData.orderId}</span>
          </p>
        </div>

        {/* Status Card */}
        <motion.div
          className="bg-card border border-border rounded-xl p-6 sm:p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Truck className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                {trackingData.status === 'shipped' ? 'On the Way' : 'Processing'}
              </h2>
              <p className="text-foreground/70 mb-3">
                Tracking Number: <span className="font-medium text-foreground">{trackingData.trackingNumber}</span>
              </p>
              <div className="flex items-center gap-2 text-sm text-foreground/60">
                <Clock className="h-4 w-4" />
                <span>Estimated Delivery: {trackingData.estimatedDelivery}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
          <h3 className="font-heading text-xl font-bold text-foreground mb-8">Order Timeline</h3>
          
          <div className="space-y-8">
            {trackingData.timeline.map((step: any, index: number) => (
              <motion.div
                key={index}
                className="relative flex gap-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                {/* Line */}
                {index < trackingData.timeline.length - 1 && (
                  <div
                    className={`absolute left-6 top-14 w-0.5 h-full -translate-x-1/2 ${
                      step.completed ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                )}

                {/* Icon */}
                <div
                  className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.completed
                      ? 'bg-primary text-white'
                      : 'bg-secondary text-foreground/40 border-2 border-border'
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-current" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <h4 className={`font-heading font-bold mb-1 ${
                    step.completed ? 'text-foreground' : 'text-foreground/50'
                  }`}>
                    {step.status}
                  </h4>
                  {step.date && (
                    <p className="text-sm text-foreground/60">
                      {step.date.toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPageTechForward;
