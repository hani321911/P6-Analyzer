// ═══════════════════════════════════════════════════════════════════
// 05_audit_DCMA_PMI_GAO_AACE.js — v29.0.10
// Lines 6131 - 6700 (of 19822 total)
// DCMA + findLongestPathDuration v29.0.10 (network DP)
// ═══════════════════════════════════════════════════════════════════

    recommendationAr: criticalPct < 5 ? "أنشطة حرجة قليلة جداً. المنطق قد يكون ناقصاً." : (criticalPct > 15 ? "أنشطة حرجة كثيرة جداً. الجدول مفرط التقييد." : null)
  });

  // 13. CRITICAL PATH LENGTH INDEX (CPLI)
  let cpli = 1.0;
  if (refBaseline_finishDate(baseline)) {
    const projectFinish = refBaseline_finishDate(baseline);
    const remainingDays = Math.max(0, (projectFinish - dataDate) / 86400000);
    const longestPath = findLongestPathDuration(acts, rels, dataDate);
    if (longestPath > 0) {
      cpli = remainingDays / longestPath; // FIX: removed meaningless "+ 0"
    }
  }
  results.push({
    id: "DCMA-13", name: "CPLI", nameAr: "مؤشر طول المسار الحرج",
    description: "Critical Path Length Index. Healthy range: 0.95-1.05. Below 0.95 = unrealistic; above 1.05 = wasteful.",
    descriptionAr: "مؤشر طول المسار الحرج. النطاق الصحي: 0.95-1.05. أقل = غير واقعي؛ أكبر = هدر.",
    threshold: "0.95-1.05", value: cpli, unit: "",
    pass: cpli >= 0.95 && cpli <= 1.05,
    severity: (cpli >= 0.95 && cpli <= 1.05) ? "pass" : (cpli >= 0.85 && cpli <= 1.15 ? "warn" : "fail"),
    detail: `CPLI = ${cpli.toFixed(2)}`,
    detailAr: `CPLI = ${cpli.toFixed(2)}`,
    affected: 0,
    recommendation: cpli < 0.95 ? "CPLI too low. Schedule may not finish on time." : (cpli > 1.05 ? "CPLI too high. Schedule has excessive buffer." : null),
    recommendationAr: cpli < 0.95 ? "CPLI منخفض. الجدول قد لا ينتهي في الموعد." : (cpli > 1.05 ? "CPLI مرتفع. الجدول به فائض زمني." : null)
  });

  // 14. BASELINE EXECUTION INDEX (BEI)
  // FIX CALC-02: numerator must be tasks COMPLETED that were also DUE by data date
  // not ALL completed tasks regardless of when they were scheduled
  const tasksDueByDataDate = acts.filter(a => {
    if (!a.plannedFinish) return false;
    return new Date(a.plannedFinish).getTime() <= dataDateMs;
  });
  const tasksDueCount = tasksDueByDataDate.length;
  // Tasks completed that were due by data date
  const tasksCompletedOnTime = tasksDueByDataDate.filter(a => {
    const status = (a.status || "").toLowerCase();
    return status.includes("complete");
  }).length;
  const bei = tasksDueCount > 0 ? tasksCompletedOnTime / tasksDueCount : 1.0;
  results.push({
    id: "DCMA-14", name: "BEI", nameAr: "مؤشر تنفيذ Baseline",
    description: "Baseline Execution Index. Ratio of tasks completed to tasks that should be completed. ≥0.95 = healthy.",
    descriptionAr: "مؤشر تنفيذ Baseline. نسبة المهام المنجزة لما يجب إنجازه. ≥0.95 = صحي.",
    threshold: "≥ 0.95", value: bei, unit: "",
    pass: bei >= 0.95,
    severity: bei >= 0.95 ? "pass" : (bei >= 0.85 ? "warn" : "fail"),
    detail: `BEI = ${bei.toFixed(2)} (${tasksCompletedOnTime}/${tasksDueCount} tasks due by data date)`,
    detailAr: `BEI = ${bei.toFixed(2)} (${tasksCompletedOnTime}/${tasksDueCount} مهمة مستحقة)`,
    affected: Math.max(0, tasksDueCount - tasksCompletedOnTime),
    recommendation: bei < 0.95 ? "Project is behind. Recover schedule or rebaseline." : null,
    recommendationAr: bei < 0.95 ? "المشروع متأخر. استعد الجدول أو أعد Baseline." : null
  });

  return results;
}

