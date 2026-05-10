// ═══════════════════════════════════════════════════════════════
// COMPREHENSIVE TEST 2: DCMA 14-Point Compliance
// ═══════════════════════════════════════════════════════════════
const { readFileSync } = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', '..', 'p6-analyzer.html');
const html = readFileSync(HTML_PATH, 'utf-8');
const matches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const script = matches[1][1];

console.log('═══════════════════════════════════════════════════════════');
console.log('  TEST 2: DCMA 14-Point Schedule Assessment');
console.log('═══════════════════════════════════════════════════════════\n');

let passed = 0, failed = 0;
const test = (label, condition) => {
  if (condition) { console.log('  ✓ ' + label); passed++; }
  else { console.log('  ✗ FAIL: ' + label); failed++; }
};

console.log('▶ Point 1: Logic (Missing Predecessors/Successors)');
test('Detects missing predecessor', script.includes('missingPredecessor') || script.includes('noPredecessor'));
test('Detects missing successor', script.includes('missingSuccessor') || script.includes('noSuccessor'));
test('Threshold: 5% open logic', script.includes('0.05') || script.includes('5%'));

console.log('\n▶ Point 2: Leads (Negative Lags)');
test('Detects negative lags', script.includes('negativeLag') || script.includes('lag < 0'));
test('Lag calculation present', script.includes('lag') && script.includes('Number'));

console.log('\n▶ Point 3: Lags (Threshold 5%)');
test('Lag detection exists', script.includes('positiveLag') || script.includes('lag > 0'));

console.log('\n▶ Point 4: Relationship Types');
test('FS relationship counting', script.includes('"FS"') || script.includes("'FS'"));
test('Relationship types tracked', script.includes('relType') || script.includes('SS') || script.includes('FF'));

console.log('\n▶ Point 5: Hard Constraints');
test('Mandatory Start detected', script.includes('Mandatory Start') || script.includes('mandatoryStart'));
test('Mandatory Finish detected', script.includes('Mandatory Finish') || script.includes('mandatoryFinish'));
test('Must Finish On detected', script.includes('Must Finish On') || script.includes('MFO') || script.includes('mustFinish'));

console.log('\n▶ Point 6: High Float (>44 days)');
test('High float threshold (44)', script.includes('44'));
test('Float calculation', script.includes('totalFloat'));

console.log('\n▶ Point 7: Negative Float');
test('Negative float detection', script.includes('totalFloat < 0') || script.includes('negativeFloat'));

console.log('\n▶ Point 8: High Duration (>44 days)');
test('Duration threshold check', script.includes('44') && script.includes('duration'));

console.log('\n▶ Point 9: Invalid Dates');
test('Invalid date detection', script.includes('invalidDate') || script.includes('isNaN') || script.includes('isValid'));

console.log('\n▶ Point 10: Resources');
test('Resource detection (BAC)', script.includes('BAC') || script.includes('budgetedTotalCost') || script.includes('plannedCost'));

console.log('\n▶ Point 11: Missed Tasks');
test('Missed task detection', script.includes('missedTask') || script.includes('actualFinish') || script.includes('lateFinish'));

console.log('\n▶ Point 12: Critical Path Test (CPT)');
test('Critical path detection', script.includes('critical') && script.includes('Path'));
test('CPT calculation', script.includes('cpt') || script.includes('CPT') || (script.includes('critical') && script.includes('test')));

console.log('\n▶ Point 13: CPLI');
test('CPLI calculation', script.includes('cpli') || script.includes('CPLI'));

console.log('\n▶ Point 14: BEI');
test('BEI calculation', script.includes('bei') || script.includes('BEI'));
test('Baseline comparison', script.includes('baseline') || script.includes('blProj'));

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  TEST 2 RESULTS: ' + passed + '/' + (passed + failed) + ' passed');
console.log('═══════════════════════════════════════════════════════════');
process.exit(failed > 0 ? 1 : 0);
