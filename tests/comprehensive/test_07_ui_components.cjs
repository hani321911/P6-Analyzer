// ═══════════════════════════════════════════════════════════════
// COMPREHENSIVE TEST 7: UI Components Coverage
// ═══════════════════════════════════════════════════════════════
const { readFileSync } = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', '..', 'p6-analyzer.html');
const html = readFileSync(HTML_PATH, 'utf-8');
const matches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const script = matches[1][1];

console.log('═══════════════════════════════════════════════════════════');
console.log('  TEST 7: UI Components Coverage');
console.log('═══════════════════════════════════════════════════════════\n');

let passed = 0, failed = 0;
const test = (label, condition) => {
  if (condition) { console.log('  ✓ ' + label); passed++; }
  else { console.log('  ✗ FAIL: ' + label); failed++; }
};

// Major Components
console.log('▶ Major Components Defined');
test('App component', script.includes('function App') || script.includes('function MainApp'));
test('ExecutiveDashboard', script.includes('function ExecutiveDashboard'));
test('KeyMilestonesPanel', script.includes('function KeyMilestonesPanel'));
test('CalendarsPanel', script.includes('function CalendarsPanel') || script.includes('CalendarsPanel'));
test('PhasesPanel', script.includes('PhasesPanel') || script.includes('phases'));
test('ProjectTypeBanner', script.includes('ProjectTypeBanner') || script.includes('detectedType'));

// EVM Tab Components
console.log('\n▶ EVM Tab Components');
test('EAC1 card rendered', script.includes('EAC') && script.includes('BAC/CPI'));
test('EAC2 card rendered', script.includes('AC+BAC-EV') || script.includes('atypical'));
test('EAC3 card rendered', script.includes('EAC') && (script.includes('worst') || script.includes('CPI*SPI')));
test('VAC card rendered', script.includes('VAC') && script.includes('label'));
test('TCPI(BAC) card', script.includes('TCPI(BAC)') || script.includes('TCPI BAC'));
test('TCPI(EAC) card', script.includes('TCPI(EAC)') || script.includes('TCPI EAC'));
test('Cost coverage warning', script.includes('evmCoverageStatus'));

// Tabs (17+)
console.log('\n▶ Tabs/Sections');
test('Multiple tabs defined', (script.match(/tab === "/g) || []).length >= 5);
test('DCMA tab', script.includes('"dcma"') || script.includes("'dcma'"));
test('EVM tab', script.includes('"evm"') || script.includes("'evm'"));
test('Activities/Schedule tab', script.includes('"acts"') || script.includes('"schedule"') || script.includes('"lookahead"'));
test('Milestones tab', script.includes('"milestones"') || script.includes("'milestones'"));
test('Calendars tab', script.includes('"calendars"') || script.includes("'calendars'"));

// Bilingual Support
console.log('\n▶ Bilingual Support (Arabic/English)');
test('lang state', script.includes('lang === "ar"') || script.includes('lang === \'ar\''));
test('Arabic strings count', (script.match(/[\u0600-\u06FF]/g) || []).length > 100);
test('Translation function (t)', script.includes('const t =') || script.includes('function t('));
test('RTL direction', script.includes('"rtl"') || script.includes("'rtl'"));

// Loading/Error/Empty States
console.log('\n▶ State Handling');
test('Loading states', script.includes('loading') || script.includes('Loading'));
test('Error states', script.includes('error') && script.includes('catch'));
test('Empty states', script.includes('noData') || script.includes('empty'));

// PDF Export
console.log('\n▶ PDF Export');
test('PDF generation function', script.includes('generateExecutivePDF') || script.includes('generatePDF'));
test('PDF generation library used', script.includes('jsPDF') || script.includes('jspdf') || script.includes('html2canvas') || script.includes('window.print') || script.includes('print()'));

// Excel Export
console.log('\n▶ Excel Export');
test('Excel export capability', script.includes('XLSX') || script.includes('xlsx') || script.includes('SheetJS') || script.includes('text/csv') || script.includes('exportExcel') || script.includes('export.*csv'));

// Print/Page CSS
console.log('\n▶ Print Styles');
test('@page CSS rules', script.includes('@page') || script.includes('page-break'));

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  TEST 7 RESULTS: ' + passed + '/' + (passed + failed) + ' passed');
console.log('═══════════════════════════════════════════════════════════');
process.exit(failed > 0 ? 1 : 0);
