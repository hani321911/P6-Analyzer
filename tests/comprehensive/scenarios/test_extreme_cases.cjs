// ═══════════════════════════════════════════════════════════════
// EXTREME EDGE CASES — Smart Cost Detection Stress Tests
// ═══════════════════════════════════════════════════════════════
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('/home/claude/.npm-global/lib/node_modules/jsdom');
const { buildXML } = require('./generate_xml.cjs');

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;
global.DOMParser = dom.window.DOMParser;

const html = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'p6-analyzer.html'), 'utf-8');
const matches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const script = matches[1][1];

const parseStart = script.indexOf('function parseP6XML(');
let depth = 0, parseEnd = parseStart, foundOpen = false;
for (let i = parseStart; i < script.length; i++) {
  if (script[i] === '{') { depth++; foundOpen = true; }
  if (script[i] === '}') { depth--; if (foundOpen && depth === 0) { parseEnd = i + 1; break; } }
}

const parseP6XML = new Function('return ' + script.substring(parseStart, parseEnd))();

console.log('═══════════════════════════════════════════════════════════════');
console.log('  EXTREME EDGE CASES — Stress Testing the Smart Detection');
console.log('═══════════════════════════════════════════════════════════════\n');

let passed = 0, failed = 0;
const results = [];

const test = (label, expectFn, xml, options = {}) => {
  try {
    const result = parseP6XML(xml);
    const detected = result.detectedCostMethod || 'none';
    const totalActs = result.activities.length;
    
    const pass = expectFn(result);
    
    if (pass) {
      console.log(`  ✓ ${label}`);
      console.log(`    → Detected: ${detected} | Activities: ${totalActs}`);
      passed++;
    } else {
      console.log(`  ✗ FAIL: ${label}`);
      console.log(`    → Got: detected=${detected}, activities=${totalActs}`);
      if (result.costMethodSignals) {
        const s = result.costMethodSignals;
        console.log(`    → Coverage:`, s.coverages);
      }
      failed++;
    }
    results.push({ label, pass });
  } catch (e) {
    console.log(`  ✗ ERROR: ${label} - ${e.message}`);
    failed++;
    results.push({ label, error: e.message, pass: false });
  }
};

// ═══════════════════════════════════════════════════════════════
// CATEGORY A: NUMERIC EDGE CASES
// ═══════════════════════════════════════════════════════════════
console.log('\n📋 CATEGORY A: NUMERIC EDGE CASES\n');

// Very large numbers
test('A01: Very large costs ($1B per activity)',
  r => r.detectedCostMethod === 'standard' && r.activities[0]._derivedTotalCost === 1e9,
  buildXML({ activities: Array.from({length: 5}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i, plannedNonLaborCost: 1e9 })) }));

// Very small numbers (cents)
test('A02: Very small costs ($0.01)',
  r => r.detectedCostMethod === 'standard',
  buildXML({ activities: Array.from({length: 5}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i, plannedNonLaborCost: 0.01 })) }));

// Floating point precision
test('A03: Floating point precision (0.1 + 0.2)',
  r => r.detectedCostMethod === 'standard',
  buildXML({ activities: Array.from({length: 5}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i, plannedNonLaborCost: 0.1, plannedLaborCost: 0.2 })) }));

// Mixed scales (some $1, some $1B)
test('A04: Mixed scales ($1 to $1B)',
  r => r.detectedCostMethod === 'standard',
  buildXML({ activities: [
    ...Array.from({length: 5}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i, plannedNonLaborCost: 1 })),
    ...Array.from({length: 5}, (_, i) => ({ actId: `B${1000+i}`, objId: 200+i, plannedNonLaborCost: 1e9 }))
  ]}));

// ═══════════════════════════════════════════════════════════════
// CATEGORY B: MASSIVE PROJECTS
// ═══════════════════════════════════════════════════════════════
console.log('\n📋 CATEGORY B: MASSIVE PROJECTS (performance)\n');

