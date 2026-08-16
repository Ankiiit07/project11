import React, { useState, useEffect, useCallback } from 'react';
import { emailNotificationService } from '../services/emailNotificationService';
import { apiService } from '../services/apiService';
import { orderService } from '../services/orderService';
import { syncService } from '../services/crossBrowserSync';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'newsletter' | 'orders'>('newsletter');
  const [newsletterSubscriptions, setNewsletterSubscriptions] = useState<any[]>([]);
  const [orderNotifications, setOrderNotifications] = useState<any[]>([]);
  const [backendOrders, setBackendOrders] = useState<any[]>([]);
  const [localOrders, setLocalOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<any>(null);

  // Load data on mount and set up periodic refresh
  useEffect(() => {
    console.log('AdminPanel: Initializing...');
    loadData();
    
    // Set up periodic refresh every 10 seconds (more frequent for testing)
    const interval = setInterval(() => {
      console.log('AdminPanel: Periodic refresh triggered');
      loadData();
    }, 10000);

    // Set up storage event listener for cross-browser sync
    const handleStorageChange = (e: StorageEvent) => {
      console.log('AdminPanel: Storage event received:', e.key, e.newValue);
      if (e.key === 'cafe_at_once_orders' || e.key === 'orderNotifications' || e.key === 'newsletterSubscriptions' || e.key === 'cafe_at_once_sync_events') {
        console.log('AdminPanel: Relevant storage changed, refreshing data...');
        loadData();
      }
    };

    // Set up custom event listener for order changes
    const handleOrdersChanged = () => {
      console.log('AdminPanel: Orders changed event received');
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('ordersChanged', handleOrdersChanged);

    // Set up focus event listener to refresh when tab becomes active
    const handleFocus = () => {
      console.log('AdminPanel: Tab focused, refreshing data...');
      loadData();
    };

    window.addEventListener('focus', handleFocus);

    // Set up sync service listeners
    const handleOrderCreated = (data: any) => {
      console.log('AdminPanel: Order created event received:', data);
      loadData();
    };

    const handleOrderUpdated = (data: any) => {
      console.log('AdminPanel: Order updated event received:', data);
      loadData();
    };

    const handleOrderDeleted = (data: any) => {
      console.log('AdminPanel: Order deleted event received:', data);
      loadData();
    };

    const handleDataCleared = () => {
      console.log('AdminPanel: Data cleared event received');
      loadData();
    };

    syncService.onOrderCreated(handleOrderCreated);
    syncService.onOrderUpdated(handleOrderUpdated);
    syncService.onOrderDeleted(handleOrderDeleted);
    syncService.onDataCleared(handleDataCleared);

    return () => {
      console.log('AdminPanel: Cleaning up...');
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ordersChanged', handleOrdersChanged);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const loadData = useCallback(async () => {
    console.log('AdminPanel: Loading data...');
    setLoading(true);
    setError(null);
    
    try {
      // Load local data
      const newsletterData = emailNotificationService.getNewsletterSubscriptions();
      const orderNotificationData = emailNotificationService.getOrderNotifications();
      const localOrderData = orderService.getOrders();
      
      console.log('AdminPanel: Data loaded:', {
        newsletterCount: newsletterData.length,
        notificationCount: orderNotificationData.length,
        localOrderCount: localOrderData.length
      });
      
      setNewsletterSubscriptions(newsletterData);
      setOrderNotifications(orderNotificationData);
      setLocalOrders(localOrderData);
      
      // Load backend orders
      await loadBackendOrders();
      
      // Get sync status
      const status = syncService.getStatus();
      setSyncStatus(status);
      setLastSync(new Date());
      
      console.log('AdminPanel: Data loading completed, sync status:', status);
    } catch (err) {
      console.error('AdminPanel: Error loading data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadBackendOrders = async () => {
    try {
      // Check if we're in development mode or if backend is available
      const isDevelopment = import.meta.env.DEV;
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
      
      // Only try to connect to backend if we're in development or if backend URL is configured
      if (isDevelopment || backendUrl !== 'http://localhost:5001/api/v1') {
        console.log('AdminPanel: Attempting to connect to backend at:', backendUrl);
        
        // Try to fetch orders from backend with a timeout using Promise.race
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 5000);
        });
        
        try {
          const responsePromise = apiService.get('/admin/orders');
          const response = await Promise.race([responsePromise, timeoutPromise]) as any;
          
          if (response?.data?.data?.orders) {
            setBackendOrders(response.data.data.orders);
            console.log('AdminPanel: Backend orders loaded:', response.data.data.orders.length);
          } else {
            setBackendOrders([]);
            console.log('AdminPanel: No backend orders available');
          }
        } catch (fetchError) {
          console.log('AdminPanel: Backend fetch failed:', fetchError);
          throw fetchError;
        }
      } else {
        console.log('AdminPanel: Backend not configured, using local data only');
        setBackendOrders([]);
      }
    } catch (err) {
      console.log('AdminPanel: Backend orders not available, using local data only');
      console.log('AdminPanel: Backend error details:', err);
      setBackendOrders([]);
      
      // Only show error if it's not a connection refused error (which is expected when backend is not running)
      if (err instanceof Error && !err.message.includes('ERR_CONNECTION_REFUSED') && !err.message.includes('Request timeout')) {
        console.warn('AdminPanel: Unexpected backend error:', err);
      }
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      console.log('AdminPanel: Clearing all data...');
      localStorage.removeItem('newsletterSubscriptions');
      localStorage.removeItem('orderNotifications');
      localStorage.removeItem('cafe_at_once_orders');
      setBackendOrders([]);
      setLocalOrders([]);
      setOrderNotifications([]);
      setNewsletterSubscriptions([]);
      
      // Clear sync data
      syncService.clearData();
      
      // Trigger storage event for other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'cafe_at_once_orders',
        newValue: null,
        oldValue: 'data'
      }));
      
      loadData();
    }
  };

  const exportData = () => {
    const data = {
      newsletterSubscriptions,
      orderNotifications,
      backendOrders,
      localOrders,
      syncStatus,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cafe-at-once-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      console.log('AdminPanel: Updating order status:', orderId, status);
      
      // Update local order
      const updatedOrder = orderService.updateOrderStatus(orderId, status as any);
      if (updatedOrder) {
        setLocalOrders(orderService.getOrders());
        console.log('AdminPanel: Local order updated successfully');
      }

      // Try to update backend order
      try {
        await apiService.patch(`/admin/orders/${orderId}`, { order_status: status });
        await loadBackendOrders();
        console.log('AdminPanel: Backend order updated successfully');
      } catch (err) {
        console.log('AdminPanel: Backend update failed, but local update succeeded');
      }
    } catch (err) {
      console.error('AdminPanel: Failed to update order status:', err);
      setError('Failed to update order status');
    }
  };

  const syncOrdersAcrossBrowsers = () => {
    console.log('AdminPanel: Manual sync triggered');
    // Force sync and refresh data
    syncService.forceSync();
    loadData();
  };

  // Combine all orders with proper deduplication
  const getAllOrders = () => {
    const allOrders = [...localOrders, ...orderNotifications, ...backendOrders];
    
    // Remove duplicates based on order ID
    const uniqueOrders = allOrders.filter((order, index, self) => 
      index === self.findIndex(o => 
        (o.id && o.id === order.id) || 
        (o.orderNumber && o.orderNumber === order.orderNumber)
      )
    );
    
    // Sort by creation date (newest first)
    return uniqueOrders.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.notifiedAt || 0);
      const dateB = new Date(b.createdAt || b.notifiedAt || 0);
      return dateB.getTime() - dateA.getTime();
    });
  };

  const allOrders = getAllOrders();

  console.log('AdminPanel: Rendering with', allOrders.length, 'orders');

  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cafe at Once Admin Panel</h1>
              {lastSync && (
                <p className="text-sm text-gray-500 mt-1">
                  Last synced: {lastSync.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  console.log('Testing cross-browser sync...');
                  syncService.test();
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                title="Test cross-browser sync"
              >
                🧪 Test Sync
              </button>
              <button
                onClick={syncOrdersAcrossBrowsers}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                title="Sync orders across browsers"
              >
                🔄 Sync
              </button>
              <button
                onClick={exportData}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Export Data
              </button>
              <button
                onClick={clearAllData}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Data Sources Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Data Sources</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Local Orders:</span> {localOrders.length}
              </div>
              <div>
                <span className="font-medium">Order Notifications:</span> {orderNotifications.length}
              </div>
              <div>
                <span className="font-medium">Backend Orders:</span> {backendOrders.length}
              </div>
            </div>
            {syncStatus && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Sync Events:</span> {syncStatus.totalEvents}
                  </div>
                  <div>
                    <span className="font-medium">Pending Events:</span> {syncStatus.pendingEvents}
                  </div>
                  <div>
                    <span className="font-medium">Last Processed:</span> {syncStatus.lastProcessed.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            )}
            <p className="text-blue-700 text-sm mt-2">
              💡 Orders are automatically synced across browser tabs. Use the Sync button to manually refresh.
            </p>
            {backendOrders.length === 0 && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
                ℹ️ <strong>Offline Mode:</strong> Backend server is not available. Admin panel is working with local data only. 
                Orders placed in other browsers will still be synced via cross-browser synchronization.
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('newsletter')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'newsletter'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Newsletter Subscriptions ({newsletterSubscriptions.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Orders ({allOrders.length})
            </button>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-gray-600">Loading data...</p>
            </div>
          )}

          {/* Newsletter Subscriptions */}
          {activeTab === 'newsletter' && !loading && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Newsletter Subscriptions</h2>
              {newsletterSubscriptions.length === 0 ? (
                <p className="text-gray-500">No newsletter subscriptions yet.</p>
              ) : (
                <div className="space-y-4">
                  {newsletterSubscriptions.map((subscription) => (
                    <div
                      key={subscription.id}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{subscription.email}</p>
                          <p className="text-sm text-gray-500">
                            Subscribed: {new Date(subscription.subscribedAt).toLocaleString()}
                          </p>
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Active
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && !loading && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Orders</h2>
              {allOrders.length === 0 ? (
                <p className="text-gray-500">No orders yet.</p>
              ) : (
                <div className="space-y-6">
                  {allOrders.map((order) => (
                    <div
                      key={order.id || order.orderNumber}
                      className="bg-gray-50 p-6 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.orderNumber || order.id}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {order.createdAt ? 
                              `Created: ${new Date(order.createdAt).toLocaleString()}` :
                              `Notified: ${new Date(order.notifiedAt).toLocaleString()}`
                            }
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Source: {order.createdAt ? 'Local Storage' : order.id ? 'Backend' : 'Notification'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {order.status && (
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="bg-white border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          )}
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            order.paymentInfo?.status === 'completed' || order.payment_status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.paymentInfo?.status || order.payment_status || 'New Order'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Customer Details</h4>
                          <p className="text-sm text-gray-600">
                            Name: {order.customerInfo?.firstName || order.customerName || order.customer_info?.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Email: {order.customerInfo?.email || order.customerEmail || order.customer_info?.email}
                          </p>
                          <p className="text-sm text-gray-600">
                            Phone: {order.customerInfo?.phone || order.customerPhone || order.customer_info?.phone}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Order Details</h4>
                          <p className="text-sm text-gray-600">
                            Payment: {order.paymentInfo?.method === 'cod' || order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Total: ₹{(order.total || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                        <div className="bg-white p-3 rounded border">
                          {(order.items || []).map((item: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.name} x {item.quantity}</span>
                              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                        <div className="bg-white p-3 rounded border text-sm text-gray-600">
                          {order.customerInfo?.address || order.shippingAddress?.street || order.shipping_address?.street}<br />
                          {order.customerInfo?.city || order.shippingAddress?.city || order.shipping_address?.city}, {order.customerInfo?.state || order.shippingAddress?.state || order.shipping_address?.state} {order.customerInfo?.zipCode || order.shippingAddress?.zipCode || order.shipping_address?.zip_code}<br />
                          {order.customerInfo?.country || order.shippingAddress?.country || order.shipping_address?.country}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 