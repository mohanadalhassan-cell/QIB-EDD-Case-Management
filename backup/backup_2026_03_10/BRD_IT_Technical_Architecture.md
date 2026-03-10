# EDD Case Management System
# Technical Data Sources and Field Integration
## IT Architecture & Integration Specification

**Document Version:** 1.0  
**Date:** March 2026  
**Classification:** Internal - IT Department  
**Target Audience:** IT Architecture Team, Integration Team, FLOW Development Team, Core Banking Team, QA Team

---

## 1. Executive Summary

This document provides the complete technical specification for the EDD Case Management System integration with QIB's enterprise systems. The system operates within the **FLOW Workflow Platform** and integrates with multiple data sources to provide a unified EDD case management experience.

### 1.1 System Context Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              QIB ENTERPRISE ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│    ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  │
│    │    T24     │  │  SnapView  │  │  QCB KYC   │  │   RISK     │  │    DMS     │  │
│    │Core Banking│  │ Reporting  │  │    API     │  │  ENGINE    │  │ Documents  │  │
│    └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  │
│          │               │               │               │               │          │
│          └───────────────┴───────┬───────┴───────────────┴───────────────┘          │
│                                  │                                                   │
│                    ┌─────────────▼─────────────┐                                    │
│                    │    ESB Integration Layer   │                                    │
│                    │   (Enterprise Service Bus) │                                    │
│                    └─────────────┬─────────────┘                                    │
│                                  │                                                   │
│    ┌─────────────────────────────▼─────────────────────────────────────────────┐    │
│    │                                                                           │    │
│    │                      FLOW WORKFLOW PLATFORM                               │    │
│    │    ┌───────────────────────────────────────────────────────────────┐     │    │
│    │    │              EDD CASE MANAGEMENT SYSTEM                        │     │    │
│    │    │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │     │    │
│    │    │  │Case Mgmt│ │ Forms   │ │Workflow │ │Dashboard│ │Risk Panel│  │     │    │
│    │    │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘  │     │    │
│    │    └───────────────────────────────────────────────────────────────┘     │    │
│    │                                                                           │    │
│    └───────────────────────────────────────────────────────────────────────────┘    │
│                                     │                                               │
│           ┌─────────────────────────┼─────────────────────────┐                     │
│           │                         │                         │                     │
│    ┌──────▼──────┐          ┌───────▼───────┐         ┌───────▼──────┐             │
│    │ Email/SMS   │          │  Audit Log    │         │Mobile Banking│             │
│    │Notifications│          │   System      │         │  Push/App    │             │
│    └─────────────┘          └───────────────┘         └──────────────┘             │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Integration Architecture Overview

### 2.1 Connected Systems

| System | Purpose | Integration Type | Protocol | Direction |
|--------|---------|-----------------|----------|-----------|
| **T24 Core Banking** | Customer master data, accounts, risk classification | ESB API | REST/SOAP | Bidirectional |
| **SnapView/Snapshot** | Financial analytics, income verification, transaction patterns | ETL/API | REST | Read-Only |
| **QCB KYC API** | Regulatory documents, external verification | REST API | HTTPS | Read-Only |
| **DMS** | Document storage & retrieval | REST API | HTTPS | Bidirectional |
| **FLOW** | Workflow engine, case management | Internal | Native | Bidirectional |
| **ESB** | Integration middleware | SOAP/REST | HTTPS | Bidirectional |
| **Email Server** | Notifications to staff | SMTP | TCP | Write-Only |
| **Mobile Banking** | Push notifications, SMS to customers | REST API | HTTPS | Write-Only |

### 2.2 Data Flow Architecture

