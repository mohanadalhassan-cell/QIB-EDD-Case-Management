# EDD FORM - COMPLETE DATA MAPPING & FIELD SPECIFICATIONS

## Document Purpose

This document maps every field in the EDD Form to source systems (T24, CRP, ETL) and specifies data types, validation rules, and UI requirements for developers.

---

# SECTION 1: CUSTOMER IDENTIFICATION

## 1.1 Customer Name

| Property | Value |
|----------|-------|
| **Form Label** | Customer Name |
| **Data Type** | VARCHAR(100) |
| **Required** | YES - Always |
| **Source System** | T24 (CUST_NAME) |
| **API Endpoint** | GET /api/v1/customers/{rim}/details |
| **Validation** | Non-numeric, min 3 chars, max 100 chars |
| **Display** | Read-only (from T24) |
| **Localization** | English + Arabic (CUST_NAME_AR) |
| **Sample** | Abdullah Mohammed Al-Kuwari |
| **UI Component** | Text Input (Read-only) |

---

## 1.2 RIM Number

| Property | Value |
|----------|-------|
| **Form Label** | RIM (Relationship ID Master) |
| **Data Type** | VARCHAR(20) |
| **Required** | YES - Always |
| **Source System** | T24 (RM_NUMBER) |
| **API Endpoint** | GET /api/v1/customers/{rim} |
| **Validation** | Alphanumeric, format: RIM[0-9]{6} |
| **Display** | Read-only (from T24) |
| **Uniqueness** | Unique across entire bank |
| **Sample** | RIM001234 |
| **UI Component** | Text Input (Read-only) |
| **Database Table** | CUSTOMERS.RM_NUMBER (PRIMARY KEY) |

---

## 1.3 Account Number

| Property | Value |
|----------|-------|
| **Form Label** | Account Number |
| **Data Type** | VARCHAR(20) |
| **Required** | Conditional (if specific account trigger) |
| **Source System** | T24 (ACCOUNT_NUMBER) |
| **API Endpoint** | GET /api/v1/accounts/{rim} |
| **Validation** | Format: [0-9]{3}-[0-9]{6}-[0-9]{3} |
| **Display** | Read-only (from T24) |
| **Sample** | 001-123456-001 |
| **UI Component** | Text Input (Read-only) / Dropdown (if multiple) |
| **Database Table** | ACCOUNTS.ACCOUNT_NUMBER |

---

## 1.4 Customer Segment

| Property | Value |
|----------|-------|
| **Form Label** | Customer Segment |
| **Data Type** | ENUM |
| **Required** | YES - Always |
| **Source System** | T24 (CUST_SEGMENT) |
| **Valid Values** | Mass, Tamayuz, Private |
| **Display** | Read-only (from T24) |
| **Business Logic** | Determines case routing and dashboard |
| **Sample** | Private Banking |
| **UI Component** | Dropdown (Read-only) |
| **Database Table** | CUSTOMERS.SEGMENT |

---

## 1.5 Date of Birth

| Property | Value |
|----------|-------|
| **Form Label** | Date of Birth |
| **Data Type** | DATE (YYYY-MM-DD) |
| **Required** | YES - Always |
| **Source System** | T24 (DOB) |
| **API Endpoint** | GET /api/v1/customers/{rim}/kyc |
| **Validation** | Must be 18+ years old, realistic date |
| **Display** | Read-only (from T24) |
| **Sample** | 1975-03-15 |
| **UI Component** | Date Picker (Read-only) |
| **Database Table** | CUSTOMERS.DATE_OF_BIRTH |

---

## 1.6 Nationality

