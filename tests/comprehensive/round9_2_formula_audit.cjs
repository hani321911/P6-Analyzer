const fs = require('fs');
const path = require('path');

function normalizePct(v) {
  if (v == null || isNaN(v)) return null;
  const n = Number(v);
  if (n > 1 && n <= 100) return n / 100;
  return Math.max(0, Math.min(1, n));
}
function firstNonNull(...vals) {
  for (const v of vals) {
    if (v !== null && v !== undefined) {
      const n = normalizePct(v);
      if (n !== null) return n;
    }
  }
  return 0;
}
function getActualPctRatio(p) {
  if (!p) return 0;
  const type = (p.pctType || "").toLowerCase();
  let raw;
  if (type === "physical") {
    raw = firstNonNull(p.physicalPct, p.pctComplete, p.durationPct, p.unitsPct);
  } else if (type === "duration") {
    raw = firstNonNull(p.durationPct, p.pctComplete, p.physicalPct, p.unitsPct);
  } else if (type === "units") {
    raw = firstNonNull(p.unitsPct, p.pctComplete, p.physicalPct, p.durationPct);
  } else if (type === "manual") {
    if (p.pctComplete !== null && p.pctComplete !== undefined) {
      raw = normalizePct(p.pctComplete) ?? 0;
    } else {
      raw = firstNonNull(p.physicalPct, p.durationPct, p.unitsPct);
    }
  } else {
    raw = firstNonNull(p.pctComplete, p.durationPct, p.physicalPct, p.unitsPct);
  }
  if (raw === null || raw === undefined || isNaN(raw)) return 0;
  return Math.max(0, Math.min(1, Number(raw)));
}
function d(s) { return new Date(s + (s.length === 10 ? 'T00:00:00Z' : '')); }
function calcPct(act, dataDateStr) {
  const dataDate = d(dataDateStr);
  if (!act?.plannedStart || !act?.plannedFinish) return 0;
  const s = d(act.plannedStart), f = d(act.plannedFinish);
  if (dataDate <= s) return 0;
  if (dataDate >= f) return 1;
  const span = f - s;
  return span > 0 ? (dataDate - s) / span : 1;
}
function totalCost(a) { return (a.plannedNonLaborCost || 0) + (a.plannedLaborCost || 0) + (a.plannedMaterialCost || 0) + (a.plannedExpenseCost || 0); }
function totalActualCost(a) { return (a.actualNonLaborCost || 0) + (a.actualLaborCost || 0) + (a.actualMaterialCost || 0) + (a.actualExpenseCost || 0); }
function isLOEActivity(act) {
  if (!act) return false;
  const type = (act.type || act.activityType || '').toString().toLowerCase();
  return type === 'level of effort' || type === 'loe' || type === 'tt_loe' || type.includes('level of effort') || type.includes('level_of_effort');
}
function analyzeCore(baseline, progress=null) {
  const refBL = baseline;
  const bMap = Object.fromEntries(refBL.activities.map(a => [a.actId, a]));
  const progMap = progress ? Object.fromEntries(progress.activities.map(a => [a.actId, a])) : {};
  const dataDate = progress?.project?.dataDate || refBL.project?.dataDate || new Date().toISOString().slice(0,10);
  const baselineIds = new Set(refBL.activities.map(a => a.actId));
  const progressIds = new Set(progress ? progress.activities.map(a => a.actId) : []);
  const allIds = new Set([...baselineIds, ...progressIds]);
  const rows = [...allIds].map(actId => {
    const b = bMap[actId], p = progMap[actId];
    const basis = b || p;
    const isUnbaselined = !b && !!p;
    const isDeletedFromProgress = !!b && !p;
    const plannedPct = calcPct(b || p, dataDate) * 100;
    let actualPct;
    if (!progress) actualPct = 0;
    else if (!p) actualPct = 0;
    else if (p.status === 'Completed') actualPct = 100;
    else if (p.status === 'Not Started') actualPct = 0;
    else actualPct = getActualPctRatio(p) * 100;
    const bac = totalCost(basis);
    const pv = plannedPct / 100 * bac;
    const ev = actualPct / 100 * bac;
    const ac = p ? totalActualCost(p) : 0;
    return {
      actId, type:(p&&p.type)||(b&&b.type), status:(p&&p.status)||(b&&b.status),
      isMilestone:(p&&p.isMilestone)||(b&&b.isMilestone)||false,
      isSummary:(p&&p.isSummary)||(b&&b.isSummary)||false,
      isUnbaselined, isDeletedFromProgress, plannedPct:+plannedPct.toFixed(2), actualPct:+actualPct.toFixed(2), bac, pv, ev, ac,
      _raw:p||b
    };
  });
  const all = rows.filter(r => !r.isSummary);
  const evmAll = all.filter(r => !r.isMilestone);
  const evmFiltered = rows.filter(r => !r.isMilestone && !r.isSummary && !isLOEActivity(r._raw) && !r.isUnbaselined);
  const sum = arr => ({
    totalBac: arr.reduce((s,r)=>s+r.bac,0), totalPV: arr.reduce((s,r)=>s+r.pv,0), totalEV: arr.reduce((s,r)=>s+r.ev,0), totalAC: arr.reduce((s,r)=>s+r.ac,0), count: arr.length
  });
  return { dataDate, rows, codeTotals: sum(evmAll), patchedTotals: sum(evmFiltered), methodFilterCount: evmFiltered.length };
}