// Helper: get baseline finish date
function refBaseline_finishDate(baseline) {
  if (!baseline || !baseline.activities) return null;
  let maxFinish = 0;
  baseline.activities.forEach(a => {
    if (a.plannedFinish) {
      const t = new Date(a.plannedFinish).getTime();
      if (t > maxFinish) maxFinish = t;
    }
  });
  return maxFinish > 0 ? new Date(maxFinish) : null;
}

// Helper: simple longest path estimation
// v29.0.9.2: Improved longest-path duration with 3-tier strategy
// Strategy 1: Use P6's native LongestPath flag (most accurate)
// Strategy 2: Fallback to TotalFloat <= 0 (critical path activities)
// Strategy 3: Last-resort heuristic (max finish - dataDate)
// v29.0.10: Network-based longest path calculation (replaces buggy reduce/sum approach)
// Previous code summed all critical activity durations — wrong for parallel critical paths.
// New implementation: builds activity graph from relationships, performs forward-pass
// topological DP to find the longest single path through the network.
//
// Strategies (in order):
//   1. P6's LongestPath flag → use network DP on those activities
//   2. TotalFloat ≤ 0 (critical path) → use network DP
//   3. Heuristic fallback (earliest start to latest finish) — kept for safety
function findLongestPathDuration(acts, rels, dataDate) {
  if (!acts || acts.length === 0) return 0;
  // Strategy 1: P6's LongestPath field (most accurate when available)
  const longestPathActs = acts.filter(a =>
    !a.isSummary && (a.longestPath === true || a.longestPath === "1")
  );
  if (longestPathActs.length > 0) {
    const result = _calculateNetworkLongestPath(longestPathActs, rels);
    if (result > 0) return result;
  }
  // Strategy 2: TotalFloat ≤ 0 critical path with proper network calculation
  const criticalActs = acts.filter(a =>
    !a.isSummary &&
    !isNaN(Number(a.totalFloat)) &&
    Number(a.totalFloat) <= 0 &&
    a.status !== "Completed"
  );
  if (criticalActs.length > 0) {
    const result = _calculateNetworkLongestPath(criticalActs, rels);
    if (result > 0) return result;
  }
  // Strategy 3: Heuristic fallback (single longest activity from data date)
  let maxDur = 0;
  const dd = dataDate ? new Date(dataDate) : null;
  acts.forEach(a => {
    if (a.plannedFinish && a.plannedStart && dd) {
      const dur = (new Date(a.plannedFinish) - dd) / 86400000;
      if (dur > maxDur) maxDur = dur;
    }
  });
  return maxDur;
}

// Helper: Topological DP to find longest path through a subset of activities
// Builds predecessor map from relationships, computes longestTo[id] = longest path ending at id
// Returns the maximum value in longestTo (i.e., the longest single path through the network)
function _calculateNetworkLongestPath(activities, relationships) {
  if (!activities || activities.length === 0) return 0;
  // Build map: actId → activity
  const actMap = {};
  activities.forEach(a => {
    const id = a.actId || a.id;
    if (id != null) actMap[id] = a;
  });
  // Build predecessors map (only relationships within our subset)
  const predecessors = {};
  if (relationships && relationships.length > 0) {
    relationships.forEach(r => {
      if (!actMap[r.predId] || !actMap[r.succId]) return;
      if (!predecessors[r.succId]) predecessors[r.succId] = [];
      predecessors[r.succId].push(r.predId);
    });
  }
  // DP with memoization
  const longestTo = {};
  const visiting = {};  // cycle detection
  function compute(id) {
    if (longestTo[id] !== undefined) return longestTo[id];
    if (visiting[id]) return 0;  // cycle: bail out
    visiting[id] = true;
    const act = actMap[id];
    if (!act) { visiting[id] = false; return 0; }
    const dur = Number(act.plannedDuration) || 0;
    const preds = predecessors[id] || [];
    if (preds.length === 0) {
      longestTo[id] = dur;
    } else {
      let maxPred = 0;
      preds.forEach(pid => {
        const v = compute(pid);
        if (v > maxPred) maxPred = v;
      });
      longestTo[id] = dur + maxPred;
    }
    visiting[id] = false;
    return longestTo[id];
  }
  let result = 0;
  Object.keys(actMap).forEach(id => {
    const v = compute(id);
    if (v > result) result = v;
  });
  return result;
}

