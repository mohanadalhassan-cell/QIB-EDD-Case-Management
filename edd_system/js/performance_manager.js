/**
 * ============================================================================
 * PERFORMANCE & CACHING MODULE
 * ============================================================================
 * Improves application performance through caching and optimization
 * ============================================================================
 */

const PerformanceManager = {
  
  cache: {},
  cacheConfig: {
    maxSize: 50, // MB
    ttl: 3600000, // 1 hour in milliseconds
    strategies: {
      aggressive: 3600000, // 1 hour
      moderate: 1800000,   // 30 minutes
      minimal: 300000      // 5 minutes
    }
  },

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  initialize: function() {
    console.log('✅ Performance Manager initialized');
    this.loadCacheFromStorage();
    this.startMaintenanceRoutine();
    this.setupPerformanceMonitoring();
  },

  // ============================================================================
  // CACHING SYSTEM
  // ============================================================================

  set: function(key, value, ttl = null) {
    const cacheEntry = {
      key: key,
      data: value,
      timestamp: Date.now(),
      ttl: ttl || this.cacheConfig.ttl,
      size: this.estimateSize(value)
    };

    this.cache[key] = cacheEntry;
    this.persistCache();

    console.log(`[Cache] Set: ${key} (TTL: ${ttl ? ttl + 'ms' : 'default'})`);

    return value;
  },

  get: function(key) {
    const cacheEntry = this.cache[key];

    if (!cacheEntry) {
      console.log(`[Cache] Miss: ${key}`);
      return null;
    }

    // Check TTL
    const age = Date.now() - cacheEntry.timestamp;
    if (age > cacheEntry.ttl) {
      console.log(`[Cache] Expired: ${key}`);
      delete this.cache[key];
      return null;
    }

    console.log(`[Cache] Hit: ${key}`);
    return cacheEntry.data;
  },

  has: function(key) {
    const cacheEntry = this.cache[key];
    if (!cacheEntry) return false;

    const age = Date.now() - cacheEntry.timestamp;
    return age <= cacheEntry.ttl;
  },

  remove: function(key) {
    delete this.cache[key];
    this.persistCache();
    console.log(`[Cache] Removed: ${key}`);
  },

  clear: function() {
    this.cache = {};
    localStorage.removeItem('edd_system_cache');
    console.log('[Cache] Cleared all');
  },

  estimateSize: function(obj) {
    try {
      return new Blob([JSON.stringify(obj)]).size;
    } catch {
      return 0;
    }
  },

  persistCache: function() {
    try {
      const cacheData = JSON.stringify(this.cache);
      localStorage.setItem('edd_system_cache', cacheData);
    } catch (e) {
      console.warn('Failed to persist cache:', e);
    }
  },

  loadCacheFromStorage: function() {
    try {
      const cacheData = localStorage.getItem('edd_system_cache');
      if (cacheData) {
        this.cache = JSON.parse(cacheData);
        console.log(`[Cache] Loaded ${Object.keys(this.cache).length} entries from storage`);
      }
    } catch (e) {
      console.warn('Failed to load cache from storage:', e);
    }
  },

  // ============================================================================
  // DATA OPTIMIZATION
  // ============================================================================

  compressData: function(data) {
    // Simple compression by removing null/undefined values
    if (Array.isArray(data)) {
      return data.map(item => this.compressData(item));
    }

    if (typeof data === 'object' && data !== null) {
      const compressed = {};
      for (const [key, value] of Object.entries(data)) {
        if (value !== null && value !== undefined && value !== '') {
          compressed[key] = this.compressData(value);
        }
      }
      return compressed;
    }

    return data;
  },

  decompressData: function(data) {
    // Placeholder for decompression
    return data;
  },

  // ============================================================================
  // PERFORMANCE MONITORING
  // ============================================================================

  setupPerformanceMonitoring: function() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 1000) {
            console.warn(`[Performance] Slow operation: ${entry.name} (${entry.duration.toFixed(2)}ms)`);
          }
        }
      });

      observer.observe({ entryTypes: ['measure', 'navigation'] });
    }
  },

  measureOperation: function(operationName, callback) {
    const startTime = performance.now();
    
    try {
      const result = callback();
      const duration = performance.now() - startTime;
      
      console.log(`[Performance] ${operationName}: ${duration.toFixed(2)}ms`);
      
      if (duration > 1000) {
        console.warn(`[Performance Warning] ${operationName} took ${duration.toFixed(2)}ms`);
      }

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`[Performance] ${operationName} failed after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  },

  // ============================================================================
  // LAZY LOADING
  // ============================================================================

  setupLazyLoading: function() {
    if ('IntersectionObserver' in window) {
      const options = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadElement(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, options);

      document.querySelectorAll('[data-lazy]').forEach(el => {
        observer.observe(el);
      });
    }
  },

  loadElement: function(element) {
    const src = element.dataset.src;
    if (src) {
      element.src = src;
      element.removeAttribute('data-lazy');
    }
  },

  // ============================================================================
  // BATCH OPERATIONS
  // ============================================================================

  batchProcess: function(items, callback, batchSize = 10) {
    return new Promise((resolve) => {
      let currentIndex = 0;
      const results = [];

      const processBatch = () => {
        const batch = items.slice(currentIndex, currentIndex + batchSize);
        batch.forEach(item => {
          results.push(callback(item));
        });
        currentIndex += batchSize;

        if (currentIndex < items.length) {
          // Use requestIdleCallback if available, otherwise setTimeout
          if ('requestIdleCallback' in window) {
            requestIdleCallback(() => processBatch());
          } else {
            setTimeout(processBatch, 0);
          }
        } else {
          resolve(results);
        }
      };

      processBatch();
    });
  },

  // ============================================================================
  // MAINTENANCE ROUTINE
  // ============================================================================

  startMaintenanceRoutine: function() {
    // Run cleanup every 5 minutes
    setInterval(() => {
      this.cleanupExpiredCache();
      this.optimizeMemory();
    }, 300000);
  },

  cleanupExpiredCache: function() {
    let cleaned = 0;
    const now = Date.now();

    for (const key in this.cache) {
      const entry = this.cache[key];
      if (now - entry.timestamp > entry.ttl) {
        delete this.cache[key];
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.persistCache();
      console.log(`[Cache Maintenance] Cleaned ${cleaned} expired entries`);
    }
  },

  optimizeMemory: function() {
    const cacheSize = Object.values(this.cache).reduce((sum, entry) => sum + entry.size, 0);
    const maxSizeBytes = this.cacheConfig.maxSize * 1024 * 1024;

    if (cacheSize > maxSizeBytes) {
      console.log(`[Memory] Cache size (${(cacheSize / 1024 / 1024).toFixed(2)}MB) exceeds limit`);
      this.evictLRU();
    }
  },

  evictLRU: function() {
    // Evict Least Recently Used items
    const entries = Object.entries(this.cache)
      .sort((a, b) => a[1].timestamp - b[1].timestamp);

    for (let i = 0; i < Math.ceil(entries.length * 0.2); i++) {
      delete this.cache[entries[i][0]];
    }

    this.persistCache();
    console.log('[Memory] Evicted oldest 20% of cache');
  },

  // ============================================================================
  // STATISTICS
  // ============================================================================

  getStats: function() {
    const entries = Object.values(this.cache);
    const totalSize = entries.reduce((sum, entry) => sum + entry.size, 0);

    return {
      totalEntries: entries.length,
      totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
      averageAgeMins: entries.length > 0 
        ? ((entries.reduce((sum, e) => sum + (Date.now() - e.timestamp), 0) / entries.length) / 60000).toFixed(2)
        : 0,
      oldestEntry: entries.length > 0 ? new Date(Math.min(...entries.map(e => e.timestamp))).toLocaleString() : 'N/A',
      newestEntry: entries.length > 0 ? new Date(Math.max(...entries.map(e => e.timestamp))).toLocaleString() : 'N/A'
    };
  },

  logStats: function() {
    const stats = this.getStats();
    console.log('[Cache Statistics]', stats);
    return stats;
  }

};

// Initialize on document ready
document.addEventListener('DOMContentLoaded', () => {
  PerformanceManager.initialize();
});
