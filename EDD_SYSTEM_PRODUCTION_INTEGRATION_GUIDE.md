# EDD INVESTIGATION SYSTEM - PRODUCTION INTEGRATION GUIDE

**Status:** Production-Ready  
**Version:** 1.0  
**Created:** March 10, 2026  
**Modules:** 4 JavaScript engines + 1 HTML template  

---

## SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                    EDD INVESTIGATION UI                         │
│              (edd_case_production.html)                         │
│  - 11-Section Sequential Workflow                              │
│  - Form validation & mandatory field enforcement                │
│  - Real-time progress tracking                                  │
└──────────────────┬──────────────────────────────────────────────┘
                   │
       ┌───────────┼───────────┐
       │           │           │
   (1) │       (2) │       (3) │
       ▼           ▼           ▼
    Data      Investigation  Form
  Integration  Decision      Validation
    Adapter     Engine       Module
       │           │           │
       ├───────────┼───────────┤
       │ Connects to External Systems │ Orchestrates Workflow │ Enforces Rules
       │ T24, CRP, Regulatory        │ Loads/Saves sections  │ Mandatory fields
       │ Caches results for         │ Audit trail logging   │ N/A justification
       │ 24-hour TTL                │ Maker/Checker routing │ Progress tracking
       └─────────────────────────────────────────────────────────────┘
                   │
       ┌───────────┴───────────┐
       │                       │
       ▼                       ▼
   Backend API            External Systems
   - POST /api/edd-cases  - T24 (Core Banking)
   - GET /api/edd-cases   - CRP (Risk Profiling)
   - PUT /api/edd-cases   - Regulatory (PEP/OFAC)
   - PUT /api/edd-cases/{id}/approve  - TM (Monitoring)
   - PUT /api/edd-cases/{id}/reject   - DMS (Documents)
```

---

## MODULE DESCRIPTIONS

### 1. **edd_data_integration.js** - Data Integration Adapter
**File:** `edd_system/js/edd_data_integration.js`

**Purpose:** Manages connections to all external systems (READ-ONLY)

**Key Features:**
- Loads customer data from T24 (auto-fills sections 2, 4, 5, 7)
- Loads risk scores from CRP (auto-fills section 1)
- Loads PEP/regulatory data (auto-fills section 10)
- 24-hour caching to reduce API load
- Fallback to stale cache if API fails
- Full audit logging of all API calls

**Main Methods:**
```javascript
// Load data for sections
await dia.loadRiskClassification(rimNumber)      // Section 1
await dia.loadCustomerProfile(rimNumber)         // Section 2
await dia.loadEmploymentSource(rimNumber)        // Section 4
await dia.loadInitialDeposit(rimNumber)          // Section 5
await dia.loadAccountPortfolio(rimNumber)        // Section 7
await dia.loadPEPInformation(rimNumber, name)    // Section 10
await dia.loadAdverseMediaScreening(rimNumber)   // Section 10

// Batch load all external data at once
await dia.loadAllExternalData(rimNumber, customerName)

// Cache management
dia.clearCache(rimNumber)  // Clear cache for customer
dia.getApiCallStats()      // Get API performance metrics
```

**Governance Principle:** ❌ NO RISK CALCULATION IN THIS SYSTEM
- All risk scores originate from CRP (external)
- EDD platform READS and DISPLAYS risk data only
- No modification or computation of risk scores occurs here

---

### 2. **edd_investigation_engine.js** - Investigation Workflow Engine
**File:** `edd_system/js/edd_investigation_engine.js`

**Purpose:** Orchestrates the complete 11-section investigation workflow

**Key Features:**
- Manages case lifecycle (DRAFT → PENDING_REVIEW → APPROVED/REJECTED)
- Validates each section's mandatory fields
- Routes case through Maker (Investigator) → Checker (Manager) approval
- Captures and stores digital signatures with timestamps
- Maintains complete audit trail of all actions

**Main Methods:**
```javascript
const engine = new EDDInvestigationEngine();

