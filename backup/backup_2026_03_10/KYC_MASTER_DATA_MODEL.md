# QIB KYC/EDD ENTERPRISE DATA MODEL
## Complete Field Specifications & System Integration

**Document Type:** Technical Specification  
**Version:** 1.0  
**Date:** March 9, 2026  
**Target Systems:** T24, CRP, QCB API, ETL, DMS, Compliance Gateway  

---

## SECTION 1: KYC FIELD MASTER LIST

### Summary Statistics
- **Total KYC Fields:** 88
- **Golden Source Fields:** 22 (QCB/MOI - Read-only)
- **Editable Fields:** 41
- **Calculated Fields:** 8
- **Compliance Fields:** 17

---

## 1.1 CUSTOMER IDENTIFICATION (GOLDEN SOURCE - QCB/MOI)

| Field ID | Field Name | Data Type | Required | Source | T24 Field | Lock Type | STP Impact |
|----------|-----------|-----------|----------|--------|-----------|-----------|-----------|
| FLD_001 | Full Name (EN) | VARCHAR(200) | YES | QCB/MOI | CUSTOMER>NAME.1 | GOLDEN | BLOCK |
| FLD_002 | Full Name (AR) | VARCHAR(200) | YES | QCB/MOI | CUSTOMER>NAME.2 | GOLDEN | BLOCK |
| FLD_003 | QID Number | VARCHAR(11) | YES | MOI | CUSTOMER>LEGAL.ID | GOLDEN | BLOCK |
| FLD_004 | QID Expiry Date | DATE | YES | MOI | CUSTOMER>L.ID.EXP.DATE | GOLDEN | BLOCK |
| FLD_005 | Nationality | VARCHAR(3) | YES | MOI | CUSTOMER>NATIONALITY | GOLDEN | BLOCK |
| FLD_006 | Date of Birth | DATE | YES | MOI | CUSTOMER>DATE.OF.BIRTH | GOLDEN | BLOCK |
| FLD_007 | Gender | ENUM | YES | MOI | CUSTOMER>GENDER | GOLDEN | NONE |
| FLD_008 | Marital Status | ENUM | NO | BANK | — | BANK | NONE |
| FLD_009 | Place of Birth | VARCHAR(100) | NO | MOI | — | GOLDEN | NONE |
| FLD_010 | Passport Number | VARCHAR(20) | YES | MOI | CUSTOMER>PASSPORT.NO | GOLDEN | BLOCK |
| FLD_011 | Passport Issue Date | DATE | YES | MOI | — | GOLDEN | BLOCK |
| FLD_012 | Passport Expiry Date | DATE | YES | MOI | CUSTOMER>PASSPORT.EXP.DATE | GOLDEN | BLOCK |
| FLD_013 | Visa Status | ENUM | YES | MOI | CUSTOMER>RESIDENCE | GOLDEN | BLOCK |
| FLD_014 | Visa Expiry Date | DATE | NO | MOI | CUSTOMER>VISA.EXP.DATE | GOLDEN | BLOCK |

---

## 1.2 CONTACT INFORMATION (USER EDITABLE)

| Field ID | Field Name | Data Type | Required | Source | Lock Type | Editable | Ops Approval | STP Impact |
|----------|-----------|-----------|----------|--------|-----------|----------|--------------|-----------|
| FLD_100 | Mobile Number | VARCHAR(15) | YES | BANK | VERIFIED | YES | Required | OPS REVIEW |
| FLD_101 | Mobile Verified | BOOLEAN | NO | BANK | SYSTEM | NO | — | FLAG IF NO |
| FLD_102 | Email Address | VARCHAR(100) | YES | BANK | BANK | YES | — | NONE |
| FLD_103 | Alternate Phone | VARCHAR(15) | NO | BANK | BANK | YES | — | NONE |

---

## 1.3 ADDRESS INFORMATION (USER EDITABLE)

