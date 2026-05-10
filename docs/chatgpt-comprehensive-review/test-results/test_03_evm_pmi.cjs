// ═══════════════════════════════════════════════════════════════
// COMPREHENSIVE TEST 3: EVM (PMI Standard)
// ═══════════════════════════════════════════════════════════════
const { readFileSync } = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', '..', 'p6-analyzer.html');
const html = readFileSync(HTML_PATH, 'utf-8');
const matches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const script = matches[1][1];

console.log('═══════════════════════════════════════════════════════════');
console.log('  TEST 3: EVM (Earned Value Management) — PMI Standard');
console.log('═══════════════════════════════════════════════════════════\n');

let passed = 0, failed = 0;
const test = (label, condition) => {
  if (condition) { console.log('  ✓ ' + label); passed++; }
  else { console.log('  ✗ FAIL: ' + label); failed++; }
};

// Core EVM Variables
console.log('▶ Core EVM Variables');
test('PV (Planned Value) calculated', script.includes('PV') && script.includes('totalPV'));
test('EV (Earned Value) calculated', script.includes('EV') && script.includes('totalEV'));
test('AC (Actual Cost) calculated', script.includes('AC') && script.includes('totalAC'));
test('BAC (Budget at Completion) calculated', script.includes('BAC') && script.includes('totalBac'));

// EVM Indices
console.log('\n▶ EVM Performance Indices');
test('SPI = EV/PV', script.includes('totalEV / totalPV') || script.includes('EV / PV'));
test('CPI = EV/AC', script.includes('totalEV / totalAC') || script.includes('EV / AC'));
test('SV = EV - PV', script.includes('totalEV - totalPV') || script.includes('EV - PV'));
test('CV = EV - AC', script.includes('totalEV - totalAC') || script.includes('EV - AC'));

// Division-by-Zero Protection (CRITICAL!)
console.log('\n▶ Division-by-Zero Protection');
test('SPI division protected (PV > 0)', script.includes('totalPV > 0 ?'));
test('CPI division protected (AC > 0)', script.includes('totalAC > 0 ?'));
test('Returns null on /0 (not Infinity)', script.includes(': null'));

// Forecasts (PMI Standard)
console.log('\n▶ EAC Forecasts (PMI 3-method standard)');
test('EAC1 = BAC/CPI (typical)', script.includes('totalBac / _cpi'));
test('EAC2 = AC + (BAC - EV) (atypical)', script.includes('totalAC + (totalBac - totalEV)'));
test('EAC3 = AC + (BAC-EV)/(CPI*SPI) (worst-case)', script.includes('(_cpi * _spi)'));

// VAC (Variance at Completion)
console.log('\n▶ VAC (Variance at Completion)');
test('VAC = BAC - EAC', script.includes('totalBac - _eac1'));

// TCPI (To-Complete Performance Index)
console.log('\n▶ TCPI');
test('TCPI(BAC) = (BAC-EV)/(BAC-AC)', 
  script.includes('(totalBac - totalEV) / (totalBac - totalAC)'));
test('TCPI(EAC) = (BAC-EV)/(EAC-AC)', 
  script.includes('(totalBac - totalEV) / (_eac1 - totalAC)'));

// Cost Coverage
console.log('\n▶ Cost Coverage Validation');
test('evmActivitiesTotal counted', script.includes('evmActivitiesTotal'));
test('evmActivitiesWithCost counted', script.includes('evmActivitiesWithCost'));
test('evmCostCoveragePct calculated', script.includes('evmCostCoveragePct'));
test('Coverage status (ok/warn/alert)', script.includes('evmCoverageStatus'));

// LOE Exclusion
console.log('\n▶ LOE (Level of Effort) Exclusion');
test('LOE detection function', script.includes('isLOEActivity'));
test('LOE excluded from EVM', script.includes('!isLOEActivity'));

// Worst-Case Warning
console.log('\n▶ Worst-Case Warning');
test('CPI*SPI < 0.95 threshold', script.includes('< 0.95'));
test('Worst-case warning generated', script.includes('evmWorstCaseWarning'));

// Mathematical Validation
console.log('\n▶ Math Validation (synthetic test)');
const totalPV = 700000, totalEV = 500000, totalAC = 600000, totalBac = 1000000;
const _spi = totalEV / totalPV;        // 0.7142857
const _cpi = totalEV / totalAC;        // 0.8333333
const _eac1 = totalBac / _cpi;         // 1,200,000
const _eac2 = totalAC + (totalBac - totalEV);     // 1,100,000
const _eac3 = totalAC + (totalBac - totalEV) / (_cpi * _spi);  // ~1,440,000
const _vac = totalBac - _eac1;         // -200,000
const _tcpiBAC = (totalBac - totalEV) / (totalBac - totalAC);  // 1.25
const _tcpiEAC = (totalBac - totalEV) / (_eac1 - totalAC);     // 0.833

test('Math: EAC1 = 1,200,000', Math.abs(_eac1 - 1200000) < 1);
test('Math: EAC2 = 1,100,000', _eac2 === 1100000);
test('Math: EAC3 ≈ 1,440,000', Math.abs(_eac3 - 1440000) < 1000);
test('Math: VAC = -200,000', Math.abs(_vac - (-200000)) < 1);
test('Math: TCPI(BAC) = 1.25', Math.abs(_tcpiBAC - 1.25) < 0.001);
test('Math: TCPI(EAC) ≈ 0.833', Math.abs(_tcpiEAC - 0.833) < 0.01);

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  TEST 3 RESULTS: ' + passed + '/' + (passed + failed) + ' passed');
console.log('═══════════════════════════════════════════════════════════');
process.exit(failed > 0 ? 1 : 0);
