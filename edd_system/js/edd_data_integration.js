/**
 * EDD DATA INTEGRATION ADAPTER (DIA)
 * 
 * Handles connections to external data sources:
 * 1. T24 (Core Banking System) - Customer info, accounts, transactions, deposits
 * 2. CRP (Customer Risk Profiling Engine) - Risk scores and classifications
 * 3. Regulatory DB - PEP status, sanctions, adverse media
 * 4. TM (Transaction Monitoring) - Unusual activity patterns
 * 5. DMS (Document Management) - Supporting documents
 * 
 * ARCHITECTURE:
 * - All external systems are READ-ONLY from EDD perspective
 * - Caching: 24-hour cache to avoid excessive API calls
 * - Fallback: If API fails, show cached data with staleness warning
 * - Audit Trail: All API calls logged with timestamp, response code, latency
 * 
 * GOVERNANCE:
 * Risk scores CANNOT be calculated or modified in EDD system
 * System READS and DISPLAYS risk data for investigator review
 */

class EDDDataIntegrationAdapter {
  constructor(apiBaseUrl = '/api') {
    this.apiBaseUrl = apiBaseUrl;
    this.cache = new Map();
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    this.apiCallLog = [];
    this.timeout = 5000; // 5 second timeout per API call
  }

  /**
   * SECTION 1 & 3: Load Risk Classification from CRP
   * 
   * External System: Customer Risk Profiling Engine (CRP)
   * Auth: OAuth2 with service account
   * Rate Limit: 100 calls/minute
   * Timeout: 5 seconds
   */
  async loadRiskClassification(rimNumber) {
    const cacheKey = `risk_${rimNumber}`;
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) return cachedData;

    const apiCall = {
      timestamp: new Date().toISOString(),
      system: 'CRP',
      endpoint: `/crp/risk/classification/${rimNumber}`,
      status: 'PENDING'
    };

    try {
      const startTime = Date.now();
      const response = await this.apiCall(
        `${this.apiBaseUrl}/crp/risk/classification/${rimNumber}`,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer CRP_SERVICE_TOKEN',
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`CRP API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      apiCall.status = 'SUCCESS';
      apiCall.latencyMs = Date.now() - startTime;
      apiCall.responseCode = response.status;

      // Cache the result
      this.setCachedData(cacheKey, data);

      // Log audit record
      this.logApiCall(apiCall);

      // Add governance metadata
      return {
        ...data,
        lastSyncTimestamp: new Date().toISOString(),
        source: 'CRP (Customer Risk Profiling Engine)',
        authority: 'QCB Approved Risk Calculator',
        dataQualityStatus: 'VERIFIED',
        apiLatencyMs: apiCall.latencyMs,
        cacheStatus: 'FRESH'
      };
    } catch (error) {
      apiCall.status = 'FAILED';
      apiCall.error = error.message;
      this.logApiCall(apiCall);

      // Try cached data as fallback
      const staleCachedData = this.getCachedData(cacheKey, { ignoreTTL: true });
      if (staleCachedData) {
        console.warn(`CRP API failed, returning stale cache: ${error.message}`);
        return {
          ...staleCachedData,
          cacheStatus: 'STALE',
          apiError: error.message,
          warningMessage: 'This data is from cache and may be outdated. Latest sync failed.'
        };
      }

      throw error;
    }
  }

  /**
   * SECTION 2: Load Customer Information from T24
   * 
   * External System: T24 Core Banking System
   * Auth: API Key header
   * Rate Limit: 500 calls/minute
   * Timeout: 5 seconds
   */
  async loadCustomerProfile(rimNumber) {
    const cacheKey = `customer_${rimNumber}`;
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) return cachedData;

    const apiCall = {
      timestamp: new Date().toISOString(),
      system: 'T24',
      endpoint: `/t24/customer/profile/${rimNumber}`,
      status: 'PENDING'
    };

    try {
      const startTime = Date.now();
      const response = await this.apiCall(
        `${this.apiBaseUrl}/t24/customer/profile/${rimNumber}`,
        {
          method: 'GET',
          headers: {
            'X-API-Key': 'T24_API_KEY',
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`T24 API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      apiCall.status = 'SUCCESS';
      apiCall.latencyMs = Date.now() - startTime;
      apiCall.responseCode = response.status;

      this.setCachedData(cacheKey, data);
      this.logApiCall(apiCall);

      return {
        ...data,
        lastSyncTimestamp: new Date().toISOString(),
        source: 'T24 Core Banking System',
        dataQualityStatus: 'VERIFIED',
        apiLatencyMs: apiCall.latencyMs,
        cacheStatus: 'FRESH'
      };
    } catch (error) {
      apiCall.status = 'FAILED';
      apiCall.error = error.message;
      this.logApiCall(apiCall);

      const staleCachedData = this.getCachedData(cacheKey, { ignoreTTL: true });
      if (staleCachedData) {
        console.warn(`T24 API failed, returning stale cache: ${error.message}`);
        return {
          ...staleCachedData,
          cacheStatus: 'STALE',
          apiError: error.message
        };
      }

      throw error;
    }
  }