| Property | Value |
|----------|-------|
| **Form Label** | Nationality |
| **Data Type** | VARCHAR(100) / Country Code (ISO-3166) |
| **Required** | YES - Always |
| **Source System** | T24 (NATIONALITY) |
| **API Endpoint** | GET /api/v1/customers/{rim}/kyc |
| **Valid Values** | Reference table: NATIONALITIES |
| **Validation** | Must be valid country code |
| **Risk Indicator** | YES (high-risk if sanctioned country) |
| **Display** | Read-only (from T24) |
| **Sample** | Qatar (QA) |
| **UI Component** | Dropdown (Read-only) |
| **Database Table** | CUSTOMERS.NATIONALITY |

---

# SECTION 2: RISK CLASSIFICATION REASONS

## 2.1 PEP Status

| Property | Value |
|----------|-------|
| **Form Label** | Politically Exposed Person (PEP) Status |
| **Data Type** | BOOLEAN / ENUM |
| **Required** | YES - Always |
| **Source System** | CRP (CUSTOMER_RISK_PROFILE.PEP_FLAG) |
| **Valid Values** | Yes / No / PEP / Relative of PEP / Former PEP |
| **Validation** | Against sanctions database |
| **Risk Weight** | HIGH (if Yes/PEP/Relative) |
| **Sample** | Yes |
| **UI Component** | Radio Button / Dropdown |
| **Database Table** | RISK_INDICATORS.PEP_FLAG |
| **Decision Logic** | If PEP = Yes → Always HIGH RISK |

---

## 2.2 High-Risk Occupation

| Property | Value |
|----------|-------|
| **Form Label** | Occupation / Business Type |
| **Data Type** | VARCHAR(100) |
| **Required** | YES - Conditional (if occupied) |
| **Source System** | T24 (OCCUPATION) + CRP (OCCP_RISK_CATEG) |
| **Valid Values** | Reference table: OCCUPATIONS |
| **High-Risk Occupations** | Jewelry dealer, Precious metals, Attorney, Accountant, Money changer, etc. |
| **Risk Score** | OCCP_RISK_SCORE (0-100) |
| **Risk Category** | OCCP_RISK_CATEG (Low/Medium/High) |
| **Sample** | Business Owner |
| **UI Component** | Dropdown |
| **Database Table** | CUSTOMERS.OCCUPATION |

---

## 2.3 High-Risk Products

| Property | Value |
|----------|-------|
| **Form Label** | Products Held |
| **Data Type** | ARRAY[VARCHAR] |
| **Required** | YES - Always |
| **Source System** | T24 (PRODUCT_CODE) + CRP (PROD_RISK_CATEG) |
| **Valid Values** | Savings, Current, Business, MISK, Investment, Forex, etc. |
| **Risk Categories** | PROD_RISK_SCORE, PROD_RISK_CATEG |
| **Sample** | [Current Account, Business Account, Investment] |
| **UI Component** | Multi-Select Dropdown |
| **Database Table** | CUSTOMER_PRODUCTS.PRODUCT_CODE |

---

## 2.4 AML Indicators

| Property | Value |
|----------|-------|
| **Form Label** | AML/CFT Indicators |
| **Data Type** | ARRAY[VARCHAR] |
| **Required** | YES - Always |
| **Source System** | ETL (ALERTS), CRP (AML_INDICATORS) |
| **Possible Values** | Cash deposit > threshold, Structuring detected, Wire to high-risk country, Sanctions match, etc. |
| **Sample** | ["Large Cash Deposit", "Structuring Pattern", "High-Risk Country Wire"] |
| **UI Component** | Checkbox List |
| **Database Table** | CASE_RISK_INDICATORS.AML_INDICATOR |

---

## 2.5 Non-Resident Status

| Property | Value |
|----------|-------|
| **Form Label** | Non-Resident Status |
| **Data Type** | BOOLEAN |
| **Required** | YES - Always |
| **Source System** | T24 (RESIDENT_FLAG) |
| **Valid Values** | Resident / Non-Resident |
| **Risk Weight** | MEDIUM (if Non-Resident) |
| **Sample** | No (Resident) |
| **UI Component** | Radio Button |
| **Database Table** | CUSTOMERS.RESIDENT_FLAG |

