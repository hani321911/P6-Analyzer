// ═══════════════════════════════════════════════════════════════
// COMPREHENSIVE TEST 6: Progress Calculation (pctType + R1 fix)
// ═══════════════════════════════════════════════════════════════
const { readFileSync } = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', '..', 'p6-analyzer.html');
const html = readFileSync(HTML_PATH, 'utf-8');
const matches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const script = matches[1][1];

console.log('═══════════════════════════════════════════════════════════');
console.log('  TEST 6: Progress Calculation (pctType + R1 fix)');
console.log('═══════════════════════════════════════════════════════════\n');

let passed = 0, failed = 0;
const test = (label, condition) => {
  if (condition) { console.log('  ✓ ' + label); passed++; }
  else { console.log('  ✗ FAIL: ' + label); failed++; }
};

// Extract real getActualPctRatio
const start = script.indexOf('const getActualPctRatio = (p) => {');
let depth = 0, end = -1, started = false;
for (let i = start; i < script.length; i++) {
  if (script[i] === '{') { depth++; started = true; }
  else if (script[i] === '}') { depth--; if (started && depth === 0) { end = i + 1; break; } }
}
const helperCode = script.substring(start, end) + ';';
eval('global.getActualPctRatio = ' + helperCode.replace('const getActualPctRatio = ', '') + ';');

// 6.1 Function Existence
console.log('▶ 6.1 Function Definitions');
test('getActualPctRatio defined', script.includes('const getActualPctRatio'));
test('isLOEActivity defined', script.includes('const isLOEActivity'));

// 6.2 Basic pctType handling
console.log('\n▶ 6.2 Basic pctType Handling');
test('Physical pctType', global.getActualPctRatio({pctType: 'Physical', physicalPct: 0.7}) === 0.7);
test('Duration pctType', global.getActualPctRatio({pctType: 'Duration', durationPct: 0.4}) === 0.4);
test('Units pctType', global.getActualPctRatio({pctType: 'Units', unitsPct: 0.85}) === 0.85);
test('Manual pctType', global.getActualPctRatio({pctType: 'Manual', pctComplete: 0.5}) === 0.5);
test('No pctType (fallback)', global.getActualPctRatio({pctComplete: 0.5}) === 0.5);

// 6.3 Edge Cases
console.log('\n▶ 6.3 Edge Cases');
test('Empty input → 0', global.getActualPctRatio({}) === 0);
test('null → 0', global.getActualPctRatio(null) === 0);
test('Out-of-range (1.5) → clamped to 1', global.getActualPctRatio({pctType: 'Physical', physicalPct: 1.5}) === 1);
test('Negative (-0.5) → clamped to 0', global.getActualPctRatio({pctType: 'Physical', physicalPct: -0.5}) === 0);
test('NaN → 0', global.getActualPctRatio({pctType: 'Physical', physicalPct: NaN}) === 0);

// 6.4 R1 Fix: Fallback chain
console.log('\n▶ 6.4 R1 Fix: Fallback Chain (per pctType)');
test('Physical+undefined → fallback to pctComplete=0.45', 
  global.getActualPctRatio({pctType: 'Physical', physicalPct: undefined, pctComplete: 0.45}) === 0.45);
test('Duration+null → fallback to physicalPct=0.6', 
  global.getActualPctRatio({pctType: 'Duration', durationPct: null, physicalPct: 0.6}) === 0.6);
test('Units+undefined → fallback to pctComplete=0.3', 
  global.getActualPctRatio({pctType: 'Units', unitsPct: undefined, pctComplete: 0.3}) === 0.3);
test('Manual+undefined → fallback to physicalPct=0.8', 
  global.getActualPctRatio({pctType: 'Manual', pctComplete: undefined, physicalPct: 0.8}) === 0.8);
test('Physical+all undefined → 0', 
  global.getActualPctRatio({pctType: 'Physical'}) === 0);
test('Manual+0 wins over fallback (preserve 0)', 
  global.getActualPctRatio({pctType: 'Manual', pctComplete: 0, durationPct: 0.5}) === 0);
test('R1 fix in code: physicalPct chain', 
  script.includes('p.physicalPct ?? p.pctComplete ?? p.durationPct ?? p.unitsPct'));

// 6.5 LOE Detection
console.log('\n▶ 6.5 LOE (Level of Effort) Detection');
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
test('Detects "level of effort" (case-insensitive)', global.isLOEActivity({type: 'level of effort'}));
test('Doesn\'t flag "Task Dependent"', !global.isLOEActivity({type: 'Task Dependent'}));
test('Doesn\'t flag "Resource Dependent"', !global.isLOEActivity({type: 'Resource Dependent'}));
test('Handles null', !global.isLOEActivity(null));
test('Handles missing type', !global.isLOEActivity({}));

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  TEST 6 RESULTS: ' + passed + '/' + (passed + failed) + ' passed');
console.log('═══════════════════════════════════════════════════════════');
process.exit(failed > 0 ? 1 : 0);
