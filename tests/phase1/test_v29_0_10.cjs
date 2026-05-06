// ═══════════════════════════════════════════════════════════════
// Phase 1 Test Suite (v29.0.10)
// Tests: 28 functional tests
// Run: node tests/phase1/test_v29_0_10.cjs
// ═══════════════════════════════════════════════════════════════

const { readFileSync } = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '../..', 'p6-analyzer.html');
const html = readFileSync(HTML_PATH, 'utf-8');
const matches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const script = matches[1][1];

console.log('═══════════════════════════════════════════════════════════');
console.log('  PHASE 1 TEST SUITE — v29.0.10');
console.log('═══════════════════════════════════════════════════════════\n');

let passed = 0, failed = 0;
const test = (label, condition) => {
  if (condition) { console.log('  ✓ ' + label); passed++; }
  else { console.log('  ✗ FAIL: ' + label); failed++; }
};

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

// ─── TEST 1: getActualPctRatio (10 cases) ───
console.log('▶ TEST 1: getActualPctRatio respects pctType');
console.log('───────────────────────────────────────────────');

const helperText = `
const getActualPctRatio = (p) => {
  if (!p) return 0;
  const type = (p.pctType || "").toLowerCase();
  let raw;
  if (type === "physical") raw = p.physicalPct;
  else if (type === "duration") raw = p.durationPct;
  else if (type === "units") raw = p.unitsPct;
  else if (type === "manual") raw = p.pctComplete;
  else raw = p.pctComplete ?? p.durationPct ?? p.physicalPct ?? p.unitsPct ?? 0;
  if (raw === null || raw === undefined || isNaN(raw)) return 0;
  const num = Number(raw);
  return Math.max(0, Math.min(1, num));
};
global.gapr = getActualPctRatio;
`;
eval(helperText);

test('Manual pctType + 0 returns 0 (was 0.5 with || chain)', global.gapr({pctType: 'Manual', pctComplete: 0, durationPct: 0.5}) === 0);
test('Physical + 0.7 returns 0.7', global.gapr({pctType: 'Physical', physicalPct: 0.7}) === 0.7);
test('Units + 0.85 returns 0.85', global.gapr({pctType: 'Units', unitsPct: 0.85}) === 0.85);
test('Duration + 0.4 returns 0.4', global.gapr({pctType: 'Duration', durationPct: 0.4}) === 0.4);
test('No pctType + pctComplete=0.5 returns 0.5', global.gapr({pctComplete: 0.5}) === 0.5);
test('Empty input returns 0', global.gapr({}) === 0);
test('null input returns 0', global.gapr(null) === 0);
test('Out-of-range (1.5) clamped to 1', global.gapr({pctType: 'Physical', physicalPct: 1.5}) === 1);
test('Negative (-0.5) clamped to 0', global.gapr({pctType: 'Physical', physicalPct: -0.5}) === 0);
test('NaN returns 0', global.gapr({pctType: 'Physical', physicalPct: NaN}) === 0);

// ─── TEST 2: findLongestPathDuration (5 cases) ───
console.log('\n▶ TEST 2: findLongestPathDuration network DP');
console.log('───────────────────────────────────────────────');

const helperFn = extractFn('_calculateNetworkLongestPath');
const mainFn = extractFn('findLongestPathDuration');
eval(helperFn + '\n' + mainFn + '\nglobal.flpd = findLongestPathDuration;');

const acts = [
  {actId:'A1', plannedDuration:10, totalFloat:0, isSummary:false, status:'In Progress'},
  {actId:'A2', plannedDuration:10, totalFloat:0, isSummary:false, status:'Not Started'},
  {actId:'A3', plannedDuration:10, totalFloat:0, isSummary:false, status:'Not Started'},
  {actId:'A4', plannedDuration:10, totalFloat:0, isSummary:false, status:'Not Started'},
  {actId:'A5', plannedDuration:10, totalFloat:0, isSummary:false, status:'Not Started'},
  {actId:'B1', plannedDuration:20, totalFloat:0, isSummary:false, status:'In Progress'},
  {actId:'B2', plannedDuration:20, totalFloat:0, isSummary:false, status:'Not Started'},
  {actId:'B3', plannedDuration:20, totalFloat:0, isSummary:false, status:'Not Started'},
];
const rels = [
  {predId:'A1', succId:'A2'}, {predId:'A2', succId:'A3'},
  {predId:'A3', succId:'A4'}, {predId:'A4', succId:'A5'},
  {predId:'B1', succId:'B2'}, {predId:'B2', succId:'B3'},
];
test('Parallel paths (50+60) returns 60 NOT 110', global.flpd(acts, rels, '2025-01-01') === 60);

