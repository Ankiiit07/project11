import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  RefreshCw,
  ExternalLink,
  Phone,
  Calendar,
  Navigation,
  Box,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface TrackingCheckpoint {
  date: string;
  activity: string;
  location?: string;
  status?: string;
}

interface TrackingData {
  success: boolean;
  order_id?: string;
  awb_code?: string;
  courier_name?: string;
  current_status?: string;
  current_status_description?: string;
  shipment_status?: number;
  delivered_date?: string;
  estimated_delivery?: string;
  pickup_date?: string;
  origin?: string;
  destination?: string;
  checkpoints: TrackingCheckpoint[];
  tracking_url?: string;
  message?: string;
  error?: string;
}

const statusColors: Record<string, { bg: string; text: string; icon: string }> = {
  'DELIVERED': { bg: 'bg-green-100', text: 'text-green-800', icon: 'text-green-600' },
  'OUT_FOR_DELIVERY': { bg: 'bg-blue-100', text: 'text-blue-800', icon: 'text-blue-600' },
  'IN_TRANSIT': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: 'text-yellow-600' },
  'SHIPPED': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: 'text-yellow-600' },
  'PICKED': { bg: 'bg-purple-100', text: 'text-purple-800', icon: 'text-purple-600' },
  'PENDING': { bg: 'bg-gray-100', text: 'text-gray-800', icon: 'text-gray-600' },
  'CANCELLED': { bg: 'bg-red-100', text: 'text-red-800', icon: 'text-red-600' },
  'RTO': { bg: 'bg-orange-100', text: 'text-orange-800', icon: 'text-orange-600' },
  'default': { bg: 'bg-gray-100', text: 'text-gray-800', icon: 'text-gray-600' },
};

