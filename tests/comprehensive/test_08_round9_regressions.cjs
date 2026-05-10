// ═══════════════════════════════════════════════════════════════
// COMPREHENSIVE TEST 8: Round 9.2 Regression Tests
// Verifies all 6 ChatGPT Round 9.2 deep review patches
// ═══════════════════════════════════════════════════════════════
const { readFileSync } = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', '..', 'p6-analyzer.html');
const html = readFileSync(HTML_PATH, 'utf-8');
const matches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const script = matches[1][1];

console.log('═══════════════════════════════════════════════════════════');
console.log('  TEST 8: Round 9.2 Deep Review Patches');
console.log('═══════════════════════════════════════════════════════════\n');

let passed = 0, failed = 0;
const test = (label, condition) => {
  if (condition) { console.log('  ✓ ' + label); passed++; }
  else { console.log('  ✗ FAIL: ' + label); failed++; }
};

// Patch 1: EVM Eligibility Set
console.log('▶ Patch 1: EVM Eligibility Set (CR-01 fix)');
test('evmFiltered excludes isUnbaselined', 
  script.includes('!r.isUnbaselined') && script.includes('isLOEActivity(r._raw)'));
test('evmAll = evmFiltered (consistent denominator)', 
  script.includes('const evmAll = evmFiltered'));
test('totalBac uses evmAll (now = evmFiltered)', 
  script.includes('const totalBac = evmAll.reduce'));

// Patch 2: WBS Rollup
console.log('\n▶ Patch 2: WBS EVM Rollup (HI-03 fix)');
test('WBS rollup uses evmFiltered', 
  script.includes('for (const r of evmFiltered)'));
test('WBS weight uses r.bac (baseline weight)', 
  script.includes('(r.bac || 0) || (r.units || 0) || (r.dur || 0)'));

// Patch 3: Calendar-aware planned %
console.log('\n▶ Patch 3: Calendar-aware Planned% (ME-01 fix)');
test('_workingHoursBetween helper defined', 
  script.includes('const _workingHoursBetween ='));
test('_dayName helper defined', 
  script.includes('const _dayName ='));
test('calcPct uses calendar when available', 
  script.includes('act.calendarId && _calendarsForPlanned'));
test('calcPct falls back to linear when no calendar', 
  script.includes('// Fallback: linear calendar-day spread'));

// Patch 4: S-Curve Earned Redesign
console.log('\n▶ Patch 4: S-Curve Earned Redesign (HI-02 fix)');
test('NO MORE cumPlanned * earnedRatio (executable code)', 
  !script.match(/^[^/]*cumPlanned\s*\*\s*earnedRatio/m));
test('Earned uses _addMonthValue helper', 
  script.includes('const _addMonthValue ='));
test('Earned uses actual dates when available', 
  script.includes('r.actualStart && r.actualFinish'));
test('Earned has earnedBuckets separate from planned', 
  script.includes('const earnedBuckets ='));
test('S-Curve uses evmFiltered', 
  script.includes('const evmAllForCurve = evmFiltered'));

// Patch 5: normalizePct Decision (1.5 = 1.5%)
console.log('\n▶ Patch 5: normalizePct Decision (M-9.2-06 fix)');
test('normalizePct supports 0-100 format', 
  script.includes('if (n > 1 && n <= 100) return n / 100'));
test('firstNonNull helper defined',
  script.includes('const firstNonNull = (...vals) =>'));

// Patch 6: Phase 2 tests update
console.log('\n▶ Patch 6: Phase 2 Tests Update (L-9.2-08 fix)');
const phase2Tests = readFileSync(path.join(__dirname, '..', 'phase2', 'test_phase2.cjs'), 'utf-8');
test('Phase 2 tests check firstNonNull pattern', 
  phase2Tests.includes('firstNonNull(p.physicalPct, p.pctComplete, p.durationPct, p.unitsPct)'));

// Round 9.2 Functional verification
console.log('\n▶ Round 9.2 Functional Verification');
test('isUnbaselined flag exists in row', 
  script.includes('isUnbaselined: isUnbaselined'));
test('isDeletedFromProgress flag exists in row', 
  script.includes('isDeletedFromProgress: isDeletedFromProgress'));
test('Union of baseline+progress IDs (C-02 still in place)', 
  script.includes('const allIds = new Set([...baselineIds, ...progressIds])'));
test('numOpt helper preserves null (H-02 still in place)', 
  script.includes('const numOpt ='));
test('NG WBS lookup uses a.wbs first (H-05 still in place)', 
  script.includes('a.wbs || a.wbsId'));

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  TEST 8 RESULTS: ' + passed + '/' + (passed + failed) + ' passed');
console.log('═══════════════════════════════════════════════════════════');
process.exit(failed > 0 ? 1 : 0);
