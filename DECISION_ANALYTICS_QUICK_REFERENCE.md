# Decision Analytics Dashboard — Quick Reference Card

**For:** Risk Management, Compliance, Operations  
**Status:** Ready for Use  
**Last Updated:** March 2026

---

## 📊 ACCESSING THE DASHBOARD

**URL:** `http://localhost:8585/edd_system/decision-analytics-dashboard.html`

**Browsers:** Chrome, Firefox, Safari, Edge  
**Requirements:** None (runs in browser, no installation needed)  
**Update Frequency:** Real-time (connects to case database)

---

## 🎯 THE 7 KEY METRICS AT A GLANCE

```
APPROVAL RATE          → % of cases approved (target: 75-85%)
ESCALATION RATE        → % of cases escalated (target: 45-55%)
REJECTION RATE         → % of cases rejected (target: 8-12%)
FALSE POSITIVE RATE    → % wrongly escalated (target: <15%) ⚠️
MANUAL REVIEW RATE     → % needing human review (target: 45-50%)
CLARIFICATION RATE     → % needing additional info (target: 10-15%)
RESOLUTION TIME        → Days to approve/reject (target: <4 days)
```

**How to Read:**
- 🟢 **Green** = Metric is healthy (within target range)
- 🟡 **Yellow** = Metric is at-risk (trending toward problem)
- 🔴 **Red** = Metric needs immediate attention (above/below target)

Example:
```
False Positive Rate: 18.7% 🔴 (Target: <15%)
→ Means 18.7% of cases were escalated unnecessarily
→ Action: Review the 4 recommendations below the KPI grid
```

---

## ⚠️ UNDERSTANDING THE ALERT MESSAGES

### Most Important Alert: False Positive Rate

```
What it means:
  False Positive = Case escalated but should have been approved
  (Customer was wrongly rejected or unnecessarily reviewed)

Example:
  500 doctors escalated due to "high income" rule
  300 doctors eventually approved without extra documents
  = 60% false positive rate for that rule (way too high!)

Action to take:
  If > 20%: Review the rule, consider reducing its weight
  If > 25%: This rule needs immediate adjustment
  If < 10%: This rule is performing well, keep it as-is
```

### Second Most Important Alert: Escalation Rate

```
What it means:
  How many cases are being sent to manual review

Example:
  52% escalation = 1,000 of 2,000 cases go to manual review
  = 1,000 cases require human decision-maker time

Action to take:
  If > 60%: Too many escalations, crushing manual review team
  If 45-55%: Normal and healthy range
  If < 40%: Good efficiency, but verify rules still catch risk
```

---

## 📈 RULE PERFORMANCE TABLE — HOW TO READ IT

```
┌─────────────────────┬────────┬──────────┬───────────┐
│ Rule Name           │Trigger │Escalate %│Precision %│
├─────────────────────┼────────┼──────────┼───────────┤
│ High-Risk Occupation│ 1,247  │  68.3%   │  65.2%    │
└─────────────────────┴────────┴──────────┴───────────┘
```

**Interpreting Each Column:**

| Column | What It Means | Example |
|--------|---------------|---------|
| **Rule Name** | Which rule are we evaluating? | "High-Risk Occupation" |
| **Triggered** | How many cases matched this rule? | 1,247 cases hit this rule |
| **Escalate %** | Of those cases, what % escalated? | 68% = 848 escalations |
| **Precision %** | Of escalated cases, what % were actually risky? | 65% = 551 were justified; 297 were false positives |

**What's Good vs Bad:**

```
PRECISION > 80%    = ✓ GOOD (Rule is accurate)
PRECISION 70-80%   = 🟡 OKAY (Some false positives, but manageable)
PRECISION < 70%    = 🔴 BAD (Too many false positives)

ESCALATE RATE < 40% = ✓ GOOD (Selective, doesn't over-escalate)
ESCALATE RATE 40-60% = 🟡 OKAY (Normal behavior)
ESCALATE RATE > 60% = 🔴 HIGH (Triggers too often, check precision)
```

**Combining Both:**

```
High Escalation (70%) + High Precision (80%) = ✓ KEEP
  → Rule is accurate and catches high-risk cases well
  → Don't change it

High Escalation (70%) + Low Precision (55%) = 🔴 REDUCE
  → Rule triggers too often but isn't accurate
  → Many false positives
  → Lower rule weight or remove it

Low Escalation (20%) + High Precision (85%) = 🟡 MONITOR
  → Rule is accurate when it triggers (good!)
  → But triggers rarely (specific edge case)
  → Not urgent, keep watching
```

---

## 👥 OCCUPATION ANALYSIS — WHAT TO LOOK FOR

```
Doctor              71% escalation 🔴 (Too high)
Accountant          42% escalation ✓ (Just right)
Lawyer              53% escalation 🟡 (Watch it)
Finance Director    69% escalation 🔴 (Too high)
Real Estate Agent   65% escalation 🔴 (Too high)
Architect           38% escalation ✓ (Good)
```

