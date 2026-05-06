// ════════════════════════════════════════════════════════════════════
// 01_phase_library_and_discovery.js — v29.0.11.1 (R1+R2 fixes from ChatGPT Round 7)
// Lines 2031 - 2796 (of 19957 total)
// PHASE_LIBRARY + discoverPhasesFromSchedule
// 
// The source of truth is p6-analyzer.html.
// Auto-generated on update of p6-analyzer.html.
// ════════════════════════════════════════════════════════════════════

  const _wbsName_ = (act) => {
    if (!act) return null;
    const wbsId = act.wbs || act.wbsId || (act._raw && (act._raw.wbs || act._raw.wbsId));
    if (!wbsId) return null;
    const w = wbsMap && wbsMap[wbsId];
    return w ? (w.name || w.code || null) : null;
  };

  // Activity weight per method (matches weightFns in analyze())
  // act may be a row (with cost/units/dur fields) or raw activity (_raw)
  const _actWeight = (act, method) => {
    if (!act) return 0;
    const raw = act._raw || act;
    if (method === "cost") {
      // Try row.cost first, fallback to computing from raw
      if (typeof act.cost === "number") return act.cost;
      const c = (raw.plannedNonLaborCost || 0) + (raw.plannedLaborCost || 0) + (raw.plannedMaterialCost || 0);
      return c;
    }
    if (method === "units") {
      if (typeof act.units === "number") return act.units;
      const u = (raw.plannedNonLaborUnits || 0) + (raw.plannedLaborUnits || 0) + (raw.plannedMaterialUnits || 0);
      return u;
    }
    if (method === "duration") {
      if (typeof act.dur === "number") return act.dur;
      return raw.plannedDuration || 0;
    }
    if (method === "count") return 1;
    if (method === "ng_matrix") {
      return (typeof getNGMatrixWeight === "function")
        ? getNGMatrixWeight((act.name || act.actName || raw.name || raw.actName) || "", ngMatrixColumn || "ss_lines", _wbsName_(act))
        : 0;
    }
    return 0;
  };

  const totalAct = (activities || []).length;
  if (totalAct === 0) return { phases: [], suggestedTemplate: "generic", confidence: 0 };

  // Helper: assign data for a matched phase (uses ALL methods)
  const _assignProgress = (phaseKey, act) => {
    phaseScores[phaseKey] = (phaseScores[phaseKey] || 0) + 1;
    phaseCounts[phaseKey] = (phaseCounts[phaseKey] || 0) + 1;
    _initPhase(phaseKey);
    const planned = (typeof act.plannedPct === "number") ? act.plannedPct : 0;
    const actual = (typeof act.actualPct === "number") ? act.actualPct : 0;
    for (const method of METHODS) {
      const w = _actWeight(act, method);
      if (w > 0) {
        phaseAgg[phaseKey][method].wSum += w;
        phaseAgg[phaseKey][method].plannedSum += (planned * w);
        phaseAgg[phaseKey][method].actualSum += (actual * w);
      }
    }
  };

  for (const act of activities) {
    if (!act || act.isMilestone || act.isSummary) continue;
    const rawAct = act._raw || act; // _raw has full activity data; rows have summary fields
    const name = (act.name || act.actName || "").toLowerCase();
    const wbsId = act.wbs || act.wbsId || (act._raw && (act._raw.wbs || act._raw.wbsId));
    const wbsName = (wbsMap && wbsId && wbsMap[wbsId])
      ? ((wbsMap[wbsId].name || "") + " " + (wbsMap[wbsId].code || "")).toLowerCase()
      : "";
    const haystack = name + " | " + wbsName;

    // Match against ALL phase patterns and collect scores
    let matchedMain = false;
    for (const rule of NG_PHASE_PATTERNS) {
      let matched = false;
      for (const p of rule.patterns) {
        if (p.test(name) || (wbsName && p.test(wbsName))) { matched = true; break; }
      }
      if (matched) {
        _assignProgress(rule.phase, act);
        matchedMain = true;
        break;
      }
    }
    // Custom phase detection — only if no main pattern matched
    // FIX CALC-04: skip custom patterns if already matched via NG_PHASE_PATTERNS
    // to prevent the same activity being double-counted in two phases
    if (!matchedMain) {
    const customPatterns = {
      mechanical: /\b(mechanical|HVAC|pump|compressor|turbine|boiler|heat\s+exchanger|vessel|tank)\b/i,
      electrical: /\b(electrical|MCC|panel|switchgear|transformer|cable\s+tray|lighting|earth(?:ing)?\s+system|UPS|busbar)\b/i,
      piping: /\b(piping|pipe\s+(spool|fabrication|installation)|valve\s+installation|flange|hydrotest)\b/i,
      hvac: /\b(HVAC|air\s+conditioning|ventilation|chiller|AHU|FCU|ductwork)\b/i,
      insulation: /\b(insulation|painting|coating|cladding|wrapping)\b/i,
      fireproofing: /\b(fireproofing|fire\s+rating|intumescent)\b/i,
      scaffolding: /\b(scaffold|scaffolding)\b/i,
      eng_interface: /\b(interface\s+(coordination|meeting)|coordination\s+meeting)\b/i,
      pre_commissioning: /\b(pre[\s-]?commissioning|pre[\s-]?check|control\s+cable\s+insulation\s+test)\b/i,
      shutdown: /\b(shutdown|outage|isolation\s+request)\b/i,
      walkthrough: /\b(walk[\s-]?through|walk[\s-]?around|final\s+inspection)\b/i,
      energization: /\b(energization|energiz|first\s+power|hot\s+commissioning)\b/i,
      process: /\b(process\s+(engineering|design|simulation)|HAZOP|P&ID)\b/i
    };
    for (const [phaseKey, regex] of Object.entries(customPatterns)) {
      if (regex.test(haystack)) {
        _assignProgress(phaseKey, act);
        break; // FIX CALC-04: only assign to first matching custom phase
      }
    }
    } // end if (!matchedMain)
  }

  // Compute weights based on duration share (for visual sizing - independent of method)
  const totalDur = Object.values(phaseAgg).reduce((s, m) => s + (m.duration ? m.duration.wSum : 0), 0) || 1;
  const discoveredPhases = Object.keys(phaseScores)
    .filter((k) => phaseCounts[k] >= 2)
    .map((k) => {
      const agg = phaseAgg[k];
      // Build per-method progress map
      const progressByMethod = {};
      for (const m of METHODS) {
        const a = agg[m];
        progressByMethod[m] = {
          plannedPct: a.wSum > 0 ? +(a.plannedSum / a.wSum).toFixed(1) : 0,
          actualPct:  a.wSum > 0 ? +(a.actualSum  / a.wSum).toFixed(1) : 0,
          weightSum:  +a.wSum.toFixed(2)
        };
      }
      // Use duration as the visual weight basis (size of block in timeline)
      const durSum = agg.duration ? agg.duration.wSum : 0;
      return {
        key: k,
        weight: +(durSum / totalDur * 100).toFixed(1),
        activityCount: phaseCounts[k],
        // Default planned/actual = duration-based (legacy compatibility)
        plannedPct: progressByMethod.duration.plannedPct,
        actualPct:  progressByMethod.duration.actualPct,
        // NEW: per-method progress for live recompute when method changes
        progressByMethod
      };
    })
    .sort((a, b) => b.weight - a.weight);

  // Re-normalize visual weights to exactly 100
  const sumW = discoveredPhases.reduce((s, p) => s + p.weight, 0);
  if (sumW > 0 && Math.abs(sumW - 100) > 0.5) {
    discoveredPhases.forEach((p) => { p.weight = +(p.weight / sumW * 100).toFixed(1); });
  }
  // Suggest best matching template
  const discoveredKeys = new Set(discoveredPhases.map((p) => p.key));
  let bestMatch = "generic"; let bestScore = 0;
  for (const [tplKey, tpl] of Object.entries(PHASE_TEMPLATES)) {
    let score = 0;
    for (const ph of tpl.phases) if (discoveredKeys.has(ph.key)) score++;
    score = score / tpl.phases.length;
    if (score > bestScore) { bestScore = score; bestMatch = tplKey; }
  }
  return {
    phases: discoveredPhases,
    suggestedTemplate: bestMatch,
    confidence: +(bestScore * 100).toFixed(0),
    activityCount: totalAct
  };
}

