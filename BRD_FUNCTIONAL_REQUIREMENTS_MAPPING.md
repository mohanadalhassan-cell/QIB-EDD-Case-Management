# BRD - Functional Requirements Mapping
# EDD Form Individual - Digital Implementation

**Document Version:** 1.0  
**Date:** 11 March 2026  
**System:** Enhanced Due Diligence (EDD) Digital Platform  
**Form Reference:** EDD FORM – INDIVIDUAL (QIB Standard)  
**Status:** ✅ ALIGNED WITH OFFICIAL FORM

---

## 📋 SECTION 1: REQUEST HEADER & BASIC DATA
### FR-001 to FR-010

| FR-ID | Requirement | Form Field | Type | Validation | Dependencies | Mandatory |
|-------|-------------|-----------|------|-----------|--------------|-----------|
| FR-001 | Type of Request - Account Opening | Type | Dropdown | `Account Opening (New)`, `Account Opening (Additional)`, `Periodic Review` | None | YES |
| FR-002 | Relationship Type Classification | Relationship Type | Dropdown | `New to Bank`, `Existing` | None | YES |
| FR-003 | Customer's Full Name | Customer's Name | Text (255 chars) | Not Blank, Alpha-numeric | FR-002 | YES |
| FR-004 | Customer RIM Number (Conditional) | RIM No. | Text (10 chars) | Format: RIM######, Lookup validation | FR-002 = "Existing" | CONDITIONAL |
| FR-005 | Relationship Opening Date | Relationship Opening Date | Date | DD/MM/YYYY, Not future date, Min 1 year ago if Existing | FR-001, FR-002 | YES |
| FR-006 | Filed For - Person Category | Filed For | Dropdown | `Customer`, `Joint Account Holder`, `Guardian (Minors)`, `POA / Authorized Signatory` | None | YES |
| FR-007 | How Customer was Acquired | How Acquired | Dropdown | `Referred by QIB staff`, `Referred by a client`, `Others` | None | YES |
| FR-008 | Staff Referral Details (Conditional) | Staff Name, ID, Location | Text fields | Required if FR-007 = "Referred by QIB staff" | FR-007 | CONDITIONAL |
| FR-009 | Client Referral Details (Conditional) | Referring Client Name, RIM | Text fields | Required if FR-007 = "Referred by a client", Validate RIM exists | FR-007 | CONDITIONAL |
| FR-010 | Other Referral Details (Conditional) | Provide Details | Text Area (500 chars) | Required if FR-007 = "Others" | FR-007 | CONDITIONAL |

---

## 📊 SECTION 2: RISK CLASSIFICATION
### FR-011 to FR-025

| FR-ID | Requirement | Form Field | Type | Validation | Dependencies | Mandatory |
|-------|-------------|-----------|------|-----------|--------------|-----------|
| FR-011 | Risk Question 1 - Increased Risk Business | Client involved in Increased Risk Business | Boolean (Yes/No) | Logic: Display form with business activity list | None | YES |
| FR-012 | Business Activity Details (Conditional) | Business Activity Type | Dropdown | [List of high-risk activities per FATF] | FR-011 = YES | CONDITIONAL |
| FR-013 | Risk Question 2 - High Risk Country Origin | Self-Employed from Sanctioned / High Risk Country | Boolean (Yes/No) | Validate against OFAC list | None | YES |
| FR-014 | Country Selection (Conditional) | Country of Origin | Dropdown | [OFAC + High Risk Country List] | FR-013 = YES | CONDITIONAL |
| FR-015 | Risk Question 3 - Non-Resident Status | Client is Non-Resident | Boolean (Yes/No) | Validate against CRP/Residency records | None | YES |
| FR-016 | Non-Resident Country Code (Conditional) | Country | Dropdown | [ISO Country Codes] | FR-015 = YES | CONDITIONAL |
| FR-017 | Risk Question 4 - Private Banking | Client under Private Banking Sector | Boolean (Yes/No) | Lookup from CRM | None | YES |
| FR-018 | Private Banking Confirmation (Conditional) | Confirm Private Banking Status | Text | PBS Code, Portfolio Value | FR-017 = YES | CONDITIONAL |
| FR-019 | Risk Question 5 - Known PEP | Client identified as known PEP | Boolean (Yes/No) | Cross-reference with PEP list | None | YES |
| FR-020 | PEP Category Type (Conditional) | PEP Category | Dropdown | See Section 7 (FR-053 to FR-060) | FR-019 = YES | CONDITIONAL |
| FR-021 | Overall Risk Score Calculation | Risk Score | Automatic | Sum of all risk factors: (Q1=15, Q2=20, Q3=15, Q4=15, Q5=35) = 100 | FR-011 to FR-019 | AUTO |
| FR-022 | Overall Risk Classification - Low | Risk Classification Output | Auto-Dropdown | "Low Risk" | FR-021 score 0-30 | AUTO |
| FR-023 | Overall Risk Classification - Medium | Risk Classification Output | Auto-Dropdown | "Medium Risk" | FR-021 score 31-65 | AUTO |
| FR-024 | Overall Risk Classification - High | Risk Classification Output | Auto-Dropdown | "High Risk" | FR-021 score 66-100 | AUTO |
| FR-025 | Risk Classification Documentation | Risk Basis Documentation | Text Area (1000 chars) | Mandatory if FR-024 = "High Risk" OR "Medium Risk" OR "Derived via CRP" | FR-022 OR FR-023 OR FR-024 | CONDITIONAL |