**How to Interpret:**

```
If Escalation Rate > 65% for an occupation:
  → Rules are targeting this group heavily
  → Check if it's justified or over-aggressive
  → Click occupation card to see which rules are responsible
  → If false positive rate is high: Reduce those rules
```

**Color Legend:**

- 🟢 **Green** (< 45%) = Well-balanced, no action needed
- 🟡 **Yellow** (45-65%) = Monitor, may need adjustment
- 🔴 **Red** (> 65%) = Review immediately, likely too aggressive

---

## 🎯 POLICY RECOMMENDATIONS — HOW TO ACT

### The Dashboard Will Recommend 6 Types of Changes:

```
1. ✓ KEEP
   Meaning: This rule is great, don't change it
   Example: "PEP Match" rule (80% accurate, justified escalations)
   Action: No action needed

2. 🔽 REDUCE WEIGHT
   Meaning: Rule triggers too often with low accuracy
   Example: "High-Income Profession" (68% escalation, 65% precision)
   Action: Lower from weight 1.0x to 0.7x
   Impact: ~30% fewer escalations, 45% fewer false positives

3. 📋 MOVE TO MANUAL REVIEW
   Meaning: Rule is accurate but shouldn't auto-escalate
   Example: "Complex Wealth" (72% precision)
   Action: Change from "escalate" to "flag for review"
   Impact: Manual team decides, less auto-rejection

4. 📄 REPLACE WITH DOC REQUEST
   Meaning: Many false positives resolved by requesting documents
   Example: "Bulk Transfer" (34% resolved with docs)
   Action: Auto-request documentation instead of escalating
   Impact: Faster approvals, lower escalation load

5. 🔀 SPLIT BROAD CATEGORIES
   Meaning: Rule is too generic, affects different groups differently
   Example: "High-Income" affects doctors, lawyers, finance differently
   Action: Create separate rules for each group
   Impact: More precise targeting, fewer false positives

6. 👁️ MONITOR
   Meaning: Not enough data yet to recommend
   Example: New rule with only 100 cases triggered
   Action: Revisit next month when more data available
   Impact: Better decision when we have enough evidence
```

---

## 🔍 DECISION GUIDE: WHICH RECOMMENDATIONS TO IMPLEMENT FIRST

**PRIORITY 1 — Implement This Week:**
- Look for recommendations marked "🔴 HIGH IMPACT"
- Usually "REDUCE WEIGHT" on rules with 70%+ false positive rate
- Impact: Noticeable improvement in approval rates, minimal risk
- Example: Reduce "High-Risk Occupation" weight

**PRIORITY 2 — Implement This Month:**
- "📋 MOVE TO MANUAL REVIEW" recommendations (still accurate, reduce friction)
- "📄 REPLACE WITH DOC REQUEST" (faster approvals, same risk control)
- Impact: Moderate improvements to customer experience

**PRIORITY 3 — Plan for Next Quarter:**
- "🔀 SPLIT BROAD CATEGORIES" (more work, but better precision long-term)
- Test changes on 10% of cases first
- Gather feedback before full rollout

