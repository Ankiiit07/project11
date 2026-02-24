import React from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, Truck, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';

const OrdersPageTechForward: React.FC = () => {
  const { orders, loading } = useOrders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'processing':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return CheckCircle;
      case 'shipped':
        return Truck;
      case 'processing':
        return Clock;
      default:
        return Package;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-foreground/40" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              No Orders Yet
            </h2>
            <p className="text-foreground/70 mb-8">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-heading font-bold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <ShoppingBag className="h-5 w-5" />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">
            My <span className="text-primary">Orders</span>
          </h1>
          <p className="text-foreground/70">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
          </p>
        </div>

        <div className="space-y-6">
          {orders.map((order: any, index: number) => {
            const StatusIcon = getStatusIcon(order.status);
            
            return (
              <motion.div
                key={order.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                {/* Order Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-heading text-lg font-bold text-foreground">
                          Order #{order.id}
                        </h3>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}>
                          <span className="flex items-center gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {order.status}
                          </span>
                        </span>
                      </div>
                      <p className="text-sm text-foreground/60">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-heading text-2xl font-bold text-foreground mb-1">
                        ₹{order.totalAmount?.toFixed(2) || '0.00'}
                      </div>
                      <p className="text-sm text-foreground/60">
                        {order.items?.length || 0} items
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {order.items?.map((item: any, itemIndex: number) => (
                      <div key={itemIndex} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image || 'https://via.placeholder.com/64'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">{item.name}</h4>
                          <p className="text-sm text-foreground/60">Qty: {item.quantity}</p>
                        </div>
                        <div className="font-medium text-foreground">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      to={`/track?orderId=${order.id}`}
                      className="flex-1 h-12 px-6 bg-primary hover:bg-primary/90 text-white font-medium rounded-full transition-all flex items-center justify-center gap-2"
                    >
                      <Truck className="h-5 w-5" />
                      Track Order
                    </Link>
                    <Link
                      to={`/orders/${order.id}`}
                      className="flex-1 h-12 px-6 bg-secondary hover:bg-secondary/80 text-foreground font-medium rounded-full border border-border transition-all flex items-center justify-center gap-2"
                    >
                      <Package className="h-5 w-5" />
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrdersPageTechForward;