const A = null; // use null for missing
const U = undefined;
const NaNValue = NaN;
const actualCases = [
  ['P-01','Physical',0.7,U,U,U,0.7,'Physical field preferred'],
  ['P-02','Physical',A,U,U,0.45,0.45,'Physical missing -> pctComplete fallback'],
  ['P-03','Physical',U,0.6,U,U,0.6,'Physical undefined -> duration fallback'],
  ['P-04','Duration',U,0.5,U,U,0.5,'Duration field preferred'],
  ['P-05','Duration',U,A,U,0.3,0.3,'Duration null -> pctComplete fallback'],
  ['P-06','Units',U,U,0.4,U,0.4,'Units field preferred'],
  ['P-07','Manual',0.8,U,U,0.5,0.5,'Manual pctComplete wins'],
  ['P-08','Manual',U,U,U,0,0,'Manual zero preserved'],
  ['P-09','',0.6,0.4,0.5,0.7,0.7,'No type priority pctComplete > duration > physical > units'],
  ['P-10','Physical',1.5,U,U,U,0.015,'Current heuristic treats 1.5 as 1.5%'],
  ['P-11','Physical',-0.5,U,U,U,0,'Negative clamps to 0'],
  ['P-12','Physical',NaNValue,U,U,U,0,'NaN ignored -> 0'],
  ['P-13','Physical','50%',U,U,U,0,'Direct string with % is NaN; parser parseFloat would become 50'],
  ['P-14','Physical',50,U,U,U,0.5,'Numeric 50 -> 50%'],
  ['P-15','Duration',50,30,10,90,0.3,'Duration priority over pctComplete'],
  ['P-16','Units',50,30,10,90,0.1,'Units priority over pctComplete'],
  ['P-17','Physical',0,U,U,0.9,0,'Physical explicit zero preserved'],
  ['P-18','Duration',U,0,U,0.9,0,'Duration explicit zero preserved'],
  ['P-19','Units',U,U,0,0.9,0,'Units explicit zero preserved'],
  ['P-20','Manual',1,U,U,1,1,'Manual 1 -> 100%'],
  ['P-21','Manual',100,U,U,100,1,'Manual 100 -> 100%'],
  ['P-22','Manual',U,U,U,150,1,'Manual 150 clamps to 100%'],
  ['P-23','Physical',150,U,U,U,1,'Physical 150 clamps to 100%'],
  ['P-24','Physical',100,U,U,U,1,'Physical 100 -> 100%'],
  ['P-25','Physical',1,U,U,U,1,'Physical 1 -> 100%'],
  ['P-26','Physical','50',U,U,U,0.5,'String number 50 -> 50%'],
  ['P-27','Physical','0.5',U,U,U,0.5,'String decimal 0.5 -> 50% under current heuristic'],
  ['P-28','Physical','',U,U,U,0,'Empty string direct -> 0; parser would null'],
  ['P-29','Physical','   ',U,U,U,0,'Whitespace direct -> 0'],
  ['P-30','Duration',U,'75',U,U,0.75,'String number in duration'],
  ['P-31','Units',U,U,'60',U,0.6,'String number in units'],
  ['P-32','Manual',U,U,U,'0',0,'Manual string zero preserved'],
  ['P-33','Manual',0.8,0.7,0.6,U,0.8,'Manual missing -> physical fallback first'],
  ['P-34','Manual',U,0.7,0.6,U,0.7,'Manual missing -> duration fallback'],
  ['P-35','Manual',U,U,0.6,U,0.6,'Manual missing -> units fallback'],
  ['P-36','Physical',A,0,0.8,0.9,0.9,'Physical null; pctComplete before duration; zero not reached'],
  ['P-37','Physical',A,0,U,U,0,'Physical null -> duration zero preserved'],
  ['P-38','Duration',0.8,A,0.6,U,0.8,'Duration null; pctComplete missing -> physical fallback before units'],
  ['P-39','Units',0.8,0.7,A,U,0.8,'Units null -> pctComplete missing -> physical fallback'],
  ['P-40','',0.6,0.4,0.5,U,0.4,'No type no pctComplete: duration before physical'],
  ['P-41','Scope',0.6,0.4,0.5,0.7,0.7,'Scope unsupported -> default fallback'],
  ['P-42','Physical',A,A,A,A,0,'All null -> 0'],
  ['P-43','Physical',U,U,U,U,0,'All undefined -> 0'],
  ['P-44','Duration',NaNValue,NaNValue,0.4,NaNValue,0.4,'NaN skipped until units'],
  ['P-45','Manual',U,U,U,NaNValue,0,'Manual NaN explicitly becomes 0, no fallback'],
  ['P-46','physical',0.25,U,U,U,0.25,'Lowercase type accepted'],
  ['P-47',' Physical ',0.25,U,U,U,0.25,'Type not trimmed; default fallback still finds physicalPct'],
  ['P-48','Duration',U,1.5,U,U,0.015,'Duration 1.5 treated as 1.5%'],
  ['P-49','Units',U,U,1.5,U,0.015,'Units 1.5 treated as 1.5%'],
  ['P-50','',U,U,U,1.5,0.015,'Default pctComplete 1.5 treated as 1.5%'],
  ['P-51','Physical',0.005,U,U,U,0.005,'Sub-1 value means 0.5% or 0.5 ratio? ambiguous'],
  ['P-52','Physical',99.999,U,U,U,0.99999,'99.999% supported'],
];
const actualResults = actualCases.map(([id,pctType,physicalPct,durationPct,unitsPct,pctComplete,expected,note]) => {
  const input = {pctType, physicalPct, durationPct, unitsPct, pctComplete};
  const actual = getActualPctRatio(input);
  return {id,pctType,physicalPct,durationPct,unitsPct,pctComplete,expected,actual:+actual.toFixed(6),verdict:Math.abs(actual-expected)<1e-9?'PASS':'FAIL',note};
});