// ═══════════════════ PMI SCHEDULE STANDARDS ═══════════════════

function bqaPMI(baseline) {
  const { acts, rels } = _bqaGetData(baseline);
  const results = [];

  // P1. Activity Naming Convention
  const shortNames = acts.filter(a => (a.name || a.actName || "").trim().length < 5).length;
  const namingPct = acts.length > 0 ? ((acts.length - shortNames) / acts.length) * 100 : 0;
  results.push({
    id: "PMI-01", name: "Activity Naming", nameAr: "تسمية الأنشطة",
    description: "All activities should have clear, descriptive names (≥5 characters, verb-noun format recommended).",
    descriptionAr: "كل الأنشطة يجب أن تحمل أسماء واضحة وصفية (≥5 حروف، صيغة فعل-اسم مفضّلة).",
    threshold: "≥ 95%", value: namingPct, unit: "%",
    pass: namingPct >= 95,
    severity: namingPct >= 95 ? "pass" : (namingPct >= 85 ? "warn" : "fail"),
    detail: `${shortNames} activities with names < 5 chars`,
    detailAr: `${shortNames} نشاط باسم أقل من 5 أحرف`,
    affected: shortNames,
    recommendation: namingPct < 95 ? "Rename short/cryptic activities. Use verb-noun format (e.g., 'Install foundation rebar')." : null,
    recommendationAr: namingPct < 95 ? "أعد تسمية الأنشطة القصيرة. استخدم صيغة فعل-اسم (مثل: 'تركيب حديد الأساسات')." : null
  });

  // P2. WBS Structure
  const wbsCodes = new Set();
  acts.forEach(a => { const w = a.wbs || a.wbsId; if (w) wbsCodes.add(w); });
  const wbsBalance = acts.length > 0 ? acts.length / Math.max(wbsCodes.size, 1) : 0;
  results.push({
    id: "PMI-02", name: "WBS Structure", nameAr: "هيكل WBS",
    description: "Activities should be distributed across WBS levels. Average 5-15 activities per WBS element.",
    descriptionAr: "الأنشطة يجب أن تتوزع عبر مستويات WBS. المتوسط 5-15 نشاط لكل عنصر WBS.",
    threshold: "5-15 acts/WBS", value: wbsBalance, unit: " acts/WBS",
    pass: wbsBalance >= 3 && wbsBalance <= 20,
    severity: (wbsBalance >= 5 && wbsBalance <= 15) ? "pass" : (wbsBalance >= 3 && wbsBalance <= 20 ? "warn" : "fail"),
    detail: `${wbsCodes.size} WBS elements, avg ${wbsBalance.toFixed(1)} activities each`,
    detailAr: `${wbsCodes.size} عنصر WBS، متوسط ${wbsBalance.toFixed(1)} نشاط لكل عنصر`,
    affected: 0,
    recommendation: wbsBalance > 20 ? "WBS too flat. Add intermediate levels for better organization." : (wbsBalance < 3 ? "WBS too detailed. Consolidate small groups." : null),
    recommendationAr: wbsBalance > 20 ? "WBS مسطّح. أضف مستويات وسيطة لتنظيم أفضل." : (wbsBalance < 3 ? "WBS مفصّل جداً. ادمج المجموعات الصغيرة." : null)
  });

  // P3. Milestone Distribution
  const milestones = acts.filter(a => (a.type || "").toLowerCase().includes("milestone")).length;
  const milestonePct = acts.length > 0 ? (milestones / acts.length) * 100 : 0;
  results.push({
    id: "PMI-03", name: "Milestones", nameAr: "نقاط التحول (Milestones)",
    description: "Schedule should contain meaningful milestones (typically 1-5% of activities).",
    descriptionAr: "الجدول يجب أن يحتوي milestones ذات معنى (عادةً 1-5% من الأنشطة).",
    threshold: "1-5%", value: milestonePct, unit: "%",
    pass: milestonePct >= 1 && milestonePct <= 5,
    severity: (milestonePct >= 1 && milestonePct <= 5) ? "pass" : (milestonePct >= 0.5 && milestonePct <= 10 ? "warn" : "fail"),
    detail: `${milestones} milestones (${milestonePct.toFixed(1)}%)`,
    detailAr: `${milestones} milestone (${milestonePct.toFixed(1)}%)`,
    affected: 0,
    recommendation: milestonePct < 1 ? "Add key milestones for project tracking and reporting." : (milestonePct > 5 ? "Too many milestones. Keep only key delivery points." : null),
    recommendationAr: milestonePct < 1 ? "أضف milestones رئيسية لمتابعة المشروع والتقارير." : (milestonePct > 5 ? "milestones كثيرة جداً. أبقِ نقاط التسليم الأساسية فقط." : null)
  });

  // P4. Calendar Consistency
  const calendars = new Set();
  acts.forEach(a => { if (a.calendarId) calendars.add(a.calendarId); });
  results.push({
    id: "PMI-04", name: "Calendar Consistency", nameAr: "اتساق التقويم",
    description: "Use 1-3 calendars max. Too many calendars create scheduling conflicts.",
    descriptionAr: "استخدم 1-3 تقاويم كحد أقصى. كثرة التقاويم تخلق تعارضات.",
    threshold: "≤ 3 calendars", value: calendars.size, unit: " calendars",
    pass: calendars.size >= 1 && calendars.size <= 3,
    severity: (calendars.size >= 1 && calendars.size <= 3) ? "pass" : (calendars.size <= 5 ? "warn" : "fail"),
    detail: `${calendars.size} unique calendars in use`,
    detailAr: `${calendars.size} تقويم مختلف مستخدم`,
    affected: 0,
    recommendation: calendars.size > 3 ? "Consolidate calendars. Use one master + max 2 specialty calendars." : null,
    recommendationAr: calendars.size > 3 ? "ادمج التقاويم. استخدم تقويم رئيسي واحد + 2 تخصصي كحد أقصى." : null
  });

  return results;
}

