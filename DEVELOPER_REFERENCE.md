# CDD Case Management System - Developer Reference

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│         CDD Operations Dashboard                 │
│       (cdd_view.html + cdd_view.js)             │
└──────────────────┬──────────────────────────────┘
                   │
                   ├──► Dynamic Case Counts
                   ├──► Kanban Board Display
                   ├──► Case List Modal
                   ├──► Create Case Modal
                   └──► Search & Filter
                   
                   │
┌──────────────────▼──────────────────────────────┐
│         Case Manager Class                       │
│       (js/case_manager.js)                      │
└──────────────────┬──────────────────────────────┘
                   │
                   ├──► CRUD Operations
                   ├──► Status Mapping
                   ├──► Query & Search
                   ├──► Analytics & Stats
                   └──► Data Persistence
                   
                   │
┌──────────────────▼──────────────────────────────┐
│         Data Layer                               │
│                                                  │
│  ┌─ sessionStorage (runtime)                   │
│  │  └─ edd_cases array                         │
│  │  └─ edd_case_counter                        │
│  │                                              │
│  └─ mock_data.js (seed data)                   │
│     └─ EDDMockData.cdd_cases                   │
│     └─ EDDMockData.customers                   │
└──────────────────────────────────────────────────┘
```

## Class: CaseManager

### Static Properties

```javascript
CaseManager.STATUS_STAGES = {
  'PENDING_CDD': {...},
  'MAKER_REVIEW': {...},
  'CHECKER_REVIEW': {...},
  'COMPLETED': {...},
  'ESCALATED_COMPLIANCE': {...}
}
```

### Instance Properties

```javascript
this.cases              // Array of case objects
this.storageKey        // 'edd_cases' 
this.caseCounterKey    // 'edd_case_counter'
```

### Public Methods

#### Initialization
- `constructor()` - Initialize from storage or defaults
- `loadCases()` - Load from sessionStorage
- `initializeDefaultCases()` - Create from high-risk customers
- `saveCases()` - Persist to sessionStorage

#### CRUD
- `addCase(caseData)` → Returns new case with ID
- `getCaseById(caseId)` → Returns case or null
- `updateCaseStatus(caseId, newStatus, userId)` → Updates & saves
- `addCaseNote(caseId, note)` → Appends note
- `assignCase(caseId, userId)` → Changes assignment

#### Query
- `getCasesByStatus(status)` → Array of cases
- `getCasesBySector(sector)` → Array of cases  
- `getCasesByUser(userId)` → Array of cases
- `getCountByStatus(status)` → Number
- `getCountsByStatus()` → Object with all counts
- `searchCases(query)` → Array of matching cases
- `getAllCases(filters)` → Filtered & sorted array

#### Utilities
- `findCustomer(rim)` → Customer object
- `getNextAvailableCDDAnalyst()` → Employee ID
- `getStats()` → Statistics object
- `resetCases()` → Clears all data

## Core Functions in cdd_view.js

### Page Load Flow
```javascript
DOMContentLoaded
  ├─ Check session
  ├─ Initialize CaseManager
  ├─ loadCDDCases()
  │  ├─ getCountsByStatus()
  │  ├─ updateStatCard(4 cards)
  │  └─ renderKanbanColumn(4 columns)
  ├─ loadActivityTimeline()
  ├─ Setup event listeners
  └─ Dashboard ready
```

### Key Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `loadCDDCases()` | Load all cases & update UI | void |
| `renderKanbanColumn(status, containerId, count)` | Render stage cards | void |
| `renderKanbanCard(caseObj)` | Render single case card | HTML string |
| `openCaseListModal(status)` | Show case table modal | void |
| `populateCaseTable(cases)` | Fill modal table | void |
| `filterCaseTable()` | Filter modal table | void |
| `openCreateCaseModal()` | Show create form | void |
| `submitCreateCaseForm()` | Validate & create case | void |
| `openCaseDetail(caseId)` | Navigate to case page | void |
| `formatDate(dateStr)` | Format for display | string |

## Data Flow Examples

### Creating a Case

```
User clicks "+ Create Case"
  │
  ├─ openCreateCaseModal()
  ├─ Modal shows form overlay
  │
User fills fields & clicks submit
  │
  ├─ submitCreateCaseForm()
  ├─ Validates required fields
  ├─ caseManager.addCase(caseData)
  ├─ saveCase() writes to sessionStorage
  ├─ Case gets auto-ID: EDD-2026-009XX
  ├─ Assigned to next available analyst
  │
  ├─ closeAllModals()
  ├─ loadCDDCases() refreshes display
  ├─ New case appears in Pending stage
  │
User sees success message
```

### Viewing Cases in Stage

```
User clicks "View All 12" on stage card
  │
  ├─ openCaseListModal('PENDING_CDD')
  ├─ Fetch: caseManager.getCasesByStatus('PENDING_CDD')
  ├─ populateCaseTable(cases)
  │
  ├─ Modal opens with HTML table
  ├─ Table shows 12 cases in rows
  ├─ Each row clickable
  │