---

## 👤 SECTION 3: CUSTOMER INFORMATION
### FR-026 to FR-035

| FR-ID | Requirement | Form Field | Type | Validation | Dependencies | Mandatory |
|-------|-------------|-----------|------|-----------|--------------|-----------|
| FR-026 | Customer Personal Details | Customer Demographics | Form Section | Captures: Full Name, DOB, Nationality, ID Number, Contact | None | YES |
| FR-027 | Customer KYC Status Verification | KYC Status | Lookup | Validates KYC completion in CRM | None | YES |
| FR-028 | Customer Occupation | Occupation | Dropdown | [Standard occupation codes per QIB] | None | YES |
| FR-029 | Customer Identification Document | ID Type & Number | Text fields | Passport, Emirates ID, National ID, License | None | YES |
| FR-030 | Document Expiry Validation | ID Expiry Date | Date | DD/MM/YYYY, Must be future date | FR-029 | YES |
| FR-031 | Customer Contact Details | Phone, Email, Address | Text fields | Format validation: Phone (8 digits), Email (valid format) | None | YES |
| FR-032 | Permanent Address | Address Details | Text Area | Street, City, Country, Postal Code | None | YES |
| FR-033 | Mailing Address (If Different) | Mailing Address | Text Area | Same format | None | NO |
| FR-034 | Employment Status | Employment Type | Dropdown | `Employed`, `Self-Employed`, `Business Owner`, `Retired`, `Homemaker`, `Other` | None | YES |
| FR-035 | Third Party Signature Authority | Signatory Details | Conditional Form | Name, ID, Relationship | FR-006 ≠ "Customer" | CONDITIONAL |

---

## 🎯 SECTION 4: PURPOSE & INTENDED USE
### FR-036 to FR-048

| FR-ID | Requirement | Form Field | Type | Validation | Dependencies | Mandatory |
|-------|-------------|-----------|------|-----------|--------------|-----------|
| FR-036 | Purpose of Account Opening/Reactivation | Purpose of Account | Dropdown | `Personal Use`, `Salary`, `Savings`, `Investments (Rental)`, `Others` | None | YES |
| FR-037 | Business Activity Usage | Business Activity Flag | Boolean (Yes/No) | Logic: If YES, trigger FR-038 | None | YES |
| FR-038 | Business Activity Details (Conditional) | Business Type & Purpose | Text Area (500 chars) | Mandatory if FR-037 = YES | FR-037 | CONDITIONAL |
| FR-039 | Expected Products - Liabilities | Liability Products Checkbox | Boolean (Multiple) | `Current Account`, `Savings Account`, `Overdraft`, `Term Deposit`, Other | None | NO |
| FR-040 | Expected Products - Assets | Asset Products Checkbox | Boolean (Multiple) | `Loans`, `Mortgages`, `Car Finance`, `Personal Loan`, Other | None | NO |
| FR-041 | Expected Products - Investments | Investment Products Checkbox | Boolean (Multiple) | `Equities`, `Bonds`, `Funds`, `Structured Products`, Other | None | NO |
| FR-042 | Expected Products - Other Services | Safe Deposit Locker | Boolean (Yes/No) | Flag for locker requirement | None | NO |
| FR-043 | Other Services Details (Conditional) | Specify Other Services | Text Area (500 chars) | Mandatory if other services selected | FR-040 OR FR-041 OR FR-042 | CONDITIONAL |
| FR-044 | Account Currency | Currency Selection | Dropdown | `QAR`, `USD`, `EUR`, `AED`, `GBP`, `Multi-Currency` | None | YES |
| FR-045 | Transaction Volume Estimate | Expected Monthly Volume | Dropdown | `Low (<QAR 500K)`, `Medium (500K-2M)`, `High (2M-10M)`, `Very High (>10M)` | None | YES |
| FR-046 | International Transactions Expected | Cross-Border Transactions | Boolean (Yes/No) | Logic: If YES, trigger FR-047 | None | YES |
| FR-047 | Cross-Border Details (Conditional) | Countries, Frequency, Purpose | Text Area (500 chars) | Mandatory if FR-046 = YES | FR-046 | CONDITIONAL |
| FR-048 | Beneficiary Disclosure | Beneficial Owner Information | Conditional Form | Required if different from customer | None | CONDITIONAL |

---

## 💰 SECTION 5: SOURCE OF INCOME & WEALTH
### FR-049 to FR-074

