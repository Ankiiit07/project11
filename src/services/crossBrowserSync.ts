// Cross-browser synchronization service
// This service handles real-time updates across different browser tabs/windows

interface SyncEvent {
  type: 'order_created' | 'order_updated' | 'order_deleted' | 'newsletter_subscribed' | 'data_cleared';
  data: any;
  timestamp: number;
  source: string;
}

class CrossBrowserSyncService {
  private readonly SYNC_KEY = 'cafe_at_once_sync_events';
  private readonly LAST_UPDATE_KEY = 'cafe_at_once_last_update';
  private readonly MAX_EVENTS = 100; // Keep last 100 events
  private listeners: Map<string, Function[]> = new Map();
  private isInitialized = false;
  private lastProcessedTimestamp = 0;
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (this.isInitialized) return;

    // Listen for storage events from other tabs
    window.addEventListener('storage', this.handleStorageEvent.bind(this));
    
    // Listen for focus events to sync when tab becomes active
    window.addEventListener('focus', this.handleFocusEvent.bind(this));
    
    // Set up periodic sync every 2 seconds
    this.checkInterval = setInterval(() => {
      this.checkForUpdates();
    }, 2000);

    this.isInitialized = true;
    console.log('CrossBrowserSyncService initialized');
  }

  private handleStorageEvent(event: StorageEvent) {
    console.log('Storage event received:', event.key, event.newValue);
    
    if (event.key === this.SYNC_KEY || event.key === this.LAST_UPDATE_KEY) {
      console.log('Sync-related storage changed, checking for updates...');
      this.checkForUpdates();
    }
  }

  private handleFocusEvent() {
    console.log('Tab focused, checking for updates...');
    this.checkForUpdates();
  }

  private checkForUpdates() {
    const lastUpdate = this.getLastUpdateTimestamp();
    if (lastUpdate > this.lastProcessedTimestamp) {
      console.log('New updates detected, processing...');
      this.processAllEvents();
      this.lastProcessedTimestamp = lastUpdate;
    }
  }

  private processAllEvents() {
    const events = this.getSyncEvents();
    const newEvents = events.filter(event => event.timestamp > this.lastProcessedTimestamp);
    
    console.log(`Processing ${newEvents.length} new events`);
    
    newEvents.forEach(event => {
      this.processSyncEvent(event);
    });
  }

  private processSyncEvent(event: SyncEvent) {
    console.log('Processing sync event:', event.type, event.data);
    
    // Notify all listeners for this event type
    const eventListeners = this.listeners.get(event.type) || [];
    eventListeners.forEach(listener => {
      try {
        listener(event.data);
      } catch (error) {
        console.error('Error in sync event listener:', error);
      }
    });
  }

  private getSyncEvents(): SyncEvent[] {
    try {
      const events = localStorage.getItem(this.SYNC_KEY);
      return events ? JSON.parse(events) : [];
    } catch (error) {
      console.error('Error reading sync events:', error);
      return [];
    }
  }

  private setSyncEvents(events: SyncEvent[]) {
    try {
      localStorage.setItem(this.SYNC_KEY, JSON.stringify(events));
      // Update the last update timestamp
      localStorage.setItem(this.LAST_UPDATE_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error writing sync events:', error);
    }
  }

  private getLastUpdateTimestamp(): number {
    try {
      const timestamp = localStorage.getItem(this.LAST_UPDATE_KEY);
      return timestamp ? parseInt(timestamp) : 0;
    } catch (error) {
      return 0;
    }
  }

  private cleanupOldEvents() {
    const events = this.getSyncEvents();
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000); // 1 hour ago
    
    const recentEvents = events.filter(event => event.timestamp > oneHourAgo);
    
    if (recentEvents.length !== events.length) {
      this.setSyncEvents(recentEvents);
    }
  }

  // Public methods

  /**
   * Broadcast an event to all other tabs
   */
  broadcastEvent(type: SyncEvent['type'], data: any) {
    const event: SyncEvent = {
      type,
      data,
      timestamp: Date.now(),
      source: `tab_${Math.random().toString(36).substring(2, 15)}`
    };

    console.log('Broadcasting event:', event);

    const events = this.getSyncEvents();
    events.push(event);

    // Keep only the last MAX_EVENTS
    if (events.length > this.MAX_EVENTS) {
      events.splice(0, events.length - this.MAX_EVENTS);
    }

    // Store the events in localStorage to trigger storage event in other tabs
    this.setSyncEvents(events);

    // Also process the event locally
    this.processSyncEvent(event);
  }

  /**
   * Listen for specific event types
   */
  on(eventType: SyncEvent['type'], callback: Function) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);
    console.log(`Registered listener for ${eventType}`);
  }

  /**
   * Remove event listener
   */
  off(eventType: SyncEvent['type'], callback: Function) {
    const eventListeners = this.listeners.get(eventType);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  /**
   * Force sync all data
   */
  forceSync() {
    console.log('Force syncing...');
    this.checkForUpdates();
  }

  /**
   * Get sync status
   */
  getSyncStatus() {
    const events = this.getSyncEvents();
    const lastUpdate = this.getLastUpdateTimestamp();
    
    return {
      totalEvents: events.length,
      lastProcessed: new Date(this.lastProcessedTimestamp),
      lastUpdate: new Date(lastUpdate),
      pendingEvents: events.filter(event => event.timestamp > this.lastProcessedTimestamp).length,
      isInitialized: this.isInitialized
    };
  }

  /**
   * Clear all sync data
   */
  clearSyncData() {
    localStorage.removeItem(this.SYNC_KEY);
    localStorage.removeItem(this.LAST_UPDATE_KEY);
    this.lastProcessedTimestamp = 0;
    this.listeners.clear();
    console.log('Sync data cleared');
  }

  /**
   * Cleanup method
   */
  destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.listeners.clear();
    this.isInitialized = false;
  }

  /**
   * Test method - can be called from browser console
   */
  testSync() {
    console.log('🧪 Testing cross-browser sync...');
    const testData = {
      message: 'Test sync from ' + new Date().toLocaleTimeString(),
      tabId: Math.random().toString(36).substring(2, 15)
    };
    
    this.broadcastEvent('order_created', testData);
    
    console.log('✅ Test event broadcasted. Check other tabs for the event.');
    return testData;
  }
}