// Resolves a template (or "auto"/"discover") into final phases array
// Returns: { phases: [...], source: "template"|"discovered"|"custom", templateKey }
// v29.0.9: enriches static templates with progressByMethod for live method switching
function resolvePhaseTemplate(templateKey, discoveryResult) {
  if (templateKey === "discover" || templateKey === "auto") {
    if (discoveryResult && discoveryResult.phases && discoveryResult.phases.length > 0) {
      return { phases: discoveryResult.phases, source: "discovered", templateKey: "discover" };
    }
    templateKey = (discoveryResult && discoveryResult.suggestedTemplate) || "generic";
  }
  const tpl = PHASE_TEMPLATES[templateKey] || PHASE_TEMPLATES.generic;
  // Enrich with progress data (if discovery has matching phase keys)
  const discoveredMap = {};
  if (discoveryResult && discoveryResult.phases) {
    for (const dp of discoveryResult.phases) discoveredMap[dp.key] = dp;
  }
  const enrichedPhases = tpl.phases.map((p) => {
    const dp = discoveredMap[p.key];
    return {
      key: p.key,
      weight: p.weight,
      plannedPct: dp ? dp.plannedPct : 0,
      actualPct: dp ? dp.actualPct : 0,
      activityCount: dp ? dp.activityCount : 0,
      // Pass through per-method progress for live recomputation
      progressByMethod: dp ? dp.progressByMethod : null
    };
  });
  return { phases: enrichedPhases, source: "template", templateKey };
}