User searches or scrolls
  │
  ├─ filterCaseTable() on input
  ├─ JavaScript filters in-memory
  ├─ Table re-renders instantly
  │
User clicks "Open" on case
  │
  ├─ openCaseDetail(caseId)
  ├─ Navigate to: edd_case.html?case_id=EDD-2026-001000
```

### Updating Case Status

```
(Future implementation - currently read-only)

User clicks status button on case detail
  │
  ├─ Modal shows status options
  ├─ User selects new status
  │
  ├─ caseManager.updateCaseStatus(caseId, newStatus)
  ├─ Validates status transition
  ├─ Tracks who made change (user ID)
  ├─ saveCases() persists update
  │
  ├─ Page refreshes case display
  ├─ Activity timeline updated
  │
Case moved to new stage
```

## API Integration Guide

### Step 1: Replace sessionStorage with API calls

**Current**:
```javascript
loadCases() {
  const stored = sessionStorage.getItem(this.storageKey);
  this.cases = JSON.parse(stored);
}

saveCases() {
  sessionStorage.setItem(this.storageKey, JSON.stringify(this.cases));
}
```

**Updated**:
```javascript
async loadCases() {
  try {
    const response = await fetch('/api/cases');
    this.cases = await response.json();
  } catch (error) {
    console.error('Failed to load cases:', error);
    this.cases = [];
  }
}

async saveCases() {
  try {
    await fetch('/api/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.cases)
    });
  } catch (error) {
    console.error('Failed to save cases:', error);
  }
}
```

### Step 2: Update case creation

```javascript
async addCase(caseData) {
  const newCase = this.createCase(caseData);
  
  try {
    const response = await fetch('/api/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCase)
    });
    
    const savedCase = await response.json();
    this.cases.push(savedCase);
    return savedCase;
  } catch (error) {
    console.error('Failed to create case:', error);
    throw error;
  }
}
```

### Step 3: Update case retrieval

```javascript
async getCaseById(caseId) {
  try {
    const response = await fetch(`/api/cases/${caseId}`);
    return await response.json();
  } catch (error) {
    return null;
  }
}

async getCasesByStatus(status) {
  try {
    const response = await fetch(`/api/cases?status=${status}`);
    return await response.json();
  } catch (error) {
    return [];
  }
}
```

## Modal Implementation

### Case List Modal

```html
<div id="case-list-modal" class="modal" style="display:none;">
  <div class="modal-content">
    <div class="modal-header">
      <h2 id="modal-title">Cases - Status</h2>
      <button class="modal-close">✕</button>
    </div>
    <div class="modal-body">
      <input id="case-search" placeholder="Search...">
      <table id="case-table">
        <thead>
          <tr><th>Case ID</th><th>Customer</th>...</tr>
        </thead>
        <tbody id="case-table-body">
          <!-- Populated by populateCaseTable() -->
        </tbody>
      </table>
    </div>
    <div class="modal-footer">
      <button onclick="closeCaseListModal()">Close</button>
    </div>
  </div>
</div>
```

### Create Case Modal

```html
<div id="create-case-modal" class="modal" style="display:none;">
  <div class="modal-content">
    <div class="modal-header">
      <h2>Create New Case</h2>
      <button class="modal-close">✕</button>
    </div>
    <div class="modal-body">
      <form id="create-case-form">
        <input id="new-case-rim" placeholder="Customer RIM..." required>
        <select id="new-case-sector" required>
          <option value="PB">Private Banking</option>
          <option value="TZ">Tamayuz Elite</option>
          <option value="MS">Mass Banking</option>
        </select>
        <select id="new-case-risk" required>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <textarea id="new-case-notes"></textarea>
      </form>
    </div>
    <div class="modal-footer">
      <button onclick="submitCreateCaseForm()">Create Case</button>
    </div>
  </div>
</div>
```

## Event Listeners

### Case List Modal
- **Search Input**: `onkeyup="filterCaseTable()"`
- **Open Case**: `onclick="openCaseDetail(caseId)"`
- **Modal Close**: Overlay click or button click

### Create Case Modal
- **Form Submit**: `onclick="submitCreateCaseForm()"`
- **Modal Close**: Button click

### Stage Cards
- **View All**: Click opens case list modal
- **Card Click**: Navigates to case detail

## Extending the System

### Adding New Case Status

1. Update `CaseManager.STATUS_STAGES`:
```javascript
'PENDING_APPROVAL': {
  stage: 'Pending Approval',
  color: '#9C27B0',
  priority: 2
}
```

2. Add kanban column to HTML:
```html
<div class="kanban-column">
  <div class="kanban-header">
    <h3>Pending Approval</h3>
    <span class="kanban-count" id="kanban-pending-approval-count">0</span>
  </div>
  <div class="kanban-cards" id="kanban-pending-approval"></div>
