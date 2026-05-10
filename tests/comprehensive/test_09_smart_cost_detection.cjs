// ═══════════════════════════════════════════════════════════════
// TEST 9: Smart Cost Detection Engine (v29.0.11.4)
// ═══════════════════════════════════════════════════════════════
const { readFileSync } = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', '..', 'p6-analyzer.html');
const html = readFileSync(HTML_PATH, 'utf-8');
const matches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const script = matches[1][1];

console.log('═══════════════════════════════════════════════════════════');
console.log('  TEST 9: Smart Cost Detection Engine');
console.log('═══════════════════════════════════════════════════════════\n');

let passed = 0, failed = 0;
const test = (label, condition) => {
  if (condition) { console.log('  ✓ ' + label); passed++; }
  else { console.log('  ✗ FAIL: ' + label); failed++; }
};

// Code structure tests
console.log('▶ Code Structure');
test('Smart Cost Detection Engine present',
  script.includes('SMART COST DETECTION ENGINE'));
test('ActivityExpense parser added',
  script.includes('findAll(root, "ActivityExpense")'));
test('expenseCostMap built',
  script.includes('expenseCostMap[actObjId]'));
test('AtCompletionExpenseCost read into activities',
  script.includes('atCompletionExpenseCost = atc'));
test('costMethodSignals object created',
  script.includes('costMethodSignals'));
test('Detection logic with priority',
  script.includes('detectedCostMethod = candidates[0].key') &&
  script.includes('candidates[0].score > 0'));
test('Coverage threshold defined',
  script.includes('COVERAGE_THRESHOLD'));
test('_derivedTotalCost field augments activities',
  script.includes('a._derivedTotalCost = '));

// Smart totalCost
console.log('\n▶ Smart totalCost() Function');
test('totalCost respects _derivedTotalCost',
  script.includes('hasOwnProperty.call(a, "_derivedTotalCost")'));
test('totalCost preserves backward compatibility',
  script.includes('// Standard fallback (only when detection engine never ran'));
test('totalActualCost respects _derivedActualCost',
  script.includes('hasOwnProperty.call(a, "_derivedActualCost")'));

// Return values
console.log('\n▶ Parser Return Values');
test('Parser returns detectedCostMethod',
  script.includes('detectedCostMethod: detectedCostMethod'));
test('Parser returns costMethodSignals',
  script.includes('costMethodSignals: costMethodSignals'));
test('Parser returns expenseCostMap',
  script.includes('expenseCostMap: expenseCostMap'));

// EVM summary integration
console.log('\n▶ EVM Summary Integration');
test('Summary surfaces costMethodDetected',
  script.includes('costMethodDetected: refBL.detectedCostMethod'));
test('Summary surfaces costMethodLabel',
  script.includes('costMethodLabel: refBL.costMethodSignals'));
test('Summary surfaces costMethodLabelAr',
  script.includes('costMethodLabelAr: refBL.costMethodSignals'));

// UI Badge
console.log('\n▶ UI Badge');
test('UI shows cost method detection badge',
  script.includes('s.costMethodDetected !== "none"'));
test('Badge has bilingual text',
  script.includes('Detected Cost Method:') &&
  script.includes('\\u0637\\u0631\\u064a\\u0642\\u0629'));

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  TEST 9 RESULTS: ' + passed + '/' + (passed + failed) + ' passed');
console.log('═══════════════════════════════════════════════════════════');
process.exit(failed > 0 ? 1 : 0);
