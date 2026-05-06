// ═══════════════════════════════════════════════════════════════════
// 02_milestones_and_calendars_HIJRI.js — v29.0.10
// Lines 2797 - 3299 (of 19822 total)
// Saudi holidays + auditCalendarSAHolidays
// ═══════════════════════════════════════════════════════════════════

  }
  return filtered;
}

// Check which expected SA holidays are configured in the calendar's holidays list
function auditCalendarSAHolidays(calendar, projectStart, projectFinish) {
  if (!calendar) return { audit: [], missing: [], present: [], coveragePct: 0, hijriWarning: null };
  const expected = buildExpectedSAHolidays(projectStart, projectFinish);
  const calendarDates = new Set(calendar.holidays || []);
  const audit = expected.map((exp) => {
    let isConfigured = calendarDates.has(exp.date);
    // For multi-day holidays, check if any day in the range is configured
    if (!isConfigured && exp.endDate) {
      const start = new Date(exp.date);
      const end = new Date(exp.endDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const ds = d.toISOString().slice(0, 10);
        if (calendarDates.has(ds)) {
          isConfigured = true;
          break;
        }
      }
    }
    return { ...exp, configured: isConfigured };
  });
  const present = audit.filter((a) => a.configured);
  const missing = audit.filter((a) => !a.configured);
  return {
    audit,
    present,
    missing,
    coveragePct: audit.length > 0 ? +(present.length / audit.length * 100).toFixed(1) : 0,
    // v29.0.9.2: Surface Hijri-table-outdated warning to UI
    hijriWarning: expected._warning || null
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// v29.0.9.1 — NG SCHEDULE QUALITY COMPLIANCE CHECKER
// Per NG SA Manual Section 8.1.2.4
// ═══════════════════════════════════════════════════════════════════════════
const NG_COMPLIANCE_RULES = [
  {
    id: "duration_15days",
    label_en: "Activity Duration \u2264 15 days",
    label_ar: "\u0645\u062F\u0629 \u0627\u0644\u0646\u0634\u0627\u0637 \u2264 15 \u064A\u0648\u0645",
    severity: "warning", manual: "Section N",
    check: (acts) => {
      const violations = (acts || []).filter((a) => a && !a.isMilestone && !a.isSummary && (a.plannedDuration || 0) > 15).length;
      const total = (acts || []).filter((a) => a && !a.isMilestone && !a.isSummary).length || 1;
      return { passed: violations === 0, violations, total, score: Math.max(0, 100 - (violations / total * 100)) };
    }
  },
  {
    id: "lag_10days",
    label_en: "Lag Time \u2264 10 days (no negative lag)",
    label_ar: "\u0641\u062A\u0631\u0629 \u0627\u0644\u062A\u0623\u062E\u064A\u0631 \u2264 10 \u0623\u064A\u0627\u0645",
    severity: "warning", manual: "Section O",
    check: (acts, rels) => {
      const r = (rels || []);
      const total = r.length || 1;
      const negLag = r.filter((x) => (x.lag || 0) < 0).length;
      const longLag = r.filter((x) => (x.lag || 0) > 10).length;
      const violations = negLag + longLag;
      return {
        passed: violations === 0, violations, total,
        details: { negativeLag: negLag, longLag: longLag },
        score: Math.max(0, 100 - (violations / total * 100))
      };
    }
  },
  {
    id: "open_ends",
    label_en: "No Open Ends (except start/finish)",
    label_ar: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u0646\u0634\u0637\u0629 \u0628\u062F\u0648\u0646 \u0639\u0644\u0627\u0642\u0627\u062A",
    severity: "critical", manual: "Section G",
    check: (acts, rels) => {
      const r = (rels || []);
      // FIX BUG-01 (revised): predId/succId in XER parser are ObjectIds (a.id),
      // NOT activity Ids (a.actId). Match on a.id, fallback to a.actId.
      const hasPredecessor = new Set();
      const hasSuccessor = new Set();
      for (const x of r) {
        if (x.succId) hasPredecessor.add(x.succId);
        if (x.predId) hasSuccessor.add(x.predId);
      }
      const real = (acts || []).filter((a) => a && !a.isSummary);
      const noPred = real.filter((a) => {
        const key = a.id || a.actId;
        return !hasPredecessor.has(key);
      });
      const noSucc = real.filter((a) => {
        const key = a.id || a.actId;
        return !hasSuccessor.has(key);
      });
      // Allow ONE start and ONE finish milestone
      const violations = Math.max(0, noPred.length - 1) + Math.max(0, noSucc.length - 1);
      const total = real.length || 1;
      return { passed: violations === 0, violations, total, score: Math.max(0, 100 - (violations / total * 100)) };
    }
  },
  {
    id: "tcc_milestone",
    label_en: "TCC Milestone exists in schedule",
    label_ar: "\u062A\u0648\u0627\u062C\u062F TCC milestone \u0641\u064A \u0627\u0644\u062C\u062F\u0648\u0644",
    severity: "critical", manual: "Section M",
    check: (acts) => {
      // FIX BUG-05: renamed from "exists with constraint" to "exists in schedule"
      // because the check only verifies existence, not constraint presence
      // A separate constraint check would need constraint data from XER
      const tcc = (acts || []).find((a) => a && /\bTCC\b/i.test(a.name || a.actName || ""));
      const passed = !!tcc;
      return { passed, violations: passed ? 0 : 1, total: 1, score: passed ? 100 : 0 };
    }
  },
  {
    id: "wbs_levels",
    label_en: "WBS has \u2265 3 levels",
    label_ar: "\u0647\u064A\u0643\u0644 WBS \u064A\u062D\u062A\u0648\u064A \u2265 3 \u0645\u0633\u062A\u0648\u064A\u0627\u062A",
    severity: "info", manual: "Section H",
    check: (acts, rels, wbsMap) => {
      if (!wbsMap || Object.keys(wbsMap).length === 0) return { passed: false, violations: 1, total: 1, score: 0 };
      const computeDepth = (id, depth) => {
        const w = wbsMap[id]; if (!w || depth > 10) return depth;
        return w.parentId ? computeDepth(w.parentId, depth + 1) : depth;
      };
      const maxDepth = Math.max(...Object.keys(wbsMap).map((k) => computeDepth(k, 1)), 1);
      return { passed: maxDepth >= 3, violations: maxDepth >= 3 ? 0 : 1, total: 1, score: Math.min(100, maxDepth / 5 * 100), details: { maxDepth } };
    }
  },
  {
    id: "milestone_count",
    label_en: "Has \u2265 5 milestones",
    label_ar: "\u064A\u062D\u062A\u0648\u064A \u2265 5 \u0623\u062D\u062F\u0627\u062B \u0645\u0641\u0635\u0644\u064A\u0629",
    severity: "info", manual: "Section M",
    check: (acts) => {
      const milestones = (acts || []).filter((a) => a && (a.isMilestone || (a.plannedDuration === 0 && (a.type || "").toLowerCase().includes("milestone")))).length;
      return { passed: milestones >= 5, violations: milestones < 5 ? (5 - milestones) : 0, total: 5, score: Math.min(100, milestones / 5 * 100), details: { count: milestones } };
    }
  },
  {
    id: "calendar_compliance",
    label_en: "Activities use Global calendars only",
    label_ar: "\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u062A\u0642\u0627\u0648\u064A\u0645 \u0627\u0644\u0639\u0627\u0644\u0645\u064A \u0641\u0642\u0637",
    severity: "info", manual: "Section R",
    check: (acts) => {
      const real = (acts || []).filter((a) => a && !a.isSummary);
      const total = real.length || 1;
      // NG manual mandates global calendars only (not project/resource level)
      // Rough heuristic: count distinct calendar IDs; flag if too many
      const calendarIds = new Set();
      for (const a of real) {
        const calId = a.calendarId || a.calId || a.calendar || (a._raw && (a._raw.calendarId || a._raw.calId)) || null;
        if (calId) calendarIds.add(calId);
      }
      // Heuristic: > 8 distinct calendars suggests project/resource calendars in use
      // Acceptable: 1-5 globals (e.g., 5-Day, 6-Day, 7-Day, Concrete, Holidays)
      const distinctCount = calendarIds.size;
      const violations = distinctCount > 8 ? (distinctCount - 8) : 0;
      const passed = distinctCount <= 8;
      return {
        passed, violations,
        total: distinctCount,
        score: distinctCount === 0 ? 50 : distinctCount <= 5 ? 100 : distinctCount <= 8 ? 80 : Math.max(0, 100 - (distinctCount - 8) * 10),
        details: { distinctCalendars: distinctCount }
      };
    }
  }
];

function runComplianceCheck(activities, relationships, wbsMap) {
  const results = [];
  let totalScore = 0;
  let weightSum = 0;
  for (const rule of NG_COMPLIANCE_RULES) {
    const result = rule.check(activities, relationships, wbsMap);
    const weight = rule.severity === "critical" ? 3 : rule.severity === "warning" ? 2 : 1;
    weightSum += weight;
    totalScore += result.score * weight;
    results.push({
      id: rule.id, label_en: rule.label_en, label_ar: rule.label_ar,
      severity: rule.severity, manual: rule.manual,
      passed: result.passed, violations: result.violations, total: result.total,
      score: +result.score.toFixed(1), details: result.details || null
    });
  }
  const overallScore = weightSum > 0 ? +(totalScore / weightSum).toFixed(1) : 0;
  return { results, overallScore };
}

// ═══════════════════════════════════════════════════════════════════════════
// v29.0.9.1 — FILENAME CONVENTION VALIDATOR (per NG SA Section 8.1.1.9)
// Pattern: ####-{V}{TYPE}{N}
//   #### = project number, V = version, TYPE = BPS/MP/WP/AB/TIA/RS, N = sequence
// ═══════════════════════════════════════════════════════════════════════════
const NG_FILENAME_TYPES = {
  BPS: { en: "Baseline Progress Schedule @ Award", ar: "\u062E\u0637\u0629 \u0627\u0644\u0623\u0633\u0627\u0633" },
  MP:  { en: "Monthly Progress Schedule", ar: "\u062A\u0642\u062F\u0645 \u0634\u0647\u0631\u064A" },
  WP:  { en: "Weekly Progress Schedule", ar: "\u062A\u0642\u062F\u0645 \u0623\u0633\u0628\u0648\u0639\u064A" },
  AB:  { en: "As-Built Progress Schedule", ar: "\u0627\u0644\u062C\u062F\u0648\u0644 \u0627\u0644\u0641\u0639\u0644\u064A" },
  TIA: { en: "Time Impact Analysis", ar: "\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u062A\u0623\u062B\u064A\u0631 \u0627\u0644\u0632\u0645\u0646\u064A" },
  RS:  { en: "Recovery Schedule", ar: "\u062C\u062F\u0648\u0644 \u0627\u0633\u062A\u062F\u0631\u0627\u0643" }
};

function validateNGFilename(filename) {
  if (!filename) return { valid: false, reason: "empty" };
  const base = String(filename).replace(/\.(xer|xml|zip)$/i, "");
  // Pattern: ####-{version}{TYPE}{sequence?}
  const m = base.match(/^(\d{3,5})-(\d+)(BPS|MP|WP|AB|TIA|RS)(\d*)$/i);
  if (!m) return { valid: false, reason: "format_mismatch", filename: base };
  const [, projectNum, version, typeRaw, seq] = m;
  const type = typeRaw.toUpperCase();
  return {
    valid: true,
    projectNumber: projectNum,
    version: parseInt(version, 10),
    type,
    typeName_en: NG_FILENAME_TYPES[type].en,
    typeName_ar: NG_FILENAME_TYPES[type].ar,
    sequence: seq ? parseInt(seq, 10) : null,
    filename: base
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// v29.0.9.1 — RECOVERY SCHEDULE TRIGGER (per NG SA Section 8.2.2.3)
// "If any activity is delayed >= 10% of contract duration → Recovery Required"
// ═══════════════════════════════════════════════════════════════════════════
function checkRecoveryTrigger(activities, contractDurationDays) {
  if (!activities || activities.length === 0 || !contractDurationDays || contractDurationDays <= 0) {
    return { triggered: false, threshold: 0, delayedActivities: [], totalDelayed: 0, slipPct: 0 };
  }
  const thresholdDays = contractDurationDays * 0.10;
  const delayed = [];
  for (const a of activities) {
    if (!a || a.isSummary) continue;
    const planned = a.plannedFinish ? new Date(a.plannedFinish) : null;
    const projected = a.actualFinish || a.projectedFinish || a.forecastFinish;
    const proj = projected ? new Date(projected) : null;
    if (!planned || !proj) continue;
    const slipDays = Math.round((proj - planned) / 86400000);
    // Only track activities that are actually delayed (positive slip)
    if (slipDays > 0) {
      delayed.push({
        actId: a.actId, name: a.name || a.actName,
        plannedFinish: a.plannedFinish, projectedFinish: projected,
        slipDays, slipPct: +(slipDays / contractDurationDays * 100).toFixed(1)
      });
    }
  }
  delayed.sort((a, b) => b.slipDays - a.slipDays);

  // FIX BUG-06: triggered = worst activity slip >= 10% of contract duration
  // Per NG SA Section 8.2.2.3, recovery is required when any milestone/critical
  // activity slips by >= 10% of contract duration (not just any activity)
  const worstSlip = delayed.length > 0 ? delayed[0].slipDays : 0;
  const worstSlipPct = +(worstSlip / contractDurationDays * 100).toFixed(1);
  const triggered = worstSlip >= thresholdDays;

  return {
    triggered,
    threshold: +thresholdDays.toFixed(0),
    contractDurationDays,
    slipPct: worstSlipPct,           // FIX BUG-07: expose slipPct at top level for Narrative Report
    worstSlipDays: worstSlip,
    delayedActivities: delayed.slice(0, 50),
    totalDelayed: delayed.length
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// v29.0.9.1 — NG GLOSSARY (40+ terms with bilingual definitions)
// Used by tooltip system on hover
// ═══════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════
// v29.0.9 — PRE-COMMISSIONING CHECK LIST (per NG SA Section 8.1.1.6.1)
// 11 mandatory pre-check activities for HV substation projects
// ═══════════════════════════════════════════════════════════════════════════
const NG_PRECOMM_CHECKS = [
  {
    id: "control_cable_insulation",
    name_en: "Control cable insulation test", name_ar: "\u0641\u062D\u0635 \u0639\u0632\u0644 \u0643\u0627\u0628\u0644\u0627\u062A \u0627\u0644\u062A\u062D\u0643\u0645",
    witnessing_en: "Pre-check results checked by CSD on site visit", witnessing_ar: "\u062A\u062D\u0642\u0642 CSD \u0641\u064A \u0632\u064A\u0627\u0631\u0629 \u0627\u0644\u0645\u0648\u0642\u0639",
    witnessPct: null,
    patterns: [/\bcontrol\s+cable\s+insulation\b/i, /\bcable\s+insulation\s+test\b/i]
  },
  {
    id: "ct_vt_test",
    name_en: "CT and VT test", name_ar: "\u0641\u062D\u0635 \u0645\u062D\u0648\u0644\u0627\u062A \u0627\u0644\u062A\u064A\u0627\u0631 \u0648\u0627\u0644\u062C\u0647\u062F",
    witnessing_en: "20% sample", witnessing_ar: "\u0639\u064A\u0651\u0646\u0629 20%",
    witnessPct: 20,
    patterns: [/\b(CT|VT)\s+(test|tests|testing)\b/i, /\bcurrent\s+transformer\s+test\b/i, /\bvoltage\s+transformer\s+test\b/i]
  },
  {
    id: "aux_relay",
    name_en: "Auxiliary relay and trip relay", name_ar: "\u0645\u0631\u062D\u0644\u0627\u062A \u0627\u0644\u0645\u0633\u0627\u0639\u062F\u0629 \u0648\u0627\u0644\u0641\u0635\u0644",
    witnessing_en: "5% (Trip relays 100%)", witnessing_ar: "5% (\u0645\u0631\u062D\u0644\u0627\u062A \u0627\u0644\u0641\u0635\u0644 100%)",
    witnessPct: 5,
    patterns: [/\b(auxiliary|aux)\s+relay\b/i, /\btrip\s+relay\b/i]
  },
  {
    id: "timers",
    name_en: "Timers", name_ar: "\u0627\u0644\u0645\u0624\u0642\u062A\u0627\u062A",
    witnessing_en: "20% sample", witnessing_ar: "\u0639\u064A\u0651\u0646\u0629 20%",
    witnessPct: 20,
    patterns: [/\btimers?\s+(test|testing|check)\b/i, /\btiming\s+relay\b/i]
  },
  {
    id: "mcb",
    name_en: "MCB (Miniature Circuit Breaker)", name_ar: "\u0642\u0648\u0627\u0637\u0639 \u062F\u0648\u0627\u0626\u0631 \u0635\u063A\u064A\u0631\u0629",
    witnessing_en: "5% sample", witnessing_ar: "\u0639\u064A\u0651\u0646\u0629 5%",
    witnessPct: 5,
    patterns: [/\bMCB\b/i, /\bminiature\s+circuit\s+breaker\b/i]
  },
  {
    id: "mccb",
    name_en: "MCCB (Molded Case Circuit Breaker)", name_ar: "\u0642\u0648\u0627\u0637\u0639 \u062F\u0648\u0627\u0626\u0631 \u0645\u0635\u0628\u0648\u0628\u0629",
    witnessing_en: "20% sample", witnessing_ar: "\u0639\u064A\u0651\u0646\u0629 20%",
    witnessPct: 20,
    patterns: [/\bMCCB\b/i, /\bmolded\s+case\s+circuit\s+breaker\b/i]
  },
  {
    id: "protection_relays",
    name_en: "Acceptance test for protection and control relays", name_ar: "\u0641\u062D\u0635 \u0642\u0628\u0648\u0644 \u0645\u0631\u062D\u0644\u0627\u062A \u0627\u0644\u062D\u0645\u0627\u064A\u0629",
    witnessing_en: "Typical", witnessing_ar: "\u0646\u0645\u0648\u0630\u062C\u064A",
    witnessPct: null,
    patterns: [/\b(protection|control)\s+relay\s+(test|acceptance)\b/i, /\bacceptance\s+test\s+(for\s+)?(protection|control)\b/i]
  },
  {
    id: "meters",
    name_en: "Meters", name_ar: "\u0627\u0644\u0639\u062F\u0627\u062F\u0627\u062A",
    witnessing_en: "20% (Energy meters 100%)", witnessing_ar: "20% (\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0637\u0627\u0642\u0629 100%)",
    witnessPct: 20,
    patterns: [/\bmeter(s)?\s+(test|testing|check|calibration)\b/i, /\benergy\s+meter\b/i]
  },
  {
    id: "metrosil",
    name_en: "Metrosil", name_ar: "Metrosil",
    witnessing_en: "Sample", witnessing_ar: "\u0639\u064A\u0651\u0646\u0629",
    witnessPct: null,
    patterns: [/\bmetrosil\b/i]
  },
  {
    id: "scheme_check",
    name_en: "Scheme check for protection/control panels", name_ar: "\u0641\u062D\u0635 \u0633\u0643\u064A\u0645\u0627\u062A \u0644\u0648\u062D\u0627\u062A \u0627\u0644\u062D\u0645\u0627\u064A\u0629",
    witnessing_en: "Typical + 20%", witnessing_ar: "\u0646\u0645\u0648\u0630\u062C\u064A + 20%",
    witnessPct: 20,
    patterns: [/\bscheme\s+check\b/i, /\bschematic\s+check\b/i, /\bprotection\s+panel\s+(check|test)\b/i]
  },
  {
    id: "annunciator",
    name_en: "Annunciator", name_ar: "\u0644\u0648\u062D\u0629 \u0627\u0644\u0625\u0646\u0630\u0627\u0631",
    witnessing_en: "Pre-check results checked by CSD on site visit", witnessing_ar: "\u062A\u062D\u0642\u0642 CSD \u0641\u064A \u0632\u064A\u0627\u0631\u0629 \u0627\u0644\u0645\u0648\u0642\u0639",
    witnessPct: null,
    patterns: [/\bannunciator\b/i]
  }
];

function checkPreCommissioningCompliance(activities) {
  const results = [];
  for (const check of NG_PRECOMM_CHECKS) {
    const matches = [];
    for (const act of (activities || [])) {
      if (!act) continue;
      const name = act.name || act.actName || "";
      if (check.patterns.some((p) => p.test(name))) matches.push(act);
    }
    const status = (function() {
      if (matches.length === 0) return "missing";
      const completed = matches.filter((m) => (m.actualFinish || (m.status || "").toLowerCase() === "completed")).length;
      const inProgress = matches.filter((m) => (m.actualStart && !m.actualFinish) || (m.status || "").toLowerCase() === "in progress").length;
      if (completed === matches.length) return "completed";
      if (inProgress > 0 || completed > 0) return "in_progress";
      return "not_started";
    })();
    results.push({
      check, found: matches.length > 0, count: matches.length, instances: matches, status
    });
  }
  return results;
}

const NG_GLOSSARY = {
  TCC: { en: "Technical Completion Certificate - Date specified in contract for project completion", ar: "\u0634\u0647\u0627\u062F\u0629 \u0627\u0644\u0625\u0646\u062C\u0627\u0632 \u0627\u0644\u0641\u0646\u064A - \u062A\u0627\u0631\u064A\u062E \u0625\u0643\u0645\u0627\u0644 \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u0648\u0641\u0642 \u0627\u0644\u0639\u0642\u062F" },
  PAC: { en: "Provisional Acceptance Certificate", ar: "\u0634\u0647\u0627\u062F\u0629 \u0627\u0644\u0642\u0628\u0648\u0644 \u0627\u0644\u0645\u0628\u062F\u0626\u064A" },
  FAC: { en: "Final Acceptance Certificate", ar: "\u0634\u0647\u0627\u062F\u0629 \u0627\u0644\u0642\u0628\u0648\u0644 \u0627\u0644\u0646\u0647\u0627\u0626\u064A" },
  CPM: { en: "Critical Path Method - Network analysis to predict project duration", ar: "\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u0645\u0633\u0627\u0631 \u0627\u0644\u062D\u0631\u062C - \u062A\u062D\u0644\u064A\u0644 \u0634\u0628\u0643\u064A \u0644\u062A\u0648\u0642\u0639 \u0645\u062F\u0629 \u0627\u0644\u0645\u0634\u0631\u0648\u0639" },
  WBS: { en: "Work Breakdown Structure - Hierarchical decomposition of project deliverables", ar: "\u0647\u064A\u0643\u0644 \u062A\u0642\u0633\u064A\u0645 \u0627\u0644\u0639\u0645\u0644 - \u062A\u0641\u0643\u064A\u0643 \u0647\u0631\u0645\u064A \u0644\u0645\u062E\u0631\u062C\u0627\u062A \u0627\u0644\u0645\u0634\u0631\u0648\u0639" },
  XER: { en: "Primavera Enterprise File format containing all schedule data", ar: "\u0635\u064A\u063A\u0629 \u0645\u0644\u0641 Primavera \u062A\u062D\u062A\u0648\u064A \u062C\u0645\u064A\u0639 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062C\u062F\u0648\u0644" },
  SPI: { en: "Schedule Performance Index = EV / PV. >1 ahead, <1 behind", ar: "\u0645\u0624\u0634\u0631 \u0623\u062F\u0627\u0621 \u0627\u0644\u062C\u062F\u0648\u0644 = EV / PV" },
  CPI: { en: "Cost Performance Index = EV / AC. >1 under budget, <1 over", ar: "\u0645\u0624\u0634\u0631 \u0623\u062F\u0627\u0621 \u0627\u0644\u062A\u0643\u0644\u0641\u0629 = EV / AC" },
  SV:  { en: "Schedule Variance = EV - PV. Positive = ahead", ar: "\u0627\u0646\u062D\u0631\u0627\u0641 \u0627\u0644\u062C\u062F\u0648\u0644 = EV - PV" },
  CV:  { en: "Cost Variance = EV - AC. Positive = under budget", ar: "\u0627\u0646\u062D\u0631\u0627\u0641 \u0627\u0644\u062A\u0643\u0644\u0641\u0629 = EV - AC" },
  EAC: { en: "Estimated At Completion - Forecast total cost", ar: "\u0627\u0644\u062A\u0643\u0644\u0641\u0629 \u0627\u0644\u0645\u0642\u062F\u0631\u0629 \u0639\u0646\u062F \u0627\u0644\u0625\u0643\u0645\u0627\u0644" },
  ETC: { en: "Estimated To Complete - Cost remaining to finish", ar: "\u0627\u0644\u062A\u0643\u0644\u0641\u0629 \u0627\u0644\u0645\u062A\u0628\u0642\u064A\u0629 \u0644\u0644\u0625\u0643\u0645\u0627\u0644" },
  PV:  { en: "Planned Value - Budget for scheduled work", ar: "\u0627\u0644\u0642\u064A\u0645\u0629 \u0627\u0644\u0645\u062E\u0637\u0637\u0629 - \u0645\u064A\u0632\u0627\u0646\u064A\u0629 \u0627\u0644\u0639\u0645\u0644 \u0627\u0644\u0645\u062C\u062F\u0648\u0644" },
  EV:  { en: "Earned Value - Budget for completed work", ar: "\u0627\u0644\u0642\u064A\u0645\u0629 \u0627\u0644\u0645\u0643\u062A\u0633\u0628\u0629 - \u0645\u064A\u0632\u0627\u0646\u064A\u0629 \u0627\u0644\u0639\u0645\u0644 \u0627\u0644\u0645\u0646\u062C\u0632" },
  AC:  { en: "Actual Cost - Cost incurred for completed work", ar: "\u0627\u0644\u062A\u0643\u0644\u0641\u0629 \u0627\u0644\u0641\u0639\u0644\u064A\u0629 - \u062A\u0643\u0627\u0644\u064A\u0641 \u0627\u0644\u0639\u0645\u0644 \u0627\u0644\u0645\u0646\u062C\u0632" },
  TIA: { en: "Time Impact Analysis - 'What-If' analysis for delays", ar: "\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u062A\u0623\u062B\u064A\u0631 \u0627\u0644\u0632\u0645\u0646\u064A" },
  SOW: { en: "Scope of Work", ar: "\u0646\u0637\u0627\u0642 \u0627\u0644\u0639\u0645\u0644" },
  NTP: { en: "Notice to Proceed - Authorization to start work", ar: "\u0625\u0634\u0639\u0627\u0631 \u0627\u0644\u0628\u062F\u0621" },
  DCMA: { en: "DCMA 14-point assessment for schedule quality", ar: "\u062A\u0642\u064A\u064A\u0645 DCMA \u0628\u0640 14 \u0628\u0646\u062F" },
  RFQ: { en: "Request for Quotation", ar: "\u0637\u0644\u0628 \u0639\u0631\u0636 \u0633\u0639\u0631" },
  RFP: { en: "Request for Proposal", ar: "\u0637\u0644\u0628 \u0639\u0631\u0636 \u0641\u0646\u064A" },
  PO:  { en: "Purchase Order", ar: "\u0623\u0645\u0631 \u0634\u0631\u0627\u0621" },
  IFC: { en: "Issued For Construction (drawing status)", ar: "\u0635\u0627\u062F\u0631 \u0644\u0644\u0625\u0646\u0634\u0627\u0621" },
  IFA: { en: "Issued For Approval (drawing status)", ar: "\u0635\u0627\u062F\u0631 \u0644\u0644\u0645\u0648\u0627\u0641\u0642\u0629" },
  FAT: { en: "Factory Acceptance Test", ar: "\u0627\u062E\u062A\u0628\u0627\u0631 \u0627\u0644\u0642\u0628\u0648\u0644 \u0627\u0644\u0645\u0635\u0646\u0639\u064A" },
  SAT: { en: "Site Acceptance Test", ar: "\u0627\u062E\u062A\u0628\u0627\u0631 \u0627\u0644\u0642\u0628\u0648\u0644 \u0627\u0644\u0645\u0648\u0642\u0639\u064A" },
  MIR: { en: "Material Inspection Report", ar: "\u062A\u0642\u0631\u064A\u0631 \u0641\u062D\u0635 \u0627\u0644\u0645\u0648\u0627\u062F" },
  RFM: { en: "Release For Manufacturing", ar: "\u0625\u0637\u0644\u0627\u0642 \u0627\u0644\u062A\u0635\u0646\u064A\u0639" },
  RFS: { en: "Release For Shipment", ar: "\u0625\u0637\u0644\u0627\u0642 \u0627\u0644\u0634\u062D\u0646" },
  HVDC: { en: "High Voltage Direct Current", ar: "\u062A\u064A\u0627\u0631 \u0645\u0633\u062A\u0645\u0631 \u0639\u0627\u0644\u064A \u0627\u0644\u062C\u0647\u062F" },
  GIS: { en: "Gas Insulated Switchgear", ar: "\u0644\u0648\u062D\u0629 \u062A\u0648\u0632\u064A\u0639 \u0645\u0639\u0632\u0648\u0644\u0629 \u0628\u0627\u0644\u063A\u0627\u0632" },
  AIS: { en: "Air Insulated Switchgear", ar: "\u0644\u0648\u062D\u0629 \u062A\u0648\u0632\u064A\u0639 \u0645\u0639\u0632\u0648\u0644\u0629 \u0628\u0627\u0644\u0647\u0648\u0627\u0621" },
  OHTL: { en: "Overhead Transmission Line", ar: "\u062E\u0637 \u0646\u0642\u0644 \u0647\u0648\u0627\u0626\u064A" },
  UGC: { en: "Underground Cable", ar: "\u0643\u0627\u0628\u0644 \u0623\u0631\u0636\u064A" },
  CPM_NG: { en: "Critical Path Method per NG SA Manual", ar: "\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u0645\u0633\u0627\u0631 \u0627\u0644\u062D\u0631\u062C \u062D\u0633\u0628 \u062F\u0644\u064A\u0644 NG" }
};

const PROJECT_TYPE_RULES = [
  // ── SPECIALIZED SCOPE PROJECTS (most-specific first) ──
  // These come BEFORE generic types because their keywords are highly specific
  // — when the project name says "Fire Protection System for Substations",
  // we want fire_protection (specific) to win over substation (generic).
  {
    key: "fire_protection",
    icon: "\u{1F692}",
    name_en: "Fire Protection System",
    name_ar: "\u0646\u0638\u0627\u0645 \u0627\u0644\u062D\u0645\u0627\u064A\u0629 \u0645\u0646 \u0627\u0644\u062D\u0631\u064A\u0642",
    palette: { from: "#dc2626", to: "#b91c1c", accent: "#fef08a", glow: "#dc262640" },
    patterns: [
      /\bfire\s+protection\s+system\b/i,
      /\bfire\s+(?:fighting|alarm)\s+system\b/i,
      /\bfire\s+detection\s+system\b/i,
      /\bFM[\s-]?200\b/i,
      /\bfire\s+suppression\b/i
    ]
  },
  {
    key: "scada_comm",
    icon: "\u{1F4E1}",
    name_en: "SCADA / Communication",
    name_ar: "\u0646\u0638\u0627\u0645 \u0627\u0644\u062A\u062D\u0643\u0645 \u0648\u0627\u0644\u0627\u062A\u0635\u0627\u0644\u0627\u062A",
    palette: { from: "#0891b2", to: "#7c3aed", accent: "#e0e7ff", glow: "#0891b240" },
    patterns: [
      /\bSCADA\b/i,
      /\btele[\s-]?protection\b/i,
      /\bcommunication\s+system\b/i,
      /\bfiber\s+optic\s+network\b/i,
      /\bRTU\s+(?:installation|system)\b/i
    ]
  },
  {
    key: "statcom",
    icon: "\u{1F50B}",
    name_en: "STATCOM / Reactive Compensation",
    name_ar: "\u0645\u062D\u0637\u0629 \u062A\u0639\u0648\u064A\u0636 \u0627\u0644\u0642\u062F\u0631\u0629",
    palette: { from: "#7c3aed", to: "#db2777", accent: "#fbcfe8", glow: "#7c3aed40" },
    patterns: [
      /\bSTA[TC]?COM\b/i,
      /\bSVC\b/i,
      /\bstatic\s+(?:var|VAR|compensator)\b/i,
      /\breactive\s+(?:power\s+)?compensation\b/i,
      /\bsynchronous\s+condenser\b/i
    ]
  },
  {
    key: "cathodic",
    icon: "\u{1F6E1}\uFE0F",
    name_en: "Cathodic Protection",
    name_ar: "\u0646\u0638\u0627\u0645 \u0627\u0644\u062D\u0645\u0627\u064A\u0629 \u0627\u0644\u0643\u0627\u062B\u0648\u062F\u064A\u0629",
    palette: { from: "#475569", to: "#64748b", accent: "#fde047", glow: "#47556940" },
    patterns: [/\bcathodic\s+protection\b/i, /\bCP\s+system\b/i]
  },
  {
    key: "metering",
    icon: "\u{1F4CA}",
    name_en: "Metering / AMI System",
    name_ar: "\u0646\u0638\u0627\u0645 \u0627\u0644\u0642\u064A\u0627\u0633",
    palette: { from: "#0d9488", to: "#0891b2", accent: "#a7f3d0", glow: "#0d948840" },
    patterns: [
      /\bmetering\s+(?:system|station)\b/i,
      /\bAMI\b/i,
      /\bsmart\s+meter\b/i,
      /\brevenue\s+meter\b/i
    ]
  },
  {
    key: "fuel_conversion",
    icon: "\u{1F504}",
    name_en: "Fuel Conversion Project",
    name_ar: "\u062A\u062D\u0648\u064A\u0644 \u0648\u0642\u0648\u062F",
    palette: { from: "#ea580c", to: "#9333ea", accent: "#fbbf24", glow: "#ea580c40" },
    patterns: [
      /\bfuel\s+conversion\b/i,
      /\boil[\s-]to[\s-]gas\b/i,
      /\bfuel\s+switch\b/i,
      /\bdual[\s-]fuel\b/i
    ]
  },
  // ── INFRASTRUCTURE BY MEDIUM (water before power because "WATER TREATMENT PLANT
  //    AT JEDDAH SOUTH POWER PLANT" should be water_treatment, not power_plant) ──