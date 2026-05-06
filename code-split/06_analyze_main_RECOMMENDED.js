// ════════════════════════════════════════════════════════════════════
// 06_analyze_main_RECOMMENDED.js — v29.0.11 (Phase 1 + 2 implemented)
// Lines 6721 - 7980 of 19935 total
// analyze() + getActualPctRatio + isLOEActivity + EAC1/2/3 + VAC + TCPI + cost coverage (v29.0.10/v29.0.11)
// 
// ⚠️ This file is a slice for code review purposes.
// The source of truth is p6-analyzer.html.
// Auto-generated on update of p6-analyzer.html.
// ════════════════════════════════════════════════════════════════════

    projectType = null;
  }

  // Extract key milestones using KEY_MILESTONE_PATTERNS
  // Adapt activities to format expected by findKeyMilestones (uses "name" not "actName")
  const adaptedActs = acts.map(a => ({
    actId: a.actId,
    name: a.name || a.actName,
    isMilestone: ((a.type || "").toLowerCase().includes("milestone")) ||
                 (a.plannedDuration === 0 || a.plannedDuration === "0"),
    type: a.type,
    plannedFinish: a.plannedFinish,
    plannedStart: a.plannedStart,
    actualFinish: a.actualFinish
  }));

  let keyMilestones = [];
  try {
    const grouped = findKeyMilestones(adaptedActs, null, null);
    // findKeyMilestones returns Array of groups (sorted by priority)
    if (Array.isArray(grouped)) {
      grouped.forEach(group => {
        if (group && group.activities && group.activities.length > 0) {
          // Take the first (earliest) activity from each group as representative
          const firstAct = group.activities[0];
          // v28.19: Include ALL units' details for multi-unit projects
          const allUnits = group.activities.map(a => ({
            actId: a.actId,
            actName: a.name,
            plannedFinish: a.plannedFinish,
            plannedStart: a.plannedStart
          }));
          keyMilestones.push({
            categoryKey: group.categoryKey,
            icon: group.icon,
            label_en: group.label_en,
            label_ar: group.label_ar,
            priority: group.priority,
            activityCount: group.activities.length,
            actId: firstAct.actId,
            actName: firstAct.name,
            plannedFinish: firstAct.plannedFinish,
            plannedStart: firstAct.plannedFinish || firstAct.plannedStart,
            allUnits: allUnits
          });
        }
      });
    }
    // ── v28.15: FALLBACK — strong-keyword search for important milestones
    // that may have been missed (e.g. First Fire with long name not flagged as Milestone)
    const STRONG_FALLBACKS = [
      { key: "first_fire", icon: "\u{1F525}", label_en: "First Fire", label_ar: "\u0623\u0648\u0644 \u0625\u0634\u0639\u0627\u0644", priority: 70, pattern: /\bfirst[\s-]?fir(?:e|ing)\b/i },
      { key: "first_sync", icon: "\u26A1", label_en: "First Synchronization", label_ar: "\u0623\u0648\u0644 \u0645\u0632\u0627\u0645\u0646\u0629", priority: 70, pattern: /\bfirst[\s-]?sync(?:hron(?:iz(?:e|ation))?)?\b/i },
      { key: "energization", icon: "\u26A1", label_en: "Energization", label_ar: "\u0625\u062F\u062E\u0627\u0644 \u0627\u0644\u0637\u0627\u0642\u0629", priority: 80, pattern: /\benergi[zs](?:e|ation|ed|ing)?\b/i },
      { key: "cod", icon: "\u{1F3ED}", label_en: "Commercial Operation (COD)", label_ar: "\u0628\u062F\u0621 \u0627\u0644\u062A\u0634\u063A\u064A\u0644 \u0627\u0644\u062A\u062C\u0627\u0631\u064A", priority: 90, pattern: /\bcommercial\s+operation\b|\bCOD\b/i },
      { key: "fuel_in", icon: "\u26FD", label_en: "Fuel/Gas In", label_ar: "\u062F\u062E\u0648\u0644 \u0627\u0644\u0648\u0642\u0648\u062F", priority: 65, pattern: /\bfuel[\s-]?in\b|\bgas[\s-]?in\b/i },
      { key: "first_water", icon: "\u{1F4A7}", label_en: "First Water/Steam", label_ar: "\u0623\u0648\u0644 \u0645\u0627\u0621/\u0628\u062E\u0627\u0631", priority: 65, pattern: /\bfirst[\s-]?(?:water|steam)\b/i }
    ];
    const existingKeys = new Set(keyMilestones.map(m => m.categoryKey));
    for (const fb of STRONG_FALLBACKS) {
      if (existingKeys.has(fb.key)) continue; // already found
      // Search ALL activities (no isMilestone or length check)
      const matches = acts.filter(a => fb.pattern.test(a.name || a.actName || ""));
      if (matches.length > 0) {
        // Sort by date ascending, pick earliest
        matches.sort((a, b) => {
          const da = a.plannedFinish ? new Date(a.plannedFinish).getTime() : Infinity;
          const db = b.plannedFinish ? new Date(b.plannedFinish).getTime() : Infinity;
          return da - db;
        });
        const first = matches[0];
        // v28.19: collect all units
        const allUnits = matches.map(a => ({
          actId: a.actId,
          actName: a.name || a.actName,
          plannedFinish: a.plannedFinish,
          plannedStart: a.plannedStart
        }));
        keyMilestones.push({
          categoryKey: fb.key,
          icon: fb.icon,
          label_en: fb.label_en,
          label_ar: fb.label_ar,
          priority: fb.priority,
          activityCount: matches.length,
          actId: first.actId,
          actName: first.name || first.actName,
          plannedFinish: first.plannedFinish,
          plannedStart: first.plannedFinish || first.plannedStart,
          allUnits: allUnits
        });
      }
    }
    // Sort by priority desc then by date asc
    keyMilestones.sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      const da = a.plannedFinish ? new Date(a.plannedFinish).getTime() : Infinity;
      const db = b.plannedFinish ? new Date(b.plannedFinish).getTime() : Infinity;
      return da - db;
    });
  } catch (e) {
    keyMilestones = [];
  }

  return {
    projectName,
    projectType,
    keyMilestones
  };
}

function bqaRunFullAudit(baseline) {
  const dcma = bqaDCMA14(baseline);
  const pmi = bqaPMI(baseline);
  const gao = bqaGAO(baseline);
  const aace = bqaAACE(baseline);

  const all = [...dcma, ...pmi, ...gao, ...aace];

  // Compute scores
  const passed = all.filter(r => r.severity === "pass").length;
  const warned = all.filter(r => r.severity === "warn").length;
  const failed = all.filter(r => r.severity === "fail").length;
  const score = Math.round((passed * 100 + warned * 50) / all.length);

  // Risk-adjusted CPM (simple heuristic)
  const { acts, rels, dataDate } = _bqaGetData(baseline);
  const incomplete = acts.filter(_bqaIsActiveOrFuture);
  const negFloatActs = incomplete.filter(a => Number(a.totalFloat || 0) < 0).length;
  const highDurActs = incomplete.filter(a => _bqaDuration(a) > 44).length;
  const constrainedActs = incomplete.filter(a => a.constraintType).length;
  const riskScore = Math.min(100, Math.round(
    (negFloatActs * 5) +
    (highDurActs * 0.5) +
    (constrainedActs * 0.3)
  ));
  const riskLevel = riskScore < 20 ? "Low" : (riskScore < 50 ? "Medium" : "High");

  return {
    score,
    grade: score >= 90 ? "Excellent" : (score >= 75 ? "Good" : (score >= 60 ? "Fair" : (score >= 40 ? "Poor" : "Critical"))),
    gradeAr: score >= 90 ? "ممتاز" : (score >= 75 ? "جيد" : (score >= 60 ? "مقبول" : (score >= 40 ? "ضعيف" : "حرج"))),
    passed, warned, failed, total: all.length,
    riskScore, riskLevel,
    riskLevelAr: riskScore < 20 ? "منخفض" : (riskScore < 50 ? "متوسط" : "مرتفع"),
    sections: {
      dcma: {
        name: "DCMA 14-Point",
        nameAr: "معيار DCMA الـ14",
        fullName: "Defense Contract Management Agency \u2014 14-Point Schedule Assessment",
        fullNameAr: "وكالة إدارة عقود الدفاع الأمريكية \u2014 تقييم الجدول بـ14 نقطة",
        acronym: "DCMA",
        results: dcma
      },
      pmi: {
        name: "PMI Standards",
        nameAr: "معايير PMI",
        fullName: "Project Management Institute \u2014 PMBOK\u00ae Schedule Standards",
        fullNameAr: "معهد إدارة المشاريع \u2014 معايير الجدولة من دليل PMBOK\u00ae",
        acronym: "PMI",
        results: pmi
      },
      gao: {
        name: "GAO Best Practices",
        nameAr: "أفضل ممارسات GAO",
        fullName: "Government Accountability Office \u2014 Schedule Assessment Guide",
        fullNameAr: "مكتب المحاسبة الحكومي الأمريكي \u2014 دليل تقييم الجداول",
        acronym: "GAO",
        results: gao
      },
      aace: {
        name: "AACE 38R-06",
        nameAr: "معيار AACE 38R-06",
        fullName: "Association for the Advancement of Cost Engineering \u2014 Recommended Practice 38R-06",
        fullNameAr: "جمعية تطوير هندسة التكلفة \u2014 الممارسة الموصى بها 38R-06",
        acronym: "AACE",
        results: aace
      }
    },
    summary: {
      activities: acts.length,
      relationships: rels.length,
      dataDate: dataDate.toISOString().split("T")[0],
      incompleteActivities: incomplete.length,
      keyDates: bqaExtractKeyDates(baseline),
      projectInfo: bqaDetectProjectInfo(baseline)
    }
  };
}