```
                    ┌─────────────────────────────────────────┐
                    │           TRIGGER SOURCES               │
                    │  T24 CRP → High Risk Classification     │
                    │  Management → Manual Referral           │
                    │  Periodic → Next EDD Due Date           │
                    └─────────────────┬───────────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                              EDD CASE CREATION                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │ Generate Case ID │  │ Fetch T24 Data  │  │ Route to Segment│              │
│  │ FLOW Internal    │  │ via ESB         │  │ Based on T24    │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
└──────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                           DATA ENRICHMENT LAYER                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │ T24 Customer    │  │ SnapView        │  │ QCB KYC API     │              │
│  │ - RIM           │  │ - Salary Data   │  │ - Passport      │              │
│  │ - Name          │  │ - Income        │  │ - ID Card       │              │
│  │ - Segment       │  │ - Transactions  │  │ - Certificates  │              │
│  │ - KYC Date      │  │ - Balance Hist  │  │ - Address Proof │              │
│  │ - Risk Class    │  │ - Employment    │  │ (If Consent)    │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
└──────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         WORKFLOW PROCESSING (FLOW)                           │
│  ┌───────────┐ → ┌───────────┐ → ┌───────────┐ → ┌───────────┐              │
│  │ Business  │   │ Business  │   │   CDD     │   │   CDD     │              │
│  │   Maker   │   │  Checker  │   │   Maker   │   │  Checker  │              │
│  └───────────┘   └───────────┘   └───────────┘   └───────────┘              │
│                                                        │                     │
│                                   ┌────────────────────┴────────────────┐    │
│                                   │                                     │    │
│                                   ▼                                     ▼    │
│                          ┌───────────────┐                    ┌─────────────┐│
│                          │   Compliance  │                    │   Approved  ││
│                          │   Escalation  │                    │   (Close)   ││
│                          └───────────────┘                    └─────────────┘│
└──────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                            T24 WRITEBACK                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │ EDD Status      │  │ EDD Decision    │  │ Account         │              │
│  │ Completion Date │  │ Next Due Date   │  │ Restriction     │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
│                                                                              │
│  Target: T24 EDD Profile Section (New Fields to be Created)                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Complete Field Mapping - Data Sources

### 3.1 Section 1: Customer Identification & Relationship

| Field Name (English) | Field Name (Arabic) | Description | Source System | Integration Type | Auto-Filled | Mandatory | Stored In | API Endpoint |
|---------------------|---------------------|-------------|---------------|-----------------|-------------|-----------|-----------|--------------|
| EDD Case ID | رقم ملف EDD | Unique case identifier | FLOW | Internal | Yes | Yes | FLOW | N/A |
| Case Creation Date | تاريخ إنشاء الملف | System timestamp | FLOW | Internal | Yes | Yes | FLOW | N/A |
| Case Status | حالة الملف | Current workflow state | FLOW | Internal | Yes | Yes | FLOW | N/A |
| RIM Number | رقم RIM | Customer unique ID in T24 | T24 | ESB/API | Yes | Yes | T24 | `/customer/rim/{id}` |
| Customer Name (English) | اسم العميل (انجليزي) | Full legal name | T24 | ESB/API | Yes | Yes | T24 | `/customer/rim/{id}` |
| Customer Name (Arabic) | اسم العميل (عربي) | Full legal name in Arabic | T24 | ESB/API | Yes | Yes | T24 | `/customer/rim/{id}` |
| Customer Segment | الشريحة | Mass / Tamayuz / Private | T24 | ESB/API | Yes | Yes | T24 | `/customer/segment/{rim}` |
| Relationship Opening Date | تاريخ فتح العلاقة | Account opened date | T24 | ESB/API | Yes | Yes | T24 | `/customer/rim/{id}` |
| Type of Relationship | نوع العلاقة | New / Existing | Manual Entry | Form Input | No | Yes | EDD Section | N/A |
| Account Opening Reason | سبب فتح الحساب | New / Additional / Upgrade | Manual Entry | Form Input | No | Yes | EDD Section | N/A |
| Customer Type | نوع العميل | Customer / Joint / Guardian / POA | T24 | ESB/API | Yes | Yes | T24 | `/customer/rim/{id}` |

### 3.2 Section 2: Risk Classification

| Field Name (English) | Field Name (Arabic) | Description | Source System | Integration Type | Auto-Filled | Mandatory | Stored In | API Endpoint |
|---------------------|---------------------|-------------|---------------|-----------------|-------------|-----------|-----------|--------------|
| Overall Risk Classification | التصنيف العام للمخاطر | Low / Medium / High | T24 CRP | ESB/API | Yes | Yes | T24 | `/risk/classification/{rim}` |
| PEP Status | هل العميل PEP؟ | Politically Exposed Person flag | T24 | ESB/API | Yes | Yes | T24 | `/customer/pep/{rim}` |
| PEP Type | نوع PEP | Domestic / Foreign / Family Member | T24 | ESB/API | Yes | Conditional | T24 | `/customer/pep/{rim}` |
| PEP Position | منصب PEP | Government position details | T24 + Manual | ESB/API + Form | Partial | Conditional | EDD Section | `/customer/pep/{rim}` |
| Non-Resident Status | هل العميل غير مقيم؟ | Residency flag | T24 | ESB/API | Yes | Yes | T24 | `/customer/rim/{id}` |
| High Risk Nationality | الجنسية عالية المخاطر | Nationality risk flag | T24 | ESB/API | Yes | Yes | T24 | `/customer/rim/{id}` |
| Nationality | الجنسية | Customer nationality | T24 | ESB/API | Yes | Yes | T24 | `/customer/rim/{id}` |
| Country of Residence | بلد الإقامة | Current residence country | T24 | ESB/API | Yes | Yes | T24 | `/customer/rim/{id}` |
| High Risk Occupation | المهنة عالية المخاطر | Occupation risk flag | T24 CRP | ESB/API | Yes | Yes | T24 | `/risk/classification/{rim}` |
| Risk Trigger Reasons | أسباب تصنيف المخاطر | Array of trigger codes | T24 CRP | ESB/API | Yes | Yes | FLOW | `/risk/triggers/{rim}` |
| EDD Trigger Source | مصدر حالة EDD | T24/CRP, Management, Periodic | FLOW | Internal | Yes | Yes | FLOW | N/A |

### 3.3 Section 3: KYC & Identity Documents

| Field Name (English) | Field Name (Arabic) | Description | Source System | Integration Type | Auto-Filled | Mandatory | Stored In | API Endpoint |
|---------------------|---------------------|-------------|---------------|-----------------|-------------|-----------|-----------|--------------|
| Last KYC Review Date | تاريخ آخر مراجعة KYC | Most recent KYC date | T24 | ESB/API | Yes | Yes | T24 | `/kyc/last-review/{rim}` |
| Next EDD Due Date | تاريخ مراجعة EDD القادم | Calculated next review | Derived | Calculation | Yes | Yes | T24 + FLOW | Calculated |
| QCB Consent Status | حالة موافقة QCB | Customer consent for QCB API | T24 | ESB/API | Yes | Yes | T24 | `/customer/consent/{rim}` |
| Passport Copy | نسخة جواز السفر | Passport document | DMS + QCB API | API | Yes | Yes | DMS | `/dms/document/{type}/{rim}` |
| ID Card Copy | نسخة بطاقة الهوية | National ID document | DMS + QCB API | API | Yes | Yes | DMS | `/dms/document/{type}/{rim}` |
| Address Proof | إثبات العنوان | Address verification document | DMS + QCB API | API | Yes | Conditional | DMS | `/dms/document/{type}/{rim}` |
| Photo | صورة شخصية | Customer photograph | DMS | API | Yes | Yes | DMS | `/dms/document/{type}/{rim}` |
| ID Expiry Date | تاريخ انتهاء الهوية | ID document expiry | T24 | ESB/API | Yes | Yes | T24 | `/customer/rim/{id}` |
| Passport Expiry Date | تاريخ انتهاء الجواز | Passport expiry date | T24 | ESB/API | Yes | Yes | T24 | `/customer/rim/{id}` |

### 3.4 Section 4: Income & Employment (Salary)

| Field Name (English) | Field Name (Arabic) | Description | Source System | Integration Type | Auto-Filled | Mandatory | Stored In | API Endpoint |
|---------------------|---------------------|-------------|---------------|-----------------|-------------|-----------|-----------|--------------|
| Employment Status | حالة التوظيف | Employed / Self-Employed / Retired | SnapView | ETL/API | Yes | Yes | T24 + EDD | `/snapview/employment/{rim}` |
| Employer Name | اسم جهة العمل | Company/Organization name | SnapView | ETL/API | Yes | Conditional | T24 | `/snapview/employment/{rim}` |
| Employer Address | عنوان جهة العمل | Employer location | SnapView | ETL/API | Yes | Conditional | EDD Section | `/snapview/employment/{rim}` |
| Job Title / Designation | المسمى الوظيفي | Current job position | SnapView | ETL/API | Yes | Conditional | EDD Section | `/snapview/employment/{rim}` |
| Years with Employer | سنوات الخدمة | Employment duration | SnapView | ETL/API | Yes | Conditional | EDD Section | `/snapview/employment/{rim}` |
| Monthly Salary (QAR) | الراتب الشهري | Declared monthly salary | SnapView | ETL/API | Yes | Conditional | EDD Section | `/snapview/salary/{rim}` |
| Salary Transfer to QIB | تحويل الراتب إلى QIB | Whether salary credited to QIB | T24 Transactions | ESB/API | Yes | Conditional | EDD Section | `/transactions/salary/{rim}` |
| Salary Certificate | شهادة الراتب | Employment salary proof | DMS + QCB API | API | Partial | Conditional | DMS | `/dms/document/{type}/{rim}` |
| Employer Letter | خطاب جهة العمل | Employment verification letter | DMS | API | No | Conditional | DMS | `/dms/upload` |

### 3.5 Section 5: Business Income

| Field Name (English) | Field Name (Arabic) | Description | Source System | Integration Type | Auto-Filled | Mandatory | Stored In | API Endpoint |
|---------------------|---------------------|-------------|---------------|-----------------|-------------|-----------|-----------|--------------|
| Business Owner Flag | هل يملك عمل تجاري؟ | Customer is business owner | Manual + T24 | Form + API | Partial | Conditional | EDD Section | N/A |
| Business Name | اسم الشركة | Company legal name | T24 + Manual | ESB/API + Form | Partial | Conditional | EDD Section | `/customer/business/{rim}` |
| Business Type | نوع النشاط | Industry / sector | Manual Entry | Form Input | No | Conditional | EDD Section | N/A |
| CR Number | رقم السجل التجاري | Commercial Registration | Manual + QCB | Form + API | Partial | Conditional | EDD Section | `/qcb/cr/{number}` |
| Business Ownership % | نسبة الملكية | Percentage owned | Manual Entry | Form Input | No | Conditional | EDD Section | N/A |
| Years in Business | سنوات النشاط | Business duration | Manual Entry | Form Input | No | Conditional | EDD Section | N/A |
| Monthly Business Income | الدخل الشهري من العمل | Estimated monthly income | Manual Entry | Form Input | No | Conditional | EDD Section | N/A |
| QIB Business Account | حساب تجاري في QIB | Has business account at QIB | T24 | ESB/API | Yes | No | EDD Section | `/accounts/business/{rim}` |
| Business Registration Docs | مستندات تسجيل الشركة | CR certificate, license | DMS | API | No | Conditional | DMS | `/dms/upload` |
| Financial Statements | القوائم المالية | Audited financials (if available) | DMS | API | No | Conditional | DMS | `/dms/upload` |

### 3.6 Section 6: Property & Rental Income

| Field Name (English) | Field Name (Arabic) | Description | Source System | Integration Type | Auto-Filled | Mandatory | Stored In | API Endpoint |
|---------------------|---------------------|-------------|---------------|-----------------|-------------|-----------|-----------|--------------|
| Property Owner Flag | هل يملك عقارات؟ | Customer owns property | Manual Entry | Form Input | No | Conditional | EDD Section | N/A |
| Property Type | نوع العقار | Residential / Commercial / Land | Manual Entry | Form Input | No | Conditional | EDD Section | N/A |
| Property Location | موقع العقار | Property address / area | Manual Entry | Form Input | No | Conditional | EDD Section | N/A |
| Property Value (QAR) | قيمة العقار | Estimated value | Manual Entry | Form Input | No | Conditional | EDD Section | N/A |
| Monthly Rental Income | الدخل الشهري من الإيجار | If rented out | Manual Entry | Form Input | No | Conditional | EDD Section | N/A |
| Rental Agreement | عقد الإيجار | Property rental contract | DMS | API | No | Conditional | DMS | `/dms/upload` |
| Property Title Deed | سند الملكية | Ownership proof | DMS | API | No | Conditional | DMS | `/dms/upload` |

### 3.7 Section 7: Investment Income

| Field Name (English) | Field Name (Arabic) | Description | Source System | Integration Type | Auto-Filled | Mandatory | Stored In | API Endpoint |
|---------------------|---------------------|-------------|---------------|-----------------|-------------|-----------|-----------|--------------|
| Investment Portfolio Flag | هل لديه استثمارات؟ | Customer has investments | T24 + Manual | ESB/API + Form | Partial | Conditional | EDD Section | `/investments/{rim}` |
| Investment Types | أنواع الاستثمارات | Stocks / Sukuk / Funds / Real Estate | Manual Entry | Form Input | No | Conditional | EDD Section | N/A |
| Investment Institution | مؤسسة الاستثمار | Where investments are held | Manual Entry | Form Input | No | Conditional | EDD Section | N/A |
| Monthly Investment Income | الدخل الشهري من الاستثمار | Dividends, returns | Manual Entry | Form Input | No | Conditional | EDD Section | N/A |
| Investment Statements | كشوفات الاستثمار | Portfolio statements | DMS | API | No | Conditional | DMS | `/dms/upload` |

### 3.8 Section 8: Source of Wealth

| Field Name (English) | Field Name (Arabic) | Description | Source System | Integration Type | Auto-Filled | Mandatory | Stored In | API Endpoint |
|---------------------|---------------------|-------------|---------------|-----------------|-------------|-----------|-----------|--------------|
| Source of Wealth Categories | مصادر الثروة | Multiple selection checkbox | Manual Entry | Form Input | No | Yes | EDD Section | N/A |
| - Salary Accumulation | - تراكم الرواتب | From employment | Manual Entry | Form Input | No | Conditional | EDD Section | N/A |
| - Business Profits | - أرباح تجارية | From business | Manual Entry | Form Input | No | Conditional | EDD Section | N/A |
| - Inheritance | - إرث | From deceased family | Manual Entry | Form Input | No | Conditional | EDD Section | N/A |
| - Gift / Donation | - هبة | From relatives/others | Manual Entry | Form Input | No | Conditional | EDD Section | N/A |
| - Sale of Property | - بيع عقار | Real estate sale | Manual Entry | Form Input | No | Conditional | EDD Section | N/A |
| - Investment Returns | - عوائد استثمار | From investments | Manual Entry | Form Input | No | Conditional | EDD Section | N/A |
| - Retirement Benefits | - مكافأة نهاية الخدمة | End of service gratuity | Manual Entry | Form Input | No | Conditional | EDD Section | N/A |
| Source of Wealth Explanation | شرح مصدر الثروة | Detailed narrative | Manual Entry | Form Input | No | Yes | EDD Section | N/A |
| Source of Wealth Documents | مستندات مصدر الثروة | Supporting evidence | DMS | API | No | Conditional | DMS | `/dms/upload` |
| Estimated Net Worth | صافي الثروة التقديري | Wealth band selection | Manual Entry | Form Input | No | Yes | EDD Section | N/A |

### 3.9 Section 9: Source of Funds / Initial Deposit

| Field Name (English) | Field Name (Arabic) | Description | Source System | Integration Type | Auto-Filled | Mandatory | Stored In | API Endpoint |
|---------------------|---------------------|-------------|---------------|-----------------|-------------|-----------|-----------|--------------|
| Initial Deposit Amount | مبلغ الإيداع الأولي | Amount of first deposit | T24 | ESB/API | Yes | Conditional | EDD Section | `/transactions/initial/{rim}` |
| Mode of Deposit | طريقة الإيداع | Cash / Cheque / Transfer | T24 | ESB/API | Yes | Conditional | EDD Section | `/transactions/initial/{rim}` |
| Transfer Source Bank | البنك المحول منه | If transfer, origin bank | T24 | ESB/API | Partial | Conditional | EDD Section | `/transactions/initial/{rim}` |
| Transfer Source Account | رقم الحساب المحول منه | Origin account number | T24 | ESB/API | Partial | Conditional | EDD Section | `/transactions/initial/{rim}` |
| Transfer Source Name | اسم صاحب الحساب المحول | Account holder name | T24 | ESB/API | Partial | Conditional | EDD Section | `/transactions/initial/{rim}` |
| Cheque Details | تفاصيل الشيك | Cheque number, bank | T24 | ESB/API | Partial | Conditional | EDD Section | `/transactions/initial/{rim}` |
| Expected Relationship Size | حجم العلاقة المتوقع | Expected future balance | Manual Entry | Form Input | No | Conditional | EDD Section | N/A |
| Expected Transaction Volume | حجم المعاملات المتوقع | Monthly transaction estimate | Manual Entry | Form Input | No | Conditional | EDD Section | N/A |

### 3.10 Section 10: Data Mismatch & Discrepancies

| Field Name (English) | Field Name (Arabic) | Description | Source System | Integration Type | Auto-Filled | Mandatory | Stored In | API Endpoint |
|---------------------|---------------------|-------------|---------------|-----------------|-------------|-----------|-----------|--------------|
| Data Comparison Status | حالة مقارنة البيانات | Match / Mismatch flag | Derived | Calculation | Yes | Yes | FLOW | Calculated |
| T24 vs QCB Name Match | مطابقة الاسم | Name comparison result | Derived | Calculation | Yes | Yes | FLOW | Calculated |
| T24 vs QCB ID Match | مطابقة الهوية | ID comparison result | Derived | Calculation | Yes | Yes | FLOW | Calculated |
| T24 vs QCB DOB Match | مطابقة تاريخ الميلاد | DOB comparison result | Derived | Calculation | Yes | Yes | FLOW | Calculated |
| T24 vs SnapView Salary Match | مطابقة الراتب | Salary comparison result | Derived | Calculation | Yes | Conditional | FLOW | Calculated |
| Mismatch Fields List | قائمة الحقول المتعارضة | Array of mismatched fields | Derived | Calculation | Yes | Conditional | FLOW | N/A |
| T24 Value | قيمة T24 | Value from T24 | T24 | ESB/API | Yes | Conditional | FLOW | Various |
| QCB Value | قيمة QCB | Value from QCB API | QCB API | API | Yes | Conditional | FLOW | Various |
| Resolution Action | إجراء الحل | How mismatch was resolved | Manual Entry | Form Input | No | Conditional | EDD Section | N/A |
| Resolution Comments | ملاحظات الحل | Staff explanation | Manual Entry | Form Input | No | Conditional | EDD Section | N/A |

### 3.11 Section 11: Workflow & Approvals

| Field Name (English) | Field Name (Arabic) | Description | Source System | Integration Type | Auto-Filled | Mandatory | Stored In | API Endpoint |
|---------------------|---------------------|-------------|---------------|-----------------|-------------|-----------|-----------|--------------|
| Current Stage | المرحلة الحالية | Workflow current stage | FLOW | Internal | Yes | Yes | FLOW | N/A |
| Assigned To (User ID) | معين إلى | Current assignee | FLOW | Internal | Yes | Yes | FLOW | N/A |
| Assigned Department | القسم المعين | Business / CDD / Compliance | FLOW | Internal | Yes | Yes | FLOW | N/A |
| Business Maker ID | موظف Business Maker | Staff ID | FLOW | Internal | Yes | Yes | FLOW | N/A |
| Business Maker Decision | قرار Business Maker | Approve / Return / Escalate | FLOW | Internal | Yes | Yes | FLOW | N/A |
| Business Maker Date | تاريخ Business Maker | Timestamp | FLOW | Internal | Yes | Yes | FLOW | N/A |
| Business Maker Comments | ملاحظات Business Maker | Justification text | Manual Entry | Form Input | No | Yes | FLOW | N/A |
| Business Checker ID | موظف Business Checker | Staff ID | FLOW | Internal | Yes | Yes | FLOW | N/A |
| Business Checker Decision | قرار Business Checker | Approve / Return / Escalate | FLOW | Internal | Yes | Yes | FLOW | N/A |
| Business Checker Date | تاريخ Business Checker | Timestamp | FLOW | Internal | Yes | Yes | FLOW | N/A |
| Business Checker Comments | ملاحظات Business Checker | Justification text | Manual Entry | Form Input | No | Yes | FLOW | N/A |
| CDD Maker ID | موظف CDD Maker | Staff ID | FLOW | Internal | Yes | Yes | FLOW | N/A |
| CDD Maker Decision | قرار CDD Maker | Approve / Return / Escalate | FLOW | Internal | Yes | Yes | FLOW | N/A |
| CDD Maker Date | تاريخ CDD Maker | Timestamp | FLOW | Internal | Yes | Yes | FLOW | N/A |
| CDD Maker Comments | ملاحظات CDD Maker | Justification text | Manual Entry | Form Input | No | Yes | FLOW | N/A |
| CDD Checker ID | موظف CDD Checker | Staff ID | FLOW | Internal | Yes | Yes | FLOW | N/A |
| CDD Checker Decision | قرار CDD Checker | Approve / Reject / Escalate | FLOW | Internal | Yes | Yes | FLOW | N/A |
| CDD Checker Date | تاريخ CDD Checker | Timestamp | FLOW | Internal | Yes | Yes | FLOW | N/A |
| CDD Checker Comments | ملاحظات CDD Checker | Justification text | Manual Entry | Form Input | No | Yes | FLOW | N/A |
| Compliance Reviewer ID | موظف Compliance | Staff ID | FLOW | Internal | Conditional | Conditional | FLOW | N/A |
| Compliance Decision | قرار Compliance | Final decision | FLOW | Internal | Conditional | Conditional | FLOW | N/A |
| Compliance Comments | ملاحظات Compliance | Justification text | Manual Entry | Form Input | No | Conditional | FLOW | N/A |
| EDD Recommendation | توصية EDD | Continue / Restrict / Exit | Manual Entry | Form Input | No | Yes | EDD Section | N/A |
| Account Restriction Flag | علامة تقييد الحساب | Yes / No | Derived | API Write | No | Conditional | T24 | `/accounts/restrict/{rim}` |

---

## 4. Data Retrieval Logic

### 4.1 Case Creation Sequence

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EDD CASE CREATION SEQUENCE                          │
└─────────────────────────────────────────────────────────────────────────────┘

   T24 CRP                    FLOW                         ESB
      │                         │                           │
      │  1. High Risk Event     │                           │
      │────────────────────────▶│                           │
      │                         │                           │
      │                         │  2. Generate Case ID      │
      │                         │  (EDD-YYYY-NNNNNN)        │
      │                         │                           │
      │                         │  3. Request Customer Data │
      │                         │──────────────────────────▶│
      │                         │                           │
      │                         │                           │  4. Fetch T24 Customer
      │                         │                           │──────────────────────▶ T24
      │                         │                           │◀──────────────────────
      │                         │                           │
      │                         │                           │  5. Fetch SnapView Data
      │                         │                           │──────────────────────▶ SnapView
      │                         │                           │◀──────────────────────
      │                         │                           │
      │                         │  6. Return Enriched Data  │
      │                         │◀──────────────────────────│
      │                         │                           │
      │                         │  7. Check QCB Consent     │
      │                         │──────────────────────────▶│
      │                         │                           │──────────────────────▶ T24
      │                         │                           │◀──────────────────────
      │                         │                           │
      │                         │  8. If Consent = Yes      │
      │                         │──────────────────────────▶│
      │                         │                           │──────────────────────▶ QCB API
      │                         │                           │◀──────────────────────
      │                         │                           │
      │                         │  9. Fetch DMS Documents   │
      │                         │──────────────────────────▶│
      │                         │                           │──────────────────────▶ DMS
      │                         │                           │◀──────────────────────
      │                         │                           │
      │                         │ 10. Route to Business     │
      │                         │     (Based on Segment)    │
      │                         │                           │
      │                         │ 11. Start SLA Timer       │
      │                         │                           │
```

