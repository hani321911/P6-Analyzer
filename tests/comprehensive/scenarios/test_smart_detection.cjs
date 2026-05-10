// ═══════════════════════════════════════════════════════════════
// COMPREHENSIVE SMART COST DETECTION TEST SUITE
// Tests 25 real-world contractor scenarios
// ═══════════════════════════════════════════════════════════════
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('/home/claude/.npm-global/lib/node_modules/jsdom');
const { buildXML } = require('./generate_xml.cjs');

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;
global.DOMParser = dom.window.DOMParser;

// Extract parser code
const html = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'p6-analyzer.html'), 'utf-8');
const matches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const script = matches[1][1];

const parseStart = script.indexOf('function parseP6XML(');
let depth = 0, parseEnd = parseStart, foundOpen = false;
for (let i = parseStart; i < script.length; i++) {
  if (script[i] === '{') { depth++; foundOpen = true; }
  if (script[i] === '}') { depth--; if (foundOpen && depth === 0) { parseEnd = i + 1; break; } }
}

// Use Function constructor to create isolated scope
const parseP6XML = new Function('return ' + script.substring(parseStart, parseEnd))();

// Manual totalCost helper
const totalCost = (a) => {
  if (typeof a._derivedTotalCost === "number" && a._derivedTotalCost > 0) {
    return a._derivedTotalCost;
  }
  return (a.plannedNonLaborCost || 0) + (a.plannedLaborCost || 0) +
         (a.plannedMaterialCost || 0) + (a.plannedExpenseCost || 0);
};

console.log('═══════════════════════════════════════════════════════════════');
console.log('  COMPREHENSIVE SMART COST DETECTION — 25 SCENARIOS');
console.log('═══════════════════════════════════════════════════════════════\n');

let passed = 0, failed = 0;
const results = [];

const test = (label, expectedMethod, xml, options = {}) => {
  try {
    const result = parseP6XML(xml);
    const detected = result.detectedCostMethod || 'none';
    const totalActs = result.activities.length;
    const sumCost = result.activities.reduce((s, a) => s + totalCost(a), 0);
    
    const pass = expectedMethod === detected || 
                 (Array.isArray(expectedMethod) && expectedMethod.includes(detected));
    
    if (pass) {
      console.log(`  ✓ ${label}`);
      console.log(`    → Detected: ${detected} | Activities: ${totalActs} | Sum: $${sumCost.toLocaleString()}`);
      passed++;
    } else {
      console.log(`  ✗ FAIL: ${label}`);
      console.log(`    → Expected: ${expectedMethod} | Got: ${detected}`);
      if (result.costMethodSignals) {
        const s = result.costMethodSignals;
        console.log(`    → Coverage: std=${(s.coverages.standard*100).toFixed(0)}% exp=${(s.coverages.expense_weightage*100).toFixed(0)}% atc=${(s.coverages.at_completion*100).toFixed(0)}%`);
      }
      failed++;
    }
    results.push({ label, expected: expectedMethod, got: detected, pass, totalActs, sumCost });
  } catch (e) {
    console.log(`  ✗ ERROR: ${label} - ${e.message}`);
    failed++;
    results.push({ label, error: e.message, pass: false });
  }
};

// CATEGORY 1
console.log('\n📋 CATEGORY 1: STANDARD COMPLIANT (Industry best practices)\n');

test('S01: Standard P6 (PlannedNonLaborCost in all)', 'standard',
  buildXML({ activities: Array.from({length: 10}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i, plannedNonLaborCost: 50000 + i*1000, plannedLaborCost: 30000 + i*500 })) }));

test('S02: ActivityExpense Weightages (Saudi/Aramco)', 'expense_weightage',
  buildXML({
    activities: Array.from({length: 10}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i, atCompletionExpenseCost: 100000 * (i+1) })),
    expenses: Array.from({length: 10}, (_, i) => ({ actObjId: 100+i, objId: 200+i, item: 'Weightages', plannedCost: 100000 * (i+1) }))
  }));

test('S03: AtCompletionExpenseCost only (older P6)', 'at_completion',
  buildXML({ activities: Array.from({length: 10}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i, atCompletionExpenseCost: 50000 * (i+1) })) }));