// ─────────────────────────────────────────────────────────────────────────
// LEGACY: NG MATRIX (National Grid SA) - 10 Project Types × 7 Phases
// Source: Internal NG SA standard (image provided by user)
// Kept for backward compatibility; new code uses PHASE_TEMPLATES
// ─────────────────────────────────────────────────────────────────────────
const NG_MATRIX_WEIGHTS = {
  // Phase order: prep, design, equipment, construction, installation, testing, closeout
  ss_lines:        { prep: 2, design: 10, equipment: 35, construction: 20, installation: 20, testing: 10, closeout: 3 },
  ugc:             { prep: 2, design:  8, equipment: 40, construction: 30, installation: 15, testing:  2, closeout: 3 },
  ohtl:            { prep: 2, design: 10, equipment: 35, construction: 20, installation: 25, testing:  5, closeout: 3 },
  drpc_svc:        { prep: 2, design: 10, equipment: 30, construction: 25, installation: 15, testing: 15, closeout: 3 },
  purchase_order:  { prep: 2, design:  0, equipment: 70, construction:  0, installation: 15, testing: 10, closeout: 3 },
  battery:         { prep: 2, design:  8, equipment: 48, construction: 15, installation: 15, testing: 10, closeout: 2 },
  hvdc:            { prep: 2, design:  5, equipment: 65, construction: 13, installation: 11, testing:  3, closeout: 1 },
  asset_repl:      { prep: 2, design:  5, equipment: 45, construction: 10, installation: 25, testing: 10, closeout: 3 },
  telecom:         { prep: 2, design: 10, equipment: 40, construction: 10, installation: 25, testing: 10, closeout: 3 },
  cyber:           { prep: 2, design: 10, equipment: 45, construction:  0, installation: 30, testing: 10, closeout: 3 }
};

// Maps detectProjectType().key → NG Matrix column key
// All 10 NG matrix project types are covered here
const NG_PROJECT_TYPE_MAP = {
  substation:        "ss_lines",     // Substation/General/SS & Lines
  transmission_oh:   "ohtl",         // Overhead Transmission Line
  transmission_ug:   "ugc",          // UGC/Submarine Cables
  battery_storage:   "battery",      // Battery System
  hvdc:              "hvdc",         // High Voltage DC Projects
  telecom:           "telecom",      // Telecommunication / Upgrade System / Fire Fighting
  cybersecurity:     "cyber",        // Cyber Security
  asset_replacement: "asset_repl",   // Asset Replacement SS/UG/TL
  drpc_svc:          "drpc_svc",     // DRPC/SVC
  purchase_order:    "purchase_order", // Purchase Order
  // Aliases for related types that should use NG matrix
  scada_comm:        "telecom",      // SCADA/Communication uses telecom weights
  fire_protection:   "telecom",      // Fire Fighting uses telecom column
  statcom:           "drpc_svc"      // STATCOM uses DRPC/SVC weights
};

