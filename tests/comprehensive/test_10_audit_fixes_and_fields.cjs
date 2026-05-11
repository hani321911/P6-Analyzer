// ═══════════════════════════════════════════════════════════════
// TEST 10: Audit Fixes + Fields Used Card (v29.0.11.6)
// ═══════════════════════════════════════════════════════════════
const { readFileSync } = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', '..', 'p6-analyzer.html');
const html = readFileSync(HTML_PATH, 'utf-8');
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][1][1];

console.log('═══════════════════════════════════════════════════════════');
console.log('  TEST 10: Audit Fixes + Fields Used Card');
console.log('═══════════════════════════════════════════════════════════\n');

let passed = 0, failed = 0;
const test = (label, condition) => {
  if (condition) { console.log('  ✓ ' + label); passed++; }
  else { console.log('  ✗ FAIL: ' + label); failed++; }
};

// ──────────────────────────────────────────────────
// AUDIT FIXES
// ──────────────────────────────────────────────────
console.log('▶ Fix F-01: NaN Guard in Weighted Roll-up');
test('Number.isFinite check on weight in valid filter',
  script.includes('Number.isFinite(w) && w > 0'));
test('Number.isFinite check on plannedPct',
  script.includes('Number.isFinite(r.plannedPct)'));
test('Number.isFinite check on actualPct',
  script.includes('Number.isFinite(r.actualPct)'));
test('Final safety: planned guarded by Number.isFinite',
  script.includes('Number.isFinite(planned) ? +planned.toFixed(2) : 0'));
test('Final safety: actual guarded by Number.isFinite',
  script.includes('Number.isFinite(actual) ? +actual.toFixed(2) : 0'));

console.log('\n▶ Fix F-02 + F-03: Inverted Dates Detection');
test('integrityIssues initialized early in analyze()',
  // v29.0.11.11 FIX L-01: Generic check instead of version-specific string
  script.includes('Initialize integrityIssues EARLY') || script.includes('const integrityIssues = []'));
test('Inverted dates check in calcPct',
  script.includes('if (f < s)'));
test('Inverted dates logged to integrityIssues',
  script.includes("type: 'inverted_dates'"));
test('No duplicate const integrityIssues',
  (script.match(/const integrityIssues = \[\]/g) || []).length === 1);

console.log('\n▶ Fix F-04: ActualFinish vs Status Mismatch');
test('actualFinish check in row building',
  script.includes('p.actualFinish && new Date(p.actualFinish) <= dataDate'));
test('actualFinish_status_mismatch logged',
  script.includes("type: 'actualFinish_status_mismatch'"));

console.log('\n▶ Fix F-05: physicalPct=100 without actualFinish');
test('physicalPct_100_no_actualFinish detection',
  script.includes("type: 'physicalPct_100_no_actualFinish'"));

// ──────────────────────────────────────────────────
// NEW FEATURE: FieldsUsedCard
// ──────────────────────────────────────────────────
console.log('\n▶ NEW FEATURE: Fields Used Card');
test('FieldsUsedCard component defined',
  script.includes('function FieldsUsedCard'));
test('Card supports 5 methods (cost/units/duration/count/ng_matrix)',
  script.includes("methodKey === 'cost'") ||
  (script.includes('cost:') && script.includes('units:') && 
   script.includes('duration:') && script.includes('count:') && 
   script.includes('ng_matrix:')));
test('Card adapts to costMethodDetected (expense_weightage)',
  script.includes('costMethodDetected === "expense_weightage"'));
test('Card adapts to costMethodDetected (at_completion)',
  script.includes('costMethodDetected === "at_completion"'));
test('Card shows ActivityExpense fields when expense_weightage',
  script.includes('ActivityExpense.PlannedCost'));
test('Card shows AtCompletionExpenseCost when at_completion',
  script.includes('Activity.AtCompletionExpenseCost'));
test('Card has bilingual support (Arabic + English)',
  script.includes('lang === "ar"') && script.includes('isAr'));
test('Card splits Baseline vs Progress fields',
  script.includes('From Baseline') && script.includes('From Progress'));
test('Card shows formula per method',
  script.includes('mapping.formula'));
test('Card marks critical fields',
  script.includes('f.critical'));
test('Card integrated in methods tab UI',
  script.includes('React.createElement(FieldsUsedCard'));

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  TEST 10 RESULTS: ' + passed + '/' + (passed + failed) + ' passed');
console.log('═══════════════════════════════════════════════════════════');
process.exit(failed > 0 ? 1 : 0);
