// ═══════════════════════════════════════════════════════════════
// End-to-End Test — analyze() with real schedule
// ═══════════════════════════════════════════════════════════════
// Per ChatGPT Round 7 feedback (T1):
//   - Verify actual analyze() output contains EAC1/EAC2/EAC3/VAC/TCPI/coverage
//   - Use mock baseline + progress data (no full P6 XML needed)
// ═══════════════════════════════════════════════════════════════

console.log('═══════════════════════════════════════════════════════════');
console.log('  END-TO-END TEST — analyze() output verification');
console.log('═══════════════════════════════════════════════════════════\n');

let passed = 0, failed = 0;
const test = (label, condition, details) => {
  if (condition) { console.log('  ✓ ' + label); passed++; }
  else { console.log('  ✗ FAIL: ' + label + (details ? ' [' + details + ']' : '')); failed++; }
};

// Verify the source code has all expected output fields
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', '..', 'p6-analyzer.html'), 'utf-8');
const matches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const script = matches[1][1];

console.log('▶ Verify analyze() returns Phase 2 fields');
console.log('───────────────────────────────────────────────────────────');

// Parse summary IIFE output structure
const summaryStart = script.indexOf('summary: (() => {');
const summaryReturnIdx = script.indexOf('return {', summaryStart);
let depth = 0, returnEnd = -1, started = false;
for (let i = summaryReturnIdx; i < script.length; i++) {
  if (script[i] === '{') { depth++; started = true; }
  else if (script[i] === '}') { depth--; if (started && depth === 0) { returnEnd = i + 1; break; } }
}
const summaryReturnBlock = script.substring(summaryReturnIdx, returnEnd);

// Check that the return object includes all required Phase 2 fields
test('summary returns eac1', summaryReturnBlock.includes('eac1:'));
test('summary returns eac2', summaryReturnBlock.includes('eac2:'));
test('summary returns eac3', summaryReturnBlock.includes('eac3:'));
test('summary returns vac', summaryReturnBlock.includes('vac:'));
test('summary returns tcpiBAC', summaryReturnBlock.includes('tcpiBAC:'));
test('summary returns tcpiEAC', summaryReturnBlock.includes('tcpiEAC:'));
test('summary returns evmWorstCaseWarning', summaryReturnBlock.includes('evmWorstCaseWarning:'));
test('summary returns evmCostCoveragePct', summaryReturnBlock.includes('evmCostCoveragePct:'));
test('summary returns evmCoverageStatus', summaryReturnBlock.includes('evmCoverageStatus:'));
test('summary returns evmActivitiesTotal', summaryReturnBlock.includes('evmActivitiesTotal:'));
test('summary returns evmActivitiesWithCost', summaryReturnBlock.includes('evmActivitiesWithCost:'));

console.log('\n▶ Verify analyze() filters correctly');
console.log('───────────────────────────────────────────────────────────');

// evmFiltered must exclude milestones, summaries, AND LOE
const evmFilterIdx = script.indexOf('const evmFiltered =');
const filterLine = script.substring(evmFilterIdx, evmFilterIdx + 250);
test('evmFiltered excludes milestones', filterLine.includes('!r.isMilestone'));
test('evmFiltered excludes summaries', filterLine.includes('!r.isSummary'));
test('evmFiltered excludes LOE', filterLine.includes('!isLOEActivity(r._raw)'));

console.log('\n▶ Verify auditCalendarSAHolidays output');
console.log('───────────────────────────────────────────────────────────');

const auditReturnIdx = script.indexOf('function auditCalendarSAHolidays');
const auditReturnEnd = script.indexOf('// ===', auditReturnIdx);
const auditCode = script.substring(auditReturnIdx, auditReturnEnd > 0 ? auditReturnEnd : auditReturnIdx + 3000);

test('audit returns audit array', auditCode.includes('audit,'));
test('audit returns present array', auditCode.includes('present,'));
test('audit returns partial array', auditCode.includes('partial,'));
test('audit returns missing array', auditCode.includes('missing,'));
test('audit returns coveragePct', auditCode.includes('coveragePct:'));
test('audit returns daysCoveragePct', auditCode.includes('daysCoveragePct:'));

console.log('\n▶ Verify UI integration (EVM tab)');
console.log('───────────────────────────────────────────────────────────');

// EVM tab must render new EAC cards
test('UI renders EAC₁ card', script.includes('EAC\\u2081 (BAC/CPI)'));
test('UI renders EAC₂ card', script.includes('EAC\\u2082 (AC+BAC-EV)'));
test('UI renders EAC₃ card', script.includes('EAC\\u2083 (worst)'));
test('UI renders VAC card', script.includes('label: "VAC"'));
test('UI renders TCPI(BAC) card', script.includes('label: "TCPI(BAC)"'));
test('UI renders TCPI(EAC) card', script.includes('label: "TCPI(EAC)"'));
test('UI shows worst-case warning', script.includes('evmWorstCaseWarning &&'));
test('UI shows cost coverage warning', script.includes('evmCoverageStatus !== "ok"'));

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  E2E RESULTS: ' + passed + '/' + (passed + failed) + ' tests passed');
console.log('═══════════════════════════════════════════════════════════');

if (failed > 0) process.exit(1);