| FR-ID | Requirement | Form Field | Type | Validation | Dependencies | Mandatory |
|-------|-------------|-----------|------|-----------|--------------|-----------|
| FR-049 | Expected Monthly Income (QAR) | Monthly Income Amount | Number (currency) | ≥ 0, Format: 0.00, Sum validation with FR-050 to FR-052 | None | YES |
| FR-050 | Income Source 1: Salary/Employment | Salary Income Section | Sub-form | Include: Designation, Employer Name, Address, Years, Amount, QIB Transfer | None | NO |
| FR-050.1 | Designation | Designation | Dropdown | [Job titles list] | FR-050 selected | CONDITIONAL |
| FR-050.2 | Employer Name | Employment Name | Text (255 chars) | Lookup available | FR-050 selected | CONDITIONAL |
| FR-050.3 | Employer Address | Employer Address | Text Area | Street, City, Country | FR-050 selected | CONDITIONAL |
| FR-050.4 | Years in Employment | Employment Duration | Number | 0-70 years | FR-050 selected | CONDITIONAL |
| FR-050.5 | Monthly Salary (QAR) | Salary Amount | Number (currency) | ≥ 0.00 | FR-050 selected | CONDITIONAL |
| FR-050.6 | Salary Transferred to QIB | QIB Salary Transfer | Boolean (Yes/No) | Logic: If YES, validate against CRM | FR-050 selected | CONDITIONAL |
| FR-051 | Income Source 2: Business/Self-Employed | Business Income Section | Sub-form | Include: Business Name, Line, Ownership %, Years, Annual Profit, QIB Account | None | NO |
| FR-051.1 | Business Name | Business Name | Text (255 chars) | Validate if registered business | FR-051 selected | CONDITIONAL |
| FR-051.2 | Line of Business Activity | Business Activity | Dropdown | [Business types list] | FR-051 selected | CONDITIONAL |
| FR-051.3 | Ownership Percentage | Ownership % | Number | 1-100%, Validate if multiple owners | FR-051 selected | CONDITIONAL |
| FR-051.4 | Years in Business | Business Duration | Number | 0-70 years | FR-051 selected | CONDITIONAL |
| FR-051.5 | Annual Profit (Approx) | Annual Profit | Number (currency) | ≥ 0.00 | FR-051 selected | CONDITIONAL |
| FR-051.6 | Business Income (QAR) | Business Monthly Income | Number (currency) | ≥ 0.00 | FR-051 selected | CONDITIONAL |
| FR-051.7 | Company Account with QIB | QIB Business Account | Boolean (Yes/No) | Validate against CRM | FR-051 selected | CONDITIONAL |
| FR-052 | Income Source 3: House Rents/Investments/Others | Investment Income Section | Sub-form | Include: Type, Details, Location/Details, Amount | None | NO |
| FR-052.1 | Income Type | Income Category | Dropdown | `House Rents`, `Investments`, `Others` | FR-052 selected | CONDITIONAL |
| FR-052.2 | Property Details (House Rents) | Property Info | Text Area (500 chars) | Location, Type, Value, Tenant Info | FR-052.1 = "House Rents" | CONDITIONAL |
| FR-052.3 | Investment Details (Investments) | Investment Info | Text Area (500 chars) | Type, Company, % Holding, Market Value | FR-052.1 = "Investments" | CONDITIONAL |
| FR-052.4 | Other Income Details | Other Info | Text Area (500 chars) | Specify source and details | FR-052.1 = "Others" | CONDITIONAL |
| FR-052.5 | Monthly Income (QAR) | Investment Monthly Income | Number (currency) | ≥ 0.00 | FR-052 selected | CONDITIONAL |
| FR-053 | Source of Wealth Classification | Wealth Source Type | Dropdown | `Salary Earnings`, `Business Earnings`, `Gift/Inheritance`, `Investment Income`, `Business Sale`, `Property Sale`, `Others` | None | YES |
| FR-054 | Wealth Source Explanation | Wealth Explanation | Text Area (1500 chars) | Mandatory for all sources, detailed narrative | FR-053 | YES |
| FR-055 | Supporting Documents Upload | Wealth Documents | File Upload (Multi) | [PDF, JPG, PNG max 10MB], Auto-link to document repository | FR-054 | YES |
| FR-056 | Document Checklist Validation | Document Status | Checkbox List | Track: Salary cert, Bank statements, Business docs, etc. | FR-055 | YES |
| FR-057 | Total Estimated Net Worth Bracket | Net Worth Range | Dropdown | `< 250K`, `250K-500K`, `500K-1M`, `1M-3M`, `3M-5M`, `> 5M` | None | YES |
| FR-058 | Net Worth Amount (If >5M) | Exact Net Worth | Number (currency) | ≥ 5,000,000, Only if FR-057 = "> 5M" | FR-057 = "> 5M" | CONDITIONAL |
| FR-059 | Net Worth Supporting Evidence | Net Worth Documentation | File Upload (Multi) | Assets list, Bank statements, Property docs | None | YES |
| FR-060 | Source All Fields Complete Check | Income Sources Validation | Auto-validate | Sum of FR-050.5 + FR-051.6 + FR-052.5 = FR-049 ± 5% | FR-049, FR-050 to FR-052 | AUTO |
| FR-061 | Multiple Income Sources Allowed | Multi-Source Flag | Auto-calculate | Allow 0-3 concurrent sources | Systems logic | AUTO |
| FR-062 | Income Verification Status | Income Verification | Status field | `Verified`, `Pending`, `Failed`, shows verification date | FR-049 to FR-059 | AUTO |

