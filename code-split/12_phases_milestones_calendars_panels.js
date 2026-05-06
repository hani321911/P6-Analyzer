// ════════════════════════════════════════════════════════════════════
// 12_phases_milestones_calendars_panels.js — v29.0.11.1 (R1+R2 fixes from ChatGPT Round 7)
// Lines 14765 - 16450 (of 19957 total)
// findCertByRegex (Phase 1.4 + EHC/ECC)
// 
// The source of truth is p6-analyzer.html.
// Auto-generated on update of p6-analyzer.html.
// ════════════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════════════════
// v29.0.9 — FILENAME VALIDATOR PANEL (per NG SA Section 8.1.1.9)
// Pattern: ####-{V}{TYPE}{N} where TYPE = BPS/MP/WP/AB/TIA/RS
// ═══════════════════════════════════════════════════════════════════════════
function FilenameValidatorPanel({ validations, lang, t }) {
  const isAr = lang === "ar";
  if (!validations) return null;
  const entries = [
    { key: "baseline", label_en: "Baseline", label_ar: "\u062E\u0637 \u0627\u0644\u0623\u0633\u0627\u0633", v: validations.baseline },
    { key: "progress", label_en: "Progress", label_ar: "\u0627\u0644\u062A\u062D\u062F\u064A\u062B", v: validations.progress },
    { key: "revised", label_en: "Revised", label_ar: "\u0627\u0644\u0645\u0639\u062F\u0644", v: validations.revised }
  ].filter((e) => e.v); // only show entries that have validation

  if (entries.length === 0) return null;

  const validCount = entries.filter((e) => e.v.valid).length;
  const allValid = validCount === entries.length;

  return /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--bgCard)",
    border: `1px solid ${allValid ? "rgba(34,197,94,0.3)" : "rgba(245,158,11,0.3)"}`,
    borderRadius: 14, padding: "14px 18px", marginBottom: 16
  } },
    /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8
    } },
      /* @__PURE__ */ React.createElement("div", null,
        /* @__PURE__ */ React.createElement("div", { style: {
          color: allValid ? "#22c55e" : "#f59e0b", fontWeight: 700, fontSize: 12,
          fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.1em",
          textTransform: "uppercase", marginBottom: 2
        } }, isAr ? "\u062A\u0633\u0645\u064A\u0629 \u0627\u0644\u0645\u0644\u0641\u0627\u062A (NG SA)" : "FILENAME CONVENTION (NG SA)"),
        /* @__PURE__ */ React.createElement("div", { style: { color: "var(--textMuted)", fontSize: 10 } },
          isAr ? "\u0627\u0644\u0635\u064A\u063A\u0629 \u0627\u0644\u0645\u0639\u062A\u0645\u062F\u0629: " : "Expected: ",
          /* @__PURE__ */ React.createElement("code", { style: {
            color: "#a78bfa", background: "rgba(167,139,250,0.1)", padding: "1px 6px", borderRadius: 3,
            fontFamily: "'JetBrains Mono',monospace", fontSize: 10
          } }, "####-{V}{TYPE}{N}"),
          /* @__PURE__ */ React.createElement("span", { style: { marginInlineStart: 8 } },
            isAr ? "\u0645\u062B\u0627\u0644: " : "e.g.: ",
            /* @__PURE__ */ React.createElement("code", { style: {
              color: "var(--textMuted)", fontFamily: "'JetBrains Mono',monospace", fontSize: 10
            } }, "1234-1MP1, 1234-2BPS, 1234-1TIA1")
          )
        )
      ),
      /* @__PURE__ */ React.createElement("div", { style: {
        background: allValid ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)",
        color: allValid ? "#22c55e" : "#f59e0b",
        border: `1px solid ${allValid ? "rgba(34,197,94,0.4)" : "rgba(245,158,11,0.4)"}`,
        borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700,
        fontFamily: "'JetBrains Mono',monospace"
      } }, `${validCount}/${entries.length} ${isAr ? "\u0635\u062D\u064A\u062D" : "valid"}`)
    ),
    /* @__PURE__ */ React.createElement("div", { style: {
      display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8
    } },
      entries.map((e) => {
        const v = e.v;
        const ok = v.valid;
        const bg = ok ? "rgba(34,197,94,0.06)" : "rgba(245,158,11,0.06)";
        const borderC = ok ? "rgba(34,197,94,0.25)" : "rgba(245,158,11,0.3)";
        const dotC = ok ? "#22c55e" : "#f59e0b";
        return /* @__PURE__ */ React.createElement("div", {
          key: e.key,
          style: { background: bg, border: `1px solid ${borderC}`, borderRadius: 8, padding: "8px 12px", display: "flex", gap: 10, alignItems: "stretch" }
        },
          /* @__PURE__ */ React.createElement("div", {
            style: {
              width: 22, height: 22, borderRadius: 5, background: dotC,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, fontSize: 11, flexShrink: 0, alignSelf: "flex-start"
            }
          }, ok ? "\u2713" : "\u26A0"),
          /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 } },
            /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } },
              /* @__PURE__ */ React.createElement("span", { style: {
                color: dotC, fontWeight: 700, fontSize: 10, fontFamily: "'JetBrains Mono',monospace",
                textTransform: "uppercase", letterSpacing: "0.04em"
              } }, isAr ? e.label_ar : e.label_en),
              ok && /* @__PURE__ */ React.createElement("span", { style: {
                color: "var(--textDim)", fontSize: 9, fontFamily: "'JetBrains Mono',monospace"
              } }, `\u00B7 ${isAr ? v.typeName_ar : v.typeName_en}`)
            ),
            /* @__PURE__ */ React.createElement("div", {
              style: {
                color: "var(--textPrimary)", fontSize: 11, fontWeight: 600,
                fontFamily: "'JetBrains Mono',monospace",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
              },
              title: v.filename || ""
            }, v.filename || (isAr ? "\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641" : "Unknown")),
            ok && /* @__PURE__ */ React.createElement("div", {
              style: { fontSize: 9, color: "var(--textMuted)", fontFamily: "'JetBrains Mono',monospace" }
            },
              `\u2116 ${v.projectNumber} \u00B7 v${v.version}`,
              v.sequence ? ` \u00B7 #${v.sequence}` : ""
            ),
            !ok && /* @__PURE__ */ React.createElement("div", {
              style: { fontSize: 10, color: "#f59e0b", fontStyle: "italic" }
            }, isAr ? "\u0644\u0627 \u064A\u062A\u0628\u0639 \u0635\u064A\u063A\u0629 NG \u0627\u0644\u0631\u0633\u0645\u064A\u0629" : "Doesn't match NG official convention")
          )
        );
      })
    )
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// v29.0.9 — PRE-COMMISSIONING COMPLIANCE PANEL
// Per NG SA Section 8.1.1.6.1 — 11 mandatory pre-check activities
// ═══════════════════════════════════════════════════════════════════════════
function PreCommCompliancePanel({ compliance, ngProjectType, lang, t }) {
  const isAr = lang === "ar";
  const [expanded, setExpanded] = useState(false);
  // Only show for substation-related projects
  const isSubstation = ngProjectType === "ss_lines" || ngProjectType === "asset_repl";
  if (!isSubstation || !compliance || compliance.length === 0) return null;

  const found = compliance.filter((c) => c.found).length;
  const completed = compliance.filter((c) => c.status === "completed").length;
  const score = +(completed / compliance.length * 100).toFixed(0);
  const statusColor = score >= 90 ? "#22c55e" : score >= 60 ? "#f59e0b" : score >= 30 ? "#fb923c" : "#ef4444";

  return /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--bgCard)", border: "1px solid var(--border)",
    borderRadius: 14, padding: "14px 18px", marginBottom: 16
  } },
    /* @__PURE__ */ React.createElement("div", {
      style: { display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", flexWrap: "wrap", gap: 10 },
      onClick: () => setExpanded(!expanded)
    },
      /* @__PURE__ */ React.createElement("div", null,
        /* @__PURE__ */ React.createElement("div", { style: {
          color: "#8b5cf6", fontWeight: 700, fontSize: 12,
          fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.1em",
          textTransform: "uppercase", marginBottom: 2
        } }, isAr ? "\u0641\u062D\u0648\u0635\u0627\u062A \u0645\u0627 \u0642\u0628\u0644 \u0627\u0644\u062A\u0634\u063A\u064A\u0644" : "PRE-COMMISSIONING CHECKS"),
        /* @__PURE__ */ React.createElement("div", { style: { color: "var(--textMuted)", fontSize: 11 } },
          `${found}/${compliance.length} ${isAr ? "\u0645\u0648\u062C\u0648\u062F" : "found"} \u00B7 ${completed} ${isAr ? "\u0645\u0643\u062A\u0645\u0644" : "completed"} \u00B7 ${isAr ? "\u0627\u0636\u063A\u0637 \u0644\u0644" + (expanded ? "\u0625\u062E\u0641\u0627\u0621" : "\u0639\u0631\u0636") : (expanded ? "click to hide" : "click to view")}`
        )
      ),
      /* @__PURE__ */ React.createElement("div", { style: {
        background: `${statusColor}22`, border: `1px solid ${statusColor}66`, borderRadius: 8,
        padding: "8px 16px", color: statusColor, fontWeight: 800, fontSize: 22,
        fontFamily: "'JetBrains Mono',monospace"
      } }, score + "%")
    ),
    expanded && /* @__PURE__ */ React.createElement("div", {
      style: {
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 8, marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)"
      }
    },
      compliance.map((c) => {
        let bgC, borderC, dotC, icon, label_en, label_ar, color_;
        if (!c.found) {
          bgC = "rgba(239,68,68,0.06)"; borderC = "rgba(239,68,68,0.25)";
          dotC = "#ef4444"; icon = "\u2717";
          label_en = "Missing"; label_ar = "\u0645\u0641\u0642\u0648\u062F"; color_ = "#ef4444";
        } else if (c.status === "completed") {
          bgC = "rgba(34,197,94,0.06)"; borderC = "rgba(34,197,94,0.25)";
          dotC = "#22c55e"; icon = "\u2713";
          label_en = "Completed"; label_ar = "\u0645\u0643\u062A\u0645\u0644"; color_ = "#22c55e";
        } else if (c.status === "in_progress") {
          bgC = "rgba(56,189,248,0.06)"; borderC = "rgba(56,189,248,0.25)";
          dotC = "#38bdf8"; icon = "\u25D0";
          label_en = "In Progress"; label_ar = "\u0642\u064A\u062F \u0627\u0644\u062A\u0646\u0641\u064A\u0630"; color_ = "#38bdf8";
        } else {
          bgC = "rgba(148,163,184,0.05)"; borderC = "rgba(148,163,184,0.2)";
          dotC = "#94a3b8"; icon = "\u25EF";
          label_en = "Not Started"; label_ar = "\u0644\u0645 \u064A\u0628\u062F\u0623"; color_ = "#94a3b8";
        }
        return /* @__PURE__ */ React.createElement("div", {
          key: c.check.id,
          style: { background: bgC, border: `1px solid ${borderC}`, borderRadius: 8, padding: "10px 12px", display: "flex", gap: 10, alignItems: "stretch", minHeight: 60 }
        },
          /* @__PURE__ */ React.createElement("div", {
            style: { width: 26, height: 26, borderRadius: 5, background: dotC, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13, flexShrink: 0, alignSelf: "flex-start" }
          }, icon),
          /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 } },
            /* @__PURE__ */ React.createElement("div", {
              style: { color: "var(--textPrimary)", fontSize: 11, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
              title: isAr ? c.check.name_ar : c.check.name_en
            }, isAr ? c.check.name_ar : c.check.name_en),
            /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" } },
              /* @__PURE__ */ React.createElement("span", {
                style: { background: `${color_}22`, color: color_, fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 3, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: "0.04em" }
              }, isAr ? label_ar : label_en),
              c.count > 1 && /* @__PURE__ */ React.createElement("span", {
                style: { color: "var(--textMuted)", fontSize: 9, fontFamily: "'JetBrains Mono',monospace" }
              }, `${c.count}\u00D7`)
            ),
            /* @__PURE__ */ React.createElement("div", {
              style: { color: "var(--textDim)", fontSize: 9, fontFamily: "'JetBrains Mono',monospace" }
            },
              (isAr ? "\u0641\u062D\u0635: " : "Witness: ") + (isAr ? c.check.witnessing_ar : c.check.witnessing_en)
            )
          )
        );
      })
    )
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// v29.0.9 — EVM PER-WBS TABLE (per NG SA reporting templates)
// Shows: PV, EV, AC, SV, CV, SPI, CPI, EAC, ETC for each WBS package
// ═══════════════════════════════════════════════════════════════════════════
function EVMPerWBSTable({ wbsBreakdown, wbsMeta, lang, t }) {
  const isAr = lang === "ar";
  if (!wbsBreakdown || wbsBreakdown.length === 0) return null;
  // Filter to only rows with EVM data (BAC > 0 means cost data exists = valid EVM)
  const rows = wbsBreakdown.filter((w) => (w.bac || 0) > 0);
  // FIX BUG-08: If no BAC rows, the pv/ev values come from duration×% which is not monetary.
  // Check if we have real cost data by seeing if BAC totals > 0.
  const hasCostData = rows.length > 0;
  // Rows without BAC: show progress-only table with a disclaimer
  const allRows = wbsBreakdown.filter((w) => (w.activities || 0) > 0);
  if (allRows.length === 0) return null;

  const displayRows = hasCostData ? rows : allRows;
  const noCostWarning = !hasCostData;

  const fmtC = (v) => {
    if (v === null || v === undefined || isNaN(v)) return "\u2014";
    if (Math.abs(v) >= 1e6) return (v / 1e6).toFixed(2) + "M";
    if (Math.abs(v) >= 1e3) return (v / 1e3).toFixed(1) + "K";
    return v.toFixed(0);
  };
  const fmtR = (v) => v === null || v === undefined ? "\u2014" : v.toFixed(3);
  const colorIdx = (val, threshold = 1) => val === null ? "var(--textDim)" : val >= threshold ? "#22c55e" : "#ef4444";
  const colorVar = (v) => v === null ? "var(--textDim)" : v >= 0 ? "#22c55e" : "#ef4444";

  // Totals row
  const totals = displayRows.reduce((acc, w) => ({
    bac: acc.bac + (w.bac || 0),
    pv: acc.pv + (w.pv || 0),
    ev: acc.ev + (w.ev || 0),
    ac: acc.ac + (w.ac || 0)
  }), { bac: 0, pv: 0, ev: 0, ac: 0 });
  const totSV = totals.ev - totals.pv;
  const totCV = totals.ev - totals.ac;
  const totSPI = totals.pv > 0 ? totals.ev / totals.pv : null;
  const totCPI = totals.ac > 0 ? totals.ev / totals.ac : null;
  const totEAC = (totCPI && totCPI > 0) ? totals.bac / totCPI : totals.bac;
  const totETC = totEAC - totals.ac;

  return /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--bgCard)", border: "1px solid #1e293b",
    borderRadius: 12, padding: 16, marginBottom: 16
  } },
    /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: noCostWarning ? 6 : 12, flexWrap: "wrap", gap: 8
    } },
      /* @__PURE__ */ React.createElement("div", null,
        /* @__PURE__ */ React.createElement("div", { style: {
          color: "#34d399", fontWeight: 700, fontSize: 12,
          fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.1em",
          textTransform: "uppercase", marginBottom: 2
        } }, isAr ? "EVM \u062D\u0633\u0628 \u0647\u064A\u0643\u0644 \u0627\u0644\u0639\u0645\u0644 (WBS)" : "EVM PER WBS PACKAGE"),
        /* @__PURE__ */ React.createElement("div", { style: { color: "var(--textDim)", fontSize: 10, fontFamily: "'JetBrains Mono',monospace" } },
          `${displayRows.length} ${isAr ? "\u062D\u0632\u0645\u0629" : "packages"}`
        )
      )
    ),
    // FIX BUG-08: warn when no cost data (PV/EV not monetary)
    noCostWarning && /* @__PURE__ */ React.createElement("div", { style: {
      background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)",
      borderRadius: 6, padding: "6px 10px", marginBottom: 10, fontSize: 10,
      color: "#f59e0b", fontFamily: "'JetBrains Mono',monospace"
    } },
      isAr
        ? "\u26A0 \u0644\u0627 \u062A\u0648\u062C\u062F \u0628\u064A\u0627\u0646\u0627\u062A \u062A\u0643\u0644\u0641\u0629 (BAC=0). PV/EV \u0645\u062D\u0633\u0648\u0628\u0629 \u0628\u0627\u0644\u0648\u0632\u0646 \u0627\u0644\u0632\u0645\u0646\u064A \u0648\u0644\u064A\u0633\u062A \u0642\u064A\u0645\u0627\u064B \u0645\u0627\u0644\u064A\u0629."
        : "\u26A0 No cost data (BAC=0). PV/EV are duration-weighted ratios, not monetary values. Load cost-loaded XER for accurate EVM."
    ),
    /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto" } },
      /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 11 } },
        /* @__PURE__ */ React.createElement("thead", null,
          /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bgPanel)" } },
            [
              { label: isAr ? "\u062D\u0632\u0645\u0629 \u0627\u0644\u0639\u0645\u0644" : "WBS Package", term: "WBS" },
              { label: isAr ? "\u0623\u0646\u0634\u0637\u0629" : "Acts", term: null },
              { label: "BAC", term: null },
              { label: "PV", term: "PV" },
              { label: "EV", term: "EV" },
              { label: "AC", term: "AC" },
              { label: "SV", term: "SV" },
              { label: "CV", term: "CV" },
              { label: "SPI", term: "SPI" },
              { label: "CPI", term: "CPI" },
              { label: "EAC", term: "EAC" },
              { label: "ETC", term: "ETC" }
            ].map((h, i) => /* @__PURE__ */ React.createElement("th", {
              key: i,
              style: {
                padding: "8px 10px",
                textAlign: i === 0 ? "left" : "right",
                color: "#34d399", fontWeight: 700,
                borderBottom: "1px solid #1e293b",
                whiteSpace: "nowrap",
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 10, letterSpacing: "0.04em"
              }
            }, h.term ? /* @__PURE__ */ React.createElement(GlossaryTerm, { term: h.term, lang }, h.label) : h.label))
          )
        ),
        /* @__PURE__ */ React.createElement("tbody", null,
          displayRows.map((w, i) => /* @__PURE__ */ React.createElement("tr", {
            key: w.wbsId || i,
            style: {
              borderBottom: "1px solid #1e293b",
              background: i % 2 === 0 ? "transparent" : "rgba(52,211,153,0.02)"
            }
          },
            /* @__PURE__ */ React.createElement("td", {
              style: { padding: "8px 10px", color: "var(--textPrimary)", fontWeight: 600, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
              title: w.name || w.wbsName || w.wbsId
            }, w.name || w.wbsName || w.wbsId),
            /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", textAlign: "right", color: "var(--textMuted)", fontFamily: "'JetBrains Mono',monospace" } }, w.activities),
            /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", textAlign: "right", color: "var(--textMuted)", fontFamily: "'JetBrains Mono',monospace" } }, fmtC(w.bac)),
            /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", textAlign: "right", color: "#a78bfa", fontFamily: "'JetBrains Mono',monospace" } }, fmtC(w.pv)),
            /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", textAlign: "right", color: "#34d399", fontFamily: "'JetBrains Mono',monospace" } }, fmtC(w.ev)),
            /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", textAlign: "right", color: "#fbbf24", fontFamily: "'JetBrains Mono',monospace" } }, fmtC(w.ac)),
            /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", textAlign: "right", color: colorVar(w.sv), fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 } }, fmtC(w.sv)),
            /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", textAlign: "right", color: colorVar(w.cv), fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 } }, fmtC(w.cv)),
            /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", textAlign: "right", color: colorIdx(w.spi), fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 } }, fmtR(w.spi)),
            /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", textAlign: "right", color: colorIdx(w.cpi), fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 } }, fmtR(w.cpi)),
            /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", textAlign: "right", color: "var(--textMuted)", fontFamily: "'JetBrains Mono',monospace" } }, fmtC(w.eac)),
            /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", textAlign: "right", color: "var(--textMuted)", fontFamily: "'JetBrains Mono',monospace" } }, fmtC(w.etc))
          )),
          // Totals row
          /* @__PURE__ */ React.createElement("tr", { style: { borderTop: "2px solid #34d399", background: "rgba(52,211,153,0.06)" } },
            /* @__PURE__ */ React.createElement("td", { style: { padding: "10px", color: "#34d399", fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", fontSize: 11 } }, isAr ? "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A" : "TOTAL"),
            /* @__PURE__ */ React.createElement("td", { style: { padding: "10px", textAlign: "right", color: "var(--textMuted)", fontFamily: "'JetBrains Mono',monospace" } }, displayRows.reduce((s, w) => s + w.activities, 0)),
            /* @__PURE__ */ React.createElement("td", { style: { padding: "10px", textAlign: "right", color: "var(--textPrimary)", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 } }, fmtC(totals.bac)),
            /* @__PURE__ */ React.createElement("td", { style: { padding: "10px", textAlign: "right", color: "#a78bfa", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 } }, fmtC(totals.pv)),
            /* @__PURE__ */ React.createElement("td", { style: { padding: "10px", textAlign: "right", color: "#34d399", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 } }, fmtC(totals.ev)),
            /* @__PURE__ */ React.createElement("td", { style: { padding: "10px", textAlign: "right", color: "#fbbf24", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 } }, fmtC(totals.ac)),
            /* @__PURE__ */ React.createElement("td", { style: { padding: "10px", textAlign: "right", color: colorVar(totSV), fontFamily: "'JetBrains Mono',monospace", fontWeight: 800 } }, fmtC(totSV)),
            /* @__PURE__ */ React.createElement("td", { style: { padding: "10px", textAlign: "right", color: colorVar(totCV), fontFamily: "'JetBrains Mono',monospace", fontWeight: 800 } }, fmtC(totCV)),
            /* @__PURE__ */ React.createElement("td", { style: { padding: "10px", textAlign: "right", color: colorIdx(totSPI), fontFamily: "'JetBrains Mono',monospace", fontWeight: 800 } }, fmtR(totSPI)),
            /* @__PURE__ */ React.createElement("td", { style: { padding: "10px", textAlign: "right", color: colorIdx(totCPI), fontFamily: "'JetBrains Mono',monospace", fontWeight: 800 } }, fmtR(totCPI)),
            /* @__PURE__ */ React.createElement("td", { style: { padding: "10px", textAlign: "right", color: "var(--textPrimary)", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 } }, fmtC(totEAC)),
            /* @__PURE__ */ React.createElement("td", { style: { padding: "10px", textAlign: "right", color: "var(--textPrimary)", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 } }, fmtC(totETC))
          )
        )
      )
    )
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// v29.0.9 — CALENDARS PANEL
// Shows all calendars used in the schedule + working week + holidays
// + Saudi Arabia official holiday audit (National Day, Ramadan, Eid, Hajj)
// ═══════════════════════════════════════════════════════════════════════════
function CalendarsPanel({ calendars, calendarTypeCounts, saHolidayAudit, lang, t }) {
  const isAr = lang === "ar";
  const calArr = calendars ? Object.values(calendars) : [];
  if (calArr.length === 0) {
    return /* @__PURE__ */ React.createElement("div", { style: {
      background: "var(--bgCard)", border: "1px solid #1e293b",
      borderRadius: 12, padding: 16, marginBottom: 16, color: "var(--textDim)", fontSize: 12
    } }, isAr ? "لا توجد بيانات تقاويم في الملف" : "No calendar data found in file");
  }
  // Sort: most-used first
  const sortedCals = [...calArr].sort((a, b) => b.activityCount - a.activityCount);
  const primary = sortedCals[0];
  const totalActs = calArr.reduce((s, c) => s + c.activityCount, 0);

  const dayLabels_en = { Sunday: "Sun", Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri", Saturday: "Sat" };
  const dayLabels_ar = { Sunday: "الأحد", Monday: "الإثنين", Tuesday: "الثلاثاء", Wednesday: "الأربعاء", Thursday: "الخميس", Friday: "الجمعة", Saturday: "السبت" };
  const dayLabels = isAr ? dayLabels_ar : dayLabels_en;
  const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Format date for display
  const fmtDate = (d) => {
    if (!d) return "—";
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString(isAr ? "ar-SA-u-ca-gregory" : "en-GB", { year: "numeric", month: "short", day: "numeric" });
    } catch (e) { return d; }
  };

  return /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } },
    // ── HEADER + SUMMARY ──
    /* @__PURE__ */ React.createElement("div", { style: {
      background: "var(--bgCard)", border: "1px solid #1e293b",
      borderRadius: 12, padding: 16, marginBottom: 12
    } },
      /* @__PURE__ */ React.createElement("div", { style: {
        display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8
      } },
        /* @__PURE__ */ React.createElement("div", null,
          /* @__PURE__ */ React.createElement("div", { style: {
            color: "#a78bfa", fontWeight: 700, fontSize: 12,
            fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.1em"
          } }, isAr ? "📅 التقاويم المستخدمة في الجدول" : "📅 SCHEDULE CALENDARS"),
          /* @__PURE__ */ React.createElement("div", { style: { color: "var(--textDim)", fontSize: 10, fontFamily: "'JetBrains Mono',monospace", marginTop: 4 } },
            `${calArr.length} ${isAr ? "تقويم" : "calendars"} · ${calendarTypeCounts.Global || 0}G · ${calendarTypeCounts.Project || 0}P · ${calendarTypeCounts.Resource || 0}R`
          )
        )
      ),
      // ── PRIMARY CALENDAR HIGHLIGHT ──
      /* @__PURE__ */ React.createElement("div", { style: {
        background: "linear-gradient(90deg, rgba(167,139,250,0.08), rgba(167,139,250,0.02))",
        border: "1px solid rgba(167,139,250,0.25)",
        borderRadius: 8, padding: "10px 12px", marginBottom: 10
      } },
        /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#a78bfa", fontFamily: "'JetBrains Mono',monospace", marginBottom: 4, letterSpacing: "0.05em" } },
          isAr ? "التقويم الأساسي للمشروع" : "PRIMARY PROJECT CALENDAR"
        ),
        /* @__PURE__ */ React.createElement("div", { style: { color: "var(--textPrimary)", fontWeight: 600, fontSize: 14 } },
          primary.name,
          primary.isDefault && /* @__PURE__ */ React.createElement("span", { style: { marginInlineStart: 8, fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "#1e40af", color: "#dbeafe" } }, isAr ? "افتراضي" : "DEFAULT")
        ),
        /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16, marginTop: 6, fontSize: 11, color: "var(--textSecondary)", flexWrap: "wrap" } },
          /* @__PURE__ */ React.createElement("span", null, isAr ? "النوع: " : "Type: ", /* @__PURE__ */ React.createElement("strong", null, primary.type)),
          /* @__PURE__ */ React.createElement("span", null, isAr ? "ساعات/يوم: " : "Hrs/Day: ", /* @__PURE__ */ React.createElement("strong", null, primary.hoursPerDay)),
          /* @__PURE__ */ React.createElement("span", null, isAr ? "أيام عمل/أسبوع: " : "Workdays/Week: ", /* @__PURE__ */ React.createElement("strong", null, primary.workingDays)),
          /* @__PURE__ */ React.createElement("span", null, isAr ? "الأنشطة: " : "Activities: ", /* @__PURE__ */ React.createElement("strong", null, primary.activityCount), totalActs > 0 ? ` (${(primary.activityCount / totalActs * 100).toFixed(0)}%)` : "")
        )
      ),
      // ── WORK WEEK VISUALIZATION ──
      /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 8 } },
        /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--textDim)", fontFamily: "'JetBrains Mono',monospace", marginBottom: 6, letterSpacing: "0.05em" } },
          isAr ? "أيام الأسبوع · ساعات العمل" : "WORK WEEK · HOURS"
        ),
        /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" } },
          dayOrder.map((day) => {
            const dayInfo = primary.workWeek[day] || { hours: 0, intervals: [] };
            const isWork = dayInfo.hours > 0;
            return /* @__PURE__ */ React.createElement("div", {
              key: day,
              title: dayInfo.intervals.length > 0 ? dayInfo.intervals.join(", ") : (isAr ? "إجازة" : "Off"),
              style: {
                flex: "1 1 80px", minWidth: 70,
                background: isWork ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.08)",
                border: `1px solid ${isWork ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.2)"}`,
                borderRadius: 6, padding: "6px 8px", textAlign: "center"
              }
            },
              /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: isWork ? "#22c55e" : "#ef4444", fontWeight: 600 } }, dayLabels[day]),
              /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, color: "var(--textPrimary)", fontWeight: 700, marginTop: 2 } }, isWork ? `${dayInfo.hours}h` : "—"),
              isWork && dayInfo.intervals.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "var(--textDim)", fontFamily: "'JetBrains Mono',monospace", marginTop: 2 } }, dayInfo.intervals[0])
            );
          })
        )
      ),
      // ── HOLIDAY/EXCEPTION COUNT ──
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16, marginTop: 10, paddingTop: 10, borderTop: "1px solid #1e293b", fontSize: 11, color: "var(--textSecondary)" } },
        /* @__PURE__ */ React.createElement("span", null, "🚫 ", isAr ? "إجازات: " : "Holidays: ", /* @__PURE__ */ React.createElement("strong", { style: { color: "#ef4444" } }, primary.holidays.length)),
        /* @__PURE__ */ React.createElement("span", null, "⚙️ ", isAr ? "استثناءات: " : "Exceptions: ", /* @__PURE__ */ React.createElement("strong", { style: { color: "#f59e0b" } }, primary.exceptions.length))
      )
    ),

    // ── SAUDI HOLIDAY AUDIT (only for SA-relevant projects) ──
    saHolidayAudit && saHolidayAudit.audit && saHolidayAudit.audit.length > 0 && /* @__PURE__ */ React.createElement("div", {
      style: {
        background: "var(--bgCard)",
        border: `1px solid ${saHolidayAudit.coveragePct >= 80 ? "rgba(34,197,94,0.3)" : saHolidayAudit.coveragePct >= 50 ? "rgba(245,158,11,0.3)" : "rgba(239,68,68,0.3)"}`,
        borderRadius: 12, padding: 16, marginBottom: 12
      }
    },
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 } },
        /* @__PURE__ */ React.createElement("div", null,
          /* @__PURE__ */ React.createElement("div", { style: { color: "#22c55e", fontWeight: 700, fontSize: 12, fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.1em" } },
            isAr ? "🇸🇦 فحص الإجازات الرسمية السعودية" : "🇸🇦 SAUDI ARABIA HOLIDAY AUDIT"
          ),
          /* @__PURE__ */ React.createElement("div", { style: { color: "var(--textDim)", fontSize: 10, fontFamily: "'JetBrains Mono',monospace", marginTop: 4 } },
            `${saHolidayAudit.present.length}/${saHolidayAudit.audit.length} ${isAr ? "إجازة معدّة بشكل صحيح" : "holidays correctly configured"}`
          )
        ),
        /* @__PURE__ */ React.createElement("div", {
          style: {
            fontSize: 18, fontWeight: 700,
            color: saHolidayAudit.coveragePct >= 80 ? "#22c55e" : saHolidayAudit.coveragePct >= 50 ? "#f59e0b" : "#ef4444",
            fontFamily: "'JetBrains Mono',monospace"
          }
        }, `${saHolidayAudit.coveragePct.toFixed(0)}%`)
      ),
      // v29.0.9.2: Warn user when project extends beyond Hijri table coverage (post-2028)
      saHolidayAudit.hijriWarning && /* @__PURE__ */ React.createElement("div", {
        style: {
          background: "rgba(245,158,11,0.08)",
          border: "1px solid rgba(245,158,11,0.35)",
          borderRadius: 8,
          padding: "10px 12px",
          marginBottom: 12,
          display: "flex",
          alignItems: "flex-start",
          gap: 10
        }
      },
        /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, lineHeight: 1, marginTop: 1 } }, "⚠️"),
        /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } },
          /* @__PURE__ */ React.createElement("div", {
            style: { color: "#fbbf24", fontWeight: 700, fontSize: 11, fontFamily: "'JetBrains Mono',monospace", marginBottom: 4 }
          }, isAr ? "تنبيه: جدول الإجازات الهجرية" : "Notice: Hijri Holiday Table"),
          /* @__PURE__ */ React.createElement("div", {
            style: { color: "var(--textSecondary)", fontSize: 11, lineHeight: 1.5 }
          }, isAr ? saHolidayAudit.hijriWarning.ar : saHolidayAudit.hijriWarning.en)
        )
      ),
      // List of holidays with status
      // v29.0.10 (Phase 2.1): Show 3 status colors: green=complete, amber=partial, red=missing
      /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 } },
        saHolidayAudit.audit.map((h, idx) => {
          // Determine colors based on configStatus (new in v29.0.10)
          const status = h.configStatus || (h.configured ? "complete" : "missing");
          let bgColor, borderColor, iconBg, iconColor, iconChar;
          if (status === "complete") {
            bgColor = "rgba(34,197,94,0.06)"; borderColor = "rgba(34,197,94,0.2)";
            iconBg = "rgba(34,197,94,0.2)"; iconColor = "#22c55e"; iconChar = "✓";
          } else if (status === "partial") {
            bgColor = "rgba(245,158,11,0.06)"; borderColor = "rgba(245,158,11,0.3)";
            iconBg = "rgba(245,158,11,0.2)"; iconColor = "#f59e0b"; iconChar = "◐";
          } else {
            bgColor = "rgba(239,68,68,0.06)"; borderColor = "rgba(239,68,68,0.2)";
            iconBg = "rgba(239,68,68,0.2)"; iconColor = "#ef4444"; iconChar = "✗";
          }
          return /* @__PURE__ */ React.createElement("div", {
            key: idx,
            style: {
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 10px",
              background: bgColor,
              border: `1px solid ${borderColor}`,
              borderRadius: 6
            }
          },
            /* @__PURE__ */ React.createElement("div", {
              style: {
                width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                background: iconBg, color: iconColor,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700
              }
            }, iconChar),
            /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } },
              /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--textPrimary)", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } },
                isAr ? h.ar : h.en
              ),
              /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--textDim)", fontFamily: "'JetBrains Mono',monospace", marginTop: 2 } },
                fmtDate(h.date),
                h.endDate && ` → ${fmtDate(h.endDate)}`,
                h.duration > 1 && ` (${h.duration}d)`,
                // v29.0.10: Show coverage detail for multi-day holidays
                h.totalDays > 1 && h.coveredDays !== undefined && /* @__PURE__ */ React.createElement("span", {
                  style: { marginInlineStart: 6, color: status === "partial" ? "#f59e0b" : (status === "complete" ? "#22c55e" : "#ef4444"), fontWeight: 700 }
                }, ` · ${h.coveredDays}/${h.totalDays}d`),
                h.type === "religious" && /* @__PURE__ */ React.createElement("span", { style: { marginInlineStart: 6, color: "#a78bfa" } }, isAr ? "· ديني" : "· Religious"),
                h.type === "national" && /* @__PURE__ */ React.createElement("span", { style: { marginInlineStart: 6, color: "#22c55e" } }, isAr ? "· وطني" : "· National"),
                h.type === "observance" && /* @__PURE__ */ React.createElement("span", { style: { marginInlineStart: 6, color: "#f59e0b" } }, isAr ? "· شعيرة" : "· Observance")
              )
            )
          );
        })
      ),
      // Summary recommendation
      saHolidayAudit.missing.length > 0 && /* @__PURE__ */ React.createElement("div", {
        style: {
          marginTop: 12, padding: "8px 10px",
          background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 6, fontSize: 11, color: "#fca5a5"
        }
      },
        /* @__PURE__ */ React.createElement("strong", null, isAr ? "⚠ تنبيه: " : "⚠ Warning: "),
        isAr
          ? `${saHolidayAudit.missing.length} إجازة رسمية غير مُعدّة في تقويم "${primary.name}". قد يؤدي ذلك لجدولة أنشطة في أيام الإجازات.`
          : `${saHolidayAudit.missing.length} official holidays missing from calendar "${primary.name}". This may cause activities to be scheduled on holidays.`
      )
    ),

    // ── ALL CALENDARS LIST (collapsed view) ──
    sortedCals.length > 1 && /* @__PURE__ */ React.createElement("div", {
      style: { background: "var(--bgCard)", border: "1px solid #1e293b", borderRadius: 12, padding: 16 }
    },
      /* @__PURE__ */ React.createElement("div", { style: { color: "#a78bfa", fontWeight: 700, fontSize: 12, fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.1em", marginBottom: 10 } },
        isAr ? `جميع التقاويم (${sortedCals.length})` : `ALL CALENDARS (${sortedCals.length})`
      ),
      /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto" } },
        /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 11 } },
          /* @__PURE__ */ React.createElement("thead", null,
            /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bgPanel)", borderBottom: "1px solid #1e293b" } },
              ["Name", "Type", "Hrs/Day", "Workdays", "Holidays", "Activities", "Usage %"].map((h, i) => /* @__PURE__ */ React.createElement("th", {
                key: i,
                style: { padding: "8px 10px", textAlign: i >= 2 ? "right" : "start", color: "#a78bfa", fontWeight: 600, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.05em" }
              }, h))
            )
          ),
          /* @__PURE__ */ React.createElement("tbody", null,
            sortedCals.map((c, i) => /* @__PURE__ */ React.createElement("tr", {
              key: c.id,
              style: { borderBottom: "1px solid #141e2e", background: i % 2 === 0 ? "transparent" : "var(--bgCardAlt)" }
            },
              /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: "var(--textPrimary)", fontWeight: 500 } },
                c.name,
                c.isDefault && /* @__PURE__ */ React.createElement("span", { style: { marginInlineStart: 6, fontSize: 9, padding: "1px 4px", borderRadius: 3, background: "#1e40af", color: "#dbeafe" } }, "DEFAULT")
              ),
              /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", color: "var(--textSecondary)", fontFamily: "'JetBrains Mono',monospace", fontSize: 10 } }, c.type),
              /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", textAlign: "right", color: "var(--textSecondary)", fontFamily: "'JetBrains Mono',monospace" } }, c.hoursPerDay),
              /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", textAlign: "right", color: "var(--textSecondary)", fontFamily: "'JetBrains Mono',monospace" } }, `${c.workingDays}/7`),
              /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", textAlign: "right", color: c.holidays.length > 0 ? "#ef4444" : "var(--textDim)", fontFamily: "'JetBrains Mono',monospace" } }, c.holidays.length),
              /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", textAlign: "right", color: "var(--textSecondary)", fontFamily: "'JetBrains Mono',monospace" } }, c.activityCount),
              /* @__PURE__ */ React.createElement("td", { style: { padding: "8px 10px", textAlign: "right", color: "var(--textSecondary)", fontFamily: "'JetBrains Mono',monospace" } },
                totalActs > 0 ? `${(c.activityCount / totalActs * 100).toFixed(1)}%` : "—"
              )
            ))
          )
        )
      )
    )
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// v29.0.9.1 — PHASE TIMELINE COMPONENT
// Visual horizontal timeline showing project phases with progress
// ═══════════════════════════════════════════════════════════════════════════
function PhaseTimeline({ phases, methodResults, activeMethod, lang, t }) {
  if (!phases || phases.length === 0) return null;
  const isAr = lang === "ar";
  // v29.0.9: Resolve per-phase progress according to ACTIVE METHOD
  // This ensures phases match Progress Performance regardless of selected method
  const resolveProgress = (ph) => {
    if (ph && ph.progressByMethod && ph.progressByMethod[activeMethod]) {
      const pm = ph.progressByMethod[activeMethod];
      return { planned: pm.plannedPct || 0, actual: pm.actualPct || 0, weightSum: pm.weightSum || 0 };
    }
    return { planned: ph.plannedPct || 0, actual: ph.actualPct || 0, weightSum: 0 };
  };

  // Pre-compute resolved progress for each phase (used in render and overall calc)
  const phasesResolved = phases.map((ph) => ({ ...ph, _resolved: resolveProgress(ph) }));
  const validPhases = phasesResolved.filter((p) => (p.weight > 0) || (p.activityCount && p.activityCount > 0));

  // v29.0.9: Use Progress Performance result as PRIMARY source of overall
  // (this is what user sees in Progress Performance card → must match)
  const r = methodResults && methodResults[activeMethod];
  const overallPlanned = r ? r.planned : 0;
  const overallActual = r ? r.actual : 0;
  const overallVariance = +(overallActual - overallPlanned).toFixed(1);
  const overallStatusColor = overallVariance >= -1 ? "#22c55e" : overallVariance >= -10 ? "#f59e0b" : "#ef4444";

  return /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--bgCard)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: "20px 24px",
    marginBottom: 16
  } },
    /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex", justifyContent: "space-between", alignItems: "center",
      marginBottom: 16, flexWrap: "wrap", gap: 12
    } },
      /* @__PURE__ */ React.createElement("div", null,
        /* @__PURE__ */ React.createElement("div", { style: {
          color: "#a78bfa", fontWeight: 700, fontSize: 12,
          fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.1em",
          textTransform: "uppercase", marginBottom: 4
        } }, isAr ? "\u0645\u0631\u0627\u062D\u0644 \u0627\u0644\u0645\u0634\u0631\u0648\u0639" : "PROJECT PHASES"),
        /* @__PURE__ */ React.createElement("div", { style: { color: "var(--textMuted)", fontSize: 11 } },
          isAr ? `\u0625\u062C\u0645\u0627\u0644\u064A: ${phases.length} \u0645\u0631\u062D\u0644\u0629` : `Total: ${phases.length} phases`
        )
      ),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16, flexWrap: "wrap" } },
        /* @__PURE__ */ React.createElement("div", { style: { textAlign: isAr ? "right" : "left" } },
          /* @__PURE__ */ React.createElement("div", { style: { color: "var(--textMuted)", fontSize: 9, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase" } }, isAr ? "\u0627\u0644\u0645\u062E\u0637\u0637" : "Planned"),
          /* @__PURE__ */ React.createElement("div", { style: { color: "#38bdf8", fontSize: 18, fontWeight: 800 } }, overallPlanned.toFixed(1) + "%")
        ),
        /* @__PURE__ */ React.createElement("div", { style: { textAlign: isAr ? "right" : "left" } },
          /* @__PURE__ */ React.createElement("div", { style: { color: "var(--textMuted)", fontSize: 9, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase" } }, isAr ? "\u0627\u0644\u0641\u0639\u0644\u064A" : "Actual"),
          /* @__PURE__ */ React.createElement("div", { style: { color: "#22c55e", fontSize: 18, fontWeight: 800 } }, overallActual.toFixed(1) + "%")
        ),
        /* @__PURE__ */ React.createElement("div", { style: { textAlign: isAr ? "right" : "left" } },
          /* @__PURE__ */ React.createElement("div", { style: { color: "var(--textMuted)", fontSize: 9, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase" } }, isAr ? "\u0627\u0644\u0641\u0631\u0642" : "Variance"),
          /* @__PURE__ */ React.createElement("div", { style: { color: overallStatusColor, fontSize: 18, fontWeight: 800 } },
            (overallVariance >= 0 ? "+" : "") + overallVariance.toFixed(1) + "%"
          )
        )
      )
    ),
    // Horizontal phase blocks
    /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex", gap: 4, alignItems: "stretch", overflowX: "auto", paddingBottom: 8,
      direction: isAr ? "rtl" : "ltr"
    } },
      // v29.0.9: filter out phases with no real data; use _resolved progress per active method
      // Sort by weight descending so biggest phases come first
      phasesResolved
        .filter((ph) => (ph.weight > 0) || (ph.activityCount && ph.activityCount > 0))
        .sort((a, b) => (b.weight || 0) - (a.weight || 0))
        .map((ph, idx) => {
        const meta = PHASE_LIBRARY[ph.key] || { label_en: ph.key, label_ar: ph.key, color: "#64748b", icon: "\u25A0", short_en: ph.key, short_ar: ph.key };
        const flexBasis = Math.max(ph.weight, 4); // min visual size
        // v29.0.9: per-phase progress from resolved (active-method-aware)
        const planned = ph._resolved.planned || 0;
        const actual = ph._resolved.actual || 0;
        const variance = +(actual - planned).toFixed(1);
        // Status color based on variance
        const varianceColor = variance >= -1 ? "#22c55e" : variance >= -10 ? "#f59e0b" : "#ef4444";
        const fillColor = actual >= 99 ? "#22c55e" : actual >= 50 ? meta.color : meta.color;

        return /* @__PURE__ */ React.createElement("div", {
          key: ph.key + "_" + idx,
          style: {
            flex: `${flexBasis} ${flexBasis} 0`,
            minWidth: 110,
            background: `linear-gradient(135deg, ${meta.color}22, ${meta.color}11)`,
            border: `1px solid ${meta.color}55`,
            borderRadius: 8, padding: "10px 8px 8px",
            display: "flex", flexDirection: "column", alignItems: "center",
            position: "relative", overflow: "hidden",
            transition: "all 0.2s",
            cursor: "default"
          },
          title: `${isAr ? meta.label_ar : meta.label_en}\n${isAr ? "\u0627\u0644\u0648\u0632\u0646" : "Weight"}: ${ph.weight}%\n${isAr ? "\u0627\u0644\u0645\u062E\u0637\u0637" : "Planned"}: ${planned}%\n${isAr ? "\u0627\u0644\u0641\u0639\u0644\u064A" : "Actual"}: ${actual}%\n${isAr ? "\u0627\u0644\u0641\u0631\u0642" : "Variance"}: ${variance > 0 ? "+" : ""}${variance}%${ph.activityCount ? `\n${ph.activityCount} ${isAr ? "\u0646\u0634\u0627\u0637" : "activities"}` : ""}`
        },
          // Top accent stripe
          /* @__PURE__ */ React.createElement("div", { style: {
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: meta.color
          } }),
          // Icon + Name
          /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, marginTop: 4, marginBottom: 2 } }, meta.icon),
          /* @__PURE__ */ React.createElement("div", { style: {
            color: meta.color, fontSize: 10, fontWeight: 700,
            textAlign: "center", lineHeight: 1.2, marginBottom: 4,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%"
          } }, isAr ? meta.short_ar : meta.short_en),
          // ── ACTUAL PROGRESS (the BIG number, like the previous %) ──
          /* @__PURE__ */ React.createElement("div", { style: {
            color: "var(--textPrimary)", fontSize: 16, fontWeight: 800,
            fontFamily: "'JetBrains Mono',monospace", lineHeight: 1
          } }, actual.toFixed(1) + "%"),
          /* @__PURE__ */ React.createElement("div", { style: {
            color: "var(--textMuted)", fontSize: 8, marginBottom: 4,
            fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: "0.05em"
          } }, isAr ? "\u0627\u0644\u0641\u0639\u0644\u064A" : "Actual"),
          // ── PROGRESS BAR (shows actual filling against planned) ──
          /* @__PURE__ */ React.createElement("div", { style: {
            width: "100%", height: 4, background: "rgba(255,255,255,0.08)",
            borderRadius: 2, overflow: "hidden", marginBottom: 4, position: "relative"
          } },
            // Planned line indicator
            /* @__PURE__ */ React.createElement("div", { style: {
              position: "absolute", top: 0, bottom: 0,
              left: `${Math.min(planned, 100)}%`, width: 1.5,
              background: "#38bdf8", zIndex: 2
            } }),
            // Actual fill
            /* @__PURE__ */ React.createElement("div", { style: {
              width: `${Math.min(actual, 100)}%`, height: "100%",
              background: fillColor, borderRadius: 2, transition: "width 0.4s"
            } })
          ),
          // ── Planned vs Actual line ──
          /* @__PURE__ */ React.createElement("div", { style: {
            display: "flex", justifyContent: "space-between", alignItems: "center",
            width: "100%", fontSize: 8, fontFamily: "'JetBrains Mono',monospace",
            marginBottom: 3
          } },
            /* @__PURE__ */ React.createElement("span", { style: { color: "#38bdf8" } }, "P:" + planned.toFixed(0) + "%"),
            /* @__PURE__ */ React.createElement("span", { style: { color: varianceColor, fontWeight: 700 } },
              (variance >= 0 ? "+" : "") + variance.toFixed(0) + "%"
            )
          ),
          // ── Weight (small, at bottom) ──
          /* @__PURE__ */ React.createElement("div", { style: {
            color: "var(--textDim)", fontSize: 8,
            fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.04em",
            marginTop: 2
          } }, (isAr ? "\u0648\u0632\u0646 " : "W: ") + ph.weight + "%"),
          ph.activityCount ? /* @__PURE__ */ React.createElement("div", { style: {
            color: "var(--textDim)", fontSize: 7, marginTop: 1, fontFamily: "'JetBrains Mono',monospace"
          } }, ph.activityCount + (isAr ? " \u0646\u0634\u0627\u0637" : " acts")) : null
        );
      })
    )
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// v29.0.9.1 — PHASE TEMPLATE SELECTOR (dropdown for choosing phase structure)
// ═══════════════════════════════════════════════════════════════════════════
function PhaseTemplateSelector({ currentTemplate, onChange, discoveryResult, lang, t }) {
  const isAr = lang === "ar";
  // Group templates by category
  const groups = [
    {
      label: isAr ? "\u0645\u0639\u062A\u0645\u062F NG SA" : "NG SA Official",
      keys: ["ng_official_substation"]
    },
    {
      label: isAr ? "NG Matrix (10 \u0623\u0646\u0648\u0627\u0639)" : "NG Matrix (10 types)",
      keys: ["ss_lines", "ohtl", "ugc", "battery", "hvdc", "telecom", "cyber", "asset_repl", "drpc_svc", "purchase_order"]
    },
    {
      label: isAr ? "\u0635\u0646\u0627\u0639\u064A \u0639\u0627\u0645" : "Industrial Generic",
      keys: ["mechanical", "electrical", "process_plant", "building", "generic"]
    }
  ];

  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap"
  } },
    /* @__PURE__ */ React.createElement("div", { style: {
      color: "var(--textMuted)", fontSize: 11, fontFamily: "'JetBrains Mono',monospace",
      textTransform: "uppercase", letterSpacing: "0.1em"
    } }, isAr ? "\u0647\u064A\u0643\u0644 \u0627\u0644\u0645\u0631\u0627\u062D\u0644:" : "PHASE STRUCTURE:"),
    /* @__PURE__ */ React.createElement("select", {
      value: currentTemplate,
      onChange: (e) => onChange(e.target.value),
      style: {
        background: "var(--bgCard)", color: "#a78bfa",
        border: "1px solid rgba(167,139,250,0.4)", borderRadius: 8,
        padding: "8px 14px", fontSize: 13, fontWeight: 700, fontFamily: "inherit",
        cursor: "pointer", outline: "none", minWidth: 240
      }
    },
      // Auto-discover option
      /* @__PURE__ */ React.createElement("option", { value: "discover", style: { background: "#0f172a" } },
        `\u2728 ${isAr ? "\u0627\u0643\u062A\u0634\u0627\u0641 \u062A\u0644\u0642\u0627\u0626\u064A" : "Auto-Discover"} ${discoveryResult ? `(${discoveryResult.confidence}%)` : ""}`
      ),
      groups.map((g, i) => /* @__PURE__ */ React.createElement("optgroup", { key: i, label: g.label, style: { background: "#0f172a" } },
        g.keys.filter((k) => PHASE_TEMPLATES[k]).map((k) => {
          const tpl = PHASE_TEMPLATES[k];
          return /* @__PURE__ */ React.createElement("option", { key: k, value: k, style: { background: "#0f172a" } },
            `${isAr ? tpl.name_ar : tpl.name_en} (${tpl.phases.length})`
          );
        })
      ))
    ),
    discoveryResult && currentTemplate === "discover" && /* @__PURE__ */ React.createElement("div", {
      style: {
        background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.3)",
        borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#22d3ee",
        fontFamily: "'JetBrains Mono',monospace"
      },
      title: isAr ? "\u062F\u0631\u062C\u0629 \u0627\u0644\u062B\u0642\u0629 \u0641\u064A \u0627\u0644\u0627\u0643\u062A\u0634\u0627\u0641" : "Confidence in discovery"
    },
      `\ud83d\udca1 ${discoveryResult.phases.length} ${isAr ? "\u0645\u0631\u0627\u062D\u0644 \u0645\u0643\u062A\u0634\u0641\u0629" : "phases discovered"} | ${discoveryResult.activityCount} ${isAr ? "\u0646\u0634\u0627\u0637" : "activities"}`
    )
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// v29.0.9.1 — MILESTONE COMPLIANCE PANEL
// ═══════════════════════════════════════════════════════════════════════════
// v29.0.9: helper to compute status colors/labels for an instance
function _milestoneInstanceVisuals(instance, isAr) {
  if (!instance) {
    return {
      bgC: "rgba(148,163,184,0.05)", borderC: "rgba(148,163,184,0.2)",
      dotC: "#94a3b8", icon: "\u2014",
      statusLabel: isAr ? "\u0645\u0641\u0642\u0648\u062F" : "Missing",
      statusColor: "#94a3b8"
    };
  }
  const sd = instance.slipDays;
  const status = instance.status;
  if (status === "completed") {
    const isLate = (typeof sd === "number") && sd > 1;
    return {
      bgC: isLate ? "rgba(245,158,11,0.08)" : "rgba(34,197,94,0.08)",
      borderC: isLate ? "rgba(245,158,11,0.3)" : "rgba(34,197,94,0.3)",
      dotC: isLate ? "#f59e0b" : "#22c55e",
      icon: "\u2713",
      statusLabel: isAr ? "\u0645\u0643\u062A\u0645\u0644" : "Completed",
      statusColor: isLate ? "#f59e0b" : "#22c55e"
    };
  }
  if (status === "in_progress") {
    return {
      bgC: "rgba(56,189,248,0.08)", borderC: "rgba(56,189,248,0.3)",
      dotC: "#38bdf8", icon: "\u25D0",
      statusLabel: isAr ? "\u0642\u064A\u062F \u0627\u0644\u062A\u0646\u0641\u064A\u0630" : "In Progress",
      statusColor: "#38bdf8"
    };
  }
  if (status === "overdue") {
    return {
      bgC: "rgba(239,68,68,0.08)", borderC: "rgba(239,68,68,0.4)",
      dotC: "#ef4444", icon: "\u26A0",
      statusLabel: isAr ? "\u0645\u062A\u0623\u062E\u0631" : "Overdue",
      statusColor: "#ef4444"
    };
  }
  return {
    bgC: "rgba(148,163,184,0.06)", borderC: "rgba(148,163,184,0.25)",
    dotC: "#94a3b8", icon: "\u25EF",
    statusLabel: isAr ? "\u0644\u0645 \u064A\u0628\u062F\u0623" : "Not Started",
    statusColor: "#94a3b8"
  };
}