// Phase classification patterns (keywords matched against activity name)
// Order matters: more specific patterns should come first
const NG_PHASE_PATTERNS = [
  {
    phase: "closeout",
    label_en: "Project Closeout",
    label_ar: "\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0645\u0634\u0631\u0648\u0639",
    color: "#94a3b8",
    patterns: [
      /\b(handover|hand[\s-]?over)\b/i,
      /\bpunch\s*list\b/i,
      /\bcloseout|close[\s-]?out\b/i,
      /\bas[\s-]?built\b/i,
      /\bdemobilization|demobilisation|demob\b/i,
      /\bfinal\s+(acceptance|certificate|payment)\b/i,
      /\b(taking[\s-]?over|TOC|FAC|PAC)\b/i,
      /\blessons\s+learned\b/i,
      /\bproject\s+(closure|completion|finalization)\b/i,
      /\bspare\s+parts\s+(delivery|handover)\b/i,
      /\u0625\u063A\u0644\u0627\u0642|\u062A\u0633\u0644\u064A\u0645|\u062A\u0633\u0644\u0651\u0645|\u062A\u062D\u0633\u064A\u0646\u0627\u062A\s+\u0646\u0647\u0627\u0626\u064A\u0629/i
    ]
  },
  {
    phase: "testing",
    label_en: "Testing & Commissioning",
    label_ar: "\u0627\u0644\u0641\u062D\u0635 \u0648\u0627\u0644\u062A\u0634\u063A\u064A\u0644",
    color: "#a78bfa",
    patterns: [
      /\bcommissioning|commission\b/i,
      /\benergization|energise|energiz\b/i,
      /\b(SAT|site\s+acceptance\s+test)\b/i,
      /\bpre[\s-]?commissioning\b/i,
      /\b(reliability\s+test|performance\s+test)\b/i,
      /\b(testing|test|tests)\b(?!\s+(result|certificate|report))/i,
      /\b(loop\s+check|hot\s+commissioning|cold\s+commissioning)\b/i,
      /\bstart[\s-]?up\b/i,
      /\bcommissioning\s+(activities|procedures)\b/i,
      /\u0641\u062D\u0635|\u0627\u062E\u062A\u0628\u0627\u0631|\u062A\u0634\u063A\u064A\u0644|\u062A\u0634\u063A\u0651\u0644/i
    ]
  },
  {
    phase: "installation",
    label_en: "Installation",
    label_ar: "\u0627\u0644\u062A\u0631\u0643\u064A\u0628",
    color: "#f59e0b",
    patterns: [
      /\b(installation|install|installing)\b/i,
      /\b(erection|erect|erecting)\b/i,
      /\b(pulling|pull)\s+(cable|conductor|wire)\b/i,
      /\btermination|terminate|terminations\b/i,
      /\b(wiring|cabling)\b/i,
      /\b(fixing|fixation|mounting|mount)\b/i,
      /\b(stringing|tensioning|sagging)\b/i,
      /\u062A\u0631\u0643\u064A\u0628|\u062A\u0631\u0643\u0651\u0628|\u062A\u062B\u0628\u064A\u062A|\u0633\u062D\u0628\s+\u0643\u0627\u0628\u0644/i
    ]
  },
  {
    phase: "construction",
    label_en: "Construction (Civil Works)",
    label_ar: "\u0627\u0644\u0625\u0646\u0634\u0627\u0621 (\u0623\u0639\u0645\u0627\u0644 \u0645\u062F\u0646\u064A\u0629)",
    color: "#fb923c",
    patterns: [
      /\b(excavation|excavate|excavating)\b/i,
      /\b(foundation|foundations|footing)\b/i,
      /\b(concrete|concreting|RC|PC)\s+(works|pour|pouring|cast)\b/i,
      /\b(civil\s+works|civil\s+engineering)\b/i,
      /\b(structural|structure|steelwork)\b/i,
      /\b(grouting|grout|grade\s+beam)\b/i,
      /\b(backfilling|backfill|compaction)\b/i,
      /\b(formwork|shuttering|rebar|reinforcement)\b/i,
      /\b(boundary\s+wall|fence|fencing|access\s+road)\b/i,
      /\b(roof|roofing|cladding)\b/i,
      /\u062D\u0641\u0631|\u0623\u0633\u0627\u0633|\u062E\u0631\u0633\u0627\u0646\u0629|\u0623\u0639\u0645\u0627\u0644\s+\u0645\u062F\u0646\u064A\u0629|\u0631\u062F\u0645|\u0628\u0646\u0627\u0621/i
    ]
  },
  {
    phase: "equipment",
    label_en: "Equipment & Material",
    label_ar: "\u0627\u0644\u0645\u0639\u062F\u0627\u062A \u0648\u0627\u0644\u0645\u0648\u0627\u062F",
    color: "#0ea5e9",
    patterns: [
      /\b(P\.?O|PO|purchase\s+order)\b/i,
      /\b(LOI|letter\s+of\s+intent)\b/i,
      /\b(manufacturing|fabrication|production)\b/i,
      /\b(FAT|factory\s+acceptance\s+test)\b/i,
      /\b(shipment|shipping|shipped)\b/i,
      /\b(delivery|delivered|arrival)\b/i,
      /\b(material|materials|equipment)\s+(supply|procurement|receipt)\b/i,
      /\b(MIR|material\s+inspection\s+report)\b/i,
      /\b(release\s+for\s+manufacturing|RFM)\b/i,
      /\b(release\s+for\s+shipment|RFS)\b/i,
      /\u0634\u062D\u0646|\u062A\u0635\u0646\u064A\u0639|\u062A\u0648\u0631\u064A\u062F|\u062A\u0633\u0644\u064A\u0645\s+\u0627\u0644\u0645\u0639\u062F\u0627\u062A|\u0623\u0645\u0631\s+\u0634\u0631\u0627\u0621/i
    ]
  },
  {
    phase: "design",
    label_en: "Design & Engineering",
    label_ar: "\u0627\u0644\u062A\u0635\u0645\u064A\u0645 \u0648\u0627\u0644\u0647\u0646\u062F\u0633\u0629",
    color: "#22d3ee",
    patterns: [
      /\b(design|designing|designed)\b/i,
      /\b(engineering|engineer)\b/i,
      /\b(drawing|drawings|dwg)\b/i,
      /\b(calculation|calculations|calc)\b/i,
      /\b(specification|spec|specs)\b/i,
      /\b(IFC|issued\s+for\s+construction)\b/i,
      /\b(IFA|issued\s+for\s+approval)\b/i,
      /\b(IFR|issued\s+for\s+review)\b/i,
      /\b(status\s+[ABCDE](?:\s|$))/i,
      /\b(Rev\.?\s*0|revision\s+0)\b/i,
      /\b(submittal|submit|submission)\s+(drawing|design|document)/i,
      /\b(BOQ|bill\s+of\s+quantities)\b/i,
      /\u062A\u0635\u0645\u064A\u0645|\u0647\u0646\u062F\u0633\u0629|\u0631\u0633\u0648\u0645\u0627\u062A|\u0645\u062E\u0637\u0637\u0627\u062A|\u062D\u0633\u0627\u0628\u0627\u062A/i
    ]
  },
  {
    phase: "prep",
    label_en: "Project Preparation",
    label_ar: "\u062A\u062D\u0636\u064A\u0631 \u0627\u0644\u0645\u0634\u0631\u0648\u0639",
    color: "#10b981",
    patterns: [
      /\b(kick[\s-]?off|kickoff)\b/i,
      /\b(mobilization|mobilisation|mobilize|mobilise|mobilising)\b/i,
      /\b(permit|permits|permission)\b/i,
      /\b(site\s+(setup|preparation|survey|access))\b/i,
      /\b(NTP|notice\s+to\s+proceed)\b/i,
      /\b(award|contract\s+signing)\b/i,
      /\b(soil\s+investigation|geotechnical\s+survey)\b/i,
      /\b(insurance|bond|guarantee)\b/i,
      /\u062A\u062D\u0636\u064A\u0631|\u062A\u062C\u0647\u064A\u0632\s+\u0627\u0644\u0645\u0648\u0642\u0639|\u0627\u0644\u062A\u0639\u0628\u0626\u0629|\u0627\u062C\u062A\u0645\u0627\u0639\s+\u0627\u0644\u0628\u062F\u0621/i
    ]
  }
];