---

# SECTION 3: FINANCIAL ANALYSIS

## 3.1 Declared Monthly Income

| Property | Value |
|----------|-------|
| **Form Label** | Declared Monthly Income |
| **Data Type** | DECIMAL(15,2) |
| **Currency** | QAR |
| **Required** | YES - Conditional (employed customers) |
| **Source System** | T24 (DECLARED_INCOME) |
| **API Endpoint** | GET /api/v1/customers/{rim}/financial |
| **Validation** | > 0, max 1,000,000 QAR |
| **Sample** | 450,000.00 |
| **UI Component** | Number Input (Read-only) |
| **Database Table** | FINANCIAL_PROFILE.DECLARED_INCOME |
| **Business Logic** | Compare with transaction activity (LAST_SAL_AMT) |

---

## 3.2 Last Salary Amount (LAST_SAL_AMT)

| Property | Value |
|----------|-------|
| **Form Label** | Last Salary Received |
| **Data Type** | DECIMAL(15,2) |
| **Currency** | QAR |
| **Required** | YES - Conditional |
| **Source System** | T24 / ETL (Salary inflows analysis) |
| **API Endpoint** | GET /api/v1/customers/{rim}/transactions |
| **Sample** | 450,000.00 |
| **UI Component** | Number Input (Read-only) |
| **Database Table** | FINANCIAL_PROFILE.LAST_SAL_AMT |
| **Validation Rules** | Should match declared income or be close |

---

## 3.3 Average Salary (3 months)

| Property | Value |
|----------|-------|
| **Form Label** | Average Monthly Salary (Last 3 Months) |
| **Data Type** | DECIMAL(15,2) |
| **Currency** | QAR |
| **Required** | YES - Conditional |
| **Source System** | ETL (Transaction Analysis) |
| **API Endpoint** | GET /api/v1/customers/{rim}/analytics/salary |
| **Calculation** | SUM(Salary deposits last 3 months) / 3 |
| **Sample** | 450,000.00 |
| **UI Component** | Number Input (Auto-calculated, Read-only) |
| **Database Table** | FINANCIAL_PROFILE.AVG_SAL_3M |

---

## 3.4 Last Salary Date

| Property | Value |
|----------|-------|
| **Form Label** | Last Salary Deposit Date |
| **Data Type** | DATE (YYYY-MM-DD) |
| **Required** | YES - Conditional |
| **Source System** | T24 / ETL (Transaction records) |
| **API Endpoint** | GET /api/v1/customers/{rim}/transactions |
| **Sample** | 2026-03-05 |
| **UI Component** | Date Picker (Read-only) |
| **Database Table** | FINANCIAL_PROFILE.LAST_SAL_DATE |

---

## 3.5 Source of Funds Explanation

| Property | Value |
|----------|-------|
| **Form Label** | Source of Funds Explanation |
| **Data Type** | TEXT (VAR CHAR(1000)) |
| **Required** | YES - If flags detected |
| **Editable** | YES - Business Maker |
| **Validation** | Min 50 chars, max 1000 chars |
| **Sample** | Salary from QIB employment, periodic investments |
| **UI Component** | Text Area |
| **Database Table** | CASE_ANALYSIS.SOURCE_OF_FUNDS_NOTES |
| **Business Logic** | Verify against transaction patterns |

---

# SECTION 4: JOINT ACCOUNTS & EXPOSURES

## 4.1 Joint Account Total

| Property | Value |
|----------|-------|
| **Form Label** | Total Joint Account Exposure |
| **Data Type** | DECIMAL(15,2) |
| **Currency** | QAR |
| **Required** | YES - If joint accounts exist |
| **Source System** | T24 (JOINT_ACCOUNTS view) |
| **API Endpoint** | GET /api/v1/customers/{rim}/joint-accounts |
| **Sample** | 1,785,000.00 |
| **UI Component** | Currency Input (Read-only) |
| **Database Table** | CASE_ANALYSIS.JOINT_ACCOUNT_TOTAL |

