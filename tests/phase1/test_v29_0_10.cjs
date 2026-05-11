// ═══════════════════════════════════════════════════════════════
// Phase 1 Tests — v29.0.11.1 (Round 7 fixes included)
// ═══════════════════════════════════════════════════════════════
// Per ChatGPT Round 7 feedback (T2):
//   - Extract REAL helpers from p6-analyzer.html (not copied logic)
//   - Test actual app implementation, not parallel definitions
// ═══════════════════════════════════════════════════════════════
const { readFileSync } = require('fs');
const path = require('path');

// Read the actual source of truth
const HTML_PATH = path.join(__dirname, '..', '..', 'p6-analyzer.html');
const html = readFileSync(HTML_PATH, 'utf-8');
const matches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const script = matches[1][1];

console.log('═══════════════════════════════════════════════════════════');
console.log('  PHASE 1 TEST SUITE — v29.0.11.1');
console.log('  Source: p6-analyzer.html (REAL implementation)');
console.log('═══════════════════════════════════════════════════════════\n');

let passed = 0, failed = 0;
const test = (label, condition) => {
  if (condition) { console.log('  ✓ ' + label); passed++; }
  else { console.log('  ✗ FAIL: ' + label); failed++; }
};

// ── Extract REAL getActualPctRatio from p6-analyzer.html ──
// (T2 fix: test actual code, not parallel definition)
function extractGetActualPctRatio() {
  const startMarker = 'const getActualPctRatio = (p) => {';
  const start = script.indexOf(startMarker);
  if (start < 0) throw new Error('getActualPctRatio not found in source');
  let depth = 0, end = -1, started = false;
  for (let i = start + startMarker.length - 1; i < script.length; i++) {
    if (script[i] === '{') { depth++; started = true; }
    else if (script[i] === '}') { depth--; if (started && depth === 0) { end = i + 1; break; } }
  }
  return script.substring(start, end) + ';';
}

const realHelperCode = extractGetActualPctRatio();
// v29.0.11.10: Stub Rules of Credit (test doesn't use ROC features)
global._applyRulesOfCredit = (p) => null;
eval('global.getActualPctRatio = ' + realHelperCode.replace('const getActualPctRatio = ', '') + ';');

// ── TEST 1: getActualPctRatio (using REAL helper) ──
console.log('▶ TEST 1: getActualPctRatio (real implementation from p6-analyzer.html)');
console.log('───────────────────────────────────────────────────────────');

test('Manual + 0 returns 0', global.getActualPctRatio({pctType: 'Manual', pctComplete: 0, durationPct: 0.5}) === 0);
test('Physical + 0.7 returns 0.7', global.getActualPctRatio({pctType: 'Physical', physicalPct: 0.7}) === 0.7);
test('Units + 0.85 returns 0.85', global.getActualPctRatio({pctType: 'Units', unitsPct: 0.85}) === 0.85);
test('Duration + 0.4 returns 0.4', global.getActualPctRatio({pctType: 'Duration', durationPct: 0.4}) === 0.4);
test('No pctType + 0.5 returns 0.5', global.getActualPctRatio({pctComplete: 0.5}) === 0.5);
test('Empty input returns 0', global.getActualPctRatio({}) === 0);
test('null input returns 0', getActualPctRatio(null) === 0);
// v29.0.11.3 (Round 9.2 Patch 5): Per Oracle P6 documentation, percent fields are 0-100
// Therefore physicalPct=1.5 means 1.5%, not 150% to be clamped to 1.0
test('P6 percent 1.5 means 1.5% (Round 9.2 policy)', Math.abs(global.getActualPctRatio({pctType: 'Physical', physicalPct: 1.5}) - 0.015) < 1e-9);
test('Negative (-0.5) clamped to 0', global.getActualPctRatio({pctType: 'Physical', physicalPct: -0.5}) === 0);
test('NaN returns 0', global.getActualPctRatio({pctType: 'Physical', physicalPct: NaN}) === 0);

// v29.0.11.1 R1 FIX TESTS — pctType-specific field missing should fall back
console.log('\n  ── R1 fix tests (pctType-specific field missing) ──');
test('Physical + physicalPct=undefined + pctComplete=0.45 → 0.45 (fallback)',
  global.getActualPctRatio({pctType: 'Physical', physicalPct: undefined, pctComplete: 0.45}) === 0.45);
