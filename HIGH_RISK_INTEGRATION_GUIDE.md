# HIGH RISK IMPACT SYSTEM - INTEGRATION GUIDE

## Table of Contents
1. [Overview](#overview)
2. [File Dependencies](#file-dependencies)
3. [Integration into edd_case.html](#integration-into-edd_casehtml)
4. [Integration into Dashboard Pages](#integration-into-dashboard-pages)
5. [Integration into Executive Presentation](#integration-into-executive-presentation)
6. [Testing & Validation](#testing--validation)
7. [Troubleshooting](#troubleshooting)

---

## Overview

The High Risk Impact System consists of 4 files that work together:

| File | Purpose | Type | Size |
|------|---------|------|------|
| `css/high_risk_impact.css` | Styling for panels & widgets | CSS | 350+ lines |
| `js/high_risk_impact.js` | Core logic & rendering | JavaScript | 177 lines |
| `js/high_risk_demo_data.js` | Demo cases for testing | JavaScript | 291 lines |
| `HIGH_RISK_IMPACT_SYSTEM.md` | Technical specification | Markdown | 450+ lines |

---

## File Dependencies

### Import Order (CRITICAL)
```html
<!-- Step 1: CSS must load FIRST -->
<link rel="stylesheet" href="css/high_risk_impact.css">

<!-- Step 2: Core logic second -->
<script src="js/high_risk_impact.js"></script>

<!-- Step 3: Demo data last (optional, only for testing) -->
<script src="js/high_risk_demo_data.js"></script>
```

**Why this order?**
- CSS must be parsed before JavaScript runs
- Core logic must load before demo data initializes
- Demo data is optional for production (only for development/testing)

---

## Integration into edd_case.html

### STEP 1: Add HTML Container

**Location:** At the top of the case details section, after breadcrumbs/header

```html
<!-- Existing page structure -->
<div class="edd-case-container">
  <h1>Case Management</h1>
  <div class="breadcrumbs">...</div>
  
  <!-- ✅ ADD THIS: High Risk Impact Container -->
  <div id="high-risk-impact-container"></div>
  
  <!-- Existing case form -->
  <form class="case-form">
    ...
  </form>
</div>
```

### STEP 2: Add CSS Import

**Location:** In `<head>` section, after other stylesheets

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EDD Case Management</title>
  
  <!-- Existing stylesheets -->
  <link rel="stylesheet" href="css/edd_system.css">
  
  <!-- ✅ ADD THIS: High Risk Impact Styles -->
  <link rel="stylesheet" href="css/high_risk_impact.css">
</head>
```

### STEP 3: Add JavaScript Imports

**Location:** Before closing `</body>` tag, after other scripts

```html
<body>
  <!-- Page content -->
  
  <!-- Existing scripts -->
  <script src="js/edd_system.js"></script>
  
  <!-- ✅ ADD THESE: High Risk Impact Scripts -->
  <script src="js/high_risk_impact.js"></script>
  <script src="js/high_risk_demo_data.js"></script> <!-- Optional: remove in production -->
</body>
```

### STEP 4: Initialize the System

**Location:** In a script tag or external JS file, after page content loads

#### Option A: Inline Script (Simple)
```html
<script>
  document.addEventListener('DOMContentLoaded', () => {
    // Get case data from page (assumes getCaseData() exists)
    const caseData = getCaseData();
    
    // Initialize system
    const highRiskSystem = new HighRiskImpactSystem();
    
    // Render panel
    highRiskSystem.render(caseData, 'high-risk-impact-container');
  });
</script>
```

#### Option B: Modular Script (Production)
```html
<script>
  // Initialize after all dependencies loaded
  (function initializeHighRiskSystem() {
    if (typeof HighRiskImpactSystem === 'undefined') {
      console.error('HighRiskImpactSystem not found. Check script loading order.');
      return;
    }
    
    const system = new HighRiskImpactSystem();
    
    // Listen for case data updates
    window.addEventListener('caseDataUpdated', (event) => {
      system.render(event.detail.caseData, 'high-risk-impact-container');
    });
  })();
</script>
```

### STEP 5: Provide Case Data

The system expects case data object with these fields:

```javascript
const caseData = {
  // Required fields
  caseId: 'EDD-2026-001',
  customerName: 'Karim Al-Rashid',
  riskCategory: 'HIGH', // or 'MEDIUM', 'LOW', 'AUTO_HIGH'
  
  // Risk Exposure Fields
  pepStatus: true,
  pepType: 'Politician - Former Government Official',
  
  countryRisk: {
    level: 'High', // 'High', 'Medium', 'Low'
    name: 'Syria',
    reason: 'OFAC Listed Country'
  },
  
  occupationRisk: {
    level: 'High',
    category: 'Arms & Defense Sector'
  },
  
  activityFlags: [
    'Structured Deposits (< $10k threshold)',
    'Round-number transactions',
    'Timing pattern suspicious (weekly deposits)'
  ],
  
  productRisk: {
    level: 'High',
    name: 'Political Multi-currency Account'
  },
  
  documentationScore: 65, // Percentage (0-100)
  
  // Missing Evidence Fields
  sourceOfWealthDoc: 'Missing', // or 'Present'
  salaryDoc: 'Missing', // or 'Present'
  passportExpiry: '2026-01-15', // ISO format
  
  // Investigation Context
  daysOpen: 18,
  investigator: 'Ahmed Al-Mansouri',
  
  // Optional: audit logging
  userId: 'ahmed.mansouri'
};
```

**Data Source Options:**
1. **From form values:** Extract from visible form fields on page
2. **From API call:** Fetch case data from backend service
3. **From page data attribute:** `<div data-case-data="..."></div>`
4. **From demo data:** Use `window.demoData[caseId]` for testing

---

## Integration into Dashboard Pages

### INTEGRATION POINT 1: Management Dashboard (`management_dashboard.html`)

#### Add Widget to HTML

**Location:** Risk/Compliance section of dashboard

```html
<div class="dashboard-row risk-metrics">
  <!-- Existing widgets -->
  
  <!-- ✅ ADD THIS: High Risk Summary Widget -->
  <div class="dashboard-widget high-risk-summary-widget">
    <div class="widget-header">
      <h3>High Risk Exposure Summary</h3>
      <span class="widget-icon">⚠️</span>
    </div>
    
    <div class="widget-content">
      <div class="metric-grid">
        <!-- Metric 1: Total HIGH Risk Cases -->
        <div class="metric-card">
          <div class="metric-number" id="metric-high-risk-count">8</div>
          <div class="metric-label">High Risk Cases</div>
          <div class="metric-trend">↑ 3 this week</div>
        </div>
        
        <!-- Metric 2: Missing Evidence -->
        <div class="metric-card">
          <div class="metric-number" id="metric-missing-evidence">5</div>
          <div class="metric-label">Missing Evidence</div>
          <div class="metric-trend">↓ 2 resolved</div>
        </div>
        
        <!-- Metric 3: SLA at Risk -->
        <div class="metric-card">
          <div class="metric-number" id="metric-sla-risk">2</div>
          <div class="metric-label">SLA at Risk</div>
          <div class="metric-trend">Action needed</div>
        </div>
      </div>
      
      <!-- Risk Driver Chart -->
      <div id="risk-driver-chart" class="widget-chart">
        <!-- Chart will be rendered here -->
      </div>
      
      <!-- Drill-down Link -->
      <div class="widget-footer">
        <button class="btn-drill-down" onclick="navigateToHighRiskCases()">
          View All High Risk Cases →
        </button>
      </div>
    </div>
  </div>
</div>
```

#### Add Widget Styling

**Location:** Add to `css/high_risk_impact.css` or main stylesheet

```css
.high-risk-summary-widget {
  background: linear-gradient(135deg, 
    rgba(255, 82, 82, 0.08) 0%, 
    rgba(255, 82, 82, 0.03) 100%);
  border: 1px solid rgba(255, 82, 82, 0.2);
  border-radius: 12px;
  padding: 20px;
  min-height: 300px;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.metric-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid rgba(255, 82, 82, 0.1);
}

.metric-number {
  font-size: 32px;
  font-weight: bold;
  color: #FF5252;
  margin-bottom: 8px;
}

.metric-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-trend {
  font-size: 11px;
  color: rgba(0, 212, 255, 0.7);
  margin-top: 8px;
}
```

#### Add Widget JavaScript Logic

**Location:** In `js/high_risk_impact.js` or new file `js/dashboard_widget.js`

```javascript
class HighRiskSummaryWidget {
  constructor() {
    this.data = {};
  }
  
  updateMetrics(dashboardData) {
    // Update metric displays
    document.getElementById('metric-high-risk-count').textContent = 
      dashboardData.totalHighRiskCases || 0;
    
    document.getElementById('metric-missing-evidence').textContent = 
      dashboardData.casesWithMissingEvidence || 0;
    
    document.getElementById('metric-sla-risk').textContent = 
      dashboardData.slaAtRisk || 0;
    
    // Render risk driver chart
    this.renderRiskDriverChart(dashboardData.topRiskDrivers);
  }
  
  renderRiskDriverChart(drivers) {
    const chartContainer = document.getElementById('risk-driver-chart');
    const html = `
      <div class="risk-driver-list">
        <h4>Top Risk Drivers:</h4>
        <ul>
          <li>PEP Detected: <strong>${drivers.pepDetected || 0}</strong> cases</li>
          <li>High-Risk Country: <strong>${drivers.highRiskCountry || 0}</strong> cases</li>
          <li>Missing SOF: <strong>${drivers.missingSOF || 0}</strong> cases</li>
        </ul>
      </div>
    `;
    chartContainer.innerHTML = html;
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const widget = new HighRiskSummaryWidget();
  
  // Fetch dashboard metrics from backend
  fetch('/api/dashboard/high-risk-metrics')
    .then(res => res.json())
    .then(data => widget.updateMetrics(data))
    .catch(err => console.error('Failed to load metrics:', err));
});

// Drill-down function
function navigateToHighRiskCases() {
  window.location.href = '/cases?risk=HIGH&sort=created_desc';
}
```

### INTEGRATION POINT 2: Executive Dashboard (`executive_dashboard.html`)

#### Add KPI Metric Tile

**Location:** Risk/Compliance section

```html
<div class="kpi-section">
  <!-- Existing KPIs -->
  
  <!-- ✅ ADD THIS: High Risk KPI -->
  <div class="kpi-tile high-risk-kpi">
    <div class="kpi-icon">🚨</div>
    <div class="kpi-content">
      <div class="kpi-number" id="exec-high-risk-count">8</div>
      <div class="kpi-label">OPEN HIGH RISK CASES</div>
      <div class="kpi-action">
        <a href="/cases?risk=HIGH">Review Cases</a>
      </div>
    </div>
  </div>
</div>
```

#### Add Secondary Metric

```html
<!-- SLA At Risk Metric -->
<div class="kpi-tile sla-at-risk-kpi" style="border-color: #FFA726;">
  <div class="kpi-icon">⏰</div>
  <div class="kpi-content">
    <div class="kpi-number" id="exec-sla-risk">2</div>
    <div class="kpi-label">SLA AT RISK</div>
    <div class="kpi-action">
      <a href="/cases?sla=atrisk">Action Required</a>
    </div>
  </div>
</div>
```

---

## Integration into Executive Presentation

### Add Slide Link/Content

**Location:** In `EXECUTIVE_BRIEFING.md` or presentation system

```markdown
---

## Slide 8: "Why High Risk Visibility Matters"

### Process Flow
[Embedded interactive diagram from EXECUTIVE_PRESENTATION_HIGH_RISK_IMPACT.md]

### Key Message
> "30-second understanding → Guided investigation → Human decision → Audit ready"

### Benefits
1. Investigation time reduced by 30% (target)
2. Risk accuracy improved to 95%+
3. Investigator confidence increased
4. 100% audit compliance
5. Recovered investigator time (1 FTE/month)

### Call to Action
> "Deploy High Risk Impact System for entire operations team"

---
```

---

## Testing & Validation

### Test 1: Panel Rendering (HIGH RISK Case)

```javascript
// Open browser console and run:
const system = new HighRiskImpactSystem();
const testCase = demoCase_HighRisk_001; // From demo_data.js
system.render(testCase, 'high-risk-impact-container');

// Expected: Full panel appears with:
// ✓ Red "HIGH RISK" badge
// ✓ 6 exposure items
// ✓ 5 consequence items
// ✓ 7 action items
// ✓ Investigator statement
```

### Test 2: Panel Rendering (MEDIUM RISK Case)

```javascript
const testCase = demoCase_MediumRisk_001;
system.render(testCase, 'high-risk-impact-container');

// Expected: Simplified panel with:
// ✓ Orange "MEDIUM RISK" badge
// ✓ Reduced consequences (2-3 items)
// ✓ Reduced actions (3-4 items)
```

### Test 3: Panel Rendering (LOW RISK Case)

```javascript
const testCase = demoCase_LowRisk_001;
system.render(testCase, 'high-risk-impact-container');

// Expected: No panel (hidden)
document.getElementById('high-risk-impact-container').innerHTML === ''
// → true
```

### Test 4: Checkbox Interaction

```javascript
// In browser console:
// 1. Render HIGH RISK case (as above)
// 2. Click checkbox next to first action
// 3. Check console for audit event:
console.log('Audit log:');
// Should output AC-100x level details
```

### Test 5: Responsive Design

Test on:
- Desktop (1920×1080): 3-column grid ✓
- Tablet (768×1024): 2-column grid ✓
- Mobile (375×667): Single column ✓
- Mobile landscape (667×375): 2 columns ✓

### Test 6: Cross-Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✓ Test |
| Firefox | 88+ | ✓ Test |
| Safari | 14+ | ✓ Test |
| Edge | 90+ | ✓ Test |

---

## Troubleshooting

### Issue 1: Panel Not Appearing

**Symptom:** Container div is empty, no panel rendered

**Diagnosis:**
```javascript
// Check 1: System class exists?
console.log(typeof HighRiskImpactSystem); // Should be 'function'

// Check 2: Case data valid?
console.log(caseData); // Print case data to inspect

// Check 3: Container exists?
console.log(document.getElementById('high-risk-impact-container')); // Should not be null
```

**Solutions:**
1. Verify CSS import is FIRST in document head
2. Verify JavaScript import order (core logic before demo data)
3. Check browser console for errors: F12 → Console tab
4. Ensure caseData has required fields

---

### Issue 2: Styling Not Applied

**Symptom:** Panel appears but looks wrong (no colors, broken layout)

**Diagnosis:**
```javascript
// Check CSS loaded:
console.log(document.styleSheets); // Should include high_risk_impact.css

// Check element classes:
const panel = document.querySelector('.high-risk-impact-panel');
console.log(panel.className); // Should include 'high-risk-impact-panel'
console.log(window.getComputedStyle(panel).backgroundColor);
```

**Solutions:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Check CSS file path (relative to HTML file location)
3. Verify CSS @media queries don't override base styles
4. Inspect element (F12 → Elements) to see actual styles applied

---

### Issue 3: Demo Data Not Working

**Symptom:** "demoCase_HighRisk_001 is not defined"

**Diagnosis:**
```javascript
console.log(typeof demoCase_HighRisk_001); // Should be 'object'
console.log(window.demoData); // Should contain cases
```

**Solutions:**
1. Verify `js/high_risk_demo_data.js` is imported AFTER core logic
2. Check for JavaScript errors below the import line in HTML
3. For production: Remove demo_data.js import (not needed for real cases)

---

### Issue 4: Checkboxes Not Responding

**Symptom:** Clicking checkpoint doesn't toggle state or log event

**Diagnosis:**
```javascript
// Click checkbox in browser, then check console:
console.log(window.auditLog); // Should show new entry
```

**Solutions:**
1. Verify JavaScript loaded (check console for errors)
2. Ensure event listeners attached correctly
3. Check browser version (needs ES6 support)

---

### Issue 5: Mobile Responsive Not Working

**Symptom:** Mobile view shows desktop layout or text too small

**Diagnosis:**
```javascript
// Check viewport meta tag:
console.log(document.querySelector('meta[name="viewport"]'));
// Should output: <meta name="viewport" content="width=device-width...">
```

**Solutions:**
1. Add viewport meta tag to HTML if missing
2. Test in mobile view (F12 → Device toggle)
3. Clear CSS cache (hard refresh: Ctrl+Shift+R)

---

## Support & Documentation

- **Specification:** See `HIGH_RISK_IMPACT_SYSTEM.md`
- **API Reference:** See `js/high_risk_impact.js` class methods
- **Demo Cases:** See `js/high_risk_demo_data.js`
- **Visual Design:** See `css/high_risk_impact.css` comments
- **BRD Requirements:** See `BRD_HIGH_RISK_IMPACT_SYSTEM.md`
- **Presentation:** See `EXECUTIVE_PRESENTATION_HIGH_RISK_IMPACT.md`

---

**Integration Guide Version:** 1.0
**Last Updated:** 11 March 2026
**Status:** DRAFT - Ready for Implementation