---

## 4.2 Joint Holders Details

| Property | Value |
|----------|-------|
| **Form Label** | Joint Account Holders |
| **Data Type** | ARRAY[OBJECT] |
| **Required** | YES - If joint accounts exist |
| **Source System** | T24 (ACCOUNT_OWNERS) |
| **API Endpoint** | GET /api/v1/accounts/{accountId}/owners |
| **Fields Per Record** | Name, RIM, Ownership %, Role |
| **Sample** | [{"name": "Mariam Hassan Al-Thani", "rim": "RIM005678", "ownership": 40}] |
| **UI Component** | Table (Read-only) |
| **Database Table** | JOINT_ACCOUNT_HOLDERS |

---

## 4.3 Total Transaction Inflow (6 months)

| Property | Value |
|----------|-------|
| **Form Label** | Total Inflow (Last 6 Months) |
| **Data Type** | DECIMAL(15,2) |
| **Currency** | QAR |
| **Required** | YES - Always |
| **Source System** | ETL / TM (Transaction Monitoring) |
| **API Endpoint** | GET /api/v1/customers/{rim}/analytics/inflow |
| **Sample** | 8,050,000.00 |
| **UI Component** | Currency Input (Auto-populated) |
| **Database Table** | TRANSACTION_ANALYSIS.TOTAL_INFLOW_6M |

---

## 4.4 Total Transaction Outflow (6 months)

| Property | Value |
|----------|-------|
| **Form Label** | Total Outflow (Last 6 Months) |
| **Data Type** | DECIMAL(15,2) |
| **Currency** | QAR |
| **Required** | YES - Always |
| **Source System** | ETL / TM (Transaction Monitoring) |
| **API Endpoint** | GET /api/v1/customers/{rim}/analytics/outflow |
| **Sample** | 4,220,000.00 |
| **UI Component** | Currency Input (Auto-populated) |
| **Database Table** | TRANSACTION_ANALYSIS.TOTAL_OUTFLOW_6M |

---

# SECTION 5: REQUIRED DOCUMENTS

## 5.1 Salary Certificate

| Property | Value |
|----------|-------|
| **Form Label** | Salary Certificate |
| **Type** | Document Upload |
| **Required** | YES - If employed |
| **Accepted Formats** | PDF, JPG, PNG |
| **Max Size** | 10 MB |
| **Source** | Customer uploaded or HR system |
| **Validation** | Non-expired, matches declared income |
| **Storage** | DMS (FileNet) |
| **Approval** | CDD Maker signs off |
| **UI Component** | File Upload with Preview |
| **Database Table** | CASE_DOCUMENTS.DOCUMENT_TYPE = 'SALARY_CERT' |

---

## 5.2 Rental Agreement / Proof of Residence

| Property | Value |
|----------|-------|
| **Form Label** | Rental Agreement / Proof of Residence |
| **Type** | Document Upload |
| **Required** | YES - Always |
| **Accepted Formats** | PDF, JPG, PNG |
| **Max Size** | 10 MB |
| **Source** | Customer uploaded |
| **Validation** | Non-expired, matches address in T24 |
| **Storage** | DMS (FileNet) |
| **Approval** | CDD Maker signs off |
| **UI Component** | File Upload with Preview |
| **Database Table** | CASE_DOCUMENTS.DOCUMENT_TYPE = 'RENTAL_AGREE' |

---

## 5.3 Source of Funds Documentation

| Property | Value |
|----------|-------|
| **Form Label** | Source of Funds Documentation |
| **Type** | Multiple Documents |
| **Required** | YES - If high risk |
| **Examples** | Investment statements, business documents, property papers |
| **Accepted Formats** | PDF, JPG, PNG |
| **Max Size** | 10 MB each |
| **Source** | Customer uploaded |
| **Storage** | DMS (FileNet) |
| **Approval** | CDD Maker + Compliance Officer |
| **UI Component** | Multi-File Upload |
| **Database Table** | CASE_DOCUMENTS.DOCUMENT_TYPE = 'SOURCE_OF_FUNDS' |

