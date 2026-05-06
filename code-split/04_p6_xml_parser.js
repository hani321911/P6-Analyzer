// ════════════════════════════════════════════════════════════════════
// 04_p6_xml_parser.js — v29.0.11 (Phase 1 + 2 implemented)
// Lines 3501 - 6130 of 19935 total
// parseP6XML + HoursPerDay logic
// 
// ⚠️ This file is a slice for code review purposes.
// The source of truth is p6-analyzer.html.
// Auto-generated on update of p6-analyzer.html.
// ════════════════════════════════════════════════════════════════════

    palette: { from: "#1e40af", to: "#1e3a8a", accent: "#60a5fa", glow: "#1e40af40" },
    patterns: [
      /\bcyber[\s-]?security\b/i,
      /\bIT\s+security\s+(?:project|upgrade|implementation)/i,
      /\bOT\s+security\b/i,
      /\bSCADA\s+security\b/i,
      /\bICS\s+security\b/i,
      /\bsecurity\s+(?:hardening|infrastructure|architecture)\b/i,
      /\bIEC\s+62443\b/i,
      /\bNERC\s+CIP\b/i,
      /\bfirewall\s+(?:upgrade|deployment)\b/i,
      /\bcyber\s+(?:defense|protection)\b/i
    ]
  },
  {
    key: "asset_replacement",
    icon: "\u{1F504}",
    name_en: "Asset Replacement (SS/UG/TL)",
    name_ar: "\u0625\u062D\u0644\u0627\u0644 \u0627\u0644\u0623\u0635\u0648\u0644",
    palette: { from: "#ea580c", to: "#f59e0b", accent: "#fef3c7", glow: "#ea580c40" },
    patterns: [
      /\basset\s+replacement\b/i,
      /\b(?:transformer|breaker|switchgear)\s+replacement\b/i,
      /\bequipment\s+replacement\s+(?:project|program)/i,
      /\b(?:major\s+)?refurbishment\s+project/i,
      /\b(?:end[\s-]?of[\s-]?life|EOL)\s+replacement\b/i,
      /\brehabilitation\s+(?:project|works)\b/i,
      /\bre[\s-]?powering\s+project\b/i,
      /\bobsolescence\s+(?:replacement|project)/i,
      /\baging\s+(?:asset|equipment)\s+replacement\b/i
    ]
  },
  {
    key: "drpc_svc",
    icon: "\u{1F39B}\uFE0F",
    name_en: "Dynamic Reactive Power Comp / SVC",
    name_ar: "\u0623\u0646\u0638\u0645\u0629 \u062A\u0639\u0648\u064A\u0636 \u0627\u0644\u0642\u062F\u0631\u0629",
    palette: { from: "#9333ea", to: "#7c3aed", accent: "#e9d5ff", glow: "#9333ea40" },
    patterns: [
      /\bSVC\b/i,
      /\bstatic\s+VAR\s+compensator\b/i,
      /\bDRPC\b/i,
      /\bdynamic\s+reactive\s+power\s+compensation\b/i,
      /\b(?:STATCOM|STATic\s+synchronous\s+COMpensator)\b/i,
      /\bsynchronous\s+condenser\s+(?:project|installation)/i,
      /\b(?:reactive\s+power|VAR)\s+compensation\s+(?:project|system)/i,
      /\bFACTS\s+(?:device|project|system)/i
    ]
  },
  {
    key: "purchase_order",
    icon: "\u{1F4E6}",
    name_en: "Purchase Order (Equipment Supply)",
    name_ar: "\u0623\u0645\u0631 \u0634\u0631\u0627\u0621",
    palette: { from: "#a16207", to: "#ca8a04", accent: "#fef3c7", glow: "#a1620740" },
    patterns: [
      /\bsupply\s+only\s+(?:contract|project)/i,
      /\bequipment\s+supply\s+(?:contract|order)/i,
      /\bmaterial\s+supply\s+only/i,
      /\bPO\s+only\s+(?:contract|project)/i,
      /\bgoods\s+supply\s+contract/i,
      /\b(?:framework|blanket)\s+(?:order|contract)/i
    ]
  },
  // ── SUBSTATION (LAST — most generic, mentioned in many other project types) ──
  {
    key: "substation",
    icon: "\u26A1",
    name_en: "Electrical Substation",
    name_ar: "\u0645\u062D\u0637\u0629 \u062A\u062D\u0648\u064A\u0644 \u0643\u0647\u0631\u0628\u0627\u0621",
    palette: { from: "#0ea5e9", to: "#6366f1", accent: "#facc15", glow: "#0ea5e940" },
    patterns: [
      /\bsubstation\b/i,
      /\bBSP\b/i,
      /\bGIS\b/i,
      /\bswitchyard\b/i,
      /\b(?:S\/S|S\.S)\b/i,
      /\bbulk\s+supply\s+point\b/i,
      /\d+\/\d+(?:\.\d+)?\s*kV/i
    ]
  }
];
const KEY_MILESTONE_PATTERNS = [
  // ── Project end / acceptance (top priority) ──
  {
    key: "fac",
    priority: 100,
    icon: "\u{1F3C6}",
    label_en: "Final Acceptance Certificate (FAC)",
    label_ar: "\u0634\u0647\u0627\u062F\u0629 \u0627\u0644\u0642\u0628\u0648\u0644 \u0627\u0644\u0646\u0647\u0627\u0626\u064A (FAC)",
    pattern: /\b(?:FAC|final\s+acceptance)\b/i
  },
  {
    key: "cod",
    priority: 95,
    icon: "\u{1F680}",
    label_en: "Commercial Operation (COD)",
    label_ar: "\u0627\u0644\u062A\u0634\u063A\u064A\u0644 \u0627\u0644\u062A\u062C\u0627\u0631\u064A (COD)",
    pattern: /\b(?:COD|commercial\s+operation|ICOD)\b/i
  },
  {
    key: "pac",
    priority: 90,
    icon: "\u{1F947}",
    label_en: "Preliminary Acceptance Certificate (PAC)",
    label_ar: "\u0634\u0647\u0627\u062F\u0629 \u0627\u0644\u0642\u0628\u0648\u0644 \u0627\u0644\u0627\u0628\u062A\u062F\u0627\u0626\u064A (PAC)",
    pattern: /\b(?:PAC|provisional\s+acceptance|preliminary\s+acceptance)\b/i
  },
  {
    key: "pto",
    priority: 88,
    icon: "\u2705",
    label_en: "Permit to Operate (PTO)",
    label_ar: "\u062A\u0635\u0631\u064A\u062D \u0627\u0644\u062A\u0634\u063A\u064A\u0644 (PTO)",
    pattern: /\bPTO\b|\bpermit[\s-]to[\s-]operate\b/i
  },
  {
    key: "taking_over",
    priority: 87,
    icon: "\u{1F4CB}",
    label_en: "Taking Over",
    label_ar: "\u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645",
    pattern: /\btaking[\s-]?over\b/i
  },
  {
    key: "energization",
    priority: 85,
    icon: "\u26A1",
    label_en: "Energization",
    label_ar: "\u0627\u0644\u0625\u0634\u0639\u0627\u0644 \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064A",
    pattern: /\benergi[sz]ation\b|\benergi[sz]ed\b|\benergi[sz]ing\b|\benergi[sz]ation\s+permit\b/i
  },
  {
    key: "tcc",
    priority: 80,
    icon: "\u{1F948}",
    label_en: "Technical Completion Certificate (TCC)",
    label_ar: "\u0634\u0647\u0627\u062F\u0629 \u0627\u0644\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0641\u0646\u064A (TCC)",
    pattern: /\b(?:TCC|technical\s+completion)\b/i
  },
  {
    key: "reliability_run",
    priority: 78,
    icon: "\u{1F9EA}",
    label_en: "Reliability Test Run",
    label_ar: "\u0627\u062e\u062a\u0628\u0627\u0631 \u0627\u0644\u0645\u0648\u062b\u0648\u0642\u064a\u0629",
    pattern: /\breliability\s+(?:run|test|RTR)\b/i
  },
  {
    key: "first_sync",
    priority: 75,
    icon: "\u26A1",
    label_en: "Synchronization",
    label_ar: "\u0627\u0644\u062A\u0632\u0627\u0645\u0646 \u0645\u0639 \u0627\u0644\u0634\u0628\u0643\u0629",
    pattern: /\bfirst\s+sync(?:hroniza|hronisa)tion\b|\bsynchroniz(?:ation|ed)\b|\bsynchronis(?:ation|ed)\b/i
  },
  {
    key: "project_finish",
    priority: 75,
    icon: "\u{1F3AF}",
    label_en: "Project Finish",
    label_ar: "\u0625\u0646\u0647\u0627\u0621 \u0627\u0644\u0645\u0634\u0631\u0648\u0639",
    pattern: /\bproject\s+finish\b|\bproject\s+(?:end|complete|completion)\b/i
  },
  {
    key: "first_water",
    priority: 75,
    icon: "\u{1F4A7}",
    label_en: "First Water Production",
    label_ar: "\u0623\u0648\u0644 \u0625\u0646\u062A\u0627\u062C \u0645\u0627\u0621",
    pattern: /\bfirst\s+water\b|\bwater\s+production\s+start\b/i
  },
  {
    key: "first_fire",
    priority: 70,
    icon: "\u{1F525}",
    label_en: "First Fire",
    label_ar: "\u0623\u0648\u0644 \u0625\u0634\u0639\u0627\u0644",
    pattern: /\bfirst[\s-]?fire\b|\bfirst[\s-]?firing\b/i
  },
  {
    key: "fuel_in",
    priority: 65,
    icon: "\u26FD",
    label_en: "Fuel/Gas In",
    label_ar: "\u062F\u062E\u0648\u0644 \u0627\u0644\u0648\u0642\u0648\u062F/\u0627\u0644\u063A\u0627\u0632",
    pattern: /\bfuel[\s-]?in\b|\bgas[\s-]?in\b/i
  },
  {
    key: "commissioning_finish",
    priority: 65,
    icon: "\u2705",
    label_en: "Commissioning Complete",
    label_ar: "\u0625\u0646\u0647\u0627\u0621 \u0627\u0644\u062A\u0634\u063A\u064A\u0644 \u0627\u0644\u062A\u062C\u0631\u064A\u0628\u064A",
    pattern: /\bcommissioning\s+(?:complete|finish|completion)\b|\bcompletion\s+of\s+(?:T\s*&?\s*C|commissioning)\b/i
  },
  {
    key: "mech_complete",
    priority: 60,
    icon: "\u{1F527}",
    label_en: "Mechanical Completion",
    label_ar: "\u0627\u0644\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0645\u064A\u0643\u0627\u0646\u064A\u0643\u064A",
    pattern: /\bmechanical\s+completion\b/i
  },
  {
    key: "soak_test",
    priority: 55,
    icon: "\u{1F9EA}",
    label_en: "Soak Test",
    label_ar: "\u0627\u062E\u062A\u0628\u0627\u0631 \u0627\u0644\u062A\u062D\u0645\u064A\u0644",
    pattern: /\bsoak\s+test\b/i
  },
  {
    key: "back_charge",
    priority: 50,
    icon: "\u{1F504}",
    label_en: "Back Charging",
    label_ar: "\u0627\u0644\u0634\u062D\u0646 \u0627\u0644\u0639\u0643\u0633\u064A",
    pattern: /\bback[\s-]?charg(?:e|ing)\b/i
  },
  {
    key: "hydrotest",
    priority: 50,
    icon: "\u{1F4A6}",
    label_en: "Hydrotest",
    label_ar: "\u0627\u062E\u062A\u0628\u0627\u0631 \u0636\u063A\u0637 \u0627\u0644\u0645\u0627\u0621",
    pattern: /\bhydro[\s-]?test\b|\bhydrostatic\s+test\b/i
  },
  {
    key: "pigging",
    priority: 45,
    icon: "\u{1F504}",
    label_en: "Pigging",
    label_ar: "\u0627\u0644\u062A\u0646\u0638\u064A\u0641 \u0627\u0644\u062F\u0627\u062E\u0644\u064A",
    pattern: /\bpigging\b/i
  },
  {
    key: "commissioning_start",
    priority: 40,
    icon: "\u25B6\uFE0F",
    label_en: "Commissioning Start",
    label_ar: "\u0628\u062F\u0621 \u0627\u0644\u062A\u0634\u063A\u064A\u0644 \u0627\u0644\u062A\u062C\u0631\u064A\u0628\u064A",
    pattern: /\b(?:testing\s*&?\s*commissioning|T\s*&?\s*C)\s+(?:start|begin)\b/i
  },
  {
    key: "construction_finish",
    priority: 35,
    icon: "\u{1F3D7}\uFE0F",
    label_en: "Construction Complete",
    label_ar: "\u0625\u0646\u0647\u0627\u0621 \u0627\u0644\u0625\u0646\u0634\u0627\u0621",
    pattern: /\bconstruction\s+(?:finish|complete|completion)\b/i
  },
  {
    key: "construction_start",
    priority: 25,
    icon: "\u{1F3D7}\uFE0F",
    label_en: "Construction Start",
    label_ar: "\u0628\u062F\u0621 \u0627\u0644\u0625\u0646\u0634\u0627\u0621",
    pattern: /\bconstruction\s+start\b/i
  },
  {
    key: "project_start",
    priority: 20,
    icon: "\u{1F3C1}",
    label_en: "Project Start / NTP",
    label_ar: "\u0628\u062F\u0621 \u0627\u0644\u0645\u0634\u0631\u0648\u0639",
    pattern: /\bproject\s+start\b|\beffective\s+date\s+of\s+contract\b|\bnotice\s+to\s+proceed\b|\bNTP\b|\bLNTP\b|\bkick[\s-]?off\b/i
  }
];
function detectProjectType(projectName, wbsNames, topActivityNames) {
  const NAME_WEIGHT = 5;
  const WBS_WEIGHT = 1;
  const ACTIVITY_WEIGHT = 1;
  const nameText = projectName || "";
  const wbsText = (wbsNames || []).join(" ");
  const actText = (topActivityNames || []).join(" ");
  const scores = [];
  for (let i = 0; i < PROJECT_TYPE_RULES.length; i++) {
    const rule = PROJECT_TYPE_RULES[i];
    let score = 0;
    let nameHit = false;
    let wbsHits = 0, actHits = 0;
    for (const p of rule.patterns) {
      const inName = nameText.match(p);
      const inWbs = wbsText.match(p);
      const inAct = actText.match(p);
      if (inName) {
        score += inName.length * NAME_WEIGHT;
        nameHit = true;
      }
      if (inWbs) { score += inWbs.length * WBS_WEIGHT; wbsHits += inWbs.length; }
      if (inAct) { score += inAct.length * ACTIVITY_WEIGHT; actHits += inAct.length; }
    }
    if (score > 0) scores.push({ rule, score, nameHit, ruleIndex: i, wbsHits, actHits });
  }
  if (scores.length === 0) return null;

  // ── v28.9: STRICT FILTERING ──
  // If ANY rule has a nameHit, only keep nameHit rules (eliminate weak WBS-only matches)
  const hasAnyNameHit = scores.some(s => s.nameHit);
  let filtered = hasAnyNameHit ? scores.filter(s => s.nameHit) : scores;

  // If no name hits, require strong WBS/activity evidence (at least 3 occurrences total)
  // This prevents single weak matches like "fire" appearing in one activity from winning
  if (!hasAnyNameHit) {
    filtered = scores.filter(s => (s.wbsHits + s.actHits) >= 3);
    if (filtered.length === 0) return null;
  }

  filtered.sort((a, b) => {
    const aHit = a.nameHit ? 1 : 0;
    const bHit = b.nameHit ? 1 : 0;
    if (aHit !== bHit) return bHit - aHit;
    // For nameHit ties, prefer higher score (not lower index)
    if (b.score !== a.score) return b.score - a.score;
    if (aHit && a.ruleIndex !== b.ruleIndex) return a.ruleIndex - b.ruleIndex;
    return b.score - a.score;
  });
  return filtered[0];
}
function findKeyMilestones(activities, refMap, progressMap) {
  const grouped = {};
  for (const a of activities) {
    const name = a.name || "";
    if (!name) continue;
    const isMs = a.isMilestone || a.type && a.type.includes("Milestone");
    for (const p of KEY_MILESTONE_PATTERNS) {
      if (!p.pattern.test(name)) continue;
      if (!isMs && (p.priority < 70 || name.length > 80)) break;
      if (!grouped[p.key]) {
        grouped[p.key] = {
          categoryKey: p.key,
          priority: p.priority,
          icon: p.icon,
          label_en: p.label_en,
          label_ar: p.label_ar,
          activities: []
        };
      }
      const refAct = refMap == null ? void 0 : refMap[a.actId];
      const prAct = progressMap == null ? void 0 : progressMap[a.actId];
      const blDate = (refAct == null ? void 0 : refAct.plannedFinish) || a.plannedFinish;
      const acDate = (prAct == null ? void 0 : prAct.actualFinish) || a.actualFinish;
      const fcDate = (prAct == null ? void 0 : prAct.finish) || (prAct == null ? void 0 : prAct.remainFinish) || (prAct == null ? void 0 : prAct.plannedFinish) || a.plannedFinish;
      grouped[p.key].activities.push({
        actId: a.actId,
        name,
        isMilestone: isMs,
        plannedFinish: blDate,
        actualFinish: acDate,
        forecastFinish: fcDate
      });
      break;
    }
  }
  for (const k of Object.keys(grouped)) {
    grouped[k].activities.sort((a, b) => (a.plannedFinish || "").localeCompare(b.plannedFinish || ""));
  }
  return Object.values(grouped).sort((a, b) => b.priority - a.priority);
}
function runDCMAHealthCheck(activities, dataDate, relationships) {
  const acts = (activities || []).filter((a) => !a.isSummary);
  const total = acts.length;
  if (total === 0) return { tests: [], passedCount: 0, totalTests: 0, score: 0 };
  const incomplete = acts.filter((a) => a.status !== "Completed");
  const incCount = incomplete.length || 1;
  const dd = dataDate ? new Date(dataDate) : null;
  const tests = [];
  const safeDate = (s) => {
    try {
      return s ? new Date(s) : null;
    } catch (e) {
      return null;
    }
  };
  const sample = (arr) => arr.slice(0, 50).map((a) => ({ actId: a.actId, name: a.name }));
  const negFloat = incomplete.filter((a) => !isNaN(a.totalFloat) && a.totalFloat < 0);
  tests.push({
    id: "negFloat",
    label_en: "Negative Float",
    label_ar: "Float \u0633\u0627\u0644\u0628",
    desc_en: "Activities with TF < 0 (cannot meet plan)",
    desc_ar: "\u0623\u0646\u0634\u0637\u0629 \u0628\u0640 Float \u0633\u0627\u0644\u0628 (\u0645\u0633\u062A\u062D\u064A\u0644 \u062A\u062D\u0642\u064A\u0642\u0647\u0627)",
    value: negFloat.length,
    valueLabel: `${negFloat.length}`,
    thresholdLabel: "= 0",
    passed: negFloat.length === 0,
    severity: negFloat.length > 10 ? "high" : negFloat.length > 0 ? "medium" : "low",
    count: negFloat.length,
    affectedSample: sample(negFloat)
  });
  const hiFloat = incomplete.filter((a) => !isNaN(a.totalFloat) && a.totalFloat > 44);
  const hfPct = hiFloat.length / incCount * 100;
  tests.push({
    id: "hiFloat",
    label_en: "High Float",
    label_ar: "Float \u0639\u0627\u0644\u064A",
    desc_en: "Activities with TF > 44 days (suggest broken logic)",
    desc_ar: "\u0623\u0646\u0634\u0637\u0629 \u0628\u0640 Float \u0623\u0643\u0628\u0631 \u0645\u0646 44 \u064A\u0648\u0645 (\u0645\u0646\u0637\u0642 \u0646\u0627\u0642\u0635)",
    value: hfPct,
    valueLabel: `${hfPct.toFixed(1)}% (${hiFloat.length})`,
    thresholdLabel: "\u2264 5%",
    passed: hfPct <= 5,
    severity: hfPct > 15 ? "high" : hfPct > 5 ? "medium" : "low",
    count: hiFloat.length,
    affectedSample: sample(hiFloat)
  });
  const hiDur = incomplete.filter(
    (a) => !a.isMilestone && (a.atCompletionDuration > 44 || a.remainingDuration > 44)
  );
  const hdPct = hiDur.length / incCount * 100;
  tests.push({
    id: "hiDur",
    label_en: "High Duration",
    label_ar: "\u0645\u062F\u0629 \u0637\u0648\u064A\u0644\u0629",
    desc_en: "Activities with duration > 44 days (should be split)",
    desc_ar: "\u0623\u0646\u0634\u0637\u0629 \u0628\u0645\u062F\u0629 \u0623\u0643\u0628\u0631 \u0645\u0646 44 \u064A\u0648\u0645 (\u064A\u062C\u0628 \u062A\u0642\u0633\u064A\u0645\u0647\u0627)",
    value: hdPct,
    valueLabel: `${hdPct.toFixed(1)}% (${hiDur.length})`,
    thresholdLabel: "\u2264 5%",
    passed: hdPct <= 5,
    severity: hdPct > 15 ? "high" : hdPct > 5 ? "medium" : "low",
    count: hiDur.length,
    affectedSample: sample(hiDur)
  });
  const hardC = incomplete.filter(
    (a) => (a.primaryConstraintType || "").includes("Mandatory")
  );
  const hcPct = hardC.length / incCount * 100;
  tests.push({
    id: "hardConstr",
    label_en: "Hard Constraints",
    label_ar: "\u0642\u064A\u0648\u062F \u0635\u0627\u0631\u0645\u0629",
    desc_en: "Mandatory constraints break CPM logic",
    desc_ar: "\u0642\u064A\u0648\u062F \u0625\u062C\u0628\u0627\u0631\u064A\u0629 \u062A\u0643\u0633\u0631 \u0645\u0646\u0637\u0642 \u0627\u0644\u0645\u0633\u0627\u0631 \u0627\u0644\u062D\u0631\u062C",
    value: hcPct,
    valueLabel: `${hcPct.toFixed(1)}% (${hardC.length})`,
    thresholdLabel: "\u2264 5%",
    passed: hcPct <= 5,
    severity: hcPct > 15 ? "high" : hcPct > 5 ? "medium" : "low",
    count: hardC.length,
    affectedSample: sample(hardC)
  });
  if (dd) {
    const invalid = acts.filter((a) => {
      const af = safeDate(a.actualFinish), as = safeDate(a.actualStart);
      return af && af > dd || as && as > dd;
    });
    tests.push({
      id: "invalidDates",
      label_en: "Invalid Dates",
      label_ar: "\u062A\u0648\u0627\u0631\u064A\u062E \u063A\u064A\u0631 \u0635\u0627\u0644\u062D\u0629",
      desc_en: "Actual dates after the data date (logically impossible)",
      desc_ar: "\u062A\u0648\u0627\u0631\u064A\u062E \u0641\u0639\u0644\u064A\u0629 \u0628\u0639\u062F \u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A (\u0645\u0633\u062A\u062D\u064A\u0644 \u0645\u0646\u0637\u0642\u064A\u0627\u064B)",
      value: invalid.length,
      valueLabel: `${invalid.length}`,
      thresholdLabel: "= 0",
      passed: invalid.length === 0,
      severity: invalid.length > 10 ? "high" : invalid.length > 0 ? "medium" : "low",
      count: invalid.length,
      affectedSample: sample(invalid)
    });
  } else {
    tests.push({
      id: "invalidDates",
      label_en: "Invalid Dates",
      label_ar: "\u062A\u0648\u0627\u0631\u064A\u062E \u063A\u064A\u0631 \u0635\u0627\u0644\u062D\u0629",
      desc_en: "Cannot check (no data date)",
      desc_ar: "\u063A\u064A\u0631 \u0642\u0627\u0628\u0644 \u0644\u0644\u0641\u062D\u0635 (\u0644\u0627 \u064A\u0648\u062C\u062F data date)",
      value: 0,
      valueLabel: "\u2014",
      thresholdLabel: "= 0",
      passed: true,
      severity: "low",
      count: 0,
      affectedSample: []
    });
  }
  if (dd) {
    const missed = incomplete.filter((a) => {
      const pf = safeDate(a.plannedFinish);
      return pf && pf < dd;
    });
    const missedPct = missed.length / incCount * 100;
    tests.push({
      id: "missed",
      label_en: "Missed Tasks",
      label_ar: "\u0645\u0647\u0627\u0645 \u0641\u0627\u0626\u062A\u0629",
      desc_en: "Incomplete tasks past their planned finish",
      desc_ar: "\u0623\u0646\u0634\u0637\u0629 \u0644\u0645 \u062A\u0646\u062C\u0632 \u0631\u063A\u0645 \u0627\u0646\u0642\u0636\u0627\u0621 \u062A\u0627\u0631\u064A\u062E \u0646\u0647\u0627\u064A\u062A\u0647\u0627",
      value: missedPct,
      valueLabel: `${missedPct.toFixed(1)}% (${missed.length})`,
      thresholdLabel: "\u2264 5%",
      passed: missedPct <= 5,
      severity: missedPct > 15 ? "high" : missedPct > 5 ? "medium" : "low",
      count: missed.length,
      affectedSample: sample(missed)
    });
  } else {
    tests.push({
      id: "missed",
      label_en: "Missed Tasks",
      label_ar: "\u0645\u0647\u0627\u0645 \u0641\u0627\u0626\u062A\u0629",
      desc_en: "Cannot check (no data date)",
      desc_ar: "\u063A\u064A\u0631 \u0642\u0627\u0628\u0644 \u0644\u0644\u0641\u062D\u0635",
      value: 0,
      valueLabel: "\u2014",
      thresholdLabel: "\u2264 5%",
      passed: true,
      severity: "low",
      count: 0,
      affectedSample: []
    });
  }
  const critical = incomplete.filter((a) => !isNaN(a.totalFloat) && a.totalFloat <= 0);
  const critPct = critical.length / incCount * 100;
  let critDescEn, critDescAr;
  if (critPct === 0) {
    critDescEn = "0% \u2014 likely no float computed. Re-schedule the project in P6.";
    critDescAr = "0% \u2014 \u0639\u0644\u0649 \u0627\u0644\u0623\u0631\u062C\u062D \u0644\u0645 \u064A\u062A\u0645 \u062D\u0633\u0627\u0628 \u0627\u0644\u0640 Float. \u0623\u0639\u062F \u062C\u062F\u0648\u0644\u0629 \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u0641\u064A P6.";
  } else if (critPct < 5) {
    critDescEn = "Below 5% \u2014 too few critical activities. May indicate broken logic.";
    critDescAr = "\u0623\u0642\u0644 \u0645\u0646 5% \u2014 \u0623\u0646\u0634\u0637\u0629 \u062D\u0631\u062C\u0629 \u0642\u0644\u064A\u0644\u0629 \u062C\u062F\u0627\u064B. \u0642\u062F \u064A\u062F\u0644 \u0639\u0644\u0649 \u0645\u0646\u0637\u0642 \u0646\u0627\u0642\u0635.";
  } else if (critPct > 80) {
    critDescEn = "Very high % \u2014 project is severely delayed. Most activities have negative or zero float.";
    critDescAr = "\u0646\u0633\u0628\u0629 \u0645\u0631\u062A\u0641\u0639\u0629 \u062C\u062F\u0627\u064B \u2014 \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u0645\u062A\u0623\u062E\u0631 \u0628\u0634\u062F\u0629. \u0645\u0639\u0638\u0645 \u0627\u0644\u0623\u0646\u0634\u0637\u0629 \u0628\u0640 Float \u0633\u0627\u0644\u0628 \u0623\u0648 \u0635\u0641\u0631.";
  } else if (critPct > 25) {
    critDescEn = "Above 25% \u2014 project is delayed. Multiple parallel critical paths.";
    critDescAr = "\u0623\u0639\u0644\u0649 \u0645\u0646 25% \u2014 \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u0645\u062A\u0623\u062E\u0631. \u0645\u0633\u0627\u0631\u0627\u062A \u062D\u0631\u062C\u0629 \u0645\u062A\u0648\u0627\u0632\u064A\u0629 \u0645\u062A\u0639\u062F\u062F\u0629.";
  } else {
    critDescEn = "Healthy critical path \u2014 within 5%-25% target range.";
    critDescAr = "\u0645\u0633\u0627\u0631 \u062D\u0631\u062C \u0635\u062D\u064A \u2014 \u0636\u0645\u0646 \u0627\u0644\u0646\u0637\u0627\u0642 \u0627\u0644\u0645\u062B\u0627\u0644\u064A 5%-25%.";
  }
  tests.push({
    id: "critPath",
    label_en: "Critical Path Test",
    label_ar: "\u0627\u062E\u062A\u0628\u0627\u0631 \u0627\u0644\u0645\u0633\u0627\u0631 \u0627\u0644\u062D\u0631\u062C",
    desc_en: critDescEn,
    desc_ar: critDescAr,
    value: critPct,
    valueLabel: `${critPct.toFixed(1)}% (${critical.length})`,
    thresholdLabel: "5% - 25%",
    passed: critPct >= 5 && critPct <= 25,
    severity: critPct < 1 || critPct > 50 ? "high" : critPct > 25 || critPct < 5 ? "medium" : "low",
    count: critical.length,
    // Show the most-critical activities (sorted by lowest float = worst delay)
    affectedSample: critical.slice().sort((a, b) => (a.totalFloat || 0) - (b.totalFloat || 0)).slice(0, 50).map((a) => ({
      actId: a.actId,
      name: a.totalFloat < 0 ? `${a.name} (${a.totalFloat}d delay)` : a.name
    }))
  });
  if (dd) {
    let plannedBy = 0, actualBy = 0;
    for (const a of acts) {
      const pf = safeDate(a.plannedFinish);
      const af = safeDate(a.actualFinish);
      if (pf && pf <= dd) plannedBy++;
      if (af && af <= dd) actualBy++;
    }
    const bei = plannedBy > 0 ? actualBy / plannedBy : 1;
    tests.push({
      id: "bei",
      label_en: "BEI (Baseline Execution Index)",
      label_ar: "\u0645\u0624\u0634\u0631 \u062A\u0646\u0641\u064A\u0630 Baseline",
      desc_en: "BEI \u2265 0.95 indicates on-pace execution",
      desc_ar: "BEI \u2265 0.95 \u064A\u062F\u0644 \u0639\u0644\u0649 \u062A\u0646\u0641\u064A\u0630 \u0645\u0637\u0627\u0628\u0642 \u0644\u0644\u062E\u0637\u0629",
      value: bei,
      valueLabel: bei.toFixed(3),
      thresholdLabel: "\u2265 0.95",
      passed: bei >= 0.95,
      severity: bei < 0.8 ? "high" : bei < 0.95 ? "medium" : "low",
      count: 0,
      affectedSample: []
    });
  } else {
    tests.push({
      id: "bei",
      label_en: "BEI (Baseline Execution Index)",
      label_ar: "\u0645\u0624\u0634\u0631 \u062A\u0646\u0641\u064A\u0630 Baseline",
      desc_en: "Cannot calculate (no data date)",
      desc_ar: "\u063A\u064A\u0631 \u0642\u0627\u0628\u0644 \u0644\u0644\u062D\u0633\u0627\u0628",
      value: 0,
      valueLabel: "\u2014",
      thresholdLabel: "\u2265 0.95",
      passed: true,
      severity: "low",
      count: 0,
      affectedSample: []
    });
  }
  const withResources = incomplete.filter((a) => {
    const cost = (a.plannedLaborCost || 0) + (a.plannedNonLaborCost || 0) + (a.plannedMaterialCost || 0) + (a.plannedExpenseCost || 0);
    const units = (a.plannedLaborUnits || 0) + (a.plannedNonLaborUnits || 0) + (a.plannedMaterialUnits || 0);
    return cost > 0 || units > 0;
  });
  const resPct = withResources.length / incCount * 100;
  // FIX BUG-17: O(n²) → O(n) using Set instead of Array.includes()
  const withResourcesSet = new Set(withResources);
  const withoutResources = incomplete.filter((a) => !withResourcesSet.has(a));
  tests.push({
    id: "resources",
    label_en: "Resources Loaded",
    label_ar: "\u0645\u0648\u0627\u0631\u062F \u0645\u062D\u0645\u064E\u0651\u0644\u0629",
    desc_en: "Activities should have cost/units loaded for EVM",
    desc_ar: "\u0627\u0644\u0623\u0646\u0634\u0637\u0629 \u064A\u062C\u0628 \u0623\u0646 \u062A\u062D\u0645\u0644 \u062A\u0643\u0627\u0644\u064A\u0641/\u0648\u062D\u062F\u0627\u062A \u0644\u062D\u0633\u0627\u0628 EVM",
    value: resPct,
    valueLabel: `${resPct.toFixed(1)}%`,
    thresholdLabel: "\u2265 80%",
    passed: resPct >= 80,
    severity: resPct < 50 ? "high" : resPct < 80 ? "medium" : "low",
    count: withoutResources.length,
    affectedSample: sample(withoutResources)
  });
  const remCriticalDur = critical.reduce((sum, a) => sum + (a.remainingDuration || 0), 0);
  let projectFloat = 0;
  if (critical.length > 0) {
    // FIX PERF-01: avoid spread on potentially large arrays (stack overflow risk)
    projectFloat = critical.reduce((min, a) => {
      const v = a.totalFloat || 0;
      return v < min ? v : min;
    }, Infinity);
    if (projectFloat === Infinity) projectFloat = 0;
  }
  const cpli = remCriticalDur > 0 ? (remCriticalDur + projectFloat) / remCriticalDur : 1;
  let cpliLabel;
  if (critical.length === 0) {
    cpliLabel = "\u2014 (no critical path)";
  } else if (remCriticalDur === 0) {
    cpliLabel = `${cpli.toFixed(3)} (CP=0d \u2014 all milestones)`;
  } else {
    cpliLabel = `${cpli.toFixed(3)} (CP=${remCriticalDur.toFixed(0)}d, PF=${projectFloat}d)`;
  }
  tests.push({
    id: "cpli",
    label_en: "CPLI (Critical Path Length Index)",
    label_ar: "\u0645\u0624\u0634\u0631 \u0637\u0648\u0644 \u0627\u0644\u0645\u0633\u0627\u0631 \u0627\u0644\u062D\u0631\u062C",
    desc_en: "CPLI \u2265 0.95 indicates an achievable plan",
    desc_ar: "CPLI \u2265 0.95 \u064A\u062F\u0644 \u0639\u0644\u0649 \u062E\u0637\u0629 \u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u062A\u062D\u0642\u064A\u0642",
    value: cpli,
    valueLabel: cpliLabel,
    thresholdLabel: "\u2265 0.95",
    // Pass only if we have a real critical path AND CPLI meets threshold
    passed: critical.length > 0 && cpli >= 0.95,
    severity: cpli < 0.85 ? "high" : cpli < 0.95 ? "medium" : "low",
    count: 0,
    affectedSample: []
  });
  if (relationships && Array.isArray(relationships) && relationships.length > 0) {
    const totalRels = relationships.length;
    const predCount = /* @__PURE__ */ new Map();
    const succCount = /* @__PURE__ */ new Map();
    let leadsCount = 0;
    let lagsCount = 0;
    let fsCount = 0;
    for (const r of relationships) {
      const p = r.predId, s = r.succId;
      succCount.set(p, (succCount.get(p) || 0) + 1);
      predCount.set(s, (predCount.get(s) || 0) + 1);
      const lag = parseFloat(r.lag) || 0;
      if (lag < 0) leadsCount++;
      else if (lag > 0) lagsCount++;
      if (r.type === "Finish to Start") fsCount++;
    }
    const missingLogic = incomplete.filter((a) => {
      // FIX BUG-12: predCount/succCount keys are ObjectIds (a.id), not actIds
      const aId = a.id || a.actId;
      if (!aId) return false;
      const preds = predCount.get(aId) || 0;
      const succs = succCount.get(aId) || 0;
      const typeLower = (a.type || "").toLowerCase();
      // Allow project start/finish milestones to have only one side
      if (typeLower.includes("start milestone") && preds === 0 && succs > 0) return false;
      if (typeLower.includes("finish milestone") && succs === 0 && preds > 0) return false;
      return preds === 0 || succs === 0;
    });
    const logicPct = missingLogic.length / incCount * 100;
    tests.push({
      id: "logic",
      label_en: "Logic Completeness",
      label_ar: "\u0627\u0643\u062A\u0645\u0627\u0644 \u0627\u0644\u0645\u0646\u0637\u0642",
      desc_en: "Activities missing predecessor or successor links",
      desc_ar: "\u0623\u0646\u0634\u0637\u0629 \u0628\u062F\u0648\u0646 predecessor \u0623\u0648 successor",
      value: logicPct,
      valueLabel: `${logicPct.toFixed(1)}% (${missingLogic.length})`,
      thresholdLabel: "\u2264 5%",
      passed: logicPct <= 5,
      severity: logicPct > 15 ? "high" : logicPct > 5 ? "medium" : "low",
      count: missingLogic.length,
      affectedSample: sample(missingLogic)
    });
    tests.push({
      id: "leads",
      label_en: "Leads (Negative Lag)",
      label_ar: "Leads (\u062A\u0642\u062F\u0645 \u0633\u0644\u0628\u064A)",
      desc_en: "Negative lags should not exist (bad practice)",
      desc_ar: "\u0639\u0644\u0627\u0642\u0627\u062A \u0628\u0640 lag \u0633\u0627\u0644\u0628 \u064A\u062C\u0628 \u0623\u0644\u0627 \u062A\u0648\u062C\u062F",
      value: leadsCount,
      valueLabel: `${leadsCount}`,
      thresholdLabel: "= 0",
      passed: leadsCount === 0,
      severity: leadsCount > 10 ? "high" : leadsCount > 0 ? "medium" : "low",
      count: leadsCount,
      affectedSample: []
    });
    const lagPct = lagsCount / totalRels * 100;
    tests.push({
      id: "lags",
      label_en: "Lags",
      label_ar: "Lags (\u062A\u0623\u062E\u064A\u0631)",
      desc_en: "Positive lags should be minimal",
      desc_ar: "\u0639\u0644\u0627\u0642\u0627\u062A \u0628\u0640 lag \u0645\u0648\u062C\u0628 \u064A\u062C\u0628 \u0623\u0646 \u062A\u0643\u0648\u0646 \u0642\u0644\u064A\u0644\u0629",
      value: lagPct,
      valueLabel: `${lagPct.toFixed(1)}% (${lagsCount})`,
      thresholdLabel: "\u2264 5%",
      passed: lagPct <= 5,
      severity: lagPct > 15 ? "high" : lagPct > 5 ? "medium" : "low",
      count: lagsCount,
      affectedSample: []
    });
    const fsPct = fsCount / totalRels * 100;
    tests.push({
      id: "relTypes",
      label_en: "Relationship Types",
      label_ar: "\u0623\u0646\u0648\u0627\u0639 \u0627\u0644\u0639\u0644\u0627\u0642\u0627\u062A",
      desc_en: "Finish-to-Start relationships preferred (\u226590%)",
      desc_ar: "\u0639\u0644\u0627\u0642\u0627\u062A Finish-to-Start \u0645\u0641\u0636\u0644\u0629 (\u226590%)",
      value: fsPct,
      valueLabel: `${fsPct.toFixed(1)}% FS`,
      thresholdLabel: "\u2265 90% FS",
      passed: fsPct >= 90,
      severity: fsPct < 70 ? "high" : fsPct < 90 ? "medium" : "low",
      count: 0,
      affectedSample: []
    });
  }
  const passedCount = tests.filter((t) => t.passed).length;
  return {
    tests,
    passedCount,
    totalTests: tests.length,
    score: Math.round(passedCount / tests.length * 100)
  };
}
function analyzeScheduleVariance(baselineActs, progressActs) {
  if (!baselineActs || baselineActs.length === 0) {
    return {
      items: [],
      summary: { hasBaseline: false },
      hasBaseline: false
    };
  }
  if (!progressActs || progressActs.length === 0) {
    return {
      items: [],
      summary: { hasBaseline: true, hasProgress: false },
      hasBaseline: true
    };
  }
  const blMap = /* @__PURE__ */ new Map();
  for (const a of baselineActs) {
    if (a.actId && !a.isSummary) blMap.set(a.actId, a);
  }
  const upMap = /* @__PURE__ */ new Map();
  for (const a of progressActs) {
    if (a.actId && !a.isSummary) upMap.set(a.actId, a);
  }
  const items = [];
  const safeDate = (s) => {
    try {
      return s ? new Date(s) : null;
    } catch (e) {
      return null;
    }
  };
  const dayDiff = (a, b) => {
    if (!a || !b) return null;
    return Math.round((a - b) / 864e5);
  };
  for (const [actId, b] of blMap) {
    const u = upMap.get(actId);
    if (!u) {
      items.push({
        actId,
        name: b.name,
        status: "Deleted",
        category: "deleted",
        baselineFinish: b.plannedFinish,
        currentFinish: null,
        finishVariance: null,
        durationVariance: null,
        baselineCritical: !isNaN(b.totalFloat) && b.totalFloat <= 0,
        currentCritical: false
      });
      continue;
    }
    if (u.status === "Completed") continue;
    const blPF = safeDate(b.plannedFinish);
    const upPF = safeDate(u.finish) || safeDate(u.remainFinish) || safeDate(u.plannedFinish);
    const finishVar = blPF && upPF ? dayDiff(upPF, blPF) : null;
    const durVar = b.plannedDuration && u.atCompletionDuration ? Math.round(u.atCompletionDuration - b.plannedDuration) : null;
    let category;
    if (finishVar === null) category = "unknown";
    else if (finishVar > 0) category = "slipped";
    else if (finishVar < 0) category = "improved";
    else category = "onTrack";
    items.push({
      actId,
      name: u.name || b.name,
      status: u.status,
      category,
      baselineFinish: b.plannedFinish,
      currentFinish: u.finish || u.remainFinish || u.plannedFinish,
      finishVariance: finishVar,
      durationVariance: durVar,
      baselineCritical: !isNaN(b.totalFloat) && b.totalFloat <= 0,
      currentCritical: !isNaN(u.totalFloat) && u.totalFloat <= 0,
      isMilestone: u.isMilestone || b.isMilestone
    });
  }
  for (const [actId, u] of upMap) {
    if (blMap.has(actId)) continue;
    if (u.status === "Completed") continue;
    items.push({
      actId,
      name: u.name,
      status: u.status,
      category: "added",
      baselineFinish: null,
      currentFinish: u.finish || u.remainFinish || u.plannedFinish,
      finishVariance: null,
      durationVariance: null,
      baselineCritical: false,
      currentCritical: !isNaN(u.totalFloat) && u.totalFloat <= 0,
      isMilestone: u.isMilestone
    });
  }
  const slipped = items.filter((i) => i.category === "slipped");
  const improved = items.filter((i) => i.category === "improved");
  const onTrack = items.filter((i) => i.category === "onTrack");
  const added = items.filter((i) => i.category === "added");
  const deleted = items.filter((i) => i.category === "deleted");
  const criticalSlipped = slipped.filter((i) => i.currentCritical);
  const avgSlip = slipped.length > 0 ? Math.round(slipped.reduce((s, i) => s + i.finishVariance, 0) / slipped.length) : 0;
  // FIX PERF-01: avoid spread on large arrays
  const worstSlip = slipped.reduce((max, i) => i.finishVariance > max ? i.finishVariance : max, 0);
  const bestImprovement = improved.reduce((min, i) => i.finishVariance < min ? i.finishVariance : min, 0);
  return {
    items,
    summary: {
      hasBaseline: true,
      hasProgress: true,
      total: items.length,
      slipped: slipped.length,
      improved: improved.length,
      onTrack: onTrack.length,
      added: added.length,
      deleted: deleted.length,
      criticalSlipped: criticalSlipped.length,
      avgSlip,
      worstSlip,
      bestImprovement
    },
    hasBaseline: true
  };
}
function buildResourceHistogram(activities, metric, bucketSize) {
  const acts = (activities || []).filter((a) => !a.isSummary);
  if (acts.length === 0) return { buckets: [], peakValue: 0, totalSum: 0, metric, bucketSize };
  let minDate = null, maxDate = null;
  for (const a of acts) {
    const ps = a.plannedStart ? new Date(a.plannedStart) : null;
    const pf = a.plannedFinish ? new Date(a.plannedFinish) : null;
    if (ps && !isNaN(ps)) {
      if (!minDate || ps < minDate) minDate = ps;
    }
    if (pf && !isNaN(pf)) {
      if (!maxDate || pf > maxDate) maxDate = pf;
    }
  }
  if (!minDate || !maxDate) return { buckets: [], peakValue: 0, totalSum: 0, metric, bucketSize };
  const getValue = (a) => {
    if (metric === "laborUnits") return a.plannedLaborUnits || 0;
    if (metric === "nonLaborUnits") return a.plannedNonLaborUnits || 0;
    if (metric === "totalUnits")
      return (a.plannedLaborUnits || 0) + (a.plannedNonLaborUnits || 0) + (a.plannedMaterialUnits || 0);
    if (metric === "cost")
      return (a.plannedLaborCost || 0) + (a.plannedNonLaborCost || 0) + (a.plannedMaterialCost || 0) + (a.plannedExpenseCost || 0);
    return 0;
  };
  const buckets = [];
  const bucketIndex = /* @__PURE__ */ new Map();
  if (bucketSize === "month") {
    let cursor = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    const end = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
    while (cursor <= end) {
      const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
      const label = cursor.toLocaleDateString("en-US", { year: "numeric", month: "short" });
      bucketIndex.set(key, buckets.length);
      buckets.push({ key, label, total: 0, startDate: new Date(cursor) });
      cursor.setMonth(cursor.getMonth() + 1);
    }
  } else {
    const startWeek = new Date(minDate);
    startWeek.setDate(startWeek.getDate() - startWeek.getDay());
    let cursor = new Date(startWeek);
    while (cursor <= maxDate) {
      const key = `${cursor.getFullYear()}-W${Math.ceil((cursor - new Date(cursor.getFullYear(), 0, 1)) / (7 * 864e5))}`;
      const label = cursor.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      bucketIndex.set(key, buckets.length);
      buckets.push({ key, label, total: 0, startDate: new Date(cursor) });
      cursor.setDate(cursor.getDate() + 7);
    }
  }
  for (const a of acts) {
    const value = getValue(a);
    if (value === 0) continue;
    const ps = a.plannedStart ? new Date(a.plannedStart) : null;
    const pf = a.plannedFinish ? new Date(a.plannedFinish) : null;
    if (!ps || !pf || isNaN(ps) || isNaN(pf)) continue;
    const totalDays = Math.max(1, Math.round((pf - ps) / 864e5) + 1);
    const dailyValue = value / totalDays;
    const day = new Date(ps);
    for (let i = 0; i < totalDays; i++) {
      let key;
      if (bucketSize === "month") {
        key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}`;
      } else {
        key = `${day.getFullYear()}-W${Math.ceil((day - new Date(day.getFullYear(), 0, 1)) / (7 * 864e5))}`;
      }
      const idx = bucketIndex.get(key);
      if (idx !== void 0) buckets[idx].total += dailyValue;
      day.setDate(day.getDate() + 1);
    }
  }
  const peakValue = buckets.reduce((m, b) => Math.max(m, b.total), 0);
  const totalSum = buckets.reduce((s, b) => s + b.total, 0);
  const peakThreshold = peakValue * 0.9;
  for (const b of buckets) b.isPeak = b.total >= peakThreshold && b.total > 0;
  return { buckets, peakValue, totalSum, metric, bucketSize };
}
const CLUSTER_STOP_WORDS = /* @__PURE__ */ new Set([
  // English common
  "and",
  "of",
  "the",
  "a",
  "an",
  "to",
  "for",
  "in",
  "on",
  "at",
  "by",
  "with",
  "from",
  "as",
  "is",
  "be",
  "or",
  "all",
  "between",
  "within",
  "its",
  "this",
  "that",
  "these",
  "those",
  "various",
  "related",
  "other",
  "any",
  "each",
  "ex",
  "not",
  "only",
  "new",
  // Generic/non-distinctive
  "phase",
  "stage",
  "step",
  "task",
  "sub",
  "main",
  "over",
  "under",
  "before",
  "after",
  "above",
  "below",
  "while",
  "into",
  "onto",
  "upon",
  "general",
  "specific",
  // P6/scheduling-specific
  "activity",
  "activities",
  "start",
  "finish",
  "date",
  "item",
  "items",
  "point",
  "points",
  // Non-meaningful fragments often appearing in P6 names
  "pre",
  "post",
  "amp",
  "via",
  "pcs",
  "nos",
  "etc",
  "incl",
  "including",
  "works",
  "work",
  "item",
  "misc",
  "other",
  "others",
  "ref",
  "note",
  "notes"
]);
function extractActivityKeywords(name) {
  if (!name || typeof name !== "string") return [];
  const cleaned = name.toLowerCase().replace(/[^\w\s\-]/g, " ");
  const tokens = cleaned.split(/[\s\-_]+/);
  const keywords = [];
  for (const t of tokens) {
    if (t.length < 3) continue;
    if (CLUSTER_STOP_WORDS.has(t)) continue;
    if (/^\d+$/.test(t)) continue;
    if (/^[a-z]\d+$/.test(t)) continue;
    keywords.push(t);
  }
  return keywords;
}
function buildActivityClusters(activities, options) {
  const opts = options || {};
  const minClusterSize = opts.minClusterSize || 3;
  const topN = opts.topN || 30;
  const minKeywordFreq = opts.minKeywordFreq || 5;
  const acts = (activities || []).filter((a) => !(a == null ? void 0 : a.isSummary) && (a == null ? void 0 : a.name));
  if (acts.length === 0) {
    return { clusters: [], unclustered: [], summary: { total: 0, clustered: 0, clusterCount: 0 } };
  }
  const freq = /* @__PURE__ */ new Map();
  const actKeywords = /* @__PURE__ */ new Map();
  for (const a of acts) {
    const kws = extractActivityKeywords(a.name);
    actKeywords.set(a.id || a.actId || a.name, kws);
    for (const kw of kws) {
      freq.set(kw, (freq.get(kw) || 0) + 1);
    }
  }
  const anchors = [...freq.entries()].filter(([kw, n]) => n >= minKeywordFreq).sort((a, b) => b[1] - a[1]).slice(0, topN).map(([kw]) => kw);
  const clusterMap = /* @__PURE__ */ new Map();
  const unclustered = [];
  for (const a of acts) {
    const kws = actKeywords.get(a.id || a.actId || a.name);
    let primary = null;
    for (const kw of kws) {
      if (anchors.includes(kw)) {
        primary = kw;
        break;
      }
    }
    if (primary) {
      if (!clusterMap.has(primary)) clusterMap.set(primary, []);
      clusterMap.get(primary).push(a);
    } else {
      unclustered.push(a);
    }
  }
  const clusters = [];
  for (const [name, members] of clusterMap.entries()) {
    if (members.length < minClusterSize) {
      unclustered.push(...members);
      continue;
    }
    const completed = members.filter((m) => m.status === "Completed").length;
    const inProgress = members.filter((m) => m.status === "In Progress").length;
    const notStarted = members.filter((m) => m.status === "Not Started").length;
    const critical = members.filter((m) => !isNaN(m.totalFloat) && m.totalFloat <= 0).length;
    const totalDuration = members.reduce((s, m) => s + (m.duration || 0), 0);
    const completedPct = members.length > 0 ? completed / members.length * 100 : 0;
    clusters.push({
      name,
      count: members.length,
      activities: members,
      completed,
      inProgress,
      notStarted,
      critical,
      totalDuration,
      completedPct
    });
  }
  clusters.sort((a, b) => b.count - a.count);
  return {
    clusters,
    unclustered,
    summary: {
      total: acts.length,
      clustered: acts.length - unclustered.length,
      clusterCount: clusters.length
    }
  };
}
function buildScheduleDensity(activities, view) {
  const acts = (activities || []).filter(
    (a) => !a.isSummary && a.plannedStart && a.plannedFinish
  );
  if (acts.length === 0) {
    return { cells: [], peakValue: 0, avgValue: 0, totalCells: 0, view, range: null };
  }
  const safeDate = (s) => {
    try {
      if (!s) return null;
      const d = new Date(s);
      return isNaN(d.getTime()) ? null : d;
    } catch (e) {
      return null;
    }
  };
  let minDate = null, maxDate = null;
  for (const a of acts) {
    const ps = safeDate(a.plannedStart);
    const pf = safeDate(a.plannedFinish) || safeDate(a.finish);
    if (ps && (!minDate || ps < minDate)) minDate = ps;
    if (pf && (!maxDate || pf > maxDate)) maxDate = pf;
  }
  if (!minDate || !maxDate) {
    return { cells: [], peakValue: 0, avgValue: 0, totalCells: 0, view, range: null };
  }
  const cellMap = /* @__PURE__ */ new Map();
  const incrementBucket = (date, count) => {
    let key, label, sortKey;
    if (view === "week") {
      const sun = new Date(date);
      sun.setDate(sun.getDate() - sun.getDay());
      key = `${sun.getFullYear()}-${String(sun.getMonth() + 1).padStart(2, "0")}-${String(sun.getDate()).padStart(2, "0")}`;
      label = sun.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      sortKey = sun.getTime();
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      label = date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
      sortKey = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
    }
    if (!cellMap.has(key)) cellMap.set(key, { key, label, total: 0, sortKey });
    cellMap.get(key).total += count;
  };
  for (const a of acts) {
    const ps = safeDate(a.plannedStart);
    const pf = safeDate(a.plannedFinish);
    if (!ps || !pf) continue;
    const cursor = new Date(ps);
    cursor.setHours(0, 0, 0, 0);
    const end = new Date(pf);
    end.setHours(0, 0, 0, 0);
    while (cursor <= end) {
      incrementBucket(cursor, 1);
      cursor.setDate(cursor.getDate() + 1);
    }
  }
  const cells = Array.from(cellMap.values()).sort((a, b) => a.sortKey - b.sortKey);
  const peakValue = cells.reduce((m, c) => Math.max(m, c.total), 0);
  const totalSum = cells.reduce((s, c) => s + c.total, 0);
  const avgValue = cells.length > 0 ? Math.round(totalSum / cells.length) : 0;
  for (const c of cells) {
    const ratio = peakValue > 0 ? c.total / peakValue : 0;
    if (ratio >= 0.8) c.heatLevel = 5;
    else if (ratio >= 0.6) c.heatLevel = 4;
    else if (ratio >= 0.4) c.heatLevel = 3;
    else if (ratio >= 0.2) c.heatLevel = 2;
    else if (ratio > 0) c.heatLevel = 1;
    else c.heatLevel = 0;
    c.isPeak = ratio >= 0.9;
  }
  return {
    cells,
    peakValue,
    avgValue,
    totalCells: cells.length,
    view,
    range: { start: minDate, end: maxDate }
  };
}
function detectLogicLoops(activities, relationships) {
  if (!relationships || relationships.length === 0) {
    return { cycles: [], summary: { count: 0, longestCycle: 0, hasIssues: false } };
  }
  const graph = /* @__PURE__ */ new Map();
  const allNodes = /* @__PURE__ */ new Set();
  for (const r of relationships) {
    if (!r.predId || !r.succId) continue;
    if (!graph.has(r.predId)) graph.set(r.predId, []);
    graph.get(r.predId).push(r.succId);
    allNodes.add(r.predId);
    allNodes.add(r.succId);
  }
  const actMap = /* @__PURE__ */ new Map();
  for (const a of activities || []) {
    if (a.id) actMap.set(a.id, a);
  }
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = /* @__PURE__ */ new Map();
  for (const node of allNodes) color.set(node, WHITE);
  const cycles = [];
  const cycleKeys = /* @__PURE__ */ new Set();
  for (const startNode of allNodes) {
    if (color.get(startNode) !== WHITE) continue;
    const stack = [{ node: startNode, path: [startNode], childIdx: 0 }];
    color.set(startNode, GRAY);
    while (stack.length > 0) {
      const frame = stack[stack.length - 1];
      const children = graph.get(frame.node) || [];
      if (frame.childIdx >= children.length) {
        color.set(frame.node, BLACK);
        stack.pop();
        continue;
      }
      const child = children[frame.childIdx];
      frame.childIdx++;
      const childColor = color.get(child);
      if (childColor === GRAY) {
        const cycleStart = frame.path.indexOf(child);
        if (cycleStart >= 0) {
          const cyclePath = frame.path.slice(cycleStart).concat([child]);
          const normalized = [...cyclePath.slice(0, -1)].sort()[0];
          const startIdx = cyclePath.indexOf(normalized);
          const rotated = cyclePath.slice(startIdx).concat(cyclePath.slice(1, startIdx + 1));
          const key = rotated.join("\u2192");
          if (!cycleKeys.has(key)) {
            cycleKeys.add(key);
            cycles.push(rotated);
          }
        }
      } else if (childColor === WHITE) {
        color.set(child, GRAY);
        const newPath = frame.path.concat([child]);
        stack.push({ node: child, path: newPath, childIdx: 0 });
      }
    }
  }
  const longestCycle = cycles.reduce((max, c) => (c.length - 1) > max ? c.length - 1 : max, 0);
  const summary = {
    count: cycles.length,
    longestCycle,
    hasIssues: cycles.length > 0,
    affectedActivities: new Set(cycles.flatMap((c) => c.slice(0, -1))).size
  };
  const enrichedCycles = cycles.map((cycle) => ({
    nodeIds: cycle,
    nodes: cycle.map((id) => {
      const a = actMap.get(id);
      return {
        id,
        actId: (a == null ? void 0 : a.actId) || id,
        name: (a == null ? void 0 : a.name) || `(unknown ${id})`,
        status: (a == null ? void 0 : a.status) || "\u2014",
        critical: a && !isNaN(a.totalFloat) && a.totalFloat <= 0
      };
    }),
    length: cycle.length - 1
  }));
  return { cycles: enrichedCycles, summary };
}
function analyzeOpenEnds(activities, relationships) {
  const predCount = /* @__PURE__ */ new Map();
  const succCount = /* @__PURE__ */ new Map();
  for (const r of relationships || []) {
    // FIX BUG-03: use predId/succId (XER parser field names)
    if (r.predId) succCount.set(r.predId, (succCount.get(r.predId) || 0) + 1);
    if (r.succId) predCount.set(r.succId, (predCount.get(r.succId) || 0) + 1);
  }
  const noPredecessor = [];
  const noSuccessor = [];
  const orphan = [];
  const incomplete = (activities || []).filter(
    (a) => !a.isSummary && a.status !== "Completed"
  );
  for (const a of incomplete) {
    // FIX BUG-03 (revised): predCount/succCount keys are ObjectIds (a.id from parser)
    const aId = a.id || a.actId;
    if (!aId) continue;
    const preds = predCount.get(aId) || 0;
    const succs = succCount.get(aId) || 0;
    // Allow project start/finish milestones to have only one side
    const typeLower = (a.type || "").toLowerCase();
    if (typeLower.includes("start milestone") && preds === 0 && succs > 0) continue;
    if (typeLower.includes("finish milestone") && succs === 0 && preds > 0) continue;
    if (preds === 0 && succs === 0) {
      orphan.push(a);
    } else if (preds === 0) {
      noPredecessor.push(a);
    } else if (succs === 0) {
      noSuccessor.push(a);
    }
  }
  const total = noPredecessor.length + noSuccessor.length + orphan.length;
  const summary = {
    total,
    noPredecessor: noPredecessor.length,
    noSuccessor: noSuccessor.length,
    orphan: orphan.length,
    incompleteCount: incomplete.length,
    openEndPct: incomplete.length > 0 ? Math.round(total / incomplete.length * 1e3) / 10 : 0
  };
  return { noPredecessor, noSuccessor, orphan, summary };
}
function analyzeNegativeFloat(activities, dataDate) {
  const dd = dataDate ? new Date(dataDate) : null;
  const items = (activities || []).filter((a) => !a.isSummary && a.status !== "Completed" && !isNaN(a.totalFloat) && a.totalFloat < 0).map((a) => {
    const delay = Math.abs(a.totalFloat);
    let category;
    if (delay > 90) category = "extreme";
    else if (delay > 30) category = "severe";
    else category = "moderate";
    let daysOverdue = 0;
    if (dd && a.plannedFinish) {
      try {
        const pf = new Date(a.plannedFinish);
        if (!isNaN(pf) && pf < dd) daysOverdue = Math.round((dd - pf) / 864e5);
      } catch (e) {
      }
    }
    return { ...a, delayDays: delay, delayCategory: category, daysOverdue };
  }).sort((a, b) => a.totalFloat - b.totalFloat);
  const summary = {
    total: items.length,
    worst: items.length > 0 ? items[0].totalFloat : 0,
    average: items.length > 0 ? Math.round(items.reduce((s, a) => s + a.totalFloat, 0) / items.length) : 0,
    extremeCount: items.filter((a) => a.delayCategory === "extreme").length,
    severeCount: items.filter((a) => a.delayCategory === "severe").length,
    moderateCount: items.filter((a) => a.delayCategory === "moderate").length,
    overdueCount: items.filter((a) => a.daysOverdue > 0).length
  };
  return { items, summary };
}
function buildLookahead(activities, dataDate, weeks) {
  if (!dataDate || !activities || activities.length === 0) return [];
  const dd = new Date(dataDate);
  if (isNaN(dd)) return [];
  const cutoff = new Date(dd);
  cutoff.setDate(cutoff.getDate() + weeks * 7);
  const safeDate = (s) => {
    try {
      return s ? new Date(s) : null;
    } catch (e) {
      return null;
    }
  };
  return activities.filter((a) => !a.isSummary && a.status !== "Completed").filter((a) => {
    const start = safeDate(a.actualStart) || safeDate(a.plannedStart);
    const finish = safeDate(a.finish) || safeDate(a.remainFinish) || safeDate(a.plannedFinish);
    if (!start || !finish) return false;
    return start <= cutoff && finish >= dd;
  }).sort((a, b) => {
    const aStart = a.actualStart || a.plannedStart || a.plannedFinish || "";
    const bStart = b.actualStart || b.plannedStart || b.plannedFinish || "";
    return aStart.localeCompare(bStart);
  });
}
// ── ACTIVITY CODE BREAKDOWN (v27) ────────────────────────────────────────
// Groups activities by a chosen code type (e.g., Discipline, Phase, Area)
// and computes per-group EVM-style summary: planned %, actual %, variance, BAC, criticals
function buildCodeBreakdown(rows, codeTypeId, codeTypeName) {
  if (!rows || rows.length === 0) return { groups: [], unassigned: 0, codeTypeName };
  const groups = {};
  let unassigned = 0;
  for (const r of rows) {
    if (r.isMilestone || r.isSummary) continue;
    const codes = (r._raw && r._raw.codes) || {};
    const assignment = codes[codeTypeId];
    if (!assignment) {
      unassigned++;
      continue;
    }
    const key = assignment.value || "(blank)";
    if (!groups[key]) {
      groups[key] = {
        value: assignment.value,
        description: assignment.description || "",
        rows: [],
        sumWeight: 0,
        sumPlanned: 0,
        sumActual: 0,
        sumBac: 0
      };
    }
    const w = (r.bac || 0) + (r.dur || 0); // hybrid weight: cost preferred, duration fallback
    groups[key].rows.push(r);
    groups[key].sumWeight += w;
    groups[key].sumPlanned += w * (r.plannedPct || 0);
    groups[key].sumActual += w * (r.actualPct || 0);
    groups[key].sumBac += r.bac || 0;
  }
  const result = Object.values(groups).map((g) => ({
    value: g.value,
    description: g.description,
    activities: g.rows.length,
    planned: g.sumWeight > 0 ? +(g.sumPlanned / g.sumWeight).toFixed(2) : 0,
    actual: g.sumWeight > 0 ? +(g.sumActual / g.sumWeight).toFixed(2) : 0,
    variance: g.sumWeight > 0 ? +((g.sumActual - g.sumPlanned) / g.sumWeight).toFixed(2) : 0,
    bac: g.sumBac,
    critical: g.rows.filter((r) => r.critical).length,
    behind: g.rows.filter((r) => r.variance < -1).length,
    ahead: g.rows.filter((r) => r.variance > 1).length,
    completed: g.rows.filter((r) => r.status === "Completed").length,
    inProgress: g.rows.filter((r) => r.status === "In Progress").length,
    notStarted: g.rows.filter((r) => r.status === "Not Started").length
  })).sort((a, b) => a.variance - b.variance); // worst first
  return {
    groups: result,
    unassigned,
    codeTypeName: codeTypeName || "Code"
  };
}
// ── MULTI-UPDATE TREND ANALYSIS (v27) ────────────────────────────────────
// Runs analyze() against the same baseline for each progress file in the
// series, then extracts SPI/CPI/DCMA/Variance per update for trending.
//
// Inputs:
//   baseline:  parsed baseline (or revised baseline) — the FIXED reference
//   updates:   array of parsed progress files (sorted by dataDate)
//   activeMethod: which weighting to extract ('cost'/'units'/'duration'/'count')
//
// Output: array of { dataDate, projectFinish, spi, cpi, plannedPct, actualPct,
//                    variance, dcmaScore, criticalCount, behindCount,
//                    integrityScore, completedPct }
function buildTrendAnalysis(baseline, updates, activeMethod = "cost") {
  if (!baseline || !updates || updates.length === 0) return [];
  // Sort updates by data date ascending (oldest first for proper trending)
  const sorted = [...updates].sort((a, b) => {
    const da = a.project.dataDate ? new Date(a.project.dataDate).getTime() : 0;
    const db = b.project.dataDate ? new Date(b.project.dataDate).getTime() : 0;
    return da - db;
  });
  const points = [];
  for (const upd of sorted) {
    try {
      const res = analyze(baseline, upd, null);
      const dataDate = upd.project.dataDate || (res.dataDate && res.dataDate.toISOString());
      // Extract method-specific numbers (fall back to recommended if requested
      // method has no data)
      const m = res.methodResults[activeMethod] && res.methodResults[activeMethod].available
        ? res.methodResults[activeMethod]
        : (res.methodResults[res.recommended] || {});
      // DCMA score on demand
      let dcmaScore = null;
      try {
        const dcma = runDCMAHealthCheck(
          res._dcmaActivities || [],
          res.dataDate,
          res._dcmaRelationships || []
        );
        dcmaScore = dcma.score;
      } catch (e) {
        dcmaScore = null;
      }
      const completedPct = res.summary.total > 0
        ? res.summary.completed / res.summary.total * 100
        : 0;
      points.push({
        dataDate,
        projectFinish: upd.project.finish || null,
        plannedPct: m.planned !== undefined ? m.planned : null,
        actualPct: m.actual !== undefined ? m.actual : null,
        variance: m.variance !== undefined ? m.variance : null,
        spi: res.summary.overallSPI,
        cpi: res.summary.overallCPI,
        dcmaScore,
        integrityScore: res.integrityScore,
        criticalCount: res.summary.critical,
        behindCount: res.summary.behind,
        completedCount: res.summary.completed,
        totalCount: res.summary.total,
        completedPct: +completedPct.toFixed(1),
        version: upd.version,
        // Forecast slip vs baseline (days)
        slipVsBaseline: (() => {
          const blF = baseline.project.finish ? new Date(baseline.project.finish) : null;
          const prF = upd.project.finish ? new Date(upd.project.finish) : null;
          if (blF && prF && !isNaN(blF) && !isNaN(prF)) {
            return Math.round((prF - blF) / 864e5);
          }
          return null;
        })()
      });
    } catch (e) {
      console.warn("Trend point failed for update with dataDate", upd.project.dataDate, e);
    }
  }
  return points;
}
const TYPE_META = {
  original: { icon: "\u{1F4D5}", color: "#fb923c" },
  revised: { icon: "\u{1F4D8}", color: "#38bdf8" },
  baseline: { icon: "\u{1F4D8}", color: "#38bdf8" },
  progress: { icon: "\u{1F4D7}", color: "#a78bfa" },
  unknown: { icon: "\u2753", color: "#64748b" }
};
const THEMES = {
  dark: {
    name: "dark",
    // v29: Background matches logo's bg color (#04070c) for seamless blend
    bgPage: "#04070c",
    bgCard: "#0a0e16",
    bgCardAlt: "#0c1018",
    bgCardSubtle: "#0e121a",
    bgInput: "#0a0e16",
    bgPanel: "#070a10",
    bgPanelAlt: "#080b12",
    // Borders (slightly lighter for contrast)
    border: "#1a1f2a",
    borderSubtle: "#10141c",
    borderStrong: "#252b38",
    // Text
    textPrimary: "#e2e8f0",
    textSecondary: "#cbd5e1",
    textMuted: "#94a3b8",
    textDim: "#64748b",
    textFaint: "#475569",
    textGhost: "#1e3a5f",
    // Accents (consistent between themes — only adjusted for contrast)
    accentBlue: "#38bdf8",
    accentPurple: "#a78bfa",
    accentGreen: "#22c55e",
    accentAmber: "#f59e0b",
    accentOrange: "#fb923c",
    accentRed: "#f43f5e",
    accentYellow: "#fbbf24",
    accentTeal: "#34d399",
    // Special
    gradient: "linear-gradient(135deg,#0ea5e9,#8b5cf6)",
    statusGreenBg: "linear-gradient(135deg,#022c22,#064e3b)",
    statusOrangeBg: "linear-gradient(135deg,#1c1917,#7c2d12)",
    statusRedBg: "linear-gradient(135deg,#1a0505,#450a0a)",
    cardShadow: "0 0 18px"
  },
  // ── Bloomberg Theme (v29): Editorial · Bloomberg Terminal · Pentagram ──
  // Synthesized from 28 world-class design houses. Philosophy:
  //   STORY · HIERARCHY · CRAFT · DENSITY · HUMANISM
  // Inspirations: Bloomberg Terminal (deep blues), Pentagram (Lupi humanist
  //   data), Apple HIG (semantic colors), IBM Carbon (4-level text), Stripe
  //   (subtle restraint), McKinsey (information density).
  bloomberg: {
    name: "bloomberg",
    // Backgrounds (Bloomberg Terminal deep navy)
    bgPage:        "#0a0e1a",
    bgCard:        "#0f1729",
    bgCardAlt:     "#111a2e",
    bgCardSubtle:  "#13203a",
    bgInput:       "#070b14",
    bgPanel:       "#0c1424",
    bgPanelAlt:    "#0e1729",
    // Borders (subtle hairlines, Apple HIG)
    border:        "#1f2c47",
    borderSubtle:  "#15213a",
    borderStrong:  "#2a3d63",
    // Text (4-level hierarchy, IBM Carbon)
    textPrimary:   "#e8eaed",
    textSecondary: "#bcc1c6",
    textMuted:     "#7d8693",
    textDim:       "#5a6478",
    textFaint:     "#3f4859",
    textGhost:     "#2a334a",
    // Accents (Bloomberg gold + Apple semantic, Pentagram-grade saturation)
    accentBlue:    "#3a86ff",
    accentPurple:  "#bf5af2",
    accentGreen:   "#00d563",
    accentAmber:   "#ffb800",
    accentOrange:  "#ff9500",
    accentRed:     "#ff453a",
    accentYellow:  "#fbb40e",
    accentTeal:    "#30d6c8",
    // Special (Bloomberg gold gradient signature)
    gradient:      "linear-gradient(135deg,#fbb40e,#ff9500)",
    statusGreenBg: "linear-gradient(135deg,#001a0e,#003820)",
    statusOrangeBg:"linear-gradient(135deg,#1a1300,#3a2800)",
    statusRedBg:   "linear-gradient(135deg,#1a0408,#3a0a14)",
    cardShadow:    "0 4px 16px rgba(0,0,0,0.5)"
  },
  // ── Apple Theme — Clean white · Semantic colors · SF Pro feel ──────────
  apple: {
    name: "apple",
    bgPage:        "#f5f5f7",  // Apple signature off-white
    bgCard:        "#ffffff",
    bgCardAlt:     "#fafafa",
    bgCardSubtle:  "#f0f0f3",
    bgInput:       "#ffffff",
    bgPanel:       "#fbfbfd",
    bgPanelAlt:    "#f5f5f7",
    border:        "#d2d2d7",
    borderSubtle:  "#e5e5e7",
    borderStrong:  "#86868b",
    textPrimary:   "#1d1d1f",  // Apple signature black
    textSecondary: "#424245",
    textMuted:     "#6e6e73",
    textDim:       "#86868b",
    textFaint:     "#a1a1a6",
    textGhost:     "#d2d2d7",
    accentBlue:    "#0071e3",  // Apple blue
    accentPurple:  "#bf5af2",  // Apple purple
    accentGreen:   "#34c759",  // Apple green semantic
    accentAmber:   "#ff9500",
    accentOrange:  "#ff9500",
    accentRed:     "#ff3b30",  // Apple red semantic
    accentYellow:  "#ffcc00",
    accentTeal:    "#5ac8fa",
    gradient:      "linear-gradient(135deg,#0071e3,#bf5af2)",
    statusGreenBg: "linear-gradient(135deg,#e8f7ee,#d1eddc)",
    statusOrangeBg:"linear-gradient(135deg,#fff4e0,#ffe5b8)",
    statusRedBg:   "linear-gradient(135deg,#fde8e6,#fbcdc7)",
    cardShadow:    "0 1px 3px rgba(0,0,0,0.08)"
  },
  // ── McKinsey Theme — Deep blue corporate · Refined gray · Authoritative ─
  mckinsey: {
    name: "mckinsey",
    bgPage:        "#f4f6f9",
    bgCard:        "#ffffff",
    bgCardAlt:     "#f8fafc",
    bgCardSubtle:  "#eff3f7",
    bgInput:       "#ffffff",
    bgPanel:       "#fbfcfd",
    bgPanelAlt:    "#f4f6f9",
    border:        "#cbd5e1",
    borderSubtle:  "#e2e8f0",
    borderStrong:  "#1e40af",
    textPrimary:   "#051c2c",  // McKinsey signature deep navy
    textSecondary: "#1f2937",
    textMuted:     "#475569",
    textDim:       "#64748b",
    textFaint:     "#94a3b8",
    textGhost:     "#cbd5e1",
    accentBlue:    "#003a70",  // McKinsey corporate blue
    accentPurple:  "#7c3aed",
    accentGreen:   "#059669",
    accentAmber:   "#d97706",
    accentOrange:  "#ea580c",
    accentRed:     "#dc2626",
    accentYellow:  "#ca8a04",
    accentTeal:    "#0891b2",
    gradient:      "linear-gradient(135deg,#003a70,#1e40af)",
    statusGreenBg: "linear-gradient(135deg,#ecfdf5,#d1fae5)",
    statusOrangeBg:"linear-gradient(135deg,#fff7ed,#fed7aa)",
    statusRedBg:   "linear-gradient(135deg,#fef2f2,#fecaca)",
    cardShadow:    "0 2px 8px rgba(5,28,44,0.08)"
  },
  // ── Pentagram Theme — Bold artistic · Vivid palettes · Editorial ───────
  pentagram: {
    name: "pentagram",
    bgPage:        "#fafaf7",  // warm cream
    bgCard:        "#ffffff",
    bgCardAlt:     "#f7f5f0",
    bgCardSubtle:  "#f0ede5",
    bgInput:       "#ffffff",
    bgPanel:       "#fdfcf8",
    bgPanelAlt:    "#f7f5f0",
    border:        "#1a1a1a",  // Pentagram bold black borders
    borderSubtle:  "#e5e3dc",
    borderStrong:  "#000000",
    textPrimary:   "#0a0a0a",  // Pentagram pure black
    textSecondary: "#1f1f1f",
    textMuted:     "#525252",
    textDim:       "#737373",
    textFaint:     "#a3a3a3",
    textGhost:     "#d4d4d4",
    accentBlue:    "#004cff",  // Pentagram electric blue
    accentPurple:  "#a855f7",
    accentGreen:   "#00d97e",  // Pentagram vivid green
    accentAmber:   "#ff8800",
    accentOrange:  "#ff5500",  // Pentagram signature orange
    accentRed:     "#ff0040",  // Pentagram bold red
    accentYellow:  "#ffd400",  // Pentagram bright yellow
    accentTeal:    "#00b8d9",
    gradient:      "linear-gradient(135deg,#ff5500,#ff0040)",
    statusGreenBg: "linear-gradient(135deg,#e6fff4,#b8f5d8)",
    statusOrangeBg:"linear-gradient(135deg,#fff0e0,#ffd4a8)",
    statusRedBg:   "linear-gradient(135deg,#ffe0e6,#ffb3c0)",
    cardShadow:    "0 4px 0 rgba(0,0,0,1)"  // Pentagram brutalist shadow
  },
  // ── Stripe Theme — Soft purple · Elegant gradients · Modern SaaS ───────
  stripe: {
    name: "stripe",
    bgPage:        "#f6f9fc",
    bgCard:        "#ffffff",
    bgCardAlt:     "#f8f9fc",
    bgCardSubtle:  "#eef0f6",
    bgInput:       "#ffffff",
    bgPanel:       "#fafbfd",
    bgPanelAlt:    "#f6f9fc",
    border:        "#dfe3eb",
    borderSubtle:  "#eaeef5",
    borderStrong:  "#635bff",  // Stripe signature purple
    textPrimary:   "#0a2540",  // Stripe deep navy
    textSecondary: "#3c4257",
    textMuted:     "#697386",
    textDim:       "#8792a2",
    textFaint:     "#a3acb9",
    textGhost:     "#cfd7df",
    accentBlue:    "#635bff",  // Stripe purple-blue signature
    accentPurple:  "#7a73ff",
    accentGreen:   "#00d924",  // Stripe green
    accentAmber:   "#ff9500",
    accentOrange:  "#ff5996",  // Stripe pink-orange
    accentRed:     "#df1b41",  // Stripe red
    accentYellow:  "#ffc043",
    accentTeal:    "#00d4ff",
    gradient:      "linear-gradient(135deg,#635bff,#00d4ff)",
    statusGreenBg: "linear-gradient(135deg,#e6f9eb,#c3f0d0)",
    statusOrangeBg:"linear-gradient(135deg,#fff4e0,#ffd4a8)",
    statusRedBg:   "linear-gradient(135deg,#fde2e7,#fbb8c4)",
    cardShadow:    "0 7px 14px rgba(50,50,93,0.1), 0 3px 6px rgba(0,0,0,0.08)"
  },
  // ── Vercel Theme — Pure black · Razor-sharp minimalism · Geist ─────────
  vercel: {
    name: "vercel",
    bgPage:        "#000000",  // Vercel pure black signature
    bgCard:        "#0a0a0a",
    bgCardAlt:     "#111111",
    bgCardSubtle:  "#171717",
    bgInput:       "#0a0a0a",
    bgPanel:       "#050505",
    bgPanelAlt:    "#0a0a0a",
    border:        "#262626",
    borderSubtle:  "#171717",
    borderStrong:  "#404040",
    textPrimary:   "#ededed",  // Vercel signature white
    textSecondary: "#a1a1a1",
    textMuted:     "#737373",
    textDim:       "#525252",
    textFaint:     "#404040",
    textGhost:     "#262626",
    accentBlue:    "#0070f3",  // Vercel signature blue
    accentPurple:  "#7c3aed",
    accentGreen:   "#0cce6b",
    accentAmber:   "#f5a623",
    accentOrange:  "#f5a623",
    accentRed:     "#e00",  // Vercel red
    accentYellow:  "#f7b955",
    accentTeal:    "#50e3c2",
    gradient:      "linear-gradient(135deg,#ffffff,#a1a1a1)",  // monochrome
    statusGreenBg: "linear-gradient(135deg,#001a0a,#003315)",
    statusOrangeBg:"linear-gradient(135deg,#1a1300,#332600)",
    statusRedBg:   "linear-gradient(135deg,#1a0000,#330000)",
    cardShadow:    "0 0 0 1px rgba(255,255,255,0.05)"
  },
  // ── IBM Carbon Theme — Industrial blue · Strict grid · Plex Sans feel ──
  carbon: {
    name: "carbon",
    bgPage:        "#161616",  // Carbon Gray 100
    bgCard:        "#262626",  // Carbon Gray 90
    bgCardAlt:     "#393939",  // Carbon Gray 80
    bgCardSubtle:  "#2a2a2a",
    bgInput:       "#161616",
    bgPanel:       "#1f1f1f",
    bgPanelAlt:    "#262626",
    border:        "#393939",
    borderSubtle:  "#262626",
    borderStrong:  "#525252",
    textPrimary:   "#f4f4f4",  // Carbon Gray 10
    textSecondary: "#c6c6c6",  // Carbon Gray 30
    textMuted:     "#a8a8a8",  // Carbon Gray 40
    textDim:       "#8d8d8d",  // Carbon Gray 50
    textFaint:     "#6f6f6f",  // Carbon Gray 60
    textGhost:     "#525252",  // Carbon Gray 70
    accentBlue:    "#0f62fe",  // Carbon Blue 60 signature
    accentPurple:  "#8a3ffc",  // Carbon Purple 60
    accentGreen:   "#24a148",  // Carbon Green 60
    accentAmber:   "#f1c21b",  // Carbon Yellow 30
    accentOrange:  "#fa4d56",
    accentRed:     "#da1e28",  // Carbon Red 60
    accentYellow:  "#f1c21b",
    accentTeal:    "#08bdba",  // Carbon Teal 50
    gradient:      "linear-gradient(135deg,#0f62fe,#8a3ffc)",
    statusGreenBg: "linear-gradient(135deg,#022d0d,#044317)",
    statusOrangeBg:"linear-gradient(135deg,#1f1500,#332300)",
    statusRedBg:   "linear-gradient(135deg,#1a0808,#330e0e)",
    cardShadow:    "0 1px 0 rgba(255,255,255,0.05)"
  },
  // ── Linear Theme — Graphite · Modern dark · Refined motion ─────────────
  linear: {
    name: "linear",
    bgPage:        "#101113",  // Linear signature dark
    bgCard:        "#161719",
    bgCardAlt:     "#1c1d20",
    bgCardSubtle:  "#1a1b1d",
    bgInput:       "#101113",
    bgPanel:       "#131416",
    bgPanelAlt:    "#161719",
    border:        "#26272b",
    borderSubtle:  "#1f2024",
    borderStrong:  "#3a3c42",
    textPrimary:   "#e6e6e6",
    textSecondary: "#b4b4b8",
    textMuted:     "#878790",
    textDim:       "#62636b",
    textFaint:     "#48494f",
    textGhost:     "#2c2d31",
    accentBlue:    "#5e6ad2",  // Linear signature purple-blue
    accentPurple:  "#8b88f8",
    accentGreen:   "#4cb782",
    accentAmber:   "#f2c94c",
    accentOrange:  "#f2994a",
    accentRed:     "#eb5757",
    accentYellow:  "#f7b955",
    accentTeal:    "#56b3d4",
    gradient:      "linear-gradient(135deg,#5e6ad2,#8b88f8)",
    statusGreenBg: "linear-gradient(135deg,#0a1f15,#142e1f)",
    statusOrangeBg:"linear-gradient(135deg,#1f1709,#2e2210)",
    statusRedBg:   "linear-gradient(135deg,#1f0c0c,#2e1414)",
    cardShadow:    "0 0 0 1px rgba(255,255,255,0.04)"
  },
  // ── Notion Theme — Soft warm · Calm gradients · Reading comfort ────────
  notion: {
    name: "notion",
    bgPage:        "#fbfaf8",  // Notion signature warm white
    bgCard:        "#ffffff",
    bgCardAlt:     "#f7f6f3",
    bgCardSubtle:  "#f1f0ed",
    bgInput:       "#ffffff",
    bgPanel:       "#fcfcfa",
    bgPanelAlt:    "#f7f6f3",
    border:        "#e3e2df",
    borderSubtle:  "#ebeae7",
    borderStrong:  "#9b9a97",
    textPrimary:   "#37352f",  // Notion signature warm black
    textSecondary: "#52504a",
    textMuted:     "#787774",
    textDim:       "#9b9a97",
    textFaint:     "#bab9b6",
    textGhost:     "#dcdbd8",
    accentBlue:    "#337ea9",  // Notion blue
    accentPurple:  "#9065b0",  // Notion purple
    accentGreen:   "#448361",  // Notion green
    accentAmber:   "#cb912f",  // Notion yellow
    accentOrange:  "#d9730d",  // Notion orange
    accentRed:     "#e03e3e",  // Notion red
    accentYellow:  "#dfab01",
    accentTeal:    "#0f7b6c",
    gradient:      "linear-gradient(135deg,#337ea9,#9065b0)",
    statusGreenBg: "linear-gradient(135deg,#edf3ec,#d3e7d6)",
    statusOrangeBg:"linear-gradient(135deg,#fcf3e9,#f5d9b3)",
    statusRedBg:   "linear-gradient(135deg,#fbe4e4,#f3bdbd)",
    cardShadow:    "0 1px 2px rgba(15,15,15,0.05), 0 1px 4px rgba(15,15,15,0.05)"
  }
};
const LangCtx = createContext("en");
const ThemeCtx = createContext("dark");
const useLang = () => {
  const lang = useContext(LangCtx);
  return { t: DICT[lang], m: METHODS_I18N[lang], lang };
};
const useTheme = () => {
  const themeName = useContext(ThemeCtx);
  return { theme: THEMES[themeName], themeName };
};
// ── v27.1.6: SYNCHRONOUS PARSING (corrected from broken v27 Worker approach) ──
// The Web Worker approach in v27 was incorrect: DOMParser is documented as part
// of the HTML Living Standard for Workers, but is NOT actually implemented in
// current Edge/Chrome Worker contexts. Calling `new DOMParser()` inside a
// worker throws "DOMParser is not defined", breaking ALL parsing.
//
// Fix: Run parseP6XML synchronously on the main thread (same as v26 which
// worked reliably). Performance impact is minimal — parsing 50K activities
// takes ~2-3s, acceptable trade-off for correctness.
function parseP6XMLAsync(xmlText) {
  return new Promise((resolve, reject) => {
    try {
      const t0 = Date.now();
      const result = parseP6XML(xmlText);
      resolve({ result, elapsed: Date.now() - t0 });
    } catch (e) {
      reject(e);
    }
  });
}
function parseP6XML(xmlText) {
  if (!xmlText || xmlText.trim().length === 0) {
    throw new Error("File is empty (0 bytes)");
  }
  if (xmlText.trim().length < 100) {
    throw new Error("File is too small to be a valid P6 schedule");
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "application/xml");
  if (doc.querySelector("parsererror")) throw new Error("Invalid or corrupted XML file");
  const ns = doc.documentElement.namespaceURI || "";
  if (!ns.includes("Primavera")) throw new Error("Not a P6 XML file (namespace: " + (ns || "none") + ")");
  const get = (el, tag) => {
    var _a, _b;
    if (!el) return "";
    for (const c of el.children) if (c.localName === tag) return (_b = (_a = c.textContent) == null ? void 0 : _a.trim()) != null ? _b : "";
    return "";
  };
  const num = (el, tag) => {
    const v = get(el, tag);
    return v ? parseFloat(v) || 0 : 0;
  };
  const findAll = (root2, tag) => {
    const out = [];
    const walk = (el) => {
      if (el.localName === tag) out.push(el);
      for (const c of el.children) walk(c);
    };
    walk(root2);
    return out;
  };
  const root = doc.documentElement;
  const allProjects = findAll(root, "Project");
  let projEl = allProjects[0];
  if (allProjects.length > 1) {
    projEl = allProjects.find((p) => get(p, "DataDate")) || allProjects.find((p) => get(p, "PlannedFinishDate") || get(p, "FinishDate")) || allProjects[0];
  }
  const project = projEl ? { name: get(projEl, "Name"), id: get(projEl, "Id"), start: get(projEl, "PlannedStartDate"), finish: get(projEl, "PlannedFinishDate") || get(projEl, "FinishDate"), dataDate: get(projEl, "DataDate") } : {};
  const projObjId = projEl ? get(projEl, "ObjectId") : "";
  let activityElements = projEl ? findAll(projEl, "Activity") : [];
  if (activityElements.length === 0 && projObjId) {
    activityElements = findAll(root, "Activity").filter((a) => get(a, "ProjectObjectId") === projObjId);
  }
  if (activityElements.length === 0) {
    activityElements = findAll(root, "Activity");
  }
  const activities = activityElements.map((a) => {
    const type = get(a, "Type");
    return {
      id: get(a, "ObjectId"),
      actId: get(a, "Id"),
      name: get(a, "Name") || get(a, "n"),
      status: get(a, "Status"),
      type,
      isMilestone: type.includes("Milestone"),
      isSummary: type === "WBS Summary" || type === "Level of Effort",
      pctType: get(a, "PercentCompleteType"),
      wbs: get(a, "WBSObjectId"),
      plannedStart: get(a, "PlannedStartDate"),
      plannedFinish: get(a, "PlannedFinishDate"),
      actualStart: get(a, "ActualStartDate"),
      actualFinish: get(a, "ActualFinishDate"),
      remainFinish: get(a, "RemainingEarlyFinishDate"),
      finish: get(a, "FinishDate"),
      // Durations: P6 XML stores duration in HOURS, not days. We store the raw
      // hours here and divide by the activity's calendar HoursPerDay later
      // (after calendarsMap is built). Saudi 12-hour shifts and 10-hour calendars
      // are now handled correctly. Falls back to 8 if calendar is missing.
      // v29.0.9.2: Was hardcoded /8 — now uses per-activity calendar HoursPerDay.
      _hoursPerDay: 8,  // placeholder; recomputed in post-processing below
      plannedDuration: num(a, "PlannedDuration") / 8,
      remainingDuration: num(a, "RemainingDuration") / 8,
      actualDuration: num(a, "ActualDuration") / 8,
      atCompletionDuration: num(a, "AtCompletionDuration") / 8,
      _rawPlannedDurationHours: num(a, "PlannedDuration"),
      _rawRemainingDurationHours: num(a, "RemainingDuration"),
      _rawActualDurationHours: num(a, "ActualDuration"),
      _rawAtCompletionDurationHours: num(a, "AtCompletionDuration"),
      // TotalFloat: most P6 XML exports OMIT this field — we compute it from
      // Late Finish - Early Finish dates when not provided directly.
      // Formula: TF (days) = (RemainingLateFinish - RemainingEarlyFinish) / 86400000
      // This is the standard CPM definition and matches P6's own calculation.
      totalFloat: (() => {
        const direct = get(a, "TotalFloat");
        if (direct && direct.trim()) {
          const v = parseFloat(direct);
          if (!isNaN(v)) return v;
        }
        const ef = get(a, "RemainingEarlyFinishDate");
        const lf = get(a, "RemainingLateFinishDate");
        if (ef && lf) {
          try {
            const efDate = new Date(ef);
            const lfDate = new Date(lf);
            if (!isNaN(efDate) && !isNaN(lfDate)) {
              return Math.round((lfDate - efDate) / 864e5);
            }
          } catch (e) {
          }
        }
        return NaN;
      })(),
      primaryConstraintType: get(a, "PrimaryConstraintType"),
      pctComplete: num(a, "PercentComplete"),
      durationPct: num(a, "DurationPercentComplete"),
      physicalPct: num(a, "PhysicalPercentComplete"),
      unitsPct: num(a, "UnitsPercentComplete"),
      plannedNonLaborCost: num(a, "PlannedNonLaborCost"),
      actualNonLaborCost: num(a, "ActualNonLaborCost"),
      plannedLaborCost: num(a, "PlannedLaborCost"),
      actualLaborCost: num(a, "ActualLaborCost"),
      plannedMaterialCost: num(a, "PlannedMaterialCost"),
      actualMaterialCost: num(a, "ActualMaterialCost"),
      plannedExpenseCost: num(a, "PlannedExpenseCost"),
      actualExpenseCost: num(a, "ActualExpenseCost"),
      atCompletionNonLaborCost: num(a, "AtCompletionNonLaborCost"),
      plannedNonLaborUnits: num(a, "PlannedNonLaborUnits"),
      actualNonLaborUnits: num(a, "ActualNonLaborUnits"),
      plannedLaborUnits: num(a, "PlannedLaborUnits"),
      actualLaborUnits: num(a, "ActualLaborUnits"),
      plannedMaterialUnits: num(a, "PlannedMaterialUnits"),
      // v29.0.9: Calendar reference for activity-level calendar tracking
      calendarId: get(a, "CalendarObjectId"),
      // v29.0.9.2: P6's native LongestPath flag (used by findLongestPathDuration)
      longestPath: get(a, "LongestPath") === "true" || get(a, "LongestPath") === "1"
    };
  });
  const verMatch = ns.match(/V(\d+\.\d+)/);
  const wbsMap = {};
  findAll(root, "WBS").forEach((w) => {
    wbsMap[get(w, "ObjectId")] = {
      name: get(w, "Name"),
      code: get(w, "Code"),
      parentId: get(w, "ParentObjectId")
    };
  });
  // ── CALENDARS (v29.0.9) ──────────────────────────────────────────────────
  // P6 XML structure:
  //   <Calendar ObjectId="1" Name="Standard 5 Day Workweek" Type="Global"
  //     HoursPerDay="8" HoursPerWeek="40" HoursPerMonth="172" HoursPerYear="2000"
  //     IsDefault="true" IsPersonal="false" BaseCalendarObjectId="0">
  //     <StandardWorkWeek>
  //       <StandardWorkHours DayOfWeek="Monday">
  //         <WorkTime Start="08:00" Finish="17:00"/>
  //       </StandardWorkHours>
  //     </StandardWorkWeek>
  //     <HolidayOrException Date="2025-01-01"/>
  //   </Calendar>
  const calendarsMap = {};
  const calendarTypeCounts = { Global: 0, Project: 0, Resource: 0 };
  findAll(root, "Calendar").forEach((cal) => {
    const calId = get(cal, "ObjectId");
    if (!calId) return;
    const type = get(cal, "Type") || "Global";
    if (calendarTypeCounts[type] !== undefined) calendarTypeCounts[type]++;
    // Parse standard work week — count working days
    const workWeek = {};
    let workingDays = 0;
    let totalDailyHours = 0;
    findAll(cal, "StandardWorkHours").forEach((swh) => {
      const day = get(swh, "DayOfWeek");
      const workTimes = findAll(swh, "WorkTime");
      let dayHours = 0;
      const intervals = [];
      workTimes.forEach((wt) => {
        const startStr = get(wt, "Start") || "";
        const finishStr = get(wt, "Finish") || "";
        const parseT = (s) => {
          const m = s.match(/^(\d{1,2}):(\d{2})/);
          return m ? parseInt(m[1], 10) + parseInt(m[2], 10) / 60 : null;
        };
        const sH = parseT(startStr), fH = parseT(finishStr);
        if (sH !== null && fH !== null) {
          const span = fH > sH ? fH - sH : (24 - sH) + fH;
          dayHours += span;
          intervals.push(`${startStr.slice(0, 5)}–${finishStr.slice(0, 5)}`);
        }
      });
      if (day) {
        workWeek[day] = { hours: +dayHours.toFixed(2), intervals };
        if (dayHours > 0) {
          workingDays++;
          totalDailyHours += dayHours;
        }
      }
    });
    // Holidays / exceptions
    const holidays = [];
    const exceptions = [];
    findAll(cal, "HolidayOrException").forEach((h) => {
      const date = get(h, "Date");
      if (!date) return;
      const workTimes = findAll(h, "WorkTime");
      if (workTimes.length === 0) {
        holidays.push(date.slice(0, 10));
      } else {
        let exHours = 0;
        workTimes.forEach((wt) => {
          const parseT = (s) => {
            const m = (s || "").match(/^(\d{1,2}):(\d{2})/);
            return m ? +m[1] + +m[2] / 60 : null;
          };
          const sH = parseT(get(wt, "Start"));
          const fH = parseT(get(wt, "Finish"));
          if (sH !== null && fH !== null) exHours += fH > sH ? fH - sH : 0;
        });
        exceptions.push({ date: date.slice(0, 10), hours: +exHours.toFixed(2) });
      }
    });
    const hoursPerDayDecl = parseFloat(get(cal, "HoursPerDay")) || 0;
    const hoursPerDayCalc = workingDays > 0 ? +(totalDailyHours / workingDays).toFixed(2) : 0;
    calendarsMap[calId] = {
      id: calId,
      name: get(cal, "Name") || `Calendar ${calId}`,
      type,
      isDefault: get(cal, "IsDefault") === "true",
      isPersonal: get(cal, "IsPersonal") === "true",
      baseCalendarId: get(cal, "BaseCalendarObjectId") || null,
      hoursPerDay: hoursPerDayDecl || hoursPerDayCalc || 8,
      hoursPerWeek: parseFloat(get(cal, "HoursPerWeek")) || +totalDailyHours.toFixed(2),
      hoursPerMonth: parseFloat(get(cal, "HoursPerMonth")) || 0,
      hoursPerYear: parseFloat(get(cal, "HoursPerYear")) || 0,
      workWeek,
      workingDays,
      holidays: holidays.sort(),
      exceptions: exceptions.sort((a, b) => a.date.localeCompare(b.date)),
      activityCount: 0
    };
  });
  // Count activities per calendar
  activities.forEach((a) => {
    if (a.calendarId && calendarsMap[a.calendarId]) {
      calendarsMap[a.calendarId].activityCount++;
    }
  });
  // v29.0.9.2: Re-compute durations using each activity's calendar HoursPerDay
  // (instead of the hardcoded /8 fallback used during initial parsing).
  // This is critical for projects with 10-hour or 12-hour shift calendars.
  activities.forEach((a) => {
    const cal = a.calendarId && calendarsMap[a.calendarId];
    const hpd = (cal && cal.hoursPerDay > 0) ? cal.hoursPerDay : 8;
    a._hoursPerDay = hpd;
    if (hpd !== 8) {
      // Recompute only when calendar differs from default 8h (avoid needless work)
      a.plannedDuration = (a._rawPlannedDurationHours || 0) / hpd;
      a.remainingDuration = (a._rawRemainingDurationHours || 0) / hpd;
      a.actualDuration = (a._rawActualDurationHours || 0) / hpd;
      a.atCompletionDuration = (a._rawAtCompletionDurationHours || 0) / hpd;
    }
  });
  const relationships = findAll(root, "Relationship").map((r) => {
    var _a;
    return {
      predId: get(r, "PredecessorActivityObjectId"),
      succId: get(r, "SuccessorActivityObjectId"),
      type: get(r, "Type"),
      lag: parseFloat((_a = get(r, "Lag")) != null ? _a : "0") || 0
    };
  });
  // ── ACTIVITY CODES (v27) ─────────────────────────────────────────────────
  // P6 XML structure:
  //   <ActivityCodeType ObjectId="1" Name="Discipline" .../>
  //   <ActivityCode ObjectId="10" CodeTypeObjectId="1" CodeValue="CIV" Description="Civil"/>
  //   <Activity><Code TypeObjectId="1" ValueObjectId="10"/></Activity>
  // Some exports use alternate tags: ActivityCodeAssignment, UDF, or inline Code blocks
  const codeTypesMap = {};
  findAll(root, "ActivityCodeType").forEach((ct) => {
    const id = get(ct, "ObjectId");
    if (!id) return;
    codeTypesMap[id] = {
      id,
      name: get(ct, "Name") || `Code ${id}`,
      scope: get(ct, "Scope") || "Project",
      length: parseInt(get(ct, "Length")) || 0
    };
  });
  const codeValuesMap = {};
  findAll(root, "ActivityCode").forEach((cv) => {
    const id = get(cv, "ObjectId");
    if (!id) return;
    codeValuesMap[id] = {
      id,
      typeId: get(cv, "CodeTypeObjectId"),
      value: get(cv, "CodeValue") || "",
      description: get(cv, "Description") || "",
      parentId: get(cv, "ParentObjectId") || ""
    };
  });
  // Build assignments: actId -> { typeId: { value, description, ... } }
  const codeAssignments = {};
  // Method A: standalone <ActivityCodeAssignment> elements
  findAll(root, "ActivityCodeAssignment").forEach((ca) => {
    const actObjId = get(ca, "ActivityObjectId");
    const typeId = get(ca, "ActivityCodeTypeObjectId") || get(ca, "TypeObjectId");
    const valueId = get(ca, "ActivityCodeObjectId") || get(ca, "ValueObjectId");
    if (!actObjId || !typeId || !valueId) return;
    if (!codeAssignments[actObjId]) codeAssignments[actObjId] = {};
    const cv = codeValuesMap[valueId];
    const ct = codeTypesMap[typeId];
    if (cv && ct) {
      codeAssignments[actObjId][typeId] = {
        typeName: ct.name,
        value: cv.value,
        description: cv.description
      };
    }
  });
  // Method B: inline <Code> blocks within each Activity
  if (Object.keys(codeAssignments).length === 0) {
    activityElements.forEach((aEl) => {
      const actObjId = get(aEl, "ObjectId");
      if (!actObjId) return;
      for (const child of aEl.children) {
        if (child.localName !== "Code") continue;
        const typeId = get(child, "TypeObjectId");
        const valueId = get(child, "ValueObjectId");
        if (!typeId || !valueId) continue;
        if (!codeAssignments[actObjId]) codeAssignments[actObjId] = {};
        const cv = codeValuesMap[valueId];
        const ct = codeTypesMap[typeId];
        if (cv && ct) {
          codeAssignments[actObjId][typeId] = {
            typeName: ct.name,
            value: cv.value,
            description: cv.description
          };
        }
      }
    });
  }
  // Attach codes to activities (keyed by actId for easy lookup downstream)
  // We use the activity's ObjectId for the lookup since assignments reference ObjectId
  const codesByActId = {};
  activities.forEach((a, idx) => {
    const objId = a.id; // 'id' field holds ObjectId in our parsed activity
    if (objId && codeAssignments[objId]) {
      codesByActId[a.actId] = codeAssignments[objId];
      a.codes = codeAssignments[objId];
    } else {
      a.codes = {};
    }
  });
  // Build summary: which code types are present + how many activities have each
  const codeTypesSummary = Object.values(codeTypesMap).map((ct) => {
    const assignedCount = Object.values(codeAssignments).filter((a) => a[ct.id]).length;
    const distinctValues = new Set(
      Object.values(codeAssignments).map((a) => { var _a; return (_a = a[ct.id]) == null ? void 0 : _a.value; }).filter(Boolean)
    ).size;
    return {
      id: ct.id,
      name: ct.name,
      scope: ct.scope,
      assignedCount,
      distinctValues,
      coverage: activities.length > 0 ? assignedCount / activities.length * 100 : 0
    };
  }).filter((ct) => ct.assignedCount > 0).sort((a, b) => b.assignedCount - a.assignedCount);
  return {
    project,
    activities,
    relationships,
    version: verMatch ? "V" + verMatch[1] : "?",
    wbsMap,
    // Activity Codes (v27)
    codeTypes: codeTypesMap,
    codeValues: codeValuesMap,
    codesByActId,
    codeTypesSummary,
    // Calendars (v29.0.9)
    calendars: calendarsMap,
    calendarTypeCounts,
    // Health metadata for Quick File Scan
    multiProject: allProjects.length > 1,
    projectCount: allProjects.length
  };
}
// ── v27.1 fix: Classification now uses BOTH filename AND folder path.
// When a user drops a folder like Project/Progress/W12.xml, the filename
// alone ("W12.xml") gives no signal — but the parent folder "Progress"
// makes the type obvious. We check the full path so subfolder names
// (Baseline/, Updates/, Original/, Recovery/, etc.) contribute to detection.
function classifyByName(filenameOrPath) {
  const raw = filenameOrPath || "";
  const n = raw.toLowerCase();
  // Extract the basename (last segment) for filename-specific patterns
  // The path may use / or \ as separator, depending on the source.
  const segments = n.split(/[\\/]/).filter(Boolean);
  const basename = segments.length > 0 ? segments[segments.length - 1] : n;
  const parentFolders = segments.slice(0, -1).join("/"); // everything except basename
  // ── 1. Check the BASENAME first (highest specificity) ──
  // Filename-level patterns are still the strongest signal because the
  // planner usually names individual files explicitly.
  const checkBase = (re) => re.test(basename);
  if (checkBase(/revised[\s_-]+(?:baseline|b[\s_.-]?l)(?:[\s_.-]|$)/)) return { type: "revised", confidence: 0.95 };
  if (checkBase(/original[\s_-]+(?:baseline|b[\s_.-]?l|schedule)/)) return { type: "original", confidence: 0.95 };
  if (checkBase(/revised[\s_-]+update(?:[\s_.-]|$)/)) return { type: "progress", confidence: 0.85 };
  if (checkBase(/update[d]?[\s_-]+revised(?:[\s_.-]|$)/)) return { type: "progress", confidence: 0.85 };
  if (checkBase(/(?:progress|forecast|current[\s_-]+updated|update[d]?[\s_-]+schedule)/)) return { type: "progress", confidence: 0.85 };
  if (checkBase(/(?:^|[-_\s])upd?(?:ate|ated|atd|d)?(?:[-_.\s]|$)/)) return { type: "progress", confidence: 0.9 };
  if (checkBase(/updated/)) return { type: "progress", confidence: 0.8 };
  if (checkBase(/recovery[\s_-]+(?:plan|schedule|baseline|b[\s_.-]?l)/)) return { type: "revised", confidence: 0.9 };
  if (checkBase(/(?:^|[-_\s])recovery(?:[-_.\s]|$)/)) return { type: "revised", confidence: 0.75 };
  if (checkBase(/(?:^|[-_\s])rev(?:ised)?(?:\.|[_-]|$)/)) return { type: "revised", confidence: 0.7 };
  if (checkBase(/(?:^|[-_\s])(?:baseline|b[\s_.-]?l)(?:[-_.\s]|$)/)) return { type: "baseline", confidence: 0.85 };
  if (checkBase(/actual/)) return { type: "progress", confidence: 0.7 };
  // ── 2. FOLDER-LEVEL patterns (v27.1) ──
  // If the basename gave nothing, look at folder names. Lower confidence
  // than direct filename match because folders can be ambiguous (e.g.
  // "Schedules" might contain both baselines and updates).
  if (parentFolders) {
    // Check each folder segment as a whole word — avoid matching
    // "progress" inside "in-progress-plans" by requiring word boundaries.
    const folderHas = (re) => segments.slice(0, -1).some((seg) => re.test(seg));
    // Strong signals (explicit type words as folder names)
    if (folderHas(/^revised[\s_-]+baseline$/)) return { type: "revised", confidence: 0.85, note: "folder-name" };
    if (folderHas(/^original[\s_-]+baseline$/)) return { type: "original", confidence: 0.85, note: "folder-name" };
    if (folderHas(/^recovery[\s_-]+(?:plan|schedule)?$/)) return { type: "revised", confidence: 0.8, note: "folder-name" };
    // Numeric prefixes are common: "01_Baseline", "02_Updates", "03_Progress"
    if (folderHas(/^(?:\d+[\s_-])?progress(?:es)?$/)) return { type: "progress", confidence: 0.85, note: "folder-name" };
    if (folderHas(/^(?:\d+[\s_-])?updates?$/)) return { type: "progress", confidence: 0.85, note: "folder-name" };
    if (folderHas(/^(?:\d+[\s_-])?forecasts?$/)) return { type: "progress", confidence: 0.8, note: "folder-name" };
    if (folderHas(/^(?:\d+[\s_-])?actuals?$/)) return { type: "progress", confidence: 0.8, note: "folder-name" };
    if (folderHas(/^(?:\d+[\s_-])?current$/)) return { type: "progress", confidence: 0.75, note: "folder-name" };
    if (folderHas(/^(?:\d+[\s_-])?(?:baseline|baselines|bl)$/)) return { type: "baseline", confidence: 0.85, note: "folder-name" };
    if (folderHas(/^(?:\d+[\s_-])?original$/)) return { type: "original", confidence: 0.8, note: "folder-name" };
    if (folderHas(/^(?:\d+[\s_-])?revised$/)) return { type: "revised", confidence: 0.8, note: "folder-name" };
    if (folderHas(/^(?:\d+[\s_-])?recovery$/)) return { type: "revised", confidence: 0.75, note: "folder-name" };
    // Slightly looser — folder CONTAINS the word (handles "Project_Progress_2026")
    if (folderHas(/progress/)) return { type: "progress", confidence: 0.7, note: "folder-name" };
    if (folderHas(/update/)) return { type: "progress", confidence: 0.7, note: "folder-name" };
    if (folderHas(/baseline/)) return { type: "baseline", confidence: 0.7, note: "folder-name" };
    if (folderHas(/original/)) return { type: "original", confidence: 0.7, note: "folder-name" };
    if (folderHas(/revised/)) return { type: "revised", confidence: 0.7, note: "folder-name" };
    if (folderHas(/recovery/)) return { type: "revised", confidence: 0.65, note: "folder-name" };
  }
  return { type: "unknown", confidence: 0 };
}
function classifyByContent(parsedFile) {
  const acts = parsedFile.activities || [];
  if (acts.length === 0) return { type: "unknown", confidence: 0 };
  const s = { "Not Started": 0, "In Progress": 0, "Completed": 0 };
  for (const a of acts) if (a.status in s) s[a.status]++;
  if (s["Not Started"] / acts.length > 0.99) return { type: "baseline-like", confidence: 0.95 };
  if (s["Completed"] + s["In Progress"] > 0) return { type: "progress-like", confidence: 0.95 };
  return { type: "unknown", confidence: 0.3 };
}
function finalClassify(filenameOrPath, parsedFile) {
  const byName = classifyByName(filenameOrPath);
  const byContent = classifyByContent(parsedFile);
  if (byName.confidence >= 0.85) {
    return byName;
  }
  if (["original", "revised", "baseline"].includes(byName.type) && byName.confidence > 0) {
    return byName;
  }
  if (byContent.type === "baseline-like") {
    return { type: "baseline", confidence: 0.75, note: "content-only" };
  }
  if (byContent.type === "progress-like") {
    if (byName.type === "progress") return byName;
    return { type: "progress", confidence: 0.75, note: "content-only" };
  }
  return byName.confidence > 0 ? byName : { type: "unknown", confidence: 0 };
}
function pickLatest(files, type) {
  const m = files.filter((f) => f.classification.type === type);
  if (m.length === 0) return null;
  if (m.length === 1) return m[0];
  return m.sort((a, b) => {
    const dA = a.parsed.project.dataDate ? new Date(a.parsed.project.dataDate) : null;
    const dB = b.parsed.project.dataDate ? new Date(b.parsed.project.dataDate) : null;
    if (dA && dB) return dB - dA;
    if (dA) return -1;
    if (dB) return 1;
    return (b.file.lastModified || 0) - (a.file.lastModified || 0);
  })[0];
}
const totalCost = (a) => (a.plannedNonLaborCost || 0) + (a.plannedLaborCost || 0) + (a.plannedMaterialCost || 0) + (a.plannedExpenseCost || 0);
const totalUnits = (a) => (a.plannedNonLaborUnits || 0) + (a.plannedLaborUnits || 0) + (a.plannedMaterialUnits || 0);
const totalActualCost = (a) => (a.actualNonLaborCost || 0) + (a.actualLaborCost || 0) + (a.actualMaterialCost || 0) + (a.actualExpenseCost || 0);
// ═══════════════════════════════════════════════════════════════════
// v28: BASELINE QUALITY AUDITOR (BQA)
// Comprehensive schedule quality assessment based on:
// - DCMA 14-Point Assessment (US Defense Contract Management Agency)
// - PMI Schedule Management Best Practices
// - GAO Schedule Assessment Guide (10 Best Practices)
// - AACE Recommended Practice 38R-06
// ═══════════════════════════════════════════════════════════════════

// Helper: get all activities + relationships safely
function _bqaGetData(baseline) {
  const acts = (baseline && baseline.activities) || [];
  const rels = (baseline && baseline.relationships) || [];
  const dataDate = baseline && baseline.project && baseline.project.dataDate
    ? new Date(baseline.project.dataDate)
    : new Date();
  return { acts, rels, dataDate };
}

// Helper: compute duration in days
function _bqaDuration(act) {
  // FIX BUG-13: num() returns 0 (not null) for missing fields, so != null is always true.
  // Use > 0 check, and prefer plannedDuration over atCompletion (more reliable in baselines).
  if (typeof act.plannedDuration === "number" && act.plannedDuration > 0) return act.plannedDuration;
  if (typeof act.atCompletionDuration === "number" && act.atCompletionDuration > 0) return act.atCompletionDuration;
  if (act.plannedStart && act.plannedFinish) {
    const s = new Date(act.plannedStart), f = new Date(act.plannedFinish);
    if (!isNaN(s) && !isNaN(f)) return Math.max(0, (f - s) / 86400000);
  }
  return 0;
}

// Helper: identify completed/in-progress activities
function _bqaIsActiveOrFuture(act) {
  const status = (act.status || "").toLowerCase();
  return !status.includes("completed") && !status.includes("complete");
}

// ═══════════════════ DCMA 14-POINT ASSESSMENT ═══════════════════

function bqaDCMA14(baseline) {
  const { acts, rels, dataDate } = _bqaGetData(baseline);
  const incomplete = acts.filter(_bqaIsActiveOrFuture);
  const totalIncomplete = incomplete.length;
  const totalActs = acts.length;
  const results = [];

  // Build relationship maps — FIX BUG-02: use predId/succId (actual XER parser field names)
  const predMap = {}, succMap = {};
  rels.forEach(r => {
    if (!r.succId || !r.predId) return;
    if (!predMap[r.succId]) predMap[r.succId] = [];
    if (!succMap[r.predId]) succMap[r.predId] = [];
    predMap[r.succId].push(r);
    succMap[r.predId].push(r);
  });

  // 1. LOGIC - Activities missing predecessor or successor
  const missingLogic = incomplete.filter(a => {
    const isMilestone = (a.type || "").toLowerCase().includes("milestone");
    const hasPred = (predMap[a.actId] || []).length > 0;
    const hasSucc = (succMap[a.actId] || []).length > 0;
    return !hasPred || !hasSucc;
  }).length;
  const logicPct = totalIncomplete > 0 ? (missingLogic / totalIncomplete) * 100 : 0;
  results.push({
    id: "DCMA-01", name: "Logic", nameAr: "المنطق",
    description: "Activities should have at least one predecessor and one successor (except project start/finish milestones).",
    descriptionAr: "يجب أن يكون لكل نشاط مسبق ولاحق على الأقل (باستثناء بداية ونهاية المشروع).",
    threshold: "≤ 5%", value: logicPct, unit: "%",
    pass: logicPct <= 5,
    severity: logicPct <= 5 ? "pass" : (logicPct <= 10 ? "warn" : "fail"),
    detail: `${missingLogic} of ${totalIncomplete} incomplete activities missing predecessor or successor`,
    detailAr: `${missingLogic} من ${totalIncomplete} نشاط غير مكتمل يفتقد للمسبق أو اللاحق`,
    affected: missingLogic,
    recommendation: logicPct > 5 ? "Add missing logic links. Run 'Schedule Log' in P6 → Check 'List of activities without predecessors/successors'." : null,
    recommendationAr: logicPct > 5 ? "أضف الروابط المنطقية المفقودة. شغّل Schedule Log في P6 → افحص قائمة الأنشطة بدون مسبق/لاحق." : null
  });

  // 2. LEADS - Negative lags
  const leads = rels.filter(r => Number(r.lag || 0) < 0).length;
  const leadPct = rels.length > 0 ? (leads / rels.length) * 100 : 0;
  results.push({
    id: "DCMA-02", name: "Leads", nameAr: "السبق (Lags سالبة)",
    description: "No relationships should have negative lag values. Leads can mask logic issues.",
    descriptionAr: "يجب ألا تكون أي علاقات بقيم Lag سالبة. السبق يخفي مشاكل المنطق.",
    threshold: "0%", value: leadPct, unit: "%",
    pass: leads === 0,
    severity: leads === 0 ? "pass" : (leadPct <= 2 ? "warn" : "fail"),
    detail: `${leads} relationships with negative lag`,
    detailAr: `${leads} علاقة بـ Lag سالب`,
    affected: leads,
    recommendation: leads > 0 ? "Replace leads with proper Start-to-Start logic. Negative lags hide schedule risk and break CPM analysis." : null,
    recommendationAr: leads > 0 ? "استبدل Leads بعلاقات Start-to-Start صحيحة. Lags السالبة تخفي المخاطر وتُفسد تحليل CPM." : null
  });

  // 3. LAGS - Positive lags
  const lags = rels.filter(r => Number(r.lag || 0) > 0).length;
  const lagPct = rels.length > 0 ? (lags / rels.length) * 100 : 0;
  results.push({
    id: "DCMA-03", name: "Lags", nameAr: "Lags موجبة",
    description: "Lag values should be minimal. Excessive lags often hide missing activities.",
    descriptionAr: "يجب أن تكون قيم Lag في أدنى حد. كثرة Lags تخفي أنشطة مفقودة.",
    threshold: "≤ 5%", value: lagPct, unit: "%",
    pass: lagPct <= 5,
    severity: lagPct <= 5 ? "pass" : (lagPct <= 10 ? "warn" : "fail"),
    detail: `${lags} relationships with positive lag (>0)`,
    detailAr: `${lags} علاقة بـ Lag موجب (>0)`,
    affected: lags,
    recommendation: lagPct > 5 ? "Replace long lags with intermediate activities (e.g., 'Curing', 'Approval Wait') for transparency." : null,
    recommendationAr: lagPct > 5 ? "استبدل Lags الطويلة بأنشطة وسيطة (مثل 'تصلّب الخرسانة'، 'انتظار اعتماد') لشفافية أكبر." : null
  });

  // 4. RELATIONSHIP TYPES - FS dominance
  // FIX BUG-11: P6 XML stores types as "Finish to Start", not "FS" short code
  const fsRels = rels.filter(r => {
    const t = (r.type || "").trim();
    return t === "Finish to Start" || t === "FS" || t === "";
  }).length;
  const fsPct = rels.length > 0 ? (fsRels / rels.length) * 100 : 0;
  results.push({
    id: "DCMA-04", name: "Relationship Types", nameAr: "أنواع العلاقات",
    description: "Finish-to-Start relationships should dominate (≥90%). Other types (SS, FF, SF) should be limited.",
    descriptionAr: "يجب أن تهيمن علاقات Finish-to-Start (≥90%). الأنواع الأخرى (SS, FF, SF) محدودة.",
    threshold: "≥ 90% FS", value: fsPct, unit: "%",
    pass: fsPct >= 90,
    severity: fsPct >= 90 ? "pass" : (fsPct >= 80 ? "warn" : "fail"),
    detail: `${fsRels} of ${rels.length} relationships are FS`,
    detailAr: `${fsRels} من ${rels.length} علاقة من نوع FS`,
    affected: rels.length - fsRels,
    recommendation: fsPct < 90 ? "Review SS/FF/SF relationships. Most can be replaced with FS by splitting activities into smaller chunks." : null,
    recommendationAr: fsPct < 90 ? "راجع علاقات SS/FF/SF. أغلبها يمكن استبداله بـ FS بتقسيم الأنشطة لأجزاء أصغر." : null
  });

  // 5. HARD CONSTRAINTS
  const hardConstraintTypes = ["Start On", "Finish On", "Mandatory Start", "Mandatory Finish", "Must Start On", "Must Finish On"];
  const hardConstrained = incomplete.filter(a => {
    const c = (a.constraintType || "").trim();
    return hardConstraintTypes.some(h => c.toLowerCase().includes(h.toLowerCase()));
  }).length;
  const hardPct = totalIncomplete > 0 ? (hardConstrained / totalIncomplete) * 100 : 0;
  results.push({
    id: "DCMA-05", name: "Hard Constraints", nameAr: "القيود الصلبة",
    description: "Hard constraints prevent natural CPM calculation. Should be ≤5% of activities.",
    descriptionAr: "القيود الصلبة تمنع حساب CPM الطبيعي. يجب أن تكون ≤5% من الأنشطة.",
    threshold: "≤ 5%", value: hardPct, unit: "%",
    pass: hardPct <= 5,
    severity: hardPct <= 5 ? "pass" : (hardPct <= 10 ? "warn" : "fail"),
    detail: `${hardConstrained} activities with hard constraints`,
    detailAr: `${hardConstrained} نشاط بقيود صلبة`,
    affected: hardConstrained,
    recommendation: hardPct > 5 ? "Replace hard constraints with logic relationships. Use soft constraints (Start No Earlier Than) when needed." : null,
    recommendationAr: hardPct > 5 ? "استبدل القيود الصلبة بعلاقات منطقية. استخدم القيود المرنة (Start No Earlier Than) عند الحاجة." : null
  });

  // 6. HIGH FLOAT (>44 days)
  const highFloat = incomplete.filter(a => {
    const tf = Number(a.totalFloat || 0);
    return tf > 44;
  }).length;
  const highFloatPct = totalIncomplete > 0 ? (highFloat / totalIncomplete) * 100 : 0;
  results.push({
    id: "DCMA-06", name: "High Float", nameAr: "Float عالي (>44 يوم)",
    description: "Activities with total float > 44 working days indicate missing logic or unrealistic durations.",
    descriptionAr: "الأنشطة بـ Float إجمالي > 44 يوم عمل تشير لمنطق مفقود أو مدد غير واقعية.",
    threshold: "≤ 5%", value: highFloatPct, unit: "%",
    pass: highFloatPct <= 5,
    severity: highFloatPct <= 5 ? "pass" : (highFloatPct <= 10 ? "warn" : "fail"),
    detail: `${highFloat} activities with float > 44 days`,
    detailAr: `${highFloat} نشاط بـ Float > 44 يوم`,
    affected: highFloat,
    recommendation: highFloatPct > 5 ? "Investigate high-float activities. Often missing successors or have unrealistic constraints." : null,
    recommendationAr: highFloatPct > 5 ? "افحص الأنشطة بـ Float عالي. غالباً تفتقد للاحقين أو لديها قيود غير واقعية." : null
  });

  // 7. NEGATIVE FLOAT
  const negFloat = incomplete.filter(a => Number(a.totalFloat || 0) < 0).length;
  results.push({
    id: "DCMA-07", name: "Negative Float", nameAr: "Float سالب",
    description: "No activities should have negative float. Indicates schedule slippage or impossible dates.",
    descriptionAr: "يجب ألا يكون لأي نشاط Float سالب. يشير لانزلاق في الجدول أو تواريخ مستحيلة.",
    threshold: "0 activities", value: negFloat, unit: " activities",
    pass: negFloat === 0,
    severity: negFloat === 0 ? "pass" : "fail",
    detail: `${negFloat} activities with negative float`,
    detailAr: `${negFloat} نشاط بـ Float سالب`,
    affected: negFloat,
    recommendation: negFloat > 0 ? "Resolve negative float by adjusting durations, removing constraints, or rebaselining." : null,
    recommendationAr: negFloat > 0 ? "حلّ Float السالب بتعديل المدد، إزالة القيود، أو إعادة Baseline." : null
  });

  // 8. HIGH DURATION (>44 days)
  const highDur = incomplete.filter(a => _bqaDuration(a) > 44).length;
  const highDurPct = totalIncomplete > 0 ? (highDur / totalIncomplete) * 100 : 0;
  results.push({
    id: "DCMA-08", name: "High Duration", nameAr: "مدة عالية (>44 يوم)",
    description: "Activities longer than 44 working days should be broken into smaller, manageable tasks.",
    descriptionAr: "الأنشطة الأطول من 44 يوم عمل يجب تقسيمها لمهام أصغر يمكن إدارتها.",
    threshold: "≤ 5%", value: highDurPct, unit: "%",
    pass: highDurPct <= 5,
    severity: highDurPct <= 5 ? "pass" : (highDurPct <= 10 ? "warn" : "fail"),
    detail: `${highDur} activities with duration > 44 days`,
    detailAr: `${highDur} نشاط بمدة > 44 يوم`,
    affected: highDur,
    recommendation: highDurPct > 5 ? "Break long activities into smaller chunks (max 44 days). Improves tracking accuracy and risk visibility." : null,
    recommendationAr: highDurPct > 5 ? "قسّم الأنشطة الطويلة لأجزاء أصغر (حد أقصى 44 يوم). يحسّن دقة المتابعة ووضوح المخاطر." : null
  });

  // 9. INVALID DATES
  const dataDateMs = dataDate.getTime();
  const invalidDates = acts.filter(a => {
    if (a.actualStart && new Date(a.actualStart).getTime() > dataDateMs) return true;
    if (a.actualFinish && new Date(a.actualFinish).getTime() > dataDateMs) return true;
    const status = (a.status || "").toLowerCase();
    if (!status.includes("complete") && !status.includes("progress")) {
      if (a.plannedStart && new Date(a.plannedStart).getTime() < dataDateMs) return true;
    }
    return false;
  }).length;
  results.push({
    id: "DCMA-09", name: "Invalid Dates", nameAr: "تواريخ غير صحيحة",
    description: "No actual dates in the future, no future planned dates in the past relative to data date.",
    descriptionAr: "لا تواريخ فعلية في المستقبل، ولا تواريخ مخططة مستقبلية في الماضي مقارنة بـ Data Date.",
    threshold: "0 activities", value: invalidDates, unit: " activities",
    pass: invalidDates === 0,
    severity: invalidDates === 0 ? "pass" : "fail",
    detail: `${invalidDates} activities with invalid dates`,
    detailAr: `${invalidDates} نشاط بتواريخ غير صحيحة`,
    affected: invalidDates,
    recommendation: invalidDates > 0 ? "Update Data Date and reschedule. Verify actual dates are in the past, planned dates are in the future." : null,
    recommendationAr: invalidDates > 0 ? "حدّث Data Date وأعد الجدولة. تأكد أن التواريخ الفعلية في الماضي، والمخططة في المستقبل." : null
  });

  // 10. RESOURCES
  const withResources = acts.filter(a => {
    return (a.plannedLaborCost || 0) + (a.plannedNonLaborCost || 0) + (a.plannedMaterialCost || 0) +
           (a.plannedLaborUnits || 0) + (a.plannedNonLaborUnits || 0) > 0;
  }).length;
  const resPct = totalActs > 0 ? (withResources / totalActs) * 100 : 0;
  results.push({
    id: "DCMA-10", name: "Resources", nameAr: "الموارد",
    description: "Schedule should be resource-loaded. Activities without resources may not be properly planned.",
    descriptionAr: "يجب تحميل الموارد على الجدول. الأنشطة بدون موارد قد لا تكون مخططة بشكل صحيح.",
    threshold: "Resource loaded", value: resPct, unit: "%",
    pass: resPct >= 50,
    severity: resPct >= 80 ? "pass" : (resPct >= 50 ? "warn" : "fail"),
    detail: `${withResources} of ${totalActs} activities have resources/costs assigned`,
    detailAr: `${withResources} من ${totalActs} نشاط محمّل بموارد/تكاليف`,
    affected: totalActs - withResources,
    recommendation: resPct < 80 ? "Load resources (labor, materials, costs) on activities for accurate EVM and cash flow analysis." : null,
    recommendationAr: resPct < 80 ? "حمّل الموارد (عمالة، مواد، تكاليف) على الأنشطة لـ EVM وتدفق نقدي دقيقَيْن." : null
  });

  // 11. MISSED TASKS - activities that should have started but haven't
  const missed = acts.filter(a => {
    const status = (a.status || "").toLowerCase();
    if (status.includes("complete")) return false;
    if (a.actualStart) return false;
    if (!a.plannedStart) return false;
    return new Date(a.plannedStart).getTime() < dataDateMs;
  }).length;
  const missedPct = totalActs > 0 ? (missed / totalActs) * 100 : 0;
  results.push({
    id: "DCMA-11", name: "Missed Tasks", nameAr: "مهام متأخرة",
    description: "Activities that should have started by data date but haven't. Indicates schedule slippage.",
    descriptionAr: "أنشطة كان يجب بدؤها قبل Data Date لكنها لم تبدأ. تشير لانزلاق الجدول.",
    threshold: "≤ 5%", value: missedPct, unit: "%",
    pass: missedPct <= 5,
    severity: missedPct <= 5 ? "pass" : (missedPct <= 10 ? "warn" : "fail"),