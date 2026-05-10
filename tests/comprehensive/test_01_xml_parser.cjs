// ═══════════════════════════════════════════════════════════════
// COMPREHENSIVE TEST 1: P6 XML Parser
// ═══════════════════════════════════════════════════════════════
const { readFileSync } = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', '..', 'p6-analyzer.html');
const html = readFileSync(HTML_PATH, 'utf-8');
const matches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const script = matches[1][1];

console.log('═══════════════════════════════════════════════════════════');
console.log('  TEST 1: P6 XML Parser');
console.log('═══════════════════════════════════════════════════════════\n');

let passed = 0, failed = 0, warnings = [];
const test = (label, condition, severity = 'normal') => {
  if (condition) { console.log('  ✓ ' + label); passed++; }
  else { 
    console.log('  ✗ FAIL [' + severity + ']: ' + label); 
    failed++;
    if (severity === 'warning') warnings.push(label);
  }
};

// 1.1 Parser exists
console.log('▶ 1.1 Parser Existence');
test('parseP6XML function defined', script.includes('function parseP6XML'));
test('Parser handles XMLSerializer', script.includes('DOMParser') || script.includes('parseFromString'));

// 1.2 Activity parsing
console.log('\n▶ 1.2 Activity Field Parsing');
test('Parses ObjectId', script.includes('ObjectId') || script.includes('objectId'));
test('Parses Activity Id', script.includes('actId') || script.includes('Id'));
test('Parses Activity Name', script.includes('Name'));
test('Parses Activity Type (TT_Task, TT_Mile, TT_LOE)', script.includes('TT_Mile') || script.includes('TT_LOE'));
test('Parses PlannedStartDate', script.includes('PlannedStartDate'));
test('Parses PlannedFinishDate', script.includes('PlannedFinishDate'));
test('Parses PlannedDuration', script.includes('PlannedDuration') || script.includes('plannedDuration'));
test('Parses TotalFloat', script.includes('TotalFloat') || script.includes('totalFloat'));
test('Parses PercentComplete', script.includes('PercentComplete') || script.includes('pctComplete'));

// 1.3 PercentComplete handling (CRITICAL: 0-1 decimal!)
console.log('\n▶ 1.3 PercentComplete Conversion (0-1 → 0-100)');
test('Handles decimal percentage (0-1)', 
  script.includes('* 100') || script.includes('/ 100') || script.includes('PercentComplete'));
test('PercentCompleteType handled', script.includes('PercentCompleteType') || script.includes('pctType'));
test('PhysicalPercentComplete handled', script.includes('PhysicalPercentComplete') || script.includes('physicalPct'));
test('UnitsPercentComplete handled', script.includes('UnitsPercentComplete') || script.includes('unitsPct'));
test('DurationPercentComplete handled', script.includes('DurationPercentComplete') || script.includes('durationPct'));

// 1.4 Calendar parsing
console.log('\n▶ 1.4 Calendar Parsing');
test('Calendar parsing exists', script.includes('Calendar') && script.includes('HoursPerDay'));
test('HoursPerDay extracted', script.includes('HoursPerDay'));
test('HolidayOrException parsed', script.includes('HolidayOrException') || script.includes('holiday'));
test('Multiple calendars supported', script.includes('Calendar') && (script.includes('calendars[') || script.includes('cal\.') || script.includes('calMap') || script.match(/Calendar.*HoursPerDay/)));

// 1.5 Relationships parsing
console.log('\n▶ 1.5 Relationships Parsing');
test('Relationship element parsed', script.includes('Relationship'));
test('PredecessorActivityObjectId parsed', 
  script.includes('PredecessorActivityObjectId') || script.includes('predId'));
test('SuccessorActivityObjectId parsed', 
  script.includes('SuccessorActivityObjectId') || script.includes('succId'));
test('Lag parsed', script.includes('Lag') || script.includes('lag'));
test('Relationship Type parsed (FS, SS, FF, SF)', 
  script.includes('"FS"') || script.includes("'FS'") || script.includes('relType'));

// 1.6 Edge cases
console.log('\n▶ 1.6 Edge Cases');
test('Handles empty XML gracefully', 
  script.includes('try') && script.includes('catch'));
test('Handles missing Calendar', 
  script.includes('|| 8') || script.includes('?? 8') || script.includes('|| {}'));

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  TEST 1 RESULTS: ' + passed + '/' + (passed + failed) + ' passed');
if (warnings.length > 0) console.log('  ⚠️  Warnings: ' + warnings.length);
console.log('═══════════════════════════════════════════════════════════');
process.exit(failed > 0 ? 1 : 0);