---

## 5.4 ID/Passport Update

| Property | Value |
|----------|-------|
| **Form Label** | ID/Passport Update |
| **Type** | Document Upload |
| **Required** | Conditional (if ID expired or updates needed) |
| **Accepted Formats** | PDF, JPG, PNG |
| **Max Size** | 10 MB |
| **Source** | Customer uploaded |
| **Validation** | Must be current/valid ID, clear images |
| **Storage** | DMS (FileNet) |
| **Approval** | CDD Maker signs off |
| **UI Component** | File Upload with Preview |
| **Database Table** | CASE_DOCUMENTS.DOCUMENT_TYPE = 'ID_UPDATE' |

---

## 5.5 Selfie Verification

| Property | Value |
|----------|-------|
| **Form Label** | Selfie Verification / Liveness Detection |
| **Type** | Media Upload + Biometric Analysis |
| **Required** | Conditional (if high-risk or online onboarding) |
| **Accepted Formats** | JPG, PNG, MP4 (video) |
| **Max Size** | 20 MB |
| **Validation** | Liveness detection engine must pass |
| **Storage** | DMS (FileNet) + Encryption |
| **Technology** | Facematch, Liveness SDK |
| **Approval** | Automated + Manual review |
| **UI Component** | Camera/File Upload with Liveness Prompt |
| **Database Table** | BIOMETRIC_VERIFICATIONS |

---

# SECTION 6: REVIEW & APPROVALS

## 6.1 Business Maker Review

| Property | Value |
|----------|-------|
| **Form Label** | Business Maker Analysis & Recommendation |
| **Type** | Approval Stage |
| **Required** | YES - Always |
| **Role** | Business Maker (RM, Relationship Manager) |
| **Actions** | Review, Comment, Save as Draft, Submit |
| **Comments Field** | TEXT (max 500 chars) |
| **Recommendation** | Accept / Recommend Restriction / Recommend Freeze |
| **Approval Status** | Draft / Submitted / Returned |
| **Timestamp** | Auto-recorded |
| **Database Table** | CASE_APPROVALS (stage='BUSINESS_MAKER') |

---

## 6.2 Business Checker Review

| Property | Value |
|----------|-------|
| **Form Label** | Business Checker Approval |
| **Type** | Approval Stage |
| **Required** | YES - Always |
| **Role** | Business Checker / Supervisor |
| **Actions** | Review, Comment, Approve, Return for Revision |
| **Comments Field** | TEXT (max 500 chars) |
| **Approval Status** | Approved / Rejected / Returned |
| **Timestamp** | Auto-recorded |
| **SLA** | Per bank policy (e.g., 5 business days) |
| **Database Table** | CASE_APPROVALS (stage='BUSINESS_CHECKER') |

---

## 6.3 CDD Maker Review

| Property | Value |
|----------|-------|
| **Form Label** | CDD Maker Document Review |
| **Type** | Approval Stage |
| **Required** | YES - Always |
| **Role** | CDD Maker (Document specialist) |
| **Actions** | Request Additional Docs, Review, Save, Submit |
| **Comments Field** | TEXT (max 500 chars) |
| **Document Checks** | Completeness, Authenticity, Clarity |
| **Approval Status** | In Review / Docs Requested / Submitted |
| **Timestamp** | Auto-recorded |
| **Database Table** | CASE_APPROVALS (stage='CDD_MAKER') |

---

## 6.4 CDD Checker Review