### 4.2 ESB API Request/Response Examples

#### 4.2.1 Customer Data Request

**Request:**
```json
{
  "requestId": "REQ-2024-123456",
  "timestamp": "2024-02-15T09:30:00Z",
  "source": "FLOW-EDD",
  "targetSystem": "T24",
  "operation": "GET_CUSTOMER",
  "parameters": {
    "rim": "RIM001234"
  }
}
```

**Response:**
```json
{
  "responseId": "RES-2024-123456",
  "timestamp": "2024-02-15T09:30:01Z",
  "status": "SUCCESS",
  "data": {
    "rim": "RIM001234",
    "customerName": "Abdullah Mohammed Al-Kuwari",
    "customerNameAr": "عبدالله محمد الكواري",
    "nationality": "QA",
    "dateOfBirth": "1975-03-15",
    "gender": "M",
    "segment": "PRIVATE",
    "riskClassification": "HIGH",
    "accountOpenDate": "2018-06-20",
    "lastKYCDate": "2023-06-20",
    "isPEP": true,
    "pepType": "DOMESTIC",
    "pepPosition": "Former Minister of Commerce",
    "isNonResident": false,
    "qcbConsent": true,
    "email": "abdullah.alkuwari@email.com",
    "mobile": "+97455551234",
    "address": {
      "line1": "West Bay",
      "city": "Doha",
      "country": "Qatar"
    }
  }
}
```

#### 4.2.2 SnapView Salary Data Request