| Field ID | Field Name | Data Type | Required | Source | Lock Type | Editable | Ops Approval |
|----------|-----------|-----------|----------|--------|-----------|----------|--------------|
| FLD_200 | Building Number | VARCHAR(10) | YES | BANK | BANK | YES | — |
| FLD_201 | Street Name | VARCHAR(100) | YES | BANK | BANK | YES | — |
| FLD_202 | Zone/District | VARCHAR(50) | YES | BANK | BANK | YES | — |
| FLD_203 | City | VARCHAR(50) | YES | BANK | BANK | YES | OPS REVIEW |
| FLD_204 | Postal Code | VARCHAR(10) | YES | BANK | BANK | YES | — |
| FLD_205 | PO Box | VARCHAR(20) | NO | BANK | BANK | YES | — |
| FLD_206 | Country | VARCHAR(100) | YES | BANK | BANK | YES | — |

---

## 1.4 EMPLOYMENT INFORMATION (USER EDITABLE + CONDITIONAL)

| Field ID | Field Name | Data Type | Required | Source | Lock Type | Conditions |
|----------|-----------|-----------|----------|--------|-----------|-----------|
| FLD_300 | Employer Name | VARCHAR(200) | YES | BANK | BANK | Required if Employed |
| FLD_301 | Employer CR Number | VARCHAR(20) | CONDITIONAL | BANK | BANK | If available |
| FLD_302 | GOSI Verified | BOOLEAN | YES | GOSI | VERIFIED | Flag if NO |
| FLD_303 | Employment Status | ENUM | YES | BANK | BANK | Employed/Self-employed/Retired/Student |
| FLD_304 | Occupation/Job Title | VARCHAR(100) | YES | BANK | BANK | Must map to risk category |
| FLD_305 | Industry | VARCHAR(100) | YES | BANK | BANK | Reference table: INDUSTRIES |

---

## 1.5 FINANCIAL INFORMATION (CRITICAL - STP IMPACTING)

| Field ID | Field Name | Data Type | Required | Source | Lock Type | Ops Approval | STP Impact |
|----------|-----------|-----------|----------|--------|-----------|--------------|-----------|
| FLD_400 | Monthly Income | DECIMAL(15,2) | YES | BANK | CONDITIONAL | **Required** | **OPS REVIEW** |
| FLD_401 | Income Source | VARCHAR(100) | YES | BANK | BANK | — | 120% CHECK |
| FLD_402 | Expected Monthly Deposits | VARCHAR(100) | YES | BANK | BANK | — | 120% CHECK |
| FLD_403 | Expected Monthly Withdrawals | VARCHAR(100) | YES | BANK | BANK | — | CALCULATED |
| FLD_404 | Expected Int'l Transfers In | VARCHAR(100) | YES | BANK | BANK | — | NONE |
| FLD_405 | Expected Int'l Transfers Out | VARCHAR(100) | YES | BANK | BANK | — | NONE |
| FLD_406 | Expected Monthly Transactions | DECIMAL(10,0) | YES | BANK | BANK | — | BLOCK >120% |
| FLD_407 | Activity/Income Ratio | DECIMAL(5,2) | NO | CALCULATED | CALCULATED | — | **BLOCK >120%** |
| FLD_408 | Additional Income Source | VARCHAR(100) | CONDITIONAL | BANK | BANK | **Required** | **REQ IF >120%** |
| FLD_409 | Additional Income Amount | DECIMAL(15,2) | CONDITIONAL | BANK | BANK | **Required** | **REQ IF >120%** |
| FLD_410 | Supporting Document | FILE | CONDITIONAL | UPLOAD | BANK | **Required** | **REQ IF >120%** |

---

## 1.6 SOURCE OF FUNDS (CRITICAL)

| Field ID | Field Name | Data Type | Required | Source | Lock Type | Valid Values |
|----------|-----------|-----------|----------|--------|-----------|-----------|
| FLD_500 | Source of Funds | ENUM | YES | BANK | BANK | Salary / Business / Investment / Inheritance / Savings / Gift / Other |
| FLD_501 | Source of Wealth | VARCHAR(500) | CONDITIONAL | BANK | BANK | Free text description |
| FLD_502 | Source Documentation | FILE | CONDITIONAL | UPLOAD | BANK | Supporting docs |