// 1000 activities
test('B01: 1000 activities (mega project)',
  r => r.activities.length === 1000 && r.detectedCostMethod === 'standard',
  buildXML({ activities: Array.from({length: 1000}, (_, i) => ({ actId: `M${1000+i}`, objId: 100+i, plannedNonLaborCost: 50000 })) }));

// 5000 activities + 5000 expenses
test('B02: 5000 activities + 5000 expenses',
  r => r.activities.length === 5000 && r.detectedCostMethod === 'expense_weightage',
  buildXML({
    activities: Array.from({length: 5000}, (_, i) => ({ actId: `M${1000+i}`, objId: 100+i })),
    expenses: Array.from({length: 5000}, (_, i) => ({ actObjId: 100+i, objId: 200+i, item: 'Weightages', plannedCost: 10000 }))
  }));

// ═══════════════════════════════════════════════════════════════
// CATEGORY C: TRICKY DATA STRUCTURES
// ═══════════════════════════════════════════════════════════════
console.log('\n📋 CATEGORY C: TRICKY DATA STRUCTURES\n');

// Activities WITHOUT IDs (corrupt)
test('C01: Activities with empty actId',
  r => r.activities.length >= 0,  // Just shouldn't crash
  buildXML({ activities: [{ actId: '', objId: 1, plannedNonLaborCost: 100000 }] }));

// Duplicate ActObjId
test('C02: Duplicate ObjectIds (corrupt)',
  r => r.detectedCostMethod !== undefined,  // Shouldn't crash
  buildXML({ activities: [
    { actId: 'A1', objId: 100, plannedNonLaborCost: 50000 },
    { actId: 'A2', objId: 100, plannedNonLaborCost: 50000 }  // Same objId!
  ]}));

// Expense without matching Activity
test('C03: Expense references non-existent ActivityObjectId',
  r => r.detectedCostMethod === 'none' || r.detectedCostMethod === 'expense_weightage',
  buildXML({
    activities: Array.from({length: 5}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i })),
    expenses: [{ actObjId: 9999, objId: 200, item: 'Weightages', plannedCost: 100000 }]  // Bad reference
  }));

// Expense with negative cost
test('C04: Negative expense cost',
  r => r.detectedCostMethod !== undefined,  // Shouldn't crash
  buildXML({
    activities: Array.from({length: 5}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i })),
    expenses: Array.from({length: 5}, (_, i) => ({ actObjId: 100+i, objId: 200+i, item: 'Weightages', plannedCost: -50000 }))
  }));

// ═══════════════════════════════════════════════════════════════
// CATEGORY D: PERCENT TYPE VARIATIONS
// ═══════════════════════════════════════════════════════════════
console.log('\n📋 CATEGORY D: PERCENT TYPE COMBINATIONS\n');

// All 4 pct types in same project
test('D01: Mix of 4 percent types (Physical+Duration+Units+Manual)',
  r => r.activities.length === 4,
  buildXML({ activities: [
    { actId: 'P1', objId: 1, pctType: 'Physical', physicalPct: 0.5, plannedNonLaborCost: 100000 },
    { actId: 'D1', objId: 2, pctType: 'Duration', durationPct: 0.5, plannedNonLaborCost: 100000 },
    { actId: 'U1', objId: 3, pctType: 'Units', unitsPct: 0.5, plannedNonLaborCost: 100000 },
    { actId: 'M1', objId: 4, pctType: 'Manual', pctComplete: 0.5, plannedNonLaborCost: 100000 }
  ]}));

// PercentComplete > 100
test('D02: PercentComplete > 100 (data corruption)',
  r => r.activities.length === 5,  // Just shouldn't crash
  buildXML({ activities: Array.from({length: 5}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i, pctType: 'Physical', physicalPct: 150, plannedNonLaborCost: 50000 })) }));

// PercentComplete negative
test('D03: PercentComplete < 0 (data corruption)',
  r => r.activities.length === 5,
  buildXML({ activities: Array.from({length: 5}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i, pctType: 'Physical', physicalPct: -0.5, plannedNonLaborCost: 50000 })) }));