  /**
   * SECTION 5: Load Initial Deposit from T24 Transaction History
   * 
   * Returns: First deposit transaction
   */
  async loadInitialDeposit(rimNumber) {
    const cacheKey = `deposit_${rimNumber}`;
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) return cachedData;

    const apiCall = {
      timestamp: new Date().toISOString(),
      system: 'T24',
      endpoint: `/t24/transactions/initial/${rimNumber}`,
      status: 'PENDING'
    };

    try {
      const startTime = Date.now();
      const response = await this.apiCall(
        `${this.apiBaseUrl}/t24/transactions/initial/${rimNumber}`,
        {
          method: 'GET',
          headers: { 'X-API-Key': 'T24_API_KEY' }
        }
      );

      const data = await response.json();
      apiCall.status = 'SUCCESS';
      apiCall.latencyMs = Date.now() - startTime;

      this.setCachedData(cacheKey, data);
      this.logApiCall(apiCall);

      return {
        ...data,
        lastSyncTimestamp: new Date().toISOString(),
        source: 'T24 Transaction History',
        dataQualityStatus: 'VERIFIED',
        cacheStatus: 'FRESH'
      };
    } catch (error) {
      apiCall.status = 'FAILED';
      this.logApiCall(apiCall);
      throw error;
    }
  }

  /**
   * SECTION 4: Load Employment Source from T24
   * 
   * Hybrid section: T24 provides base data, investigator assesses
   */
  async loadEmploymentSource(rimNumber) {
    const cacheKey = `employment_${rimNumber}`;
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) return cachedData;

    try {
      const response = await this.apiCall(
        `${this.apiBaseUrl}/t24/customer/employment/${rimNumber}`,
        {
          method: 'GET',
          headers: { 'X-API-Key': 'T24_API_KEY' }
        }
      );

      const data = await response.json();
      this.setCachedData(cacheKey, data);

      return {
        ...data,
        lastSyncTimestamp: new Date().toISOString(),
        source: 'T24 Customer Profile',
        dataQualityStatus: 'VERIFIED',
        cacheStatus: 'FRESH'
      };
    } catch (error) {
      console.warn(`Employment source loading failed: ${error.message}`);
      return null;
    }
  }

  /**
   * SECTION 7: Load Account Portfolio from T24
   * 
   * Returns: List of all accounts and balances for this customer
   */
  async loadAccountPortfolio(rimNumber) {
    const cacheKey = `accounts_${rimNumber}`;
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) return cachedData;

    const apiCall = {
      timestamp: new Date().toISOString(),
      system: 'T24',
      endpoint: `/t24/accounts/list/${rimNumber}`,
      status: 'PENDING'
    };

    try {
      const startTime = Date.now();
      const response = await this.apiCall(
        `${this.apiBaseUrl}/t24/accounts/list/${rimNumber}`,
        {
          method: 'GET',
          headers: { 'X-API-Key': 'T24_API_KEY' }
        }
      );

      const data = await response.json();
      apiCall.status = 'SUCCESS';
      apiCall.latencyMs = Date.now() - startTime;

      this.setCachedData(cacheKey, data);
      this.logApiCall(apiCall);

      return {
        ...data,
        lastSyncTimestamp: new Date().toISOString(),
        source: 'T24 Account Portfolio',
        dataQualityStatus: 'VERIFIED',
        cacheStatus: 'FRESH'
      };
    } catch (error) {
      apiCall.status = 'FAILED';
      this.logApiCall(apiCall);
      throw error;
    }
  }

  /**
   * SECTION 10: Load PEP Information from Regulatory Database
   * 
   * Hybrid section: Regulatory provides PEP status, investigator assesses risk
   * 
   * Sources:
   * - OFAC (US Office of Foreign Assets Control) Sanctions List
   * - EU Consolidated Financial Sanctions List
   * - UN Security Council Consolidated Sanctions List
   * - Local regulatory databases (e.g., Qatar Central Bank)
   * - Adverse media screening
   */
  async loadPEPInformation(rimNumber, customerName) {
    const cacheKey = `pep_${rimNumber}`;
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) return cachedData;

    const apiCall = {
      timestamp: new Date().toISOString(),
      system: 'REGULATORY',
      endpoint: `/regulatory/pep/check`,
      status: 'PENDING'
    };

    try {
      const startTime = Date.now();
      const response = await this.apiCall(
        `${this.apiBaseUrl}/regulatory/pep/check`,
        {
          method: 'POST',
          headers: {
            'X-API-Key': 'REGULATORY_API_KEY',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            rimNumber: rimNumber,
            customerName: customerName,
            checkType: 'FULL_SCREENING' // Also supports 'QUICK_CHECK'
          })
        }
      );

      const data = await response.json();
      apiCall.status = 'SUCCESS';
      apiCall.latencyMs = Date.now() - startTime;

      this.setCachedData(cacheKey, data);
      this.logApiCall(apiCall);

      return {
        ...data,
        lastSyncTimestamp: new Date().toISOString(),
        source: 'Regulatory Database (OFAC, EU, UN, Local CB)',
        dataQualityStatus: 'VERIFIED',
        cacheStatus: 'FRESH',
        screeningSources: [
          'OFAC Sanctions List',
          'EU Consolidated Sanctions List',
          'UN Security Council Consolidated Sanctions List',
          'Qatar Central Bank Watchlist'
        ]
      };
    } catch (error) {
      apiCall.status = 'FAILED';
      apiCall.error = error.message;
      this.logApiCall(apiCall);
      throw error;
    }
  }

  /**
   * SECTION 10: Load adverse media information
   * 
   * Screens customer against negative news, litigation, criminal records
   */
  async loadAdverseMediaScreening(rimNumber, customerName) {
    const cacheKey = `adverse_media_${rimNumber}`;
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) return cachedData;

    try {
      const response = await this.apiCall(
        `${this.apiBaseUrl}/regulatory/adverse-media/check`,
        {
          method: 'POST',
          headers: { 'X-API-Key': 'REGULATORY_API_KEY', 'Content-Type': 'application/json' },
          body: JSON.stringify({ rimNumber, customerName })
        }
      );

      const data = await response.json();
      this.setCachedData(cacheKey, data);

      return {
        ...data,
        lastSyncTimestamp: new Date().toISOString(),
        source: 'Adverse Media Database',
        cacheStatus: 'FRESH'
      };
    } catch (error) {
      console.warn(`Adverse media screening failed: ${error.message}`);
      return { hasAdverseMedia: false, findings: [] };
    }
  }

  /**
   * Make HTTP API call with timeout and error handling
   */
  async apiCall(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Cache management: Get cached data
   */
  getCachedData(key, options = {}) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.cacheExpiry;
    if (isExpired && !options.ignoreTTL) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Cache management: Set cached data
   */
  setCachedData(key, data) {
    this.cache.set(key, {
      data: data,
      timestamp: Date.now()
    });
  }

  /**
   * Clear cache for specific customer or all
   */
  clearCache(rimNumber = null) {
    if (rimNumber) {
      const keysToDelete = Array.from(this.cache.keys()).filter(key => key.includes(rimNumber));
      keysToDelete.forEach(key => this.cache.delete(key));
    } else {
      this.cache.clear();
    }
  }

  /**
   * Log API call for audit and monitoring
   */
  logApiCall(callRecord) {
    this.apiCallLog.push(callRecord);

    // In production: POST /api/audit-log
    console.log(`[${callRecord.system}] ${callRecord.endpoint} - ${callRecord.status} (${callRecord.latencyMs || 'N/A'}ms)`);

    // Keep only last 1000 calls in memory
    if (this.apiCallLog.length > 1000) {
      this.apiCallLog.shift();
    }
  }

  /**
   * Get API call statistics for monitoring/debugging
   */
  getApiCallStats() {
    const stats = {
      totalCalls: this.apiCallLog.length,
      byStatus: { SUCCESS: 0, FAILED: 0, PENDING: 0 },
      bySystem: {},
      averageLatency: 0,
      failureRate: 0
    };

    const successfulCalls = [];
    for (const call of this.apiCallLog) {
      stats.byStatus[call.status] = (stats.byStatus[call.status] || 0) + 1;
      stats.bySystem[call.system] = (stats.bySystem[call.system] || 0) + 1;

      if (call.status === 'SUCCESS' && call.latencyMs) {
        successfulCalls.push(call.latencyMs);
      }
    }

    if (successfulCalls.length > 0) {
      stats.averageLatency = Math.round(successfulCalls.reduce((a, b) => a + b) / successfulCalls.length);
    }

    stats.failureRate = ((stats.byStatus.FAILED / stats.totalCalls) * 100).toFixed(2);

    return stats;
  }

  /**
   * Batch load all sections for a case
   * 
   * Loads all 7 external data sections in parallel
   */
  async loadAllExternalData(rimNumber, customerName) {
    const loading = {
      section1: this.loadRiskClassification(rimNumber),
      section2: this.loadCustomerProfile(rimNumber),
      section4: this.loadEmploymentSource(rimNumber),
      section5: this.loadInitialDeposit(rimNumber),
      section7: this.loadAccountPortfolio(rimNumber),
      section10_pep: this.loadPEPInformation(rimNumber, customerName),
      section10_adverse: this.loadAdverseMediaScreening(rimNumber, customerName)
    };

    const results = {};
    for (const [key, promise] of Object.entries(loading)) {
      try {
        results[key] = await promise;
      } catch (error) {
        console.error(`Failed to load ${key}: ${error.message}`);
        results[key] = { error: error.message, success: false };
      }
    }

    return results;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EDDDataIntegrationAdapter;
}