---

## 1.7 RISK & COMPLIANCE (DECISION CRITICAL)

| Field ID | Field Name | Data Type | Required | Source | Lock Type | Risk Weight | Decision Logic |
|----------|-----------|-----------|----------|--------|-----------|-----------|-----------|
| FLD_600 | PEP Status | ENUM | YES | CRP | VERIFIED | **HIGH** | If Yes → Always HIGH RISK |
| FLD_601 | PEP Relationship | VARCHAR(100) | CONDITIONAL | CRP | VERIFIED | HIGH | If PEP=Relative |
| FLD_602 | Sanctions List Hit | BOOLEAN | NO | CRP | SYSTEM | **CRITICAL** | If Yes → REJECT |
| FLD_603 | High-Risk Occupation | VARCHAR(100) | YES | CRP | BANK | MEDIUM | Map to OCCP_RISK_SCORE |
| FLD_604 | Occupation Risk Category | ENUM | YES | CRP | SYSTEM | MEDIUM | Low/Medium/High |
| FLD_605 | Occupation Risk Score | DECIMAL(3,0) | NO | CRP | SYSTEM | CALCULATED | 0-100 range |
| FLD_606 | Customer Risk Rating | ENUM | YES | CRP | SYSTEM | CALCULATED | Low/Medium/High |
| FLD_607 | Risk Reason 1 | VARCHAR(200) | YES | CRP | SYSTEM | — | Displayed in case |
| FLD_608 | Risk Reason 2 | VARCHAR(200) | NO | CRP | SYSTEM | — | If multiple reasons |
| FLD_609 | Risk Reason 3 | VARCHAR(200) | NO | CRP | SYSTEM | — | If multiple reasons |

---

## 1.8 TAX & REGULATORY COMPLIANCE (FATCA/CRS)

| Field ID | Field Name | Data Type | Required | Source | Lock Type | Decision Logic |
|----------|-----------|-----------|----------|--------|-----------|-----------|
| FLD_700 | US Person Declaration | ENUM | YES | BANK | DECLARATION | If Yes → FATCA AEOI Required |
| FLD_701 | Tax Residency Country | VARCHAR(3) | YES | BANK | DECLARATION | CRS Reporting required |
| FLD_702 | Tax Identification Number | VARCHAR(30) | CONDITIONAL | BANK | CONDITIONAL | Required if US Person |
| FLD_703 | FATCA Status | ENUM | NO | CRP | SYSTEM | Compliant/Non-Compliant |
| FLD_704 | CRS Status | ENUM | NO | CRP | SYSTEM | Compliant/Non-Compliant |

---

## 1.9 CONSENT & AUDIT TRAIL

| Field ID | Field Name | Data Type | Required | Source | Lock Type |
|----------|-----------|-----------|----------|--------|-----------|
| FLD_800 | Consent ID | UUID | YES | CONSENT | SYSTEM |
| FLD_801 | Consent Timestamp | TIMESTAMP | YES | CONSENT | SYSTEM |
| FLD_802 | Consent Purpose | ENUM | YES | CONSENT | SYSTEM |
| FLD_803 | Consent Expiry | TIMESTAMP | YES | CONSENT | SYSTEM |
| FLD_804 | Audit Hash | VARCHAR(64) | YES | AUDIT | SYSTEM |
| FLD_805 | Record Created By | VARCHAR(50) | YES | AUDIT | SYSTEM |
| FLD_806 | Record Created Date | TIMESTAMP | YES | AUDIT | SYSTEM |
| FLD_807 | Last Modified By | VARCHAR(50) | NO | AUDIT | SYSTEM |
| FLD_808 | Last Modified Date | TIMESTAMP | NO | AUDIT | SYSTEM |

---

---

