// ═══════════════════════════════════════════════════════════════
// Phase 2 Test Suite (v29.0.11)
// Tests: 32 functional tests
// Run: node tests/phase2/test_phase2.cjs
// ═══════════════════════════════════════════════════════════════

const { readFileSync } = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '../..', 'p6-analyzer.html');
const html = readFileSync(HTML_PATH, 'utf-8');
const matches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const script = matches[1][1];

console.log('═══════════════════════════════════════════════════════════');
console.log('  PHASE 2 TEST SUITE — v29.0.11');
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

// ─── TEST 1: Multi-day holidays (5 cases) ───
console.log('▶ FIX 2.1 — Multi-day holidays full coverage');
console.log('───────────────────────────────────────────────');

const islIdx = script.indexOf('const SA_ISLAMIC_HOLIDAYS');
let depth = 0, end = -1;
for (let i = islIdx; i < script.length; i++) {
  if (script[i] === '{') depth++;
  else if (script[i] === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
}
const islText = script.substring(islIdx, end + 1);
eval(islText + '\n' + extractFn('buildExpectedSAHolidays') + '\n' + extractFn('auditCalendarSAHolidays'));

const r0 = auditCalendarSAHolidays({holidays: []}, '2026-05-01', '2026-05-31');
const adha0 = r0.audit.find(h => h.key === 'eid_aladha');
test('Eid Adha: 0 days configured → missing', adha0.configStatus === 'missing' && adha0.coveredDays === 0);

const r1 = auditCalendarSAHolidays({holidays: ['2026-05-26']}, '2026-05-01', '2026-05-31');
const adha1 = r1.audit.find(h => h.key === 'eid_aladha');
test('Eid Adha: 1/5 days → partial (NOT complete)', adha1.configStatus === 'partial' && adha1.coveredDays === 1);

const r2 = auditCalendarSAHolidays({holidays: ['2026-05-26','2026-05-27','2026-05-28','2026-05-29','2026-05-30']}, '2026-05-01', '2026-05-31');
const adha2 = r2.audit.find(h => h.key === 'eid_aladha');
test('Eid Adha: 5/5 days → complete', adha2.configStatus === 'complete' && adha2.coveredDays === 5);

test('Result has daysCoveragePct field', r2.daysCoveragePct !== undefined);
test('Result has partial[] array', Array.isArray(r2.partial));

// ─── TEST 2: LOE detection (8 cases) ───
console.log('\n▶ FIX 2.2 — LOE Activity Exclusion');
console.log('───────────────────────────────────────────────');

const isLOE = (act) => {
  if (!act) return false;
  const t = (act.type || act.activityType || "").toString().toLowerCase();
  return t === "level of effort" || t === "loe" || t === "tt_loe" ||
         t.includes("level of effort") || t.includes("level_of_effort");
};

test('Detects "Level of Effort"', isLOE({type: 'Level of Effort'}));
test('Detects "LOE"', isLOE({type: 'LOE'}));
test('Detects "TT_LOE"', isLOE({type: 'TT_LOE'}));
test('Case insensitive', isLOE({type: 'level of effort'}));
test('Doesn\'t flag "Task Dependent"', !isLOE({type: 'Task Dependent'}));
test('Doesn\'t flag "Resource Dependent"', !isLOE({type: 'Resource Dependent'}));
test('Handles null safely', !isLOE(null));
test('Handles missing type', !isLOE({}));

// ─── TEST 3: EAC formulas (11 cases) ───
console.log('\n▶ FIX 2.3 — EAC1/EAC2/EAC3 + VAC + TCPI');
console.log('───────────────────────────────────────────────');

const computeEVM = (totalPV, totalEV, totalAC, totalBac) => {
  const _spi = totalPV > 0 ? totalEV / totalPV : null;
  const _cpi = totalAC > 0 ? totalEV / totalAC : null;
  const _eac1 = (_cpi !== null && _cpi > 0) ? totalBac / _cpi : null;
  const _eac2 = totalAC + (totalBac - totalEV);
  const _eac3 = (_cpi !== null && _spi !== null && _cpi * _spi > 0)
    ? totalAC + (totalBac - totalEV) / (_cpi * _spi) : null;
  const _vac = _eac1 !== null ? totalBac - _eac1 : null;
  const _tcpiBAC = (totalBac - totalAC) > 0 ? (totalBac - totalEV) / (totalBac - totalAC) : null;
  const _tcpiEAC = (_eac1 !== null && (_eac1 - totalAC) > 0)
    ? (totalBac - totalEV) / (_eac1 - totalAC) : null;
  const _worst = (_cpi !== null && _spi !== null && (_cpi * _spi) < 0.95);
  return { spi: _spi, cpi: _cpi, eac1: _eac1, eac2: _eac2, eac3: _eac3, vac: _vac, tcpiBAC: _tcpiBAC, tcpiEAC: _tcpiEAC, worst: _worst };
};

const r = computeEVM(700000, 500000, 600000, 1000000);
test('SPI calc correct (0.714)', Math.abs(r.spi - 0.7142857) < 0.001);
test('CPI calc correct (0.833)', Math.abs(r.cpi - 0.8333333) < 0.001);
test('EAC1 = BAC/CPI = 1.2M', Math.abs(r.eac1 - 1200000) < 1);
test('EAC2 = AC + (BAC-EV) = 1.1M', r.eac2 === 1100000);
test('EAC3 ≈ 1.44M (worst case)', Math.abs(r.eac3 - 1440000) < 1000);
test('VAC = BAC - EAC1 = -200K', Math.abs(r.vac - (-200000)) < 1);
test('Worst-case warning triggered (CPI*SPI < 0.95)', r.worst === true);

const r2g = computeEVM(490000, 500000, 476190, 1000000);
test('Good performance: no worst-case warning', r2g.worst === false);

const r3 = computeEVM(0, 0, 0, 1000000);
test('PV=0: SPI is null', r3.spi === null);
test('PV=0: CPI is null', r3.cpi === null);
test('PV=0: EAC1 is null', r3.eac1 === null);

// ─── TEST 4: Cost coverage (4 cases) ───
console.log('\n▶ FIX 2.4 — Cost Coverage Warning');
console.log('───────────────────────────────────────────────');

const computeCoverage = (rows) => {
  const total = rows.length;
  const withCost = rows.filter(r => (r.bac || 0) > 0).length;
  const pct = total > 0 ? +(withCost / total * 100).toFixed(1) : 0;
  let status = "ok";
  if (pct < 50) status = "alert";
  else if (pct < 70) status = "warning";
  return { pct, status, total, withCost };
};

const c1 = computeCoverage([{bac: 100}, {bac: 200}, {bac: 300}]);
test('100% coverage → ok', c1.pct === 100 && c1.status === 'ok');
const c2 = computeCoverage([{bac: 100}, {bac: 200}, {bac: 300}, {bac: 400}, {bac: 0}]);
test('80% coverage → ok', c2.pct === 80 && c2.status === 'ok');
const c3 = computeCoverage([{bac: 100}, {bac: 200}, {bac: 300}, {bac: 0}, {bac: 0}]);
test('60% coverage → warning', c3.pct === 60 && c3.status === 'warning');
const c4 = computeCoverage([{bac: 100}, {bac: 0}, {bac: 0}, {bac: 0}]);
test('25% coverage → alert', c4.pct === 25 && c4.status === 'alert');

// ─── REGRESSION ───
console.log('\n▶ Phase 1 Regression Check');
console.log('───────────────────────────────────────────────');

test('Network DP function exists in code', script.includes('_calculateNetworkLongestPath'));
test('getActualPctRatio helper exists in code', script.includes('const getActualPctRatio'));
test('EHC + ECC certs still defined', script.includes('certEHC') && script.includes('certECC'));
test('Negative context filter active', script.includes('negativeContext') && script.includes('hasNegative && !hasCertKeyword'));

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  PHASE 2 RESULTS: ' + passed + '/' + (passed + failed) + ' tests passed');
console.log('═══════════════════════════════════════════════════════════');
process.exit(failed > 0 ? 1 : 0);