const plannedCases = [
  ['PL-01','Calendar linear 10 days','2026-01-01','2026-01-11','2026-01-06',0.5,'Calendar elapsed half way'],
  ['PL-02','Working days Mon-Fri expected 3/5','2026-01-05','2026-01-12','2026-01-07',0.6,'Code uses calendar elapsed, not working days'],
  ['PL-03','Saudi Sun-Thu with one holiday expected 2/4','2026-03-15','2026-03-22','2026-03-18',0.5,'Code ignores calendar holidays/workweek'],
  ['PL-04','Hours-based 100h activity 8h/day','2026-01-01','2026-01-11','2026-01-06',0.5,'Only date span used; hours curve not used'],
  ['PL-05','Already finished','2026-01-01','2026-01-05','2026-01-06',1,'After finish -> 100%'],
  ['PL-06','Not started','2026-01-10','2026-01-20','2026-01-09',0,'Before start -> 0%'],
  ['PL-07','Same-day milestone at data date','2026-01-05','2026-01-05','2026-01-05',1,'Expected milestone due today often 100%; code returns 0 due <= start check'],
  ['PL-08','Zero duration past','2026-01-05','2026-01-05','2026-01-06',1,'Past zero-duration -> 100%'],
  ['PL-09','Negative duration data after both','2026-01-10','2026-01-05','2026-01-11',1,'Bad data handled by >= finish -> 100% not issue flag'],
  ['PL-10','Cost phased front loaded mid date','2026-01-01','2026-05-01','2026-03-02',0.8,'Expected from curve not linear'],
  ['PL-11','Back loaded mid date','2026-01-01','2026-05-01','2026-03-02',0.2,'Expected from curve not linear'],
  ['PL-12','Resource hour custom curve','2026-01-01','2026-04-30','2026-02-15',0.25,'Expected from resource plan not linear'],
  ['PL-13','Physical units planned to date','2026-01-01','2026-02-01','2026-01-16',0.45,'Expected from planned units not linear'],
  ['PL-14','Milestone weighted 2 of 4','2026-01-01','2026-04-01','2026-02-15',0.5,'Expected from milestone weights not linear'],
  ['PL-15','Equivalent units drawings','2026-01-01','2026-04-01','2026-02-15',0.4,'Expected from deliverable weights not linear'],
  ['PL-16','LOE activity planned','2026-01-01','2026-12-31','2026-06-30',null,'LOE should be excluded from EVM, not planned % weighted'],
  ['PL-17','DataDate equals finish','2026-01-01','2026-01-10','2026-01-10',1,'At finish -> 100%'],
  ['PL-18','DataDate equals start','2026-01-01','2026-01-10','2026-01-01',0,'At start -> 0%'],
];
const plannedResults = plannedCases.map(([id,method,start,finish,today,expected,note]) => {
  const actual = calcPct({plannedStart:start, plannedFinish:finish}, today);
  const pass = expected === null ? true : Math.abs(actual-expected)<0.0001;
  return {id,method,start,finish,today,expected: expected===null ? 'EXCLUDED' : +(expected*100).toFixed(2)+'%', actual:+(actual*100).toFixed(2)+'%', verdict:pass?'PASS':'FAIL', note};
});