**Request:**
```json
{
  "requestId": "REQ-2024-123457",
  "timestamp": "2024-02-15T09:30:02Z",
  "source": "FLOW-EDD",
  "targetSystem": "SNAPVIEW",
  "operation": "GET_SALARY_DATA",
  "parameters": {
    "rim": "RIM001234",
    "period": "LAST_12_MONTHS"
  }
}
```

**Response:**
```json
{
  "responseId": "RES-2024-123457",
  "timestamp": "2024-02-15T09:30:03Z",
  "status": "SUCCESS",
  "data": {
    "rim": "RIM001234",
    "employmentStatus": "EMPLOYED",
    "employer": "Al-Kuwari Trading Group",
    "jobTitle": "CEO",
    "yearsEmployed": 15,
    "salaryHistory": [
      { "month": "2024-01", "amount": 450000, "currency": "QAR" },
      { "month": "2023-12", "amount": 450000, "currency": "QAR" }
    ],
    "averageSalary": 450000,
    "salaryTransferToQIB": true,
    "lastSalaryDate": "2024-01-28"
  }
}
```

#### 4.2.3 QCB KYC API Document Request

**Request:**
```json
{
  "requestId": "REQ-2024-123458",
  "timestamp": "2024-02-15T09:30:04Z",
  "source": "FLOW-EDD",
  "targetSystem": "QCB_KYC",
  "operation": "GET_DOCUMENTS",
  "parameters": {
    "qid": "27512345678901",
    "documentTypes": ["PASSPORT", "ID_CARD", "SALARY_CERTIFICATE", "ADDRESS_PROOF"]
  },
  "consentToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "responseId": "RES-2024-123458",
  "timestamp": "2024-02-15T09:30:06Z",
  "status": "SUCCESS",
  "data": {
    "documents": [
      {
        "type": "PASSPORT",
        "documentId": "QCB-DOC-12345",
        "fileName": "passport_27512345678901.pdf",
        "mimeType": "application/pdf",
        "size": 245678,
        "issueDate": "2020-05-15",
        "expiryDate": "2030-05-14",
        "verified": true,
        "retrievalUrl": "/qcb/documents/QCB-DOC-12345"
      },
      {
        "type": "ID_CARD",
        "documentId": "QCB-DOC-12346",
        "fileName": "id_card_27512345678901.pdf",
        "mimeType": "application/pdf",
        "size": 189456,
        "issueDate": "2021-03-10",
        "expiryDate": "2026-03-09",
        "verified": true,
        "retrievalUrl": "/qcb/documents/QCB-DOC-12346"
      }
    ]
  }
}
```

---

## 4.5 Risk Classification Model (ETL/SnapView Integration)

### 4.5.1 Overview

The EDD Case Management System displays risk scores from the **QIB Risk Engine** via ETL data feeds. The system is a **read-only consumer** of risk data - it does NOT calculate risk scores.

### 4.5.2 Risk Data Flow Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   QIB RISK      │     │      ETL        │     │   DATA          │
│   ENGINE        │────▶│   EXTRACT/      │────▶│   WAREHOUSE     │
│  (Calculation)  │     │   TRANSFORM     │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   EDD CASE      │◀────│      ESB        │◀────│   SNAPVIEW      │
│   MANAGEMENT    │     │   DATA API      │     │   REPORTING     │
│   SYSTEM        │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 4.5.3 ETL Field Name Requirements

> **⚠️ CRITICAL REQUIREMENT:**
> 
> The EDD system must display risk fields **EXACTLY** as received from the ETL dataset.
> **Field names must NOT be modified, translated, or simplified.**
> 
> The same field names must be used consistently across:
> **ETL → SnapView → FLOW → BRD → EDD System**

### 4.5.4 Risk Score Fields (Source: SnapView)

The following fields must appear **exactly as provided** (case-sensitive):

| Field Name | Description | Data Type | Value Range | Color Coding |
|------------|-------------|-----------|-------------|--------------|
| **RECORD_ID** | Unique risk record identifier | VARCHAR(20) | RSK-prefixed | N/A |
| **PROD_RISK_SCORE** | Product Risk Score | INTEGER | 0-125 | Based on category |
| **PROD_RISK_CATEG** | Product Risk Category | VARCHAR(10) | LOW/MEDIUM/HIGH | Green/Yellow/Red |
| **ACT_RISK_SCORE** | Activity Risk Score | INTEGER | 0-200 | Based on category |
| **ACT_RISK_CATEG** | Activity Risk Category | VARCHAR(10) | LOW/MEDIUM/HIGH | Green/Yellow/Red |
| **OCCP_RISK_SCORE** | Occupation Risk Score | INTEGER | 0-125 | Based on category |
| **OCCP_RISK_CATEG** | Occupation Risk Category | VARCHAR(10) | LOW/MEDIUM/HIGH | Green/Yellow/Red |
| **COUNTRY_RISK_SCORE** | Country Risk Score | INTEGER | 0-50 | Based on category |
| **COUNTRY_RISK_CATEG** | Country Risk Category | VARCHAR(10) | LOW/MEDIUM/HIGH | Green/Yellow/Red |
| **FINAL_RISK_SCORE** | Sum of all risk scores | INTEGER | 0-500 | Composite |
| **FINAL_RISK_CATEG** | Final Risk Category | VARCHAR(10) | LOW/MEDIUM/HIGH/AUTO HIGH | Based on value |
| **LAST_SCORE_DATE** | Date of last risk scoring | DATE | YYYY-MM-DD | N/A |

### 4.5.5 Sector Classification Fields

| Field Name | Description | Data Type | Value Range |
|------------|-------------|-----------|-------------|
| **TARGET_DESC** | Target Market Description | VARCHAR(50) | Private Banking Individual, Corporate, etc. |
| **SECTOR** | Sector Code | VARCHAR(10) | PB, CB, etc. |
| **SECTOR_DESC** | Sector Description | VARCHAR(50) | See values below |
| **INDUSTRY** | Industry Classification | VARCHAR(50) | Trading, Real Estate, etc. |

**SECTOR_DESC Valid Values:**
- Private Family
- Tamayuz Salaried
- Private Banking Corporate
- Tamayuz General
- Private Service
- Private Status
- Private (VIP-Restricted Access)

### 4.5.6 Auto High Trigger Fields

| Field Name | Description | Data Type | Value Range |
|------------|-------------|-----------|-------------|
| **AUTO_HIGH_TRIGGER** | Flag indicating automatic HIGH risk | BOOLEAN | true/false |
| **TRIGGER_REASON** | Reason for AUTO HIGH classification | VARCHAR(100) | See values below |

**TRIGGER_REASON Valid Values:**
- Private Banking Client
- PEP Relationship
- High-Risk Country Exposure
- Large Cash Transactions
- Complex Corporate Structure
- Sanctions Watch List Match
- Adverse Media Alert

### 4.5.7 Risk Category Thresholds

```
┌─────────────────────────────────────────────────────────────────┐
│                    RISK CATEGORY THRESHOLDS                      │
├─────────────────┬───────────────┬────────────────┬──────────────┤
│ Category        │ Score Range   │ UI Color       │ Hex Code     │
├─────────────────┼───────────────┼────────────────┼──────────────┤
│ LOW             │ 0 - 99        │ Green          │ #4CAF50      │
│ MEDIUM          │ 100 - 149     │ Yellow/Orange  │ #FFB300      │
│ HIGH            │ 150 - 199     │ Red            │ #F44336      │
│ AUTO HIGH       │ N/A (Trigger) │ Red (Alert)    │ #F44336      │
└─────────────────┴───────────────┴────────────────┴──────────────┘
```

> **Note:** AUTO HIGH is assigned via `AUTO_HIGH_TRIGGER` flag, not score threshold.

### 4.5.8 API Endpoint: Risk Score Retrieval

**Endpoint:** `GET /esb/api/v1/customers/{rim}/risk-scores`

**Request Headers:**
```
Authorization: Bearer {jwt-token}
X-Request-Id: {uuid}
Accept: application/json
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "timestamp": "2024-02-15T06:00:00Z",
  "data": {
    "rim": "RIM001234",
    "riskScores": {
      "RECORD_ID": "RSK001234",
      "PROD_RISK_SCORE": 90,
      "PROD_RISK_CATEG": "MEDIUM",
      "ACT_RISK_SCORE": 160,
      "ACT_RISK_CATEG": "HIGH",
      "OCCP_RISK_SCORE": 80,
      "OCCP_RISK_CATEG": "MEDIUM",
      "COUNTRY_RISK_SCORE": 40,
      "COUNTRY_RISK_CATEG": "LOW",
      "FINAL_RISK_SCORE": 370,
      "FINAL_RISK_CATEG": "AUTO HIGH",
      "LAST_SCORE_DATE": "2024-02-15",
      "TARGET_DESC": "Private Banking Individual",
      "SECTOR": "PB",
      "SECTOR_DESC": "Private Family",
      "INDUSTRY": "Trading",
      "AUTO_HIGH_TRIGGER": true,
      "TRIGGER_REASON": "Private Banking Client"
    },
    "metadata": {
      "riskEngineVersion": "3.2.1",
      "etlBatchId": "ETL-20240215-001",
      "dataFreshness": "CURRENT"
    }
  }
}
```

### 4.5.9 Risk-Based EDD Actions (Business Rules)

The system automatically recommends EDD actions based on risk categories:

| Risk Factor | Category | Required EDD Actions |
|-------------|----------|----------------------|
| ACTIVITY | HIGH | • Transaction Activity Analysis<br>• Source of Funds Verification |
| ACTIVITY | MEDIUM | • Transaction Pattern Review |
| OCCUPATION | HIGH | • Employment Verification<br>• Income Source Documentation |
| OCCUPATION | MEDIUM | • Occupation Verification |
| COUNTRY | HIGH | • Country Risk Compliance Review<br>• Cross-Border Transaction Monitoring |
| COUNTRY | MEDIUM | • Geographic Risk Assessment |
| PRODUCT | HIGH | • Product Suitability Assessment |
| PRODUCT | MEDIUM | • Product Suitability Review |