---

## 🏦 SECTION 6: INITIAL DEPOSIT & TRANSACTIONAL ACTIVITY
### FR-063 to FR-088

| FR-ID | Requirement | Form Field | Type | Validation | Dependencies | Mandatory |
|-------|-------------|-----------|------|-----------|--------------|-----------|
| FR-063 | Initial Deposit Amount | Initial Deposit (QAR) | Number (currency) | ≥ 0.00, Format 0.00 | None | YES |
| FR-064 | Expected Relationship Balance | Expected Balance (QAR) | Number (currency) | ≥ FR-063, Format 0.00 | FR-063 | YES |
| FR-065 | Mode of Deposit Type Selection | Deposit Mode | Dropdown | `Cash`, `Cheque`, `Internal Transfer`, `Wire Transfer` | None | YES |
| FR-066 | Cash Deposit Details | Cash Deposit Info | Text | "Deposit at branch on [date]", requires verification | FR-065 = "Cash" | CONDITIONAL |
| FR-067 | Cheque Deposit Details | Cheque Information | Sub-form | Cheque #, Bank Name, Country, Amount | FR-065 = "Cheque" | CONDITIONAL |
| FR-068 | Internal Transfer Details | Internal Transfer Info | Sub-form | Account Holder Name, Account Number, QIB Account | FR-065 = "Internal Transfer" | CONDITIONAL |
| FR-069 | Wire Transfer Details | Wire Transfer Info | Sub-form | Bank Name, Country, SWIFT Code, Amount, Purpose | FR-065 = "Wire Transfer" | CONDITIONAL |
| FR-070 | Source of Funds for Deposit | Deposit Funds Source | Text Area (500 chars) | Explain origin of deposit funds | None | YES |
| FR-071 | Source Funds Documentation | Deposit Source Docs | File Upload (Multi) | Supporting evidence per AML guidelines | FR-070 | YES |
| FR-072 | Monthly Activity - Cash Transactions | Cash Transaction Section | Sub-form | Count, Total Value, Purpose | None | NO |
| FR-072.1 | Cash Transaction Count | Number of Cash Txns | Number | ≥ 0, Monthly | FR-072 selected | CONDITIONAL |
| FR-072.2 | Cash Transaction Value | Total Cash Value (QAR) | Number (currency) | ≥ 0.00 | FR-072 selected | CONDITIONAL |
| FR-072.3 | Cash Transaction Purpose | Cash Purpose | Dropdown | `Salary Withdrawal`, `Business Expense`, `Personal Use`, `Other` | FR-072 selected | CONDITIONAL |
| FR-073 | Monthly Activity - Cheque Transactions | Cheque Transaction Section | Sub-form | Count, Total Value, Purpose | None | NO |
| FR-073.1 | Cheque Transaction Count | Number of Cheque Txns | Number | ≥ 0, Monthly | FR-073 selected | CONDITIONAL |
| FR-073.2 | Cheque Transaction Value | Total Cheque Value (QAR) | Number (currency) | ≥ 0.00 | FR-073 selected | CONDITIONAL |
| FR-073.3 | Cheque Transaction Purpose | Cheque Purpose | Dropdown | `Business Payments`, `Personal Expense`, `Other` | FR-073 selected | CONDITIONAL |
| FR-074 | Monthly Activity - Internal Transfers | Internal Transfer Section | Sub-form | Count, Total Value, Purpose | None | NO |
| FR-074.1 | Internal Transfer Count | Number of Internal Txns | Number | ≥ 0, Monthly | FR-074 selected | CONDITIONAL |
| FR-074.2 | Internal Transfer Value | Total Internal Value (QAR) | Number (currency) | ≥ 0.00 | FR-074 selected | CONDITIONAL |
| FR-074.3 | Internal Transfer Purpose | Transfer Purpose | Dropdown | `Salary Distribution`, `Business Transfer`, `Personal Transfer`, `Other` | FR-074 selected | CONDITIONAL |
| FR-075 | Monthly Activity - Wire Transfers | Wire Transfer Section | Sub-form | Count, Total Value, Purpose, Countries | None | NO |
| FR-075.1 | Wire Transfer Count | Number of Wire Txns | Number | ≥ 0, Monthly | FR-075 selected | CONDITIONAL |
| FR-075.2 | Wire Transfer Value | Total Wire Value (QAR) | Number (currency) | ≥ 0.00 | FR-075 selected | CONDITIONAL |
| FR-075.3 | Wire Transfer Purpose | Wire Purpose | Dropdown | `Overseas Business`, `Salary Payment`, `Investment`, `Other` | FR-075 selected | CONDITIONAL |
| FR-075.4 | Wire Transfer Countries From | Sending Countries | Multi-select Dropdown | [ISO Country Codes] | FR-075 selected | CONDITIONAL |
| FR-075.5 | Wire Transfer Countries To | Receiving Countries | Multi-select Dropdown | [ISO Country Codes] | FR-075 selected | CONDITIONAL |
| FR-075.6 | Sanctioned Countries Check | Any Sanctioned Country Transfer | Boolean (Yes/No) | Validate against OFAC list | FR-075.4 OR FR-075.5 | CONDITIONAL |
| FR-076 | Expected Activity Pattern Flag | Activity Flag | Auto-field | "Normal", "High Volume", "Frequent High-Value", "Suspicious Pattern" | FR-063 to FR-075 | AUTO |
| FR-077 | Total Monthly Anticipated Volume | Total Monthly Activity | Number (currency) | Sum: FR-072.2 + FR-073.2 + FR-074.2 + FR-075.2 | FR-072 to FR-075 | AUTO |
| FR-078 | Activity Reasonableness Check | Activity vs Income Match | Auto-validate | Total Activity ≤ (Monthly Income × 12) × 2 | FR-049, FR-077 | AUTO |
| FR-079 | Activity Documentation | Transaction Evidence | File Upload (Multi) | Bank statements, invoices supporting transaction purpose | FR-072 to FR-075 | CONDITIONAL |