// Real-world scenarios
const baselineC = { project:{dataDate:'2026-02-15'}, activities:[
  {actId:'A1', plannedStart:'2026-01-01', plannedFinish:'2026-02-01', plannedNonLaborCost:1000, type:'Task Dependent', status:'Not Started'},
  {actId:'A2', plannedStart:'2026-02-01', plannedFinish:'2026-03-01', plannedNonLaborCost:1000, type:'Task Dependent', status:'Not Started'},
  {actId:'A3', plannedStart:'2026-03-01', plannedFinish:'2026-04-01', plannedNonLaborCost:1000, type:'Task Dependent', status:'Not Started'},
  {actId:'D1', plannedStart:'2026-01-01', plannedFinish:'2026-04-01', plannedNonLaborCost:500, type:'Task Dependent', status:'Not Started'},
  {actId:'LOE1', plannedStart:'2026-01-01', plannedFinish:'2026-04-01', plannedNonLaborCost:200, type:'TT_LOE', status:'Not Started'},
]};
const progressC = { project:{dataDate:'2026-02-15'}, activities:[
  {actId:'A1', plannedStart:'2026-01-01', plannedFinish:'2026-02-01', plannedNonLaborCost:2000, actualNonLaborCost:900, type:'Task Dependent', status:'Completed', pctType:'Physical', physicalPct:100},
  {actId:'A2', plannedStart:'2026-02-01', plannedFinish:'2026-03-01', plannedNonLaborCost:2000, actualNonLaborCost:500, type:'Task Dependent', status:'In Progress', pctType:'Physical', physicalPct:0},
  {actId:'A3', plannedStart:'2026-03-01', plannedFinish:'2026-04-01', plannedNonLaborCost:2000, actualNonLaborCost:0, type:'Task Dependent', status:'Not Started', pctType:'Physical', physicalPct:0},
  // D1 deleted from progress
  {actId:'N1', plannedStart:'2026-02-01', plannedFinish:'2026-03-01', plannedNonLaborCost:3000, actualNonLaborCost:700, type:'Task Dependent', status:'In Progress', pctType:'Physical', physicalPct:50},
  {actId:'LOE1', plannedStart:'2026-01-01', plannedFinish:'2026-04-01', plannedNonLaborCost:200, actualNonLaborCost:100, type:'TT_LOE', status:'In Progress', pctType:'Physical', physicalPct:50},
]};
const scenarioC = analyzeCore(baselineC, progressC);

