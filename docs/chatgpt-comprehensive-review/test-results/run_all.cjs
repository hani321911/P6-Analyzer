// ═══════════════════════════════════════════════════════════════
// COMPREHENSIVE TEST RUNNER — All Test Suites
// ═══════════════════════════════════════════════════════════════
const { execSync } = require('child_process');
const path = require('path');

const tests = [
  { id: 1, name: 'P6 XML Parser', file: 'test_01_xml_parser.cjs' },
  { id: 2, name: 'DCMA 14-Point Compliance', file: 'test_02_dcma_compliance.cjs' },
  { id: 3, name: 'EVM PMI Standard', file: 'test_03_evm_pmi.cjs' },
  { id: 4, name: 'NG SA Compliance + Saudi Calendar', file: 'test_04_ng_sa_compliance.cjs' },
  { id: 5, name: 'Critical Path & Network DP', file: 'test_05_critical_path.cjs' },
  { id: 6, name: 'Progress Calculation (pctType + R1)', file: 'test_06_progress.cjs' },
  { id: 7, name: 'UI Components Coverage', file: 'test_07_ui_components.cjs' }
];

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║        COMPREHENSIVE TEST SUITE — P6 Analyzer v29.0.11.2     ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

let totalPassed = 0, totalFailed = 0;
const results = [];

tests.forEach(t => {
  console.log('\n┌──────────────────────────────────────────────────────────────┐');
  console.log('│  Test ' + t.id + ': ' + t.name.padEnd(54) + '│');
  console.log('└──────────────────────────────────────────────────────────────┘');
  try {
    const output = execSync('node ' + path.join(__dirname, t.file), { encoding: 'utf-8' });
    const match = output.match(/(\d+)\/(\d+)\s+passed/);
    if (match) {
      const p = parseInt(match[1]);
      const total = parseInt(match[2]);
      totalPassed += p;
      totalFailed += (total - p);
      results.push({ name: t.name, passed: p, total: total, status: p === total ? '✓' : '⚠' });
      console.log('  → ' + (p === total ? '✓' : '⚠') + ' ' + p + '/' + total + ' passed');
    }
  } catch (e) {
    const out = (e.stdout || '').toString();
    const match = out.match(/(\d+)\/(\d+)\s+passed/);
    if (match) {
      const p = parseInt(match[1]);
      const total = parseInt(match[2]);
      totalPassed += p;
      totalFailed += (total - p);
      results.push({ name: t.name, passed: p, total: total, status: '✗' });
      console.log('  → ✗ ' + p + '/' + total + ' passed');
    } else {
      results.push({ name: t.name, passed: 0, total: 0, status: '✗ ERROR' });
      console.log('  → ✗ ERROR: ' + e.message.split('\n')[0]);
    }
  }
});

console.log('\n\n╔══════════════════════════════════════════════════════════════╗');
console.log('║                     COMPREHENSIVE SUMMARY                     ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

results.forEach(r => {
  const pct = r.total > 0 ? Math.round((r.passed/r.total)*100) : 0;
  console.log('  ' + r.status + ' ' + r.name.padEnd(45) + ' ' + r.passed + '/' + r.total + ' (' + pct + '%)');
});

const overall = totalPassed + totalFailed;
console.log('\n  ─────────────────────────────────────────────────────────');
console.log('  TOTAL: ' + totalPassed + '/' + overall + ' (' + Math.round((totalPassed/overall)*100) + '%) tests passed');
console.log('  ─────────────────────────────────────────────────────────\n');

if (totalFailed > 0) {
  console.log('  ⚠️  ' + totalFailed + ' tests failed — review required\n');
  process.exit(1);
} else {
  console.log('  ✅ All tests passing!\n');
  process.exit(0);
}