| Property | Value |
|----------|-------|
| **Form Label** | CDD Checker Final Approval |
| **Type** | Approval Stage |
| **Required** | YES - Always |
| **Role** | CDD Checker / Head of CDD |
| **Actions** | Approve, Reject, Escalate to Compliance |
| **Comments Field** | TEXT (max 500 chars) |
| **Decision** | Case Closed / Restrictions Applied / Escalate |
| **Approval Status** | Approved / Escalated |
| **Timestamp** | Auto-recorded |
| **SLA** | Per bank policy |
| **Database Table** | CASE_APPROVALS (stage='CDD_CHECKER') |

---

## 6.5 Compliance Officer Review

| Property | Value |
|----------|-------|
| **Form Label** | Compliance Officer - Risk Assessment |
| **Type** | Approval Stage (Escalation) |
| **Required** | YES - If escalated |
| **Role** | Compliance Officer (L1) |
| **Actions** | Review Risk, Request Additional Analysis, Provide Opinion |
| **Comments Field** | TEXT (max 500 chars) |
| **Risk Opinion** | Accept / Restrict / Deny |
| **Approval Status** | In Review / Opinion Submitted |
| **Timestamp** | Auto-recorded |
| **Database Table** | CASE_APPROVALS (stage='COMPLIANCE_OFFICER') |

---

## 6.6 Compliance Checker Approval

| Property | Value |
|----------|-------|
| **Form Label** | Compliance Checker - Final Compliance Decision |
| **Type** | Approval Stage (Escalation) |
| **Required** | YES - If escalated |
| **Role** | Compliance Checker (L2) |
| **Actions** | Approve Compliance Opinion, Request Revision, Escalate |
| **Comments Field** | TEXT (max 500 chars) |
| **Final Decision** | Case Approved / Case Denied / Account Restricted |
| **Approval Status** | Approved / Returned |
| **Timestamp** | Auto-recorded |
| **Database Table** | CASE_APPROVALS (stage='COMPLIANCE_CHECKER') |

---

# SECTION 7: DIGITAL SIGNATURES & AUDIT

## 7.1 Signature Fields

| Signature | Role | Timestamp | Audit Entry |
|-----------|------|-----------|-------------|
| **Business Maker** | RM / Relationship Manager | Auto | Logged |
| **Business Checker** | Supervisor / Department Head | Auto | Logged |
| **CDD Maker** | Document Specialist | Auto | Logged |
| **CDD Checker** | Head of CDD / Manager | Auto | Logged |
| **Compliance Officer** | Compliance Officer (if escalated) | Auto | Logged |
| **Compliance Checker** | Compliance Checker (if escalated) | Auto | Logged |

## 7.2 Audit Trail Recording

| Field | Value |
|--------|-------|
| **User Name** | System user name |
| **Employee ID** | Unique identifier |
| **Department** | Department code |
| **Action** | Create / Update / Approve / Reject / Escalate |
| **Timestamp** | ISO 8601 format |
| **IP Address** | User's IP |
| **Reason** | Action reason text |
| **Previous Value** | Before change |
| **New Value** | After change |
| **Status Change** | From → To |

---

# FIELD SOURCE SYSTEM MAPPING TABLE

## Complete Mapping Matrix