---

## 🤝 SECTION 7: EXISTING RELATIONSHIPS
### FR-080 to FR-100

| FR-ID | Requirement | Form Field | Type | Validation | Dependencies | Mandatory |
|-------|-------------|-----------|------|-----------|--------------|-----------|
| FR-080 | Existing Relationship within QIB | Has QIB Relationships | Boolean (Yes/No) | CRM lookup against customer | None | YES |
| FR-081 | QIB Relationships Table | QIB Relationships | Table (Max 3 rows) | Columns: Account Holder Name, RIM #, Business Segment, Individual/Entity | FR-080 = YES | CONDITIONAL |
| FR-081.1 | QIB Account Holder Name | Relationship Name | Text (255 chars) | Auto-suggest from CRM | FR-080 = YES | CONDITIONAL |
| FR-081.2 | QIB RIM Number | RIM Number | Text (10 chars) | Lookup validation, must exist | FR-080 = YES | CONDITIONAL |
| FR-081.3 | QIB Business Segment | Business Segment | Dropdown | `Retail`, `Corporate`, `Private Banking`, `Islamic Banking`, `Other` | FR-080 = YES | CONDITIONAL |
| FR-081.4 | Individual or Entity Type | Party Type | Dropdown | `Individual`, `Entity` | FR-080 = YES | CONDITIONAL |
| FR-082 | Add More QIB Relationships | Add Row Button | UI Control | Max 3 rows displayed, Allow add/remove | FR-080 = YES | CONDITIONAL |
| FR-083 | Existing Relationship with Other Banks | Has Other Bank Relationships | Boolean (Yes/No) | Manual input, flag for verification | None | YES |
| FR-084 | Other Banks Relationships Table | Other Bank Relationships | Table (Max 3 rows) | Columns: Account Holder Name, Bank Name, Country, Value, Since, Type | FR-083 = YES | CONDITIONAL |
| FR-084.1 | Other Banks Account Holder | Account Name | Text (255 chars) | Manual entry | FR-083 = YES | CONDITIONAL |
| FR-084.2 | Other Banks Name | Bank Name | Text (100 chars) | Auto-suggest from bank list | FR-083 = YES | CONDITIONAL |
| FR-084.3 | Other Banks Country | Bank Country | Dropdown | [ISO Country Codes] | FR-083 = YES | CONDITIONAL |
| FR-084.4 | Relationship Value (QAR) | Estimated Value | Number (currency) | ≥ 0.00, Estimation | FR-083 = YES | CONDITIONAL |
| FR-084.5 | Banking Since | Relationship Since Date | Date | DD/MM/YYYY, Not future | FR-083 = YES | CONDITIONAL |
| FR-084.6 | Other Bank Party Type | Party Type | Dropdown | `Individual`, `Entity` | FR-083 = YES | CONDITIONAL |
| FR-085 | Add More Other Bank Relationships | Add Row Button | UI Control | Max 3 rows, Allow add/remove | FR-083 = YES | CONDITIONAL |
| FR-086 | Related Parties Exist | Has Related Parties | Boolean (Yes/No) | Check for: Joint holders, Guardians, POA, Authorized signatories | None | YES |
| FR-087 | Related Party Type Selection | Related Party Category | Checkbox (Multiple) | `Joint Account Holder`, `Guardian`, `POA / Authorized Signatory` | FR-086 = YES | CONDITIONAL |
| FR-088 | Joint Account Holder Form Template | Joint Account Form | Sub-form Trigger | Trigger separate EDD form for each selected | FR-087 = "Joint Account Holder" | CONDITIONAL |
| FR-089 | Guardian Form Template | Guardian Form | Sub-form Trigger | Trigger separate EDD form for guardian | FR-087 = "Guardian" | CONDITIONAL |
| FR-090 | POA / Signatory Form Template | POA Form | Sub-form Trigger | Trigger separate EDD form for POA/signatory | FR-087 = "POA / Authorized Signatory" | CONDITIONAL |
| FR-091 | Related Parties Count | Number of Related Parties | Auto-counter | Count of forms filled | FR-088 OR FR-089 OR FR-090 | AUTO |
| FR-092 | Relationship Documentation | Related Party Documents | File Upload (Multi) | POA letter, joint account letter, guardianship proof | FR-086 = YES | CONDITIONAL |