// Smart phase classifier — returns phase key (with smart fallback)
// Uses tiered matching: name → wbsName → fallback
// FIX v29.0.9.1: fallback is now project-type-aware
//   - For cyber: construction = 0%, fallback to "installation" (30%)
//   - For purchase_order: construction = 0%, fallback to "equipment" (70%)
//   - For others: fallback to "construction" (largest bucket in most types)
function _smartFallbackPhase(ngProjectType) {
  const typeKey = ngProjectType || "ss_lines";
  const weights = NG_MATRIX_WEIGHTS[typeKey] || NG_MATRIX_WEIGHTS.ss_lines;
  // Find the phase with the LARGEST weight for this type
  // (excluding prep/closeout which are tiny structural buckets)
  const candidatePhases = ["construction", "installation", "equipment", "design", "testing"];
  let bestPhase = "construction";
  let bestWeight = -1;
  for (const phase of candidatePhases) {
    const w = weights[phase] || 0;
    if (w > bestWeight) {
      bestWeight = w;
      bestPhase = phase;
    }
  }
  return bestPhase;
}

function classifyActivityPhase(activityName, wbsName, ngProjectType) {
  // Try activity name first
  if (activityName && typeof activityName === "string") {
    for (const rule of NG_PHASE_PATTERNS) {
      if (rule.patterns.some((p) => p.test(activityName))) {
        return rule.phase;
      }
    }
  }
  // Try WBS name as secondary signal
  if (wbsName && typeof wbsName === "string") {
    for (const rule of NG_PHASE_PATTERNS) {
      if (rule.patterns.some((p) => p.test(wbsName))) {
        return rule.phase;
      }
    }
  }
  // Smart fallback: assign to the LARGEST non-trivial phase for this project type
  // This protects cyber/purchase_order where construction = 0%
  return _smartFallbackPhase(ngProjectType);
}

// Get NG matrix weight for activity given project type
function getNGMatrixWeight(activityName, ngProjectType, wbsName) {
  const phase = classifyActivityPhase(activityName, wbsName, ngProjectType);
  if (!phase) return 0;
  const typeKey = ngProjectType || "ss_lines"; // fallback for non-NG projects
  const weights = NG_MATRIX_WEIGHTS[typeKey] || NG_MATRIX_WEIGHTS.ss_lines;
  return weights[phase] || 0;
}

// Check if a detected project type matches NG matrix
function isNGProjectType(detectedKey) {
  return detectedKey && NG_PROJECT_TYPE_MAP[detectedKey] !== undefined;
}

// Get NG matrix column key from detected project type
function getNGMatrixColumn(detectedKey) {
  return NG_PROJECT_TYPE_MAP[detectedKey] || null;
}