test('Duration + durationPct=null + physicalPct=0.6 → 0.6 (fallback)',
  global.getActualPctRatio({pctType: 'Duration', durationPct: null, physicalPct: 0.6}) === 0.6);
test('Units + unitsPct=undefined + pctComplete=0.3 → 0.3 (fallback)',
  global.getActualPctRatio({pctType: 'Units', unitsPct: undefined, pctComplete: 0.3}) === 0.3);
test('Manual + pctComplete=undefined + physicalPct=0.8 → 0.8 (fallback)',
  global.getActualPctRatio({pctType: 'Manual', pctComplete: undefined, physicalPct: 0.8}) === 0.8);
test('Physical + ALL fields undefined → 0',
  global.getActualPctRatio({pctType: 'Physical'}) === 0);
test('Manual + 0 still wins over fallback (preserve 0)',
  global.getActualPctRatio({pctType: 'Manual', pctComplete: 0, durationPct: 0.5}) === 0);

// ── Extract REAL _calculateNetworkLongestPath ──
function extractFn(name) {
  const start = script.indexOf('function ' + name + '(');
  if (start < 0) return null;
  let d = 0, e = -1, st = false;
  for (let i = start; i < script.length; i++) {
    if (script[i] === '{') { d++; st = true; }
    else if (script[i] === '}') { d--; if (st && d === 0) { e = i; break; } }
  }
  return e > 0 ? script.substring(start, e + 1) : null;
}

const networkFnCode = extractFn('_calculateNetworkLongestPath');
const flpdCode = extractFn('findLongestPathDuration');
eval(networkFnCode.replace('function _calculateNetworkLongestPath', 'global._calculateNetworkLongestPath = function _calculateNetworkLongestPath'));
eval(flpdCode.replace('function findLongestPathDuration', 'global.findLongestPathDuration = function findLongestPathDuration'));

// ── TEST 2: findLongestPathDuration (real implementation) ──
console.log('\n▶ TEST 2: findLongestPathDuration (real network DP)');
console.log('───────────────────────────────────────────────────────────');

const acts1 = [
  {actId:'A1', plannedDuration:10, totalFloat:0, isSummary:false, status:'In Progress'},
  {actId:'A2', plannedDuration:10, totalFloat:0, isSummary:false, status:'Not Started'},
  {actId:'A3', plannedDuration:10, totalFloat:0, isSummary:false, status:'Not Started'},
  {actId:'A4', plannedDuration:10, totalFloat:0, isSummary:false, status:'Not Started'},
  {actId:'A5', plannedDuration:10, totalFloat:0, isSummary:false, status:'Not Started'},
  {actId:'B1', plannedDuration:20, totalFloat:0, isSummary:false, status:'In Progress'},
  {actId:'B2', plannedDuration:20, totalFloat:0, isSummary:false, status:'Not Started'},
  {actId:'B3', plannedDuration:20, totalFloat:0, isSummary:false, status:'Not Started'}
];
const rels1 = [
  {predId:'A1', succId:'A2'}, {predId:'A2', succId:'A3'},
  {predId:'A3', succId:'A4'}, {predId:'A4', succId:'A5'},
  {predId:'B1', succId:'B2'}, {predId:'B2', succId:'B3'}
];
test('Parallel paths (50+60) returns 60', global.findLongestPathDuration(acts1, rels1, '2025-01-01') === 60);

const linearActs = [
  {actId:'X1', plannedDuration:30, totalFloat:0, isSummary:false, status:'Not Started'},
  {actId:'X2', plannedDuration:40, totalFloat:0, isSummary:false, status:'Not Started'}
];
const linearRels = [{predId:'X1', succId:'X2'}];
test('Linear path (30+40) returns 70', global.findLongestPathDuration(linearActs, linearRels, '2025-01-01') === 70);

const cyclicActs = [
  {actId:'C1', plannedDuration:5, totalFloat:0, isSummary:false, status:'Not Started'},
  {actId:'C2', plannedDuration:5, totalFloat:0, isSummary:false, status:'Not Started'}
];
const cyclicRels = [{predId:'C1', succId:'C2'}, {predId:'C2', succId:'C1'}];
const cycleResult = global.findLongestPathDuration(cyclicActs, cyclicRels, '2025-01-01');
test('Cycle handled without infinite loop', cycleResult > 0 && cycleResult < 1000);