### 4.5.10 UI Display Component

The Risk Analysis Panel displays using **exact ETL field names**:

1. **Header Section:**
   - `FINAL_RISK_SCORE` - Large numeric display
   - `FINAL_RISK_CATEG` - Category badge (LOW/MEDIUM/HIGH/AUTO HIGH)
   - `LAST_SCORE_DATE` - Date of last scoring
   - `SECTOR_DESC` - Sector classification

2. **AUTO HIGH Alert Box** (conditional):
   - Displays when `AUTO_HIGH_TRIGGER = true`
   - Shows `TRIGGER_REASON` text

3. **Risk Factor Grid** - 4 cards showing exact field names in monospace font:
   - `PROD_RISK_SCORE` / `PROD_RISK_CATEG` - Product Risk
   - `ACT_RISK_SCORE` / `ACT_RISK_CATEG` - Activity Risk
   - `OCCP_RISK_SCORE` / `OCCP_RISK_CATEG` - Occupation Risk
   - `COUNTRY_RISK_SCORE` / `COUNTRY_RISK_CATEG` - Country Risk

4. **Primary Risk Driver Panel:**
   - Computed from highest risk score
   - Maps to field pair (e.g., `ACT_RISK_SCORE` / `ACT_RISK_CATEG`)

5. **Metadata:**
   - `RECORD_ID` - Risk record identifier
   - `TARGET_DESC` / `SECTOR` / `INDUSTRY` - Classification data

### 4.5.11 Data Refresh Schedule

| Source | Refresh Frequency | SLA | Fallback |
|--------|-------------------|-----|----------|
| Risk Engine ETL | Daily 06:00 AM | 99.5% | Use previous day's scores |
| SnapView Cache | Real-time query | 99.9% | Return cached data with flag |
| ESB API | On-demand | < 2 seconds | Queue and retry |

### 4.5.12 Error Handling

```javascript
// Risk Data Error Scenarios
{
  "RISK_001": "Risk Engine ETL data unavailable - using cached scores",
  "RISK_002": "Customer not found in risk database",
  "RISK_003": "Risk scores expired (>24 hours old)",
  "RISK_004": "SnapView connection timeout",
  "RISK_005": "Invalid risk category value received"
}
```

### 4.5.10 Integration Notes for IT Team

1. **Read-Only**: EDD system never writes to risk score tables
2. **ETL Dependency**: Risk scores depend on nightly ETL completion
3. **Fallback Strategy**: Display last known scores with "stale data" warning if ETL fails
4. **Audit Logging**: Log all risk score retrievals for compliance audit trail
5. **Cache Layer**: Implement 5-minute cache at ESB to reduce SnapView load

---

## 4.6 Joint Account Exposure Detection (T24/ETL Integration)

### 4.6.1 Overview

The EDD Case Management System must detect and display **Joint Account Exposure** to provide a complete financial picture of the customer. A customer may appear in joint accounts as:

- **Primary Holder** (JOINT_RIM_1)
- **Joint Holder** (JOINT_RIM_2 through JOINT_RIM_5)
- **Partial Beneficiary** (via ownership percentage)

This is critical for **AML/EDD/Risk Review** because declared income may not reflect total exposure.

### 4.6.2 Data Flow Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│       T24       │     │      ETL        │     │   DATA          │
│   JOINT.ACCT    │────▶│   EXTRACT       │────▶│   WAREHOUSE     │
│     TABLE       │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   EDD CASE      │◀────│      ESB        │◀────│   SNAPVIEW      │
│   MANAGEMENT    │     │   DATA API      │     │   JOINT_ACCTS   │
│   SYSTEM        │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 4.6.3 ETL Field Names (Exact Header)

> **⚠️ CRITICAL REQUIREMENT:**
> Field names must be used **EXACTLY** as specified. Do NOT modify or translate.

#### Joint Holder Fields

| Field Name | Description | Data Type | Value Range |
|------------|-------------|-----------|-------------|
| **JOINT_RIM_1** | Primary joint holder RIM | VARCHAR(20) | Customer RIM |
| **JOINT_RIM_2** | Second joint holder RIM | VARCHAR(20) | Customer RIM or NULL |
| **JOINT_RIM_3** | Third joint holder RIM | VARCHAR(20) | Customer RIM or NULL |
| **JOINT_RIM_4** | Fourth joint holder RIM | VARCHAR(20) | Customer RIM or NULL |
| **JOINT_RIM_5** | Fifth joint holder RIM | VARCHAR(20) | Customer RIM or NULL |

#### Ownership Percentage Fields

| Field Name | Description | Data Type | Value Range |
|------------|-------------|-----------|-------------|
| **JOINT_RIM_PERC** | Primary holder ownership % | DECIMAL(5,2) | 0.00 - 100.00 |
| **JOINT_RIM_PERC_2** | Second holder ownership % | DECIMAL(5,2) | 0.00 - 100.00 |
| **JOINT_RIM_PERC_3** | Third holder ownership % | DECIMAL(5,2) | 0.00 - 100.00 |
| **JOINT_RIM_PERC_4** | Fourth holder ownership % | DECIMAL(5,2) | 0.00 - 100.00 |
| **JOINT_RIM_PERC_5** | Fifth holder ownership % | DECIMAL(5,2) | 0.00 - 100.00 |

### 4.6.4 Detection Logic

When opening an EDD case, the system must search for joint accounts where:

```sql
SELECT * FROM JOINT_ACCOUNTS
WHERE
    JOINT_RIM_1 = :CUSTOMER_RIM
    OR JOINT_RIM_2 = :CUSTOMER_RIM
    OR JOINT_RIM_3 = :CUSTOMER_RIM
    OR JOINT_RIM_4 = :CUSTOMER_RIM
    OR JOINT_RIM_5 = :CUSTOMER_RIM
```

### 4.6.5 Role Detection

| Condition | Customer Role |
|-----------|---------------|
| JOINT_RIM_1 = Customer RIM | **Primary Holder** |
| JOINT_RIM_2 = Customer RIM | Joint Holder (Position 2) |
| JOINT_RIM_3 = Customer RIM | Joint Holder (Position 3) |
| JOINT_RIM_4 = Customer RIM | Joint Holder (Position 4) |
| JOINT_RIM_5 = Customer RIM | Joint Holder (Position 5) |

### 4.6.6 Exposure Calculation

**Customer Exposure** = ACCOUNT_BALANCE × OWNERSHIP_PERCENTAGE / 100

Example:
```
Account Balance  : 500,000 QAR
Ownership %      : 40%
Customer Exposure: 200,000 QAR
```

### 4.6.7 UI Display Requirements

The system must display a **Joint Account Exposure Panel** showing:

| Field | Description |
|-------|-------------|
| TOTAL_JOINT_ACCOUNTS | Count of joint accounts found |
| TOTAL_EXPOSURE | Sum of all customer exposures |
| ACCOUNT_NUMBER | Account identifier |
| ACCOUNT_TYPE | Savings/Current/Investment/Business |
| CUSTOMER_ROLE | Primary Holder / Joint Holder |
| OWNERSHIP_PERCENTAGE | Customer's share |
| ACCOUNT_BALANCE | Total account balance |
| CUSTOMER_EXPOSURE | Calculated exposure amount |

### 4.6.8 Alert Conditions

The system should flag the following conditions:

| Condition | Alert Type | Message |
|-----------|------------|---------|
| Joint Exposure > (Declared Income × 5 years) | **WARNING** | Income mismatch detected |
| Number of Joint Accounts ≥ 3 | INFO | Multiple joint relationships |
| Total Exposure ≥ 1,000,000 QAR | **WARNING** | High joint account exposure |

### 4.6.9 API Endpoint: Joint Account Retrieval

**Endpoint:** `GET /esb/api/v1/customers/{rim}/joint-accounts`

**Request Headers:**
```
Authorization: Bearer {jwt-token}
X-Request-Id: {uuid}
Accept: application/json
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "timestamp": "2024-02-15T10:30:00Z",
  "data": {
    "rim": "RIM001234",
    "totalJointAccounts": 2,
    "totalExposure": 660000,
    "currency": "QAR",
    "accounts": [
      {
        "ACCOUNT_NUMBER": "001-123456-001",
        "ACCOUNT_TYPE": "Savings",
        "ACCOUNT_BALANCE": 500000,
        "JOINT_RIM_1": "RIM001234",
        "JOINT_RIM_2": "RIM005678",
        "JOINT_RIM_PERC": 60,
        "JOINT_RIM_PERC_2": 40,
        "CUSTOMER_ROLE": "Primary Holder",
        "OWNERSHIP_PERCENTAGE": 60,
        "CUSTOMER_EXPOSURE": 300000
      },
      {
        "ACCOUNT_NUMBER": "001-234567-002",
        "ACCOUNT_TYPE": "Current",
        "ACCOUNT_BALANCE": 1200000,
        "JOINT_RIM_1": "RIM003456",
        "JOINT_RIM_2": "RIM001234",
        "JOINT_RIM_PERC": 50,
        "JOINT_RIM_PERC_2": 30,
        "CUSTOMER_ROLE": "Joint Holder",
        "OWNERSHIP_PERCENTAGE": 30,
        "CUSTOMER_EXPOSURE": 360000
      }
    ]
  }
}
```

### 4.6.10 EDD Review Implications

Joint Account Exposure is important because:

1. **Declared Income vs Actual Exposure:**
   ```
   Customer declares: Salary 8,000 QAR/month
   Joint Account Balance: 500,000 QAR
   Customer Share (50%): 250,000 QAR
   
   ⚠ Exposure via Joint Account significantly exceeds income
   ```

2. **Hidden Relationships:** Joint accounts may reveal undisclosed business partners or family connections

3. **Source of Funds:** Unexplained joint holdings require investigation

### 4.6.11 Integration Notes for IT Team