// ═══════════════════════════════════════════════════════════════════════════
// v29.0.9.1 — MANDATORY MILESTONES (per NG SA Manual Section 8.1.2)
// ═══════════════════════════════════════════════════════════════════════════
const NG_MANDATORY_MILESTONES = {
  // Universal — required for ALL NG projects
  universal: [
    {
      id: "signing", name_en: "Signing Contract", name_ar: "\u062A\u0648\u0642\u064A\u0639 \u0627\u0644\u0639\u0642\u062F",
      type: "start", required: true, color: "#10b981",
      patterns: [/\b(signing\s+(of\s+)?contract|contract\s+sign(ing|ed)|award)\b/i, /\u062A\u0648\u0642\u064A\u0639\s+\u0627\u0644\u0639\u0642\u062F|\u0625\u0631\u0633\u0627\u0621/i]
    },
    {
      id: "site_handover", name_en: "Site Hand Over", name_ar: "\u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0648\u0642\u0639",
      type: "start", required: true, color: "#0ea5e9",
      patterns: [/\bsite\s+(hand[\s-]?over|handover|delivery)\b/i, /\u062A\u0633\u0644\u064A\u0645\s+\u0627\u0644\u0645\u0648\u0642\u0639/i]
    },
    {
      id: "tcc", name_en: "TCC - Technical Completion Certificate",
      name_ar: "TCC - \u0634\u0647\u0627\u062F\u0629 \u0627\u0644\u0625\u0646\u062C\u0627\u0632 \u0627\u0644\u0641\u0646\u064A",
      type: "finish", required: true, color: "#f59e0b", multiple: true,
      patterns: [/\bTCC\b/i, /\btechnical\s+completion\s+certificate\b/i]
    },
    {
      id: "pac", name_en: "PAC - Provisional Acceptance Certificate",
      name_ar: "PAC - \u0634\u0647\u0627\u062F\u0629 \u0627\u0644\u0642\u0628\u0648\u0644 \u0627\u0644\u0645\u0628\u062F\u0626\u064A",
      type: "finish", required: true, color: "#a78bfa", multiple: true,
      patterns: [/\bPAC\b/i, /\bprovisional\s+acceptance\s+certificate\b/i]
    },
    {
      id: "fac", name_en: "FAC - Final Acceptance Certificate",
      name_ar: "FAC - \u0634\u0647\u0627\u062F\u0629 \u0627\u0644\u0642\u0628\u0648\u0644 \u0627\u0644\u0646\u0647\u0627\u0626\u064A",
      type: "finish", required: true, color: "#22c55e", multiple: true,
      patterns: [/\bFAC\b/i, /\bfinal\s+acceptance\s+certificate\b/i]
    }
  ],
  // HV Substation specific (Section 8.1.2.6)
  ss_lines: [
    {
      id: "kickoff", name_en: "Kick-off Meeting", name_ar: "\u0627\u062C\u062A\u0645\u0627\u0639 \u0627\u0644\u0628\u062F\u0621",
      type: "milestone", required: true, color: "#06b6d4",
      patterns: [/\bkick[\s-]?off\b/i, /\u0627\u062C\u062A\u0645\u0627\u0639\s+\u0628\u062F\u0621/i]
    },
    {
      id: "design_completion", name_en: "Design Work Completion",
      name_ar: "\u0625\u0643\u0645\u0627\u0644 \u0627\u0644\u062A\u0635\u0645\u064A\u0645",
      type: "milestone", required: true, color: "#22d3ee",
      patterns: [/\b(design\s+(work\s+)?completion|design\s+complete)\b/i]
    },
    {
      id: "construction_start", name_en: "Construction Start",
      name_ar: "\u0628\u062F\u0621 \u0627\u0644\u0625\u0646\u0634\u0627\u0621",
      type: "milestone", required: true, color: "#fb923c",
      patterns: [/\b(construction\s+start|start\s+(of\s+)?construction|civil\s+start)\b/i]
    },
    {
      id: "trafo_foundation", name_en: "Power Transformer Foundation Ready",
      name_ar: "\u062C\u0627\u0647\u0632\u064A\u0629 \u0623\u0633\u0627\u0633 \u0627\u0644\u0645\u062D\u0648\u0644",
      type: "milestone", required: false, color: "#84cc16",
      patterns: [/\b(power\s+)?transformer\s+foundation\s+(ready|complete)\b/i]
    },
    {
      id: "building_ready", name_en: "Building Readiness for Equipment",
      name_ar: "\u062C\u0627\u0647\u0632\u064A\u0629 \u0627\u0644\u0645\u0628\u0646\u0649",
      type: "milestone", required: false, color: "#f59e0b",
      patterns: [/\bbuilding\s+(readiness|ready|complete)\b/i]
    },
    {
      id: "energization", name_en: "Energization", name_ar: "\u0627\u0644\u062A\u0634\u063A\u064A\u0644",
      type: "milestone", required: true, color: "#f43f5e", multiple: true,
      patterns: [/\b(energization|energiz|first\s+power)\b/i, /\u062A\u0634\u063A\u064A\u0644|\u0625\u0646\u0631\u062C\u0627\u062A/i]
    },
    {
      id: "spare_parts", name_en: "Spare Parts Delivery",
      name_ar: "\u062A\u0633\u0644\u064A\u0645 \u0642\u0637\u0639 \u0627\u0644\u063A\u064A\u0627\u0631",
      type: "milestone", required: false, color: "#8b5cf6",
      patterns: [/\bspare\s+parts\b/i, /\u0642\u0637\u0639\s+\u063A\u064A\u0627\u0631/i]
    }
  ]
};

// Get applicable milestones for a project type (universal + type-specific)
function getMandatoryMilestones(ngProjectType) {
  const universal = NG_MANDATORY_MILESTONES.universal || [];
  const specific = NG_MANDATORY_MILESTONES[ngProjectType] || [];
  return [...universal, ...specific];
}

// Match milestones against schedule activities
// Returns: array of { milestone, found, activity?, plannedDate?, actualDate? }
// v29.0.9: extract unit/group label from milestone activity name
// Examples: "TCC Unit 1" → "Unit 1", "TCC for Tank A" → "Tank A", "TCC BOP" → "BOP"
function _extractMilestoneSubLabel(activityName, milestoneCode) {
  if (!activityName || !milestoneCode) return null;
  const re = new RegExp(`\\b${milestoneCode}\\b\\s*[\\-:\\u2013\\u2014]?\\s*(.+?)\\s*$`, "i");
  const m = activityName.match(re);
  if (!m) return null;
  let sub = m[1].trim();
  // Remove generic words FIRST so we don't end up with leading dashes
  sub = sub.replace(/\b(certificate|issuance|date|achievement|completion)\b/gi, "").trim();
  // Strip leading separators / connectors
  sub = sub.replace(/^([\-\u2013\u2014:\(]|\bfor\b|\bof\b|\bthe\b|\s)+/gi, "").trim();
  // Drop trailing "(...)" parentheticals
  sub = sub.replace(/\([^)]*\)\s*$/g, "").trim();
  // Cleanup multi-spaces / trailing/leading punctuation
  sub = sub.replace(/\s{2,}/g, " ").replace(/^[\-\u2013\u2014\s]+|[\-\u2013\u2014\s]+$/g, "").trim();
  // Truncate if too long
  if (sub.length > 35) sub = sub.substring(0, 32) + "\u2026";
  return sub || null;
}