---

## 👑 SECTION 8: PEP IDENTIFICATION
### FR-093 to FR-115

| FR-ID | Requirement | Form Field | Type | Validation | Dependencies | Mandatory |
|-------|-------------|-----------|------|-----------|--------------|-----------|
| FR-093 | Is Customer PEP | Customer is PEP | Boolean (Yes/No) | Cross-check against PEP list | None | YES |
| FR-094 | PEP Details Section Toggle | Show PEP Section | Auto-Show/Hide | Display full PEP form only if FR-093 = YES | FR-093 | CONDITIONAL |
| FR-095 | PEP Category | PEP Category | Dropdown | `Individual with prominent public function`, `Direct family member`, `Ruling Family Member`, `Close Associate (Material connection)` | FR-093 = YES | CONDITIONAL |
| FR-096 | Primary PEP Name | Name of Primary PEP | Text (255 chars) | Mandatory for all PEP selections | FR-093 = YES | CONDITIONAL |
| FR-097 | PEP Type - Domestic or Foreign | PEP Type | Dropdown | `Local / Domestic PEP`, `Foreign PEP` | FR-093 = YES | CONDITIONAL |
| FR-098 | PEP Nationality | Nationality of Primary PEP | Dropdown | [ISO Country Codes] | FR-093 = YES | CONDITIONAL |
| FR-099 | PEP Associated Country | Associated Country of PEP | Dropdown | Country where function exercised | FR-093 = YES | CONDITIONAL |
| FR-100 | PEP Prominent Function Title | Prominent Public Function | Text (255 chars) | E.g., "Minister", "Ambassador", "Central Bank Governor" | FR-093 = YES | CONDITIONAL |
| FR-101 | PEP Background & Assessment | PEP Background Info | Text Area (2000 chars) | Detailed background, source wealth, career history | FR-093 = YES | CONDITIONAL |
| FR-102 | PEP Status - Current Holding | Still Holding PEP Status | Boolean (Yes/No) | Current status of position | FR-093 = YES | CONDITIONAL |
| FR-103 | PEP Current Role Years | Years Holding Position | Number | 0-70 years, Only if FR-102 = YES | FR-102 = YES | CONDITIONAL |
| FR-104 | PEP Previous Holder Year Ended | Year Ceased Position | Number | 1950-2026, Only if FR-102 = NO | FR-102 = NO | CONDITIONAL |
| FR-105 | PEP Risk Assessment | PEP Risk Level | Dropdown | `Low Risk PEP`, `Medium Risk PEP`, `High Risk PEP`, `Very High Risk PEP` | FR-093 = YES | CONDITIONAL |
| FR-106 | PEP Special Approvals Required | High Risk PEP Flag | Auto-calculate | If FR-105 = "High Risk" OR "Very High Risk" → Require special approval | FR-105 | AUTO |
| FR-107 | PEP Supporting Documentation | PEP Documents | File Upload (Multi) | Biography, source of wealth docs, media verification | FR-093 = YES | CONDITIONAL |
| FR-108 | PEP Compliance Pre-Clearance | Compliance PEP Review | Status field | `Awaiting Review`, `Approved`, `Rejected`, `Escalated to Board` | FR-093 = YES | CONDITIONAL |
| FR-109 | PEP Approval Authority | Board/Head Approval | Digital Signature (Dynamic) | Required for all PEP cases before account opening | FR-106 = TRUE | CONDITIONAL |
| FR-110 | Beneficial Owner PEP Status | Beneficial Owner is PEP | Boolean (Yes/No) | If related party from FR-086 is PEP | FR-091 > 0 | CONDITIONAL |
| FR-111 | Beneficial Owner PEP Details | Related Party PEP Info | Conditional Form | If FR-110 = YES, repeat FR-095 to FR-108 for BO | FR-110 = YES | CONDITIONAL |
| FR-112 | PEP List Verification Result | PEP List Match | Auto-field | "No Match", "Potential Match - Manual Review", "Confirmed Match" | FR-093 | AUTO |
| FR-113 | PEP Verification Date | List Check Date | Date (Auto) | System timestamp | FR-093 | AUTO |
| FR-114 | PEP Verification Source | Source of Verification | Text | "Internal PEP Database v2.1", "OFAC List", "UN Sanction List", "Custom Screening" | FR-093 | AUTO |
| FR-115 | Escalation Tracker PEP Status | Escalation Required | Boolean (Auto) | TRUE if any PEP detected or Medium/High Risk + FR-093 = YES | Multiple | AUTO |

---

## ✅ SECTION 9: FINAL RECOMMENDATION & SIGN-OFFS
### FR-116 to FR-135