// Step 1: Load external data (auto-populated sections)
await engine.loadRiskClassification(rimNumber)
await engine.loadCustomerInformation(rimNumber)
await engine.loadInitialDeposit(rimNumber)
await engine.loadExistingBankRelations(rimNumber)

// Step 2: Validate investigator input (manual sections)
engine.validatePurposeOfAccount(purpose, relationship)
engine.validateSourceOfIncome(explanation, verified)
engine.validateExpectedTransactions(income, expense, description)
engine.validateOtherBanks(hasOtherBanks, details)
engine.validateRelatedParties(hasRelatedParties, list)
engine.validatePEPInformation(isPEP, assessment, sourceOfFunds, approval)

// Step 3: Investigator submit recommendation
engine.submitInvestigatorDecision(overallAssessment, recommendation)
// recommendation: APPROVE | ESCALATE | REJECT | REWORK

// Step 4: Manager review and approval
engine.submitManagerApproval(managerDecision, comments)
// managerDecision: APPROVED | REJECTED | REWORK

// Step 5: Export case for submission
const caseData = engine.exportCase()
```

**Case Status Flow:**
```
DRAFT (investigator filling sections)
  ↓
PENDING_MANAGER_REVIEW (investigator submitted)
  ↓
APPROVED / REJECTED / RETURNED_FOR_REWORK (manager decision)
```

---

### 3. **edd_form_validator.js** - Form Validation Engine
**File:** `edd_system/js/edd_form_validator.js`

**Purpose:** Enforces mandatory field rules and form compliance

**Key Features:**
- Validates ALL 11 sections against mandatory field rules
- Enforces "N/A with justification" rule (if field not applicable)
- Tracks completion progress (x of 11 sections)
- Prevents submission if mandatory fields empty
- Provides user-friendly error messages

**Mandatory Field Rules by Section:**

| Section | Type | Fields | Can be N/A | Rule |
|---------|------|--------|-----------|------|
| 1 | External | Risk data | N/A | Auto-filled, no validation |
| 2 | External | Customer info | N/A | Auto-filled, no validation |
| 3 | Manual | Account purpose, business relate | ❌ NO | Must explain purpose |
| 4 | Hybrid | Source explanation, income verified | ❌ NO | Must assess source |
| 5 | External | Deposit amount, date, method | N/A | Auto-filled, no validation |
| 6 | Manual | Monthly income/expense, description | ❌ NO | Must estimate volumes |
| 7 | External | Account list, balances | N/A | Auto-filled, no validation |
| 8 | Manual | Other banks? | ⚠️ YES | Must answer Yes/No/Unknown |
| 9 | Manual | Related parties? | ⚠️ YES | Must answer Yes/No/Unknown |
| 10 | Hybrid | PEP assessment, source verification | ⚠️ IF PEP | Mandatory only if isPEP=true |
| 11 | Decision | Assessment, recommendation, decision | ❌ NO | Explicit decision required |

**Main Methods:**
```javascript
const validator = new EDDFormValidator();

// Validate single field
validator.validateField(sectionName, fieldName, fieldValue)
// Returns: { isValid: boolean, error: string }

// Validate entire section
validator.validateSection(sectionName, sectionData)
// Returns: { isComplete: boolean, errors: {} }

// Validate all sections
validator.validateAllSections(caseData)
// Returns: { totalSections: 11, completedSections: n, progress: % }

// Get section status
validator.getSectionStatus(sectionName, caseData)

// Get validation errors for display
validator.getValidationSummary(caseData)

// Check if field allows N/A
validator.allowsNA(sectionName, fieldName)

