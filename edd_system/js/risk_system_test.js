/**
 * ============================================================================
 * RISK SYSTEM TEST - اختبار نظام المخاطر
 * ============================================================================
 * اختبر تحميل الملفات والحسابات التلقائية للمخاطر
 */

window.RISK_SYSTEM_TEST = {
  testResults: [],

  runAllTests: function() {
    console.log('🧪 === RISK SYSTEM TESTS START === 🧪');
    
    this.testRiskDatasetsLoaded();
    this.testRiskEngineLoaded();
    this.testRiskDatasetFunctions();
    this.testRiskCalculation();
    this.testCaseEnrichment();
    
    this.printResults();
  },

  testRiskDatasetsLoaded: function() {
    const passed = typeof window.RISK_DATASETS !== 'undefined';
    this.addResult('✅ Risk Datasets Loaded', passed);
    
    if (passed) {
      console.log('✅ RISK_DATASETS found:', {
        countries: window.RISK_DATASETS.country_risk?.length || 0,
        activities: window.RISK_DATASETS.activity_risk?.length || 0,
        products: window.RISK_DATASETS.product_risk?.length || 0,
        occupations: window.RISK_DATASETS.occupation_risk?.length || 0,
        peps: window.RISK_DATASETS.pep_registry?.length || 0
      });
    }
  },

  testRiskEngineLoaded: function() {
    const passed = typeof window.RiskEngine !== 'undefined';
    this.addResult('✅ Risk Engine Loaded', passed);
    
    if (passed) {
      console.log('✅ RiskEngine methods available:', {
        calculateRiskScore: typeof RiskEngine.calculateRiskScore === 'function',
        classifyRisk: typeof RiskEngine.classifyRisk === 'function',
        enrichCustomerWithRiskScores: typeof RiskEngine.enrichCustomerWithRiskScores === 'function'
      });
    }
  },

  testRiskDatasetFunctions: function() {
    if (typeof window.RISK_DATASETS === 'undefined') {
      this.addResult('⚠️ Skip Dataset Functions Test', false);
      return;
    }

    // Test country risk lookup
    const qaCountry = RISK_DATASETS.getCountryRisk('QA');
    const passed1 = qaCountry && qaCountry.score === 40;
    this.addResult('✅ Country Risk Lookup (QA)', passed1);

    // Test activity risk lookup
    const bankingActivity = RISK_DATASETS.getActivityRisk('BANKING');
    const passed2 = bankingActivity && bankingActivity.score > 0;
    this.addResult('✅ Activity Risk Lookup (BANKING)', passed2);

    // Test occupation risk lookup
    const engineerOcc = RISK_DATASETS.getOccupationRisk('ENGINEER');
    const passed3 = engineerOcc && engineerOcc.score > 0;
    this.addResult('✅ Occupation Risk Lookup (ENGINEER)', passed3);

    console.log('📊 Dataset Lookup Results:', {
      qaCountry: qaCountry,
      bankingActivity: bankingActivity,
      engineerOcc: engineerOcc
    });
  },

  testRiskCalculation: function() {
    if (typeof window.RiskEngine === 'undefined' || typeof window.RISK_DATASETS === 'undefined') {
      this.addResult('⚠️ Skip Risk Calculation Test', false);
      return;
    }

    // Test with sample customer data
    const testCustomer = {
      customer_name: 'Ahmed Al Thani',
      nationalityCode: 'QA',
      activity: 'BANKING',
      product: 'CHECKING',
      occupation: 'ENGINEER'
    };

    const riskScore = RiskEngine.calculateRiskScore(testCustomer);
    const passed = riskScore && riskScore.total > 0;
    this.addResult('✅ Risk Score Calculation', passed);

    console.log('🔢 Risk Score Result:', riskScore);
  },

  testCaseEnrichment: function() {
    if (typeof RiskEngine === 'undefined') {
      this.addResult('⚠️ Skip Case Enrichment Test', false);
      return;
    }

    const testCase = {
      id: 'TEST-001',
      customer_name: 'Fatima Al-Kuwari',
      nationalityCode: 'QA',
      activity: 'TRADING',
      product: 'WIRE_TRANSFER',
      occupation: 'MERCHANT'
    };

    const enriched = RiskEngine.enrichCustomerWithRiskScores(testCase);
    const passed = enriched.riskScores && 
                   enriched.riskScores.FINAL_RISK_CATEG && 
                   enriched.riskScores.FINAL_RISK_SCORE > 0;
    
    this.addResult('✅ Case Enrichment with Risk Scores', passed);

    console.log('📋 Enriched Case:', enriched.riskScores);
  },

  addResult: function(name, passed) {
    this.testResults.push({ name, passed });
  },

  printResults: function() {
    console.log('\n📈 === TEST RESULTS SUMMARY === 📈');
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.passed).length;
    
    this.testResults.forEach(result => {
      const icon = result.passed ? '✅' : '❌';
      console.log(`${icon} ${result.name}`);
    });

    console.log(`\n📊 SCORE: ${passedTests}/${totalTests} PASSED`);
    
    if (passedTests === totalTests) {
      console.log('🎉 ALL TESTS PASSED! Risk system is ready.');
    } else {
      console.log(`⚠️ ${totalTests - passedTests} test(s) failed. Please review.`);
    }
  }
};

// Auto-run tests when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => window.RISK_SYSTEM_TEST.runAllTests(), 1000);
  });
} else {
  setTimeout(() => window.RISK_SYSTEM_TEST.runAllTests(), 1000);
}
