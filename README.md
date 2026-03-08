# QIB EDD Case Management System

## Operations Digital Investigation Platform
**منصة التحقيق الرقمي للعمليات**

Enterprise-grade Enhanced Due Diligence (EDD) case management system for Qatar Islamic Bank.

---

## 🏦 System Overview

This platform provides a comprehensive EDD workflow management solution including:

- **Case Management** - Full lifecycle from trigger to closure
- **Risk Assessment** - Multi-dimensional risk scoring (Product, Activity, Occupation, Country)
- **Document Management** - Integrated with QIB DMS
- **Workflow Engine** - Maker/Checker approval flows
- **Call Center Integration** - Read-only customer information view
- **Compliance Escalation** - Automatic routing of high-risk cases

---

## 📊 Key Features

### Risk Classification Model
- PROD_RISK_SCORE / PROD_RISK_CATEG
- ACT_RISK_SCORE / ACT_RISK_CATEG
- OCCP_RISK_SCORE / OCCP_RISK_CATEG
- COUNTRY_RISK_SCORE / COUNTRY_RISK_CATEG
- FINAL_RISK_SCORE / FINAL_RISK_CATEG
- AUTO HIGH Risk Detection

### Financial Profile
- SALARY, ANNUAL_INC, SEC_INC_AMT
- LAST_SAL_DA, LAST_SAL_AMT
- AVG_LAST_3_SALARY (calculated)

### Expected Activity Profile
- LM_EXP_CASH
- LM_EXP_NONCASH
- LM_EXP_TRFR

### Joint Account Exposure
- JOINT_RIM_1 to JOINT_RIM_5
- Ownership percentages
- Balance exposure calculation

### Transaction Activity Analysis
- Large cash transactions (>50K QAR)
- International transfers
- High-risk country exposure

---

## 🔐 Role Governance

| Role | Description |
|------|-------------|
| BUSINESS_MAKER | Creates and submits EDD cases |
| BUSINESS_CHECKER | Reviews and approves business submissions |
| CDD_MAKER | Performs CDD review |
| CDD_CHECKER | Approves CDD review |
| COMPLIANCE_REVIEW | Final review for escalated cases |
| CALL_CENTER_VIEW | Read-only customer information |
| IT_ADMIN | System administration |

---

## 🔄 Workflow

```
Business Maker → Business Checker → CDD Maker → CDD Checker → [Compliance if escalated]
```

---

## 📁 Project Structure

```
EDD_QIB/
├── edd_system/
│   ├── index.html          # Login page
│   ├── dashboard.html      # Main dashboard
│   ├── edd_case.html       # EDD case form (11 sections)
│   ├── css/
│   │   └── edd_system.css  # Enterprise styling
│   └── js/
│       ├── auth.js
│       ├── edd_case.js
│       ├── enterprise_features.js  # Core enterprise modules
│       └── enterprise_ui.js        # Enterprise UI rendering
├── BRD/
│   └── [BRD documents]
├── BRD_IT_Technical_Architecture.md
├── BRD_Enterprise_Features.md
└── README.md
```

---

## 🛠️ Data Sources

| Source | Data |
|--------|------|
| T24 Core Banking | Customer master, accounts |
| ETL Dataset | Salary, income, risk scores |
| Risk Dataset | Expected activity |
| QCB KYC | Know Your Customer data |
| Transaction Monitoring | Alerts, suspicious activity |
| DMS | Document storage |

---

## 📝 Documentation

- [IT Technical Architecture BRD](BRD_IT_Technical_Architecture.md)
- [Enterprise Features BRD](BRD_Enterprise_Features.md)

---

## 🚀 Getting Started

1. Clone the repository
2. Open `edd_system/index.html` in a browser
3. Login with demo credentials:
   - Username: `ahmed.thani`
   - Password: `edd2024`

---

## 📋 Version

- **Version:** 2.0
- **Date:** March 2026
- **Classification:** Internal - QIB Operations

---

*© 2026 Qatar Islamic Bank - Operations Division*