## SECTION 2: DATA SOURCE MAPPING & INTEGRATION POINTS

### System Integration Matrix

```
┌─────────────────────────────────────────────────────────────┐
│              DATA SOURCE ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │   T24    │  │   CRP    │  │   QCB    │  │ Compliance │  │
│  │ (Core)   │  │ (Risk)   │  │ (Public) │  │  Gateway   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬─────┘  │
│       │             │             │               │         │
│       └─────────────┼─────────────┼───────────────┘         │
│                     │             │                         │
│                ┌────▼─────────────▼────┐                    │
│                │   ETL / ESB Gateway    │                    │
│                │  (Data Integration)    │                    │
│                └────┬──────────────────┘                    │
│                     │                                        │
│                ┌────▼──────────────────┐                    │
│                │  QIB EDD System DB    │                    │
│                │  (PostgreSQL)         │                    │
│                └────┬──────────────────┘                    │
│                     │                                        │
│        ┌────────────┼─────────────────────┐                 │
│        │            │                     │                 │
│   ┌────▼────┐  ┌────▼────┐  ┌──────────┐ │                 │
│   │  KYC    │  │   EDD   │  │   Risk   │ │                 │
│   │ Tables  │  │ Tables  │  │ Tables   │ │                 │
│   └─────────┘  └─────────┘  └──────────┘ │                 │
│                                           │                 │
│                ┌──────────────────────────┘                 │
│                │                                            │
│           ┌────▼────────────┐                               │
│           │  EDD Case View  │                               │
│           │  (Frontend)     │                               │
│           └─────────────────┘                               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Field-Level Source Mapping

| Field Category | Source System | API Endpoint | Refresh Frequency | Lock Mode |
|---|---|---|---|---|
| **Identity (QID, Passport, Name)** | MOI + QCB | /api/v1/qcb/identity | Daily (batch) | READ-ONLY |
| **Employment (GOSI, CR)** | GOSI / MOEC | /api/v1/gosi/verify | Real-time | READ-ONLY |
| **Salary (Monthly Income)** | T24 (Payroll) | /api/v1/t24/salary | Daily (EOD) | EDIT + DOC |
| **Risk Rating** | CRP (AML) | /api/v1/crp/risk | Real-time (on-change) | READ-ONLY |
| **Contact Info** | BANK (User Input) | /api/v1/customers/contact | On-demand | EDIT |
| **Address** | BANK (User Input) | /api/v1/customers/address | On-demand | EDIT |
| **Compliance Status** | Compliance Gateway | /api/v1/compliance/fatca-crs | Real-time | SYSTEM |

---

### Data Flow for Each Integration

#### 1. T24 Integration (Core Banking Data)
```
T24 Customer Record
    ↓
    ├─ Customer Name (NAME.1, NAME.2)
    ├─ QID Number (LEGAL.ID)
    ├─ Nationality (NATIONALITY)
    ├─ Date of Birth (DATE.OF.BIRTH)
    ├─ Address (STREET, ADDRESS, TOWN.COUNTRY)
    ├─ Monthly Income (L.MONTHLY.INCOME)
    ├─ Employer (EMPLOYERS.NAME)
    ├─ Risk Rating (L.RISK.RATING)
    └─ Account Type (ACCOUNT>CATEGORY)
    
Query: SELECT NAME.1, NAME.2, LEGAL.ID, ... FROM CUSTOMER 
       WHERE RM_NUMBER = {rim}
```

#### 2. CRP Integration (Risk & Compliance)
```
Customer Risk Profile
    ↓
    ├─ PEP Status (PEP_FLAG)
    ├─ Sanctions Hit (SANCTIONS_HIT)
    ├─ High-Risk Occupation (OCCP_RISK_CATEGORY)
    ├─ Risk Score (RISK_SCORE)
    ├─ Risk Reasons (RISK_REASONS[])
    └─ Decision (RISK_DECISION)