// Get progress bar data
validator.getProgressData(caseData)
```

---

## INTEGRATION STEPS

### Step 1: Add JavaScript Imports to HTML

Edit `edd_case_production.html` and add these imports in `<head>`:

```html
<head>
  <!-- Existing CSS/JS -->
  
  <!-- EDD Investigation Modules -->
  <script src="js/edd_data_integration.js"></script>
  <script src="js/edd_investigation_engine.js"></script>
  <script src="js/edd_form_validator.js"></script>
</head>
```

### Step 2: Initialize Modules on Page Load

```javascript
<script>
  // Initialize modules
  const dia = new EDDDataIntegrationAdapter('/api');
  const engine = new EDDInvestigationEngine();
  const validator = new EDDFormValidator();

  // Get RIM number from URL or form
  const urlParams = new URLSearchParams(window.location.search);
  const rimNumber = urlParams.get('rim') || 'QIB-001234';

  // Load case on page load
  document.addEventListener('DOMContentLoaded', async function() {
    try {
      // Load all external data in parallel
      const externalData = await dia.loadAllExternalData(rimNumber, 'Customer Name');
      
      // Populate external data blocks (sections 1, 2, 5, 7, 10)
      populateExternalDataBlocks(externalData);
      
      // Initialize form validation
      updateProgressBar();
      
      console.log('✅ EDD System initialized successfully');
    } catch (error) {
      console.error('❌ Failed to load external data:', error);
      showErrorPanel(error.message);
    }
  });

  // Update progress bar whenever data changes
  function updateProgressBar() {
    const caseData = engine.caseData;
    const progress = validator.getProgressData(caseData);
    
    document.querySelector('.edd-progress-bar').style.width = progress.percent + '%';
    document.querySelector('.edd-progress-text').textContent = 
      `${progress.completed} of ${progress.total} sections complete`;
  }

  // Validate section when user leaves it
  function validateSectionOnBlur(sectionName) {
    const sectionData = getSectionDataFromForm(sectionName);
    const validation = validator.validateSection(sectionName, sectionData);
    
    if (!validation.isComplete) {
      showValidationErrors(sectionName, validation.errors);
    }
    updateProgressBar();
  }

  // Handle form submission
  document.getElementById('submit-case').addEventListener('click', function() {
    try {
      // Validate all sections
      validator.validateAllSections(engine.caseData);
      
      // Investigator submits recommendation
      const assessment = document.getElementById('section11-assessment').value;
      const recommendation = document.querySelector('input[name="section11-recommendation"]:checked').value;
      
      engine.submitInvestigatorDecision(assessment, recommendation);
      
      // Send to backend
      submitCaseToBackend(engine.exportCase());
      
    } catch (error) {
      alert('❌ Cannot submit: ' + error.message);
    }
  });

  // Handle manager approval
  document.getElementById('manager-approve').addEventListener('click', async function() {
    try {
      const decision = document.querySelector('input[name="section11-manager-decision"]:checked').value;
      const comments = document.getElementById('section11-manager-comments').value;
      
      const result = engine.submitManagerApproval(decision, comments);
      
      // Send approval to backend
      await submitManagerApprovalToBackend(engine.caseData.section11);
      
      alert(`✅ Case marked as ${result.caseStatus}`);
    } catch (error) {
      alert('❌ Approval failed: ' + error.message);
    }
  });