1. **T24 Source:** JOINT.ACCOUNT table linked to ACCOUNT and CUSTOMER
2. **ETL Refresh:** Daily batch at 06:00 AM
3. **Read-Only:** EDD system does not modify joint account data
4. **Cache Strategy:** 15-minute cache at ESB layer
5. **Audit Trail:** Log all joint account queries

---

## 4.7 Transaction Activity Analysis (T24/TM Integration)

### 4.7.1 Overview

The EDD Case Management System must display **Transaction Activity Analysis** to provide behavioral context for customer risk assessment. This is **CRITICAL** for AML/EDD review because:

- Declared income may not match actual transaction volume
- Cash-intensive patterns may indicate money laundering
- Wire transfers to high-risk countries require scrutiny
- Transaction velocity spikes can indicate suspicious activity

### 4.7.2 Data Flow Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│       T24       │     │       TM        │     │      ETL        │
│  TRANSACTIONS   │────▶│   TRANSACTION   │────▶│   AGGREGATION   │
│     TABLE       │     │   MONITORING    │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   EDD CASE      │◀────│      ESB        │◀────│   SNAPVIEW      │
│   MANAGEMENT    │     │   DATA API      │     │   TXN_SUMMARY   │
│   SYSTEM        │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 4.7.3 Data Fields Specification

#### Period & Income Fields

| Field Name | Description | Data Type | Example |
|------------|-------------|-----------|---------|
| **PERIOD_START** | Analysis period start date | DATE | 2025-03-01 |
| **PERIOD_END** | Analysis period end date | DATE | 2026-02-28 |
| **ANALYSIS_PERIOD_MONTHS** | Number of months analyzed | INTEGER | 12 |
| **DECLARED_MONTHLY_INCOME** | Customer declared income | DECIMAL | 450000 |

#### Cash Activity Fields

| Field Name | Description | Data Type | Alert Threshold |
|------------|-------------|-----------|-----------------|
| **TOTAL_CASH_DEPOSITS** | Sum of all cash deposits | DECIMAL | - |
| **CASH_DEPOSIT_COUNT** | Number of cash deposit transactions | INTEGER | - |
| **AVG_CASH_DEPOSIT** | Average deposit amount | DECIMAL | - |
| **MAX_CASH_DEPOSIT** | Largest single cash deposit | DECIMAL | > 50,000 QAR |
| **MAX_CASH_DEPOSIT_DATE** | Date of largest deposit | DATE | - |
| **TOTAL_CASH_WITHDRAWALS** | Sum of all cash withdrawals | DECIMAL | - |
| **CASH_WITHDRAWAL_COUNT** | Number of cash withdrawals | INTEGER | - |
| **CASH_INTENSIVE_FLAG** | Indicates cash-intensive activity | BOOLEAN | true = ALERT |
| **STRUCTURING_ALERT** | Pattern indicates structuring | BOOLEAN | true = CRITICAL |
| **STRUCTURING_DETAILS** | Description of structuring pattern | VARCHAR(200) | - |

#### Wire Transfer Fields

| Field Name | Description | Data Type | Alert Threshold |
|------------|-------------|-----------|-----------------|
| **INBOUND_TOTAL** | Total inbound wire amount | DECIMAL | - |
| **INBOUND_COUNT** | Number of inbound wires | INTEGER | - |
| **INBOUND_COUNTRIES** | List of source countries | ARRAY | - |
| **INBOUND_HIGH_RISK_COUNTRIES** | High-risk source countries | ARRAY | Any = WARNING |
| **OUTBOUND_TOTAL** | Total outbound wire amount | DECIMAL | - |
| **OUTBOUND_COUNT** | Number of outbound wires | INTEGER | - |
| **OUTBOUND_COUNTRIES** | List of destination countries | ARRAY | - |
| **OUTBOUND_HIGH_RISK_COUNTRIES** | High-risk destinations | ARRAY | Any = CRITICAL |
| **HIGH_RISK_WIRE_FLAG** | Wire to/from high-risk country | BOOLEAN | true = CRITICAL |
| **HIGH_RISK_WIRE_DETAILS** | Description of high-risk wire | VARCHAR(200) | - |

#### Transaction Velocity Fields

| Field Name | Description | Data Type | Alert Threshold |
|------------|-------------|-----------|-----------------|
| **CURRENT_6M_AVG** | Average monthly volume (current 6 months) | DECIMAL | - |
| **PREVIOUS_6M_AVG** | Average monthly volume (previous 6 months) | DECIMAL | - |
| **VELOCITY_CHANGE_PCT** | Percentage change in velocity | INTEGER | > 100% = HIGH |
| **VELOCITY_ALERT** | Velocity spike detected | BOOLEAN | true = WARNING |
| **VELOCITY_ALERT_REASON** | Explanation of velocity change | VARCHAR(200) | - |

### 4.7.4 TM Alert Integration

The system integrates with Transaction Monitoring (TM) alerts:

| Field Name | Description | Data Type |
|------------|-------------|-----------|
| **ALERT_ID** | Unique TM alert identifier | VARCHAR(20) |
| **DATE** | Alert generation date | DATE |
| **TYPE** | Alert type category | VARCHAR(50) |
| **AMOUNT** | Related transaction amount | DECIMAL |
| **STATUS** | Alert status | ENUM |
| **SEVERITY** | Alert severity level | ENUM |

**Alert Status Values:**
- OPEN
- INVESTIGATING
- ESCALATED
- CLOSED

**Alert Severity Values:**
- CRITICAL (Red)
- HIGH (Orange-Red)
- MEDIUM (Orange)
- LOW (Green)

### 4.7.5 Alert Detection Rules

| Condition | Alert Type | Severity | Action |
|-----------|------------|----------|--------|
| STRUCTURING_ALERT = true | Structuring Pattern | **CRITICAL** | Immediate Review |
| HIGH_RISK_WIRE_FLAG = true | High-Risk Country Wire | **CRITICAL** | Compliance Escalation |
| VELOCITY_CHANGE_PCT > 200% | Velocity Spike | **HIGH** | Investigation Required |
| VELOCITY_CHANGE_PCT > 100% | Velocity Increase | **MEDIUM** | Enhanced Monitoring |
| CASH_INTENSIVE_FLAG = true | Cash Intensive | **MEDIUM** | Source of Funds Review |
| TOTAL_INFLOW > (DECLARED_INCOME × 24) | Income Mismatch | **CRITICAL** | Immediate Review |

### 4.7.6 Country Risk Classification

| Risk Level | Countries | Wire Alert |
|------------|-----------|------------|
| **HIGH** | Iran, Iraq, Syria, North Korea, Lebanon, Yemen, Libya, Afghanistan | Always generate alert |
| **MEDIUM** | Turkey, Russia, Pakistan, Bangladesh, Nigeria | Alert if > 100,000 QAR |
| **LOW** | GCC, UK, USA, EU, Singapore, etc. | No automatic alert |

### 4.7.7 API Endpoint: Transaction Activity Retrieval

**Endpoint:** `GET /esb/api/v1/customers/{rim}/transaction-activity`

**Request Headers:**
```
Authorization: Bearer {jwt-token}
X-Request-Id: {uuid}
Accept: application/json
```

**Query Parameters:**
```
?period_months=12  (default: 12)
?include_alerts=true
?include_large_txn=true
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "timestamp": "2026-02-28T10:30:00Z",
  "data": {
    "rim": "RIM001234",
    "PERIOD_START": "2025-03-01",
    "PERIOD_END": "2026-02-28",
    "DECLARED_MONTHLY_INCOME": 450000,
    "CASH_ACTIVITY": {
      "TOTAL_CASH_DEPOSITS": 2850000,
      "CASH_DEPOSIT_COUNT": 45,
      "MAX_CASH_DEPOSIT": 180000,
      "CASH_INTENSIVE_FLAG": true,
      "STRUCTURING_ALERT": true,
      "STRUCTURING_DETAILS": "5 deposits of 45,000-49,000 QAR within 3 days"
    },
    "WIRE_TRANSFERS": {
      "INBOUND_TOTAL": 5200000,
      "INBOUND_COUNT": 28,
      "INBOUND_COUNTRIES": ["UAE", "UK", "Turkey"],
      "OUTBOUND_TOTAL": 3800000,
      "OUTBOUND_COUNT": 15,
      "OUTBOUND_COUNTRIES": ["Singapore", "Lebanon"],
      "HIGH_RISK_WIRE_FLAG": true,
      "HIGH_RISK_WIRE_DETAILS": "Wire to Lebanon: 450,000 QAR"
    },
    "VELOCITY": {
      "CURRENT_6M_AVG": 850000,
      "PREVIOUS_6M_AVG": 280000,
      "VELOCITY_CHANGE_PCT": 203,
      "VELOCITY_ALERT": true,
      "VELOCITY_ALERT_REASON": "203% increase in transaction volume"
    },
    "TM_ALERTS": [
      {
        "ALERT_ID": "TM-2026-00145",
        "DATE": "2026-01-15",
        "TYPE": "Large Cash Deposit",
        "AMOUNT": 180000,
        "STATUS": "OPEN",
        "SEVERITY": "HIGH"
      }
    ]
  }
}
```

### 4.7.8 UI Display Requirements

The Transaction Activity Panel must display:

1. **Header Section:**
   - Analysis period (PERIOD_START - PERIOD_END)
   - DECLARED_MONTHLY_INCOME

2. **Summary Cards (4 cards):**
   - TOTAL_INFLOW (green)
   - TOTAL_OUTFLOW (red)
   - NET_FLOW (green/red based on value)
   - TM_ALERTS Open Count (badge)

3. **Risk Flags Banner:**
   - CRITICAL: Red background, exclamation circle
   - WARNING: Orange background, exclamation triangle

4. **Cash Activity Section:**
   - All CASH_ACTIVITY fields with monospace labels
   - STRUCTURING_ALERT highlighted if true

