// ═══════════════════════════════════════════════════════════════
// CALCULATION ACCURACY TESTS
// Verify Smart Detection produces CORRECT cost-weighted progress
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

const totalCost = (a) => {
  if (typeof a._derivedTotalCost === "number" && a._derivedTotalCost > 0) {
    return a._derivedTotalCost;
  }
  return (a.plannedNonLaborCost || 0) + (a.plannedLaborCost || 0) +
         (a.plannedMaterialCost || 0) + (a.plannedExpenseCost || 0);
};

console.log('═══════════════════════════════════════════════════════════════');
console.log('  CALCULATION ACCURACY — Cost-Weighted Progress Tests');
console.log('═══════════════════════════════════════════════════════════════\n');

let passed = 0, failed = 0;

const test = (label, expectedDetection, expectedTotalCost, expectedCostWeightedPct, baselineXml, progressXml) => {
  try {
    const baseline = parseP6XML(baselineXml);
    const progress = parseP6XML(progressXml);
    
    const detected = baseline.detectedCostMethod;
    const totalBac = baseline.activities.reduce((s, a) => s + totalCost(a), 0);
    
    // Build progress map
    const progByActId = {};
    progress.activities.forEach(a => { progByActId[a.actId] = a; });
    
    // Calculate cost-weighted progress
    let sumWeight = 0, sumWeightedPct = 0;
    baseline.activities.forEach(bl => {
      const w = totalCost(bl);
      if (w === 0) return;
      const prog = progByActId[bl.actId];
      if (!prog) return;
      // Use pctComplete (general)
      const pct = prog.pctComplete || prog.physicalPct || prog.durationPct || 0;
      sumWeight += w;
      sumWeightedPct += w * pct;
    });
    const calculatedPct = sumWeight > 0 ? (sumWeightedPct / sumWeight) * 100 : 0;
    
    const detectionOk = detected === expectedDetection;
    const bacOk = Math.abs(totalBac - expectedTotalCost) < 1;
    const pctOk = Math.abs(calculatedPct - expectedCostWeightedPct) < 0.5;
    
    const pass = detectionOk && bacOk && pctOk;
    
    if (pass) {
      console.log(`  ✓ ${label}`);
      console.log(`    → Detection: ${detected} | BAC: $${totalBac.toLocaleString()} | Pct: ${calculatedPct.toFixed(2)}%`);
      passed++;
    } else {
      console.log(`  ✗ FAIL: ${label}`);
      if (!detectionOk) console.log(`    → Detection wrong: expected ${expectedDetection}, got ${detected}`);
      if (!bacOk) console.log(`    → BAC wrong: expected $${expectedTotalCost.toLocaleString()}, got $${totalBac.toLocaleString()}`);
      if (!pctOk) console.log(`    → Pct wrong: expected ${expectedCostWeightedPct}%, got ${calculatedPct.toFixed(2)}%`);
      failed++;
    }
  } catch (e) {
    console.log(`  ✗ ERROR: ${label} - ${e.message}`);
    failed++;
  }
};

// ═══════════════════════════════════════════════════════════════
// CALC TEST 1: Standard P6 — Equal weights
// ═══════════════════════════════════════════════════════════════
console.log('\n📋 CALCULATION TESTS: STANDARD METHOD\n');

test('CALC-1: Equal weights (4 acts × $100K, all 50% done)',
  'standard',
  400000,  // expected BAC
  50,      // expected cost-weighted %
  buildXML({ activities: Array.from({length: 4}, (_, i) => ({ actId: `A${i+1}`, objId: i+1, plannedNonLaborCost: 100000 })) }),
  buildXML({ activities: Array.from({length: 4}, (_, i) => ({ actId: `A${i+1}`, objId: i+1, plannedNonLaborCost: 100000, pctType: 'Physical', physicalPct: 0.5, pctComplete: 0.5 })) })
);

test('CALC-2: Skewed weights (one $1M done, three $100K not started)',
  'standard',
  1300000,  // expected BAC
  76.92,    // 1M / 1.3M = 76.92%
  buildXML({ activities: [
    { actId: 'BIG', objId: 1, plannedNonLaborCost: 1000000 },
    ...Array.from({length: 3}, (_, i) => ({ actId: `S${i+1}`, objId: 100+i, plannedNonLaborCost: 100000 }))
  ]}),
  buildXML({ activities: [
    { actId: 'BIG', objId: 1, plannedNonLaborCost: 1000000, pctType: 'Physical', physicalPct: 1.0, pctComplete: 1.0, status: 'Completed' },
    ...Array.from({length: 3}, (_, i) => ({ actId: `S${i+1}`, objId: 100+i, plannedNonLaborCost: 100000, pctType: 'Physical', physicalPct: 0, pctComplete: 0 }))
  ]})
);

test('CALC-3: Various progresses (different % per activity)',
  'standard',
  500000,  // expected BAC = 5 * 100K
  52,      // (10+30+50+70+100)/5 = 52% (correct math), but cost-weighted = same since equal
  buildXML({ activities: Array.from({length: 5}, (_, i) => ({ actId: `A${i+1}`, objId: i+1, plannedNonLaborCost: 100000 })) }),
  buildXML({ activities: [
    { actId: 'A1', objId: 1, plannedNonLaborCost: 100000, pctType: 'Physical', physicalPct: 0.1, pctComplete: 0.1 },
    { actId: 'A2', objId: 2, plannedNonLaborCost: 100000, pctType: 'Physical', physicalPct: 0.3, pctComplete: 0.3 },
    { actId: 'A3', objId: 3, plannedNonLaborCost: 100000, pctType: 'Physical', physicalPct: 0.5, pctComplete: 0.5 },
    { actId: 'A4', objId: 4, plannedNonLaborCost: 100000, pctType: 'Physical', physicalPct: 0.7, pctComplete: 0.7 },
    { actId: 'A5', objId: 5, plannedNonLaborCost: 100000, pctType: 'Physical', physicalPct: 1.0, pctComplete: 1.0 }
  ]})
);