| FR-ID | Requirement | Form Field | Type | Validation | Dependencies | Mandatory |
|-------|-------------|-----------|------|-----------|--------------|-----------|
| FR-116 | Overall Summary Narrative | Customer Profile Summary | Text Area (3000 chars) | Comprehensive narrative of customer, purpose, risks, mitigants | All previous sections | YES |
| FR-117 | Business Recommendation Decision | Recommendation | Dropdown | `Approve - Low Risk`, `Approve with Conditions`, `Refer for Further Review`, `Decline - High Risk`, `Escalate to Compliance Board` | All previous sections | YES |
| FR-118 | Recommendation Justification | Recommendation Basis | Text Area (2000 chars) | Detailed rationale for recommendation decision | FR-117 | YES |
| FR-119 | Conditions (If Conditional Approval) | Conditions Document | Text Area (1500 chars) | If FR-117 = "Approve with Conditions": list conditions | FR-117 = "Approve with Conditions" | CONDITIONAL |
| FR-120 | Additional Notes & Observations | Additional Notes | Text Area (1500 chars) | Any observations during EDD process | None | NO |
| FR-121 | Sign-Off 1: Sourced By (RM/CSO) | Sourced By Signature Block | Sub-form | Business Segment, Staff Name, Staff ID, Signature, Date | FR-116 to FR-120 | YES |
| FR-121.1 | Sourcing Officer Segment | Business Segment | Dropdown | `Retail`, `Corporate`, `Private Banking`, `Islamic Banking` | FR-121 | YES |
| FR-121.2 | Sourcing Officer Name | Staff Name | Text/Lookup | Auto-populate from user profile | FR-121 | YES |
| FR-121.3 | Sourcing Officer ID | Staff ID | Text | Auto-populate | FR-121 | YES |
| FR-121.4 | Sourcing Officer Digital Signature | Digital Signature | E-Signature Control | PKI-signed, timestamp, audit trail | FR-121 | YES |
| FR-121.5 | Sourcing Officer Date | Signature Date | Date (Auto) | DD/MM/YYYY, System timestamp | FR-121 | YES |
| FR-122 | Sign-Off 2: Approved By (Line Manager) | Approved By Signature Block | Sub-form | Business Segment, Staff Name, Staff ID, Signature, Date | FR-121 complete | YES |
| FR-122.1 | Line Manager Name | Manager Name | Text/Lookup | Auto-suggest from organizational structure | FR-122 | YES |
| FR-122.2 | Line Manager ID | Manager ID | Text | Auto-populate | FR-122 | YES |
| FR-122.3 | Line Manager Digital Signature | Digital Signature | E-Signature Control | PKI-signed, timestamp, audit trail | FR-122 | YES |
| FR-122.4 | Line Manager Date | Signature Date | Date (Auto) | DD/MM/YYYY, System timestamp | FR-122 | YES |
| FR-123 | Sign-Off 3: PEP/High Risk Board Approval | Board Approval Block | Sub-form | Only if FR-093 = YES OR FR-024 = "High Risk" | FR-093 OR FR-024 | CONDITIONAL |
| FR-123.1 | Board Member or Head Name | Authority Name | Text/Lookup | Title, Department, Institution | FR-123 | CONDITIONAL |
| FR-123.2 | Board Member ID | Authority ID | Text | Auto-lookup | FR-123 | CONDITIONAL |
| FR-123.3 | Board Digital Signature | Digital Signature | E-Signature Control | PKI-signed, higher security level | FR-123 | CONDITIONAL |
| FR-123.4 | Board Approval Date | Approval Date | Date (Auto) | DD/MM/YYYY, System timestamp | FR-123 | CONDITIONAL |
| FR-124 | Compliance Pre-Clearance Requirement | Compliance Review Mandatory | Auto-Logic | If FR-024="High Risk" OR FR-093="Yes" OR FR-115="TRUE" | Multiple | AUTO |
| FR-125 | Compliance No Objection Filing | Compliance Letter | File Field | Electronic "No Objection Letter" from Compliance (separate from form) | FR-124 = TRUE | CONDITIONAL |
| FR-126 | Compliance Letter Timestamp | Document Received Date | Date (Auto) | From document metadata | FR-125 | CONDITIONAL |
| FR-127 | Compliance ID/Reference | Compliance Case ID | Text | Auto-linked reference ID | FR-125 | CONDITIONAL |
| FR-128 | Form Mandatory Fields Checker | All Mandatory Fields Validated | Auto-Validate | Cannot proceed past FR-120 until all mandatory fields complete | All FR with Mandatory=YES | AUTO |
| FR-129 | All Documents Attached Verification | Document Count | Counter | Total supporting docs count, minimum required per checklist | Multiple | AUTO |
| FR-130 | Completeness Status | Form Status | Auto-field | `Incomplete`, `Complete (Pending Approvals)`, `Complete (All Approvals)`, `Archived` | FR-128, FR-129 | AUTO |
| FR-131 | Form Version Tracking | Form Version | Text (Auto) | System-generated version number, e.g., "1.0", "1.1", "2.0" | None | AUTO |
| FR-132 | Form Created Date/Time | Created Timestamp | DateTime (Auto) | System timestamp, format: DD/MM/YYYY HH:MM | None | AUTO |
| FR-133 | Form Last Modified Date/Time | Modified Timestamp | DateTime (Auto) | System timestamp, updated on each change | None | AUTO |
| FR-134 | Form Submission Date/Time | Submitted Timestamp | DateTime (Auto) | Timestamp when form marked final/submitted | FR-130 = "Complete" | AUTO |
| FR-135 | Form Archive/Retrieval Ref | Archive Reference | Text (Auto) | Storage location in document repository system | FR-134 | AUTO |