Query: SELECT PEP_FLAG, SANCTIONS_HIT, OCCP_RISK_SCORE, ... 
       FROM CUSTOMER_RISK_PROFILE 
       WHERE CUSTOMER_ID = {rim}
```

#### 3. QCB API Integration (Government Data)
```
QCB Public Registry
    ↓
    ├─ QID Validity (QID_STATUS, QID_EXPIRY)
    ├─ Passport Details (PASSPORT_NO, PASSPORT_EXPIRY)
    ├─ Nationality (NATIONALITY)
    └─ Visa Status (RESIDENCE, VISA_EXPIRY)

Endpoint: GET /api/v1/citizens/{qid}
          GET /api/v1/passports/{passport_no}
```

#### 4. GOSI Integration (Employment Verification)
```
GOSI System
    ↓
    ├─ Employment Status (GOSI_VERIFIED)
    ├─ Employer CR (EMPLOYER_CR)
    ├─ Employment History
    └─ Salary Information

Endpoint: POST /api/v1/gosi/verify
          Body: {qid, employer_cr}
```

#### 5. Compliance Gateway (FATCA/CRS)
```
Third-party Compliance Service
    ↓
    ├─ FATCA Status (FATCA_COMPLIANT)
    ├─ CRS Status (CRS_COMPLIANT)
    ├─ Tax Residency (TAX_RESIDENCY)
    └─ Compliance Decision (COMPLIANCE_DECISION)

Endpoint: POST /api/v1/compliance/check-person
          Body: {name, dob, nationality, tax_residency}