</div>
```

3. Update renderKanban in cdd_view.js:
```javascript
renderKanbanColumn('PENDING_APPROVAL', 'kanban-pending-approval', counts.PENDING_APPROVAL);
```

### Adding New Filters

1. Add filter parameter to form
2. Update `getAllCases()`:
```javascript
getAllCases(filters = {}) {
  let result = [...this.cases];
  
  if (filters.priority) {
    result = result.filter(c => c.priority === filters.priority);
  }
  
  return result;
}
```

3. Update filter modal UI

### Adding Case Templates

```javascript
createCaseFromTemplate(templateName, customData = {}) {
  const templates = {
    'HIGH_RISK_PEP': {
      risk_level: 'HIGH',
      sector: 'PB',
      case_notes: 'High-risk PEP customer requiring enhanced CDD'
    },
    'NON_RESIDENT': {
      risk_level: 'HIGH',
      sector: 'MS',
      case_notes: 'Non-resident customer, compliance review required'
    }
  };
  
  const template = templates[templateName];
  const caseData = { ...template, ...customData };
  return this.addCase(caseData);
}
```

## Testing

### Unit Test Example
```javascript
// Test case creation
const manager = new CaseManager();
manager.resetCases();
const newCase = manager.addCase({
  customer_id: 'RIM001234',
  risk_level: 'HIGH',
  sector: 'PB'
});

console.assert(newCase.case_id.startsWith('EDD-'), 'Case ID format incorrect');
console.assert(manager.getCountByStatus('PENDING_CDD') === 1, 'Case not added');
```

### Integration Test Example
```javascript
// Test complete workflow
const manager = new CaseManager();
manager.resetCases();

// Create case
const newCase = manager.addCase({ customer_id: 'RIM001234', sector: 'PB', risk_level: 'HIGH' });
console.assert(newCase.case_id, 'Case not created');

// Update status
manager.updateCaseStatus(newCase.case_id, 'MAKER_REVIEW', 'EMP002');
const updated = manager.getCaseById(newCase.case_id);
console.assert(updated.case_status === 'MAKER_REVIEW', 'Status not updated');

// Search
const found = manager.searchCases(newCase.case_id);
console.assert(found.length === 1, 'Search failed');

// Get stats
const stats = manager.getStats();
console.assert(stats.total === 1, 'Stats incorrect');
```

## Performance Optimization

### Current Performance
- Load 100 cases: < 100ms
- Search 100 cases: < 50ms  
- Create case: < 10ms
- Update status: < 20ms

### For Large Datasets (1000+ cases)

1. **Pagination**:
```javascript
getAllCases(filters = {}, page = 1, pageSize = 20) {
  let result = this.filterCases(filters);
  const start = (page - 1) * pageSize;
  return result.slice(start, start + pageSize);
}
```

2. **Indexing**:
```javascript
constructor() {
  this.cases = [];
  this.indexByStatus = {};  // Quick lookup
  this.indexByUser = {};    // Quick lookup
}

saveCases() {
  // Rebuild indexes
  this.indexByStatus = {};
  this.indexByUser = {};
  this.cases.forEach(c => {
    if (!this.indexByStatus[c.case_status]) {
      this.indexByStatus[c.case_status] = [];
    }
    this.indexByStatus[c.case_status].push(c.case_id);
  });
}
```

3. **Virtual Scrolling** (for modal tables with 1000+ rows):
```javascript
// Render only visible rows, scroll to load more
implementVirtualScrolling(cases);
```

## Debugging

### Check Case Data
```javascript
// In browser console
window.caseManager.getAllCases()     // All cases
window.caseManager.getCasesByStatus('PENDING_CDD')  // By status
window.caseManager.getStats()        // Statistics
sessionStorage.getItem('edd_cases')  // Storage contents
```

### Monitor Changes
```javascript
// Override saveCases to log
const originalSave = CaseManager.prototype.saveCases;
CaseManager.prototype.saveCases = function() {
  console.log('Cases saved:', this.cases);
  originalSave.call(this);
};
```

### Trace Events
```javascript
// Add logging to modal functions
const originalOpen = openCaseListModal;
window.openCaseListModal = function(status) {
  console.log('Opening modal for status:', status);
  originalOpen(status);
};
```

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Cases not showing | sessionStorage empty | Reload page or reset: `manager.initializeDefaultCases()` |
| Search not working | Case mismatch | Check case_id vs caseId field names |
| Modal won't close | Event listener issue | Clear & re-bind: `document.getElementById('modal-overlay').onclick = closeAllModals;` |
| Status not updating | Async issue | Await saveCases() before reload UI |
| Slow performance | Large dataset | Implement pagination or indexing |

---

**Last Updated**: March 10, 2026
**Version**: 1.0
**Maintainer**: Development Team