// ═══════════════════════════════════════════════════════════════
// CATEGORY E: REAL CONTRACTOR ANTI-PATTERNS
// ═══════════════════════════════════════════════════════════════
console.log('\n📋 CATEGORY E: ANTI-PATTERNS (bad contractor practices)\n');

// All cost in ONE activity (lump sum trick)
test('E01: All cost in 1 activity (lump-sum trick)',
  r => r.activities.length === 100 && r.detectedCostMethod === 'none',  // 1/100 = 1% < 30%
  buildXML({
    activities: [
      { actId: 'LUMP', objId: 1, plannedNonLaborCost: 10000000 },
      ...Array.from({length: 99}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i }))
    ]
  }));

// Single LOE absorbs 80% of cost
test('E02: Single LOE absorbs 80% of cost',
  r => r.activities.length === 11,
  buildXML({
    activities: [
      { actId: 'LOE-PM', objId: 1, type: 'Level of Effort', plannedNonLaborCost: 8000000 },
      ...Array.from({length: 10}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i, plannedNonLaborCost: 200000 }))
    ]
  }));

// All 0% complete despite past dates (no actuals submitted)
test('E03: 100 activities, all 0% complete (no actuals)',
  r => r.activities.length === 100,
  buildXML({
    activities: Array.from({length: 100}, (_, i) => ({
      actId: `A${1000+i}`, objId: 100+i,
      plannedNonLaborCost: 50000,
      pctType: 'Physical',
      physicalPct: 0,
      plannedStart: '2025-01-01T00:00:00',
      plannedFinish: '2025-12-31T00:00:00'
    }))
  }));

// All completed but no actual finish dates
test('E04: All 100% but no actualFinish (data inconsistency)',
  r => r.activities.length === 50,
  buildXML({
    activities: Array.from({length: 50}, (_, i) => ({
      actId: `A${1000+i}`, objId: 100+i,
      plannedNonLaborCost: 50000,
      pctType: 'Physical',
      physicalPct: 1.0,
      status: 'Completed'
      // No actualFinish!
    }))
  }));

// ═══════════════════════════════════════════════════════════════
// CATEGORY F: PERFORMANCE CHECKS
// ═══════════════════════════════════════════════════════════════
console.log('\n📋 CATEGORY F: PERFORMANCE\n');

// Time the parsing
const t0 = Date.now();
const xml1000 = buildXML({
  activities: Array.from({length: 1000}, (_, i) => ({ actId: `T${1000+i}`, objId: 100+i, plannedNonLaborCost: 50000 })),
  expenses: Array.from({length: 1000}, (_, i) => ({ actObjId: 100+i, objId: 200+i, item: 'Weightages', plannedCost: 50000 }))
});
const result1000 = parseP6XML(xml1000);
const t1 = Date.now();

console.log(`  ✓ F01: Parse 1000 activities + 1000 expenses in ${t1-t0}ms`);
if (t1-t0 < 5000) passed++; else { console.log(`    ⚠️ Slow! Should be < 5000ms`); failed++; }

const t2 = Date.now();
const xml5000 = buildXML({
  activities: Array.from({length: 5000}, (_, i) => ({ actId: `M${1000+i}`, objId: 100+i, plannedNonLaborCost: 50000 }))
});
const result5000 = parseP6XML(xml5000);
const t3 = Date.now();

console.log(`  ✓ F02: Parse 5000 activities in ${t3-t2}ms`);
if (t3-t2 < 15000) passed++; else { console.log(`    ⚠️ Slow! Should be < 15000ms`); failed++; }

// SUMMARY
console.log('\n═══════════════════════════════════════════════════════════════');
console.log(`  RESULTS: ${passed}/${passed+failed} extreme tests passed`);
console.log('═══════════════════════════════════════════════════════════════');

if (failed > 0) {
  console.log('\n⚠️ FAILURES:');
  results.filter(r => !r.pass).forEach(r => {
    console.log(`  - ${r.label}: ${r.error || 'failed'}`);
  });
}

process.exit(failed > 0 ? 1 : 0);