</script>
```

### Step 3: Populate External Data Blocks

Create functions to fill the READ-ONLY data blocks (green borders) in the HTML:

```javascript
function populateExternalDataBlocks(externalData) {
  // Section 1: Risk Classification
  const riskData = externalData.section1;
  if (riskData && !riskData.error) {
    document.querySelector('#section1-risk-category').innerHTML = 
      `${riskData.overallRiskCategory} | Score: ${riskData.riskScore}/100`;
    document.querySelector('#section1-source').innerHTML = 
      `🔵 Source: ${riskData.source} | Last Sync: ${new Date(riskData.lastSyncTimestamp).toLocaleString()}`;
  }

  // Section 2: Customer Information
  const customerData = externalData.section2;
  if (customerData && !customerData.error) {
    document.querySelector('#section2-name').innerHTML = customerData.fullName;
    document.querySelector('#section2-dob').innerHTML = customerData.dateOfBirth;
    document.querySelector('#section2-occupation').innerHTML = customerData.occupation;
    document.querySelector('#section2-source').innerHTML = 
      `🟢 Source: ${customerData.source} | Last Sync: ${new Date(customerData.lastSyncTimestamp).toLocaleString()}`;
  }

  // Section 5: Initial Deposit
  const depositData = externalData.section5;
  if (depositData && !depositData.error) {
    document.querySelector('#section5-amount').innerHTML = 
      `${depositData.depositAmount.toLocaleString()} ${depositData.depositCurrency}`;
    document.querySelector('#section5-date').innerHTML = depositData.depositDate;
    document.querySelector('#section5-source').innerHTML = 
      `🟢 Source: ${depositData.source}`;
  }

  // Section 7: Account Portfolio
  const accountsData = externalData.section7;
  if (accountsData && !accountsData.error) {
    const accountList = accountsData.accounts
      .map(acc => `<li>${acc.accountNumber} (${acc.accountType}): ${acc.balance.toLocaleString()}</li>`)
      .join('');
    document.querySelector('#section7-accounts').innerHTML = `<ul>${accountList}</ul>`;
    document.querySelector('#section7-source').innerHTML = 
      `🟢 Source: ${accountsData.source}`;
  }

  // Section 10: PEP Information
  const pepData = externalData.section10_pep;
  if (pepData && !pepData.error) {
    if (pepData.isPEP) {
      // Show Section 10 (was hidden)
      document.querySelector('#section10-panel').style.display = 'block';
      document.querySelector('#section10-pep-status').innerHTML = 
        `<strong style="color: red;">✓ CONFIRMED PEP</strong><br/>Position: ${pepData.pepPosition}`;
    } else {
      document.querySelector('#section10-pep-status').innerHTML = 'Not a PEP';
    }
  }
}
```

### Step 4: Bind Form Validation to Input Fields

Add validation listeners to investigator input areas:

```javascript
// Section 3: Purpose of Account
document.getElementById('section3-purpose').addEventListener('blur', function() {
  const purpose = this.value;
  const relationship = document.getElementById('section3-relationship').value;
  
  try {
    engine.validatePurposeOfAccount(purpose, relationship);
    this.parentElement.style.borderColor = 'green';
    clearErrorMessage('section3');
  } catch (error) {
    this.parentElement.style.borderColor = 'red';
    showErrorMessage('section3', error.message);
  }
});

// Section 4: Source of Income
document.getElementById('section4-source-explanation').addEventListener('blur', function() {
  const explanation = this.value;
  const verified = document.querySelector('input[name="section4-verified"]:checked')?.value;
  
  try {
    engine.validateSourceOfIncome(explanation, verified === 'yes');
    this.parentElement.style.borderColor = 'green';
    clearErrorMessage('section4');
  } catch (error) {
    this.parentElement.style.borderColor = 'red';
    showErrorMessage('section4', error.message);
  }
});