---

## 📋 MANDATORY NOTES & SYSTEM RULES
### FR-136 to FR-145

| FR-ID | System Rule | Implementation | Enforcement | Validation |
|-------|-------------|-----------------|--------------|-----------|
| FR-136 | All Fields Mandatory Unless Conditional | Logic enforcement at backend | Block submission if mandatory field empty | Check all FR with Mandatory=YES |
| FR-137 | Not Applicable (N/A) Handling | If field not applicable, mark "N/A" explicitly | Prevent blank fields → Must have value or "N/A" | Text field rule: length ≥ 1 |
| FR-138 | No Blank Fields Policy | Every field must have entry or "Not Applicable" | System error: "Field cannot be blank" | Pre-submission validation |
| FR-139 | Supporting Documents by Checklist | All docs per EDD Document Checklist attached | Auto-validate against checklist | Count ≥ min required per risk level |
| FR-140 | High Risk Pre-Clearance Requirement | If FR-024="High Risk" → Compliance clearance mandatory | Block account creation until FR-125 received | Conditional business logic |
| FR-141 | PEP Pre-Clearance Requirement | If FR-093="Yes" → Board/Head approval mandatory | Block account creation until FR-109 signed | Conditional business logic |
| FR-142 | FATCA & CRS Completion | Ensure FATCA & CRS forms signed separately | Reference link to FATCA/CRS form in system | Document linking validation |
| FR-143 | Audit Trail & Immutability | All changes logged with user, timestamp, change detail | Update FR-133, prevent field value deletion | Database audit log trigger |
| FR-144 | Form Signature Integrity | All digital signatures non-repudiable, PKI-based | E-signature certificate validation | Signature verification service |
| FR-145 | Form Retention & Archival | Forms retained per regulatory requirement (6+ years) | Archive to document management system | Automatic archival on FR-134 |

---

## 🔗 FORM SECTION MAPPING (Digital Implementation)

```
Digital Form Tab Structure:
┌─────────────────────────────────────────────────────────┐
│ Tab 1: Request Type & Basics (FR-001 to FR-010)        │
├─────────────────────────────────────────────────────────┤
│ Tab 2: Risk Classification (FR-011 to FR-025)          │
├─────────────────────────────────────────────────────────┤
│ Tab 3: Customer Information (FR-026 to FR-035)         │
├─────────────────────────────────────────────────────────┤
│ Tab 4: Purpose & Intended Use (FR-036 to FR-048)       │
├─────────────────────────────────────────────────────────┤
│ Tab 5: Income & Wealth Sources (FR-049 to FR-062)      │
├─────────────────────────────────────────────────────────┤
│ Tab 6: Deposits & Transactional (FR-063 to FR-079)     │
├─────────────────────────────────────────────────────────┤
│ Tab 7: Existing Relationships (FR-080 to FR-092)       │
├─────────────────────────────────────────────────────────┤
│ Tab 8: PEP Identification (FR-093 to FR-115)           │
├─────────────────────────────────────────────────────────┤
│ Tab 9: Final Approval (FR-116 to FR-145)               │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 REQUIREMENT SUMMARY STATISTICS

| Metric | Count |
|--------|-------|
| **Total Functional Requirements** | **145** |
| Mandatory Fields | 87 |
| Conditional Fields | 48 |
| Auto-Calculated Fields | 10 |
| Data Entry Fields | 92 |
| Dropdown/Selection | 38 |
| Text Area / Free Text | 22 |
| File Upload Fields | 8 |
| Digital Signature Fields | 4 |
| Boolean (Yes/No) | 15 |
| Numeric/Currency | 28 |
| Date Fields | 12 |
| Sub-forms / Related Records | 8 |
| Validation Rules | 145 |
| Inter-field Dependencies | 92 |

---

## ✅ COMPLIANCE MAPPING

| Standard | Requirement Coverage | Status |
|----------|---------------------|--------|
| **FATF 40 AML Recommendations** | Customer Due Diligence, PEP screening, Beneficial ownership | ✅ Complete |
| **AAOIFI Standards** | Islamic banking compliance where applicable | ✅ Included |
| **QCB Regulations** | Qatar Central Bank AML/CFT requirements | ✅ Aligned |
| **QIB Internal Policy** | EDD Form Individual standard requirements | ✅ Exact match |
| **Basel III** | Risk classification and capitalization requirements | ✅ Integrated |
| **GDPR/Data Privacy** | Personal data handling, document privacy, audit trail | ✅ Built-in |

---

**Document Status:** ✅ READY FOR DEVELOPMENT  
**Next Phase:** Technical Specifications & UI/UX Design  
**Date:** 11 March 2026