function _milestoneSlipText(slipDays, isAr) {
  if (typeof slipDays !== "number") return { text: null, color: null };
  if (slipDays > 1) {
    return {
      text: isAr ? `\u062A\u0623\u062E\u0631 ${slipDays} \u064A\u0648\u0645` : `+${slipDays}d late`,
      color: slipDays > 30 ? "#ef4444" : "#f59e0b"
    };
  }
  if (slipDays < -1) {
    return {
      text: isAr ? `\u0645\u0628\u0643\u0631 ${Math.abs(slipDays)} \u064A\u0648\u0645` : `${slipDays}d early`,
      color: "#22c55e"
    };
  }
  return { text: isAr ? "\u0641\u064A \u0627\u0644\u0648\u0642\u062A" : "On time", color: "#22c55e" };
}

function MilestoneCompliancePanel({ compliance, lang, t }) {
  const isAr = lang === "ar";
  const [expanded, setExpanded] = useState({}); // milestone.id -> bool (for multi-instance dropdown)
  if (!compliance || compliance.length === 0) return null;
  const found = compliance.filter((c) => c.found).length;
  const required = compliance.filter((c) => c.milestone.required).length;
  const foundRequired = compliance.filter((c) => c.milestone.required && c.found).length;
  const complianceScore = required > 0 ? +(foundRequired / required * 100).toFixed(0) : 100;
  const statusColor = complianceScore >= 90 ? "#22c55e" : complianceScore >= 60 ? "#f59e0b" : "#ef4444";
  const fmtDate = (d) => d ? String(d).split("T")[0] : "";

  return /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--bgCard)", border: "1px solid var(--border)",
    borderRadius: 14, padding: "16px 20px", marginBottom: 16
  } },
    // Header
    /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14
    } },
      /* @__PURE__ */ React.createElement("div", null,
        /* @__PURE__ */ React.createElement("div", { style: {
          color: "#f59e0b", fontWeight: 700, fontSize: 12,
          fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.1em",
          textTransform: "uppercase", marginBottom: 4
        } }, isAr ? "\u0627\u0644\u0623\u062D\u062F\u0627\u062B \u0627\u0644\u0625\u0644\u0632\u0627\u0645\u064A\u0629" : "MANDATORY MILESTONES"),
        /* @__PURE__ */ React.createElement("div", { style: { color: "var(--textMuted)", fontSize: 11 } },
          `${found}/${compliance.length} ${isAr ? "\u0645\u0648\u062C\u0648\u062F" : "found"} \u00b7 ${foundRequired}/${required} ${isAr ? "\u0625\u0644\u0632\u0627\u0645\u064A" : "required"}`
        )
      ),
      /* @__PURE__ */ React.createElement("div", { style: {
        background: `${statusColor}22`, border: `1px solid ${statusColor}66`, borderRadius: 8,
        padding: "8px 16px", color: statusColor, fontWeight: 800, fontSize: 22,
        fontFamily: "'JetBrains Mono',monospace"
      } }, complianceScore + "%")
    ),
    // Milestone cards
    /* @__PURE__ */ React.createElement("div", { style: {
      display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8
    } },
      compliance.map((c, idx) => {
        const m = c.milestone;
        const isMulti = m.multiple && c.count > 1;
        const isExpanded = !!expanded[m.id];

        // For multi-instance: show summary card with expand button
        if (isMulti) {
          // Compute aggregate status
          const completedCount = c.instances.filter((i) => i.status === "completed").length;
          const inProgressCount = c.instances.filter((i) => i.status === "in_progress").length;
          const overdueCount = c.instances.filter((i) => i.status === "overdue").length;
          // Worst status drives visual
          let aggStatus, aggColor, aggIcon, aggLabel;
          if (overdueCount > 0) {
            aggStatus = "overdue"; aggColor = "#ef4444"; aggIcon = "\u26A0";
            aggLabel = isAr ? "\u0645\u062A\u0623\u062E\u0631" : "Overdue";
          } else if (completedCount === c.count) {
            aggStatus = "completed"; aggColor = "#22c55e"; aggIcon = "\u2713";
            aggLabel = isAr ? "\u0645\u0643\u062A\u0645\u0644" : "All Completed";
          } else if (inProgressCount > 0 || completedCount > 0) {
            aggStatus = "in_progress"; aggColor = "#38bdf8"; aggIcon = "\u25D0";
            aggLabel = isAr ? "\u0642\u064A\u062F \u0627\u0644\u062A\u0646\u0641\u064A\u0630" : "In Progress";
          } else {
            aggStatus = "not_started"; aggColor = "#94a3b8"; aggIcon = "\u25EF";
            aggLabel = isAr ? "\u0644\u0645 \u064A\u0628\u062F\u0623" : "Not Started";
          }
          const bgC = `${aggColor}14`;
          const borderC = `${aggColor}55`;

          return /* @__PURE__ */ React.createElement("div", {
            key: m.id,
            style: {
              gridColumn: isExpanded ? "1 / -1" : "auto", // expand to full width when open
              background: bgC, border: `1px solid ${borderC}`, borderRadius: 8,
              padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8,
              transition: "all 0.2s"
            }
          },
            // Summary row (always visible)
            /* @__PURE__ */ React.createElement("div", {
              style: { display: "flex", alignItems: "stretch", gap: 10, cursor: "pointer", minHeight: 64 },
              onClick: () => setExpanded((p) => ({ ...p, [m.id]: !p[m.id] }))
            },
              /* @__PURE__ */ React.createElement("div", { style: {
                width: 28, height: 28, borderRadius: 6, background: aggColor,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0, alignSelf: "flex-start"
              } }, aggIcon),
              /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 } },
                /* @__PURE__ */ React.createElement("div", { style: {
                  display: "flex", alignItems: "center", gap: 8
                } },
                  /* @__PURE__ */ React.createElement("div", {
                    style: { color: "var(--textPrimary)", fontSize: 12, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 },
                    title: isAr ? m.name_ar : m.name_en
                  }, NG_GLOSSARY[(m.id || "").toUpperCase()] ?
                    /* @__PURE__ */ React.createElement(GlossaryTerm, { term: (m.id || "").toUpperCase(), lang }, isAr ? m.name_ar : m.name_en) :
                    (isAr ? m.name_ar : m.name_en)
                  ),
                  /* @__PURE__ */ React.createElement("span", {
                    style: {
                      background: `${aggColor}33`, color: aggColor, fontSize: 11, fontWeight: 800,
                      padding: "2px 8px", borderRadius: 10, fontFamily: "'JetBrains Mono',monospace",
                      flexShrink: 0
                    }
                  }, `${c.count}\u00d7`)
                ),
                /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" } },
                  /* @__PURE__ */ React.createElement("span", { style: {
                    background: `${aggColor}22`, color: aggColor, fontSize: 9, fontWeight: 700,
                    padding: "2px 6px", borderRadius: 4, fontFamily: "'JetBrains Mono',monospace",
                    textTransform: "uppercase", letterSpacing: "0.04em"
                  } }, aggLabel),
                  /* @__PURE__ */ React.createElement("span", { style: {
                    color: "var(--textDim)", fontSize: 9, fontFamily: "'JetBrains Mono',monospace"
                  } },
                    `${completedCount}/${c.count} ${isAr ? "\u0645\u0643\u062A\u0645\u0644" : "completed"}`
                  )
                ),
                /* @__PURE__ */ React.createElement("div", { style: {
                  fontSize: 10, color: "var(--textMuted)", fontFamily: "'JetBrains Mono',monospace"
                } }, isAr ?
                  `\u0627\u0636\u063A\u0637 \u0644${isExpanded ? "\u0625\u062E\u0641\u0627\u0621" : "\u0639\u0631\u0636"} \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644 ${isExpanded ? "\u25B4" : "\u25BE"}` :
                  `Click to ${isExpanded ? "hide" : "view"} all ${c.count} instances ${isExpanded ? "\u25B4" : "\u25BE"}`
                )
              )
            ),
            // Expandable detail rows
            isExpanded && /* @__PURE__ */ React.createElement("div", { style: {
              display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 6, marginTop: 4, paddingTop: 8, borderTop: `1px solid ${aggColor}22`
            } },
              c.instances.map((inst, instIdx) => {
                const v = _milestoneInstanceVisuals(inst, isAr);
                const slip = _milestoneSlipText(inst.slipDays, isAr);
                return /* @__PURE__ */ React.createElement("div", {
                  key: inst.actId || ("inst_" + instIdx),
                  style: {
                    background: v.bgC, border: `1px solid ${v.borderC}`,
                    borderRadius: 6, padding: "8px 10px",
                    display: "flex", alignItems: "stretch", gap: 8
                  }
                },
                  /* @__PURE__ */ React.createElement("div", { style: {
                    width: 22, height: 22, borderRadius: 5, background: v.dotC,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 800, fontSize: 11, flexShrink: 0, alignSelf: "flex-start"
                  } }, v.icon),
                  /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 } },
                    // Sub-label or full name
                    /* @__PURE__ */ React.createElement("div", {
                      style: { color: "var(--textPrimary)", fontSize: 11, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
                      title: inst.name
                    }, inst.subLabel || inst.name),
                    // Status pill
                    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" } },
                      /* @__PURE__ */ React.createElement("span", { style: {
                        background: `${v.statusColor}22`, color: v.statusColor, fontSize: 8, fontWeight: 700,
                        padding: "1px 5px", borderRadius: 3, fontFamily: "'JetBrains Mono',monospace",
                        textTransform: "uppercase", letterSpacing: "0.04em"
                      } }, v.statusLabel)
                    ),
                    // Dates
                    (inst.plannedDate || inst.actualDate) && /* @__PURE__ */ React.createElement("div", { style: {
                      fontSize: 9, color: "var(--textMuted)", fontFamily: "'JetBrains Mono',monospace",
                      display: "flex", flexWrap: "wrap", gap: 6
                    } },
                      inst.plannedDate && /* @__PURE__ */ React.createElement("span", { style: { color: "#38bdf8" } },
                        (isAr ? "\u062E: " : "P: ") + fmtDate(inst.plannedDate)
                      ),
                      inst.actualDate && /* @__PURE__ */ React.createElement("span", { style: { color: "#22c55e" } },
                        (isAr ? "\u0641: " : "A: ") + fmtDate(inst.actualDate)
                      ),
                      !inst.actualDate && inst.projectedDate && /* @__PURE__ */ React.createElement("span", { style: { color: "#a78bfa" } },
                        (isAr ? "\u0645: " : "F: ") + fmtDate(inst.projectedDate)
                      )
                    ),
                    // Slip
                    slip.text && /* @__PURE__ */ React.createElement("div", { style: {
                      fontSize: 9, fontWeight: 700, color: slip.color,
                      fontFamily: "'JetBrains Mono',monospace"
                    } }, slip.text)
                  )
                );
              })
            )
          );
        }

        // ─── Single-instance milestone (original layout) ───
        const v = _milestoneInstanceVisuals(c.found ? c : null, isAr);
        // Override "Missing" handling to respect required flag
        if (!c.found) {
          v.bgC = m.required ? "rgba(239,68,68,0.08)" : "rgba(148,163,184,0.05)";
          v.borderC = m.required ? "rgba(239,68,68,0.3)" : "rgba(148,163,184,0.2)";
          v.dotC = m.required ? "#ef4444" : "#94a3b8";
          v.icon = m.required ? "\u2717" : "\u2014";
          v.statusColor = m.required ? "#ef4444" : "#94a3b8";
        }
        const slip = _milestoneSlipText(c.slipDays, isAr);

        return /* @__PURE__ */ React.createElement("div", {
          key: m.id,
          style: {
            background: v.bgC, border: `1px solid ${v.borderC}`, borderRadius: 8,
            padding: "10px 12px", display: "flex", alignItems: "stretch", gap: 10, minHeight: 64
          }
        },
          /* @__PURE__ */ React.createElement("div", { style: {
            width: 28, height: 28, borderRadius: 6, background: v.dotC,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0, alignSelf: "flex-start"
          } }, v.icon),
          /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 4 } },
            /* @__PURE__ */ React.createElement("div", {
              style: { color: "var(--textPrimary)", fontSize: 12, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
              title: isAr ? m.name_ar : m.name_en
            }, NG_GLOSSARY[(m.id || "").toUpperCase()] ?
              /* @__PURE__ */ React.createElement(GlossaryTerm, { term: (m.id || "").toUpperCase(), lang }, isAr ? m.name_ar : m.name_en) :
              (isAr ? m.name_ar : m.name_en)
            ),
            /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" } },
              /* @__PURE__ */ React.createElement("span", { style: {
                background: `${v.statusColor}22`, color: v.statusColor, fontSize: 9, fontWeight: 700,
                padding: "2px 6px", borderRadius: 4, fontFamily: "'JetBrains Mono',monospace",
                textTransform: "uppercase", letterSpacing: "0.04em"
              } }, v.statusLabel),
              m.required && /* @__PURE__ */ React.createElement("span", { style: {
                color: "var(--textDim)", fontSize: 9, fontFamily: "'JetBrains Mono',monospace"
              } }, isAr ? "\u0625\u0644\u0632\u0627\u0645\u064A" : "Required")
            ),
            (c.plannedDate || c.actualDate) && /* @__PURE__ */ React.createElement("div", { style: {
              fontSize: 10, color: "var(--textMuted)", fontFamily: "'JetBrains Mono',monospace",
              display: "flex", flexWrap: "wrap", gap: 8
            } },
              c.plannedDate && /* @__PURE__ */ React.createElement("span", { style: { color: "#38bdf8" } },
                (isAr ? "\u0645\u062E\u0637\u0637: " : "Plan: ") + fmtDate(c.plannedDate)
              ),
              c.actualDate && /* @__PURE__ */ React.createElement("span", { style: { color: "#22c55e" } },
                (isAr ? "\u0641\u0639\u0644\u064A: " : "Actual: ") + fmtDate(c.actualDate)
              ),
              !c.actualDate && c.projectedDate && /* @__PURE__ */ React.createElement("span", { style: { color: "#a78bfa" } },
                (isAr ? "\u0645\u062A\u0648\u0642\u0639: " : "Forecast: ") + fmtDate(c.projectedDate)
              )
            ),
            slip.text && /* @__PURE__ */ React.createElement("div", { style: {
              fontSize: 10, fontWeight: 700, color: slip.color,
              fontFamily: "'JetBrains Mono',monospace"
            } }, slip.text)
          )
        );
      })
    )
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// v29.0.9.1 — NG COMPLIANCE PANEL
// ═══════════════════════════════════════════════════════════════════════════
function NGCompliancePanel({ compliance, lang, t }) {
  const isAr = lang === "ar";
  if (!compliance || !compliance.results) return null;
  const score = compliance.overallScore;
  const passed = compliance.results.filter((r) => r.passed).length;
  const total = compliance.results.length;
  const statusColor = score >= 85 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";
  const statusLabel = score >= 85 ? (isAr ? "\u0645\u0645\u062A\u0627\u0632" : "Excellent") :
                      score >= 60 ? (isAr ? "\u0645\u0642\u0628\u0648\u0644" : "Acceptable") :
                      (isAr ? "\u064A\u062D\u062A\u0627\u062C \u062A\u062D\u0633\u064A\u0646" : "Needs Improvement");

  return /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--bgCard)", border: `1px solid ${statusColor}33`,
    borderRadius: 14, padding: "16px 20px", marginBottom: 16
  } },
    /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 12
    } },
      /* @__PURE__ */ React.createElement("div", null,
        /* @__PURE__ */ React.createElement("div", { style: {
          color: statusColor, fontWeight: 700, fontSize: 12,
          fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.1em",
          textTransform: "uppercase", marginBottom: 4
        } }, isAr ? "\u0627\u0644\u062A\u0648\u0627\u0641\u0642 \u0645\u0639 \u0645\u0639\u0627\u064A\u064A\u0631 NG SA" : "NG SA SCHEDULE COMPLIANCE"),
        /* @__PURE__ */ React.createElement("div", { style: { color: "var(--textMuted)", fontSize: 11 } },
          `${passed}/${total} ${isAr ? "\u0641\u062D\u0635 \u0646\u0627\u062C\u062D" : "checks passed"} \u00b7 ${statusLabel}`
        )
      ),
      /* @__PURE__ */ React.createElement("div", { style: {
        background: `${statusColor}22`, border: `1px solid ${statusColor}66`, borderRadius: 10,
        padding: "10px 20px", display: "flex", alignItems: "baseline", gap: 4
      } },
        /* @__PURE__ */ React.createElement("span", { style: { color: statusColor, fontSize: 32, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" } }, score),
        /* @__PURE__ */ React.createElement("span", { style: { color: statusColor, fontSize: 14, fontWeight: 600 } }, "/100")
      )
    ),
    /* @__PURE__ */ React.createElement("div", { style: {
      display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8
    } },
      compliance.results.map((rr) => {
        const ic = rr.passed ? "#22c55e" : (rr.severity === "critical" ? "#ef4444" : rr.severity === "warning" ? "#f59e0b" : "#94a3b8");
        const icon = rr.passed ? "\u2713" : (rr.severity === "critical" ? "\u26A0" : rr.severity === "warning" ? "\u26A0" : "\u2139");
        return /* @__PURE__ */ React.createElement("div", { key: rr.id, style: {
          background: `${ic}0a`, border: `1px solid ${ic}33`, borderRadius: 8,
          padding: "10px 12px"
        } },
          /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 } },
            /* @__PURE__ */ React.createElement("span", { style: { color: ic, fontSize: 14, fontWeight: 700 } }, icon),
            /* @__PURE__ */ React.createElement("span", { style: { color: "var(--textPrimary)", fontSize: 12, fontWeight: 600, flex: 1 } },
              isAr ? rr.label_ar : rr.label_en
            ),
            /* @__PURE__ */ React.createElement("span", { style: { color: ic, fontSize: 13, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" } }, rr.score + "%")
          ),
          /* @__PURE__ */ React.createElement("div", { style: { color: "var(--textMuted)", fontSize: 10, fontFamily: "'JetBrains Mono',monospace" } },
            rr.violations > 0 ? `${rr.violations} ${isAr ? "\u0645\u062E\u0627\u0644\u0641\u0629" : "violations"} \u00b7 ${rr.manual}` : `\u2713 ${rr.manual}`
          )
        );
      })
    )
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// v29.0.9.1 — RECOVERY ALERT PANEL
// ═══════════════════════════════════════════════════════════════════════════
function RecoveryAlertPanel({ recovery, lang, t }) {
  const isAr = lang === "ar";
  if (!recovery || !recovery.triggered) return null;
  return /* @__PURE__ */ React.createElement("div", { style: {
    background: "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(220,38,38,0.05))",
    border: "1px solid rgba(239,68,68,0.4)",
    borderRadius: 14, padding: "16px 20px", marginBottom: 16
  } },
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 } },
      /* @__PURE__ */ React.createElement("div", { style: { fontSize: 28 } }, "\u26A0\uFE0F"),
      /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } },
        /* @__PURE__ */ React.createElement("div", { style: {
          color: "#ef4444", fontWeight: 800, fontSize: 14,
          fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.05em",
          textTransform: "uppercase"
        } }, isAr ? "\u062C\u062F\u0648\u0644 \u0627\u0633\u062A\u062F\u0631\u0627\u0643 \u0645\u0637\u0644\u0648\u0628" : "RECOVERY SCHEDULE REQUIRED"),
        /* @__PURE__ */ React.createElement("div", { style: { color: "var(--textSecondary)", fontSize: 12, marginTop: 4 } },
          isAr ?
            `${recovery.totalDelayed} \u0646\u0634\u0627\u0637 \u0645\u062A\u0623\u062E\u0631 \u0623\u0643\u062B\u0631 \u0645\u0646 ${recovery.threshold} \u064A\u0648\u0645 (10% \u0645\u0646 \u0645\u062F\u0629 \u0627\u0644\u0639\u0642\u062F)` :
            `${recovery.totalDelayed} activities delayed > ${recovery.threshold} days (10% of contract duration)`
        )
      )
    ),
    /* @__PURE__ */ React.createElement("div", { style: { color: "var(--textDim)", fontSize: 11, fontStyle: "italic" } },
      isAr ?
        "\u0648\u0641\u0642\u0627\u064B \u0644\u062F\u0644\u064A\u0644 NG SA (\u0628\u0646\u062F 8.2.2.3)\u060C \u064A\u062C\u0628 \u062A\u0642\u062F\u064A\u0645 Recovery Schedule \u0639\u0646\u062F \u0648\u062C\u0648\u062F \u0623\u0646\u0634\u0637\u0629 \u0645\u062A\u0623\u062E\u0631\u0629 \u0628\u0646\u0633\u0628\u0629 \u2265 10%" :
        "Per NG SA Manual (Section 8.2.2.3), Recovery Schedule must be submitted when activities are delayed \u2265 10% of contract duration"
    ),
    recovery.delayedActivities.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12 } },
      /* @__PURE__ */ React.createElement("div", { style: {
        color: "var(--textMuted)", fontSize: 10, fontFamily: "'JetBrains Mono',monospace",
        textTransform: "uppercase", marginBottom: 6
      } }, isAr ? "\u0623\u0643\u062B\u0631 5 \u0623\u0646\u0634\u0637\u0629 \u062A\u0623\u062E\u0631\u0627\u064B:" : "TOP 5 DELAYED ACTIVITIES:"),
      recovery.delayedActivities.slice(0, 5).map((a, i) => /* @__PURE__ */ React.createElement("div", {
        key: i,
        style: {
          display: "flex", justifyContent: "space-between", padding: "4px 0",
          borderBottom: i < 4 ? "1px solid rgba(239,68,68,0.15)" : "none",
          fontSize: 12, color: "var(--textSecondary)"
        }
      },
        /* @__PURE__ */ React.createElement("span", {
          style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: 12 },
          title: a.name
        }, a.actId, " — ", a.name),
        /* @__PURE__ */ React.createElement("span", { style: { color: "#ef4444", fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" } },
          `+${a.slipDays}d (${a.slipPct}%)`
        )
      ))
    )
  );
}