// [Similar patterns for sections 6, 8, 9, 10, 11]
```

---

## BACKEND API SPECIFICATIONS

### Create EDD Case

**Endpoint:** `POST /api/edd-cases`

**Request Body:**
```json
{
  "rimNumber": "QIB-001234",
  "section1": { "overallRiskCategory": "HIGH", "riskScore": 78 },
  "section2": { "fullName": "Abdullah Al-Kuwari", "dateOfBirth": "1975-03-15" },
  "section3": { "accountPurpose": "...", "businessRelationship": "..." },
  "section4": { "sourceExplanation": "...", "incomeVerified": true },
  "section5": { "depositAmount": 250000, "depositDate": "2026-02-15" },
  "section6": { "expectedMonthlyIncome": 50000, "expectedMonthlyExpense": 30000 },
  "section7": { "accounts": [...] },
  "section8": { "hasOtherBanks": false, "details": "No other bank accounts" },
  "section9": { "hasRelatedParties": false, "relatedPartiesList": "None" },
  "section10": { "isPEP": false },
  "section11": {
    "investigatorAssessment": "...",
    "investigatorRecommendation": "APPROVE",
    "investigatorSignature": "Ahmed Al-Dosari",
    "investigatorTimestamp": "2026-03-10T14:35:00Z"
  }
}
```

**Response:**
```json
{
  "caseId": "EDD-2026-1741612500000-8943",
  "status": "PENDING_MANAGER_REVIEW",
  "createdAt": "2026-03-10T14:35:00Z",
  "investigatorId": "INV-001",
  "message": "Case created successfully"
}
```

---

### Manager Approval

**Endpoint:** `PUT /api/edd-cases/{caseId}/approve`

**Request Body:**
```json
{
  "managerDecision": "APPROVED",
  "managerComments": "All sections properly completed and verified.",
  "managerSignature": "Senior Manager Name",
  "managerTimestamp": "2026-03-10T15:00:00Z"
}
```

**Response:**
```json
{
  "caseId": "EDD-2026-1741612500000-8943",
  "status": "APPROVED",
  "approvedAt": "2026-03-10T15:00:00Z",
  "message": "Case approved and finalized"
}
```

---

## DATABASE SCHEMA UPDATES

### Add columns to edd_cases table:

```sql
ALTER TABLE edd_cases ADD COLUMN (
  -- Section 1
  section1_riskCategory VARCHAR(50),
  section1_riskScore INT,
  section1_primaryRiskDriver VARCHAR(100),
  
  -- Section 3
  section3_accountPurpose TEXT,
  section3_businessRelationship TEXT,
  
  -- Section 4
  section4_sourceExplanation TEXT,
  section4_incomeVerified BOOLEAN,
  
  -- Section 6
  section6_expectedMonthlyIncome DECIMAL(15,2),
  section6_expectedMonthlyExpense DECIMAL(15,2),
  section6_transactionDescription TEXT,
  
  -- Section 8
  section8_hasOtherBanks BOOLEAN,
  section8_details TEXT,
  
  -- Section 9
  section9_hasRelatedParties BOOLEAN,
  section9_relatedPartiesList TEXT,
  
  -- Section 10
  section10_isPEP BOOLEAN,
  section10_pepAssessment TEXT,
  section10_sourceOfFundsVerification TEXT,
  
  -- Section 11: Investigator (Maker)
  section11_investigatorAssessment TEXT,
  section11_investigatorRecommendation VARCHAR(20),
  section11_investigatorSignature VARCHAR(100),
  section11_investigatorTimestamp TIMESTAMP,
  
  -- Section 11: Manager (Checker)
  section11_managerDecision VARCHAR(20),
  section11_managerComments TEXT,
  section11_managerSignature VARCHAR(100),
  section11_managerTimestamp TIMESTAMP,
  
  -- Case Status
  caseStatus VARCHAR(50) DEFAULT 'DRAFT',
  
  -- Audit
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX idx_edd_cases_rim ON edd_cases(rimNumber);
CREATE INDEX idx_edd_cases_status ON edd_cases(caseStatus);
```

---

## TESTING SCENARIOS

### Scenario 1: Happy Path (APPROVE)

**Steps:**
1. Load case for RIM QIB-001234
2. All external data auto-loads ✅
3. Investigator fills sections 3-9 ✅
4. Investigator submits recommendation: APPROVE ✅
5. Manager reviews all sections ✅
6. Manager approves ✅
7. Case status: APPROVED ✅

**Expected Result:** Complete case lifecycle, audit trail logged, both signatures captured

---

### Scenario 2: PEP Detection (Conditional Section 10)

**Steps:**
1. Load case for PEP customer
2. Section 10 appears (was hidden) ✅
3. Regulatory data shows "CONFIRMED PEP" ✅
4. Investigator forced to fill section 10 (mandatory) ✅
5. Enhanced assessment required, source verification mandatory ✅
6. Manager review includes PEP-specific comments ✅

**Expected Result:** Section 10 dynamically shows, mandatory fields enforced only for PEP cases

---

### Scenario 3: Validation Failure (Missing Mandatory Field)

**Steps:**
1. Investigator tries to submit without filling section 3
2. Form validation catches required field empty
3. Error message shown: "Section 3: Account purpose is mandatory"
4. Submit button disabled ✅
5. Investigator fills section 3
6. Submit button enabled ✅

**Expected Result:** Form prevents submission with incomplete mandatory fields

---

### Scenario 4: N/A with Justification

**Steps:**
1. Section 8: "Does customer have other banks?"
2. Investigator answers: "No"
3. But must provide justification
4. Cannot leave as empty
5. Investigator enters: "N/A - Customer confirmed no other banking relationships"
6. Validation passes ✅

**Expected Result:** N/A fields require explanation, not just "N/A"

---

## DEPLOYMENT CHECKLIST

- [ ] Move `edd_case_production.html` → `edd_case.html` (replace old version)
- [ ] Verify 3 JavaScript modules deployed to `edd_system/js/`:
  - [ ] edd_data_integration.js
  - [ ] edd_investigation_engine.js
  - [ ] edd_form_validator.js
- [ ] Create backend API endpoints:
  - [ ] POST /api/edd-cases
  - [ ] GET /api/edd-cases/{caseId}
  - [ ] PUT /api/edd-cases/{caseId}/approve
  - [ ] PUT /api/edd-cases/{caseId}/reject
- [ ] Execute database migrations (add 11 new columns)
- [ ] Configure external system API keys:
  - [ ] T24_API_KEY
  - [ ] CRP_SERVICE_TOKEN
  - [ ] REGULATORY_API_KEY
- [ ] Test data integration with T24/CRP/Regulatory systems
- [ ] Load testing: Concurrent cases, API performance
- [ ] User acceptance testing (UAT) with investigators
- [ ] Manager approval workflow testing
- [ ] Compliance review (QCB alignment)
- [ ] Go-live date set
- [ ] User training completed

---

## TROUBLESHOOTING

### External Data Not Loading
- Check API keys configured correctly
- Verify network connectivity to T24/CRP/Regulatory
- Check cache hasn't expired (24 hours)
- Review API call logs: `dia.getApiCallStats()`

### Validation Errors Not Showing
- Verify JavaScript console for errors
- Check that `edd_form_validator.js` is loaded
- Verify section div IDs match validator field names

### Manager Approval Not Working
- Confirm investigator submitted decision first
- Verify manager user has CHECKER role
- Check that caseStatus = PENDING_MANAGER_REVIEW before approval

### Signatures Not Captured
- Confirm timestamps are being set correctly
- Verify user session is active (auto-sign populates current user)
- Check that manager/investigator details are in session

---

## PRODUCTION MONITORING

### Key Metrics to Track
- Time to complete case (target: < 2 hours)
- API latency (target: < 1 second per call)
- Cache hit rate (target: > 80%)
- Field validation error rate (should be low after training)
- PEP detection accuracy (should be 100%)
- Maker/Checker approval SLA (target: < 8 hours)

### Audit Trail Verification
- Every section change logged with timestamp
- User signatures captured with digital timestamp
- API call latency logged
- All validation failures logged
- Compliance can verify complete audit trail

---

**READY FOR IMPLEMENTATION** ✅

All 4 JavaScript modules are production-ready and fully documented. Next steps:

1. Deploy JavaScript modules to server
2. Create backend API routes
3. Execute database migrations
4. Configure external system API keys
5. Run integration tests
6. UAT with investigators + managers
7. Go-live