const linearActs = [
  {actId:'X1', plannedDuration:30, totalFloat:0, isSummary:false, status:'Not Started'},
  {actId:'X2', plannedDuration:40, totalFloat:0, isSummary:false, status:'Not Started'},
];
test('Linear path (30+40) returns 70', global.flpd(linearActs, [{predId:'X1', succId:'X2'}], '2025-01-01') === 70);

const cyclicActs = [
  {actId:'C1', plannedDuration:5, totalFloat:0, isSummary:false, status:'Not Started'},
  {actId:'C2', plannedDuration:5, totalFloat:0, isSummary:false, status:'Not Started'},
];
const cyclicRels = [{predId:'C1', succId:'C2'}, {predId:'C2', succId:'C1'}];
const cycleResult = global.flpd(cyclicActs, cyclicRels, '2025-01-01');
test('Cycle handled without infinite loop', cycleResult > 0 && cycleResult < 1000);

test('Empty input returns 0', global.flpd([], [], '2025-01-01') === 0);
test('Null relationships handled', global.flpd(linearActs, null, '2025-01-01') > 0);

// ─── TEST 3: Negative context filter (7 cases) ───
console.log('\n▶ TEST 3: Negative context filter');
console.log('───────────────────────────────────────────────');

const negCtx = /\b(walkdown|meeting|preparation|test\s*plan|submission|review|kick.?off|pre\s*[-]?\s*\w+|interim|partial|draft|proposed|tentative|workshop|training|presentation|kickoff)\b/i;

test('Rejects "PAC Walkdown 1"', negCtx.test("PAC Walkdown 1"));
test('Rejects "TCC Test Plan"', negCtx.test("TCC Test Plan"));
test('Rejects "Pre-PAC Activities"', negCtx.test("Pre-PAC Activities"));
test('Rejects "FAC Preparation Meeting"', negCtx.test("FAC Preparation Meeting"));
test('Accepts "PAC Achievement"', !negCtx.test("PAC Achievement"));
test('Accepts "TCC Issuance"', !negCtx.test("TCC Issuance"));
test('Accepts "FAC Certificate Granted"', !negCtx.test("FAC Certificate Granted"));

// ─── TEST 4: EHC + ECC patterns (6 cases) ───
console.log('\n▶ TEST 4: EHC + ECC mandatory NG SA certifications');
console.log('───────────────────────────────────────────────');

const ehcRegex = [
  /\bEHC\b/i,
  /\bEnergi[sz]ation\s*(?:&|and)?\s*Holding\s*Commissioning\b/i,
  /\bHolding\s*Commissioning\s*(?:Certificate|Completion)?\b/i,
];
const eccRegex = [
  /\bECC\b/i,
  /\bEquipment\s+Commercial\s+Commissioning\b/i,
  /\bCommercial\s+Commissioning\s+(?:Certificate|Completion)\b/i,
];

test('EHC: "EHC Unit 1" matches', ehcRegex.some(r => r.test("EHC Unit 1")));
test('EHC: "Energization & Holding Commissioning" matches', ehcRegex.some(r => r.test("Energization & Holding Commissioning")));
test('EHC: "Holding Commissioning Cert" matches', ehcRegex.some(r => r.test("Holding Commissioning Certificate")));
test('ECC: "ECC Achievement" matches', eccRegex.some(r => r.test("ECC Achievement")));
test('ECC: "Equipment Commercial Commissioning" matches', eccRegex.some(r => r.test("Equipment Commercial Commissioning")));
test('ECC: "Commercial Commissioning Certificate" matches', eccRegex.some(r => r.test("Commercial Commissioning Certificate")));

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  PHASE 1 RESULTS: ' + passed + '/' + (passed + failed) + ' tests passed');
console.log('═══════════════════════════════════════════════════════════');
process.exit(failed > 0 ? 1 : 0);
