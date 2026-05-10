// ═══════════════════════════════════════════════════════════════
// COMPREHENSIVE TEST RUNNER — All Test Suites
// v29.0.11.3: Fixed false-green bug + reflects Round 9.2 patches
// ═══════════════════════════════════════════════════════════════
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Preflight: Verify p6-analyzer.html exists
const htmlPath = process.env.P6_ANALYZER_HTML || path.join(__dirname, '..', '..', 'p6-analyzer.html');
if (!fs.existsSync(htmlPath)) {
  console.error('\n❌ FATAL: Missing p6-analyzer.html at: ' + htmlPath);
  process.exit(2);
}

const tests = [
  { id: 8, name: 'Round 9 Regressions', file: 'test_08_round9_regressions.cjs' }
];

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║        COMPREHENSIVE TEST SUITE — P6 Analyzer v29.0.11.3     ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

let totalPassed = 0, totalFailed = 0;
let suiteErrors = 0;

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
      console.log('  → ' + (p === total ? '✓' : '⚠') + ' ' + p + '/' + total + ' passed');
    } else {
      totalFailed += 1; suiteErrors += 1;
    }
  } catch (e) {
    const out = (e.stdout || '').toString();
    const match = out.match(/(\d+)\/(\d+)\s+passed/);
    if (match) {
      const p = parseInt(match[1]);
      const total = parseInt(match[2]);
      totalPassed += p;
      totalFailed += (total - p);
      console.log('  → ✗ ' + p + '/' + total + ' passed');
    } else {
      totalFailed += 1; suiteErrors += 1;
      console.log('  → ✗ ERROR: ' + e.message.split('\n')[0]);
    }
  }
});

const overall = totalPassed + totalFailed;
console.log('\n  TOTAL: ' + totalPassed + '/' + overall + ' tests passed');

if (suiteErrors > 0 || overall === 0 || totalFailed > 0) {
  console.log('  ❌ Tests failed or errored\n');
  process.exit(1);
} else {
  console.log('  ✅ All tests passing!\n');
  process.exit(0);
}
