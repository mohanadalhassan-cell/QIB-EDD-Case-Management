# EDD Case Creation Logic Based on the Next EDD Date

**Document Version:** 2.0  
**Date:** 11 March 2026  
**Status:** ✅ UPDATED - Enhanced Requirements

---

## 1. Case Creation Trigger

The system shall create an **EDD case only for customers classified as High Risk**.

EDD case creation shall not apply to all customers, and shall not be triggered solely because the customer is under a general Re-KYC cycle. The trigger for opening an EDD case shall be linked specifically to the customer's **High Risk classification** and the **Next EDD Date** maintained in the bank's source system.

---

## 2. Next EDD Date Field in T24

A **new field shall be created in T24** to store the customer's **Next EDD Date**.

This field shall act as the primary operational reference for:

* determining when an EDD case should be opened,
* tracking the customer's next EDD cycle,
* supporting future follow-up,
* and updating the next review date after case closure.

---

## 3. Date-Based Opening Logic

The system shall open the EDD case based on the **Next EDD Date** stored in T24, according to the approved business rule configured in the system.

The opening rule shall be configuration-driven and shall allow the bank to define the case opening timing, such as:

* on the Next EDD Date,
* one week before the Next EDD Date,
* or any other approved period.

The approved timing rule shall be maintained through the system's controlled configuration process and shall not be hardcoded.

---

## 4. High Risk Condition

The system shall check the customer's latest risk classification before opening the EDD case.

An EDD case shall be created only if:

* the customer is classified as **High Risk**, and
* the configured opening date threshold linked to the **Next EDD Date** has been reached.

If the customer is not classified as High Risk at that point, the system shall not open an EDD case.

---

## 5. Relationship with Re-KYC

The Re-KYC journey may continue independently according to the bank's approved process.

Where applicable, the system shall support reassessment of the customer during or after Re-KYC. If the reassessment confirms that the customer is **High Risk again**, the system shall use the **Next EDD Date** logic to open or maintain the EDD case according to the approved rule.

---

## 6. Updating the Next EDD Date

After closure of the EDD case, the system shall update the **Next EDD Date** for the customer based on the approved policy and review outcome.

This updated date shall be written back to the dedicated field in T24 using the integration approach approved by the Bank's IT team.

If the date cannot be reflected immediately in T24, it shall be stored in the **approved internal repository for files and data**, and shall be treated as a temporary operational and control reference until reflected in T24 if needed.

---

## 7. Integration Approach

Integration with **T24** shall follow the standard technical approach approved and currently used by the Bank's IT team, whether through:

* direct integration with T24,
* or an approved data copy / intermediate data layer.

If any required data is not available in T24, the system shall retrieve it through approved **ETL processes** from internal bank data sources.

---

## 8. Audit and Traceability

The system shall record all actions related to:

* EDD case creation,
* date-based trigger execution,
* risk classification check,
* Next EDD Date update,
* and case closure

within the system audit trail.

The audit trail shall capture:

* user or system action,
* date and time,
* previous value,
* new value,
* and source of update.

---

## 9. BRD-Ready Statement

**The system shall create EDD cases only for customers classified as High Risk, based on the Next EDD Date maintained in a new dedicated field in T24. This field shall serve as the primary reference for determining when the EDD case should be opened, tracked, and updated. The opening timing shall be controlled through approved system configuration, and the field shall be updated after case closure in accordance with the bank's approved policy and the integration approach approved by the IT team.**

---

## 📋 SHORT REQUIREMENT (for FR Matrix)

| FR-ID | Requirement | Form Field | Type | Validation | Dependencies | Mandatory |
|-------|-------------|-----------|------|-----------|--------------|-----------|
| FR-200 | EDD Case Creation Trigger | High Risk Check | Auto-Logic | Create case only if customer = High Risk | Risk Classification | YES |
| FR-201 | Next EDD Date Field (T24) | Next EDD Date | Date Field | DD/MM/YYYY, Stored in T24 | None | YES |
| FR-202 | Date-Based Opening Logic | Opening Rule Config | Configuration | Configuration-driven: on date / 1 week before / custom | FR-201 | YES |
| FR-203 | High Risk Validation | Risk Classification | Lookup | Check latest classification before case creation | CRM/Risk System | YES |
| FR-204 | Re-KYC Relationship | Re-KYC Integration | Logic | Independent process, EDD case reopened if High Risk confirmed | Re-KYC Process | NO |
| FR-205 | Update Next EDD Date | Date Update Logic | Auto-Process | Update after case closure per approved policy | Case Closure | YES |
| FR-206 | T24 Integration | T24 Sync | Integration | Direct integration or approved data layer | IT Approval | YES |
| FR-207 | Audit Trail Recording | Case Audit Log | System Log | Record creation, trigger, check, update, closure | All FR-200 to FR-206 | YES |
| FR-208 | BRD Compliance Statement | System Capability | Verification | Confirm all 9 points implemented | All above | YES |

---

## 📊 FUNCTIONAL SUMMARY

```
Core Logic:
┌─────────────────────────────────────────┐
│ Customer High Risk Classification?      │
│ ✓ Yes → Check Next EDD Date             │
│ ✗ No → Do NOT Create Case               │
├─────────────────────────────────────────┤
│ Next EDD Date Threshold Reached?        │
│ (Configuration: on date / 1 week before)│
│ ✓ Yes → CREATE EDD CASE                 │
│ ✗ No → Wait until threshold             │
├─────────────────────────────────────────┤
│ Case Closed?                            │
│ ✓ Yes → Update Next EDD Date in T24     │
│ ✗ No → Continue case processing         │
└─────────────────────────────────────────┘
```

---

## ✅ WORKFLOW SEQUENCE

1. **System Check** (Daily/Scheduled): Scan all customers with High Risk classification
2. **Date Comparison**: Check if Next EDD Date threshold met (per configuration)
3. **Case Creation**: If conditions met → Auto-create EDD case with reference date
4. **Notification**: Alert relevant RM/CSO of new case
5. **Case Processing**: EDD form completed, reviewed, approved
6. **Case Closure**: System updates Next EDD Date in T24
7. **Audit Log**: All actions recorded with full traceability

---

## 🔗 LINKAGE TO MAIN BRD

| Related FR Section | Link | Status |
|------------------|------|--------|
| Risk Classification (FR-011 to FR-025) | High Risk triggers case creation | ✅ Linked |
| Approvals (FR-116 to FR-135) | Case closure triggers Next EDD Date update | ✅ Linked |
| Audit Trail (FR-143) | Full audit trail for all case actions | ✅ Linked |
| T24 Integration | New field + ETL process required | 🔄 Pending |

---

**Document Status:** ✅ READY FOR IMPLEMENTATION  
**Integration Point:** T24  
**Configuration Required:** Case Opening Timing Rules  
**Date:** 11 March 2026

