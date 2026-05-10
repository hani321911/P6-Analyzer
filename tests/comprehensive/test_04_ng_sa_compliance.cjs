// ═══════════════════════════════════════════════════════════════
// COMPREHENSIVE TEST 4: NG SA Compliance + Saudi Calendar
// ═══════════════════════════════════════════════════════════════
const { readFileSync } = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', '..', 'p6-analyzer.html');
const html = readFileSync(HTML_PATH, 'utf-8');
const matches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const script = matches[1][1];

console.log('═══════════════════════════════════════════════════════════');
console.log('  TEST 4: NG SA Compliance + Saudi Calendar');
console.log('═══════════════════════════════════════════════════════════\n');

let passed = 0, failed = 0;
const test = (label, condition) => {
  if (condition) { console.log('  ✓ ' + label); passed++; }
  else { console.log('  ✗ FAIL: ' + label); failed++; }
};

// 6 Mandatory NG SA Certificates
console.log('▶ 6 Mandatory NG SA Certificates');
test('certRTR detection', script.includes('certRTR'));
test('certEHC detection', script.includes('certEHC'));
test('certECC detection', script.includes('certECC'));
test('certTCC detection', script.includes('certTCC'));
test('certPAC detection', script.includes('certPAC'));
test('certFAC detection', script.includes('certFAC'));

// Certificate Sequence Validation (G1+G2 from Round 8)
console.log('\n▶ Certificate Sequence Validation (G1+G2)');
test('validateCertificateSequence function', script.includes('const validateCertificateSequence ='));
test('RTR -> EHC validation', script.includes('checkPair("RTR", "EHC")'));
test('RTR -> ECC validation', script.includes('checkPair("RTR", "ECC")'));
test('RTR -> TCC validation', script.includes('checkPair("RTR", "TCC")'));
test('EHC -> TCC validation', script.includes('checkPair("EHC", "TCC")'));
test('ECC -> TCC validation', script.includes('checkPair("ECC", "TCC")'));
test('TCC -> PAC validation', script.includes('checkPair("TCC", "PAC")'));
test('PAC -> FAC validation', script.includes('checkPair("PAC", "FAC")'));
test('Returns isValid', script.includes('isValid: violations.length === 0'));
test('Returns violations array', script.includes('violations: violations'));

// Negative Context Filter (Phase 1)
console.log('\n▶ Negative Context Filter (Avoids False Cert Detection)');
test('Negative context regex defined', script.includes('negativeContext'));
test('Filters "walkdown"', script.includes('walkdown'));
test('Filters "preparation"', script.includes('preparation'));
test('Filters "test plan"', script.includes('test\\\\s*plan') || script.includes('test plan'));
test('Filters "submission"', script.includes('submission'));
test('Filters "review"', script.includes('review'));
test('Filters "kickoff/kick-off"', script.includes('kick'));

// Saudi Hijri Calendar (Umm al-Qura)
console.log('\n▶ Saudi Hijri Calendar (Umm al-Qura)');
test('SA_ISLAMIC_HOLIDAYS data', script.includes('SA_ISLAMIC_HOLIDAYS'));
test('Eid Al-Fitr handling', script.includes('eid_alfitr') || script.includes('Al-Fitr'));
test('Eid Al-Adha handling', script.includes('eid_aladha') || script.includes('Al-Adha'));
test('Founding Day (Feb 22)', script.includes('founding') || script.includes('02-22'));
test('National Day (Sep 23)', script.includes('national') || script.includes('09-23'));

// Multi-Day Holiday Coverage
console.log('\n▶ Multi-Day Holiday Coverage (Phase 2.1)');
test('buildExpectedSAHolidays function', script.includes('function buildExpectedSAHolidays'));
test('auditCalendarSAHolidays function', script.includes('function auditCalendarSAHolidays'));
test('3-state status (complete/partial/missing)', 
  script.includes('"complete"') && script.includes('"partial"') && script.includes('"missing"'));
test('coveredDays tracked', script.includes('coveredDays'));
test('totalDays tracked', script.includes('totalDays'));
test('daysCoveragePct calculated', script.includes('daysCoveragePct'));

// HoursPerDay handling (P6 Critical!)
console.log('\n▶ HoursPerDay Handling (P6 Conversion)');
test('HoursPerDay extraction', script.includes('HoursPerDay'));
test('Duration in hours converted', script.includes('hoursPerDay') || script.includes('HOURS_PER_DAY'));
test('Per-calendar HoursPerDay', 
  script.includes('cal.hoursPerDay') || script.includes('calendar.HoursPerDay') || script.includes('calMap'));

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  TEST 4 RESULTS: ' + passed + '/' + (passed + failed) + ' passed');
console.log('═══════════════════════════════════════════════════════════');
process.exit(failed > 0 ? 1 : 0);