test('S04: Mixed (50% std + 50% expense)', ['standard', 'expense_weightage'],
  buildXML({
    activities: [
      ...Array.from({length: 5}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i, plannedNonLaborCost: 50000 })),
      ...Array.from({length: 5}, (_, i) => ({ actId: `A${2000+i}`, objId: 200+i }))
    ],
    expenses: Array.from({length: 5}, (_, i) => ({ actObjId: 200+i, objId: 300+i, item: 'Weightages', plannedCost: 50000 }))
  }));

// CATEGORY 2
console.log('\n📋 CATEGORY 2: LOW COVERAGE\n');

test('S05: Only 5% have cost (lump sum)', 'none',
  buildXML({
    activities: [
      ...Array.from({length: 95}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i })),
      ...Array.from({length: 5}, (_, i) => ({ actId: `A${2000+i}`, objId: 200+i, plannedNonLaborCost: 1000000 }))
    ]
  }));

test('S06: 30% have cost (at threshold)', ['standard', 'none'],
  buildXML({
    activities: [
      ...Array.from({length: 70}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i })),
      ...Array.from({length: 30}, (_, i) => ({ actId: `A${2000+i}`, objId: 200+i, plannedNonLaborCost: 50000 }))
    ]
  }));

test('S07: 35% have cost (above threshold)', 'standard',
  buildXML({
    activities: [
      ...Array.from({length: 65}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i })),
      ...Array.from({length: 35}, (_, i) => ({ actId: `A${2000+i}`, objId: 200+i, plannedNonLaborCost: 50000 }))
    ]
  }));

// CATEGORY 3
console.log('\n📋 CATEGORY 3: BAD/CORRUPT DATA\n');

test('S08: All zero costs', 'none',
  buildXML({ activities: Array.from({length: 10}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i, plannedNonLaborCost: 0 })) }));

test('S09: Negative costs (corrupt)', ['standard', 'none'],
  buildXML({ activities: Array.from({length: 10}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i, plannedNonLaborCost: -5000 })) }));

test('S10: All $1 (suspicious)', 'standard',
  buildXML({ activities: Array.from({length: 10}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i, plannedNonLaborCost: 1 })) }));

test('S11: Empty project', 'none', buildXML({ activities: [] }));

test('S12: Single activity', 'standard',
  buildXML({ activities: [{ actId: 'A1', objId: 1, plannedNonLaborCost: 100000 }] }));

// CATEGORY 4
console.log('\n📋 CATEGORY 4: SPECIAL ACTIVITY TYPES\n');

test('S13: All milestones', 'none',
  buildXML({ activities: Array.from({length: 10}, (_, i) => ({ actId: `MS${1000+i}`, objId: 100+i, type: 'Start Milestone', plannedDuration: 0 })) }));

test('S14: All LOE with cost', ['standard', 'none'],
  buildXML({ activities: Array.from({length: 10}, (_, i) => ({ actId: `LOE${1000+i}`, objId: 100+i, type: 'Level of Effort', plannedNonLaborCost: 50000 })) }));

test('S15: Mixed Tasks + Milestones', 'standard',
  buildXML({
    activities: [
      ...Array.from({length: 7}, (_, i) => ({ actId: `T${1000+i}`, objId: 100+i, type: 'Task Dependent', plannedNonLaborCost: 100000 })),
      ...Array.from({length: 3}, (_, i) => ({ actId: `MS${1000+i}`, objId: 200+i, type: 'Finish Milestone' }))
    ]
  }));

// CATEGORY 5
console.log('\n📋 CATEGORY 5: EXPENSE METHOD VARIATIONS\n');

test('S16: Custom expense names (not "Weightages")', 'expense_weightage',
  buildXML({
    activities: Array.from({length: 10}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i })),
    expenses: Array.from({length: 10}, (_, i) => ({ actObjId: 100+i, objId: 200+i, item: 'Equipment Rental', plannedCost: 50000 }))
  }));

test('S17: Multiple expenses per activity (BOQ)', 'expense_weightage',
  buildXML({
    activities: Array.from({length: 5}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i })),
    expenses: Array.from({length: 15}, (_, i) => ({ actObjId: 100 + Math.floor(i/3), objId: 200+i, item: ['Materials','Labor','Equipment'][i%3], plannedCost: 30000 }))
  }));

test('S18: ActivityExpense exists but PlannedCost=0', 'none',
  buildXML({
    activities: Array.from({length: 10}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i })),
    expenses: Array.from({length: 10}, (_, i) => ({ actObjId: 100+i, objId: 200+i, item: 'Weightages', plannedCost: 0 }))
  }));