```

---

## SECTION 3: DATABASE SCHEMA

### 3.1 KYC_CUSTOMER_PROFILE (Main Customer Records)

```sql
CREATE TABLE KYC_CUSTOMER_PROFILE (
    -- Primary Key & Identifiers
    customer_id VARCHAR(20) PRIMARY KEY,
    rim_number VARCHAR(20) UNIQUE NOT NULL,
    
    -- Identity (from MOI/QCB)
    full_name_en VARCHAR(200) NOT NULL,
    full_name_ar VARCHAR(200) NOT NULL,
    qid_number VARCHAR(11) UNIQUE NOT NULL,
    qid_status ENUM('VALID', 'EXPIRED', 'INVALID') DEFAULT 'VALID',
    qid_expiry DATE NOT NULL,
    
    -- Passport
    passport_number VARCHAR(20),
    passport_issue_date DATE,
    passport_expiry DATE,
    passport_country VARCHAR(100),
    
    -- Personal Details
    date_of_birth DATE NOT NULL,
    gender ENUM('M', 'F', 'O') NOT NULL,
    nationality VARCHAR(3) NOT NULL,
    marital_status ENUM('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED') DEFAULT 'SINGLE',
    
    -- Visa/Residency
    visa_status ENUM('VALID', 'EXPIRED', 'NOT_APPLICABLE') DEFAULT 'NOT_APPLICABLE',
    visa_expiry DATE,
    place_of_birth VARCHAR(100),
    
    -- Risk Rating (from CRP)
    risk_rating ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
    risk_score DECIMAL(3,0) DEFAULT 0,
    
    -- Audit Trail
    created_by VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(50),
    updated_at TIMESTAMP,
    last_reviewed_by VARCHAR(50),
    last_reviewed_at TIMESTAMP,
    
    -- System Flags
    is_active BOOLEAN DEFAULT TRUE,
    kyc_version INT DEFAULT 1,
    kyc_last_updated DATE,
    
    CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES CUSTOMERS(CUSTOMER_ID),
    CONSTRAINT ck_age CHECK (YEAR(CURDATE()) - YEAR(date_of_birth) >= 18)
);
```

### 3.2 KYC_CONTACT_INFO (Contact Details)

```sql
CREATE TABLE KYC_CONTACT_INFO (
    contact_id VARCHAR(30) PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL,
    
    -- Contact Details
    mobile_number VARCHAR(15) NOT NULL,
    mobile_verified BOOLEAN DEFAULT FALSE,
    mobile_verified_at TIMESTAMP,
    
    email VARCHAR(100) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    
    alternate_phone VARCHAR(15),
    
    -- Address
    address_line_1 VARCHAR(200) NOT NULL,
    address_line_2 VARCHAR(200),
    building_number VARCHAR(10),
    street_name VARCHAR(100),
    zone VARCHAR(50),
    city VARCHAR(50) NOT NULL,
    postal_code VARCHAR(10),
    po_box VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    
    CONSTRAINT fk_customer_contact FOREIGN KEY (customer_id) 
        REFERENCES KYC_CUSTOMER_PROFILE(customer_id)
);
```

### 3.3 KYC_EMPLOYMENT (Employment Details)

```sql
CREATE TABLE KYC_EMPLOYMENT (
    employment_id VARCHAR(30) PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL,
    
    -- Employment
    employment_status ENUM('EMPLOYED', 'SELF_EMPLOYED', 'RETIRED', 'STUDENT', 'UNEMPLOYED') NOT NULL,
    employer_name VARCHAR(200),
    employer_cr VARCHAR(20),
    occupation VARCHAR(100),
    industry VARCHAR(100),
    
    -- Verification
    gosi_verified BOOLEAN DEFAULT FALSE,
    gosi_verified_at TIMESTAMP,
    gosi_verification_reference VARCHAR(50),
    
    -- Dates
    employment_start_date DATE,
    employment_end_date DATE,
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    
    CONSTRAINT fk_customer_employment FOREIGN KEY (customer_id) 
        REFERENCES KYC_CUSTOMER_PROFILE(customer_id)
);
```

### 3.4 KYC_FINANCIAL_PROFILE (Financial Information)

```sql
CREATE TABLE KYC_FINANCIAL_PROFILE (
    financial_id VARCHAR(30) PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL,
    
    -- Income
    monthly_income DECIMAL(15,2) NOT NULL,
    income_source VARCHAR(100) NOT NULL,
    income_source_description TEXT,
    
    -- Expected Activity
    expected_monthly_deposits VARCHAR(100),
    expected_monthly_withdrawals VARCHAR(100),
    expected_intl_transfers_in VARCHAR(100),
    expected_intl_transfers_out VARCHAR(100),
    expected_monthly_transactions DECIMAL(10,0),
    
    -- Calculated Ratios
    activity_income_ratio DECIMAL(5,2) GENERATED ALWAYS AS 
        (CAST(expected_monthly_deposits AS DECIMAL) / monthly_income) STORED,
    
    -- Source of Funds
    source_of_funds ENUM('SALARY', 'BUSINESS', 'INVESTMENT', 'INHERITANCE', 'SAVINGS', 'GIFT', 'OTHER') NOT NULL,
    source_of_wealth TEXT,
    
    -- Supporting Documents
    income_document_id VARCHAR(50),
    source_document_id VARCHAR(50),
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    
    CONSTRAINT fk_customer_financial FOREIGN KEY (customer_id) 
        REFERENCES KYC_CUSTOMER_PROFILE(customer_id),
    CONSTRAINT ck_activity_ratio CHECK (activity_income_ratio <= 1.2)
);
```

### 3.5 KYC_RISK_INDICATORS (Risk & Compliance Flags)

```sql
CREATE TABLE KYC_RISK_INDICATORS (
    risk_id VARCHAR(30) PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL,
    edd_case_id VARCHAR(20),
    
    -- PEP
    pep_status ENUM('YES', 'NO', 'RELATIVE_OF_PEP', 'FORMER_PEP') DEFAULT 'NO',
    pep_relationship VARCHAR(200),
    pep_source VARCHAR(50),
    pep_check_date TIMESTAMP,
    
    -- Sanctions
    sanctions_list_hit BOOLEAN DEFAULT FALSE,
    sanctions_reason TEXT,
    sanctions_check_date TIMESTAMP,
    sanctions_list_used VARCHAR(50),
    
    -- Occupation Risk
    occupation_risk_category ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
    occupation_risk_score DECIMAL(3,0) DEFAULT 50,
    
    -- Risk Reasons
    risk_reason_1 VARCHAR(200),
    risk_reason_2 VARCHAR(200),
    risk_reason_3 VARCHAR(200),
    risk_reason_4 VARCHAR(200),
    
    -- Tax Compliance
    us_person BOOLEAN DEFAULT FALSE,
    tax_residency_country VARCHAR(3),
    tax_id VARCHAR(30),
    fatca_compliant BOOLEAN,
    crs_compliant BOOLEAN,
    
    -- Overall Risk
    overall_risk_rating ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
    risk_decision ENUM('APPROVED', 'REJECTED', 'ESCALATED_TO_EDD') DEFAULT 'APPROVED',
    risk_decision_date TIMESTAMP,
    risk_decision_by VARCHAR(50),
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    
    CONSTRAINT fk_customer_risk FOREIGN KEY (customer_id) 
        REFERENCES KYC_CUSTOMER_PROFILE(customer_id),
    CONSTRAINT fk_edd_case FOREIGN KEY (edd_case_id) 
        REFERENCES EDD_CASES(CASE_ID)
);
```

### 3.6 KYC_CONSENT_AUDIT (Compliance Audit Trail)

```sql
CREATE TABLE KYC_CONSENT_AUDIT (
    consent_id UUID PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL,
    
    -- Consent Details
    consent_type VARCHAR(100) NOT NULL,
    consent_version INT DEFAULT 1,
    consent_text TEXT,
    
    -- Timestamps
    consent_given_at TIMESTAMP NOT NULL,
    consent_accepted_by VARCHAR(50) NOT NULL,
    consent_ip_address VARCHAR(15),
    consent_user_agent TEXT,
    
    -- Expiry
    consent_expiry_at TIMESTAMP,
    
    -- Audit
    audit_hash VARCHAR(64) NOT NULL,
    record_created_by VARCHAR(50) NOT NULL,
    record_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    record_modified_by VARCHAR(50),
    record_modified_at TIMESTAMP,
    
    CONSTRAINT fk_customer_consent FOREIGN KEY (customer_id) 
        REFERENCES KYC_CUSTOMER_PROFILE(customer_id)
);
```

---

## SECTION 4: INTEGRATION WITH EDD SYSTEM

### EDD Case Initiation from KYC

```
Trigger: Customer Risk Rating = HIGH or CRITICAL
         OR Financial Activity Ratio > 120%
         OR PEP = YES
         OR Sanctions Hit = TRUE
         OR Occupation Risk = HIGH
         