// ═══════════════════ GAO BEST PRACTICES ═══════════════════

function bqaGAO(baseline) {
  const { acts, rels } = _bqaGetData(baseline);
  const results = [];

  // G1. Capturing All Activities
  const totalActs = acts.length;
  results.push({
    id: "GAO-01", name: "Activity Coverage", nameAr: "شمولية الأنشطة",
    description: "Schedule should capture all project work. Typical projects: 50-5000 activities depending on complexity.",
    descriptionAr: "الجدول يجب أن يغطي كل أعمال المشروع. عادةً: 50-5000 نشاط حسب التعقيد.",
    threshold: "Reasonable count", value: totalActs, unit: " activities",
    pass: totalActs >= 20,
    severity: totalActs >= 50 ? "pass" : (totalActs >= 20 ? "warn" : "fail"),
    detail: `${totalActs} total activities`,
    detailAr: `إجمالي ${totalActs} نشاط`,
    affected: 0,
    recommendation: totalActs < 20 ? "Schedule may be too high-level. Add detail for better tracking." : null,
    recommendationAr: totalActs < 20 ? "الجدول مرتفع المستوى. أضف تفاصيل للمتابعة الأفضل." : null
  });

  // G2. Sequencing Activities (relationships per activity)
  const relsPerAct = totalActs > 0 ? rels.length / totalActs : 0;
  results.push({
    id: "GAO-02", name: "Activity Sequencing", nameAr: "تسلسل الأنشطة",
    description: "Healthy schedule has 1.5-3 relationships per activity on average.",
    descriptionAr: "الجدول السليم به 1.5-3 علاقة لكل نشاط في المتوسط.",
    threshold: "1.5-3", value: relsPerAct, unit: " rels/act",
    pass: relsPerAct >= 1.5 && relsPerAct <= 3,
    severity: (relsPerAct >= 1.5 && relsPerAct <= 3) ? "pass" : (relsPerAct >= 1 && relsPerAct <= 4 ? "warn" : "fail"),
    detail: `${rels.length} relationships, ${relsPerAct.toFixed(2)} per activity`,
    detailAr: `${rels.length} علاقة، ${relsPerAct.toFixed(2)} لكل نشاط`,
    affected: 0,
    recommendation: relsPerAct < 1.5 ? "Insufficient logic. Add more relationships." : (relsPerAct > 3 ? "Excessive logic. Simplify." : null),
    recommendationAr: relsPerAct < 1.5 ? "منطق غير كافٍ. أضف علاقات أكثر." : (relsPerAct > 3 ? "منطق مفرط. بسّط." : null)
  });

  // G3. Resource Loading
  const resourceLoaded = acts.filter(a => {
    return (a.plannedLaborCost || 0) + (a.plannedNonLaborCost || 0) > 0;
  }).length;
  const resPct = totalActs > 0 ? (resourceLoaded / totalActs) * 100 : 0;
  results.push({
    id: "GAO-03", name: "Resource Loading", nameAr: "تحميل الموارد",
    description: "Schedule should be resource-loaded for cost integration and EVM analysis.",
    descriptionAr: "الجدول يجب تحميله بالموارد لتكامل التكلفة وتحليل EVM.",
    threshold: "≥ 80%", value: resPct, unit: "%",
    pass: resPct >= 80,
    severity: resPct >= 80 ? "pass" : (resPct >= 50 ? "warn" : "fail"),
    detail: `${resourceLoaded} activities with cost loading`,
    detailAr: `${resourceLoaded} نشاط محمّل بتكاليف`,
    affected: totalActs - resourceLoaded,
    recommendation: resPct < 80 ? "Load costs/resources for proper cost-schedule integration." : null,
    recommendationAr: resPct < 80 ? "حمّل التكاليف/الموارد لتكامل صحيح بين التكلفة والجدول." : null
  });

  return results;
}