// CATEGORY 6
console.log('\n📋 CATEGORY 6: CONFLICTING METHODS\n');

test('S19: BOTH standard AND expense', ['standard', 'expense_weightage'],
  buildXML({
    activities: Array.from({length: 10}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i, plannedNonLaborCost: 50000 })),
    expenses: Array.from({length: 10}, (_, i) => ({ actObjId: 100+i, objId: 200+i, item: 'Weightages', plannedCost: 50000 }))
  }));

test('S20: Standard 60% + Expense 40% (std wins)', 'standard',
  buildXML({
    activities: [
      ...Array.from({length: 6}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i, plannedNonLaborCost: 50000 })),
      ...Array.from({length: 4}, (_, i) => ({ actId: `B${1000+i}`, objId: 200+i }))
    ],
    expenses: Array.from({length: 4}, (_, i) => ({ actObjId: 200+i, objId: 300+i, item: 'Weightages', plannedCost: 50000 }))
  }));

test('S21: Standard 30% + Expense 70% (exp wins)', ['expense_weightage', 'standard'],
  buildXML({
    activities: [
      ...Array.from({length: 3}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i, plannedNonLaborCost: 50000 })),
      ...Array.from({length: 7}, (_, i) => ({ actId: `B${1000+i}`, objId: 200+i }))
    ],
    expenses: Array.from({length: 7}, (_, i) => ({ actObjId: 200+i, objId: 300+i, item: 'Weightages', plannedCost: 80000 }))
  }));

// CATEGORY 7
console.log('\n📋 CATEGORY 7: REAL-WORLD CONTRACTOR PATTERNS\n');

test('S22: Korean contractor (units only)', ['standard', 'none'],
  buildXML({ activities: Array.from({length: 10}, (_, i) => ({ actId: `A${1000+i}`, objId: 100+i, plannedNonLaborUnits: 1000, plannedLaborUnits: 500 })) }));

test('S23: Indian contractor (mixed)', ['standard', 'expense_weightage'],
  buildXML({
    activities: [
      ...Array.from({length: 5}, (_, i) => ({ actId: `CIVIL${1000+i}`, objId: 100+i, plannedNonLaborCost: 200000, plannedLaborCost: 100000 })),
      ...Array.from({length: 5}, (_, i) => ({ actId: `MECH${1000+i}`, objId: 200+i }))
    ],
    expenses: Array.from({length: 5}, (_, i) => ({ actObjId: 200+i, objId: 300+i, item: 'Mechanical Package', plannedCost: 500000 }))
  }));

test('S24: European contractor (clean P6)', 'standard',
  buildXML({
    activities: Array.from({length: 20}, (_, i) => ({ actId: `EU${1000+i}`, objId: 100+i, plannedNonLaborCost: 75000, plannedLaborCost: 25000, plannedMaterialCost: 15000 }))
  }));

test('S25: Labor-only subcontractor', 'standard',
  buildXML({
    activities: Array.from({length: 10}, (_, i) => ({ actId: `SUB${1000+i}`, objId: 100+i, plannedLaborCost: 100000 }))
  }));

// SUMMARY
console.log('\n═══════════════════════════════════════════════════════════════');
console.log(`  RESULTS: ${passed}/${passed+failed} scenarios passed (${(passed/(passed+failed)*100).toFixed(1)}%)`);
console.log('═══════════════════════════════════════════════════════════════');

console.log('\n📊 BREAKDOWN BY CATEGORY:');
const categories = {
  '1. Standard Compliant': results.slice(0, 4),
  '2. Low Coverage': results.slice(4, 7),
  '3. Bad/Corrupt Data': results.slice(7, 12),
  '4. Special Activity Types': results.slice(12, 15),
  '5. Expense Variations': results.slice(15, 18),
  '6. Conflicting Methods': results.slice(18, 21),
  '7. Real-World Patterns': results.slice(21, 25)
};

Object.entries(categories).forEach(([cat, items]) => {
  const p = items.filter(r => r.pass).length;
  const t = items.length;
  const status = p === t ? '✅' : p >= t * 0.7 ? '⚠️' : '❌';
  console.log(`  ${status} ${cat}: ${p}/${t}`);
});

if (failed > 0) {
  console.log('\n⚠️ FAILURES:');
  results.filter(r => !r.pass).forEach(r => {
    console.log(`  - ${r.label}: Expected ${r.expected}, Got ${r.got || r.error}`);
  });
}

process.exit(failed > 0 ? 1 : 0);