test('Empty input returns 0', global.findLongestPathDuration([], [], '2025-01-01') === 0);
test('Null relationships handled', global.findLongestPathDuration(linearActs, null, '2025-01-01') > 0);

// v29.0.11.1 R2 FIX TESTS — relationships using ObjectId (not actId)
console.log('\n  ── R2 fix tests (ObjectId-based relationships) ──');
const acts_objId = [
  { id: '1001', actId: 'A100', plannedDuration: 10, totalFloat: 0, isSummary: false, status: 'Not Started' },
  { id: '1002', actId: 'A101', plannedDuration: 20, totalFloat: 0, isSummary: false, status: 'Not Started' },
  { id: '1003', actId: 'A102', plannedDuration: 30, totalFloat: 0, isSummary: false, status: 'Not Started' }
];
const rels_objId = [
  { predId: '1001', succId: '1002' },  // ObjectId-based
  { predId: '1002', succId: '1003' }
];
test('Activities with both id+actId, rels use id → 60 (60 not 30)',
  global.findLongestPathDuration(acts_objId, rels_objId, '2025-01-01') === 60);

// Mixed: some rels use id, some use actId
const rels_mixed = [
  { predId: 'A100', succId: 'A101' },  // actId-based
  { predId: '1002', succId: '1003' }   // ObjectId-based
];
test('Mixed actId+ObjectId relationships → 60 (full path resolved)',
  global.findLongestPathDuration(acts_objId, rels_mixed, '2025-01-01') === 60);

// ── TEST 3: Negative context filter ──
const negativeContext = /\b(walkdown|meeting|preparation|test\s*plan|submission|review|kick.?off|pre\s*[-]?\s*\w+|interim|partial|draft|proposed|tentative|workshop|training|presentation|kickoff)\b/i;

console.log('\n▶ TEST 3: Negative context filter');
console.log('───────────────────────────────────────────────────────────');
test('Rejects "PAC Walkdown 1"', negativeContext.test("PAC Walkdown 1"));
test('Rejects "TCC Test Plan"', negativeContext.test("TCC Test Plan"));
test('Rejects "Pre-PAC"', negativeContext.test("Pre-PAC Activities"));
test('Rejects "FAC Preparation"', negativeContext.test("FAC Preparation Meeting"));
test('Accepts "PAC Achievement"', !negativeContext.test("PAC Achievement"));
test('Accepts "TCC Issuance"', !negativeContext.test("TCC Issuance"));
test('Accepts "FAC Certificate"', !negativeContext.test("FAC Certificate"));

// ── TEST 4: EHC + ECC patterns ──
const ehcRegex = [
  /\bEHC\b/i,
  /\bEnergi[sz]ation\s*(?:&|and)?\s*Holding\s*Commissioning\b/i,
  /\bHolding\s*Commissioning\s*(?:Certificate|Completion)?\b/i
];
const eccRegex = [
  /\bECC\b/i,
  /\bEquipment\s+Commercial\s+Commissioning\b/i,
  /\bCommercial\s+Commissioning\s+(?:Certificate|Completion)\b/i
];

console.log('\n▶ TEST 4: EHC + ECC patterns');
console.log('───────────────────────────────────────────────────────────');
test('"EHC Unit 1" matches EHC', ehcRegex.some(r => r.test("EHC Unit 1")));
test('"Energization & Holding Commissioning" matches', ehcRegex.some(r => r.test("Energization & Holding Commissioning")));
test('"EHCV Valve" doesn\'t match', !ehcRegex[0].test("EHCV Valve"));
test('"ECC Achievement" matches', eccRegex.some(r => r.test("ECC Achievement")));
test('"Equipment Commercial Commissioning" matches', eccRegex.some(r => r.test("Equipment Commercial Commissioning")));
test('"ECC123" doesn\'t match', !eccRegex[0].test("ECC123"));

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  PHASE 1 RESULTS: ' + passed + '/' + (passed + failed) + ' tests passed');
console.log('═══════════════════════════════════════════════════════════');

if (failed > 0) process.exit(1);
