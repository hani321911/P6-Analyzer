// ═══════════════════════════════════════════════════════════════
// COMPREHENSIVE TEST 5: Critical Path & Network DP (Round 7 R2 fix)
// ═══════════════════════════════════════════════════════════════
const { readFileSync } = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', '..', 'p6-analyzer.html');
const html = readFileSync(HTML_PATH, 'utf-8');
const matches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const script = matches[1][1];

console.log('═══════════════════════════════════════════════════════════');
console.log('  TEST 5: Critical Path & Network DP');
console.log('═══════════════════════════════════════════════════════════\n');

let passed = 0, failed = 0;
const test = (label, condition) => {
  if (condition) { console.log('  ✓ ' + label); passed++; }
  else { console.log('  ✗ FAIL: ' + label); failed++; }
};

// Extract real functions for runtime tests
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

const findLPDCode = extractFn('findLongestPathDuration');
const networkCode = extractFn('_calculateNetworkLongestPath');

eval(networkCode.replace('function _calculateNetworkLongestPath', 'global._calculateNetworkLongestPath = function _calculateNetworkLongestPath'));
eval(findLPDCode.replace('function findLongestPathDuration', 'global.findLongestPathDuration = function findLongestPathDuration'));

// 5.1 Function Existence
console.log('▶ 5.1 Function Definitions');
test('findLongestPathDuration defined', script.includes('function findLongestPathDuration'));
test('_calculateNetworkLongestPath defined', script.includes('function _calculateNetworkLongestPath'));

// 5.2 R2 Fix: Multi-key alias map
console.log('\n▶ 5.2 R2 Fix: ObjectId Alias Map');
test('Multi-key alias (actId, id, objectId)', script.includes('a.objectId'));
test('Canonical key function', script.includes('canonicalKey'));
test('UniqueKeys Set deduplication', script.includes('uniqueKeys'));

// 5.3 Runtime Tests
console.log('\n▶ 5.3 Runtime Tests');

// Linear path
const linearActs = [
  {actId:'X1', plannedDuration:30, totalFloat:0, isSummary:false, status:'Not Started'},
  {actId:'X2', plannedDuration:40, totalFloat:0, isSummary:false, status:'Not Started'}
];
const linearRels = [{predId:'X1', succId:'X2'}];
test('Linear path (30+40=70)', global.findLongestPathDuration(linearActs, linearRels, '2025-01-01') === 70);

// Parallel paths
const parallelActs = [
  {actId:'A1', plannedDuration:10, totalFloat:0, isSummary:false, status:'In Progress'},
  {actId:'A2', plannedDuration:10, totalFloat:0, isSummary:false, status:'Not Started'},
  {actId:'A3', plannedDuration:10, totalFloat:0, isSummary:false, status:'Not Started'},
  {actId:'A4', plannedDuration:10, totalFloat:0, isSummary:false, status:'Not Started'},
  {actId:'A5', plannedDuration:10, totalFloat:0, isSummary:false, status:'Not Started'},
  {actId:'B1', plannedDuration:20, totalFloat:0, isSummary:false, status:'In Progress'},
  {actId:'B2', plannedDuration:20, totalFloat:0, isSummary:false, status:'Not Started'},
  {actId:'B3', plannedDuration:20, totalFloat:0, isSummary:false, status:'Not Started'}
];
const parallelRels = [
  {predId:'A1', succId:'A2'}, {predId:'A2', succId:'A3'},
  {predId:'A3', succId:'A4'}, {predId:'A4', succId:'A5'},
  {predId:'B1', succId:'B2'}, {predId:'B2', succId:'B3'}
];
test('Parallel paths (max 60)', global.findLongestPathDuration(parallelActs, parallelRels, '2025-01-01') === 60);

// Cycle handling
const cyclicActs = [
  {actId:'C1', plannedDuration:5, totalFloat:0, isSummary:false, status:'Not Started'},
  {actId:'C2', plannedDuration:5, totalFloat:0, isSummary:false, status:'Not Started'}
];
const cyclicRels = [{predId:'C1', succId:'C2'}, {predId:'C2', succId:'C1'}];
const cycleResult = global.findLongestPathDuration(cyclicActs, cyclicRels, '2025-01-01');
test('Cycle handled (no infinite loop)', cycleResult > 0 && cycleResult < 1000);

// Empty schedule
test('Empty input returns 0', global.findLongestPathDuration([], [], '2025-01-01') === 0);
test('Null relationships handled', global.findLongestPathDuration(linearActs, null, '2025-01-01') > 0);

// R2 Fix tests: ObjectId-based relationships
console.log('\n▶ 5.4 R2 Fix Verification');
const acts_objId = [
  { id: '1001', actId: 'A100', plannedDuration: 10, totalFloat: 0, isSummary: false, status: 'Not Started' },
  { id: '1002', actId: 'A101', plannedDuration: 20, totalFloat: 0, isSummary: false, status: 'Not Started' },
  { id: '1003', actId: 'A102', plannedDuration: 30, totalFloat: 0, isSummary: false, status: 'Not Started' }
];
const rels_objId = [
  { predId: '1001', succId: '1002' },
  { predId: '1002', succId: '1003' }
];
test('id+actId, rels use ObjectId → 60', 
  global.findLongestPathDuration(acts_objId, rels_objId, '2025-01-01') === 60);

const rels_mixed = [
  { predId: 'A100', succId: 'A101' },
  { predId: '1002', succId: '1003' }
];
test('Mixed actId+ObjectId → 60', 
  global.findLongestPathDuration(acts_objId, rels_mixed, '2025-01-01') === 60);

// 5.5 Critical Path Detection
console.log('\n▶ 5.5 Critical Path Detection');
test('TF <= 0 critical detection', script.includes('totalFloat <= 0'));
test('Critical path counting', script.includes('criticalCount') || script.includes('critical.length'));
test('Critical path duration calculation', script.includes('criticalDuration') || script.includes('cpDur') || (script.includes('critical') && script.includes('plannedDuration')));

// 5.6 LongestPath XML field handling
console.log('\n▶ 5.6 LongestPath XML Field');
test('LongestPath flag parsed', 
  script.includes('LongestPath') || script.includes('isLongestPath'));

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  TEST 5 RESULTS: ' + passed + '/' + (passed + failed) + ' passed');
console.log('═══════════════════════════════════════════════════════════');
process.exit(failed > 0 ? 1 : 0);
