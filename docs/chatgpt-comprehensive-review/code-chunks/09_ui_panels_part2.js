// ═══════════════════════════════════════════════════════════════
// 09_ui_panels_part2.js
// ExecutiveDashboard + EVM tab + UI components (~lines 16450-17500)
// Lines: 16451 - 17500 (1050 lines, 61,746 bytes)
// Source: p6-analyzer.html (v29.0.11.2)
// ═══════════════════════════════════════════════════════════════

      const hasNegative = negativeContext.test(name) || negativeContextAr.test(name);
      if (hasNegative && !hasCertKeyword) continue;

      // STRICT: Require milestone OR (reasonable length AND cert keyword)
      // This filters out 137 internal "TCC test" activities while keeping real "TCC Unit 1" milestones
      if (!isMilestone && !hasCertKeyword) continue;
      if (!isReasonableLength) continue;

      const date = row.plannedFinish || row.plannedStart || row.forecastFinish;
      if (date) {
        allMatches.push({
          actId: row.actId,
          name: row.name,
          date: date,
          dateMs: new Date(date).getTime(),
          isMilestone: isMilestone,
          hasCertKeyword: hasCertKeyword
        });
      }
    }
    if (allMatches.length === 0) return null;
    // Sort by date ascending
    allMatches.sort((a, b) => a.dateMs - b.dateMs);
    // Pick LATEST match (last unit's certificate = full project completion)
    const latest = allMatches[allMatches.length - 1];
    return {
      actId: latest.actId,
      name: latest.name,
      date: latest.date,
      count: allMatches.length,
      allMatches: allMatches
    };
  };
  // Word-boundary regex avoids false positives like "fac" inside "Facility"
  const certPAC = findCertByRegex([
    /\bPAC\b/i,
    /\bPreliminary\s+Acceptance/i,
    /\bProvisional\s+Acceptance/i
  ]);
  const certTCC = findCertByRegex([
    /\bTCC\b/i,
    /\bTechnical\s+Completion/i,
    /\bTests?\s+on\s+Completion/i,
    /\bMechanical\s+Completion/i
  ]);
  const certFAC = findCertByRegex([
    /\bFAC\b/i,
    /\bFinal\s+Acceptance/i
  ]);
  // v28.11: RTR (Reliability Test Run)
  const certRTR = findCertByRegex([
    /\bRTR\b/i,
    /\bReliability\s+Test\s+Run\b/i,
    /\bReliability\s+Run\b/i,
    /\bReliability\s+Test\b/i,
    /\bPerformance\s+Test\s+Run\b/i,
    /\u0627\u062e\u062a\u0628\u0627\u0631 \u0627\u0644\u0645\u0648\u062b\u0648\u0642\u064a\u0629/,
    /\u062a\u0634\u063a\u064a\u0644 \u062a\u062c\u0631\u064a\u0628\u064a/
  ]);
  // v29.0.10: EHC — Energization & Holding Commissioning (mandatory NG SA cert)
  const certEHC = findCertByRegex([
    /\bEHC\b/i,
    /\bEnergi[sz]ation\s*(?:&|and)?\s*Holding\s*Commissioning\b/i,
    /\bHolding\s*Commissioning\s*(?:Certificate|Completion)?\b/i,
    /\u0634\u0647\u0627\u062f\u0629\s+(?:\u0625\u062f\u062e\u0627\u0644\s+\u0627\u0644\u0637\u0627\u0642\u0629|\u0627\u0644\u0625\u062d\u0645\u0627\u0621|\u0627\u0644\u062a\u0634\u063a\u064a\u0644\s+\u0627\u0644\u062a\u062d\u0636\u064a\u0631\u064a)/,
    /\u0634\u0647\u0627\u062f\u0629\s+\u0627\u0644\u0637\u0627\u0642\u0629\s+\u0648(?:\u0627\u0644)?\u062a\u0634\u063a\u064a\u0644\s+\u0627\u0644\u062a\u062d\u0636\u064a\u0631\u064a/
  ]);
  // v29.0.10: ECC — Equipment Commercial Commissioning (mandatory NG SA cert)
  const certECC = findCertByRegex([
    /\bECC\b/i,
    /\bEquipment\s+Commercial\s+Commissioning\b/i,
    /\bCommercial\s+Commissioning\s+(?:Certificate|Completion)\b/i,
    /\u0634\u0647\u0627\u062f\u0629\s+\u0627\u0644\u062a\u0634\u063a\u064a\u0644\s+\u0627\u0644\u062a\u062c\u0627\u0631\u064a(?:\s+\u0644\u0644\u0645\u0639\u062f\u0627\u062a)?/,
    /\u0634\u0647\u0627\u062f\u0629\s+\u0627\u0644\u0627\u0633\u062a\u0644\u0627\u0645\s+\u0627\u0644\u062a\u062c\u0627\u0631\u064a/
  ]);
  // v29.0.11.2 (Gemini Round 8 — G1+G2 fix): NG SA Certificate Sequence Validation
  // Validates that certificates appear in correct chronological order:
  //   RTR -> EHC/ECC -> TCC -> PAC -> FAC
  // Critical for SEC contract compliance — out-of-order dates are major red flags
  const validateCertificateSequence = () => {
    const violations = [];
    const certs = {
      RTR: certRTR ? new Date(certRTR.date) : null,
      EHC: certEHC ? new Date(certEHC.date) : null,
      ECC: certECC ? new Date(certECC.date) : null,
      TCC: certTCC ? new Date(certTCC.date) : null,
      PAC: certPAC ? new Date(certPAC.date) : null,
      FAC: certFAC ? new Date(certFAC.date) : null
    };
    Object.keys(certs).forEach(k => {
      if (certs[k] && isNaN(certs[k].getTime())) certs[k] = null;
    });
    const checkPair = (earlier, later) => {
      if (certs[earlier] && certs[later] && certs[earlier] > certs[later]) {
        violations.push({
          rule: earlier + " -> " + later,
          earlierName: earlier,
          earlierDate: certs[earlier].toISOString().slice(0, 10),
          laterName: later,
          laterDate: certs[later].toISOString().slice(0, 10),
          desc_en: earlier + " (" + certs[earlier].toISOString().slice(0,10) + ") must come before " + later + " (" + certs[later].toISOString().slice(0,10) + ")",
          desc_ar: "\u064a\u062c\u0628 \u0623\u0646 \u062a\u0633\u0628\u0642 " + earlier + " \u0634\u0647\u0627\u062f\u0629 " + later
        });
      }
    };
    checkPair("RTR", "EHC");
    checkPair("RTR", "ECC");
    checkPair("RTR", "TCC");
    checkPair("RTR", "PAC");
    checkPair("RTR", "FAC");
    checkPair("EHC", "TCC");
    checkPair("ECC", "TCC");
    checkPair("TCC", "PAC");
    checkPair("PAC", "FAC");
    checkPair("EHC", "PAC");
    checkPair("ECC", "PAC");
    checkPair("EHC", "FAC");
    checkPair("ECC", "FAC");
    return {
      isValid: violations.length === 0,
      violations: violations,
      checkedCerts: Object.keys(certs).filter(k => certs[k] !== null),
      missingCerts: Object.keys(certs).filter(k => certs[k] === null)
    };
  };
  const certSequenceValidation = validateCertificateSequence();
  // Project duration computed from blProj
  // v28.12: Robust project Start/Finish extraction with fallback to activities
  const computeProjectDates = () => {
    let startDate = null, finishDate = null;
    // Priority 1: from blProj
    if (blProj.start) {
      const d = new Date(blProj.start);
      if (!isNaN(d)) startDate = d;
    }
    if (blProj.finish) {
      const d = new Date(blProj.finish);
      if (!isNaN(d)) finishDate = d;
    }
    // Priority 2: fallback to prProj if blProj missing
    if (!startDate && prProj.start) {
      const d = new Date(prProj.start);
      if (!isNaN(d)) startDate = d;
    }
    if (!finishDate && prProj.finish) {
      const d = new Date(prProj.finish);
      if (!isNaN(d)) finishDate = d;
    }
    // Priority 3: fallback to min/max of all activity dates from rows
    if ((!startDate || !finishDate) && rows && rows.length > 0) {
      let minStart = Infinity, maxFinish = 0;
      for (const row of rows) {
        if (row.plannedStart) {
          const t = new Date(row.plannedStart).getTime();
          if (t > 0 && t < minStart) minStart = t;
        }
        const finishCandidate = row.plannedFinish || row.forecastFinish;
        if (finishCandidate) {
          const t = new Date(finishCandidate).getTime();
          if (t > maxFinish) maxFinish = t;
        }
      }
      if (!startDate && minStart < Infinity) startDate = new Date(minStart);
      if (!finishDate && maxFinish > 0) finishDate = new Date(maxFinish);
    }
    return { startDate, finishDate };
  };
  const __pd = computeProjectDates();
  const projStartDate = __pd.startDate;
  const projFinishDate = __pd.finishDate;
  // v28.13.1: ISO string versions safe for fmtD() which expects strings
  const projStartStr = projStartDate ? projStartDate.toISOString() : null;
  const projFinishStr = projFinishDate ? projFinishDate.toISOString() : null;
  const projDuration = (() => {
    if (!projStartDate || !projFinishDate) return null;
    if (projFinishDate < projStartDate) return null;
    const days = Math.round((projFinishDate - projStartDate) / 86400000);
    const months = Math.round(days / 30.44);
    const years = Math.round((days / 365.25) * 10) / 10;
    return { days, months, years };
  })();
  const handleExportPdf = () => {
    setPdfLoading(true);
    setPdfError(null);
    try {
      generateExecutivePDF({
        result,
        activeMethod,
        lang,
        t,
        m,
        logoUrl: typeof LOGO_URL !== "undefined" ? LOGO_URL : null
      });
      setTimeout(() => setPdfLoading(false), 600);
    } catch (e) {
      console.error("PDF generation failed:", e);
      setPdfError(e.message || "Failed to generate PDF");
      setPdfLoading(false);
    }
  };
  const status = r.variance >= -1 ? r.variance > 1 ? { txt: t.execStatus.ahead, c: "#22c55e", bg: "linear-gradient(135deg,#022c22,#064e3b)" } : { txt: t.execStatus.ontrack, c: "#22c55e", bg: "linear-gradient(135deg,#022c22,#064e3b)" } : r.variance >= -10 ? { txt: t.execStatus.behind, c: "#fb923c", bg: "linear-gradient(135deg,#1c1917,#7c2d12)" } : { txt: t.execStatus.critical, c: "#f43f5e", bg: "linear-gradient(135deg,#1a0505,#450a0a)" };
  const md = m[activeMethod];
  // FIX v29.0.9.1: Build candidates list from ALL XER sources (Original/Baseline/Progress)
  // If multiple distinct names exist → render as dropdown so user can pick which one to display
  const _nameCandidates = [];
  const _seen = new Set();
  const _addCand = (name, sourceLabel) => {
    if (!name || typeof name !== "string") return;
    const trimmed = name.trim();
    if (!trimmed) return;
    const key = trimmed.toLowerCase();
    if (_seen.has(key)) return;
    _seen.add(key);
    _nameCandidates.push({ name: trimmed, source: sourceLabel });
  };
  _addCand(blProj && blProj.name, lang === "ar" ? "خط الأساس" : "Baseline");
  _addCand(prProj && prProj.name, lang === "ar" ? "التحديث" : "Progress");
  _addCand(origProj && origProj.name, lang === "ar" ? "الخطة الأصلية" : "Original");
  const _defaultProjectName = (_nameCandidates[0] && _nameCandidates[0].name) || (lang === "ar" ? "\u0645\u0634\u0631\u0648\u0639 \u0628\u062F\u0648\u0646 \u0627\u0633\u0645" : "Untitled Project");
  const [selectedProjectName, setSelectedProjectName] = useState(_defaultProjectName);
  // Re-sync if candidates changed (e.g., new file loaded) and current selection no longer valid
  React.useEffect(() => {
    if (_nameCandidates.length > 0 && !_nameCandidates.some(c => c.name === selectedProjectName)) {
      setSelectedProjectName(_defaultProjectName);
    }
  }, [_nameCandidates.map(c => c.name).join("|")]);
  const projectName = selectedProjectName;
  const hasMultipleNames = _nameCandidates.length > 1;

  // ═══════════════════════════════════════════════════════════════════
  // v29.0.9.1: BRIEFING CARD + ACTION BUTTONS — extracted unit
  // Contains: Progress Performance + Project Schedule Timeline + buttons
  // Moved to render BEFORE PROJECT PHASES per user request
  // ═══════════════════════════════════════════════════════════════════
  const _card_BriefingAndButtons = /* @__PURE__ */ React.createElement(React.Fragment, null,
  // v28.10: PROFESSIONAL EXECUTIVE BRIEFING CARD
  // Inspired by Bechtel/Fluor/Worley/AECOM consulting reports
  // ═══════════════════════════════════════════════════════════════════
  /* @__PURE__ */ React.createElement("div", {
    style: {
      background: "linear-gradient(180deg, var(--bgCard) 0%, var(--bg) 100%)",
      border: "1px solid #1e293b",
      borderRadius: 16,
      padding: "0",
      marginBottom: 20,
      overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
    }
  },
    // ─── SECTION 2: PROGRESS PERFORMANCE (v28.16: 3D Centered Design) ──
    /* @__PURE__ */ React.createElement("div", {
      style: {
        background: "linear-gradient(135deg, rgba(34,197,94,0.03) 0%, rgba(168,85,247,0.03) 100%)",
        padding: "20px 24px"
      }
    },
      // Section Title
      /* @__PURE__ */ React.createElement("div", {
        style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }
      },
        /* @__PURE__ */ React.createElement("div", {
          style: { width: 4, height: 18, background: "linear-gradient(180deg,#22c55e,#a78bfa)", borderRadius: 2 }
        }),
        /* @__PURE__ */ React.createElement("div", {
          style: {
            fontSize: 10, fontWeight: 700, color: "var(--textMuted)",
            fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.18em", textTransform: "uppercase"
          }
        }, lang === "ar" ? "\u0623\u062f\u0627\u0621 \u0627\u0644\u062a\u0642\u062f\u0651\u0645" : "Progress Performance")
      ),
      // v29.0.9.1: ── METHOD SELECTOR (Calculation Method) ──
      /* @__PURE__ */ React.createElement("div", {
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
          padding: "10px 16px",
          background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(56,189,248,0.04))",
          border: "1px solid rgba(16,185,129,0.25)",
          borderRadius: 10,
          flexWrap: "wrap"
        }
      },
        /* @__PURE__ */ React.createElement("div", {
          style: {
            fontSize: 18, fontWeight: 700, color: "#10b981",
            fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.08em"
          }
        }, lang === "ar" ? "\u{1F4D0} \u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062D\u0633\u0627\u0628:" : "\u{1F4D0} CALCULATION METHOD:"),
        /* @__PURE__ */ React.createElement("select", {
          value: activeMethod,
          onChange: (e) => setActiveMethod && setActiveMethod(e.target.value),
          style: {
            background: "var(--bgInput)",
            color: "var(--textPrimary)",
            border: "1.5px solid #10b981",
            borderRadius: 6,
            padding: "8px 14px",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "'JetBrains Mono',monospace",
            cursor: "pointer",
            outline: "none",
            minWidth: 220
          }
        },
          Object.keys(METHODS_I18N.en).map((k) => {
            const md = m[k];
            const mr = methodResults[k];
            const isAvail = mr && mr.available;
            const isReco = result.recommended === k;
            return /* @__PURE__ */ React.createElement("option", {
              key: k, value: k, disabled: !isAvail
            }, `${md.icon} ${md.label} \u2014 ${md.formula}${isReco ? " \u2B50" : ""}${!isAvail ? " (N/A)" : ""}`);
          })
        ),
        // Show recommended badge if active method = recommended
        result.recommended === activeMethod && /* @__PURE__ */ React.createElement("div", {
          style: {
            fontSize: 11, fontWeight: 700, color: "#fff",
            background: "linear-gradient(90deg,#22c55e,#10b981)",
            padding: "5px 12px", borderRadius: 999,
            fontFamily: "'JetBrains Mono',monospace"
          }
        }, lang === "ar" ? "\u2B50 \u0645\u0648\u0635\u0649 \u0628\u0647\u0627" : "\u2B50 RECOMMENDED"),
        // NG project indicator
        result.isNGProject && result.ngTypeName && /* @__PURE__ */ React.createElement("div", {
          style: {
            fontSize: 11, fontWeight: 700, color: "#fff",
            background: "linear-gradient(90deg,#10b981,#059669)",
            padding: "5px 12px", borderRadius: 999,
            fontFamily: "'JetBrains Mono',monospace"
          }
        }, "\u26A1 NG ", lang === "ar" ? result.ngTypeName.ar : result.ngTypeName.en),
        // Show formula hint
        /* @__PURE__ */ React.createElement("div", {
          style: {
            fontSize: 12, color: "var(--textDim)",
            fontFamily: "'JetBrains Mono',monospace",
            paddingLeft: 10, borderLeft: "1px solid var(--border)"
          }
        }, m[activeMethod].formula)
      ),
      // ── Centered 3D-styled cards row ──
      /* @__PURE__ */ React.createElement("div", {
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
          gap: 16,
          flexWrap: "wrap"
        }
      },
        // v29.0.9.1: ── ORIGINAL PLANNED CARD (only if revised baseline exists) ──
        r.originalPlanned !== null && /* @__PURE__ */ React.createElement("div", {
          style: {
            background: "linear-gradient(145deg, rgba(251,146,60,0.18), rgba(234,88,12,0.06))",
            border: "1px solid #fb923c66",
            borderRadius: 16,
            padding: "18px 26px",
            minWidth: 240,
            textAlign: "center",
            position: "relative",
            boxShadow: "0 6px 20px rgba(251,146,60,0.18), 0 1px 0 rgba(255,255,255,0.05) inset, 0 -3px 10px rgba(234,88,12,0.15) inset",
            transform: "perspective(800px) rotateX(2deg)",
            transition: "transform 0.3s ease"
          }
        },
          // Label
          /* @__PURE__ */ React.createElement("div", {
            style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }
          },
            /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16 } }, "\u{1F4D9}"),
            /* @__PURE__ */ React.createElement("div", {
              style: {
                fontSize: 10, fontWeight: 700, color: "#fb923c",
                fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.18em", textTransform: "uppercase"
              }
            }, lang === "ar" ? "\u0627\u0644\u0623\u0635\u0644\u064A" : "Original Planned")
          ),
          // 3D Number
          /* @__PURE__ */ React.createElement("div", {
            style: { display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginBottom: 12 }
          },
            /* @__PURE__ */ React.createElement("span", {
              style: {
                fontSize: 56, fontWeight: 900, color: "#fb923c",
                fontFamily: "'JetBrains Mono',monospace", lineHeight: 1, letterSpacing: "-0.04em",
                textShadow: "0 1px 0 #ea580c, 0 2px 0 #c2410c, 0 3px 0 #9a3412, 0 4px 8px rgba(0,0,0,0.4), 0 0 22px rgba(251,146,60,0.5)"
              }
            }, r.originalPlanned.toFixed(1)),
            /* @__PURE__ */ React.createElement("span", {
              style: { fontSize: 24, fontWeight: 700, color: "#fb923c", opacity: 0.8 }
            }, "%")
          ),
          // Progress bar
          /* @__PURE__ */ React.createElement("div", {
            style: {
              height: 10, background: "rgba(0,0,0,0.4)", borderRadius: 999, overflow: "hidden",
              position: "relative",
              boxShadow: "0 1px 2px rgba(0,0,0,0.4) inset, 0 1px 0 rgba(255,255,255,0.05)"
            }
          },
            /* @__PURE__ */ React.createElement("div", {
              style: {
                width: r.originalPlanned + "%", height: "100%",
                background: "linear-gradient(180deg, #fb923c, #ea580c 50%, #c2410c)",
                borderRadius: 999, transition: "width 0.8s ease-out",
                boxShadow: "0 0 12px #fb923c99, 0 1px 0 rgba(255,255,255,0.2) inset"
              }
            })
          ),
          // Sub-label
          /* @__PURE__ */ React.createElement("div", {
            style: {
              marginTop: 8, fontSize: 9, color: "var(--textDim)",
              fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.1em"
            }
          }, lang === "ar" ? "\u062D\u0633\u0628 \u0627\u0644\u062E\u0637\u0629 \u0627\u0644\u0623\u0635\u0644\u064A\u0629" : "Per Original Baseline")
        ),
        // ── PLANNED CARD (3D) ──
        /* @__PURE__ */ React.createElement("div", {
          style: {
            background: "linear-gradient(145deg, rgba(56,189,248,0.18), rgba(14,165,233,0.06))",
            border: "1px solid #38bdf855",
            borderRadius: 16,
            padding: "18px 26px",
            minWidth: 240,
            textAlign: "center",
            position: "relative",
            // 3D effect: outer shadow + inner highlight
            boxShadow: "0 6px 20px rgba(56,189,248,0.18), 0 1px 0 rgba(255,255,255,0.05) inset, 0 -3px 10px rgba(14,165,233,0.15) inset",
            transform: "perspective(800px) rotateX(2deg)",
            transition: "transform 0.3s ease"
          }
        },
          // Label
          /* @__PURE__ */ React.createElement("div", {
            style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }
          },
            /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16 } }, "\u{1F4D8}"),
            /* @__PURE__ */ React.createElement("div", {
              style: {
                fontSize: 10, fontWeight: 700, color: "#38bdf8",
                fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.18em", textTransform: "uppercase"
              }
            }, r.originalPlanned !== null ? (lang === "ar" ? "\u0627\u0644\u0645\u0639\u062F\u0651\u0644" : "Revised Planned") : (lang === "ar" ? "\u0627\u0644\u0645\u062e\u0637\u0651\u0637" : "Planned"))
          ),
          // 3D Number with text shadow for depth
          /* @__PURE__ */ React.createElement("div", {
            style: { display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginBottom: 12 }
          },
            /* @__PURE__ */ React.createElement("span", {
              style: {
                fontSize: 56, fontWeight: 900, color: "#38bdf8",
                fontFamily: "'JetBrains Mono',monospace", lineHeight: 1, letterSpacing: "-0.04em",
                // 3D text effect via multiple shadows
                textShadow: "0 1px 0 #0ea5e9, 0 2px 0 #0284c7, 0 3px 0 #075985, 0 4px 8px rgba(0,0,0,0.4), 0 0 22px rgba(56,189,248,0.5)"
              }
            }, r.planned.toFixed(1)),
            /* @__PURE__ */ React.createElement("span", {
              style: { fontSize: 24, fontWeight: 700, color: "#38bdf8", opacity: 0.8 }
            }, "%")
          ),
          // Progress bar with 3D depth
          /* @__PURE__ */ React.createElement("div", {
            style: {
              height: 10, background: "rgba(0,0,0,0.4)", borderRadius: 999, overflow: "hidden",
              position: "relative",
              boxShadow: "0 1px 2px rgba(0,0,0,0.4) inset, 0 1px 0 rgba(255,255,255,0.05)"
            }
          },
            /* @__PURE__ */ React.createElement("div", {
              style: {
                width: r.planned + "%", height: "100%",
                background: "linear-gradient(180deg, #38bdf8, #0ea5e9 50%, #0284c7)",
                borderRadius: 999, transition: "width 0.8s ease-out",
                boxShadow: "0 0 12px #38bdf899, 0 1px 0 rgba(255,255,255,0.2) inset"
              }
            })
          )
        ),
        // ── VARIANCE CARD (3D) ──
        /* @__PURE__ */ React.createElement("div", {
          style: {
            background: r.variance >= 0
              ? "linear-gradient(145deg, rgba(34,197,94,0.18), rgba(22,163,74,0.06))"
              : "linear-gradient(145deg, rgba(244,63,94,0.18), rgba(220,38,38,0.06))",
            border: "1px solid " + (r.variance >= 0 ? "#22c55e66" : "#f43f5e66"),
            borderRadius: 16,
            padding: "16px 20px",
            minWidth: 140,
            textAlign: "center",
            alignSelf: "center",
            // 3D effect
            boxShadow: r.variance >= 0
              ? "0 6px 20px rgba(34,197,94,0.22), 0 1px 0 rgba(255,255,255,0.06) inset, 0 -3px 10px rgba(22,163,74,0.15) inset"
              : "0 6px 20px rgba(244,63,94,0.22), 0 1px 0 rgba(255,255,255,0.06) inset, 0 -3px 10px rgba(220,38,38,0.15) inset",
            transform: "perspective(800px) rotateX(2deg)"
          }
        },
          /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "var(--textFaint)", textTransform: "uppercase", letterSpacing: "0.18em", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, marginBottom: 6 } },
            lang === "ar" ? "\u0627\u0644\u0627\u0646\u062d\u0631\u0627\u0641" : "Variance"
          ),
          /* @__PURE__ */ React.createElement("div", {
            style: {
              fontSize: 26, fontWeight: 900,
              color: r.variance >= 0 ? "#22c55e" : "#f43f5e",
              fontFamily: "'JetBrains Mono',monospace",
              letterSpacing: "-0.03em", lineHeight: 1,
              textShadow: r.variance >= 0
                ? "0 1px 0 #16a34a, 0 2px 0 #15803d, 0 3px 6px rgba(0,0,0,0.35), 0 0 16px rgba(34,197,94,0.45)"
                : "0 1px 0 #dc2626, 0 2px 0 #b91c1c, 0 3px 6px rgba(0,0,0,0.35), 0 0 16px rgba(244,63,94,0.45)"
            }
          }, (r.variance >= 0 ? "+" : "") + r.variance.toFixed(2) + "%"),
          /* @__PURE__ */ React.createElement("div", {
            style: { fontSize: 10, color: r.variance >= 0 ? "#22c55e" : "#f43f5e", marginTop: 6, fontWeight: 700, letterSpacing: "0.05em" }
          },
            r.variance >= 0
              ? (lang === "ar" ? "\u25B2 \u0645\u062a\u0642\u062f\u0651\u0645" : "\u25B2 Ahead")
              : (lang === "ar" ? "\u25BC \u0645\u062a\u0623\u062e\u0651\u0631" : "\u25BC Behind")
          )
        ),
        // ── ACTUAL CARD (3D) ──
        /* @__PURE__ */ React.createElement("div", {
          style: {
            background: "linear-gradient(145deg, " + md.color + "33, " + md.color + "10)",
            border: "1px solid " + md.color + "55",
            borderRadius: 16,
            padding: "18px 26px",
            minWidth: 240,
            textAlign: "center",
            position: "relative",
            boxShadow: "0 6px 20px " + md.color + "30, 0 1px 0 rgba(255,255,255,0.05) inset, 0 -3px 10px " + md.color + "25 inset",
            transform: "perspective(800px) rotateX(2deg)"
          }
        },
          // Label
          /* @__PURE__ */ React.createElement("div", {
            style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }
          },
            /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16 } }, "\u2705"),
            /* @__PURE__ */ React.createElement("div", {
              style: {
                fontSize: 10, fontWeight: 700, color: md.color,
                fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.18em", textTransform: "uppercase"
              }
            }, lang === "ar" ? "\u0627\u0644\u0641\u0639\u0644\u064a" : "Actual")
          ),
          // 3D Number
          /* @__PURE__ */ React.createElement("div", {
            style: { display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginBottom: 12 }
          },
            /* @__PURE__ */ React.createElement("span", {
              style: {
                fontSize: 56, fontWeight: 900, color: md.color,
                fontFamily: "'JetBrains Mono',monospace", lineHeight: 1, letterSpacing: "-0.04em",
                textShadow: "0 1px 0 " + md.color + "cc, 0 2px 0 " + md.color + "99, 0 3px 0 " + md.color + "66, 0 4px 8px rgba(0,0,0,0.4), 0 0 22px " + md.color + "80"
              }
            }, r.actual.toFixed(1)),
            /* @__PURE__ */ React.createElement("span", {
              style: { fontSize: 24, fontWeight: 700, color: md.color, opacity: 0.8 }
            }, "%")
          ),
          // Progress bar with 3D depth
          /* @__PURE__ */ React.createElement("div", {
            style: {
              height: 10, background: "rgba(0,0,0,0.4)", borderRadius: 999, overflow: "hidden",
              position: "relative",
              boxShadow: "0 1px 2px rgba(0,0,0,0.4) inset, 0 1px 0 rgba(255,255,255,0.05)"
            }
          },
            /* @__PURE__ */ React.createElement("div", {
              style: {
                width: r.actual + "%", height: "100%",
                background: "linear-gradient(180deg, " + md.color + ", " + md.color + "dd 50%, " + md.color + "aa)",
                borderRadius: 999, transition: "width 0.8s ease-out",
                boxShadow: "0 0 12px " + md.color + "99, 0 1px 0 rgba(255,255,255,0.2) inset"
              }
            })
          )
        )
      )
    ),
    // ─── SECTION 1: SCHEDULE TIMELINE ───────────────────────────
    /* @__PURE__ */ React.createElement("div", {
      style: {
        background: "linear-gradient(135deg, rgba(56,189,248,0.04) 0%, rgba(167,139,250,0.04) 100%)",
        padding: "20px 24px 18px",
        borderBottom: "1px solid #1e293b22"
      }
    },
      // Section Title
      /* @__PURE__ */ React.createElement("div", {
        style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }
      },
        /* @__PURE__ */ React.createElement("div", {
          style: { width: 4, height: 18, background: "linear-gradient(180deg,#38bdf8,#a78bfa)", borderRadius: 2 }
        }),
        /* @__PURE__ */ React.createElement("div", {
          style: {
            fontSize: 10, fontWeight: 700, color: "var(--textMuted)",
            fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.18em", textTransform: "uppercase"
          }
        }, lang === "ar" ? "\u0627\u0644\u062c\u062f\u0648\u0644 \u0627\u0644\u0632\u0645\u0646\u064a \u0644\u0644\u0645\u0634\u0631\u0648\u0639" : "Project Schedule Timeline")
      ),
      // ── DURATION BAR (TOP - above timeline) - v28.14: Centered with 3 separate cards ──
      projDuration && /* @__PURE__ */ React.createElement("div", {
        style: { marginBottom: 22 }
      },
        // Title with horizontal line
        /* @__PURE__ */ React.createElement("div", {
          style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }
        },
          /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #fb923c44, #fb923c44)" } }),
          /* @__PURE__ */ React.createElement("div", {
            style: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }
          },
            /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16 } }, "\u23F1\uFE0F"),
            /* @__PURE__ */ React.createElement("div", {
              style: { fontSize: 10, color: "#fb923c", textTransform: "uppercase", letterSpacing: "0.18em", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }
            }, lang === "ar" ? "\u0627\u0644\u0645\u062f\u0651\u0629 \u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a\u0629" : "Total Duration")
          ),
          /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: 1, background: "linear-gradient(90deg, #fb923c44, #fb923c44, transparent)" } })
        ),
        // 3 separate cards centered
        /* @__PURE__ */ React.createElement("div", {
          style: { display: "flex", justifyContent: "center", alignItems: "stretch", gap: 14, flexWrap: "wrap" }
        },
          // Days Card
          /* @__PURE__ */ React.createElement("div", {
            style: {
              background: "linear-gradient(135deg, #fb923c12, #ea580c08)",
              border: "1px solid #fb923c44",
              borderRadius: 12,
              padding: "14px 28px",
              minWidth: 130,
              textAlign: "center",
              boxShadow: "0 2px 8px #fb923c11"
            }
          },
            /* @__PURE__ */ React.createElement("div", {
              style: { fontSize: 28, fontWeight: 900, color: "#fb923c", fontFamily: "'JetBrains Mono',monospace", lineHeight: 1, letterSpacing: "-0.03em" }
            }, projDuration.days.toLocaleString()),
            /* @__PURE__ */ React.createElement("div", {
              style: { fontSize: 10, color: "var(--textMuted)", marginTop: 6, textTransform: "uppercase", letterSpacing: "0.15em", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }
            }, lang === "ar" ? "\u064a\u0648\u0645" : "Days")
          ),
          // Months Card
          /* @__PURE__ */ React.createElement("div", {
            style: {
              background: "linear-gradient(135deg, #fb923c12, #ea580c08)",
              border: "1px solid #fb923c44",
              borderRadius: 12,
              padding: "14px 28px",
              minWidth: 130,
              textAlign: "center",
              boxShadow: "0 2px 8px #fb923c11"
            }
          },
            /* @__PURE__ */ React.createElement("div", {
              style: { fontSize: 28, fontWeight: 900, color: "#fb923c", fontFamily: "'JetBrains Mono',monospace", lineHeight: 1, letterSpacing: "-0.03em" }
            }, projDuration.months),
            /* @__PURE__ */ React.createElement("div", {
              style: { fontSize: 10, color: "var(--textMuted)", marginTop: 6, textTransform: "uppercase", letterSpacing: "0.15em", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }
            }, lang === "ar" ? "\u0634\u0647\u0631" : "Months")
          ),
          // Years Card
          /* @__PURE__ */ React.createElement("div", {
            style: {
              background: "linear-gradient(135deg, #fb923c12, #ea580c08)",
              border: "1px solid #fb923c44",
              borderRadius: 12,
              padding: "14px 28px",
              minWidth: 130,
              textAlign: "center",
              boxShadow: "0 2px 8px #fb923c11"
            }
          },
            /* @__PURE__ */ React.createElement("div", {
              style: { fontSize: 28, fontWeight: 900, color: "#fb923c", fontFamily: "'JetBrains Mono',monospace", lineHeight: 1, letterSpacing: "-0.03em" }
            }, projDuration.years),
            /* @__PURE__ */ React.createElement("div", {
              style: { fontSize: 10, color: "var(--textMuted)", marginTop: 6, textTransform: "uppercase", letterSpacing: "0.15em", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }
            }, lang === "ar" ? "\u0633\u0646\u0629" : "Years")
          )
        )
      ),
      // ── TIMELINE: Start → EHC → ECC → TCC → RTR → PAC → FAC → Finish ──
      // v29.0.10: EHC and ECC added to complete the 6-cert NG SA lifecycle
      // Build dynamic milestone list (omit certs not detected to keep clean layout)
      (() => {
        const milestones = [
          {
            type: "anchor", key: "start", label: lang === "ar" ? "\u0628\u062f\u0627\u064a\u0629" : "Start",
            color: "#22c55e", date: projStartStr, hasData: !!projStartStr
          }
        ];
        // EHC only shown if detected (Energization & Holding Commissioning)
        if (certEHC) {
          milestones.push({
            type: "cert", key: "ehc", badge: "EHC", subLabel: lang === "ar" ? "\u0625\u062f\u062e\u0627\u0644 \u0627\u0644\u0637\u0627\u0642\u0629" : "Energization",
            color: "#06b6d4", gradFrom: "#06b6d4", gradTo: "#0891b2",
            date: certEHC.date, hasData: true,
            count: certEHC.count,
            allMatches: certEHC.allMatches,
            tooltip: certEHC.actId + " \u00B7 " + certEHC.name + (certEHC.count > 1 ? "\n(+" + (certEHC.count - 1) + " more units)" : "")
          });
        }
        // ECC only shown if detected (Equipment Commercial Commissioning)
        if (certECC) {
          milestones.push({
            type: "cert", key: "ecc", badge: "ECC", subLabel: lang === "ar" ? "\u062a\u0634\u063a\u064a\u0644 \u062a\u062c\u0627\u0631\u064a" : "Commercial",
            color: "#8b5cf6", gradFrom: "#8b5cf6", gradTo: "#7c3aed",
            date: certECC.date, hasData: true,
            count: certECC.count,
            allMatches: certECC.allMatches,
            tooltip: certECC.actId + " \u00B7 " + certECC.name + (certECC.count > 1 ? "\n(+" + (certECC.count - 1) + " more units)" : "")
          });
        }
        milestones.push({
          type: "cert", key: "tcc", badge: "TCC", subLabel: lang === "ar" ? "\u0641\u0646\u064a" : "Technical",
          color: "#0ea5e9", gradFrom: "#0ea5e9", gradTo: "#0284c7",
          date: certTCC ? certTCC.date : null, hasData: !!certTCC,
          count: certTCC ? certTCC.count : 0,
          allMatches: certTCC ? certTCC.allMatches : [],
          tooltip: certTCC ? (certTCC.actId + " \u00B7 " + certTCC.name + (certTCC.count > 1 ? "\n(+" + (certTCC.count - 1) + " more units)" : "")) : ""
        });
        // RTR only shown if detected
        if (certRTR) {
          milestones.push({
            type: "cert", key: "rtr", badge: "RTR", subLabel: lang === "ar" ? "\u0627\u062e\u062a\u0628\u0627\u0631 \u0627\u0644\u0645\u0648\u062b\u0648\u0642\u064a\u0629" : "Reliability Test Run",
            color: "#f59e0b", gradFrom: "#f59e0b", gradTo: "#d97706",
            date: certRTR.date, hasData: true,
            count: certRTR.count,
            allMatches: certRTR.allMatches,
            tooltip: certRTR.actId + " \u00B7 " + certRTR.name + (certRTR.count > 1 ? "\n(+" + (certRTR.count - 1) + " more units)" : "")
          });
        }
        milestones.push(
          {
            type: "cert", key: "pac", badge: "PAC", subLabel: lang === "ar" ? "\u0627\u0628\u062a\u062f\u0627\u0626\u064a" : "Preliminary",
            color: "#22c55e", gradFrom: "#22c55e", gradTo: "#16a34a",
            date: certPAC ? certPAC.date : null, hasData: !!certPAC,
            count: certPAC ? certPAC.count : 0,
            allMatches: certPAC ? certPAC.allMatches : [],
            tooltip: certPAC ? (certPAC.actId + " \u00B7 " + certPAC.name + (certPAC.count > 1 ? "\n(+" + (certPAC.count - 1) + " more units)" : "")) : ""
          },
          {
            type: "cert", key: "fac", badge: "FAC", subLabel: lang === "ar" ? "\u0646\u0647\u0627\u0626\u064a" : "Final",
            color: "#a78bfa", gradFrom: "#a78bfa", gradTo: "#7c3aed",
            date: certFAC ? certFAC.date : null, hasData: !!certFAC,
            count: certFAC ? certFAC.count : 0,
            allMatches: certFAC ? certFAC.allMatches : [],
            tooltip: certFAC ? (certFAC.actId + " \u00B7 " + certFAC.name + (certFAC.count > 1 ? "\n(+" + (certFAC.count - 1) + " more units)" : "")) : ""
          },
          {
            type: "anchor", key: "finish", label: lang === "ar" ? "\u0646\u0647\u0627\u064a\u0629" : "Finish",
            color: "#ef4444", date: projFinishStr, hasData: !!projFinishStr
          }
        );
        const cols = milestones.map(() => "1fr").join(" ");
        return /* @__PURE__ */ React.createElement("div", {
          style: { display: "grid", gridTemplateColumns: cols, gap: 0, position: "relative", marginBottom: 12, paddingTop: 6 }
        },
          // ── 3D Connecting line (thicker with depth) ──
          /* @__PURE__ */ React.createElement("div", {
            style: {
              position: "absolute", top: 36,
              insetInlineStart: (100 / milestones.length / 2) + "%",
              insetInlineEnd: (100 / milestones.length / 2) + "%",
              height: 5,
              background: "linear-gradient(90deg, " + milestones.map(m => (m.hasData ? m.color : "#475569") + "cc").join(",") + ")",
              zIndex: 0, borderRadius: 3,
              // 3D effect: glow + inner shadow
              boxShadow: "0 0 14px rgba(56,189,248,0.35), 0 1px 2px rgba(0,0,0,0.3) inset, 0 1px 0 rgba(255,255,255,0.1)"
            }
          }),
          // ── Render milestones (3D + LARGER badges) ──
          milestones.map(m => {
            const dotColor = m.hasData ? m.color : "#475569";
            return /* @__PURE__ */ React.createElement("div", {
              key: m.key,
              style: { display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1 },
              title: m.tooltip || ""
            },
              // ── 3D Dot LARGER ──
              /* @__PURE__ */ React.createElement("div", {
                style: {
                  width: 28, height: 28, borderRadius: "50%",
                  background: m.hasData
                    ? "radial-gradient(circle at 30% 30%, " + dotColor + "ff, " + dotColor + "aa 60%, " + dotColor + "44)"
                    : "radial-gradient(circle at 30% 30%, #64748b, #475569 60%, #334155)",
                  border: "4px solid var(--bg)",
                  // 3D effect: outer glow + inner highlight
                  boxShadow: m.hasData
                    ? "0 0 0 3px " + dotColor + "55, 0 5px 14px " + dotColor + "77, 0 1px 3px rgba(255,255,255,0.35) inset"
                    : "0 0 0 3px #47556955, 0 5px 12px rgba(0,0,0,0.35), 0 1px 2px rgba(255,255,255,0.18) inset"
                }
              }),
              m.type === "anchor"
                ? /* @__PURE__ */ React.createElement("div", {
                    style: {
                      fontSize: 15, fontWeight: 800, color: m.color,
                      marginTop: 14, letterSpacing: "0.18em", textTransform: "uppercase",
                      fontFamily: "'JetBrains Mono',monospace",
                      // 3D text shadow for depth
                      textShadow: "0 1px 0 rgba(0,0,0,0.6), 0 2px 5px rgba(0,0,0,0.35), 0 0 10px " + m.color + "44"
                    }
                  }, m.label)
                : /* @__PURE__ */ React.createElement(React.Fragment, null,
                    // ── 3D Badge LARGER (TCC, RTR, PAC, FAC) with multi-unit badge ──
                    /* @__PURE__ */ React.createElement("div", {
                      style: { position: "relative", display: "inline-block", marginTop: 14 }
                    },
                      /* @__PURE__ */ React.createElement("div", {
                        style: {
                          fontSize: 16, fontWeight: 900, color: "#fff",
                          background: "linear-gradient(145deg," + m.gradFrom + "," + m.gradTo + ")",
                          padding: "6px 16px", borderRadius: 8,
                          letterSpacing: "0.14em",
                          fontFamily: "'JetBrains Mono',monospace",
                          // 3D effect on badge
                          boxShadow: "0 4px 10px " + m.gradFrom + "77, 0 1px 0 rgba(255,255,255,0.3) inset, 0 -1px 0 rgba(0,0,0,0.25) inset",
                          textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                          transform: "perspective(400px) rotateX(3deg)"
                        }
                      }, m.badge)
                    ),
                    /* @__PURE__ */ React.createElement("div", {
                      style: {
                        fontSize: 12, color: "var(--textMuted)", marginTop: 7,
                        textTransform: "uppercase", letterSpacing: "0.12em",
                        fontFamily: "'JetBrains Mono',monospace", fontWeight: 700
                      }
                    }, m.subLabel)
                  ),
              // ── Multi-unit list OR single date ──
              (m.type === "cert" && m.count > 1 && m.allMatches && m.allMatches.length > 1)
                ? /* @__PURE__ */ React.createElement("div", {
                    style: {
                      marginTop: 10,
                      display: "flex", flexDirection: "column", gap: 3,
                      background: "linear-gradient(145deg, " + m.color + "15, " + m.color + "05)",
                      border: "1px solid " + m.color + "44",
                      borderRadius: 8,
                      padding: "6px 8px",
                      minWidth: 110,
                      boxShadow: "0 2px 6px " + m.color + "22, 0 1px 0 rgba(255,255,255,0.05) inset"
                    }
                  },
                    m.allMatches.map((u, ui) => /* @__PURE__ */ React.createElement("div", {
                      key: "u_" + ui,
                      style: {
                        display: "flex", alignItems: "center", gap: 6,
                        fontFamily: "'JetBrains Mono',monospace"
                      },
                      title: (u.actId || "") + " \u2022 " + (u.name || "")
                    },
                      /* @__PURE__ */ React.createElement("div", {
                        style: {
                          background: m.color, color: "#fff",
                          fontSize: 9, fontWeight: 800,
                          padding: "1px 5px", borderRadius: 999,
                          minWidth: 20, textAlign: "center", lineHeight: 1.3,
                          boxShadow: "0 1px 2px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.2) inset"
                        }
                      }, "#" + (ui + 1)),
                      /* @__PURE__ */ React.createElement("div", {
                        style: {
                          fontSize: 12, fontWeight: 700, color: m.color,
                          letterSpacing: "-0.02em",
                          textShadow: "0 1px 0 rgba(0,0,0,0.4), 0 0 6px " + m.color + "33"
                        }
                      }, fmtD(u.date))
                    ))
                  )
                : /* @__PURE__ */ React.createElement("div", {
                style: {
                  fontSize: m.type === "anchor" ? 19 : 18,
                  fontWeight: m.type === "anchor" ? 900 : 800,
                  color: m.hasData ? m.color : "var(--textDim)",
                  fontFamily: "'JetBrains Mono',monospace",
                  marginTop: 10, letterSpacing: "-0.03em",
                  // 3D text shadow
                  textShadow: m.hasData
                    ? "0 1px 0 rgba(0,0,0,0.5), 0 2px 5px rgba(0,0,0,0.3), 0 0 16px " + m.color + "55"
                    : "0 1px 0 rgba(0,0,0,0.4)"
                }
              },
                m.hasData ? fmtD(m.date) : "\u2014"
              )
            );
          })
        );
      })()
    )
  ),
  /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", alignItems: "center", gap: 10, flexWrap: "wrap" }, className: "no-print" }, /* @__PURE__ */ React.createElement(
    PdfButton,
    {
      onClick: handleExportPdf,
      label: pdfLoading ? t.pdfGenerating : t.exportPdfBtn,
      loading: pdfLoading
    }
  ), /* @__PURE__ */ React.createElement("button", {
    onClick: () => window.print(),
    style: {
      background: "linear-gradient(135deg,#0ea5e9,#06b6d4)",
      color: "#fff",
      border: "none",
      borderRadius: 10,
      padding: "10px 16px",
      cursor: "pointer",
      fontSize: 12,
      fontWeight: 700,
      fontFamily: "'JetBrains Mono',monospace",
      boxShadow: "0 4px 14px rgba(14,165,233,0.3)",
      transition: "all 0.2s"
    },
    onMouseEnter: (e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(14,165,233,0.45)"; },
    onMouseLeave: (e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(14,165,233,0.3)"; }
  }, t.printScreenBtn), /* @__PURE__ */ React.createElement(
    EmailButton,
    {
      onClick: () => openEmailClient({ result, activeMethod, lang, t, m }),
      label: t.emailBtn,
      lang
    }
  ), onAuditBaseline && /* @__PURE__ */ React.createElement("button", {
    onClick: onAuditBaseline,
    style: {
      background: "linear-gradient(135deg,#22c55e,#16a34a)",
      color: "#fff",
      border: "none",
      borderRadius: 10,
      padding: "10px 16px",
      cursor: "pointer",
      fontSize: 12,
      fontWeight: 700,
      fontFamily: "'JetBrains Mono',monospace",
      boxShadow: "0 4px 12px #22c55e33"
    }
  }, t.auditFromExecBtn), pdfError && /* @__PURE__ */ React.createElement("span", { style: {
    color: "#fca5a5",
    fontSize: 10,
    fontFamily: "'JetBrains Mono',monospace",
    background: "#7f1d1d22",
    border: "1px solid #7f1d1d55",
    borderRadius: 6,
    padding: "4px 10px"
  } }, "\u26A0\uFE0F ", pdfError))
  );


  // ═══════════════════════════════════════════════════════════════════
  // v29.0.9: REFACTORED CARDS — extracted from giant inline block
  // Each card is a separate React element for easy reordering/editing
  // ═══════════════════════════════════════════════════════════════════
  const _card_DetectedType = /* @__PURE__ */ React.createElement(KeyMilestonesPanel, { projectType: detectedProjectType, keyMilestones, lang, t, hideBanner: true, overrideType, setOverrideType });
  const _card_Integrity = /* @__PURE__ */ React.createElement(IntegrityAlert, { integrityIssues, integrityScore });
  const _card_ExecStatus = /* @__PURE__ */ React.createElement("div", { style: { background: status.bg, border: `2px solid ${status.c}66`, borderRadius: 14, padding: "20px 24px", marginBottom: 18, position: "relative", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { color: "var(--textMuted)", fontSize: 11, marginBottom: 4, fontFamily: "'JetBrains Mono',monospace" } }, "EXECUTIVE STATUS \xB7 ", fmtD(prProj.dataDate)), /* @__PURE__ */ React.createElement("div", { style: { color: status.c, fontSize: 22, fontWeight: 700 } }, status.txt), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--textSecondary)", fontSize: 13, marginTop: 4 } }, t.variance, ": ", /* @__PURE__ */ React.createElement("span", { style: { color: status.c, fontWeight: 700 } }, r.variance > 0 ? "+" : "", r.variance.toFixed(2), "%"), timeline.slipPRvsBL !== null && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: 16, marginRight: 16, color: "var(--textDim)" } }, "\xB7 ", t.slipLabel, ": ", /* @__PURE__ */ React.createElement("span", { style: { color: timeline.slipPRvsBL > 0 ? "#f43f5e" : "#22c55e", fontWeight: 700 } }, timeline.slipPRvsBL > 0 ? "+" : "", timeline.slipPRvsBL, " ", t.slipDay)))), /* @__PURE__ */ React.createElement(Gauge, { value: Math.abs(r.variance), color: status.c, label: r.variance >= 0 ? t.aheadOf : t.behindOf, size: "large" })));
  const _card_Gauges = /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bgCard)", border: "1px solid #1e293b", borderRadius: 14, padding: "20px 16px", marginBottom: 16, display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 12 } }, r.originalPlanned !== null && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Gauge, { value: r.originalPlanned, color: "#fb923c", label: t.gaugeOrigPlan, sub: t.gaugeSub.original, size: "large" }), /* @__PURE__ */ React.createElement("div", { style: { width: 1, background: "var(--border)" } })), /* @__PURE__ */ React.createElement(Gauge, { value: r.planned, color: "#38bdf8", label: t.gaugeCurrentPlan, sub: r.originalPlanned !== null ? t.gaugeSub.revised : t.gaugeSub.baseline, size: "large" }), /* @__PURE__ */ React.createElement("div", { style: { width: 1, background: "var(--border)" } }), /* @__PURE__ */ React.createElement(Gauge, { value: r.actual, color: md.color, label: t.gaugeActual, sub: t.gaugeSub.current, size: "large" }));
  const _card_KpiCards = /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(148px,1fr))", gap: 10, marginBottom: 16 } }, /* @__PURE__ */ React.createElement(Card, { icon: "\u{1F4CA}", label: t.kpiTotal, value: s.total, accent: "#38bdf8" }), /* @__PURE__ */ React.createElement(Card, { icon: "\u2705", label: t.kpiCompleted, value: s.completed, accent: "#22c55e", sub: `${(s.total > 0 ? s.completed / s.total * 100 : 0).toFixed(1)}% ${t.kpiOfTotal}` }), /* @__PURE__ */ React.createElement(Card, { icon: "\u{1F504}", label: t.kpiInProgress, value: s.inProgress, accent: "#f59e0b" }), /* @__PURE__ */ React.createElement(Card, { icon: "\u23F8\uFE0F", label: t.kpiNotStarted, value: s.notStarted, accent: "var(--textDim)" }), /* @__PURE__ */ React.createElement(Card, { icon: "\u{1F6A8}", label: t.kpiCritical, value: s.critical, accent: "#f43f5e", sub: s.critical > 0 ? `${(s.total > 0 ? s.critical / s.total * 100 : 0).toFixed(1)}% ${t.kpiOfTotal}` : "\u2014" }), /* @__PURE__ */ React.createElement(Card, { icon: "\u26A0\uFE0F", label: t.kpiBehind, value: s.behind, accent: "#fb923c", sub: s.behind > 0 ? `${(s.total > 0 ? s.behind / s.total * 100 : 0).toFixed(1)}% ${t.kpiOfTotal}` : "\u2014" }), s.overallSPI !== null && /* @__PURE__ */ React.createElement(Card, { icon: "\u{1F4C8}", label: t.kpiSpi, value: (_a = s.overallSPI) == null ? void 0 : _a.toFixed(3), accent: s.overallSPI >= 1 ? "#22c55e" : "#f43f5e", sub: s.overallSPI >= 1 ? t.kpiAhead : t.kpiBehindSched }), s.overallCPI !== null && /* @__PURE__ */ React.createElement(Card, { icon: "\u{1F4B5}", label: t.kpiCpi, value: (_b = s.overallCPI) == null ? void 0 : _b.toFixed(3), accent: s.overallCPI >= 1 ? "#22c55e" : "#f43f5e", sub: s.overallCPI >= 1 ? t.kpiWithin : t.kpiOver }));
  const _card_Milestones = /* @__PURE__ */ React.createElement(MilestonesSection, { milestoneRows, hasOrigBL: !!origProj });
  const _card_WbsBreakdown = /* @__PURE__ */ React.createElement(WbsBreakdownSection, { wbsBreakdown, wbsMeta });
  const _card_OrigTimeline = origProj && /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bgCard)", border: "1px solid #1e293b", borderRadius: 12, padding: 16, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { color: "#38bdf8", fontWeight: 600, fontSize: 12, marginBottom: 12, fontFamily: "'JetBrains Mono',monospace" } }, t.timelineTitle), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 12 } }, [
    { label: t.tlOriginal, sub: "Original Baseline", c: "#fb923c", finish: fmtD(origProj.finish), slip: null },
    { label: t.tlRevised, sub: "Revised Baseline", c: "#38bdf8", finish: fmtD(blProj.finish), slip: timeline.slipBLvsOrig },
    { label: t.tlForecast, sub: "Current Forecast", c: "#a78bfa", finish: fmtD(prProj.finish), slip: timeline.slipPRvsOrig }
  ].map((item) => /* @__PURE__ */ React.createElement("div", { key: item.label, style: { background: "var(--bgCardSubtle)", borderRadius: 8, padding: 12, borderRight: `3px solid ${item.c}` } }, /* @__PURE__ */ React.createElement("div", { style: { color: "var(--textFaint)", fontSize: 10 } }, item.sub), /* @__PURE__ */ React.createElement("div", { style: { color: item.c, fontWeight: 700, fontSize: 13, marginTop: 2 } }, item.label), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--textSecondary)", fontSize: 12, marginTop: 6, fontFamily: "'JetBrains Mono',monospace" } }, t.tlFinish, " ", item.finish), item.slip !== null && /* @__PURE__ */ React.createElement("div", { style: { color: item.slip > 0 ? "#f43f5e" : "#22c55e", fontSize: 11, marginTop: 4 } }, item.slip > 0 ? "+" : "", item.slip, " ", t.slipDay, " ", t.tlVsOrig)))));
  const _card_Distributions = /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bgCard)", border: "1px solid #1e293b", borderRadius: 12, padding: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { color: "#38bdf8", fontWeight: 600, marginBottom: 10, fontSize: 11 } }, t.statusDist), [{ label: t.kpiCompleted, v: s.completed, c: "#22c55e" }, { label: t.kpiInProgress, v: s.inProgress, c: "#f59e0b" }, { label: t.kpiNotStarted, v: s.notStarted, c: "var(--textDim)" }].map(({ label, v, c }) => /* @__PURE__ */ React.createElement("div", { key: label, style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 7 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 8, height: 8, borderRadius: 2, background: c } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, fontSize: 11, color: "var(--textMuted)" } }, label), /* @__PURE__ */ React.createElement("div", { style: { flex: 3, background: "var(--border)", borderRadius: 999, height: 7, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { width: `${v / (s.total || 1) * 100}%`, height: "100%", background: c, borderRadius: 999 } })), /* @__PURE__ */ React.createElement("div", { style: { width: 52, textAlign: "left", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: c } }, v, " (", (s.total > 0 ? v / s.total * 100 : 0).toFixed(0), "%)")))), /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bgCard)", border: "1px solid #1e293b", borderRadius: 12, padding: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { color: "#38bdf8", fontWeight: 600, marginBottom: 10, fontSize: 11 } }, t.varianceDist), [
    { label: t.varAhead10, f: (r2) => r2.variance > 10, c: "#22c55e" },
    { label: t.varAhead1, f: (r2) => r2.variance > 1 && r2.variance <= 10, c: "#86efac" },
    { label: t.varOnTrack, f: (r2) => Math.abs(r2.variance) <= 1, c: "var(--textMuted)" },
    { label: t.varBehind1, f: (r2) => r2.variance < -1 && r2.variance >= -10, c: "#fb923c" },
    { label: t.varBehind10, f: (r2) => r2.variance < -10, c: "#f43f5e" }
  ].map(({ label, f, c }) => {
    const cnt = rows.filter(f).length;
    return /* @__PURE__ */ React.createElement("div", { key: label, style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 7 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 8, height: 8, borderRadius: 2, background: c } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, fontSize: 11, color: "var(--textMuted)" } }, label), /* @__PURE__ */ React.createElement("div", { style: { flex: 3, background: "var(--border)", borderRadius: 999, height: 7, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { width: `${cnt / (s.total || 1) * 100}%`, height: "100%", background: c, borderRadius: 999 } })), /* @__PURE__ */ React.createElement("div", { style: { width: 32, textAlign: "left", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: c } }, cnt));
  })));
  const _card_DelayedMilestones = /* @__PURE__ */ React.createElement(
    DelayedMilestonesAlert,
    {
      milestoneRows,
      dataDate: result.dataDate,
      projectFinish: prProj.finish,
      baselineFinish: blProj.finish
    }
  );
  return /* @__PURE__ */ React.createElement("div", null,
    // v29: Progress-only mode CARD — large, centered, with available/unavailable lists
    result.progressOnly && /* @__PURE__ */ React.createElement("div", {
      style: {
        background: "linear-gradient(135deg,#1a1505 0%,#0f0d05 100%)",
        border: "2px solid #fbbf2466",
        borderRadius: 16,
        padding: "24px 28px",
        marginBottom: 24,
        boxShadow: "0 0 40px rgba(251,191,36,0.08), inset 0 1px 0 rgba(251,191,36,0.1)",
        maxWidth: 900,
        margin: "0 auto 24px"
      }
    },
      /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: 20 } },
        /* @__PURE__ */ React.createElement("div", { style: { fontSize: 48, lineHeight: 1, marginBottom: 8 } }, "\u26A1"),
        /* @__PURE__ */ React.createElement("div", { style: { color: "#fbbf24", fontSize: 22, fontWeight: 800, letterSpacing: "-0.01em", marginBottom: 6 } },
          lang === "ar" ? "\u0648\u0636\u0639 Progress \u0641\u0642\u0637" : "Progress-Only Mode"
        ),
        /* @__PURE__ */ React.createElement("div", { style: { color: "var(--textMuted)", fontSize: 13, lineHeight: 1.6, maxWidth: 600, margin: "0 auto" } },
          lang === "ar"
            ? "\u064A\u0639\u0631\u0636 \u0647\u0630\u0627 \u0627\u0644\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u062A\u0627\u062D\u0629 \u0645\u0646 \u0645\u0644\u0641 Progress \u0641\u0642\u0637. \u0644\u0644\u062D\u0635\u0648\u0644 \u0639\u0644\u0649 \u062A\u062D\u0644\u064A\u0644 \u0643\u0627\u0645\u0644\u060C \u064A\u064F\u0641\u0636\u0651\u0644 \u0631\u0641\u0639 \u0645\u0644\u0641 Baseline \u0623\u064A\u0636\u0627\u064B."
            : "This analysis shows data from the Progress file only. For complete schedule performance metrics, please also upload a Baseline file."
        )
      ),
      /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20 } },
        // Available column
        /* @__PURE__ */ React.createElement("div", {
          style: { background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 10, padding: "14px 16px" }
        },
          /* @__PURE__ */ React.createElement("div", { style: { color: "#22c55e", fontWeight: 700, fontSize: 12, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 } },
            "\u2705 ", lang === "ar" ? "\u0645\u062A\u0627\u062D \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0648\u0636\u0639" : "Available in this mode"
          ),
          /* @__PURE__ */ React.createElement("ul", { style: { margin: 0, paddingInlineStart: 18, color: "var(--textSecondary)", fontSize: 11, lineHeight: 1.9 } },
            (lang === "ar" ? [
              "\u0646\u0633\u0628\u0629 \u0627\u0644\u0625\u0646\u062C\u0627\u0632 \u0627\u0644\u0641\u0639\u0644\u064A (% complete)",
              "\u0627\u0644\u062A\u0648\u0627\u0631\u064A\u062E \u0627\u0644\u0641\u0639\u0644\u064A\u0629 \u0648\u0627\u0644\u0645\u062A\u0648\u0642\u0651\u0639\u0629",
              "Forecast Finish",
              "S-Curve (\u0627\u0644\u0641\u0639\u0644\u064A)",
              "Critical Path",
              "Lookahead Window",
              "DCMA (\u062C\u0632\u0626\u064A)",
              "Open Ends \u0648 Loops",
              "Schedule Density",
              "Activity Codes"
            ] : [
              "Actual % Complete",
              "Actual & Forecast dates",
              "Forecast Finish",
              "S-Curve (actual)",
              "Critical Path",
              "Lookahead Window",
              "DCMA (partial)",
              "Open Ends & Loops",
              "Schedule Density",
              "Activity Codes"
            ]).map((item, i) => /* @__PURE__ */ React.createElement("li", { key: i }, item))
          )