// ═══════════════════ AACE 38R-06 ═══════════════════

function bqaAACE(baseline) {
  const { acts } = _bqaGetData(baseline);
  const results = [];

  // A1. Schedule Density (Level 3-5 detail)
  const avgDuration = acts.length > 0
    ? acts.reduce((s, a) => s + _bqaDuration(a), 0) / acts.length
    : 0;
  let level = "Unknown";
  if (avgDuration > 60) level = "Level 1-2 (Summary)";
  else if (avgDuration > 30) level = "Level 2-3 (Management)";
  else if (avgDuration > 10) level = "Level 3-4 (Project)";
  else level = "Level 4-5 (Execution)";
  results.push({
    id: "AACE-01", name: "Schedule Density", nameAr: "كثافة الجدول",
    description: "AACE recommends Level 3-5 detail for execution. Avg activity duration indicates schedule level.",
    descriptionAr: "AACE توصي بمستوى 3-5 للتنفيذ. متوسط مدة النشاط يحدد مستوى الجدول.",
    threshold: "≤ 20 days avg", value: avgDuration, unit: " days",
    pass: avgDuration <= 20,
    severity: avgDuration <= 20 ? "pass" : (avgDuration <= 40 ? "warn" : "fail"),
    detail: `Average duration ${avgDuration.toFixed(1)} days → ${level}`,
    detailAr: `متوسط المدة ${avgDuration.toFixed(1)} يوم → ${level}`,
    affected: 0,
    recommendation: avgDuration > 20 ? `Schedule is ${level}. For execution, refine to Level 3-5 (avg ≤20 days).` : null,
    recommendationAr: avgDuration > 20 ? `الجدول ${level}. للتنفيذ، حسّن إلى مستوى 3-5 (متوسط ≤20 يوم).` : null
  });

  // A2. Coding Completeness
  const withWBS = acts.filter(a => a.wbs || a.wbsId).length;
  const codedPct = acts.length > 0 ? (withWBS / acts.length) * 100 : 0;
  results.push({
    id: "AACE-02", name: "Coding Completeness", nameAr: "اكتمال الترميز",
    description: "All activities should have WBS, Activity Codes, and resource assignments for proper analysis.",
    descriptionAr: "كل الأنشطة يجب أن يكون لها WBS وActivity Codes وموارد للتحليل الصحيح.",
    threshold: "100%", value: codedPct, unit: "%",
    pass: codedPct >= 100,
    severity: codedPct >= 100 ? "pass" : (codedPct >= 95 ? "warn" : "fail"),
    detail: `${withWBS} of ${acts.length} activities have WBS code`,
    detailAr: `${withWBS} من ${acts.length} نشاط له كود WBS`,
    affected: acts.length - withWBS,
    recommendation: codedPct < 100 ? "All activities must have WBS assignment for cost rollup and reporting." : null,
    recommendationAr: codedPct < 100 ? "كل الأنشطة يجب أن يكون لها WBS لتجميع التكاليف والتقارير." : null
  });

  return results;
}

// ═══════════════════ MASTER AUDIT FUNCTION ═══════════════════

