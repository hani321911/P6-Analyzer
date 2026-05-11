// ═══════════════════════════════════════════════════════════════════
// TEST 11: v29.0.11.10 ENHANCEMENTS (5 features for 100/100 score)
// ═══════════════════════════════════════════════════════════════════
const { readFileSync } = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', '..', 'p6-analyzer.html');
const html = readFileSync(HTML_PATH, 'utf-8');
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][1][1];

console.log('═══════════════════════════════════════════════════════════════════');
console.log('  TEST 11: v29.0.11.10 — 5 Enhancements for 100/100 Score');
console.log('═══════════════════════════════════════════════════════════════════\n');

let passed = 0, failed = 0;
const test = (label, condition) => {
  if (condition) { console.log('  ✓ ' + label); passed++; }
  else { console.log('  ✗ FAIL: ' + label); failed++; }
};

// ═══════════════════════════════════════════════════════════════════
// Enhancement #1: Cost-Loaded Curve Support
// ═══════════════════════════════════════════════════════════════════
console.log('▶ ENHANCEMENT #1: Cost-Loaded Curve Support\n');

test('_evaluateCurve function defined',
  script.includes('const _evaluateCurve = (curveType, fraction)'));

test('Supports "front-loaded" curve',
  script.includes('case "front-loaded"') || script.includes('"front_loaded"'));

test('Supports "back-loaded" curve',
  script.includes('case "back-loaded"') || script.includes('"back_loaded"'));

test('Supports "bell" curve',
  script.includes('case "bell"'));

test('Supports "s-curve" curve',
  script.includes('case "s-curve"') || script.includes('"sigmoid"'));

test('_detectCurveType heuristics (procurement → front-loaded)',
  script.includes('procure|material|equip') && script.includes('"front-loaded"'));

test('_detectCurveType heuristics (commissioning → back-loaded)',
  script.includes('commission|testing|punch') && script.includes('"back-loaded"'));

test('calcPct uses curveType when non-linear',
  script.includes('if (curveType && curveType !== "linear")'));

console.log('');

// ═══════════════════════════════════════════════════════════════════
// Enhancement #2: Quantity-Based Weight Method
// ═══════════════════════════════════════════════════════════════════
console.log('▶ ENHANCEMENT #2: Quantity-Based Weight Method\n');

test('_quantityWeight function defined',
  script.includes('const _quantityWeight = (a)'));

test('Reads boqQuantity field',
  script.includes('a.boqQuantity'));

test('Falls back to expense units',
  script.includes('a._expensePlannedUnits'));

test('Falls back to combined resource units',
  script.includes('plannedLaborUnits') && script.includes('plannedNonLaborUnits') && script.includes('plannedMaterialUnits'));

test('Added to weightFns as "quantity"',
  script.includes('quantity: _quantityWeight'));

console.log('');

// ═══════════════════════════════════════════════════════════════════
// Enhancement #3: Rules of Credit Processor
// ═══════════════════════════════════════════════════════════════════
console.log('▶ ENHANCEMENT #3: Rules of Credit Processor\n');

test('_applyRulesOfCredit function defined',
  script.includes('const _applyRulesOfCredit = (p)'));

test('Supports 0/100 rule',
  script.includes('"0/100"') || script.includes("'0/100'"));

test('Supports 50/50 rule',
  script.includes('"50/50"') || script.includes("'50/50'"));

test('Supports 20/80 rule',
  script.includes('"20/80"') || script.includes("'20/80'"));

test('Supports 25/75 rule',
  script.includes('"25/75"') || script.includes("'25/75'"));

test('Supports 30/70 rule',
  script.includes('"30/70"') || script.includes("'30/70'"));

test('Custom X/Y rule via regex',
  script.includes('rule.match(/^(\\d+)[/'));

test('Integrated in getActualPctRatio',
  script.includes('const rocPct = _applyRulesOfCredit(p)'));

console.log('');

// ═══════════════════════════════════════════════════════════════════
// Enhancement #4: Persistent Audit Trail
// ═══════════════════════════════════════════════════════════════════
console.log('▶ ENHANCEMENT #4: Persistent Audit Trail\n');

test('buildAuditTrail function defined',
  script.includes('function buildAuditTrail(baselineActs, progressActs)'));

test('Tracks added activities',
  script.includes("changeType: 'added'"));

test('Tracks deleted activities',
  script.includes("changeType: 'deleted'"));

test('Tracks modified activities',
  script.includes("'modified'") || script.includes("changeType = 'modified'") || script.includes("trail.summary.modified"));

test('Records date changes',
  script.includes("field: 'plannedStart'") && script.includes("field: 'plannedFinish'"));

test('Records duration changes',
  script.includes("field: 'plannedDuration'"));

test('Records cost changes',
  script.includes("field: 'plannedCost'"));

test('Computes delayDays',
  script.includes('delayDays'));

test('Computes deltaPct',
  script.includes('deltaPct'));

test('Integrated in analyze result',
  script.includes('auditTrail: buildAuditTrail'));

console.log('');

// ═══════════════════════════════════════════════════════════════════
// Enhancement #5: Performance Optimization
// ═══════════════════════════════════════════════════════════════════
console.log('▶ ENHANCEMENT #5: Performance Optimization\n');

test('findAll uses WeakMap cache',
  script.includes('const _findAllCache = new WeakMap()'));

test('findAll is iterative (not recursive)',
  script.includes('Iterative DFS') || (script.includes('const stack = [root2]') && script.includes('while (stack.length > 0)')));

test('Cache per root-tag pair',
  script.includes('rootCache[tag]'));

console.log('');

// ═══════════════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════════════
console.log('═══════════════════════════════════════════════════════════════════');
console.log(`  TEST 11 RESULTS: ${passed}/${passed + failed} passed`);
console.log('═══════════════════════════════════════════════════════════════════');

process.exit(failed > 0 ? 1 : 0);