| Field Name | Data Type | T24 | CRP | ETL | DMS | Mandatory | Editable | Notes |
|-----------|-----------|-----|-----|-----|-----|-----------|----------|-------|
| Customer Name | VARCHAR | ✓ | | | | YES | NO | CUST_NAME |
| RIM Number | VARCHAR | ✓ | ✓ | | | YES | NO | RM_NUMBER |
| Account Number | VARCHAR | ✓ | | | | YES | NO | ACCOUNT_ID |
| Segment | ENUM | ✓ | ✓ | | | YES | NO | CUST_SEGMENT |
| DOB | DATE | ✓ | | | | YES | NO | |
| Nationality | VARCHAR | ✓ | ✓ | | | YES | NO | NATIONALITY |
| PEP Status | BOOLEAN | | ✓ | | | YES | NO | PEP_FLAG |
| Occupation | VARCHAR | ✓ | ✓ | | | CONDITIONAL | NO | |
| Products | ARRAY | ✓ | ✓ | | | YES | NO | |
| AML Indicators | ARRAY | | | ✓ | | YES | NO | |
| Non-Resident | BOOLEAN | ✓ | | | | YES | NO | |
| Declared Income | DECIMAL | ✓ | | | | CONDITIONAL | NO | |
| Last Salary | DECIMAL | ✓ | | ✓ | | CONDITIONAL | NO | |
| Avg Salary 3M | DECIMAL | | | ✓ | | CONDITIONAL | NO | |
| Last Salary Date | DATE | | | ✓ | | CONDITIONAL | NO | |
| Source of Funds | TEXT | | | | | YES | **YES** | Editable by Business |
| Joint Accounts | ARRAY | ✓ | | | | CONDITIONAL | NO | |
| Total Inflow 6M | DECIMAL | | | ✓ | | YES | NO | |
| Total Outflow 6M | DECIMAL | | | ✓ | | YES | NO | |
| Salary Certificate | FILE | | | | ✓ | CONDITIONAL | YES | Upload to DMS |
| Residence Proof | FILE | | | | ✓ | YES | YES | Upload to DMS |
| Source of Funds Doc | FILE | | | | ✓ | CONDITIONAL | YES | Upload to DMS |
| ID/Passport | FILE | | | | ✓ | CONDITIONAL | YES | Upload to DMS |
| Selfie | FILE | | | | ✓ | CONDITIONAL | YES | Upload + Liveness |

---

# API ENDPOINTS FOR FORM DATA POPULATION

## RESTful API Endpoints (For Front-end to Call)

```javascript
// Get Customer Profile
GET /api/v1/customers/{rim}
Response: {
  name: "Abdullah Mohammed Al-Kuwari",
  rim: "RIM001234",
  dob: "1975-03-15",
  nationality: "QA",
  segment: "Private Banking",
  accounts: [...]
}

// Get Risk Profile
GET /api/v1/customers/{rim}/risk-profile
Response: {
  pep_flag: true,
  pep_type: "PEP",
  occupation: "Business Owner",
  occupation_risk: "MEDIUM",
  aml_indicators: ["Large Cash Deposit", "Structuring"],
  final_risk_score: 370,
  final_risk_categ: "AUTO HIGH"
}

// Get Financial Data
GET /api/v1/customers/{rim}/financial
Response: {
  declared_income: 450000,
  last_salary_amt: 450000,
  last_salary_date: "2026-03-05",
  avg_salary_3m: 450000,
  total_inflow_6m: 8050000,
  total_outflow_6m: 4220000
}

// Get Joint Accounts
GET /api/v1/customers/{rim}/joint-accounts
Response: [{
  account_number: "001-123456-001",
  account_type: "Savings",
  balance: 500000,
  holders: [
    {name: "Abdullah Mohammed Al-Kuwari", rim: "RIM001234", ownership: 60},
    {name: "Mariam Hassan Al-Thani", rim: "RIM005678", ownership: 40}
  ]
}]

// File Upload
POST /api/v1/documents/upload
Body: FormData (multipart/form-data)
Response: {
  document_id: "DOC-001",
  case_id: "EDD-2024-001234",
  document_type: "SALARY_CERT",
  status: "UPLOADED"
}

// Submit Form for Approval
POST /api/v1/cases/{caseId}/submit
Body: {
  stage: "BUSINESS_MAKER",
  comment: "...",
  recommendation: "ACCEPT"
}
Response: {
  case_id: "EDD-2024-001234",
  status: "SUBMITTED_TO_CHECKER",
  timestamp: "2026-03-09T10:30:45Z"
}
```

---

# FORM VALIDATION RULES

## Client-Side Validation (Front-end)