// ═══════════════════════════════════════════════════════════════
// CALC TEST 2: Expense Weightage Method
// ═══════════════════════════════════════════════════════════════
console.log('\n📋 CALCULATION TESTS: EXPENSE WEIGHTAGE METHOD\n');

test('CALC-4: Expense Weightage — equal weights (4 × $250K, 50% each)',
  'expense_weightage',
  1000000,
  50,
  buildXML({
    activities: Array.from({length: 4}, (_, i) => ({ actId: `A${i+1}`, objId: i+1 })),
    expenses: Array.from({length: 4}, (_, i) => ({ actObjId: i+1, objId: 100+i, item: 'Weightages', plannedCost: 250000 }))
  }),
  buildXML({
    activities: Array.from({length: 4}, (_, i) => ({ actId: `A${i+1}`, objId: i+1, pctType: 'Physical', physicalPct: 0.5, pctComplete: 0.5 })),
    expenses: Array.from({length: 4}, (_, i) => ({ actObjId: i+1, objId: 100+i, item: 'Weightages', plannedCost: 250000 }))
  })
);

test('CALC-5: Expense Weightage — 41.5% scenario (Fuel Conversion-like)',
  'expense_weightage',
  10000000,
  41.5,
  buildXML({
    activities: Array.from({length: 10}, (_, i) => ({ actId: `A${i+1}`, objId: i+1 })),
    expenses: Array.from({length: 10}, (_, i) => ({ actObjId: i+1, objId: 100+i, item: 'Weightages', plannedCost: 1000000 }))
  }),
  buildXML({
    activities: [
      { actId: 'A1', objId: 1, pctType: 'Physical', physicalPct: 1.0, pctComplete: 1.0, status: 'Completed' },
      { actId: 'A2', objId: 2, pctType: 'Physical', physicalPct: 1.0, pctComplete: 1.0, status: 'Completed' },
      { actId: 'A3', objId: 3, pctType: 'Physical', physicalPct: 1.0, pctComplete: 1.0, status: 'Completed' },
      { actId: 'A4', objId: 4, pctType: 'Physical', physicalPct: 1.0, pctComplete: 1.0, status: 'Completed' },
      { actId: 'A5', objId: 5, pctType: 'Physical', physicalPct: 0.15, pctComplete: 0.15 },
      ...Array.from({length: 5}, (_, i) => ({ actId: `A${i+6}`, objId: i+6, pctType: 'Physical', physicalPct: 0, pctComplete: 0 }))
    ],
    expenses: Array.from({length: 10}, (_, i) => ({ actObjId: i+1, objId: 100+i, item: 'Weightages', plannedCost: 1000000 }))
  })
);

// ═══════════════════════════════════════════════════════════════
// CALC TEST 3: AtCompletion Method
// ═══════════════════════════════════════════════════════════════
console.log('\n📋 CALCULATION TESTS: AT_COMPLETION METHOD\n');

test('CALC-6: AtCompletion — equal weights, 50% done',
  'at_completion',
  500000,
  50,
  buildXML({ activities: Array.from({length: 5}, (_, i) => ({ actId: `A${i+1}`, objId: i+1, atCompletionExpenseCost: 100000 })) }),
  buildXML({ activities: Array.from({length: 5}, (_, i) => ({ actId: `A${i+1}`, objId: i+1, atCompletionExpenseCost: 100000, pctType: 'Physical', physicalPct: 0.5, pctComplete: 0.5 })) })
);

// ═══════════════════════════════════════════════════════════════
// CALC TEST 4: Edge - Zero cost activities should not contribute
// ═══════════════════════════════════════════════════════════════
console.log('\n📋 CALCULATION TESTS: EDGE CASES\n');

test('CALC-7: Mix of $0 and $100K activities (zero excluded from rollup)',
  'standard',
  500000,  // Only 5 activities × $100K
  50,      // (50+50+50+50+50)/5 = 50%, zeros not counted
  buildXML({ activities: [
    ...Array.from({length: 5}, (_, i) => ({ actId: `WITH${i+1}`, objId: i+1, plannedNonLaborCost: 100000 })),
    ...Array.from({length: 5}, (_, i) => ({ actId: `ZERO${i+1}`, objId: 100+i, plannedNonLaborCost: 0 }))
  ]}),
  buildXML({ activities: [
    ...Array.from({length: 5}, (_, i) => ({ actId: `WITH${i+1}`, objId: i+1, plannedNonLaborCost: 100000, pctType: 'Physical', physicalPct: 0.5, pctComplete: 0.5 })),
    ...Array.from({length: 5}, (_, i) => ({ actId: `ZERO${i+1}`, objId: 100+i, plannedNonLaborCost: 0, pctType: 'Physical', physicalPct: 1.0, pctComplete: 1.0 }))
  ]})
);

// SUMMARY
console.log('\n═══════════════════════════════════════════════════════════════');
console.log(`  CALCULATION ACCURACY: ${passed}/${passed+failed} tests passed`);
console.log('═══════════════════════════════════════════════════════════════');

process.exit(failed > 0 ? 1 : 0);
