// ═══════════════════════════════════════════════════════════════
// 04_ng_sa_compliance.js
// NG SA compliance rules + recovery thresholds (~lines 3299-3500)
// Lines: 3300 - 3500 (201 lines, 7,572 bytes)
// Source: p6-analyzer.html (v29.0.11.2)
// ═══════════════════════════════════════════════════════════════

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
  {
    key: "desalination",
    icon: "\u{1F4A7}",
    name_en: "Desalination Plant",
    name_ar: "\u0645\u062D\u0637\u0629 \u062A\u062D\u0644\u064A\u0629 \u0645\u064A\u0627\u0647",
    palette: { from: "#0284c7", to: "#0d9488", accent: "#67e8f9", glow: "#0284c740" },
    patterns: [
      /\bdesalination\b/i,
      /\bdesal\s+plant\b/i,
      /\bIWP\b/i,
      /\bIWPP\b/i,
      /\breverse\s+osmosis\b/i,
      /\bRO\s+plant\b/i,
      /\bsea\s+water\s+intake\b/i
    ]
  },
  {
    key: "water_treatment",
    icon: "\u{1F6B0}",
    name_en: "Water Treatment Plant",
    name_ar: "\u0645\u062D\u0637\u0629 \u0645\u0639\u0627\u0644\u062C\u0629 \u0645\u064A\u0627\u0647",
    palette: { from: "#0891b2", to: "#059669", accent: "#a7f3d0", glow: "#0891b240" },
    patterns: [
      /\bwater\s+treatment\s+plant\b/i,
      /\bdemineraliz\w+\s+water\b/i,
      /\bDWTP\b/i,
      /\bdemin\s+water\b/i,
      /\bdemineraliz\w+\s+water\s+treatment\b/i
    ]
  },
  {
    key: "gas_pipeline",
    icon: "\u{1F6E2}\uFE0F",
    name_en: "Gas Pipeline",
    name_ar: "\u062E\u0637 \u0646\u0642\u0644 \u063A\u0627\u0632",
    palette: { from: "#ca8a04", to: "#a16207", accent: "#fde047", glow: "#ca8a0440" },
    patterns: [
      /\bgas\s+pipeline\b/i,
      /\bgas\s+line\b/i,
      /\bgas\s+delivery\s+(?:system|line|pipeline)\b/i,
      /\bgas\s+(?:conversion|transmission|distribution)\b/i,
      /\bfuel\s+gas\s+(?:line|pipeline|system)\b/i,
      /\bgas\s+metering\s+station\b/i,
      /\bnatural\s+gas\s+(?:line|pipeline|system|delivery)\b/i,
      /\bLNG\b.*\b(?:pipeline|terminal|line)\b/i,
      /\bRabigh\s+Gas\b/i
    ]
  },
  {
    key: "oil_gas",
    icon: "\u{1F6E2}\uFE0F",
    name_en: "Oil & Gas",
    name_ar: "\u0627\u0644\u0646\u0641\u0637 \u0648\u0627\u0644\u063A\u0627\u0632",
    palette: { from: "#0891b2", to: "#0e7490", accent: "#67e8f9", glow: "#0891b240" },
    patterns: [
      /\boil\s+(?:and\s+)?gas\b/i,
      /\b(?:crude\s+)?oil\s+(?:terminal|refinery|storage|line|pipeline)\b/i,
      /\b(?:offshore|onshore)\s+(?:platform|drilling|production)\b/i,
      /\bupstream\b|\bdownstream\b|\bmidstream\b/i,
      /\b(?:wellhead|christmas\s+tree|production\s+manifold)\b/i,
      /\bRFP\b.*\bGas\b|\bGas\b.*\bRFP\b/i
    ]
  },
  // ── POWER GENERATION ──
  // "power plant" is excluded as a standalone pattern because many projects say
  // "AT XYZ POWER PLANT" referring to the host site, not the project scope.
  // We require specific generation keywords (HRSG, GT, MW capacity, etc.) instead.
  {
    key: "solar_pv",
    icon: "\u2600\uFE0F",
    name_en: "Solar PV Plant",
    name_ar: "\u0645\u062D\u0637\u0629 \u0637\u0627\u0642\u0629 \u0634\u0645\u0633\u064A\u0629",
    palette: { from: "#f59e0b", to: "#dc2626", accent: "#fde68a", glow: "#f59e0b40" },
    patterns: [
      /\bphotovoltaic\b/i,
      /\bsolar\s+(?:plant|farm|project)\b/i,
      /\bPV\s+(?:plant|farm|project)\b/i,
      // PV substation/BSP patterns: "HODN PV 380/110 KV BSP"
      /\bPV\s+\d+(?:\/\d+)*\s*kV\b/i,
      /\bPV\s+(?:BSP|substation|S\/S)\b/i,
      /\bsolar\s+(?:BSP|substation|S\/S)\b/i
    ]
  },
  {
    key: "power_plant",
    icon: "\u{1F3ED}",
    name_en: "Power Generation Plant",
    name_ar: "\u0645\u062D\u0637\u0629 \u062A\u0648\u0644\u064A\u062F \u0643\u0647\u0631\u0628\u0627\u0621",
    palette: { from: "#dc2626", to: "#ea580c", accent: "#fbbf24", glow: "#dc262640" },
    patterns: [
      /\bcombined\s+cycle\b/i,
      /\bgas\s+turbine\b/i,
      /\bsteam\s+turbine\b/i,
      /\bHRSG\b/i,
      /\bcogeneration\b/i,
      /\bccgt\b/i,
      /\bocgt\b/i,
      /\b\d{2,4}\s*MW\b/i,
      /\breinforcement\s+power\s+plant\b/i,
      /\bIPP\b/i,
      /\b(?:new\s+)?power\s+generation\s+plant\b/i
    ]
  },
  // ── TRANSMISSION INFRASTRUCTURE ──
  {
    key: "transmission_oh",
    icon: "\u{1F5FC}",
    name_en: "Overhead Transmission Line",
    name_ar: "\u062E\u0637 \u0646\u0642\u0644 \u0647\u0648\u0627\u0626\u064A",
    palette: { from: "#0891b2", to: "#0ea5e9", accent: "#fde047", glow: "#0891b240" },
    patterns: [
      /\bOHTL\b/i,
      /\boverhead\s+transmission\b/i,
      /\boverhead\s+line\b/i,
      /\bO\/?H\s+line\b/i,
      /\btransmission\s+line\b/i,
      /\bOPGW\b/i
    ]
  },
  {
    key: "transmission_ug",
    icon: "\u{1F50C}",
    name_en: "Underground Cable",
    name_ar: "\u0643\u064A\u0628\u0644 \u0623\u0631\u0636\u064A",
    palette: { from: "#7c3aed", to: "#4f46e5", accent: "#fcd34d", glow: "#7c3aed40" },
    patterns: [/\bU\/?G\s+cable\b/i, /\bunderground\s+cable\b/i, /\bcable\s+system\b/i]
  },
  // ── NG MATRIX TYPES (specific NG project categories - placed BEFORE substation) ──
  {
    key: "battery_storage",
    icon: "\u{1F50B}",
    name_en: "Battery Energy Storage System (BESS)",
    name_ar: "\u0646\u0638\u0627\u0645 \u062A\u062E\u0632\u064A\u0646 \u0627\u0644\u0637\u0627\u0642\u0629 \u0628\u0627\u0644\u0628\u0637\u0627\u0631\u064A\u0627\u062A",
    palette: { from: "#16a34a", to: "#22c55e", accent: "#fde047", glow: "#16a34a40" },
    patterns: [
      /\bBESS\b/i,
      /\bbattery\s+(?:energy\s+)?storage\b/i,
      /\benergy\s+storage\s+system\b/i,
      /\bESS\s+project\b/i,
      /\b(?:Li[\s-]?ion|lithium)\s+battery\b/i,
      /\bbattery\s+system\b/i
    ]
  },
  {
    key: "hvdc",
    icon: "\u26A1",
    name_en: "High Voltage DC (HVDC) Project",
    name_ar: "\u0645\u0634\u0631\u0648\u0639 \u0627\u0644\u062A\u064A\u0627\u0631 \u0627\u0644\u0645\u0633\u062A\u0645\u0631 \u0639\u0627\u0644\u064A \u0627\u0644\u062C\u0647\u062F",
    palette: { from: "#dc2626", to: "#9333ea", accent: "#fef08a", glow: "#dc262640" },
    patterns: [
      /\bHVDC\b/i,
      /\bhigh\s+voltage\s+(DC|direct\s+current)\b/i,
      /\bHV[\s-]?DC\s+(?:project|system|link|interconnect)/i,
      /\bDC\s+(?:converter|interconnect(?:or|ion))\b/i,
      /\bback[\s-]?to[\s-]?back\s+(?:HVDC|converter)\b/i,
      /\bDC\s+transmission\b/i
    ]
  },
  {
    key: "telecom",
    icon: "\u{1F4E1}",
    name_en: "Telecommunication / Upgrade System",
    name_ar: "\u0627\u062A\u0635\u0627\u0644\u0627\u062A / \u062A\u0631\u0642\u064A\u0629 \u0623\u0646\u0638\u0645\u0629",
    palette: { from: "#0284c7", to: "#06b6d4", accent: "#a5f3fc", glow: "#0284c740" },
    patterns: [
      /\btelecom(?:munication)?\s+(?:project|system|upgrade|network)/i,
      /\btelecommunication\b/i,
      /\bSDH\s+(?:network|system|upgrade)\b/i,
      /\bMPLS\s+(?:network|backbone)\b/i,
      /\bfiber\s+optic\s+(?:network|backbone|telecom)/i,
      /\bDWDM\s+(?:network|system)\b/i,
      /\bteleprotection\s+(?:upgrade|system)\b/i,
      /\bnetwork\s+(?:expansion|upgrade)\b/i
    ]
  },
  {
    key: "cybersecurity",
    icon: "\u{1F512}",
    name_en: "Cyber Security Project",
    name_ar: "\u0645\u0634\u0631\u0648\u0639 \u0627\u0644\u0623\u0645\u0646 \u0627\u0644\u0633\u064A\u0628\u0631\u0627\u0646\u064A",