```javascript
VALIDATION_RULES = {
  customer_name: {
    required: true,
    pattern: /^[a-zA-Z\s]{3,100}$/,
    message: "Name must be 3-100 characters"
  },
  rim_number: {
    required: true,
    pattern: /^RIM[0-9]{6}$/,
    message: "Invalid RIM format"
  },
  declared_income: {
    required: true,
    type: "decimal",
    min: 0,
    max: 1000000,
    message: "Income must be between 0-1,000,000 QAR"
  },
  salary_certificate: {
    required_if: "employment",
    fileType: ["pdf", "jpg", "png"],
    maxSize: 10485760, // 10 MB
    message: "PDF/JPG/PNG max 10MB"
  },
  source_of_funds: {
    required_if: "high_risk",
    minLength: 50,
    maxLength: 1000,
    message: "Must be 50-1000 characters"
  }
}
```

## Server-Side Validation (Back-end)

```
All client-side validations PLUS:
- Data type verification
- Range/Length verification  
- Business logic validation
- Cross-field validation
- Database integrity checks
- Duplicate checks
```

---

# FORM LAYOUT & UI COMPONENTS

## Responsive Design Requirements

| Screen Size | Layout | Components |
|-----------|--------|-----------|
| **Desktop (≥1200px)** | 2-column form | Text inputs, dropdowns, file uploads |
| **Tablet (768-1199px)** | 1-column form | Stack inputs vertically |
| **Mobile (<768px)** | Full-width form | Large touch targets, single column |

---

# SECURITY & COMPLIANCE

## Field-Level Security

| Aspect | Requirement |
|--------|------------|
| **Encryption** | AES-256 for sensitive fields at rest |
| **TLS/HTTPS** | All data in transit encrypted |
| **Access Control** | Role-based access (Maker-Checker) |
| **Audit Logging** | Every read/write logged with timestamp |
| **Data Retention** | 7 years (per QCB requirements) |
| **PII Masking** | Mask RIM, Account numbers in audit logs (partial) |

---

# FORM SUBMISSION WORKFLOW

```
┌────────────────────────────┐
│  Customer Data Displayed   │
│  (Read-only from systems)  │
└──────────┬─────────────────┘
           │
           ▼
┌────────────────────────────┐
│  Business Maker Reviews    │
│  - Edits comments          │
│  - Provides recommendation │
│  - Saves as DRAFT          │
└──────────┬─────────────────┘
           │
           ▼
┌────────────────────────────┐
│  Business Maker Submits    │
│  Status: SUBMITTED         │
└──────────┬─────────────────┘
           │
           ▼
┌────────────────────────────┐
│  Business Checker Reviews  │
│  - Approves or Returns     │
│  Status: APPROVED/RETURNED │
└──────────┬─────────────────┘
           │
           ▼
┌────────────────────────────┐
│  CDD Maker Requests Docs   │
│  Customer Uploads Files    │
│  Status: DOCS_REQUESTED    │
└──────────┬─────────────────┘
           │
           ▼
┌────────────────────────────┐
│  CDD Checker Reviews       │
│  - Approves or Escalates   │
│  Status: APPROVED/ESCALATED│
└──────────┬─────────────────┘
           │
           ├─── Approved ──→ Case Closed
           │
           └─── Escalated ──→ Compliance Review
                              Status: IN COMPLIANCE_REVIEW
```

---

# IMPLEMENTATION NOTES FOR DEVELOPERS

## Key Points

1. **All read-only fields** come from T24/CRP/ETL - Do NOT allow manual editing
2. **Editable fields** (e.g., source_of_funds) should be clearly marked
3. **File uploads** must go to DMS (FileNet) via secure API
4. **Approval workflow** must enforce Maker-Checker principle
5. **Every change** to the form must be logged in audit trail
6. **SLA management** starts when case enters each stage
7. **Notifications** must be sent when documents are requested
8. **Liveness detection** (if implemented) uses external SDK

---

This document is the **complete technical specification** for developers to build the EDD Form module.

**All HTML/JS/API code should reference this specification.**