const baselineD = { project:{dataDate:'2026-02-15'}, activities:[
  {actId:'A1', plannedStart:'2026-01-01', plannedFinish:'2026-02-01', plannedNonLaborCost:1000, type:'Task Dependent'},
  {actId:'A2', plannedStart:'2026-02-01', plannedFinish:'2026-03-01', plannedNonLaborCost:1000, type:'Task Dependent'},
  {actId:'A3', plannedStart:'2026-03-01', plannedFinish:'2026-04-01', plannedNonLaborCost:1000, type:'Task Dependent'},
]};
const progressD = { project:{dataDate:'2026-02-15'}, activities:[
  {actId:'A1', plannedStart:'2026-01-01', plannedFinish:'2026-02-01', plannedNonLaborCost:1000, actualNonLaborCost:1000, type:'Task Dependent', status:'Completed', pctType:'Physical', physicalPct:100},
  {actId:'A2', plannedStart:'2026-02-01', plannedFinish:'2026-03-01', plannedNonLaborCost:1000, actualNonLaborCost:0, type:'Task Dependent', status:'In Progress', pctType:'Physical', physicalPct:0},
  {actId:'A3', plannedStart:'2026-03-01', plannedFinish:'2026-04-01', plannedNonLaborCost:1000, actualNonLaborCost:0, type:'Task Dependent', status:'Not Started', pctType:'Physical', physicalPct:0},
]};
const scenarioD = analyzeCore(baselineD, progressD);

const scenarios = [
  {id:'A', name:'NG SA Substation mixed calendars + LOE', verdict:'PARTIAL/FAIL', details:'Calendar parsing exists and LOE helper exists, but plannedPct is calendar-linear and summary totals do not use evmFiltered for TT_LOE.'},
  {id:'B', name:'Transmission line mixed pctType', verdict:'PARTIAL', details:'pctType branch works for Physical/Duration/Units, but no quantity/units time-phased planned calculation and no milestone-weighted actual method.'},
  {id:'C', name:'Schedule update scope change', verdict:'FAIL for totals', codeTotals:scenarioC.codeTotals, patchedTotals:scenarioC.patchedTotals, details:'Rows union works; deleted retained. But code summary includes unbaselined N1 and TT_LOE in totals; patched baseline-only filtered totals are lower.'},
  {id:'D', name:'Curve distortion test', verdict:'FAIL for S-Curve H-04', codeTotals:scenarioD.codeTotals, patchedTotals:scenarioD.patchedTotals, details:'PV/EV row totals are directionally correct; current S-curve earned mirrors planned via earnedRatio rather than actual time-phased EV.'},
  {id:'E', name:'Calendar edge cases', verdict:'PARTIAL/FAIL', details:'HoursPerDay is parsed for duration conversion, holidays are audited, but plannedPct does not consume workWeek/holidays/exception calendars.'}
];

const out = { actualResults, plannedResults, scenarios };
fs.writeFileSync(path.join(__dirname, 'round9_2_formula_audit_results.json'), JSON.stringify(out, null, 2));
console.log('Round 9.2 custom formula audit');
console.log(`Actual % cases: ${actualResults.filter(x=>x.verdict==='PASS').length}/${actualResults.length} match expected-current-behavior`);
console.log(`Planned % best-practice cases: ${plannedResults.filter(x=>x.verdict==='PASS').length}/${plannedResults.length} pass`);
console.log('Scenario C code totals:', JSON.stringify(scenarioC.codeTotals));
console.log('Scenario C patched totals:', JSON.stringify(scenarioC.patchedTotals));
console.log('Scenario D code totals:', JSON.stringify(scenarioD.codeTotals));
console.log('Wrote round9_2_formula_audit_results.json');