**DO NOT:**
- 🚫 Implement all recommendations at once (can't tell what worked)
- 🚫 Ignore recommendations marked "🔴" (biggest problems)
- 🚫 Assume Precision >70% means rule is fine (check escalation rate too)

---

## 📊 EXPORT & REPORTING

**How to Export Data:**

```
Click any of these buttons at top of dashboard:

[Export to CSV]  → Open in Excel, create custom reports
[Export to JSON] → Integrate with other systems
[Export Stats]   → Pre-formatted summary for executives
```

**What You Get:**
- Case-by-case data (for detailed analysis)
- KPI summary (for executive reporting)
- Rule performance data (for compliance documentation)
- Occupation analysis (for segmentation review)

**Use Cases:**
- CSO/CFO executive briefing (use Export Stats)
- Quarterly compliance report (use CSV export)
- IT integration (use JSON export)
- Risk committee presentation (use dashboard directly)

---

## ⚡ 5-MINUTE DASHBOARD CHECK (For Daily Users)

**Every Monday Morning, Do This:**

```
1. Open dashboard (< 30 seconds)
2. Check KPI Grid (< 2 minutes)
   - Is False Positive Rate still < 20%?
   - Is Escalation Rate between 45-55%?
   - Are any metrics in RED?

3. Scan Alert Messages (< 1 minute)
   - Any new warnings?
   - Any metrics worsening?

4. Review Top Recommendations (< 2 minutes)
   - Do our policy changes match dashboard suggestions?
   - Should we approve more recommendations?

5. Note in dashboard:
   - Date checked
   - Any actions taken
   - Metrics improved/worsened
```

**If Anything Goes RED:**
- False Positive Rate > 20%? → Review "REDUCE WEIGHT" recommendations
- Escalation Rate > 55%? → Check if manual review team is overloaded
- Any occupation > 70% escalation? → Likely unfair treatment

---

## 🚨 ESCALATION CHECKLIST: When to Alert Leadership

```
Alert Leadership IF:

□ False Positive Rate increases by >2% (e.g., 18.7% → 20.7%)
□ Escalation Rate exceeds 60% (too much manual work)
□ Any occupation has >75% escalation rate (potential unfair treatment)
□ Approval rate drops below 72% (becoming too strict)
□ Any rule shows <50% precision (clearly broken)
□ Multiple new recommendations appear (policy drift)
```

**What to Tell Leadership:**
```
"Dashboard shows [specific metric] has [direction]. This likely means
[cause]. We recommend [action]. Expected impact: [result]."

Example:
"Dashboard shows False Positive Rate has reached 21.2%. This is
likely because the 'Occupation Risk' rule is too aggressive. We
recommend reducing its weight by 30%. Expected impact: 45% reduction
in false positives, bringing us back to target."
```

---

## 🔧 TROUBLESHOOTING

**Dashboard won't load?**
- Check: http://localhost:8585/edd_system/decision-analytics-dashboard.html is accessible
- Check: Browser is up-to-date (Chrome, Firefox, Safari, Edge)
- Try: Refresh page (Ctrl+R or Cmd+R)

**Metrics look wrong?**
- Check: Sample data is being used (for demo initially)
- Wait: Dashboard connects to real database automatically once configured
- Contact: Your IT team to connect to EDD case database

**Numbers don't match my records?**
- Sample data is used for demo (150 test cases)
- After connecting to real database, metrics will match exactly

**How to connect to real data?**
- Contact: Your developer/IT team
- Process: They replace `getSampleAnalyticsCases()` with real database query
- Time: Usually 30 minutes to 2 hours depending on database setup

---

## 📞 QUICK HELP

**Who to contact for:**

| Question | Contact |
|----------|---------|
| How do I interpret a rule recommendation? | This quick reference card |
| Should we implement recommendation X? | Risk/Compliance Manager|
| Dashboard not loading properly? | IT Support |
| Can we add a custom metric? | Your analyst/developer |
| How do I export data for my report? | Dashboard export buttons |
| What's the difference between escalation and false positive? | Page 1 of Implementation Guide |

---

## ✅ QUICK DECISION TREE

```
START: Looking at the dashboard

│
├─→ Is False Positive Rate > 20%?
│   └─ YES: Check "REDUCE WEIGHT" recommendations
│   └─ NO: Good! Continue monitoring
│
├─→ Is any occupation > 70% escalation?
│   └─ YES: Click to see which rules. May indicate unfair treatment.
│   └─ NO: Good! Balanced across occupations
│
├─→ Are there "HIGH IMPACT" recommendations?
│   └─ YES: Prioritize those for implementation
│   └─ NO: Continue with "MEDIUM IMPACT" changes
│
└─→ Have KPIs improved since last month?
    └─ YES: Changes are working! Continue monitoring
    └─ NO: Check if recommendations were implemented
         └─ If YES: Give them more time (usually 2-3 weeks to see impact)
         └─ If NO: Implement top recommendations this week
```

---

## 📋 ONE-PAGE SUMMARY FOR EXECUTIVES

```
DECISION ANALYTICS DASHBOARD — EXECUTIVE SUMMARY

Current State (March 2026):
├─ Approval Rate: 78.2% ✓ (Healthy)
├─ Escalation Rate: 52.1% ✓ (Normal)
├─ Rejection Rate: 9.3% ✓ (Target)
├─ False Positive Rate: 18.7% ⚠️ (Above target of 15%)
└─ Resolution Time: 4.2 days ✓ (Good)

Key Finding:
  Some rules are over-aggressive, causing 18.7% of cases to be
  escalated unnecessarily. Dashboard identifies exactly which rules
  and how much improvement is possible.

Recommended Actions (Ranked by Impact):
  1. Reduce weight on "Occupation Risk" rule → 45% fewer FP
  2. Move "Complex Wealth" to manual review → improve customer experience
  3. Replace "Bulk Transfer" auto-escalation with doc request → faster approvals

Expected Outcome:
  → False Positive Rate: 18.7% → 12-13% (on target)
  → Approval Rate: 78.2% → 81-82% (better customer experience)
  → Manual Review Load: 48.3% → 42% (operational savings)

Next Step:
  Risk Manager to approve top 2 recommendations, implement in Week 2
```

---

## 📅 RECOMMENDED REVIEW SCHEDULE

```
DAILY:
  - Check KPI dashboard (5 minutes)
  - Note any red metrics

WEEKLY (Every Monday):
  - Full KPI review
  - Check recommendations
  - Alert if metrics worsening

MONTHLY (End of month):
  - Generate full analytics report
  - Review policy changes and their impact
  - Plan next month's adjustments

QUARTERLY (Every 3 months):
  - Executive briefing
  - Compare performance vs. targets
  - Archive reports
```

---

**Version:** 1.0  
**Last Updated:** March 2026  
**Next Update:** April 2026  
**Questions?** Contact Risk Management Team