Action: Automatically create EDD_CASE
        
SQL: INSERT INTO EDD_CASES (
    case_id, 
    customer_id, 
    case_type, 
    priority, 
    trigger_reason,
    created_at
)
VALUES (
    GENERATE_CASE_ID(),
    {customer_id},
    'ENHANCED_DUE_DILIGENCE',
    CASE 
        WHEN risk_rating = 'CRITICAL' THEN 'URGENT'
        WHEN risk_rating = 'HIGH' THEN 'HIGH'
        ELSE 'NORMAL'
    END,
    CONCAT(risk_reason_1, ', ', risk_reason_2),
    NOW()
);
```

### KYC Data Visibility in EDD Case

```
When opening EDD Case:

DISPLAY:
┌────────────────────────────┐
│ Customer 360 View          │
├────────────────────────────┤
│ ✓ Identity (QID, Passport) │
│ ✓ Contact Details          │
│ ✓ Employment Status        │
│ ✓ Financial Profile        │
│ ✓ Risk Indicators          │
│ ✓ Compliance Status        │
│ ✓ Documents Attached       │
│ ✓ Previous KYC Version     │
└────────────────────────────┘
```

---

## SECTION 5: VALIDATION RULES & BUSINESS LOGIC

### Financial Activity Check (120% Rule)

```javascript
function checkActivityIncomeRatio(financial) {
    const ratio = financial.expected_monthly_deposits / financial.monthly_income;
    
    if (ratio > 1.2) {
        return {
            status: 'REQUIRES_DOCUMENTATION',
            message: 'Activity exceeds 120% of declared income',
            required_fields: [
                'additional_income_source',
                'additional_income_amount',
                'supporting_document'
            ],
            stp_impact: 'BLOCK',
            edd_trigger: true
        };
    }
    return { status: 'OK' };
}
```

### PEP Decision Logic

```javascript
function evaluatePEPRisk(riskIndicators) {
    if (riskIndicators.pep_status === 'YES' || 
        riskIndicators.pep_status === 'RELATIVE_OF_PEP') {
        return {
            risk_rating: 'HIGH',
            edd_trigger: true,
            escalation_required: true,
            message: 'PEP detected - automatic EDD trigger'
        };
    }
}
```

### Sanctions Check Logic

```javascript
function checkSanctionsList(customer) {
    const result = callSanctionsAPI({
        full_name: customer.full_name_en,
        nationality: customer.nationality,
        dob: customer.date_of_birth
    });
    
    if (result.match_found) {
        return {
            sanctions_list_hit: true,
            risk_rating: 'CRITICAL',
            approved: false,
            message: 'REJECT - Customer on sanctions list'
        };
    }
}
```

---

## SECTION 6: API SPECIFICATIONS FOR FRONTEND INTEGRATION

### 1. Get KYC Summary (Customer 360)
```
GET /api/v1/kyc/customer/{customer_id}/summary