// ═══════════════════════════════════════════════════════════════════
// v28.3: Extract Key Project Dates (PAC, TCC, FAC, Milestones)
// ═══════════════════════════════════════════════════════════════════
function bqaExtractKeyDates(baseline) {
  const acts = (baseline && baseline.activities) || [];
  if (acts.length === 0) {
    return { projectStart: null, projectFinish: null, durationDays: 0, durationMonths: 0,
             pac: null, tcc: null, fac: null, milestones: [], milestonesCount: 0 };
  }

  // Project Start = minimum plannedStart across all activities
  // Project Finish = maximum plannedFinish across all activities
  let minStart = Infinity, maxFinish = 0;
  acts.forEach(a => {
    if (a.plannedStart) {
      const t = new Date(a.plannedStart).getTime();
      if (t > 0 && t < minStart) minStart = t;
    }
    if (a.plannedFinish) {
      const t = new Date(a.plannedFinish).getTime();
      if (t > maxFinish) maxFinish = t;
    }
  });
  const projectStart = minStart < Infinity ? new Date(minStart) : null;
  const projectFinish = maxFinish > 0 ? new Date(maxFinish) : null;
  const durationDays = (projectStart && projectFinish)
    ? Math.round((projectFinish - projectStart) / 86400000)
    : 0;
  const durationMonths = durationDays > 0 ? Math.round(durationDays / 30.44) : 0;
  // v28.5: years (with 1 decimal precision)
  const durationYears = durationDays > 0 ? Math.round((durationDays / 365.25) * 10) / 10 : 0;

  // Find milestones: type contains "milestone" OR plannedDuration === 0
  const milestoneActs = acts.filter(a => {
    const type = (a.type || "").toLowerCase();
    const isMilestone = type.includes("milestone") ||
                        type.includes("start milestone") ||
                        type.includes("finish milestone");
    const zeroDur = (a.plannedDuration === 0 || a.plannedDuration === "0");
    return isMilestone || zeroDur;
  });

  // Search for PAC, TCC, FAC in activity names (works on all activities, not just milestones)
  const findByKeywords = (keywords) => {
    // Search in milestones first (preferred)
    for (const a of milestoneActs) {
      const name = (a.name || a.actName || "").toLowerCase();
      const id = (a.actId || "").toLowerCase();
      for (const kw of keywords) {
        if (name.includes(kw.toLowerCase()) || id.includes(kw.toLowerCase())) {
          return {
            actId: a.actId,
            actName: a.name || a.actName,
            date: a.plannedFinish || a.plannedStart,
            isMilestone: true
          };
        }
      }
    }
    // Fall back to all activities
    for (const a of acts) {
      const name = (a.name || a.actName || "").toLowerCase();
      const id = (a.actId || "").toLowerCase();
      for (const kw of keywords) {
        if (name.includes(kw.toLowerCase()) || id.includes(kw.toLowerCase())) {
          return {
            actId: a.actId,
            actName: a.name || a.actName,
            date: a.plannedFinish || a.plannedStart,
            isMilestone: false
          };
        }
      }
    }
    return null;
  };

  // PAC = Preliminary Acceptance Certificate
  const pac = findByKeywords(["PAC", "Preliminary Acceptance", "Provisional Acceptance",
                              "تسليم ابتدائي", "استلام أولي", "تسليم مبدئي", "الاستلام الابتدائي"]);
  // TCC = Technical Completion Certificate
  const tcc = findByKeywords(["TCC", "Technical Completion", "Tests on Completion",
                              "Mechanical Completion", "Substantial Completion",
                              "اكتمال فني", "الاكتمال الفني", "التسليم الفني", "شهادة الاكتمال الفني"]);
  // FAC = Final Acceptance Certificate
  const fac = findByKeywords(["FAC", "Final Acceptance", "Final Certificate",
                              "تسليم نهائي", "استلام نهائي", "الشهادة النهائية", "الاستلام النهائي"]);

  // ── v28.4: Classify milestones into 3 levels by importance ──
  // Level 1 keywords (Major contractual/project-level milestones)
  const L1_KEYWORDS = [
    "ntp", "notice to proceed", "award", "contract", "kick-off", "kickoff",
    "pac", "preliminary acceptance", "provisional acceptance",
    "tcc", "technical completion", "tests on completion",
    "fac", "final acceptance", "final certificate",
    "mc", "mechanical completion", "substantial completion",
    "cod", "commercial operation",
    "handover", "hand over", "hand-over", "turnover", "turn over",
    "project start", "project finish", "project completion", "project end",
    "eot", "extension of time", "milestone payment", "release",
    "تسليم ابتدائي", "تسليم نهائي", "اكتمال فني", "أمر مباشرة",
    "بدء المشروع", "نهاية المشروع", "إنجاز المشروع"
  ];
  // Level 2 keywords (Phase/Stage milestones)
  const L2_KEYWORDS = [
    "phase", "stage", "milestone", "block", "area", "module", "package",
    "engineering complete", "design complete", "procurement complete",
    "construction start", "construction complete", "construction completion",
    "commissioning start", "commissioning complete", "testing complete",
    "start-up", "startup", "energization", "energization complete",
    "ready for", "rfo", "rfsu", "ready for start-up", "ready for operation",
    "issued for construction", "ifc", "issued for approval", "ifa",
    "مرحلة", "بدء البناء", "اكتمال البناء", "بدء التشغيل", "اكتمال التصميم"
  ];

  const classifyMilestone = (act) => {
    const name = (act.name || act.actName || "").toLowerCase();
    const id = (act.actId || "").toLowerCase();
    const wbsId = (act.wbs || act.wbsId || "");
    const haystack = name + " " + id;
    // Level 1: contractual major milestones
    for (const kw of L1_KEYWORDS) {
      if (haystack.includes(kw)) return 1;
    }
    // Level 1 by WBS depth (top 2 levels = major)
    // WBS depth approximated by counting separator characters (. or -)
    if (wbsId) {
      const depth = (wbsId.match(/[.\-]/g) || []).length;
      if (depth <= 1) return 1;
    }
    // Level 2: phase/stage milestones
    for (const kw of L2_KEYWORDS) {
      if (haystack.includes(kw)) return 2;
    }
    // Level 2 if on or near critical path
    const tf = Number(act.totalFloat || 0);
    if (tf <= 7 && tf >= 0) return 2;
    // Default: Level 3 (detail)
    return 3;
  };

  // Build classified milestones list (sorted by date)
  const allMilestones = milestoneActs
    .filter(a => a.plannedStart || a.plannedFinish)
    .map(a => ({
      actId: a.actId,
      actName: a.name || a.actName,
      wbsId: a.wbs || a.wbsId || "",
      date: a.plannedFinish || a.plannedStart,
      totalFloat: Number(a.totalFloat || 0),
      type: (a.type || "").includes("Start") ? "start" : "finish",
      level: classifyMilestone(a)
    }))
    .filter(m => m.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const l1Count = allMilestones.filter(m => m.level === 1).length;
  const l2Count = allMilestones.filter(m => m.level === 2).length;
  const l3Count = allMilestones.filter(m => m.level === 3).length;

  return {
    projectStart,
    projectFinish,
    durationDays,
    durationMonths,
    durationYears,
    pac,
    tcc,
    fac,
    milestones: allMilestones,
    milestonesCount: allMilestones.length,
    l1Count,
    l2Count,
    l3Count
  };
}

// ═══════════════════════════════════════════════════════════════════
// v28.6: Detect Project Type & Key Milestones for BQA
// ═══════════════════════════════════════════════════════════════════
function bqaDetectProjectInfo(baseline) {
  if (!baseline) return { projectName: "", projectType: null, keyMilestones: [] };

  const acts = baseline.activities || [];
  const wbsList = baseline.wbs || [];
  const projectName = (baseline.project && (baseline.project.name || baseline.project.id)) || "";

  // Build inputs for detectProjectType
  const wbsNames = wbsList.map(w => w.name || w.code || "").filter(Boolean);
  const topActivityNames = acts.slice(0, Math.min(50, acts.length))
    .map(a => a.name || a.actName || "")
    .filter(Boolean);

  // Use existing detectProjectType
  let projectType = null;
  try {
    const detected = detectProjectType(projectName, wbsNames, topActivityNames);
    if (detected) {
      projectType = {
        key: detected.rule.key,
        icon: detected.rule.icon,
        name_en: detected.rule.name_en,
        name_ar: detected.rule.name_ar,
        palette: detected.rule.palette,
        score: detected.score,
        nameHit: detected.nameHit,
        confidence: Math.min(100, Math.round(detected.score * 5))
      };
    }
  } catch (e) {
    projectType = null;