function analyze(baseline, progress = null, revisedBL = null) {
  var _a, _b, _c, _d, _e, _f, _g;
  const refBL = revisedBL || baseline;
  const bMap = Object.fromEntries(refBL.activities.map((a) => [a.actId, a]));
  const origMap = revisedBL ? Object.fromEntries(baseline.activities.map((a) => [a.actId, a])) : {};
  const dataDate = (progress == null ? void 0 : progress.project.dataDate) ? new Date(progress.project.dataDate) : refBL.project.dataDate ? new Date(refBL.project.dataDate) : /* @__PURE__ */ new Date();
  const calcPct = (act) => {
    if (!(act == null ? void 0 : act.plannedStart) || !(act == null ? void 0 : act.plannedFinish)) return 0;
    const s = new Date(act.plannedStart), f = new Date(act.plannedFinish);
    if (dataDate <= s) return 0;
    if (dataDate >= f) return 1;
    const span = f - s;
    return span > 0 ? (dataDate - s) / span : 1;
  };
  // v29.0.10: Respect P6's PercentCompleteType (pctType) when reading actual progress
  // Previous code used: (p.pctComplete || p.durationPct || p.physicalPct || p.unitsPct || 0)
  // Issue 1: || treats 0 as falsy → jumps to next field even when 0 is the correct value
  // Issue 2: Doesn't respect pctType — Manual activity with auto-calculated durationPct gives wrong result
  // Fix: Switch on pctType, use ?? (nullish coalescing) for proper fallback
  const getActualPctRatio = (p) => {
    if (!p) return 0;
    const type = (p.pctType || "").toLowerCase();
    let raw;
    if (type === "physical") {
      raw = p.physicalPct;
    } else if (type === "duration") {
      raw = p.durationPct;
    } else if (type === "units") {
      raw = p.unitsPct;
    } else if (type === "manual") {
      raw = p.pctComplete;
    } else {
      // Unknown/missing pctType: fall back to first available, preserve 0 with ??
      raw = p.pctComplete ?? p.durationPct ?? p.physicalPct ?? p.unitsPct ?? 0;
    }
    if (raw === null || raw === undefined || isNaN(raw)) return 0;
    const num = Number(raw);
    return Math.max(0, Math.min(1, num));
  };
  // v29.0.10 (Phase 2.2): Detect Level of Effort (LOE) activities
  // LOE activities (Project Management, Quality Assurance, etc.) are continuous
  // activities that don't represent discrete work. They should be excluded from
  // progress and EVM calculations to avoid inflating duration-weighted progress.
  // P6 stores LOE type as: "Level of Effort", "LOE", or in some XML exports "TT_LOE"
  const isLOEActivity = (act) => {
    if (!act) return false;
    const type = (act.type || act.activityType || "").toString().toLowerCase();
    return type === "level of effort" ||
           type === "loe" ||
           type === "tt_loe" ||
           type.includes("level of effort") ||
           type.includes("level_of_effort");
  };
  const projectInfo = bqaDetectProjectInfo(refBL);
  // FIX v29.0.9.1: bqaDetectProjectInfo returns {projectName, projectType, keyMilestones}
  // The detected key is INSIDE projectType.key, NOT projectInfo.key directly
  const detectedTypeKey = (projectInfo && projectInfo.projectType && projectInfo.projectType.key) || null;
  const ngMatrixColumn = getNGMatrixColumn(detectedTypeKey);
  const isNG = isNGProjectType(detectedTypeKey);
  // FIX v29.0.9.1: get wbsMap early so we can pass wbsName to getNGMatrixWeight
  // (previously wbsName was never passed → WBS classification was DEAD)
  const _wbsMapForNG = (refBL.wbsMap) || {};
  const _getWbsName = (a) => {
    if (!a || !a.wbsId) return null;
    const w = _wbsMapForNG[a.wbsId];
    return w ? (w.name || w.code || null) : null;
  };
  const weightFns = {
    cost: totalCost,
    units: totalUnits,
    duration: (a) => a.plannedDuration || 0,
    count: () => 1,
    ng_matrix: (a) => getNGMatrixWeight((a && (a.name || a.actName)) || "", ngMatrixColumn || "ss_lines", _getWbsName(a))
  };
  const sourceActs = progress ? progress.activities : baseline.activities;
  const rows = sourceActs.map((p) => {
    var _a2, _b2, _c2, _d2;
    const b = bMap[p.actId];
    const o = origMap[p.actId];
    const plannedPct = calcPct(b || p) * 100;
    const originalPlannedPct = o ? calcPct(o) * 100 : null;
    let actualPct;
    if (!progress) {
      actualPct = 0;
    } else if (p.status === "Completed") actualPct = 100;
    else if (p.status === "Not Started") actualPct = 0;
    else actualPct = getActualPctRatio(p) * 100;
    const bac = totalCost(p), pv = plannedPct / 100 * bac, ev = actualPct / 100 * bac, ac = totalActualCost(p);
    const plFinish = (b == null ? void 0 : b.plannedFinish) ? new Date(b.plannedFinish) : null;
    const projFinish = p.finish ? new Date(p.finish) : p.remainFinish ? new Date(p.remainFinish) : p.plannedFinish ? new Date(p.plannedFinish) : null;
    // FIX BUG-04: svDays positive = delayed (projFinish > plFinish), negative = early
    const svDays = plFinish && projFinish ? Math.round((projFinish - plFinish) / 864e5) : null;
    return {
      actId: p.actId,
      name: p.name || (b == null ? void 0 : b.name) || p.actId,
      status: p.status || "Not Started",
      type: p.type,
      pctType: p.pctType,
      isMilestone: p.isMilestone,
      isSummary: p.isSummary,
      plannedStart: (b == null ? void 0 : b.plannedStart) || p.plannedStart,
      plannedFinish: (b == null ? void 0 : b.plannedFinish) || p.plannedFinish,
      originalFinish: o == null ? void 0 : o.plannedFinish,
      actualStart: p.actualStart,
      actualFinish: p.actualFinish,
      projectedFinish: projFinish == null ? void 0 : projFinish.toISOString(),
      plannedDuration: p.plannedDuration,
      remainingDuration: p.remainingDuration,
      totalFloat: (_b2 = (_a2 = p.totalFloat) != null ? _a2 : b == null ? void 0 : b.totalFloat) != null ? _b2 : NaN,
      critical: ((_d2 = (_c2 = p.totalFloat) != null ? _c2 : b == null ? void 0 : b.totalFloat) != null ? _d2 : 1) <= 0,
      plannedPct: +plannedPct.toFixed(2),
      originalPlannedPct: originalPlannedPct !== null ? +originalPlannedPct.toFixed(2) : null,
      actualPct: +actualPct.toFixed(2),
      variance: +(actualPct - plannedPct).toFixed(2),
      svDays,
      cost: totalCost(p),
      units: totalUnits(p),
      dur: p.plannedDuration || 0,
      bac,
      pv,
      ev,
      ac,
      spi: pv > 0 ? ev / pv : null,
      cpi: ac > 0 ? ev / ac : null,
      _raw: p
    };
  });
  // v29.0.10 (Phase 2.2): Exclude LOE activities from progress/EVM
  // Previously: only excluded milestones and summaries → LOE inflated duration-weighted progress
  const evmFiltered = rows.filter((r) => !r.isMilestone && !r.isSummary && !isLOEActivity(r._raw));
  const methodResults = {};
  for (const [key, wfn] of Object.entries(weightFns)) {
    const valid = evmFiltered.filter((r) => wfn(r._raw) > 0);
    const tw = valid.reduce((s, r) => s + wfn(r._raw), 0);
    if (tw > 0) {
      const planned = valid.reduce((s, r) => s + wfn(r._raw) * r.plannedPct, 0) / tw;
      const actual = valid.reduce((s, r) => s + wfn(r._raw) * r.actualPct, 0) / tw;
      let origPl = null;
      if (revisedBL) {
        const vo = valid.filter((r) => r.originalPlannedPct !== null);
        const tvo = vo.reduce((s, r) => s + wfn(r._raw), 0);
        if (tvo > 0) origPl = vo.reduce((s, r) => s + wfn(r._raw) * r.originalPlannedPct, 0) / tvo;
      }
      methodResults[key] = { planned: +planned.toFixed(2), actual: +actual.toFixed(2), variance: +(actual - planned).toFixed(2), originalPlanned: origPl !== null ? +origPl.toFixed(2) : null, validCount: valid.length, totalWeight: tw, available: true };
    } else {
      methodResults[key] = { available: false, reason: "No weight data available" };
    }
  }
  let recommended = "count";
  // NG Matrix takes priority ONLY when project is detected as NG-type
  if (isNG && methodResults.ng_matrix && methodResults.ng_matrix.available && methodResults.ng_matrix.totalWeight > 0) {
    recommended = "ng_matrix";
  } else if (methodResults.cost.available && methodResults.cost.totalWeight > 0) recommended = "cost";
  else if (methodResults.units.available && methodResults.units.totalWeight > 0) recommended = "units";
  else if (methodResults.duration.available) recommended = "duration";
  const all = rows.filter((r) => !r.isSummary);
  const evmAll = all.filter((r) => !r.isMilestone);
  const totalBac = evmAll.reduce((s, r) => s + r.bac, 0);
  const totalPV = evmAll.reduce((s, r) => s + r.pv, 0);
  const totalEV = evmAll.reduce((s, r) => s + r.ev, 0);
  const totalAC = evmAll.reduce((s, r) => s + r.ac, 0);
  const blF = refBL.project.finish ? new Date(refBL.project.finish) : null;
  const orF = revisedBL ? new Date(baseline.project.finish || 0) : null;
  const prF = (progress == null ? void 0 : progress.project.finish) ? new Date(progress.project.finish) : null;
  const noProgress = !progress;
  const milestoneRows = rows.filter((r) => r.isMilestone).map((r) => {
    const blAct = bMap[r.actId];
    const origAct = origMap[r.actId];
    const blFinish = (blAct == null ? void 0 : blAct.plannedFinish) || r.plannedFinish || null;
    const origFinish = (origAct == null ? void 0 : origAct.plannedFinish) || null;
    const actualFin = r.actualFinish || null;
    const forecastFin = r.projectedFinish || null;
    const slipDays = (() => {
      if (r.status === "Completed" && r.actualFinish && blFinish) {
        return Math.round((new Date(r.actualFinish) - new Date(blFinish)) / 864e5);
      }
      if (blFinish && forecastFin) {
        return Math.round((new Date(forecastFin) - new Date(blFinish)) / 864e5);
      }
      return null;
    })();
    return {
      actId: r.actId,
      name: r.name,
      type: r.type,
      status: r.status,
      blFinish,
      origFinish,
      actualFin,
      forecastFin,
      slipDays,
      critical: r.critical
    };
  }).sort((a, b) => {
    const dA = a.blFinish ? new Date(a.blFinish) : null;
    const dB = b.blFinish ? new Date(b.blFinish) : null;
    if (dA && dB) return dA - dB;
    if (dA) return -1;
    if (dB) return 1;
    return 0;
  });
  const wbsMap = (revisedBL || baseline).wbsMap || {};
  const wbsDepth = {};
  const wbsAncestors = {};
  const computeAncestors = (wbsId) => {
    var _a2;
    if (wbsAncestors[wbsId]) return wbsAncestors[wbsId];
    if (!wbsMap[wbsId]) return [];
    const chain = [wbsId];
    let cur = wbsId, hops = 0;
    while (cur && hops < 30) {
      const parent = (_a2 = wbsMap[cur]) == null ? void 0 : _a2.parentId;
      if (!parent || !wbsMap[parent]) break;
      chain.unshift(parent);
      cur = parent;
      hops++;
    }
    wbsAncestors[wbsId] = chain;
    wbsDepth[wbsId] = chain.length;
    return chain;
  };
  Object.keys(wbsMap).forEach(computeAncestors);
  const maxDepth = Math.max(0, ...Object.values(wbsDepth));
  const groupLevel = maxDepth >= 3 ? 2 : 1;
  const rollupOf = (wbsId) => {
    const chain = wbsAncestors[wbsId] || [];
    if (chain.length === 0) return null;
    const idx = Math.min(groupLevel - 1, chain.length - 1);
    return chain[idx];
  };
  const wbsGroups = {};
  for (const r of all.filter((x) => !x.isMilestone)) {
    const rawWbs = ((_a = r._raw) == null ? void 0 : _a.wbs) || "";
    const rollupId = rawWbs ? rollupOf(rawWbs) : null;
    const key = rollupId || "_unassigned";
    if (!wbsGroups[key]) {
      const wbsInfo = wbsMap[key];
      wbsGroups[key] = {
        wbsId: key,
        name: (wbsInfo == null ? void 0 : wbsInfo.name) || (key === "_unassigned" ? "Unassigned" : `WBS ${key}`),
        code: (wbsInfo == null ? void 0 : wbsInfo.code) || "",
        rows: [],
        totalWeight: 0,
        sumPV: 0,
        sumEV: 0,
        sumBAC: 0
      };
    }
    wbsGroups[key].rows.push(r);
    const w = totalCost(r._raw) || totalUnits(r._raw) || (r.dur || 0);
    wbsGroups[key].totalWeight += w;
    wbsGroups[key].sumPV += w * r.plannedPct;
    wbsGroups[key].sumEV += w * r.actualPct;
    wbsGroups[key].sumBAC += r.bac;
  }
  const wbsRaw = Object.values(wbsGroups);
  const meaningful = wbsRaw.filter((g) => g.rows.length >= 2);
  const trivialGroups = wbsRaw.filter((g) => g.rows.length < 2);
  if (trivialGroups.length > 0) {
    const other = {
      wbsId: "_other",
      name: trivialGroups.length === 1 ? trivialGroups[0].name : `Other (${trivialGroups.length} packages)`,
      code: "",
      rows: trivialGroups.flatMap((g) => g.rows),
      totalWeight: trivialGroups.reduce((s, g) => s + g.totalWeight, 0),
      sumPV: trivialGroups.reduce((s, g) => s + g.sumPV, 0),
      sumEV: trivialGroups.reduce((s, g) => s + g.sumEV, 0),
      sumBAC: trivialGroups.reduce((s, g) => s + g.sumBAC, 0)
    };
    if (other.rows.length > 0) meaningful.push(other);
  }
  const wbsBreakdown = meaningful.map((g) => {
    const totalAC = (g.rows || []).reduce((s, r) => s + (r.ac || 0), 0);
    const totalEV = g.sumEV;
    const totalPV = g.sumPV;
    const totalBAC = g.sumBAC;
    const sv = totalEV - totalPV;
    const cv = totalEV - totalAC;
    const spi = totalPV > 0 ? totalEV / totalPV : null;
    const cpi = totalAC > 0 ? totalEV / totalAC : null;
    // EAC = BAC / CPI  (or BAC if CPI null)
    const eac = (cpi && cpi > 0) ? totalBAC / cpi : totalBAC;
    // ETC = EAC - AC
    const etc = eac - totalAC;
    return {
      ...g,
      activities: g.rows.length,
      planned: g.totalWeight > 0 ? +(g.sumPV / g.totalWeight).toFixed(2) : 0,
      actual: g.totalWeight > 0 ? +(g.sumEV / g.totalWeight).toFixed(2) : 0,
      variance: g.totalWeight > 0 ? +((g.sumEV - g.sumPV) / g.totalWeight).toFixed(2) : 0,
      bac: totalBAC,
      critical: g.rows.filter((r) => r.critical).length,
      behind: g.rows.filter((r) => r.variance < -1).length,
      completed: g.rows.filter((r) => r.status === "Completed").length,
      // v29.0.9: EVM detailed metrics
      pv: +totalPV.toFixed(2),
      ev: +totalEV.toFixed(2),
      ac: +totalAC.toFixed(2),
      sv: +sv.toFixed(2),
      cv: +cv.toFixed(2),
      spi: spi !== null ? +spi.toFixed(3) : null,
      cpi: cpi !== null ? +cpi.toFixed(3) : null,
      eac: +eac.toFixed(2),
      etc: +etc.toFixed(2)
    };
  }).filter((g) => g.activities > 0).sort((a, b) => {
    const aSpecial = a.wbsId === "_unassigned" || a.wbsId === "_other";
    const bSpecial = b.wbsId === "_unassigned" || b.wbsId === "_other";
    if (aSpecial && !bSpecial) return 1;
    if (!aSpecial && bSpecial) return -1;
    return a.variance - b.variance;
  }).slice(0, 30);
  const evmAllForCurve = all.filter((r) => !r.isMilestone && r.bac > 0 && r.plannedStart && r.plannedFinish);
  const monthBuckets = {};
  const curveActs = evmAllForCurve.length > 1e4 ? evmAllForCurve.slice(0, 1e4) : evmAllForCurve;
  for (const r of curveActs) {
    const s = new Date(r.plannedStart);
    const f = new Date(r.plannedFinish);
    if (isNaN(s) || isNaN(f) || f <= s) continue;
    const totalDays = (f - s) / 864e5;
    if (totalDays <= 0 || totalDays > 36500) continue;
    const dailyValue = r.bac / totalDays;
    let curMonth = new Date(s.getFullYear(), s.getMonth(), 1);
    const endMonth = new Date(f.getFullYear(), f.getMonth(), 1);
    let safety = 0;
    while (curMonth <= endMonth && safety < 600) {
      const monthStart = curMonth;
      const monthEnd = new Date(curMonth.getFullYear(), curMonth.getMonth() + 1, 1);
      const ovStart = s > monthStart ? s : monthStart;
      const ovEnd = f < monthEnd ? f : monthEnd;
      const ovDays = Math.max(0, (ovEnd - ovStart) / 864e5);
      if (ovDays > 0) {
        const ym = curMonth.toISOString().slice(0, 7);
        monthBuckets[ym] = (monthBuckets[ym] || 0) + ovDays * dailyValue;
      }
      curMonth = new Date(curMonth.getFullYear(), curMonth.getMonth() + 1, 1);
      safety++;
    }
  }
  const months = Object.keys(monthBuckets).sort();
  let cumPlanned = 0;
  const dataDateStr = dataDate.toISOString().slice(0, 7);
  const earnedRatio = totalPV > 0 ? totalEV / totalPV : 0;
  const sCurve = months.map((ym) => {
    cumPlanned += monthBuckets[ym];
    return {
      month: ym,
      planned: +cumPlanned.toFixed(0),
      earned: ym <= dataDateStr ? +(cumPlanned * earnedRatio).toFixed(0) : null
    };
  });
  const integrityIssues = [];
  if (progress) {
    const refMap = bMap;
    const progMap = Object.fromEntries(progress.activities.map((a) => [a.actId, a]));
    const refIds = new Set(Object.keys(refMap));
    const progIds = new Set(Object.keys(progMap));
    const deletedActs = [...refIds].filter((id) => !progIds.has(id)).map((id) => refMap[id]).filter((a) => a && !a.isSummary);
    if (deletedActs.length > 0) {
      integrityIssues.push({
        severity: deletedActs.length > 20 ? "high" : deletedActs.length > 5 ? "medium" : "low",
        category: "deleted_activities",
        title: "Activities deleted from progress update",
        description: `${deletedActs.length} activities present in the baseline are missing from the progress file. This can hide slippage or scope reduction.`,
        count: deletedActs.length,
        details: deletedActs.slice(0, 20).map((a) => {
          var _a2;
          return {
            actId: a.actId,
            name: a.name,
            plannedFinish: a.plannedFinish,
            isMilestone: a.isMilestone,
            critical: ((_a2 = a.totalFloat) != null ? _a2 : 1) <= 0
          };
        }),
        allDetails: deletedActs.map((a) => {
          var _a2;
          return {
            actId: a.actId,
            name: a.name,
            plannedFinish: a.plannedFinish,
            isMilestone: a.isMilestone,
            critical: ((_a2 = a.totalFloat) != null ? _a2 : 1) <= 0
          };
        })
      });
    }
    const newActs = [...progIds].filter((id) => !refIds.has(id)).map((id) => progMap[id]).filter((a) => a && !a.isSummary);
    if (newActs.length > 0) {
      integrityIssues.push({
        severity: newActs.length > 30 ? "high" : newActs.length > 10 ? "medium" : "low",
        category: "added_activities",
        title: "New activities added after baseline",
        description: `${newActs.length} activities exist in the progress file but not in the baseline. New scope should normally appear via formal change orders.`,
        count: newActs.length,
        details: newActs.slice(0, 20).map((a) => ({
          actId: a.actId,
          name: a.name,
          plannedStart: a.plannedStart,
          plannedFinish: a.plannedFinish
        })),
        allDetails: newActs.map((a) => ({
          actId: a.actId,
          name: a.name,
          plannedStart: a.plannedStart,
          plannedFinish: a.plannedFinish
        }))
      });
    }
    const dateChanged = [];
    const durationChanged = [];
    for (const id of progIds) {
      if (!refIds.has(id)) continue;
      const ref = refMap[id], prog = progMap[id];
      if (!ref || !prog || ref.isSummary) continue;
      const isStartedOrDone = prog.status === "In Progress" || prog.status === "Completed";
      if (!isStartedOrDone && ref.plannedStart && prog.plannedStart) {
        const diff = Math.round(
          (new Date(prog.plannedStart) - new Date(ref.plannedStart)) / 864e5
        );
        if (Math.abs(diff) >= 2) {
          dateChanged.push({
            actId: prog.actId,
            name: prog.name || ref.name,
            field: "Planned Start",
            baselineValue: ref.plannedStart,
            progressValue: prog.plannedStart,
            diffDays: diff,
            critical: ((_c = (_b = prog.totalFloat) != null ? _b : ref.totalFloat) != null ? _c : 1) <= 0,
            isMilestone: prog.isMilestone
          });
        }
      }
      if (!isStartedOrDone && ref.plannedFinish && prog.plannedFinish) {
        const diff = Math.round(
          (new Date(prog.plannedFinish) - new Date(ref.plannedFinish)) / 864e5
        );
        if (Math.abs(diff) >= 2) {
          dateChanged.push({
            actId: prog.actId,
            name: prog.name || ref.name,
            field: "Planned Finish",
            baselineValue: ref.plannedFinish,
            progressValue: prog.plannedFinish,
            diffDays: diff,
            critical: ((_e = (_d = prog.totalFloat) != null ? _d : ref.totalFloat) != null ? _e : 1) <= 0,
            isMilestone: prog.isMilestone
          });
        }
      }
      if (ref.plannedDuration > 0 && prog.plannedDuration > 0) {
        const diffPct = (prog.plannedDuration - ref.plannedDuration) / ref.plannedDuration * 100;
        if (Math.abs(diffPct) > 10 && Math.abs(prog.plannedDuration - ref.plannedDuration) > 1) {
          durationChanged.push({
            actId: prog.actId,
            name: prog.name || ref.name,
            baselineValue: ref.plannedDuration,
            progressValue: prog.plannedDuration,
            diffPct: +diffPct.toFixed(1),
            shortened: prog.plannedDuration < ref.plannedDuration,
            critical: ((_g = (_f = prog.totalFloat) != null ? _f : ref.totalFloat) != null ? _g : 1) <= 0
          });
        }
      }
    }
    if (dateChanged.length > 0) {
      dateChanged.sort(
        (a, b) => b.critical - a.critical || Math.abs(b.diffDays) - Math.abs(a.diffDays)
      );
      const criticalCount = dateChanged.filter((d) => d.critical).length;
      integrityIssues.push({
        severity: criticalCount > 0 ? "high" : dateChanged.length > 50 ? "medium" : "low",
        category: "date_changes",
        title: "Planned dates altered between baseline and progress",
        description: `${dateChanged.length} not-yet-started activities have different planned dates in the progress file vs. the baseline (${criticalCount} on critical path). Planned dates should remain constant after baseline approval.`,
        count: dateChanged.length,
        criticalCount,
        details: dateChanged.slice(0, 20),
        allDetails: dateChanged
      });
    }
    if (durationChanged.length > 0) {
      durationChanged.sort((a, b) => Math.abs(b.diffPct) - Math.abs(a.diffPct));
      const shortenedCount = durationChanged.filter((d) => d.shortened).length;
      integrityIssues.push({
        severity: shortenedCount > 5 ? "high" : "medium",
        category: "duration_changes",
        title: "Activity durations modified after baseline",
        description: `${durationChanged.length} activities have different planned durations in the progress file (${shortenedCount} shortened). Durations should not change without an approved time impact analysis.`,
        count: durationChanged.length,
        shortenedCount,
        details: durationChanged.slice(0, 20),
        allDetails: durationChanged
      });
    }
    const futureActuals = [];
    for (const a of progress.activities) {
      if (a.isSummary) continue;
      if (a.actualFinish && new Date(a.actualFinish) > dataDate) {
        const days = Math.round((new Date(a.actualFinish) - dataDate) / 864e5);
        futureActuals.push({
          actId: a.actId,
          name: a.name,
          type: "Actual Finish",
          date: a.actualFinish,
          daysAhead: days
        });
      }
      if (a.actualStart && new Date(a.actualStart) > dataDate) {
        const days = Math.round((new Date(a.actualStart) - dataDate) / 864e5);
        futureActuals.push({
          actId: a.actId,
          name: a.name,
          type: "Actual Start",
          date: a.actualStart,
          daysAhead: days
        });
      }
    }
    if (futureActuals.length > 0) {
      futureActuals.sort((a, b) => b.daysAhead - a.daysAhead);
      integrityIssues.push({
        severity: "high",
        category: "future_actuals",
        title: "Actual dates in the future",
        description: `${futureActuals.length} activities have actual dates AFTER the data date (${fmtD(dataDate.toISOString())}). Actual dates cannot be in the future \u2014 this indicates data manipulation or incorrect data date.`,
        count: futureActuals.length,
        details: futureActuals.slice(0, 20),
        allDetails: futureActuals
      });
    }
    const orphanCompleted = progress.activities.filter(
      (a) => !a.isSummary && a.status === "Completed" && !a.actualFinish
    );
    if (orphanCompleted.length > 0) {
      integrityIssues.push({
        severity: orphanCompleted.length > 10 ? "medium" : "low",
        category: "missing_actuals",
        title: "Completed activities missing actual dates",
        description: `${orphanCompleted.length} activities marked Completed have no Actual Finish date. This violates basic schedule data integrity.`,
        count: orphanCompleted.length,
        details: orphanCompleted.slice(0, 20).map((a) => ({
          actId: a.actId,
          name: a.name,
          plannedFinish: a.plannedFinish
        })),
        allDetails: orphanCompleted.map((a) => ({
          actId: a.actId,
          name: a.name,
          plannedFinish: a.plannedFinish
        }))
      });
    }
    const overReported = progress.activities.filter(
      (a) => !a.isSummary && a.status !== "Completed" && (a.pctComplete >= 0.999 || a.physicalPct >= 0.999 || a.unitsPct >= 0.999)
    );
    if (overReported.length > 0) {
      integrityIssues.push({
        severity: "medium",
        category: "over_reported",
        title: "Activities reporting 100% but not marked Completed",
        description: `${overReported.length} activities show 100% complete but their status is not "Completed". This artificially inflates progress without committing to a finish date.`,
        count: overReported.length,
        details: overReported.slice(0, 20).map((a) => ({
          actId: a.actId,
          name: a.name,
          status: a.status,
          pctComplete: ((a.pctComplete || a.physicalPct || a.unitsPct) * 100).toFixed(1)
        })),
        allDetails: overReported.map((a) => ({
          actId: a.actId,
          name: a.name,
          status: a.status,
          pctComplete: ((a.pctComplete || a.physicalPct || a.unitsPct) * 100).toFixed(1)
        }))
      });
    }
    const refDataDate = refBL.project.dataDate ? new Date(refBL.project.dataDate) : null;
    if (refDataDate && dataDate < refDataDate) {
      const daysBack = Math.round((refDataDate - dataDate) / 864e5);
      integrityIssues.push({
        severity: "high",
        category: "stale_data",
        title: "Progress data date is BEFORE baseline data date",
        description: `The progress file's data date (${fmtD(dataDate.toISOString())}) is ${daysBack} days BEFORE the baseline's data date (${fmtD(refBL.project.dataDate)}). This usually means the wrong file was uploaded or the data date wasn't advanced.`,
        count: 1
      });
    }
  }
  const integrityScore = (() => {
    if (!progress || integrityIssues.length === 0) return 100;
    const penaltyMap = { high: 25, medium: 10, low: 3 };
    const totalPenalty = integrityIssues.reduce((s, i) => s + (penaltyMap[i.severity] || 5), 0);
    return Math.max(0, 100 - totalPenalty);
  })();
  return {
    rows: all,
    dataDate,
    noProgress,
    milestoneRows,
    wbsBreakdown,
    wbsMeta: { groupLevel, totalPackages: wbsRaw.length, displayedPackages: wbsBreakdown.length, maxDepth },
    sCurve,
    integrityIssues,
    integrityScore,
    excludedMilestones: rows.filter((r) => r.isMilestone).length,
    excludedSummaries: rows.filter((r) => r.isSummary).length,
    methodResults,
    recommended,
    isNGProject: isNG,
    ngMatrixColumn: ngMatrixColumn,
    ngTypeName: ngMatrixColumn ? ({
      ss_lines:       { en: "SS & Lines",        ar: "\u0645\u062D\u0637\u0627\u062A \u0648\u062E\u0637\u0648\u0637" },
      ohtl:           { en: "OHTL",              ar: "\u062E\u0637\u0648\u0637 \u0647\u0648\u0627\u0626\u064A\u0629" },
      ugc:            { en: "UG Cables",         ar: "\u0643\u0628\u0644\u0627\u062A \u0623\u0631\u0636\u064A\u0629" },
      battery:        { en: "Battery System",    ar: "\u0623\u0646\u0638\u0645\u0629 \u0628\u0637\u0627\u0631\u064A\u0627\u062A" },
      hvdc:           { en: "HVDC",              ar: "HVDC" },
      telecom:        { en: "Telecom",           ar: "\u0627\u062A\u0635\u0627\u0644\u0627\u062A" },
      cyber:          { en: "Cyber Security",    ar: "\u0623\u0645\u0646 \u0633\u064A\u0628\u0631\u0627\u0646\u064A" },
      asset_repl:     { en: "Asset Replacement", ar: "\u0625\u062D\u0644\u0627\u0644 \u0627\u0644\u0623\u0635\u0648\u0644" },
      drpc_svc:       { en: "DRPC / SVC",        ar: "DRPC / SVC" },
      purchase_order: { en: "Purchase Order",    ar: "\u0623\u0645\u0631 \u0634\u0631\u0627\u0621" }
    }[ngMatrixColumn] || null) : null,
    // ───────────── v29.0.9.1 NEW FEATURES ─────────────
    // Phase Discovery — for projects NOT in NG manual (now method-aware)
    phaseDiscovery: discoverPhasesFromSchedule(rows, _wbsMapForNG, ngMatrixColumn),
    // Mandatory Milestones Tracker
    milestoneCompliance: checkMilestoneCompliance(rows, ngMatrixColumn),
    // NG Schedule Quality Compliance
    ngCompliance: runComplianceCheck(rows, (refBL && refBL.relationships) || [], _wbsMapForNG),
    // Filename Validator (uses progress file name if available)
    // v29.0.9: Filename Validators (one per uploaded file)
    filenameValidations: {
      baseline: baseline && baseline.filename ? validateNGFilename(baseline.filename) : null,
      progress: progress && progress.filename ? validateNGFilename(progress.filename) : null,
      revised:  revisedBL && revisedBL.filename ? validateNGFilename(revisedBL.filename) : null
    },
    // Backward-compat single field (uses progress preferentially)
    filenameValidation: progress && progress.filename ? validateNGFilename(progress.filename) :
      (baseline && baseline.filename ? validateNGFilename(baseline.filename) : null),
    // Recovery Trigger
    recoveryTrigger: checkRecoveryTrigger(rows,
      (function() {
        const p = refBL && refBL.project;
        if (!p || !p.start || !p.finish) return null;
        return Math.round((new Date(p.finish) - new Date(p.start)) / 86400000);
      })()
    ),
    // v29.0.9: Pre-Commissioning Check Compliance (Substation projects only)
    preCommCompliance: checkPreCommissioningCompliance(rows),
    // ───────────── End v29.0.9.1 features ─────────────
    timeline: {
      slipBLvsOrig: orF && blF ? Math.round((blF - orF) / 864e5) : null,
      slipPRvsBL: blF && prF ? Math.round((prF - blF) / 864e5) : null,
      slipPRvsOrig: orF && prF ? Math.round((prF - orF) / 864e5) : null
    },
    summary: (() => {
      // v29.0.10 (Phase 2.3): Compute SPI/CPI/EAC/VAC/TCPI per PMI standard
      const _spi = totalPV > 0 ? totalEV / totalPV : null;
      const _cpi = totalAC > 0 ? totalEV / totalAC : null;
      // v29.0.10 (Phase 2.4): Cost coverage tracking
      // Counts what % of activities have cost loading (BAC > 0)
      // Warns user if coverage is partial (EVM may be misleading otherwise)
      const _evmActivities = evmFiltered.length;
      const _activitiesWithCost = evmFiltered.filter(r => (r.bac || 0) > 0).length;
      const _evmCostCoveragePct = _evmActivities > 0
        ? +(_activitiesWithCost / _evmActivities * 100).toFixed(1)
        : 0;
      // Warning levels: alert if < 50%, warning if < 70%, ok if ≥ 70%
      let _evmCoverageStatus = "ok";
      if (_evmCostCoveragePct < 50) _evmCoverageStatus = "alert";
      else if (_evmCostCoveragePct < 70) _evmCoverageStatus = "warning";
      // 3 EAC formulas (PMI Practice Standard for EVM):
      // EAC1: Optimistic — assumes current CPI trend continues
      // EAC2: Mid — remaining work at planned rate
      // EAC3: Worst-case — considers both schedule and cost performance
      const _eac1 = (_cpi !== null && _cpi > 0) ? totalBac / _cpi : null;
      const _eac2 = totalAC + (totalBac - totalEV);
      const _eac3 = (_cpi !== null && _spi !== null && _cpi * _spi > 0)
        ? totalAC + (totalBac - totalEV) / (_cpi * _spi)
        : null;
      // VAC = BAC - EAC (positive = under budget, negative = over budget)
      const _vac = _eac1 !== null ? totalBac - _eac1 : null;
      // TCPI: To-Complete Performance Index
      // TCPI(BAC) = remaining work / remaining budget vs original BAC
      const _tcpiBAC = (totalBac - totalAC) > 0 ? (totalBac - totalEV) / (totalBac - totalAC) : null;
      // TCPI(EAC) = remaining work / remaining budget vs new EAC1
      const _tcpiEAC = (_eac1 !== null && (_eac1 - totalAC) > 0)
        ? (totalBac - totalEV) / (_eac1 - totalAC)
        : null;
      // Worst-case warning: triggers when CPI*SPI < 0.95 (significant degradation)
      const _evmWorstCaseWarning = (_cpi !== null && _spi !== null && (_cpi * _spi) < 0.95);
      return {
        total: all.length,
        critical: all.filter((r) => r.critical).length,
        behind: all.filter((r) => r.variance < -1).length,
        ahead: all.filter((r) => r.variance > 1).length,
        onTrack: all.filter((r) => Math.abs(r.variance) <= 1).length,
        completed: all.filter((r) => r.status === "Completed").length,
        inProgress: all.filter((r) => r.status === "In Progress").length,
        notStarted: all.filter((r) => r.status === "Not Started").length,
        totalBac,
        totalPV,
        totalEV,
        totalAC,
        overallSPI: _spi,
        overallCPI: _cpi,
        // v29.0.10: PMI-standard EVM forecasts
        eac1: _eac1,
        eac2: _eac2,
        eac3: _eac3,
        vac: _vac,
        tcpiBAC: _tcpiBAC,
        tcpiEAC: _tcpiEAC,
        evmWorstCaseWarning: _evmWorstCaseWarning,
        // v29.0.10 (Phase 2.4): Cost loading coverage
        evmCostCoveragePct: _evmCostCoveragePct,
        evmCoverageStatus: _evmCoverageStatus,
        evmActivitiesTotal: _evmActivities,
        evmActivitiesWithCost: _activitiesWithCost
      };
    })(),
    // ── Project type & key milestones detection (domain-aware) ──
    projectType: (() => {
      var _a2, _b2;
      try {
        const projectName = ((_a2 = refBL.project) == null ? void 0 : _a2.name) || ((_b2 = progress == null ? void 0 : progress.project) == null ? void 0 : _b2.name) || "";
        const wbsNames = Object.values(refBL.wbsMap || {}).map((w) => w == null ? void 0 : w.name).filter(Boolean);
        const sourceActs2 = progress ? progress.activities : refBL.activities;
        const topNames = sourceActs2.slice(0, 200).map((a) => a.name).filter(Boolean);
        const detected = detectProjectType(projectName, wbsNames, topNames);
        return detected ? {
          key: detected.rule.key,
          icon: detected.rule.icon,
          name_en: detected.rule.name_en,
          name_ar: detected.rule.name_ar,
          palette: detected.rule.palette,
          score: detected.score
        } : null;
      } catch (e) {
        console.warn("projectType detect:", e);
        return null;
      }
    })(),
    keyMilestones: (() => {
      try {
        const sourceActs2 = progress ? progress.activities : refBL.activities;
        const progressMapForKey = progress ? Object.fromEntries(progress.activities.map((a) => [a.actId, a])) : null;
        return findKeyMilestones(sourceActs2, bMap, progressMapForKey);
      } catch (e) {
        console.warn("keyMilestones detect:", e);
        return [];
      }
    })(),
    // ── Reference to source activities for lazy DCMA computation in tab ──
    // No heavy computation here — DCMAHealthPanel calls runDCMAHealthCheck()
    // only when the user opens the DCMA tab. This keeps initial analyze() fast.
    _dcmaActivities: progress ? progress.activities : refBL.activities,
    _dcmaRelationships: progress ? progress.relationships : refBL.relationships,
    // ── Variance Report (v20): needs both baseline AND progress separately ──
    _varianceBaseline: (refBL == null ? void 0 : refBL.activities) || [],
    _varianceProgress: (progress == null ? void 0 : progress.activities) || [],
    // ── Activity Codes (v27) ──
    // codeTypes: summary of code types present (name, coverage, etc.)
    // Source preference: progress > revisedBL > baseline (latest data wins)
    codeTypes: (progress && progress.codeTypesSummary && progress.codeTypesSummary.length > 0)
      ? progress.codeTypesSummary
      : (refBL.codeTypesSummary || []),
    // ── Calendars (v29.0.9) ──
    // Map of all calendars used in the schedule + counts by type + SA holiday audit
    calendars: (progress && progress.calendars) || refBL.calendars || {},
    calendarTypeCounts: (progress && progress.calendarTypeCounts) || refBL.calendarTypeCounts || { Global: 0, Project: 0, Resource: 0 },
    saHolidayAudit: (() => {
      try {
        const cals = (progress && progress.calendars) || refBL.calendars || {};
        const projStart = (progress && progress.project && progress.project.start) || refBL.project.start;
        const projFinish = (progress && progress.project && progress.project.finish) || refBL.project.finish;
        if (!projStart || !projFinish) return null;
        // Find the most-used calendar (the project's primary calendar)
        const calArr = Object.values(cals);
        if (calArr.length === 0) return null;
        const primary = calArr.reduce((max, c) => c.activityCount > (max.activityCount || 0) ? c : max, calArr[0]);
        const audit = auditCalendarSAHolidays(primary, projStart.slice(0, 10), projFinish.slice(0, 10));
        return { primaryCalendar: primary, ...audit };
      } catch (e) {
        console.warn("saHolidayAudit:", e);
        return null;
      }
    })()
  };
}
const fmtD = (d) => d ? d.split("T")[0] : "\u2014";
const fmtPct = (v) => isNaN(v) || v === null ? "\u2014" : v.toFixed(2) + "%";
const fmtN = (v) => isNaN(v) || v === null ? "\u2014" : v.toFixed(1);
const fmtC = (v) => v ? v.toLocaleString("en-US", { maximumFractionDigits: 0 }) : "\u2014";
const vc = (v) => v > 1 ? "#22c55e" : v >= -1 ? "#fbbf24" : "#f43f5e";
const sc = (s) => {
  var _a;
  return (_a = { Completed: "#22c55e", "In Progress": "#f59e0b", "Not Started": "var(--textDim)" }[s]) != null ? _a : "var(--textDim)";
};
function Gauge({ value, color, label, sub, size = "normal" }) {
  const pct = Math.min(Math.max(value / 100, 0), 1);
  const lg = size === "large";
  const sz = lg ? 130 : 100;
  const r = lg ? 52 : 40;
  const cx = sz / 2, cy = sz / 2 + (lg ? 4 : 0), sw = lg ? 11 : 8;
  const toR = (d) => d * Math.PI / 180;
  const arc = (p) => {
    const end = 135 + 270 * p;
    const x1 = cx + r * Math.cos(toR(135)), y1 = cy + r * Math.sin(toR(135));
    const x2 = cx + r * Math.cos(toR(end)), y2 = cy + r * Math.sin(toR(end));
    return `M ${x1} ${y1} A ${r} ${r} 0 ${270 * p > 180 ? 1 : 0} 1 ${x2} ${y2}`;
  };
  return /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } }, /* @__PURE__ */ React.createElement("svg", { width: sz, height: sz - 16, viewBox: `0 0 ${sz} ${sz - 16}` }, /* @__PURE__ */ React.createElement("path", { d: arc(1), fill: "none", stroke: "var(--border)", strokeWidth: sw, strokeLinecap: "round" }), /* @__PURE__ */ React.createElement(
    "path",
    {
      d: arc(pct),
      fill: "none",
      stroke: color,
      strokeWidth: sw,
      strokeLinecap: "round",
      style: { filter: `drop-shadow(0 0 6px ${color}aa)` }
    }
  ), /* @__PURE__ */ React.createElement(
    "text",
    {
      x: cx,
      y: cy - 2,
      textAnchor: "middle",
      fill: color,
      style: { fontSize: lg ? 18 : 13, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }
    },
    value.toFixed(2),
    "%"
  )), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--textSecondary)", fontSize: lg ? 12 : 11, marginTop: -4, fontWeight: lg ? 600 : 500 } }, label), sub && /* @__PURE__ */ React.createElement("div", { style: { color: "var(--textDim)", fontSize: 9, marginTop: 1 } }, sub));
}
function Card({ label, value, accent, sub, icon }) {
  return /* @__PURE__ */ React.createElement("div", { style: { background: "#0f172a", border: `1px solid ${accent}33`, borderRadius: 12, padding: "14px 16px", boxShadow: `0 0 18px ${accent}10` } }, icon && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, marginBottom: 4, opacity: 0.7 } }, icon), /* @__PURE__ */ React.createElement("div", { style: { color: accent, fontSize: 20, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" } }, value), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--textMuted)", fontSize: 10, marginTop: 2 } }, label), sub && /* @__PURE__ */ React.createElement("div", { style: { color: "var(--textFaint)", fontSize: 9, marginTop: 1 } }, sub));
}
function DualBar({ planned, actual }) {
  const color = vc(actual - planned);
  return /* @__PURE__ */ React.createElement("div", { style: { minWidth: 150 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--textDim)", marginBottom: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { color: "#38bdf8" } }, planned.toFixed(1), "%"), /* @__PURE__ */ React.createElement("span", { style: { color } }, actual.toFixed(1), "%")), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: 12, background: "var(--border)", borderRadius: 6, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: 0, top: 0, width: Math.min(planned, 100) + "%", height: "100%", background: "#1e40af", borderRadius: 6 } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: 0, top: 0, width: Math.min(actual, 100) + "%", height: "100%", background: color + "cc", borderRadius: 6 } })));
}
function Tbl({ cols, rows }) {
  return /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto", borderRadius: 10, border: "1px solid #1e293b" } }, /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 11 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bgPanel)" } }, cols.map((c) => /* @__PURE__ */ React.createElement("th", { key: c.k, style: { padding: "8px 11px", textAlign: "left", color: "#38bdf8", fontWeight: 600, borderBottom: "1px solid #1e293b", whiteSpace: "nowrap", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.04em" } }, c.l)))), /* @__PURE__ */ React.createElement("tbody", null, rows.map((row, i) => /* @__PURE__ */ React.createElement("tr", { key: i, style: { background: i % 2 === 0 ? "var(--bgCardAlt)" : "var(--bgPanelAlt)", borderBottom: "1px solid #141e2e" } }, cols.map((c) => /* @__PURE__ */ React.createElement("td", { key: c.k, style: { padding: "7px 11px", whiteSpace: "nowrap", color: c.color ? c.color(row) : "var(--textSecondary)" } }, c.render ? c.render(row) : row[c.k])))))));
}
function HelpBanner({ title, body, onDismiss, lang }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--bgCard)",
    border: "1px solid var(--border)",
    borderInlineStart: "4px solid #38bdf8",
    borderRadius: 10,
    padding: "10px 14px",
    marginBottom: 12,
    display: "flex",
    gap: 10,
    alignItems: "flex-start"
  } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, lineHeight: 1, marginTop: 2 } }, "\u{1F4A1}"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 12,
    fontWeight: 700,
    color: "#38bdf8",
    marginBottom: 4,
    fontFamily: "'JetBrains Mono', monospace"
  } }, title), /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 11,
    color: "var(--textSecondary)",
    lineHeight: 1.6
  } }, body)), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: onDismiss,
      title: lang === "ar" ? "\u0625\u062E\u0641\u0627\u0621" : "Hide",
      style: {
        background: "transparent",
        border: "1px solid var(--border)",
        color: "var(--textDim)",
        borderRadius: 6,
        width: 26,
        height: 26,
        cursor: "pointer",
        fontSize: 14,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0
      }
    },
    "\u2715"
  ));
}
// ═══════════════════════════════════════════════════════════════════
// v28.1: EduBanner — Educational expandable explanation component
// ═══════════════════════════════════════════════════════════════════
function EduBanner({ eduKey, lang, color = "#0ea5e9" }) {
  const [open, setOpen] = useState(false);
  const data = EDU_DATA[eduKey];
  if (!data) return null;
  const d = data[lang] || data.en;
  return /* @__PURE__ */ React.createElement("div", {
    style: {
      background: "var(--bgCard)",
      border: "1px solid var(--border)",
      borderInlineStart: "3px solid " + color,
      borderRadius: 10,
      marginBottom: 12,
      overflow: "hidden",
      transition: "all .2s"
    }
  },
    // Header (always visible)
    /* @__PURE__ */ React.createElement("div", {
      onClick: () => setOpen(!open),
      style: {
        padding: "10px 14px",
        display: "flex",
        gap: 10,
        alignItems: "center",
        cursor: "pointer",
        userSelect: "none"
      }
    },
      /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18 } }, data.icon || "\u{1F4DA}"),
      /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } },
        /* @__PURE__ */ React.createElement("div", {
          style: { fontSize: 12, fontWeight: 700, color, marginBottom: 2, fontFamily: "'JetBrains Mono',monospace" }
        }, d.title),
        /* @__PURE__ */ React.createElement("div", {
          style: { fontSize: 11, color: "var(--textSecondary)", lineHeight: 1.5 }
        }, d.brief)
      ),
      /* @__PURE__ */ React.createElement("button", {
        style: {
          background: open ? color : "transparent",
          color: open ? "#fff" : color,
          border: "1px solid " + color,
          borderRadius: 6,
          padding: "5px 12px",
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "'JetBrains Mono',monospace",
          whiteSpace: "nowrap"
        }
      }, (open ? "\u25BC " : "\u25B6 ") + (lang === "ar" ? (open ? "\u0625\u062e\u0641\u0627\u0621" : "\u0634\u0631\u062d \u0623\u0643\u062b\u0631") : (open ? "Hide" : "Learn More")))
    ),
    // Expanded content
    open && /* @__PURE__ */ React.createElement("div", {
      style: {
        padding: "14px 18px 16px 18px",
        borderTop: "1px solid var(--border)",
        background: color + "08",
        fontSize: 11.5,
        color: "var(--textSecondary)",
        lineHeight: 1.7
      }
    },
      d.whatIs && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } },
        /* @__PURE__ */ React.createElement("div", { style: { color, fontWeight: 700, marginBottom: 4, fontSize: 12 } },
          (lang === "ar" ? "\u{1F4D6} \u0645\u0627 \u0647\u064a\u061f" : "\u{1F4D6} What is it?")
        ),
        /* @__PURE__ */ React.createElement("div", null, d.whatIs)
      ),
      d.howWorks && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } },
        /* @__PURE__ */ React.createElement("div", { style: { color, fontWeight: 700, marginBottom: 4, fontSize: 12 } },
          (lang === "ar" ? "\u2699\uFE0F \u0643\u064a\u0641 \u062a\u064f\u062d\u0633\u0628\u061f" : "\u2699\uFE0F How is it calculated?")
        ),
        /* @__PURE__ */ React.createElement("div", null, d.howWorks)
      ),
      d.formula && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } },
        /* @__PURE__ */ React.createElement("div", { style: { color, fontWeight: 700, marginBottom: 4, fontSize: 12 } },
          (lang === "ar" ? "\u{1F4D0} \u0627\u0644\u0635\u064a\u063a\u0629" : "\u{1F4D0} Formula")
        ),
        /* @__PURE__ */ React.createElement("div", {
          style: { background: "#0f172a", color: "#a5f3fc", padding: "8px 12px", borderRadius: 6, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, whiteSpace: "pre-wrap" }
        }, d.formula)
      ),
      d.howRead && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } },
        /* @__PURE__ */ React.createElement("div", { style: { color, fontWeight: 700, marginBottom: 4, fontSize: 12 } },
          (lang === "ar" ? "\u{1F50D} \u0643\u064a\u0641 \u062a\u0641\u0633\u0651\u0631 \u0627\u0644\u0646\u062a\u0627\u0626\u062c\u061f" : "\u{1F50D} How to interpret?")
        ),
        /* @__PURE__ */ React.createElement("div", { style: { whiteSpace: "pre-wrap" } }, d.howRead)
      ),
      d.whenUse && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } },
        /* @__PURE__ */ React.createElement("div", { style: { color, fontWeight: 700, marginBottom: 4, fontSize: 12 } },
          (lang === "ar" ? "\u{1F3D7}\uFE0F \u0623\u0646\u0648\u0627\u0639 \u0627\u0644\u0645\u0634\u0627\u0631\u064a\u0639 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u0629 \u0641\u064a\u0647\u0627" : "\u{1F3D7}\uFE0F Where is it used?")
        ),
        /* @__PURE__ */ React.createElement("div", { style: { whiteSpace: "pre-wrap" } }, d.whenUse)
      ),
      d.tip && /* @__PURE__ */ React.createElement("div", {
        style: {
          background: "#fbbf2415",
          border: "1px solid #fbbf2444",
          borderRadius: 6,
          padding: "8px 12px",
          marginTop: 6
        }
      },
        /* @__PURE__ */ React.createElement("strong", { style: { color: "#fbbf24" } }, "\u{1F4A1} " + (lang === "ar" ? "\u0646\u0635\u064a\u062d\u0629\u061a " : "Tip: ")),
        d.tip
      )
    )
  );
}
// ═══════════════════════════════════════════════════════════════════
// v28.1: Educational data for all features
// ═══════════════════════════════════════════════════════════════════
const EDU_DATA = {
  // ── Tabs ──
  exec: {
    icon: "\u{1F3AF}",
    en: {
      title: "Executive Summary",
      brief: "High-level KPIs of the project: progress, variance, and forecast finish.",
      whatIs: "A consolidated dashboard showing the most important schedule indicators in one view: planned vs actual progress, schedule variance, and forecast completion.",
      howWorks: "Compares your Baseline (or Revised) plan against the latest Progress update at the data date. Computes overall %complete using your selected method (cost/units/duration/count).",
      howRead: "\u2022 SPI \u2265 1.0: project on or ahead of schedule\n\u2022 SPI 0.95-1.0: minor delay (acceptable)\n\u2022 SPI 0.85-0.95: warning, recovery action needed\n\u2022 SPI < 0.85: critical, escalate to management",
      whenUse: "Every project, every update cycle. Used by:\n\u2022 Project Managers for monthly steering committee\n\u2022 Owners/Clients for status meetings\n\u2022 Contractors for self-monitoring",
      tip: "If forecast finish exceeds baseline finish by >5%, prepare a recovery plan immediately."
    },
    ar: {
      title: "\u0627\u0644\u0645\u0644\u062e\u0651\u0635 \u0627\u0644\u062a\u0646\u0641\u064a\u0630\u064a",
      brief: "\u0645\u0624\u0634\u0631\u0627\u062a \u0627\u0644\u0623\u062f\u0627\u0621 \u0639\u0627\u0644\u064a\u0629 \u0627\u0644\u0645\u0633\u062a\u0648\u0649: \u0627\u0644\u062a\u0642\u062f\u0651\u0645\u060c \u0627\u0644\u0627\u0646\u062d\u0631\u0627\u0641\u060c \u0648\u062a\u0648\u0642\u0651\u0639 \u0627\u0644\u0625\u0646\u062c\u0627\u0632.",
      whatIs: "\u0644\u0648\u062d\u0629 \u0645\u062c\u0645\u0651\u0639\u0629 \u062a\u0639\u0631\u0636 \u0623\u0647\u0645 \u0645\u0624\u0634\u0631\u0627\u062a \u0627\u0644\u062c\u062f\u0648\u0644 \u0641\u064a \u0645\u0643\u0627\u0646 \u0648\u0627\u062d\u062f: \u0627\u0644\u062a\u0642\u062f\u0651\u0645 \u0627\u0644\u0645\u062e\u0637\u0637 \u0645\u0642\u0627\u0628\u0644 \u0627\u0644\u0641\u0639\u0644\u064a\u060c \u0648\u0627\u0644\u0627\u0646\u062d\u0631\u0627\u0641 \u0627\u0644\u0632\u0645\u0646\u064a\u060c \u0648\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0625\u0646\u062c\u0627\u0632 \u0627\u0644\u0645\u062a\u0648\u0642\u0639.",
      howWorks: "\u064a\u0642\u0627\u0631\u0646 \u062e\u0637\u0629 Baseline (\u0623\u0648 Revised) \u0645\u0639 \u0622\u062e\u0631 \u062a\u062d\u062f\u064a\u062b Progress \u0639\u0646\u062f \u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a. \u064a\u062d\u0633\u0628 \u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u062a\u0642\u062f\u0651\u0645 % \u0628\u0637\u0631\u064a\u0642\u062a\u0643 \u0627\u0644\u0645\u062e\u062a\u0627\u0631\u0629 (\u062a\u0643\u0644\u0641\u0629/\u0648\u062d\u062f\u0627\u062a/\u0645\u062f\u0651\u0629/\u0639\u062f\u062f).",
      howRead: "\u2022 SPI \u2265 1.0: \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u0641\u064a \u0627\u0644\u0645\u0648\u0639\u062f \u0623\u0648 \u0645\u062a\u0642\u062f\u0645\n\u2022 SPI 0.95-1.0: \u062a\u0623\u062e\u0651\u0631 \u0628\u0633\u064a\u0637 (\u0645\u0642\u0628\u0648\u0644)\n\u2022 SPI 0.85-0.95: \u062a\u062d\u0630\u064a\u0631\u060c \u064a\u0644\u0632\u0645 \u062e\u0637\u0629 \u0627\u0633\u062a\u0631\u062f\u0627\u062f\n\u2022 SPI < 0.85: \u062d\u0631\u062c\u060c \u062a\u0635\u0639\u064a\u062f \u0644\u0644\u0625\u062f\u0627\u0631\u0629",
      whenUse: "\u0643\u0644 \u0645\u0634\u0631\u0648\u0639\u060c \u0643\u0644 \u062f\u0648\u0631\u0629 \u062a\u062d\u062f\u064a\u062b. \u064a\u0633\u062a\u062e\u062f\u0645\u0647:\n\u2022 \u0645\u062f\u064a\u0631\u0648 \u0627\u0644\u0645\u0634\u0627\u0631\u064a\u0639 \u0644\u0627\u062c\u062a\u0645\u0627\u0639\u0627\u062a \u0627\u0644\u0644\u062c\u0646\u0629 \u0627\u0644\u062a\u0648\u062c\u064a\u0647\u064a\u0629\n\u2022 \u0627\u0644\u0645\u0644\u0627\u0643/\u0627\u0644\u0639\u0645\u0644\u0627\u0621 \u0644\u0627\u062c\u062a\u0645\u0627\u0639\u0627\u062a \u0627\u0644\u062d\u0627\u0644\u0629\n\u2022 \u0627\u0644\u0645\u0642\u0627\u0648\u0644\u0648\u0646 \u0644\u0644\u0645\u062a\u0627\u0628\u0639\u0629 \u0627\u0644\u0630\u0627\u062a\u064a\u0629",
      tip: "\u0625\u0630\u0627 \u062a\u062c\u0627\u0648\u0632 \u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0625\u0646\u062c\u0627\u0632 \u0627\u0644\u0645\u062a\u0648\u0642\u0651\u0639 \u062a\u0627\u0631\u064a\u062e Baseline \u0628\u0623\u0643\u062b\u0631 \u0645\u0646 5%\u060c \u062c\u0647\u0651\u0632 \u062e\u0637\u0629 \u0627\u0633\u062a\u0631\u062f\u0627\u062f \u0641\u0648\u0631\u0627\u064b."
    }
  },
  methods: {
    icon: "\u{1F52C}",
    en: {
      title: "Multi-Method Analysis (Cost/Units/Duration/Count)",
      brief: "Compare progress measured by 4 different methods to expose distortions.",
      whatIs: "Calculates project %complete using FOUR different weighting methods simultaneously, revealing inconsistencies between schedule and physical progress.",
      howWorks: "Each activity contributes to total progress weighted by:\n\u2022 Cost: \u03a3(actual cost) / \u03a3(BAC)\n\u2022 Units: \u03a3(actual units) / \u03a3(planned units)\n\u2022 Duration: \u03a3(elapsed days) / \u03a3(total days)\n\u2022 Count: completed activities / total activities",
      howRead: "Wide gap between methods (>10%) indicates risk:\n\u2022 Count > Cost: front-loaded easy work, expensive items pending\n\u2022 Cost > Count: heavy spending on few activities (overruns?)\n\u2022 Duration > Units: time burnt without physical output\n\u2022 All 4 close: healthy schedule",
      whenUse: "\u2022 Construction projects (verify physical vs financial progress)\n\u2022 EPC contracts (catch front-loaded billing)\n\u2022 Owner/Consultant verification (independent vs contractor claim)\n\u2022 Disputed claims and forensic schedule analysis",
      tip: "If 'Cost' progress is much higher than 'Count' progress, the contractor may be billing for stockpiled materials before installation \u2014 verify physically."
    },
    ar: {
      title: "\u062a\u062d\u0644\u064a\u0644 \u0645\u062a\u0639\u062f\u062f \u0627\u0644\u0637\u0631\u0642 (\u062a\u0643\u0644\u0641\u0629/\u0648\u062d\u062f\u0627\u062a/\u0645\u062f\u0651\u0629/\u0639\u062f\u062f)",
      brief: "\u0645\u0642\u0627\u0631\u0646\u0629 \u0627\u0644\u062a\u0642\u062f\u0651\u0645 \u0628\u0623\u0631\u0628\u0639 \u0637\u0631\u0642 \u0645\u062e\u062a\u0644\u0641\u0629 \u0644\u0643\u0634\u0641 \u0627\u0644\u062a\u0634\u0648\u0651\u0647\u0627\u062a.",
      whatIs: "\u064a\u062d\u0633\u0628 \u0646\u0633\u0628\u0629 \u0625\u0646\u062c\u0627\u0632 \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u0628\u0623\u0631\u0628\u0639 \u0637\u0631\u0642 \u0648\u0632\u0646 \u0645\u062e\u062a\u0644\u0641\u0629 \u0641\u064a \u0646\u0641\u0633 \u0627\u0644\u0648\u0642\u062a\u060c \u0644\u0643\u0634\u0641 \u0627\u0644\u062a\u0646\u0627\u0642\u0636\u0627\u062a \u0628\u064a\u0646 \u0627\u0644\u062c\u062f\u0648\u0644 \u0648\u0627\u0644\u062a\u0642\u062f\u0651\u0645 \u0627\u0644\u0641\u0639\u0644\u064a.",
      howWorks: "\u0643\u0644 \u0646\u0634\u0627\u0637 \u064a\u0633\u0627\u0647\u0645 \u0641\u064a \u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a \u0628\u0648\u0632\u0646:\n\u2022 \u062a\u0643\u0644\u0641\u0629: \u03a3(\u062a\u0643\u0644\u0641\u0629 \u0641\u0639\u0644\u064a\u0629) / \u03a3(BAC)\n\u2022 \u0648\u062d\u062f\u0627\u062a: \u03a3(\u0648\u062d\u062f\u0627\u062a \u0641\u0639\u0644\u064a\u0629) / \u03a3(\u0645\u062e\u0637\u0637\u0629)\n\u2022 \u0645\u062f\u0651\u0629: \u03a3(\u0623\u064a\u0627\u0645 \u0645\u0646\u0642\u0636\u064a\u0629) / \u03a3(\u0625\u062c\u0645\u0627\u0644\u064a)\n\u2022 \u0639\u062f\u062f: \u0623\u0646\u0634\u0637\u0629 \u0645\u0643\u062a\u0645\u0644\u0629 / \u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a",
      howRead: "\u0627\u0644\u0641\u0631\u0642 \u0627\u0644\u0643\u0628\u064a\u0631 (>10%) \u064a\u062f\u0644 \u0639\u0644\u0649 \u0645\u062e\u0627\u0637\u0631:\n\u2022 \u0639\u062f\u062f > \u062a\u0643\u0644\u0641\u0629: \u0625\u0646\u062c\u0627\u0632 \u0623\u0639\u0645\u0627\u0644 \u0633\u0647\u0644\u0629 \u0623\u0648\u0644\u0627\u064b \u0648\u0627\u0644\u0628\u0627\u0642\u064a \u063a\u0627\u0644\u064a\n\u2022 \u062a\u0643\u0644\u0641\u0629 > \u0639\u062f\u062f: \u0635\u0631\u0641 \u0643\u0628\u064a\u0631 \u0639\u0644\u0649 \u0623\u0646\u0634\u0637\u0629 \u0642\u0644\u064a\u0644\u0629 (\u062a\u062c\u0627\u0648\u0632\u0627\u062a\u061f)\n\u2022 \u0645\u062f\u0651\u0629 > \u0648\u062d\u062f\u0627\u062a: \u0627\u0633\u062a\u0647\u0644\u0627\u0643 \u0648\u0642\u062a \u062f\u0648\u0646 \u0625\u0646\u062a\u0627\u062c \u0641\u0639\u0644\u064a\n\u2022 \u0627\u0644\u0623\u0631\u0628\u0639\u0629 \u0645\u062a\u0642\u0627\u0631\u0628\u0629: \u062c\u062f\u0648\u0644 \u0633\u0644\u064a\u0645",
      whenUse: "\u2022 \u0645\u0634\u0627\u0631\u064a\u0639 \u0627\u0644\u0625\u0646\u0634\u0627\u0621\u0627\u062a (\u062a\u062d\u0642\u0651\u0642 \u0641\u064a\u0632\u064a\u0627\u0626\u064a/\u0645\u0627\u0644\u064a)\n\u2022 \u0639\u0642\u0648\u062f EPC (\u0643\u0634\u0641 \u0627\u0644\u0641\u0648\u062a\u0631\u0629 \u0627\u0644\u0645\u0628\u0643\u0631\u0629)\n\u2022 \u062a\u062d\u0642\u0651\u0642 \u0627\u0644\u0645\u0627\u0644\u0643/\u0627\u0644\u0627\u0633\u062a\u0634\u0627\u0631\u064a (\u0645\u0633\u062a\u0642\u0644 \u0639\u0646 \u0627\u0644\u0645\u0642\u0627\u0648\u0644)\n\u2022 \u0627\u0644\u0645\u0637\u0627\u0644\u0628\u0627\u062a \u0627\u0644\u0645\u062a\u0646\u0627\u0632\u0639 \u0639\u0644\u064a\u0647\u0627 \u0648\u0627\u0644\u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u062c\u0646\u0627\u0626\u064a \u0644\u0644\u062c\u062f\u0627\u0648\u0644",
      tip: "\u0625\u0630\u0627 \u0643\u0627\u0646 \u0627\u0644\u062a\u0642\u062f\u0651\u0645 \u0628\u0627\u0644\u062a\u0643\u0644\u0641\u0629 \u0623\u0639\u0644\u0649 \u0628\u0643\u062b\u064a\u0631 \u0645\u0646 \u0627\u0644\u062a\u0642\u062f\u0651\u0645 \u0628\u0627\u0644\u0639\u062f\u062f\u060c \u0631\u0628\u0651\u0645\u0627 \u064a\u0641\u0648\u062a\u0631 \u0627\u0644\u0645\u0642\u0627\u0648\u0644 \u0639\u0644\u0649 \u0645\u0648\u0627\u062f \u0645\u062e\u0632\u0651\u0646\u0629 \u0642\u0628\u0644 \u062a\u0631\u0643\u064a\u0628\u0647\u0627 \u2014 \u062a\u0623\u0643\u0651\u062f \u0641\u064a\u0632\u064a\u0627\u0626\u064a\u0627\u064b."
    }
  },
  scurve: {
    icon: "\u{1F4C8}",
    en: {
      title: "S-Curve",
      brief: "Cumulative progress curve over time \u2014 the universal language of project status.",
      whatIs: "A graphical representation of cumulative progress (Y-axis) over time (X-axis). Called 'S-Curve' because typical projects start slow, accelerate in the middle, and slow down at completion \u2014 forming an S shape.",
      howWorks: "Plots three curves:\n\u2022 Planned (Baseline): cumulative planned progress at each date\n\u2022 Earned/Actual: cumulative earned/actual progress at each date\n\u2022 Forecast: projected completion based on current trend",
      howRead: "\u2022 Actual ABOVE Planned: ahead of schedule (good)\n\u2022 Actual BELOW Planned: behind schedule (concerning)\n\u2022 Gap widening: deteriorating performance\n\u2022 Curves crossing: recovery achieved\n\u2022 Flat actual line: project stalled",
      whenUse: "\u2022 Universal \u2014 every construction, EPC, IT, and engineering project\n\u2022 Owner reporting (monthly progress reports)\n\u2022 Cash flow forecasting\n\u2022 Performance trending and recovery analysis\n\u2022 Banking/finance for milestone payments",
      tip: "An S-Curve that bends downward (concave) midway means resources are leaving the project. Investigate immediately."
    },
    ar: {
      title: "\u0645\u0646\u062d\u0646\u0649 S",
      brief: "\u0645\u0646\u062d\u0646\u0649 \u0627\u0644\u062a\u0642\u062f\u0651\u0645 \u0627\u0644\u062a\u0631\u0627\u0643\u0645\u064a \u0639\u0628\u0631 \u0627\u0644\u0632\u0645\u0646 \u2014 \u0627\u0644\u0644\u063a\u0629 \u0627\u0644\u0639\u0627\u0644\u0645\u064a\u0629 \u0644\u062d\u0627\u0644\u0629 \u0627\u0644\u0645\u0634\u0631\u0648\u0639.",
      whatIs: "\u062a\u0645\u062b\u064a\u0644 \u0628\u064a\u0627\u0646\u064a \u0644\u0644\u062a\u0642\u062f\u0651\u0645 \u0627\u0644\u062a\u0631\u0627\u0643\u0645\u064a (\u0627\u0644\u0645\u062d\u0648\u0631 Y) \u0639\u0628\u0631 \u0627\u0644\u0632\u0645\u0646 (\u0627\u0644\u0645\u062d\u0648\u0631 X). \u0633\u064f\u0645\u0651\u064a 'S-Curve' \u0644\u0623\u0646 \u0627\u0644\u0645\u0634\u0627\u0631\u064a\u0639 \u0639\u0627\u062f\u0629\u064b \u062a\u0628\u062f\u0623 \u0628\u0628\u0637\u0621\u060c \u062b\u0645 \u062a\u062a\u0633\u0627\u0631\u0639\u060c \u062b\u0645 \u062a\u0628\u0637\u0626 \u0641\u064a \u0627\u0644\u0646\u0647\u0627\u064a\u0629 \u2014 \u0645\u0643\u0648\u0651\u0646\u0629 \u0634\u0643\u0644 S.",
      howWorks: "\u064a\u0631\u0633\u0645 \u062b\u0644\u0627\u062b\u0629 \u0645\u0646\u062d\u0646\u064a\u0627\u062a:\n\u2022 \u0627\u0644\u0645\u062e\u0637\u0651\u0637 (Baseline): \u0627\u0644\u062a\u0642\u062f\u0651\u0645 \u0627\u0644\u062a\u0631\u0627\u0643\u0645\u064a \u0627\u0644\u0645\u062e\u0637\u0651\u0637\n\u2022 \u0627\u0644\u0645\u0643\u062a\u0633\u0628/\u0627\u0644\u0641\u0639\u0644\u064a: \u0627\u0644\u062a\u0642\u062f\u0651\u0645 \u0627\u0644\u062a\u0631\u0627\u0643\u0645\u064a \u0627\u0644\u0641\u0639\u0644\u064a\n\u2022 \u0627\u0644\u062a\u0648\u0642\u0651\u0639: \u0627\u0644\u0625\u0646\u062c\u0627\u0632 \u0627\u0644\u0645\u062a\u0648\u0642\u0651\u0639 \u0628\u0646\u0627\u0621\u064b \u0639\u0644\u0649 \u0627\u0644\u0623\u062f\u0627\u0621 \u0627\u0644\u062d\u0627\u0644\u064a",
      howRead: "\u2022 \u0627\u0644\u0641\u0639\u0644\u064a \u0641\u0648\u0642 \u0627\u0644\u0645\u062e\u0637\u0651\u0637: \u0645\u062a\u0642\u062f\u0651\u0645 (\u062c\u064a\u062f)\n\u2022 \u0627\u0644\u0641\u0639\u0644\u064a \u062a\u062d\u062a \u0627\u0644\u0645\u062e\u0637\u0651\u0637: \u0645\u062a\u0623\u062e\u0631 (\u0645\u0642\u0644\u0642)\n\u2022 \u0627\u062a\u0633\u0627\u0639 \u0627\u0644\u0641\u062c\u0648\u0629: \u0623\u062f\u0627\u0621 \u0645\u062a\u062f\u0647\u0648\u0631\n\u2022 \u062a\u0642\u0627\u0637\u0639 \u0627\u0644\u0645\u0646\u062d\u0646\u064a\u0627\u062a: \u062a\u062d\u0642\u0651\u0642 \u0627\u0633\u062a\u0631\u062f\u0627\u062f\n\u2022 \u062e\u0637 \u0641\u0639\u0644\u064a \u0623\u0641\u0642\u064a: \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u0645\u062a\u0648\u0642\u0651\u0641",
      whenUse: "\u2022 \u0639\u0627\u0644\u0645\u064a \u2014 \u0643\u0644 \u0645\u0634\u0627\u0631\u064a\u0639 \u0627\u0644\u0625\u0646\u0634\u0627\u0621\u0627\u062a\u060c EPC\u060c IT\u060c \u0627\u0644\u0647\u0646\u062f\u0633\u064a\u0629\n\u2022 \u062a\u0642\u0627\u0631\u064a\u0631 \u0627\u0644\u0645\u0627\u0644\u0643 (\u0627\u0644\u062a\u0642\u0627\u0631\u064a\u0631 \u0627\u0644\u0634\u0647\u0631\u064a\u0629)\n\u2022 \u062a\u0648\u0642\u0651\u0639\u0627\u062a \u0627\u0644\u062a\u062f\u0641\u0651\u0642 \u0627\u0644\u0646\u0642\u062f\u064a\n\u2022 \u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u0623\u062f\u0627\u0621 \u0648\u0627\u0644\u0627\u0633\u062a\u0631\u062f\u0627\u062f\n\u2022 \u0627\u0644\u0628\u0646\u0648\u0643/\u0627\u0644\u062a\u0645\u0648\u064a\u0644 \u0644\u062f\u0641\u0639\u0627\u062a \u0627\u0644\u0645\u0631\u0627\u062d\u0644",
      tip: "\u0645\u0646\u062d\u0646\u0649 S \u064a\u0646\u062d\u0646\u064a \u0644\u0644\u0623\u0633\u0641\u0644 \u0641\u064a \u0627\u0644\u0648\u0633\u0637 \u064a\u0639\u0646\u064a \u0623\u0646 \u0627\u0644\u0645\u0648\u0627\u0631\u062f \u062a\u063a\u0627\u062f\u0631 \u0627\u0644\u0645\u0634\u0631\u0648\u0639. \u062a\u062d\u0642\u0651\u0642 \u0641\u0648\u0631\u0627\u064b."
    }