const OrderTrackingPage: React.FC = () => {
  const [awbCode, setAwbCode] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Get backend URL - shiprocket API runs on port 8001
  const SHIPROCKET_API_URL = import.meta.env.VITE_SHIPROCKET_API_URL || 'http://localhost:8001';

  const fetchTracking = useCallback(async (code: string) => {
    if (!code.trim()) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${SHIPROCKET_API_URL}/api/shiprocket/tracking/${code.trim()}`);
      const data = await response.json();
      
      if (data.success) {
        setTrackingData(data);
        setLastUpdated(new Date());
      } else {
        setError(data.message || data.error || 'Failed to fetch tracking information');
        setTrackingData(null);
      }
    } catch (err) {
      setError('Unable to connect to tracking service. Please try again.');
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  }, [SHIPROCKET_API_URL]);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh || !awbCode) return;

    const interval = setInterval(() => {
      fetchTracking(awbCode);
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [autoRefresh, awbCode, fetchTracking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(awbCode);
  };

  const getStatusColor = (status: string) => {
    return statusColors[status] || statusColors['default'];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center text-gray-600 hover:text-primary transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <Truck className="h-6 w-6 mr-2 text-primary" />
              Track Your Order
            </h1>
            <div className="w-24" /> {/* Spacer */}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Real-Time Shipment Tracking
            </h2>
            <p className="text-gray-600">
              Enter your AWB (Air Waybill) number to track your shipment in real-time
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={awbCode}
                  onChange={(e) => setAwbCode(e.target.value)}
                  placeholder="Enter AWB Number (e.g., 14523697542)"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-lg"
                  data-testid="awb-input"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !awbCode.trim()}
                className="px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                data-testid="track-button"
              >
                {loading ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <Truck className="h-5 w-5" />
                )}
                {loading ? 'Tracking...' : 'Track Shipment'}
              </button>
            </div>

            {/* Auto-refresh toggle */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                Auto-refresh every minute
              </label>
              {lastUpdated && (
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </form>
        </motion.div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3"
            >
              <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-800">Unable to track shipment</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tracking Results */}
        <AnimatePresence>
          {trackingData && trackingData.success && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Status Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Status Header */}
                <div className={`p-6 ${getStatusColor(trackingData.current_status || '').bg}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full bg-white shadow-md ${getStatusColor(trackingData.current_status || '').icon}`}>
                        {trackingData.current_status === 'DELIVERED' ? (
                          <CheckCircle className="h-8 w-8" />
                        ) : trackingData.current_status === 'OUT_FOR_DELIVERY' ? (
                          <Truck className="h-8 w-8" />
                        ) : (
                          <Package className="h-8 w-8" />
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${getStatusColor(trackingData.current_status || '').text}`}>
                          Current Status
                        </p>
                        <h3 className={`text-2xl font-bold ${getStatusColor(trackingData.current_status || '').text}`}>
                          {trackingData.current_status_description || trackingData.current_status}
                        </h3>
                      </div>
                    </div>
                    {trackingData.tracking_url && (
                      <a
                        href={trackingData.tracking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-sm font-medium text-gray-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View on Shiprocket
                      </a>
                    )}
                  </div>
                </div>

                {/* Shipment Details */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Box className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">AWB Number</p>
                      <p className="font-semibold text-gray-900">{trackingData.awb_code}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Truck className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Courier</p>
                      <p className="font-semibold text-gray-900">{trackingData.courier_name || 'N/A'}</p>
                    </div>
                  </div>
                  
                  {trackingData.estimated_delivery && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Expected Delivery</p>
                        <p className="font-semibold text-gray-900">{trackingData.estimated_delivery}</p>
                      </div>
                    </div>
                  )}
                  
                  {trackingData.delivered_date && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-xs text-green-600">Delivered On</p>
                        <p className="font-semibold text-green-800">{trackingData.delivered_date}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Route Information */}
                {(trackingData.origin || trackingData.destination) && (
                  <div className="px-6 pb-6">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-blue-600">Origin</p>
                          <p className="font-semibold text-gray-900">{trackingData.origin || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex-1 px-4">
                        <div className="h-0.5 bg-gradient-to-r from-blue-400 to-green-400 relative">
                          <Navigation className="h-4 w-4 text-primary absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-right">
                        <div>
                          <p className="text-xs text-green-600">Destination</p>
                          <p className="font-semibold text-gray-900">{trackingData.destination || 'N/A'}</p>
                        </div>
                        <MapPin className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tracking Timeline */}
              {trackingData.checkpoints && trackingData.checkpoints.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Shipment Journey
                  </h3>
                  
                  <div className="space-y-4">
                    {trackingData.checkpoints.map((checkpoint, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4"
                      >
                        {/* Timeline indicator */}
                        <div className="flex flex-col items-center">
                          <div className={`w-4 h-4 rounded-full ${
                            index === 0 ? 'bg-primary' : 'bg-gray-300'
                          }`} />
                          {index < trackingData.checkpoints.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 my-1" />
                          )}
                        </div>
                        
                        {/* Checkpoint content */}
                        <div className={`flex-1 pb-4 ${
                          index === 0 ? 'opacity-100' : 'opacity-75'
                        }`}>
                          <div className={`p-4 rounded-lg ${
                            index === 0 ? 'bg-primary/10 border border-primary/20' : 'bg-gray-50'
                          }`}>
                            <p className={`font-medium ${
                              index === 0 ? 'text-primary' : 'text-gray-900'
                            }`}>
                              {checkpoint.activity}
                            </p>
                            {checkpoint.location && (
                              <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3" />
                                {checkpoint.location}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(checkpoint.date)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Help Section */}
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-amber-700 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-1">Need Help?</h4>
                    <p className="text-amber-800 text-sm">
                      If you have any questions about your shipment, please contact our support team at{' '}
                      <a href="mailto:support@cafeatonce.com" className="font-medium underline">
                        support@cafeatonce.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!trackingData && !loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Track Your Shipment
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Enter your AWB number above to see real-time tracking updates, 
              delivery status, and shipment journey details.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default OrderTrackingPage;