5. **Wire Transfer Section:**
   - All WIRE_TRANSFERS fields
   - HIGH_RISK_WIRE_FLAG highlighted if true
   - Country lists displayed

6. **Velocity Section:**
   - Visual comparison (Previous → Current)
   - Percentage change with color coding
   - Alert status badge

7. **Country Exposure Grid:**
   - Country code, name, risk level
   - Amount and direction (inbound/outbound/both)

8. **TM Alerts Table:**
   - Sortable by date/severity
   - Status badges with colors
   - Link to TM system (optional)

9. **Large Transactions Table:**
   - Transactions > 100,000 QAR
   - Type, Amount, Country, Narrative

### 4.7.9 EDD Review Implications

Transaction Activity Analysis is critical because:

1. **Income vs Activity Mismatch:**
   ```
   Declared Monthly Income: 15,000 QAR
   Actual Monthly Activity:  500,000 QAR
   
   ⚠ CRITICAL: Activity is 33x declared income
   ```

2. **Structuring Detection:**
   ```
   Day 1: Cash Deposit 49,000 QAR
   Day 2: Cash Deposit 48,500 QAR
   Day 3: Cash Deposit 49,000 QAR
   
   ⚠ CRITICAL: Structuring to avoid 50,000 QAR reporting threshold
   ```

3. **High-Risk Country Exposure:**
   ```
   Wire Out to Lebanon: 450,000 QAR
   Purpose: "Family Support"
   
   ⚠ CRITICAL: Wire to high-risk jurisdiction requires SOF verification
   ```

### 4.7.10 Integration Notes for IT Team

1. **T24 Source:** STMT.ENTRY table (transactions), FT.LOCAL/FT.BULK table (wires)
2. **TM Integration:** Real-time API to Transaction Monitoring system
3. **ETL Aggregation:** Nightly batch aggregates 12-month rolling window
4. **Performance:** Pre-aggregated summaries in SnapView for fast retrieval
5. **Cache Strategy:** 30-minute cache at ESB (transactions change less frequently)
6. **Audit Trail:** Log all transaction activity queries with user ID

---

## 5. T24 Writeback Specification

### 5.1 Fields to be Written Back to T24

| Field | T24 Table | T24 Field Name | Data Type | Trigger | Example Value |
|-------|-----------|----------------|-----------|---------|---------------|
| EDD Status | CUSTOMER.EDD | EDD.STATUS | VARCHAR(20) | Case Update | "IN_PROGRESS" |
| EDD Completion Date | CUSTOMER.EDD | EDD.COMPLETION.DATE | DATE | Case Close | "20240215" |
| Next EDD Due Date | CUSTOMER.EDD | NEXT.EDD.DUE.DATE | DATE | Case Close | "20250215" |
| EDD Decision | CUSTOMER.EDD | EDD.DECISION | VARCHAR(20) | Case Close | "APPROVED" |
| EDD Case ID | CUSTOMER.EDD | EDD.CASE.REF | VARCHAR(20) | Case Create | "EDD-2024-001234" |
| Account Restriction | ACCOUNT | RESTRICT.FLAG | VARCHAR(5) | Decision | "Y" / "N" |
| Restriction Reason | ACCOUNT | RESTRICT.REASON | VARCHAR(100) | Decision | "EDD_PENDING" |
| Last EDD Review Date | CUSTOMER.EDD | LAST.EDD.REVIEW | DATE | Case Close | "20240215" |
| EDD Review Outcome | CUSTOMER.EDD | EDD.OUTCOME | VARCHAR(50) | Case Close | "CONTINUE_RELATIONSHIP" |

### 5.2 New T24 EDD Section Definition

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    T24 CUSTOMER.EDD SECTION (NEW)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Table: CUSTOMER.EDD                                                        │
│  Linked to: CUSTOMER (via @ID = RIM)                                        │
│                                                                             │
│  Fields:                                                                    │
│  ──────────────────────────────────────────────────────────────────────     │
│  EDD.STATUS              VARCHAR(20)     Current EDD status                 │
│  EDD.CASE.REF            VARCHAR(20)     Reference to FLOW case             │
│  LAST.EDD.REVIEW         DATE            Last EDD review date               │
│  NEXT.EDD.DUE.DATE       DATE            Next EDD due date                  │
│  EDD.DECISION            VARCHAR(20)     Final EDD decision                 │
│  EDD.OUTCOME             VARCHAR(50)     Review outcome                     │
│  EDD.COMPLETION.DATE     DATE            Completion timestamp               │
│                                                                             │
│  SOURCE.OF.WEALTH        MULTIVALUE      Array of wealth sources            │
│  SOW.EXPLANATION         TEXT            Wealth explanation                 │
│  ESTIMATED.NET.WORTH     VARCHAR(20)     Net worth band                     │
│                                                                             │
│  BUSINESS.NAME           VARCHAR(100)    Business name (if applicable)      │
│  BUSINESS.TYPE           VARCHAR(50)     Business sector                    │
│  BUSINESS.INCOME         AMOUNT          Monthly business income            │
│                                                                             │
│  PROPERTY.INCOME         AMOUNT          Monthly rental income              │
│  INVESTMENT.INCOME       AMOUNT          Monthly investment income          │
│  OTHER.INCOME            AMOUNT          Other monthly income               │
│                                                                             │
│  EDD.HISTORY             MULTIVALUE      Array of past EDD reviews          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 T24 Writeback API Specification

**Request:**
```json
{
  "requestId": "WB-2024-123459",
  "timestamp": "2024-02-15T15:30:00Z",
  "source": "FLOW-EDD",
  "targetSystem": "T24",
  "operation": "UPDATE_EDD_SECTION",
  "parameters": {
    "rim": "RIM001234",
    "fields": {
      "EDD.STATUS": "COMPLETED",
      "EDD.CASE.REF": "EDD-2024-001234",
      "LAST.EDD.REVIEW": "20240215",
      "NEXT.EDD.DUE.DATE": "20250215",
      "EDD.DECISION": "APPROVED",
      "EDD.OUTCOME": "CONTINUE_RELATIONSHIP",
      "EDD.COMPLETION.DATE": "20240215",
      "SOURCE.OF.WEALTH": ["SALARY", "BUSINESS_PROFITS", "INVESTMENTS"],
      "SOW.EXPLANATION": "Primary income from Al-Kuwari Trading Group as CEO...",
      "ESTIMATED.NET.WORTH": "OVER_10M_QAR"
    }
  },
  "auditInfo": {
    "userId": "EMP003",
    "action": "EDD_CASE_CLOSURE"
  }
}
```

**Response:**
```json
{
  "responseId": "WB-RES-2024-123459",
  "timestamp": "2024-02-15T15:30:02Z",
  "status": "SUCCESS",
  "message": "T24 EDD section updated successfully",
  "transactionRef": "T24-TXN-20240215-00456"
}
```

---

## 6. FLOW Workflow Configuration

### 6.1 Workflow Stages Definition

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLOW EDD WORKFLOW STAGES                            │
└─────────────────────────────────────────────────────────────────────────────┘

Stage 1: CASE_CREATED
├── System auto-generates case
├── Data enrichment from T24/SnapView/QCB
├── Auto-route to Business segment queue
└── SLA Timer starts

Stage 2: BUSINESS_MAKER
├── Assigned to RM/Business staff
├── Review customer data
├── Retrieve documents from DMS
├── Add comments/recommendations
├── Actions: Submit to Checker / Request More Info
└── SLA: Per bank policy

Stage 3: BUSINESS_CHECKER
├── Supervisor reviews maker submission
├── Validates data and comments
├── Actions: Approve / Return to Maker / Escalate
└── SLA: Per bank policy

Stage 4: CDD_MAKER
├── CDD staff performs EDD analysis
├── Reviews all documents
├── Checks QCB API data
├── Identifies mismatches
├── Actions: Submit to Checker / Request Documents / Escalate
└── SLA: Per bank policy

Stage 5: CDD_CHECKER
├── Senior CDD reviews analysis
├── Validates EDD findings
├── Actions: Approve / Reject / Return / Escalate to Compliance
└── SLA: Per bank policy

Stage 6: COMPLIANCE_ESCALATION (Optional)
├── Compliance Officer review
├── High-risk decision making
├── Actions: Approve / Reject / Exit Relationship
└── SLA: Per bank policy