// v29.0.9.1: Standalone ProjectTypeBanner — shown directly under project name
// FIX v29.0.9.1: overrideType lifted to parent (ExecutiveDashboard) so changes 
// propagate to KeyMilestonesPanel AND trigger ng_matrix recommendation refresh
function ProjectTypeBanner({ projectType: detectedProjectType, lang, t, overrideType, setOverrideType }) {
  var _a, _b, _c, _d;
  const [showTypeModal, setShowTypeModal] = useState(false);
  const projectType = overrideType !== undefined && overrideType !== null
    ? (overrideType === "auto" ? detectedProjectType : overrideType)
    : detectedProjectType;
  if (!projectType) return null;
  return /* @__PURE__ */ React.createElement(React.Fragment, null,
    showTypeModal && /* @__PURE__ */ React.createElement(ProjectTypeSelectorModal, {
      currentType: projectType,
      detectedType: detectedProjectType,
      lang, t,
      onSelect: (newType) => { setOverrideType(newType); setShowTypeModal(false); },
      onClose: () => setShowTypeModal(false)
    }),
    /* @__PURE__ */ React.createElement("div", { style: {
      background: `linear-gradient(135deg, ${((_a = projectType.palette) == null ? void 0 : _a.from) || "#0ea5e9"}, ${((_b = projectType.palette) == null ? void 0 : _b.to) || "#8b5cf6"})`,
      borderRadius: 12,
      padding: "18px 22px",
      margin: "16px 0",
      position: "relative",
      overflow: "hidden",
      boxShadow: `0 4px 20px ${((_c = projectType.palette) == null ? void 0 : _c.glow) || "rgba(14,165,233,0.25)"}`
    } },
      /* @__PURE__ */ React.createElement("div", { style: {
        position: "absolute", top: 0, insetInlineEnd: 0, width: 200, height: "100%",
        background: "linear-gradient(135deg, transparent, rgba(255,255,255,0.08))", pointerEvents: "none"
      } }),
      /* @__PURE__ */ React.createElement("div", { style: {
        display: "flex", alignItems: "center", gap: 18, position: "relative", flexWrap: "wrap"
      } },
        /* @__PURE__ */ React.createElement("div", { style: {
          fontSize: 56, lineHeight: 1, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))", flexShrink: 0
        } }, projectType.icon),
        /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 200 } },
          /* @__PURE__ */ React.createElement("div", { style: {
            fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.78)",
            fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6
          } }, lang === "ar" ? "\u0646\u0648\u0639 \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u0627\u0644\u0645\u0643\u062A\u0634\u0641" : "Detected Project Type"),
          /* @__PURE__ */ React.createElement("div", { style: {
            fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 800, color: "#fff",
            lineHeight: 1.2, letterSpacing: "-0.01em", textShadow: "0 1px 3px rgba(0,0,0,0.2)"
          } }, lang === "ar" ? projectType.name_ar : projectType.name_en)
        ),
        /* @__PURE__ */ React.createElement("div", { style: {
          background: "rgba(0,0,0,0.22)", border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: 10, padding: "8px 14px", textAlign: "center", flexShrink: 0, backdropFilter: "blur(4px)"
        } },
          /* @__PURE__ */ React.createElement("div", { style: {
            fontSize: 9, color: "rgba(255,255,255,0.75)", fontFamily: "'JetBrains Mono',monospace",
            letterSpacing: "0.08em", marginBottom: 2
          } }, lang === "ar" ? "\u062B\u0642\u0629" : "CONFIDENCE"),
          /* @__PURE__ */ React.createElement("div", { style: {
            fontSize: 22, fontWeight: 800, color: ((_d = projectType.palette) == null ? void 0 : _d.accent) || "#fff",
            fontFamily: "'JetBrains Mono',monospace", lineHeight: 1
          } }, projectType.score)
        ),
        /* @__PURE__ */ React.createElement("button", {
          onClick: () => setShowTypeModal(true),
          style: {
            background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.35)", color: "#fff",
            borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 10, fontWeight: 700,
            fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.05em", flexShrink: 0,
            backdropFilter: "blur(4px)", whiteSpace: "nowrap"
          },
          title: lang === "ar" ? "\u062a\u063a\u064a\u064a\u0631 \u0646\u0648\u0639 \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u064a\u062f\u0648\u064a\u0627\u064b" : "Change project type manually"
        }, "\u270F\uFE0F " + t.changeTypeBtn)
      )
    )
  );
}