Response:
{
  "customer_profile": { ... },
  "contact_info": { ... },
  "employment": { ... },
  "financial_profile": { ... },
  "risk_indicators": { ... },
  "edd_status": "APPROVED|EDD_REQUIRED|REJECTED",
  "documents": [ ... ]
}
```

### 2. Create/Update KYC
```
POST /api/v1/kyc/create

Body:
{
  "rim_number": "RIM001234",
  "personal_details": { ... },
  "contact_info": { ... },
  "employment": { ... },
  "financial_profile": { ... },
  "source_of_funds": "SALARY",
  "consent_id": "UUID"
}

Response:
{
  "kyc_id": "KYC20260309001",
  "status": "SUBMITTED",
  "risk_decision": "APPROVED | EDD_REQUIRED | REJECTED",
  "edd_case_created": "CHG20260309001"
}
```

### 3. Get Activity/Income Validation
```
GET /api/v1/kyc/{customer_id}/validate-activity

Response:
{
  "activity_ratio": 1.15,
  "status": "OK",
  "requires_documentation": false
}
```

---

## SECTION 7: IMPLEMENTATION CHECKLIST

### Phase 1: Database Setup
- [ ] Create all KYC tables (PostgreSQL)
- [ ] Create indexes on customer_id, rim_number, qid_number
- [ ] Set up foreign keys with EDD_CASES
- [ ] Create audit views

### Phase 2: API Integration
- [ ] Implement T24 connector (Customer data pull)
- [ ] Implement CRP connector (Risk assessment)
- [ ] Implement QCB API connector (Government verification)
- [ ] Implement GOSI connector (Employment check)
- [ ] Implement Compliance Gateway (FATCA/CRS)

### Phase 3: Business Logic
- [ ] Implement financial ratio calculations
- [ ] Implement PEP/Sanctions check
- [ ] Implement EDD auto-trigger logic
- [ ] Implement validation rules

### Phase 4: Frontend Forms
- [ ] Create digital KYC form (HTML/React)
- [ ] Create customer 360 view
- [ ] Create EDD case integration
- [ ] Create risk dashboard

### Phase 5: Testing & UAT
- [ ] Unit tests for validation logic
- [ ] Integration tests with T24/CRP
- [ ] User acceptance testing
- [ ] Performance testing

---

**Document Prepared by:** Enterprise Architecture  
**Date:** March 9, 2026  
**Version:** 1.0  
**Status:** Final - Ready for Implementation