Stage 7: CASE_CLOSED
├── Writeback to T24
├── Document archival
├── Audit trail finalization
├── Next EDD date calculation
└── Notification to stakeholders
```

### 6.2 Stage Transition Rules

| From Stage | To Stage | Condition | Trigger |
|------------|----------|-----------|---------|
| CASE_CREATED | BUSINESS_MAKER | Auto | Case creation complete |
| BUSINESS_MAKER | BUSINESS_CHECKER | Manual | Maker submits |
| BUSINESS_MAKER | BUSINESS_MAKER | Manual | More info requested |
| BUSINESS_CHECKER | CDD_MAKER | Manual | Checker approves |
| BUSINESS_CHECKER | BUSINESS_MAKER | Manual | Checker returns |
| BUSINESS_CHECKER | COMPLIANCE_ESCALATION | Manual | Checker escalates |
| CDD_MAKER | CDD_CHECKER | Manual | Maker submits |
| CDD_MAKER | BUSINESS_MAKER | Manual | Return to business |
| CDD_CHECKER | CASE_CLOSED | Manual | Checker approves |
| CDD_CHECKER | CDD_MAKER | Manual | Checker returns |
| CDD_CHECKER | COMPLIANCE_ESCALATION | Manual | Checker escalates |
| COMPLIANCE_ESCALATION | CASE_CLOSED | Manual | Compliance decision |
| COMPLIANCE_ESCALATION | CDD_CHECKER | Manual | Return to CDD |

### 6.3 Stage Data Storage

Each stage stores the following in FLOW:

```json
{
  "stageId": "BUSINESS_MAKER",
  "stageData": {
    "userId": "EMP004",
    "userName": "Sara Al-Khalifa",
    "department": "Private Banking",
    "startTimestamp": "2024-02-15T09:35:00Z",
    "endTimestamp": "2024-02-15T14:20:00Z",
    "decision": "SUBMIT_TO_CHECKER",
    "comments": "All documents verified. Customer is a former minister...",
    "documentsReviewed": ["DOC001", "DOC002", "DOC003"],
    "recommendation": "PROCEED_TO_CDD",
    "slaStatus": "WITHIN_SLA"
  }
}
```

---

## 7. Error Handling & Recovery

### 7.1 Error Scenarios

| Error Code | Description | Source System | Recovery Action | User Message |
|------------|-------------|---------------|-----------------|--------------|
| ERR-T24-001 | T24 connection timeout | T24 / ESB | Retry (3x), then queue | "System temporarily unavailable. Case queued for processing." |
| ERR-T24-002 | Customer not found in T24 | T24 | Manual review required | "Customer data not found. Please verify RIM number." |
| ERR-T24-003 | T24 writeback failed | T24 / ESB | Retry (3x), alert IT | "Unable to update core banking. IT has been notified." |
| ERR-QCB-001 | QCB API timeout | QCB KYC API | Retry (3x), proceed without | "QCB documents unavailable. Proceed with manual verification." |
| ERR-QCB-002 | QCB consent not valid | QCB KYC API | Skip QCB retrieval | "Customer consent not available. Manual document required." |
| ERR-QCB-003 | QCB document not found | QCB KYC API | Request manual upload | "Document not found in QCB. Please request from customer." |
| ERR-DMS-001 | DMS connection failed | DMS | Retry (3x), then queue | "Document system unavailable. Retry in a few minutes." |
| ERR-DMS-002 | Document upload failed | DMS | Retry, then manual | "Upload failed. Please try again or contact IT." |
| ERR-SNP-001 | SnapView data unavailable | SnapView | Proceed with T24 only | "Financial data temporarily unavailable. Using core data." |
| ERR-ESB-001 | ESB routing failure | ESB | Failover to backup | "Processing delay. System will retry automatically." |
| ERR-FLOW-001 | Workflow transition failed | FLOW | Retry, alert IT | "Unable to process. Please try again." |

### 7.2 Error Logging Specification

```json
{
  "errorLog": {
    "errorId": "ERR-20240215-123456",
    "timestamp": "2024-02-15T10:30:45Z",
    "errorCode": "ERR-T24-001",
    "errorMessage": "T24 connection timeout after 30 seconds",
    "sourceSystem": "T24",
    "targetOperation": "GET_CUSTOMER",
    "rim": "RIM001234",
    "caseId": "EDD-2024-001234",
    "userId": "EMP002",
    "stackTrace": "...",
    "retryCount": 3,
    "resolved": false,
    "escalatedTo": "IT_SUPPORT"
  }
}
```

### 7.3 Monitoring & Alerts

| Alert Type | Condition | Recipients | Channel |
|------------|-----------|------------|---------|
| System Down | Any system unavailable > 5 min | IT Operations | SMS + Email |
| High Error Rate | >10 errors/hour same type | IT Development | Email |
| SLA Breach | Case exceeds SLA | Department Manager | Email + Dashboard |
| Critical Case | High-risk escalation | Compliance Head | Email + SMS |
| Integration Failure | ESB/API failure | Integration Team | Email + Monitoring |

---

## 8. Security & Access Control

### 8.1 API Authentication

All API calls must include:

```
Headers:
  Authorization: Bearer <JWT_TOKEN>
  X-Request-ID: <UNIQUE_REQUEST_ID>
  X-Source-System: FLOW-EDD
  X-Timestamp: <ISO_8601_TIMESTAMP>
  X-Signature: <HMAC_SHA256_SIGNATURE>
```

### 8.2 Data Encryption

| Data Type | At Rest | In Transit | Key Management |
|-----------|---------|------------|----------------|
| Customer PII | AES-256 | TLS 1.3 | HSM |
| Documents | AES-256 | TLS 1.3 | HSM |
| API Credentials | AES-256 | TLS 1.3 | Vault |
| Audit Logs | AES-256 | TLS 1.3 | HSM |

### 8.3 Role-Based Access

| Role | T24 Read | T24 Write | QCB API | DMS Read | DMS Write | FLOW Admin |
|------|----------|-----------|---------|----------|-----------|------------|
| Business Maker | ✓ | ✗ | ✗ | ✓ | ✓ | ✗ |
| Business Checker | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ |
| CDD Maker | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ |
| CDD Checker | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Compliance | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Management | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ |
| Audit | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ |
| IT Admin | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

---

## 9. Performance Requirements

### 9.1 Response Time SLAs

| Operation | Expected | Maximum | Measurement Point |
|-----------|----------|---------|-------------------|
| Case Creation | < 3 sec | 5 sec | User click to case displayed |
| Customer Data Load | < 2 sec | 4 sec | Form load to data populated |
| Document Retrieval | < 3 sec | 6 sec | Request to thumbnail displayed |
| Document Upload | < 5 sec | 10 sec | Upload start to confirmation |
| Stage Transition | < 2 sec | 4 sec | Submit to next stage loaded |
| Dashboard Load | < 3 sec | 5 sec | Page request to fully rendered |
| Search Results | < 2 sec | 4 sec | Query to results displayed |
| Report Generation | < 10 sec | 30 sec | Request to download ready |

### 9.2 Concurrent Users

| Time Period | Expected Users | Peak Users |
|-------------|---------------|------------|
| Normal Hours (8 AM - 4 PM) | 50-100 | 150 |
| Peak Hours (10 AM - 12 PM) | 100-150 | 200 |
| Off Hours | 10-20 | 50 |

---

## 10. Deployment Architecture

### 10.1 Environment Configuration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DEPLOYMENT ENVIRONMENTS                             │
└─────────────────────────────────────────────────────────────────────────────┘

DEVELOPMENT (DEV)
├── FLOW Dev Instance
├── T24 Sandbox
├── Mock QCB API
├── DMS Dev
└── Isolated network

USER ACCEPTANCE TESTING (UAT)
├── FLOW UAT Instance
├── T24 UAT (Copy of Prod)
├── QCB API Sandbox
├── DMS UAT
└── Restricted access

PRODUCTION (PROD)
├── FLOW Production (HA Cluster)
├── T24 Production
├── QCB API Production
├── DMS Production
├── Full monitoring
└── DR site synchronized
```

### 10.2 Integration Endpoints

| Environment | ESB URL | T24 URL | QCB API URL | DMS URL |
|-------------|---------|---------|-------------|---------|
| DEV | esb-dev.qib.local:8080 | t24-sandbox.qib.local | mock-qcb.qib.local | dms-dev.qib.local |
| UAT | esb-uat.qib.local:8080 | t24-uat.qib.local | sandbox.qcb.gov.qa | dms-uat.qib.local |
| PROD | esb.qib.local:8080 | t24.qib.local | api.qcb.gov.qa | dms.qib.local |

---

## 11. Testing Requirements

### 11.1 Integration Test Cases

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| INT-001 | T24 customer retrieval | Data populated correctly | Critical |
| INT-002 | SnapView salary data | Salary fields populated | High |
| INT-003 | QCB document retrieval (with consent) | Documents displayed | High |
| INT-004 | QCB without consent | Graceful handling | Medium |
| INT-005 | DMS document upload | Document stored | High |
| INT-006 | T24 writeback on case close | T24 updated | Critical |
| INT-007 | ESB failover | Backup route works | High |
| INT-008 | Concurrent case creation | No data corruption | Critical |
| INT-009 | Large document upload (10MB) | Success within SLA | Medium |
| INT-010 | Data mismatch detection | Mismatches flagged | High |

### 11.2 Performance Test Scenarios

| Scenario | Load | Duration | Pass Criteria |
|----------|------|----------|---------------|
| Normal Load | 100 concurrent users | 2 hours | < 3 sec avg response |
| Peak Load | 200 concurrent users | 1 hour | < 5 sec avg response |
| Stress Test | 300 concurrent users | 30 min | System stable |
| Endurance | 100 users | 8 hours | No memory leaks |

---

## 12. IT Deliverables Checklist

### 12.1 For IT Architecture Team

- [ ] Review integration architecture diagram
- [ ] Approve API specifications
- [ ] Validate security requirements
- [ ] Sign off on performance SLAs

### 12.2 For Integration Team

- [ ] Implement ESB connectors
- [ ] Configure T24 APIs
- [ ] Set up QCB API integration
- [ ] Configure DMS integration
- [ ] Implement error handling

### 12.3 For FLOW Development Team

- [ ] Configure workflow stages
- [ ] Implement form screens
- [ ] Build dashboard components
- [ ] Implement notification logic
- [ ] Configure SLA timers

### 12.4 For Core Banking Team

- [ ] Create CUSTOMER.EDD section in T24
- [ ] Define new T24 fields
- [ ] Configure writeback APIs
- [ ] Set up account restriction flags
- [ ] Test T24 integration

### 12.5 For QA Team

- [ ] Execute integration test cases
- [ ] Perform performance testing
- [ ] Validate security controls
- [ ] User acceptance testing support
- [ ] Regression testing

---

## 13. Appendix

### 13.1 Glossary

| Term | Definition |
|------|------------|
| CDD | Customer Due Diligence |
| CRP | Customer Risk Profile |
| DMS | Document Management System |
| EDD | Enhanced Due Diligence |
| ESB | Enterprise Service Bus |
| FLOW | QIB's internal workflow management platform |
| KYC | Know Your Customer |
| PEP | Politically Exposed Person |
| QCB | Qatar Central Bank |
| RIM | Relationship Identification Mark (T24 customer ID) |
| SLA | Service Level Agreement |
| SnapView | QIB's data warehouse and reporting system |
| T24 | Temenos T24 Core Banking System |

### 13.2 Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 2026 | IT Architecture | Initial Release |

---

**Document End**

*This document is confidential and intended for QIB internal use only.*