function KeyMilestonesPanel({ projectType: detectedProjectType, keyMilestones, lang, t, hideBanner, overrideType, setOverrideType }) {
  var _a, _b, _c, _d;
  const [expanded, setExpanded] = useState({});
  const [showTypeModal, setShowTypeModal] = useState(false);
  // Use override if set, else detected (overrideType comes from parent ExecutiveDashboard)
  const projectType = overrideType !== undefined && overrideType !== null
    ? (overrideType === "auto" ? detectedProjectType : overrideType)
    : detectedProjectType;
  if (!projectType && (!keyMilestones || keyMilestones.length === 0)) return null;
  const projTypeName = projectType ? lang === "ar" ? projectType.name_ar : projectType.name_en : null;
  const computeSlip = (a) => {
    if (!a.plannedFinish) return null;
    const refDate = a.actualFinish || a.forecastFinish;
    if (!refDate) return null;
    return Math.round((new Date(refDate) - new Date(a.plannedFinish)) / 864e5);
  };
  const fmtDate = (d) => d ? String(d).split("T")[0] : "\u2014";
  const toggleCat = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  return /* @__PURE__ */ React.createElement(React.Fragment, null,
    showTypeModal && /* @__PURE__ */ React.createElement(ProjectTypeSelectorModal, {
      currentType: projectType,
      detectedType: detectedProjectType,
      lang,
      t,
      onSelect: (newType) => {
        setOverrideType(newType);
        setShowTypeModal(false);
      },
      onClose: () => setShowTypeModal(false)
    }),
  /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--bgCard)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    boxShadow: "0 0 22px rgba(56,189,248,0.06)"
  } }, !hideBanner && projectType && /* @__PURE__ */ React.createElement("div", { style: {
    // Big bold gradient banner that immediately tells you what this project is
    background: `linear-gradient(135deg, ${((_a = projectType.palette) == null ? void 0 : _a.from) || "#0ea5e9"}, ${((_b = projectType.palette) == null ? void 0 : _b.to) || "#8b5cf6"})`,
    borderRadius: 12,
    padding: "18px 22px",
    marginBottom: 16,
    position: "relative",
    overflow: "hidden",
    boxShadow: `0 4px 20px ${((_c = projectType.palette) == null ? void 0 : _c.glow) || "rgba(14,165,233,0.25)"}`
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: 0,
    insetInlineEnd: 0,
    width: 200,
    height: "100%",
    background: "linear-gradient(135deg, transparent, rgba(255,255,255,0.08))",
    pointerEvents: "none"
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    gap: 18,
    position: "relative",
    flexWrap: "wrap"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 56,
    lineHeight: 1,
    filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))",
    flexShrink: 0
  } }, projectType.icon), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 200 } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 10,
    fontWeight: 700,
    color: "rgba(255,255,255,0.78)",
    fontFamily: "'JetBrains Mono',monospace",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    marginBottom: 6
  } }, lang === "ar" ? "\u0646\u0648\u0639 \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u0627\u0644\u0645\u0643\u062A\u0634\u0641" : "Detected Project Type"), /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: "clamp(20px, 3vw, 26px)",
    fontWeight: 800,
    color: "#fff",
    lineHeight: 1.2,
    letterSpacing: "-0.01em",
    textShadow: "0 1px 3px rgba(0,0,0,0.2)"
  } }, lang === "ar" ? projectType.name_ar : projectType.name_en)), /* @__PURE__ */ React.createElement("div", { style: {
    background: "rgba(0,0,0,0.22)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: 10,
    padding: "8px 14px",
    textAlign: "center",
    flexShrink: 0,
    backdropFilter: "blur(4px)"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 9,
    color: "rgba(255,255,255,0.75)",
    fontFamily: "'JetBrains Mono',monospace",
    letterSpacing: "0.08em",
    marginBottom: 2
  } }, lang === "ar" ? "\u062B\u0642\u0629" : "CONFIDENCE"), /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 22,
    fontWeight: 800,
    color: ((_d = projectType.palette) == null ? void 0 : _d.accent) || "#fff",
    fontFamily: "'JetBrains Mono',monospace",
    lineHeight: 1
  } }, projectType.score)), /* @__PURE__ */ React.createElement("button", {
    onClick: () => setShowTypeModal(true),
    style: {
      background: "rgba(255,255,255,0.18)",
      border: "1px solid rgba(255,255,255,0.35)",
      color: "#fff",
      borderRadius: 8,
      padding: "6px 12px",
      cursor: "pointer",
      fontSize: 10,
      fontWeight: 700,
      fontFamily: "'JetBrains Mono',monospace",
      letterSpacing: "0.05em",
      flexShrink: 0,
      backdropFilter: "blur(4px)",
      whiteSpace: "nowrap"
    },
    title: lang === "ar" ? "\u062a\u063a\u064a\u064a\u0631 \u0646\u0648\u0639 \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u064a\u062f\u0648\u064a\u0627\u064b" : "Change project type manually"
  }, "\u270F\uFE0F " + t.changeTypeBtn)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 16,
    fontWeight: 700,
    color: "var(--textPrimary)"
  } }, t.keyMilestonesTitle)), /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 11,
    color: "var(--textMuted)",
    marginBottom: 14
  } }, t.keyMilestonesSub), (!keyMilestones || keyMilestones.length === 0) && /* @__PURE__ */ React.createElement("div", { style: {
    padding: "14px 16px",
    background: "var(--bgPanel)",
    border: "1px dashed var(--border)",
    borderRadius: 10,
    color: "var(--textMuted)",
    fontSize: 12,
    textAlign: "center"
  } }, t.keyMilestonesNone), keyMilestones && keyMilestones.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 10 } }, keyMilestones.map((cat) => {
    const best = cat.activities[0];
    if (!best) return null;
    const slip = computeSlip(best);
    const slipColor = slip === null ? "var(--textDim)" : slip > 7 ? "#f43f5e" : slip > 0 ? "#fb923c" : slip < -7 ? "#22c55e" : "var(--textSecondary)";
    const isExpanded = expanded[cat.categoryKey];
    const hasMore = cat.activities.length > 1;
    const label = lang === "ar" ? cat.label_ar : cat.label_en;
    return /* @__PURE__ */ React.createElement("div", { key: cat.categoryKey, style: {
      background: "var(--bgPanel)",
      border: "1px solid var(--border)",
      borderRadius: 10,
      padding: "12px 14px",
      position: "relative",
      overflow: "hidden"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      insetInlineStart: 0,
      top: 0,
      bottom: 0,
      width: 3,
      background: cat.priority >= 90 ? "#22c55e" : cat.priority >= 70 ? "#38bdf8" : cat.priority >= 50 ? "#a78bfa" : "#64748b"
    } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8, paddingInlineStart: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 18 } }, cat.icon), /* @__PURE__ */ React.createElement("span", { style: {
      fontSize: 11,
      fontWeight: 700,
      color: "var(--textPrimary)",
      flex: 1,
      lineHeight: 1.3
    } }, label), hasMore && /* @__PURE__ */ React.createElement("button", { onClick: () => toggleCat(cat.categoryKey), style: {
      background: "transparent",
      border: "1px solid var(--border)",
      borderRadius: 5,
      padding: "2px 7px",
      color: "var(--textMuted)",
      fontSize: 9,
      cursor: "pointer",
      fontFamily: "'JetBrains Mono',monospace"
    } }, isExpanded ? "\u2212" : `+${cat.activities.length - 1}`)), /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 10,
      color: "var(--textSecondary)",
      fontFamily: "'JetBrains Mono',monospace",
      marginBottom: 8,
      paddingInlineStart: 6,
      lineHeight: 1.4,
      wordBreak: "break-word"
    } }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--textDim)" } }, best.actId), " \xB7 ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--textSecondary)" } }, best.name)), /* @__PURE__ */ React.createElement("div", { style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 6,
      paddingInlineStart: 6
    } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8, color: "var(--textFaint)", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.05em", marginBottom: 2 } }, t.keyMsBaseline), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "#38bdf8", fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" } }, fmtDate(best.plannedFinish))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8, color: "var(--textFaint)", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.05em", marginBottom: 2 } }, best.actualFinish ? t.keyMsActual : t.keyMsForecast), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: best.actualFinish ? "#22c55e" : "#a78bfa", fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" } }, fmtDate(best.actualFinish || best.forecastFinish))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8, color: "var(--textFaint)", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.05em", marginBottom: 2 } }, lang === "ar" ? "\u0627\u0644\u0627\u0646\u0632\u0644\u0627\u0642" : "Slip"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: slipColor, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" } }, slip === null ? "\u2014" : slip > 0 ? `+${slip}d` : `${slip}d`))), isExpanded && hasMore && /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: 10,
      paddingTop: 10,
      paddingInlineStart: 6,
      borderTop: "1px dashed var(--border)",
      display: "flex",
      flexDirection: "column",
      gap: 6
    } }, cat.activities.slice(1).map((a, i) => {
      const aSlip = computeSlip(a);
      const aSlipColor = aSlip === null ? "var(--textDim)" : aSlip > 7 ? "#f43f5e" : aSlip > 0 ? "#fb923c" : aSlip < -7 ? "#22c55e" : "var(--textSecondary)";
      return /* @__PURE__ */ React.createElement("div", { key: i, style: {
        fontSize: 10,
        fontFamily: "'JetBrains Mono',monospace",
        color: "var(--textMuted)",
        lineHeight: 1.5,
        display: "flex",
        justifyContent: "space-between",
        gap: 8
      } }, /* @__PURE__ */ React.createElement("span", { style: { flex: 1, wordBreak: "break-word" } }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--textDim)" } }, a.actId), " \xB7 ", /* @__PURE__ */ React.createElement("span", null, a.name)), /* @__PURE__ */ React.createElement("span", { style: { whiteSpace: "nowrap" } }, /* @__PURE__ */ React.createElement("span", { style: { color: "#38bdf8" } }, fmtDate(a.plannedFinish)), (a.actualFinish || a.forecastFinish) && /* @__PURE__ */ React.createElement(React.Fragment, null, " \u2192 ", /* @__PURE__ */ React.createElement("span", { style: { color: aSlipColor, fontWeight: 700 } }, aSlip === null ? "" : aSlip > 0 ? `+${aSlip}d` : `${aSlip}d`))));
    })));
  })))));
}
function ExecutiveDashboard({ result, activeMethod, setActiveMethod, onAuditBaseline }) {
  var _a, _b;
  const { t, m, lang } = useLang();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  // FIX v29.0.9.1: Lifted overrideType state from ProjectTypeBanner & KeyMilestonesPanel
  // so changes propagate to BOTH components AND can affect ng_matrix recommendation
  const [overrideType, setOverrideType] = useState(null);
  // v29.0.9.1: Phase template selector — defaults to "discover" (auto-detect from schedule)
  const [phaseTemplate, setPhaseTemplate] = useState("discover");
  const { rows: _rawRows = [], summary: s = {}, blProj = {}, prProj = {}, origProj, methodResults: _baseMethodResults, timeline = {}, milestoneRows = [], wbsBreakdown = [], wbsMeta = {}, integrityIssues = [], integrityScore = 100, projectType: detectedProjectType = null, keyMilestones = [], isNGProject: _baseIsNG, ngMatrixColumn: _baseNGCol, ngTypeName: _baseNGTypeName, recommended: _baseRecommended,
    // v29.0.9.1 NEW
    phaseDiscovery = null, milestoneCompliance = [], ngCompliance = null, recoveryTrigger = null, filenameValidation = null, filenameValidations = null, preCommCompliance = []
  } = result;
  // v29.0.9.1: Resolve final phase template (discover → use detection result)
  const resolvedPhases = resolvePhaseTemplate(phaseTemplate, phaseDiscovery);
  // Effective project type considering user override
  const projectType = overrideType !== undefined && overrideType !== null
    ? (overrideType === "auto" ? detectedProjectType : overrideType)
    : detectedProjectType;
  // FIX v29.0.9.1: Recompute ng_matrix locally when user overrides project type
  // (The original analyze() result is fixed - we need fresh ng_matrix for the new type)
  const userOverrideActive = overrideType && overrideType !== "auto" && overrideType !== detectedProjectType;
  const effectiveNGCol = userOverrideActive ? getNGMatrixColumn(projectType && projectType.key) : _baseNGCol;
  const effectiveIsNG = userOverrideActive ? isNGProjectType(projectType && projectType.key) : _baseIsNG;
  // Recompute ng_matrix method only if override changes the NG column
  let methodResults = _baseMethodResults;
  let recommended = _baseRecommended;
  if (userOverrideActive && effectiveNGCol && effectiveNGCol !== _baseNGCol && _rawRows.length > 0) {
    const wbsMap = (result.refBL && result.refBL.wbsMap) || (result.blProj && result.blProj.wbsMap) || {};
    const _getWbsName = (a) => {
      if (!a || !a.wbsId) return null;
      const w = wbsMap[a.wbsId];
      return w ? (w.name || w.code || null) : null;
    };
    // v29.0.10 (Phase 2.2): Inline LOE detection (helper from analyze() not in scope here)
    const _isLOE = (a) => {
      if (!a) return false;
      const t = (a.type || a.activityType || "").toString().toLowerCase();
      return t === "level of effort" || t === "loe" || t === "tt_loe" ||
             t.includes("level of effort") || t.includes("level_of_effort");
    };
    const evmFiltered = _rawRows.filter((r2) => !r2.isMilestone && !r2.isSummary && !_isLOE(r2._raw));
    const wfn = (a) => getNGMatrixWeight((a && (a.name || a.actName)) || "", effectiveNGCol, _getWbsName(a));
    const valid = evmFiltered.filter((r2) => wfn(r2._raw) > 0);
    const tw = valid.reduce((s2, r2) => s2 + wfn(r2._raw), 0);
    if (tw > 0) {
      const planned = valid.reduce((s2, r2) => s2 + wfn(r2._raw) * r2.plannedPct, 0) / tw;
      const actual = valid.reduce((s2, r2) => s2 + wfn(r2._raw) * r2.actualPct, 0) / tw;
      let originalPlanned = null;
      const vo = valid.filter((r2) => r2.originalPlannedPct !== null && r2.originalPlannedPct !== void 0);
      if (vo.length > 0) {
        const tvo = vo.reduce((s2, r2) => s2 + wfn(r2._raw), 0);
        if (tvo > 0) originalPlanned = vo.reduce((s2, r2) => s2 + wfn(r2._raw) * r2.originalPlannedPct, 0) / tvo;
      }
      // Build new methodResults with refreshed ng_matrix
      methodResults = Object.assign({}, _baseMethodResults, {
        ng_matrix: Object.assign({}, _baseMethodResults.ng_matrix || {}, {
          available: true,
          planned: +planned.toFixed(2),
          actual: +actual.toFixed(2),
          variance: +(actual - planned).toFixed(2),
          originalPlanned: originalPlanned !== null ? +originalPlanned.toFixed(2) : null,
          totalWeight: +tw.toFixed(2),
          validCount: valid.length
        })
      });
      // Recompute recommended (NG types prefer ng_matrix when available)
      if (effectiveIsNG) recommended = "ng_matrix";
    }
  }
  // Restore "rows" alias for downstream code
  const rows = _rawRows;
  const r = methodResults[activeMethod];
  if (!(r == null ? void 0 : r.available)) return null;
  // v28.22: SMART certificate detection
  // Filters out internal sub-activities (e.g. "TCC Test - Pump", "Pre-TCC Inspection")
  // Only returns true certificate milestones via 3 layers of filtering:
  //   Layer 1: Prefer milestones (P6 milestone type OR plannedDuration === 0)
  //   Layer 2: Reasonable name length (≤ 80 chars - real certs are concise)
  //   Layer 3: Optionally boost activities containing "Certificate" / "Achievement" / "Issuance"
  const findCertByRegex = (regexList) => {
    const allMatches = [];
    // v29.0.10: Negative context patterns — words that indicate NOT a real certificate
    // Examples to reject: "PAC Walkdown", "TCC Test Plan", "Pre-PAC Activities",
    //                     "FAC Preparation Meeting", "PAC Submission", etc.
    const negativeContext = /\b(walkdown|meeting|preparation|test\s*plan|submission|review|kick.?off|pre\s*[-]?\s*\w+|interim|partial|draft|proposed|tentative|workshop|training|presentation|kickoff)\b/i;
    const negativeContextAr = /(\u0627\u062c\u062a\u0645\u0627\u0639|\u062a\u062d\u0636\u064a\u0631|\u0645\u0631\u0627\u062c\u0639\u0629|\u0645\u0633\u0648\u062f\u0629|\u0645\u0642\u062a\u0631\u062d|\u0623\u0648\u0644\u064a|\u0648\u0631\u0634\u0629|\u0639\u0631\u0636|\u062a\u062f\u0631\u064a\u0628)/;
    for (const row of rows) {
      const haystack = (row.name || "") + " " + (row.actId || "");
      let matched = false;
      for (const re of regexList) {
        if (re.test(haystack)) { matched = true; break; }
      }
      if (!matched) continue;

      // ─── LAYER 1: Must be a milestone (or zero-duration activity) ───
      const isMilestone = row.isMilestone === true ||
                          (row.type && row.type.toLowerCase().includes("milestone")) ||
                          row.plannedDuration === 0 || row.plannedDuration === "0";

      // ─── LAYER 2: Name length filter (real certs are concise) ───
      const name = row.name || "";
      const isReasonableLength = name.length <= 80;

      // ─── LAYER 3: Boost score if explicit cert keywords ───
      const hasCertKeyword = /\b(certificate|achievement|achieved|issuance|issued|granted|signed)\b/i.test(name) ||
                             /\u0634\u0647\u0627\u062f\u0629|\u0625\u062f\u0627\u0631\u0629|\u0625\u0635\u062f\u0627\u0631/.test(name);

      // ─── LAYER 4 (v29.0.10): NEGATIVE CONTEXT FILTER ───
      // Reject if the name contains words like "walkdown/meeting/test plan" UNLESS
      // it ALSO has an explicit cert keyword. This filters preparation/internal activities.