// v29.0.9: compute status + slip for a single activity instance
function _computeMilestoneStatus(act) {
  const today = new Date();
  let status = "missing";
  let slipDays = null;
  let plannedDate = null;
  let actualDate = null;
  let projectedDate = null;
  if (!act) return { status, slipDays, plannedDate, actualDate, projectedDate };
  plannedDate = act.plannedFinish || act.plannedStart || null;
  actualDate = act.actualFinish || act.actualStart || null;
  projectedDate = act.projectedFinish || act.forecastFinish || null;
  const actStatus = (act.status || "").toLowerCase();
  if (act.actualFinish || actStatus === "completed") {
    status = "completed";
    if (plannedDate && actualDate) {
      slipDays = Math.round((new Date(actualDate) - new Date(plannedDate)) / 86400000);
    }
  } else if (act.actualStart || actStatus === "in progress" || actStatus === "in_progress") {
    status = "in_progress";
    if (plannedDate) {
      const refDate = projectedDate ? new Date(projectedDate) : today;
      slipDays = Math.round((refDate - new Date(plannedDate)) / 86400000);
    }
  } else {
    status = "not_started";
    if (plannedDate && new Date(plannedDate) < today) {
      status = "overdue";
      slipDays = Math.round((today - new Date(plannedDate)) / 86400000);
    }
  }
  return { status, slipDays, plannedDate, actualDate, projectedDate };
}

function checkMilestoneCompliance(activities, ngProjectType) {
  const required = getMandatoryMilestones(ngProjectType);
  const results = [];
  for (const mile of required) {
    // v29.0.9: Find ALL matches if milestone is multiple-capable, else first match
    const matches = [];
    for (const act of (activities || [])) {
      if (!act) continue;
      const name = act.name || act.actName || "";
      if (mile.patterns.some((p) => p.test(name))) {
        matches.push(act);
        if (!mile.multiple) break; // single-instance milestone — first match wins
      }
    }
    // Sort instances by planned date (chronological)
    matches.sort((a, b) => {
      const da = new Date(a.plannedFinish || a.plannedStart || 0);
      const db = new Date(b.plannedFinish || b.plannedStart || 0);
      return da - db;
    });
    // Build instances array (each with status + slip + label)
    const instances = matches.map((act) => {
      const sts = _computeMilestoneStatus(act);
      // Extract a sub-label (e.g., "Unit 1", "BOP", "Tank A") from activity name
      // Try to extract from the milestone's main code (TCC/PAC/FAC) if available
      let subLabel = null;
      const baseId = (mile.id || "").toUpperCase();
      if (mile.multiple) {
        subLabel = _extractMilestoneSubLabel(act.name || act.actName || "", baseId);
        if (!subLabel) {
          // Fallback: try first uppercase token after the code
          const tail = (act.name || act.actName || "").replace(new RegExp(`^.*?\\b${baseId}\\b\\s*`, "i"), "").trim();
          if (tail) subLabel = tail.length > 35 ? tail.substring(0, 32) + "\u2026" : tail;
        }
      }
      return {
        activity: act,
        actId: act.actId,
        name: act.name || act.actName,
        subLabel: subLabel || null,
        ...sts
      };
    });
    // Aggregate top-level fields (for backward compat + summary display)
    const firstInstance = instances[0] || null;
    results.push({
      milestone: mile,
      found: matches.length > 0,
      count: matches.length,
      instances,
      // Backward-compat: keep flat fields for the FIRST instance
      activity: firstInstance ? firstInstance.activity : null,
      plannedDate: firstInstance ? firstInstance.plannedDate : null,
      actualDate: firstInstance ? firstInstance.actualDate : null,
      projectedDate: firstInstance ? firstInstance.projectedDate : null,
      status: firstInstance ? firstInstance.status : "missing",
      slipDays: firstInstance ? firstInstance.slipDays : null
    });
  }
  return results;
}

// ═══════════════════════════════════════════════════════════════════════════
// v29.0.9 — SAUDI ARABIA OFFICIAL HOLIDAYS + ISLAMIC OBSERVANCES
// Source: Saudi MoHRSD official calendar (Hijri to Gregorian conversion)
// Includes: National Day, Founding Day, Eid Al-Fitr (Ramadan), Eid Al-Adha (Hajj)
// ═══════════════════════════════════════════════════════════════════════════
const SA_HOLIDAYS = {
  // Fixed Gregorian dates
  national_day: { en: "Saudi National Day", ar: "اليوم الوطني السعودي", month: 9, day: 23, type: "national" },
  founding_day: { en: "Saudi Founding Day", ar: "يوم التأسيس", month: 2, day: 22, type: "national" }
};