// Create singleton instance
export const crossBrowserSync = new CrossBrowserSyncService();

// Convenience functions for common operations
export const syncService = {
  // Order operations
  orderCreated: (orderData: any) => {
    console.log('syncService.orderCreated called with:', orderData);
    crossBrowserSync.broadcastEvent('order_created', orderData);
  },

  orderUpdated: (orderData: any) => {
    console.log('syncService.orderUpdated called with:', orderData);
    crossBrowserSync.broadcastEvent('order_updated', orderData);
  },

  orderDeleted: (orderId: string) => {
    console.log('syncService.orderDeleted called with:', orderId);
    crossBrowserSync.broadcastEvent('order_deleted', { orderId });
  },

  // Newsletter operations
  newsletterSubscribed: (email: string) => {
    console.log('syncService.newsletterSubscribed called with:', email);
    crossBrowserSync.broadcastEvent('newsletter_subscribed', { email });
  },

  // Data operations
  dataCleared: () => {
    console.log('syncService.dataCleared called');
    crossBrowserSync.broadcastEvent('data_cleared', { timestamp: Date.now() });
  },

  // Event listeners
  onOrderCreated: (callback: Function) => crossBrowserSync.on('order_created', callback),
  onOrderUpdated: (callback: Function) => crossBrowserSync.on('order_updated', callback),
  onOrderDeleted: (callback: Function) => crossBrowserSync.on('order_deleted', callback),
  onNewsletterSubscribed: (callback: Function) => crossBrowserSync.on('newsletter_subscribed', callback),
  onDataCleared: (callback: Function) => crossBrowserSync.on('data_cleared', callback),

  // Utility functions
  forceSync: () => crossBrowserSync.forceSync(),
  getStatus: () => crossBrowserSync.getSyncStatus(),
  clearData: () => crossBrowserSync.clearSyncData(),
  destroy: () => crossBrowserSync.destroy(),
  
  // Test function
  test: () => crossBrowserSync.testSync()
};

// Make test function available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).testCrossBrowserSync = () => syncService.test();
}

export default crossBrowserSync; 