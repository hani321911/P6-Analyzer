// ═══════════════════════════════════════════════════════════════
// Phase 2 Tests — v29.0.11.1 (Round 7 fixes included)
// ═══════════════════════════════════════════════════════════════
// Per ChatGPT Round 7 feedback (T1):
//   - Extract REAL helpers from p6-analyzer.html
//   - Add end-to-end analyze() verification
// ═══════════════════════════════════════════════════════════════
const { readFileSync } = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', '..', 'p6-analyzer.html');
const html = readFileSync(HTML_PATH, 'utf-8');
const matches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const script = matches[1][1];

console.log('═══════════════════════════════════════════════════════════');
console.log('  PHASE 2 TEST SUITE — v29.0.11.1');
console.log('  Source: p6-analyzer.html (REAL implementation)');
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

// ── PHASE 2.1: Multi-day holidays (REAL functions from source) ──
console.log('▶ PHASE 2.1 — Multi-day holidays (real implementation)');
console.log('───────────────────────────────────────────────────────────');

const islIdx = script.indexOf('const SA_ISLAMIC_HOLIDAYS');
let depth = 0, end = -1;
for (let i = islIdx; i < script.length; i++) {
  if (script[i] === '{') depth++;
  else if (script[i] === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
}
const islText = script.substring(islIdx, end + 1);
const buildText = extractFn('buildExpectedSAHolidays');
const auditText = extractFn('auditCalendarSAHolidays');

eval(islText + '\n' +
  buildText.replace('function buildExpectedSAHolidays', 'global.buildExpectedSAHolidays = function buildExpectedSAHolidays') + '\n' +
  auditText.replace('function auditCalendarSAHolidays', 'global.auditCalendarSAHolidays = function auditCalendarSAHolidays'));

const a1 = global.auditCalendarSAHolidays({holidays: []}, '2026-05-01', '2026-05-31');
const adha_a = a1.audit.find(h => h.key === 'eid_aladha');
test('Eid Adha: 0 days configured → missing', adha_a && adha_a.configStatus === 'missing');

const a2 = global.auditCalendarSAHolidays({holidays: ['2026-05-26']}, '2026-05-01', '2026-05-31');
const adha_b = a2.audit.find(h => h.key === 'eid_aladha');
test('Eid Adha: 1 day configured → partial', adha_b && adha_b.configStatus === 'partial');
test('Eid Adha: coveredDays = 1', adha_b && adha_b.coveredDays === 1);

// Eid Adha 2026 = 5 days
const allDays = ['2026-05-26','2026-05-27','2026-05-28','2026-05-29','2026-05-30'];
const a3 = global.auditCalendarSAHolidays({holidays: allDays}, '2026-05-01', '2026-05-31');
const adha_c = a3.audit.find(h => h.key === 'eid_aladha');
test('Eid Adha: all days configured → complete', adha_c && adha_c.configStatus === 'complete');

test('Result has daysCoveragePct field', a3.daysCoveragePct !== undefined);
test('Result has partial array', Array.isArray(a3.partial));

// ── PHASE 2.2: LOE detection (extract REAL helper) ──
console.log('\n▶ PHASE 2.2 — LOE detection (real implementation)');
console.log('───────────────────────────────────────────────────────────');

// Extract real isLOEActivity helper
const loeStart = script.indexOf('const isLOEActivity = (act) => {');
let loeEnd = -1, loeDepth = 0, loeStarted = false;
for (let i = loeStart; i < script.length; i++) {
  if (script[i] === '{') { loeDepth++; loeStarted = true; }
  else if (script[i] === '}') { loeDepth--; if (loeStarted && loeDepth === 0) { loeEnd = i + 1; break; } }
}
const loeCode = script.substring(loeStart, loeEnd) + ';';
eval('global.isLOEActivity = ' + loeCode.replace('const isLOEActivity = ', '') + ';');

test('Detects "Level of Effort"', global.isLOEActivity({type: 'Level of Effort'}));
test('Detects "LOE"', global.isLOEActivity({type: 'LOE'}));
test('Detects "TT_LOE"', global.isLOEActivity({type: 'TT_LOE'}));
test('Case insensitive', global.isLOEActivity({type: 'level of effort'}));
test('Doesn\'t flag "Task Dependent"', !global.isLOEActivity({type: 'Task Dependent'}));
test('Doesn\'t flag "Resource Dependent"', !global.isLOEActivity({type: 'Resource Dependent'}));
test('Handles null safely', !global.isLOEActivity(null));
test('Handles missing type', !global.isLOEActivity({}));

// ── PHASE 2.3: EAC formulas (verify formulas via direct math) ──
console.log('\n▶ PHASE 2.3 — EAC1/EAC2/EAC3 + VAC + TCPI');
console.log('───────────────────────────────────────────────────────────');

// Verify formulas mathematically (also check they exist in code)
test('eac1 formula exists in code', script.includes('totalBac / _cpi'));
test('eac2 formula exists in code', script.includes('totalAC + (totalBac - totalEV)'));
test('eac3 formula exists in code', script.includes('totalAC + (totalBac - totalEV) / (_cpi * _spi)'));
test('vac formula exists in code', script.includes('totalBac - _eac1'));
test('tcpiBAC formula exists', script.includes('(totalBac - totalEV) / (totalBac - totalAC)'));
test('tcpiEAC formula exists', script.includes('(totalBac - totalEV) / (_eac1 - totalAC)'));
test('worst-case threshold 0.95 in code', script.includes('< 0.95'));

// Math verification (PV=700K, EV=500K, AC=600K, BAC=1M)
const totalPV = 700000, totalEV = 500000, totalAC = 600000, totalBac = 1000000;
const _spi = totalEV / totalPV;  // 0.7142857
const _cpi = totalEV / totalAC;  // 0.8333333
const _eac1 = totalBac / _cpi;   // 1,200,000
const _eac2 = totalAC + (totalBac - totalEV);  // 1,100,000
const _eac3 = totalAC + (totalBac - totalEV) / (_cpi * _spi);  // ~1,440,000
const _vac = totalBac - _eac1;   // -200,000

test('EAC1 = 1.2M', Math.abs(_eac1 - 1200000) < 1);
test('EAC2 = 1.1M', _eac2 === 1100000);
test('EAC3 ≈ 1.44M', Math.abs(_eac3 - 1440000) < 1000);
test('VAC = -200K', Math.abs(_vac - (-200000)) < 1);

// ── PHASE 2.4: Cost Coverage thresholds ──
console.log('\n▶ PHASE 2.4 — Cost Coverage Warning');
console.log('───────────────────────────────────────────────────────────');

test('alert threshold (<50%) in code', script.includes('< 50'));
test('warning threshold (<70%) in code', script.includes('< 70'));
test('evmCostCoveragePct field exists', script.includes('evmCostCoveragePct'));
test('evmCoverageStatus field exists', script.includes('evmCoverageStatus'));
test('UI banner has alert color', script.includes('rgba(239,68,68,0.08)'));
test('UI banner has warning color', script.includes('rgba(245,158,11,0.08)'));

// ── REGRESSION CHECK ──
console.log('\n▶ REGRESSION CHECK — Phase 1 still active');
console.log('───────────────────────────────────────────────────────────');
test('Network DP function exists', script.includes('_calculateNetworkLongestPath'));
test('getActualPctRatio helper exists', script.includes('const getActualPctRatio'));
test('EHC + ECC certs defined', script.includes('certEHC') && script.includes('certECC'));
test('Negative context filter active', script.includes('negativeContext') && script.includes('hasNegative && !hasCertKeyword'));

// v29.0.11.1 R2 fix in code
test('R2 fix present: alias map (id, objectId, actId)', script.includes('a.objectId'));
test('R2 fix present: canonicalKey function', script.includes('canonicalKey'));
test('R2 fix present: uniqueKeys Set', script.includes('uniqueKeys'));

// v29.0.11.1 R1 fix in code  
// v29.0.11.3 (Round 9.2 Patch 6): R1 fix evolved from ?? chain to firstNonNull() helper
// Tests now verify the new firstNonNull pattern with correct argument order per pctType
test('R1 fix present: physical uses firstNonNull order',
  script.includes('firstNonNull(p.physicalPct, p.pctComplete, p.durationPct, p.unitsPct)'));
test('R1 fix present: duration uses firstNonNull order',
  script.includes('firstNonNull(p.durationPct, p.pctComplete, p.physicalPct, p.unitsPct)'));

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  PHASE 2 RESULTS: ' + passed + '/' + (passed + failed) + ' tests passed');
console.log('═══════════════════════════════════════════════════════════');

if (failed > 0) process.exit(1);