// Islamic holidays (Hijri-based) — pre-computed Gregorian dates 2024–2027
// Sources: Umm Al-Qura calendar (official Saudi authority)
// Eid Al-Fitr: 1-3 Shawwal (3 days)
// Eid Al-Adha: 9-13 Dhul-Hijjah (5 days including Hajj observance)
const SA_ISLAMIC_HOLIDAYS = {
  2024: {
    eid_alfitr: { start: "2024-04-09", end: "2024-04-12", days: 4 },
    eid_aladha: { start: "2024-06-15", end: "2024-06-19", days: 5 },
    arafat: "2024-06-15",
    ramadan_start: "2024-03-11"
  },
  2025: {
    eid_alfitr: { start: "2025-03-30", end: "2025-04-02", days: 4 },
    eid_aladha: { start: "2025-06-05", end: "2025-06-09", days: 5 },
    arafat: "2025-06-05",
    ramadan_start: "2025-03-01"
  },
  2026: {
    eid_alfitr: { start: "2026-03-20", end: "2026-03-23", days: 4 },
    eid_aladha: { start: "2026-05-26", end: "2026-05-30", days: 5 },
    arafat: "2026-05-26",
    ramadan_start: "2026-02-18"
  },
  2027: {
    eid_alfitr: { start: "2027-03-09", end: "2027-03-12", days: 4 },
    eid_aladha: { start: "2027-05-16", end: "2027-05-20", days: 5 },
    arafat: "2027-05-16",
    ramadan_start: "2027-02-08"
  },
  2028: {
    eid_alfitr: { start: "2028-02-26", end: "2028-02-29", days: 4 },
    eid_aladha: { start: "2028-05-04", end: "2028-05-08", days: 5 },
    arafat: "2028-05-04",
    ramadan_start: "2028-01-28"
  }
};

// Build a reference set of expected SA holiday dates within a project's date range
function buildExpectedSAHolidays(startDate, endDate) {
  const expected = [];
  if (!startDate || !endDate) return expected;
  const startY = new Date(startDate).getFullYear();
  const endY = new Date(endDate).getFullYear();
  // v29.0.9.2: Track years with missing Hijri table data (post-2028)
  const missingHijriYears = [];
  for (let y = startY; y <= endY; y++) {
    // National Day - Sept 23
    expected.push({
      date: `${y}-09-23`,
      key: "national_day",
      en: "Saudi National Day",
      ar: "اليوم الوطني السعودي",
      type: "national",
      duration: 1
    });
    // Founding Day - Feb 22
    expected.push({
      date: `${y}-02-22`,
      key: "founding_day",
      en: "Founding Day",
      ar: "يوم التأسيس",
      type: "national",
      duration: 1
    });
    // Islamic holidays (if year is in our table)
    const isl = SA_ISLAMIC_HOLIDAYS[y];
    if (isl) {
      expected.push({
        date: isl.eid_alfitr.start,
        endDate: isl.eid_alfitr.end,
        key: "eid_alfitr",
        en: "Eid Al-Fitr (End of Ramadan)",
        ar: "عيد الفطر (نهاية رمضان)",
        type: "religious",
        duration: isl.eid_alfitr.days
      });
      expected.push({
        date: isl.eid_aladha.start,
        endDate: isl.eid_aladha.end,
        key: "eid_aladha",
        en: "Eid Al-Adha (Hajj)",
        ar: "عيد الأضحى (الحج)",
        type: "religious",
        duration: isl.eid_aladha.days
      });
      expected.push({
        date: isl.ramadan_start,
        key: "ramadan_start",
        en: "Ramadan Begins (work hours reduced)",
        ar: "بداية رمضان (تخفيض ساعات العمل)",
        type: "observance",
        duration: 30
      });
    } else if (y > 2028) {
      // v29.0.9.2: Hijri table only covers up to 2028. Don't approximate
      // (Hijri year is 354.367 days, varies ±1-2 days based on moon sighting).
      // Approximation would mislead users — instead, surface a warning.
      missingHijriYears.push(y);
    }
  }
  const filtered = expected.filter((h) => {
    const d = h.date;
    return d >= startDate && d <= endDate;
  }).sort((a, b) => a.date.localeCompare(b.date));
  // Attach warning as a non-enumerable property so it doesn't leak into iteration
  if (missingHijriYears.length > 0) {
    Object.defineProperty(filtered, "_warning", {
      value: {
        type: "hijri_table_outdated",
        years: missingHijriYears,
        en: `Hijri holidays for year(s) ${missingHijriYears.join(", ")} are not yet defined. ` +
            `Please update SA_ISLAMIC_HOLIDAYS table when official Saudi calendar announcements are available. ` +
            `National Day and Founding Day (Gregorian) will continue to be audited correctly.`,
        ar: `الإجازات الهجرية للسنوات (${missingHijriYears.join("، ")}) لم تُحدَّد بعد. ` +
            `يرجى تحديث جدول SA_ISLAMIC_HOLIDAYS عند إعلان التقويم السعودي الرسمي. ` +
            `سيستمر تدقيق اليوم الوطني ويوم التأسيس (ميلادي) بشكل صحيح.`
      },
      enumerable: false,
      writable: false
    });