import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dtoxumzabwepgwkdderf.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── SUPERVISOR PIN ───────────────────────────────────────────────────────────
const SUPERVISOR_PIN = "2024"; // Change this to your preferred PIN

// ─── GOVERNING BODIES ─────────────────────────────────────────────────────────
const GOVERNING_BODIES = [
  { id: "jc",       label: "Joint Commission", short: "JC",       color: "#3b82f6" },
  { id: "idph",     label: "IDPH",             short: "IDPH",     color: "#8b5cf6" },
  { id: "supr",     label: "SUPR",             short: "SUPR",     color: "#f59e0b" },
  { id: "insurance",label: "Insurance",        short: "Insurance",color: "#10b981" },
  { id: "internal", label: "Internal QA",      short: "Internal", color: "#64748b" },
];

// ─── SITES ────────────────────────────────────────────────────────────────────
const SITES = [
  { id: "loop",       label: "Chicago Loop",                  short: "Loop",   color: "#3b82f6" },
  { id: "ah_adult",   label: "Arlington Heights — Adult",     short: "AH Adult", color: "#8b5cf6" },
  { id: "ah_adol",    label: "Arlington Heights — Adolescent",short: "AH Adolescent", color: "#ec4899" },
];

// ─── SHARED CHECKLIST SECTIONS (adult) ────────────────────────────────────────
const ADULT_OPEN_PHP = [
  { section: "Patient Acknowledgment and Informed Consent", items: [
    { text: "Informed consent for treatment signed and dated" },
    { text: "Notice of Privacy Practices signed" },
    { text: "OP Provider ROI completed" },
    { text: "Emergency contact ROI completed" },
    { text: "Financial Policy Agreement signed" },
    { text: "Mindful Movement Group Participant Waiver signed" },
  ]},
  { section: "Screening & Intake (Biopsychosocial)", items: [
    { text: "Intake completed within 30 days prior to admission" },
  ]},
  { section: "Treatment Plan", items: [
    { text: "Master treatment plan completed within 5 business days of admission" },
    { text: "Goals are measurable and patient-centered" },
    { text: "Interventions align with diagnosis and goals" },
    { text: "Patient signature present", na: true },
    { text: "Clinician signature present" },
    { text: "Treatment plan reviewed and updated bi-weekly" },
    { text: "Family/support involvement documented (if applicable)", na: true },
  ]},
  { section: "Psychiatric Evaluation & Medication Management", items: [
    { text: "Initial psychiatric evaluation (60 min) completed within 72 hrs of admission" },
    { text: "Initial eval documents diagnosis, presenting symptoms, and medication rationale" },
    { text: "Medication list documented and current at admission" },
    { text: "Medication consent obtained" },
    { text: "Medication reconciliation completed at admission" },
    { text: "Weekly 15-min med management follow-up note present for each week of treatment" },
    { text: "Each med mgmt note includes: current meds, response, side effects, and plan" },
    { text: "Prescribing provider signature on each med mgmt note" },
    { text: "MAR present and reconciled if medications administered on-site", na: true },
  ]},
  { section: "Individual Therapy Sessions", items: [
    { text: "Weekly 60-min individual therapy sessions documented" },
    { text: "Session notes reflect treatment plan goals" },
    { text: "Notes include clinical observations, interventions, and patient response" },
    { text: "Notes signed and dated by credentialed clinician" },
    { text: "Unlicensed staff notes co-signed by licensed supervisor within required timeframe", na: true },
    { text: "No unexplained gaps in individual session documentation" },
  ]},
  { section: "Group Notes", items: [
    { text: "Group notes present for all program days attended" },
    { text: "Group notes document patient participation and clinical response" },
    { text: "Group notes signed and dated by facilitating staff" },
    { text: "Unlicensed staff group notes co-signed by licensed supervisor", na: true },
  ]},
  { section: "Safety Assessments & Risk Documentation", items: [
    { text: "Safety/risk assessment completed at admission" },
    { text: "Validated suicide risk screening tool used (e.g., C-SSRS) and documented" },
    { text: "C-SSRS or equivalent reassessment documented per policy frequency" },
    { text: "Ongoing risk monitoring documented per policy frequency" },
    { text: "Safety plan completed and documented when indicated" },
    { text: "Higher level of care referral documented (if indicated)", na: true },
    { text: "Crisis contacts identified and documented" },
  ]},
  { section: "Authorizations & Medical Necessity", items: [
    { text: "Initial authorization obtained prior to or at admission" },
    { text: "Medical necessity documented in clinical record" },
    { text: "Continued stay / concurrent review authorization current" },
    { text: "Clinical criteria (ASAM/MCG) referenced in notes" },
    { text: "Peer-to-peer documented (if applicable)", na: true },
  ]},
  { section: "Adverse Events & Incident Reporting", items: [
    { text: "No adverse events during treatment — documented", na: true },
    { text: "If adverse event occurred: incident report filed and cross-referenced in chart", na: true },
    { text: "Falls, medication errors, or behavioral incidents documented per policy", na: true },
  ]},
  { section: "Discharge Planning", items: [
    { text: "Discharge planning initiated at or within 24 hrs of admission" },
    { text: "Step-down level of care identified and documented" },
    { text: "Aftercare appointments scheduled or actively in progress" },
    { text: "Patient engagement in discharge planning documented" },
    { text: "Clinical summary or transition record sent to receiving provider" },
    { text: "Discharge note completed within 24 hours of patient discharging" },
  ]},
  { section: "Content Quality", items: [
    { text: "Medical necessity clearly documented and supports level of care" },
    { text: "Presenting symptoms documented and consistent throughout chart" },
    { text: "Diagnosis supported by clinical documentation" },
    { text: "Treatment goals are individualized and linked to diagnosis" },
    { text: "Interventions align with goals and diagnosis" },
    { text: "Progress notes reflect response to treatment interventions" },
    { text: "Documentation is objective, professional, and clinically relevant" },
    { text: "Consistency across notes, treatment plan, and assessment" },
  ]},
];

const ADULT_CLOSED_PHP = [
  { section: "Patient Acknowledgment and Informed Consent", items: [
    { text: "Informed consent for treatment signed and dated" },
    { text: "Notice of Privacy Practices signed" },
    { text: "OP Provider ROI completed" },
    { text: "Emergency contact ROI completed" },
    { text: "Financial Policy Agreement signed" },
    { text: "Mindful Movement Group Participant Waiver signed" },
  ]},
  { section: "Screening & Intake (Biopsychosocial)", items: [
    { text: "Intake completed within 30 days prior to admission" },
  ]},
  { section: "Treatment Plan", items: [
    { text: "Master treatment plan completed within 5 business days of admission" },
    { text: "Goals are measurable and patient-centered" },
    { text: "Patient and clinician signatures present", na: true },
    { text: "Bi-weekly treatment plan reviews documented throughout episode" },
    { text: "Treatment plan updated to reflect clinical changes" },
  ]},
  { section: "Psychiatric Evaluation & Medication Management", items: [
    { text: "Initial psychiatric evaluation (60 min) completed within 72 hrs of admission" },
    { text: "Initial eval documents diagnosis, symptoms, and medication plan" },
    { text: "Medication list present and current throughout episode" },
    { text: "Medication consent present" },
    { text: "Weekly 15-min med mgmt follow-up notes present for each week" },
    { text: "Each med mgmt note includes: meds, response, side effects, and plan" },
    { text: "All med mgmt notes signed by prescribing provider" },
    { text: "MAR present and reconciled if medications administered on-site", na: true },
  ]},
  { section: "Individual Therapy Sessions", items: [
    { text: "Weekly 60-min individual therapy notes present throughout episode" },
    { text: "Notes reflect treatment plan goals" },
    { text: "Notes signed and dated by credentialed clinician" },
    { text: "Unlicensed staff notes co-signed by licensed supervisor within required timeframe", na: true },
    { text: "No unexplained gaps in individual session documentation" },
  ]},
  { section: "Group Notes", items: [
    { text: "Group notes present for all program days" },
    { text: "Group notes signed and dated" },
    { text: "Unlicensed staff group notes co-signed by licensed supervisor", na: true },
    { text: "No unexplained gaps in group documentation" },
  ]},
  { section: "Safety Assessments & Risk Documentation", items: [
    { text: "Admission risk assessment present" },
    { text: "Validated suicide risk screening tool used (e.g., C-SSRS) and documented" },
    { text: "C-SSRS or equivalent reassessment documented throughout episode" },
    { text: "Ongoing risk monitoring documented throughout episode" },
    { text: "Safety plan completed and documented when indicated" },
    { text: "Crisis response or escalation documented (if applicable)", na: true },
  ]},
  { section: "Authorizations & Medical Necessity", items: [
    { text: "Authorization(s) cover full episode of care" },
    { text: "Medical necessity documentation present throughout" },
    { text: "No undocumented gaps in authorization" },
  ]},
  { section: "Adverse Events & Incident Reporting", items: [
    { text: "No adverse events — documented or noted as none", na: true },
    { text: "If adverse event occurred: incident report filed and cross-referenced in chart", na: true },
  ]},
  { section: "Discharge Planning & Aftercare", items: [
    { text: "Discharge summary completed and signed" },
    { text: "Discharge diagnosis documented" },
    { text: "Aftercare plan documented and provided to patient" },
    { text: "Step-down level of care documented" },
    { text: "Patient education at discharge documented" },
    { text: "Follow-up appointments confirmed at discharge" },
    { text: "Clinical summary or transition record sent to receiving provider" },
    { text: "Discharge note completed within 24 hours of patient discharging" },
    { text: "Discharge against clinical advice (ACA) documented (if applicable)", na: true },
  ]},
  { section: "Content Quality", items: [
    { text: "Medical necessity clearly documented and supports level of care" },
    { text: "Presenting symptoms documented and consistent throughout chart" },
    { text: "Diagnosis supported by clinical documentation" },
    { text: "Treatment goals are individualized and linked to diagnosis" },
    { text: "Interventions align with goals and diagnosis" },
    { text: "Progress notes reflect response to treatment interventions" },
    { text: "Documentation is objective, professional, and clinically relevant" },
    { text: "Consistency across notes, treatment plan, and assessment" },
  ]},
];

const ADULT_OPEN_IOP = [
  { section: "Patient Acknowledgment and Informed Consent", items: [
    { text: "Informed consent for treatment signed and dated" },
    { text: "Notice of Privacy Practices signed" },
    { text: "OP Provider ROI completed" },
    { text: "Emergency contact ROI completed" },
    { text: "Financial Policy Agreement signed" },
    { text: "Mindful Movement Group Participant Waiver signed" },
  ]},
  { section: "Screening & Intake (Biopsychosocial)", items: [
    { text: "Intake completed within 30 days prior to admission" },
  ]},
  { section: "Treatment Plan", items: [
    { text: "Master treatment plan completed within 5 business days of admission" },
    { text: "Goals are measurable and patient-centered" },
    { text: "Interventions align with diagnosis and goals" },
    { text: "Patient signature present", na: true },
    { text: "Clinician signature present" },
    { text: "Treatment plan reviewed and updated bi-weekly" },
  ]},
  { section: "Psychiatric Evaluation & Medication Management", items: [
    { text: "Psychiatric evaluation or psychiatric review completed" },
    { text: "Medication list documented and current" },
    { text: "Medication consent obtained (if applicable)", na: true },
    { text: "Coordination with prescriber documented in record" },
    { text: "Follow-up psychiatric contact scheduled (if applicable)", na: true },
    { text: "MAR present and reconciled if medications administered on-site", na: true },
  ]},
  { section: "Individual Therapy Sessions", items: [
    { text: "Individual therapy cadence meets policy: 30-min weekly OR full session every other week" },
    { text: "Session notes present and consistent with chosen cadence" },
    { text: "Notes reflect treatment plan goals" },
    { text: "Notes include clinical observations, interventions, and patient response" },
    { text: "Notes signed and dated by credentialed clinician" },
    { text: "Unlicensed staff notes co-signed by licensed supervisor within required timeframe", na: true },
    { text: "No unexplained gaps in individual session documentation" },
  ]},
  { section: "Group Notes", items: [
    { text: "Group notes present for all program days attended" },
    { text: "Group notes document patient participation and clinical response" },
    { text: "Group notes signed and dated by facilitating staff" },
    { text: "Unlicensed staff group notes co-signed by licensed supervisor", na: true },
  ]},
  { section: "Safety Assessments & Risk Documentation", items: [
    { text: "Safety/risk assessment completed at admission" },
    { text: "Validated suicide risk screening tool used (e.g., C-SSRS) and documented" },
    { text: "C-SSRS or equivalent reassessment documented per policy frequency" },
    { text: "Ongoing risk monitoring documented per policy frequency" },
    { text: "Safety plan completed and documented when indicated" },
    { text: "Crisis contacts identified and documented" },
    { text: "Higher level of care referral documented (if indicated)", na: true },
  ]},
  { section: "Authorizations & Medical Necessity", items: [
    { text: "Initial authorization obtained" },
    { text: "Medical necessity documented in clinical record" },
    { text: "Continued stay / concurrent review authorization current" },
    { text: "Clinical criteria referenced in notes" },
    { text: "Peer-to-peer documented (if applicable)", na: true },
  ]},
  { section: "Adverse Events & Incident Reporting", items: [
    { text: "No adverse events during treatment — documented", na: true },
    { text: "If adverse event occurred: incident report filed and cross-referenced in chart", na: true },
    { text: "Falls, medication errors, or behavioral incidents documented per policy", na: true },
  ]},
  { section: "Discharge Planning", items: [
    { text: "Discharge planning initiated at or near admission" },
    { text: "Step-down or community-level resources identified" },
    { text: "Aftercare planning in progress" },
    { text: "Patient engagement in discharge planning documented" },
    { text: "Clinical summary or transition record sent to receiving provider" },
    { text: "Discharge note completed within 24 hours of patient discharging" },
  ]},
  { section: "Content Quality", items: [
    { text: "Medical necessity clearly documented and supports level of care" },
    { text: "Presenting symptoms documented and consistent throughout chart" },
    { text: "Diagnosis supported by clinical documentation" },
    { text: "Treatment goals are individualized and linked to diagnosis" },
    { text: "Interventions align with goals and diagnosis" },
    { text: "Progress notes reflect response to treatment interventions" },
    { text: "Documentation is objective, professional, and clinically relevant" },
    { text: "Consistency across notes, treatment plan, and assessment" },
  ]},
];

const ADULT_CLOSED_IOP = [
  { section: "Patient Acknowledgment and Informed Consent", items: [
    { text: "Informed consent for treatment signed and dated" },
    { text: "Notice of Privacy Practices signed" },
    { text: "OP Provider ROI completed" },
    { text: "Emergency contact ROI completed" },
    { text: "Financial Policy Agreement signed" },
    { text: "Mindful Movement Group Participant Waiver signed" },
  ]},
  { section: "Screening & Intake (Biopsychosocial)", items: [
    { text: "Intake completed within 30 days prior to admission" },
  ]},
  { section: "Treatment Plan", items: [
    { text: "Master treatment plan completed within 5 business days of admission" },
    { text: "Patient and clinician signatures present", na: true },
    { text: "Bi-weekly treatment plan reviews documented throughout episode" },
    { text: "Treatment plan updated to reflect clinical changes" },
  ]},
  { section: "Psychiatric Evaluation & Medication Management", items: [
    { text: "Psychiatric evaluation or review present in record" },
    { text: "Medication list documented" },
    { text: "Prescriber coordination documented" },
    { text: "MAR present and reconciled if medications administered on-site", na: true },
  ]},
  { section: "Individual Therapy Sessions", items: [
    { text: "Individual therapy notes present per cadence (30 min weekly or full session biweekly)" },
    { text: "Notes reflect treatment plan goals" },
    { text: "Notes signed and dated by credentialed clinician" },
    { text: "Unlicensed staff notes co-signed by licensed supervisor within required timeframe", na: true },
    { text: "No unexplained gaps in individual session documentation" },
  ]},
  { section: "Group Notes", items: [
    { text: "Group notes present for all program days" },
    { text: "Group notes signed and dated" },
    { text: "Unlicensed staff group notes co-signed by licensed supervisor", na: true },
    { text: "No unexplained gaps in group documentation" },
  ]},
  { section: "Safety Assessments & Risk Documentation", items: [
    { text: "Admission risk assessment present" },
    { text: "Validated suicide risk screening tool used (e.g., C-SSRS) and documented" },
    { text: "C-SSRS or equivalent reassessment documented throughout episode" },
    { text: "Ongoing risk monitoring documented throughout episode" },
    { text: "Safety plan completed and documented when indicated" },
    { text: "Crisis response documented (if applicable)", na: true },
  ]},
  { section: "Authorizations & Medical Necessity", items: [
    { text: "Authorization(s) cover full episode of care" },
    { text: "Medical necessity documentation present throughout" },
    { text: "No undocumented gaps in authorization" },
  ]},
  { section: "Adverse Events & Incident Reporting", items: [
    { text: "No adverse events — documented or noted as none", na: true },
    { text: "If adverse event occurred: incident report filed and cross-referenced in chart", na: true },
  ]},
  { section: "Discharge Planning & Aftercare", items: [
    { text: "Discharge summary completed and signed" },
    { text: "Discharge diagnosis documented" },
    { text: "Aftercare plan documented and provided to patient" },
    { text: "Step-down or community resources documented" },
    { text: "Follow-up appointments confirmed at discharge" },
    { text: "Clinical summary or transition record sent to receiving provider" },
    { text: "Discharge note completed within 24 hours of patient discharging" },
    { text: "Discharge against clinical advice (ACA) documented (if applicable)", na: true },
  ]},
  { section: "Content Quality", items: [
    { text: "Medical necessity clearly documented and supports level of care" },
    { text: "Presenting symptoms documented and consistent throughout chart" },
    { text: "Diagnosis supported by clinical documentation" },
    { text: "Treatment goals are individualized and linked to diagnosis" },
    { text: "Interventions align with goals and diagnosis" },
    { text: "Progress notes reflect response to treatment interventions" },
    { text: "Documentation is objective, professional, and clinically relevant" },
    { text: "Consistency across notes, treatment plan, and assessment" },
  ]},
];

// ─── MASTER CHECKLIST LOOKUP ──────────────────────────────────────────────────
// AH Adolescent uses the same checklist as adult — site is a tag only

const COORDINATION_SECTION = {
  section: "Coordination of Care",
  items: [
    { text: "Coordination note with prescriber/psychiatrist documented", na: true },
    { text: "Coordination note with primary care provider (PCP) documented", na: true },
    { text: "Coordination note with specialist documented", na: true },
    { text: "Coordination note with school/educational provider documented", na: true },
    { text: "Coordination note with crisis/ER/inpatient provider documented", na: true },
    { text: "Coordination note with other outpatient therapist documented", na: true },
    { text: "Release of information present for each coordinating provider", na: true },
  ],
};

function getChecklist(site, loc, chartType) {
  const map = {
    PHP: { open: ADULT_OPEN_PHP, closed: ADULT_CLOSED_PHP },
    IOP: { open: ADULT_OPEN_IOP, closed: ADULT_CLOSED_IOP },
  };
  const base = map[loc]?.[chartType] || ADULT_OPEN_PHP;
  // Inject coordination section before discharge section
  const dischargeIdx = base.findIndex(s => s.section.startsWith("Discharge"));
  const result = [...base];
  if (dischargeIdx >= 0 && !result.find(s => s.section === "Coordination of Care")) {
    result.splice(dischargeIdx, 0, COORDINATION_SECTION);
  }
  return result;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const SECTION_COLORS = {
  "Patient Acknowledgment and Informed Consent": "#6366f1",
  "Screening & Intake (Biopsychosocial)": "#0ea5e9",
  "Content Quality": "#10b981",
  "Treatment Plan": "#10b981",
  "Psychiatric Evaluation & Medication Management": "#f59e0b",
  "Individual Therapy Sessions": "#ec4899",
  "Group Notes": "#8b5cf6",
  "Safety Assessments & Risk Documentation": "#ef4444",
  "Authorizations & Medical Necessity": "#f97316",
  "Adverse Events & Incident Reporting": "#64748b",
  "Coordination of Care": "#06b6d4",
  "Discharge Planning": "#14b8a6",
  "Discharge Planning & Aftercare": "#14b8a6",
};

function buildAnswerMap(checklist) {
  const map = {};
  checklist.forEach(sec => sec.items.forEach((_, i) => { map[`${sec.section}::${i}`] = "pending"; }));
  return map;
}

function scoreAnswers(answers) {
  const vals = Object.values(answers);
  const pending = vals.filter(v => v === "pending").length;
  const na = vals.filter(v => v === "na").length;
  const applicable = vals.filter(v => v !== "pending" && v !== "na");
  const passing = applicable.filter(v => v === "pass").length;
  const failing = applicable.filter(v => v === "fail").length;
  const pct = applicable.length === 0 ? null : Math.round((passing / applicable.length) * 100);
  return { pct, passing, failing, na, pending, total: vals.length };
}

function genId() { return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }
function fmt(iso) { return iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""; }
function siteLabel(id) { return SITES.find(s => s.id === id)?.label || id; }
function siteShort(id) { return SITES.find(s => s.id === id)?.short || id; }
function siteColor(id) { return SITES.find(s => s.id === id)?.color || "#64748b"; }

function exportCSV(audits) {
  const rows = [["Chart ID","Site","LOC","Type","Governing Body","Auditor","Audit Date","Score %","Passing","Failing","N/A","Pending","Compliant","Saved At"]];
  audits.forEach(a => {
    const s = scoreAnswers(a.answers);
    const gb = GOVERNING_BODIES.find(g=>g.id===a.governingBody);
    rows.push([a.chartLabel||"", siteLabel(a.site), a.loc, a.chartType, gb?.label||"",
      a.auditorName||"", a.auditDate||"", s.pct!=null?`${s.pct}%`:"—",
      s.passing, s.failing, s.na, s.pending,
      a.jcReady?"Yes":"No", fmt(a.savedAt)]);
  });
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], {type:"text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download="clarity_clinical_audits.csv"; a.click();
  URL.revokeObjectURL(url);
}

// ─── SCORE RING ───────────────────────────────────────────────────────────────
function ScoreRing({ pct, size=90 }) {
  const r = (size-12)/2, circ = 2*Math.PI*r;
  const filled = pct==null ? 0 : (pct/100)*circ;
  const color = pct==null?"#475569":pct>=90?"#22c55e":pct>=75?"#f59e0b":"#ef4444";
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={9}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={9}
        strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} style={{transition:"stroke-dasharray 0.5s ease"}}/>
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        style={{fill:"#fff",fontWeight:800,fontSize:18,fontFamily:"inherit"}}>
        {pct==null?"—":`${pct}%`}
      </text>
    </svg>
  );
}

function ScoreBadge({ pct, small }) {
  if (pct==null) return <span style={{color:"#94a3b8",fontSize:small?11:13}}>—</span>;
  const color = pct>=90?"#16a34a":pct>=75?"#d97706":"#dc2626";
  const bg = pct>=90?"#dcfce7":pct>=75?"#fef3c7":"#fee2e2";
  return <span style={{background:bg,color,fontWeight:700,fontSize:small?11:13,padding:small?"1px 8px":"2px 10px",borderRadius:99}}>{pct}%</span>;
}

function SitePill({ siteId }) {
  return (
    <span style={{fontSize:11,fontWeight:700,padding:"1px 8px",borderRadius:99,
      background:`${siteColor(siteId)}22`,color:siteColor(siteId),
      border:`1px solid ${siteColor(siteId)}44`}}>
      {siteShort(siteId)}
    </span>
  );
}

// ─── HISTORY VIEW ─────────────────────────────────────────────────────────────
function HistoryView({ audits, onEdit, onDelete }) {
  const [filterSite, setFilterSite] = useState("all");
  const [filterLoc, setFilterLoc] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterJC, setFilterJC] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = audits.filter(a => {
    if (filterJC && !a.jcReady) return false;
    if (filterSite !== "all" && a.site !== filterSite) return false;
    if (filterLoc !== "all" && a.loc !== filterLoc) return false;
    if (filterType !== "all" && a.chartType !== filterType) return false;
    if (search) {
      const q = search.toLowerCase();
      return (a.chartLabel||"").toLowerCase().includes(q) || (a.auditorName||"").toLowerCase().includes(q);
    }
    return true;
  });

  const jcCount = audits.filter(a=>a.jcReady).length;
  const avgPct = (() => {
    const s = audits.map(a=>scoreAnswers(a.answers).pct).filter(p=>p!=null);
    return s.length ? Math.round(s.reduce((a,b)=>a+b,0)/s.length) : null;
  })();

  return (
    <div style={{maxWidth:960,margin:"0 auto",padding:"24px 16px"}}>

      {/* Site stats cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12,marginBottom:20}}>
        {/* Overall */}
        <div style={{background:"#fff",borderRadius:10,padding:"14px 18px",border:"1px solid #e2e8f0",gridColumn:"span 1"}}>
          <div style={{fontSize:10,color:"#94a3b8",fontWeight:700,letterSpacing:0.8,textTransform:"uppercase",marginBottom:6}}>All Sites</div>
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            <div><div style={{fontSize:22,fontWeight:800,color:"#1e293b"}}>{audits.length}</div><div style={{fontSize:11,color:"#94a3b8"}}>Total</div></div>
            <div><div style={{fontSize:22,fontWeight:800,color:"#22c55e"}}>{jcCount}</div><div style={{fontSize:11,color:"#94a3b8"}}>JC Ready</div></div>
            <div><div style={{fontSize:22,fontWeight:800,color:avgPct>=90?"#22c55e":avgPct>=75?"#f59e0b":"#ef4444"}}>{avgPct!=null?`${avgPct}%`:"—"}</div><div style={{fontSize:11,color:"#94a3b8"}}>Avg Score</div></div>
          </div>
        </div>
        {/* Per site */}
        {SITES.map(site => {
          const sa = audits.filter(a=>a.site===site.id);
          const sp = sa.map(a=>scoreAnswers(a.answers).pct).filter(p=>p!=null);
          const savg = sp.length ? Math.round(sp.reduce((a,b)=>a+b,0)/sp.length) : null;
          return (
            <div key={site.id} onClick={()=>setFilterSite(filterSite===site.id?"all":site.id)}
              style={{background:"#fff",borderRadius:10,padding:"14px 18px",border:`1.5px solid ${filterSite===site.id?site.color:"#e2e8f0"}`,cursor:"pointer",transition:"all 0.15s"}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:0.8,textTransform:"uppercase",marginBottom:6,color:site.color}}>{site.short}</div>
              <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
                <div><div style={{fontSize:20,fontWeight:800,color:"#1e293b"}}>{sa.length}</div><div style={{fontSize:11,color:"#94a3b8"}}>Charts</div></div>
                <div><div style={{fontSize:20,fontWeight:800,color:"#22c55e"}}>{sa.filter(a=>a.jcReady).length}</div><div style={{fontSize:11,color:"#94a3b8"}}>JC Ready</div></div>
                <div><div style={{fontSize:20,fontWeight:800,color:savg>=90?"#22c55e":savg>=75?"#f59e0b":savg!=null?"#ef4444":"#94a3b8"}}>{savg!=null?`${savg}%`:"—"}</div><div style={{fontSize:11,color:"#94a3b8"}}>Avg</div></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        <input placeholder="Search chart ID or auditor..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{fontSize:13,padding:"7px 12px",borderRadius:8,border:"1px solid #e2e8f0",color:"#334155",outline:"none",minWidth:200,flex:1}}/>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          {/* LOC filter */}
          {[["all","All LOC"],["PHP","PHP"],["IOP","IOP"]].map(([v,l])=>(
            <button key={v} onClick={()=>setFilterLoc(v)} style={{padding:"5px 11px",fontSize:11,fontWeight:700,borderRadius:6,cursor:"pointer",
              border:"1.5px solid",borderColor:filterLoc===v?"#3b82f6":"#e2e8f0",
              background:filterLoc===v?"#eff6ff":"#fff",color:filterLoc===v?"#1d4ed8":"#64748b"}}>{l}</button>
          ))}
          {/* Type filter */}
          {[["all","Open & Closed"],["open","Open"],["closed","Closed"]].map(([v,l])=>(
            <button key={v} onClick={()=>setFilterType(v)} style={{padding:"5px 11px",fontSize:11,fontWeight:700,borderRadius:6,cursor:"pointer",
              border:"1.5px solid",borderColor:filterType===v?"#059669":"#e2e8f0",
              background:filterType===v?"#ecfdf5":"#fff",color:filterType===v?"#059669":"#64748b"}}>{l}</button>
          ))}
          {/* JC filter */}
          <button onClick={()=>setFilterJC(v=>!v)} style={{padding:"5px 11px",fontSize:11,fontWeight:700,borderRadius:6,cursor:"pointer",
            border:"1.5px solid",borderColor:filterJC?"#22c55e":"#e2e8f0",
            background:filterJC?"#dcfce7":"#fff",color:filterJC?"#166534":"#64748b"}}>★ JC Ready</button>
        </div>
        <button onClick={()=>exportCSV(filtered)} style={{padding:"7px 14px",fontSize:12,fontWeight:700,borderRadius:8,border:"1px solid #e2e8f0",background:"#f8fafc",color:"#475569",cursor:"pointer",whiteSpace:"nowrap"}}>
          ↓ Export CSV
        </button>
      </div>

      {/* Results count */}
      <div style={{fontSize:12,color:"#94a3b8",marginBottom:10}}>
        Showing {filtered.length} of {audits.length} audit{audits.length!==1?"s":""}
        {filterSite!=="all"&&` · ${siteLabel(filterSite)}`}
        {filterJC&&` · JC Ready only`}
      </div>

      {/* List */}
      {filtered.length===0 ? (
        <div style={{textAlign:"center",padding:"60px 0",color:"#94a3b8"}}>
          <div style={{fontSize:36,marginBottom:10}}>📋</div>
          <div style={{fontSize:15,fontWeight:600,marginBottom:4}}>No audits found</div>
          <div style={{fontSize:13}}>{audits.length===0?"Complete your first chart audit to see it here.":"Try adjusting your filters."}</div>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[...filtered].reverse().map(audit => {
            const s = scoreAnswers(audit.answers);
            return (
              <div key={audit.id} style={{
                background:"#fff",borderRadius:10,border:"1px solid #e2e8f0",
                boxShadow:"0 1px 3px rgba(0,0,0,0.04)",
                display:"flex",alignItems:"center",gap:12,padding:"13px 16px",
                borderLeft:`4px solid ${audit.jcReady?"#22c55e":siteColor(audit.site)}`,
              }}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",marginBottom:3}}>
                    <span style={{fontWeight:700,fontSize:14,color:"#1e293b"}}>
                      {audit.chartLabel||<span style={{color:"#94a3b8",fontStyle:"italic"}}>No label</span>}
                    </span>
                    {audit.jcReady && <span style={{fontSize:10,fontWeight:800,background:"#dcfce7",color:"#166534",padding:"1px 8px",borderRadius:99,border:"1px solid #bbf7d0",letterSpacing:0.5}}>✔ COMPLIANT</span>}
                    <SitePill siteId={audit.site}/>
                    {audit.governingBody && (() => { const gb = GOVERNING_BODIES.find(g=>g.id===audit.governingBody); return gb ? <span style={{fontSize:11,fontWeight:700,padding:"1px 8px",borderRadius:99,background:`${gb.color}18`,color:gb.color,border:`1px solid ${gb.color}33`}}>{gb.short}</span> : null; })()}
                    <span style={{fontSize:11,fontWeight:700,padding:"1px 8px",borderRadius:99,background:audit.loc==="PHP"?"#eff6ff":"#f5f3ff",color:audit.loc==="PHP"?"#1d4ed8":"#7c3aed"}}>{audit.loc}</span>
                    <span style={{fontSize:11,fontWeight:600,padding:"1px 8px",borderRadius:99,background:audit.chartType==="open"?"#ecfdf5":"#fef3c7",color:audit.chartType==="open"?"#059669":"#b45309",textTransform:"capitalize"}}>{audit.chartType}</span>
                  </div>
                  <div style={{fontSize:11,color:"#94a3b8",display:"flex",gap:12,flexWrap:"wrap"}}>
                    {audit.auditorName&&<span>Auditor: {audit.auditorName}</span>}
                    {audit.auditDate&&<span>Date: {audit.auditDate}</span>}
                    <span>Saved: {fmt(audit.savedAt)}</span>
                    <span>{s.passing} pass · {s.failing} fail · {s.pending} pending</span>
                  </div>
                </div>
                <ScoreBadge pct={s.pct}/>
                <div style={{display:"flex",gap:6,flexShrink:0}}>
                  <button onClick={()=>onEdit(audit)} style={{padding:"6px 14px",fontSize:12,fontWeight:700,borderRadius:7,border:"1px solid #3b82f6",background:"#eff6ff",color:"#1d4ed8",cursor:"pointer"}}>Edit</button>
                  <button onClick={()=>onDelete(audit.id)} style={{padding:"6px 10px",fontSize:12,borderRadius:7,border:"1px solid #fecaca",background:"#fff5f5",color:"#ef4444",cursor:"pointer",fontWeight:700}}>✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── AUDIT FORM ───────────────────────────────────────────────────────────────
function AuditForm({ initial, onSave, onCancel }) {
  const [site, setSite] = useState(initial?.site || "loop");
  const [loc, setLoc] = useState(initial?.loc || "PHP");
  const [chartType, setChartType] = useState(initial?.chartType || "open");
  const [chartLabel, setChartLabel] = useState(initial?.chartLabel || "");
  const [auditorName, setAuditorName] = useState(initial?.auditorName || "");
  const [auditDate, setAuditDate] = useState(initial?.auditDate || new Date().toISOString().split("T")[0]);
  const [jcReady, setJcReady] = useState(initial?.jcReady || false);
  const [sectionNotes, setSectionNotes] = useState(initial?.sectionNotes || {});
  const [supervisorNotes, setSupervisorNotes] = useState(initial?.supervisorNotes || {});
  const [qualityScores, setQualityScores] = useState(initial?.qualityScores || {});
  const [governingBody, setGoverningBody] = useState(initial?.governingBody || "jc");
  const [therapistName, setTherapistName] = useState(initial?.therapistName || "");
  const [pinInput, setPinInput] = useState("");
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [expanded, setExpanded] = useState({});

  const checklist = getChecklist(site, loc, chartType);
  const [answers, setAnswers] = useState(() => initial?.answers || buildAnswerMap(getChecklist(initial?.site||"loop", initial?.loc||"PHP", initial?.chartType||"open")));

  const isEdit = !!initial;

  function switchConfig(newSite, newLoc, newType) {
    if (isEdit) return;
    setSite(newSite); setLoc(newLoc); setChartType(newType);
    setAnswers(buildAnswerMap(getChecklist(newSite, newLoc, newType)));
    setExpanded({});
  }

  function setAnswer(key, val) { setAnswers(prev=>({...prev,[key]:prev[key]===val?"pending":val})); }
  function expandAll() { const a={}; checklist.forEach(s=>a[s.section]=true); setExpanded(a); }
  function collapseAll() { setExpanded({}); }

  const score = scoreAnswers(answers);

  function sectionStats(sec) {
    const keys = sec.items.map((_,i)=>`${sec.section}::${i}`);
    const vals = keys.map(k=>answers[k]);
    const app = vals.filter(v=>v!=="pending"&&v!=="na");
    const pass = app.filter(v=>v==="pass").length;
    return { pct:app.length===0?null:Math.round((pass/app.length)*100), allDone:vals.every(v=>v!=="pending"), failing:app.filter(v=>v==="fail").length };
  }

  const siteMeta = SITES.find(s=>s.id===site);

  return (
    <div style={{fontFamily:"'DM Sans','Segoe UI',sans-serif",minHeight:"100vh",background:"#f0f4f8",paddingBottom:80}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#0f172a 0%,#1a3555 100%)",padding:"18px 24px",boxShadow:"0 4px 20px rgba(0,0,0,0.25)"}}>
        <div style={{maxWidth:860,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16}}>
            <div>
              <div style={{fontSize:10,letterSpacing:2.5,color:"#64748b",fontWeight:700,marginBottom:4}}>CLARITY CLINIC — CLINICAL COMPLIANCE</div>
              <div style={{fontSize:20,fontWeight:800,color:"#f1f5f9",letterSpacing:-0.4}}>{isEdit?"Edit Audit":"New Clinical Chart Audit"}</div>
              <div style={{fontSize:12,color:"#64748b",marginTop:3,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <span style={{color:siteMeta?.color,fontWeight:700}}>{siteMeta?.label}</span>
                <span>·</span>
                <span>{loc} · {chartType==="open"?"Open":"Closed"}{chartLabel?` · ${chartLabel}`:""}</span>
                {jcReady&&<span style={{background:"#166534",color:"#bbf7d0",fontSize:10,fontWeight:800,padding:"1px 8px",borderRadius:99,border:"1px solid #22c55e",letterSpacing:0.8}}>✔ JC READY</span>}
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
              <ScoreRing pct={score.pct}/>
              <button onClick={()=>setJcReady(v=>!v)} style={{
                display:"flex",alignItems:"center",gap:5,padding:"4px 12px",borderRadius:20,cursor:"pointer",
                border:jcReady?"1.5px solid #22c55e":"1.5px solid rgba(255,255,255,0.15)",
                background:jcReady?"rgba(34,197,94,0.15)":"rgba(255,255,255,0.05)",
                color:jcReady?"#22c55e":"#64748b",fontSize:11,fontWeight:700,transition:"all 0.15s",
              }}>{jcReady?"✔":"☐"} JC Ready</button>
            </div>
          </div>

          {/* Config */}
          {!isEdit ? (
            <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:14}}>
              {/* Site selector */}
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {SITES.map(s=>(
                  <button key={s.id} onClick={()=>switchConfig(s.id,loc,chartType)} style={{
                    padding:"6px 14px",border:"1.5px solid",cursor:"pointer",fontWeight:700,fontSize:12,borderRadius:8,transition:"all 0.15s",
                    borderColor:site===s.id?s.color:"rgba(255,255,255,0.12)",
                    background:site===s.id?`${s.color}30`:"rgba(255,255,255,0.05)",
                    color:site===s.id?s.color:"#64748b",
                  }}>{s.label}</button>
                ))}
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {/* LOC */}
                <div style={{display:"flex",background:"rgba(255,255,255,0.06)",borderRadius:8,overflow:"hidden",border:"1px solid rgba(255,255,255,0.1)"}}>
                  {["PHP","IOP"].map(l=>(
                    <button key={l} onClick={()=>switchConfig(site,l,chartType)} style={{padding:"6px 20px",border:"none",cursor:"pointer",fontWeight:700,fontSize:13,background:loc===l?"#3b82f6":"transparent",color:loc===l?"#fff":"#64748b",transition:"all 0.15s"}}>{l}</button>
                  ))}
                </div>
                {/* Chart type */}
                <div style={{display:"flex",background:"rgba(255,255,255,0.06)",borderRadius:8,overflow:"hidden",border:"1px solid rgba(255,255,255,0.1)"}}>
                  {[["open","Open Chart","#059669"],["closed","Closed Chart","#b45309"]].map(([v,l,ac])=>(
                    <button key={v} onClick={()=>switchConfig(site,loc,v)} style={{padding:"6px 14px",border:"none",cursor:"pointer",fontWeight:700,fontSize:12,background:chartType===v?ac:"transparent",color:chartType===v?"#fff":"#64748b",transition:"all 0.15s"}}>{l}</button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <span style={{fontSize:12,fontWeight:700,padding:"5px 14px",borderRadius:8,background:`${siteMeta?.color}30`,color:siteMeta?.color,border:`1px solid ${siteMeta?.color}44`}}>{siteMeta?.label}</span>
              <span style={{fontSize:12,fontWeight:700,padding:"5px 14px",borderRadius:8,background:loc==="PHP"?"#3b82f6":"#7c3aed",color:"#fff"}}>{loc}</span>
              <span style={{fontSize:12,fontWeight:700,padding:"5px 14px",borderRadius:8,background:chartType==="open"?"#059669":"#b45309",color:"#fff",textTransform:"capitalize"}}>{chartType}</span>
            </div>
          )}

          {/* Meta fields row 1 */}
          <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
            {[{ph:"Chart ID / Patient Initials",val:chartLabel,set:setChartLabel},{ph:"Auditor name",val:auditorName,set:setAuditorName}].map(({ph,val,set})=>(
              <input key={ph} placeholder={ph} value={val} onChange={e=>set(e.target.value)} style={{fontSize:12,padding:"6px 12px",borderRadius:8,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.07)",color:"#e2e8f0",outline:"none",minWidth:160}}/>
            ))}
            <input type="date" value={auditDate} onChange={e=>setAuditDate(e.target.value)} style={{fontSize:12,padding:"6px 12px",borderRadius:8,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.07)",color:"#cbd5e1",outline:"none"}}/>
            <button onClick={onCancel} style={{marginLeft:"auto",padding:"6px 14px",borderRadius:8,border:"1px solid rgba(255,255,255,0.15)",background:"transparent",color:"#94a3b8",fontSize:12,fontWeight:700,cursor:"pointer"}}>← Back</button>
          </div>
          {/* Meta fields row 2 — governing body + therapist */}
          <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap",alignItems:"center"}}>
            <span style={{fontSize:11,color:"#64748b",fontWeight:600}}>Governing Body:</span>
            {GOVERNING_BODIES.map(gb=>(
              <button key={gb.id} onClick={()=>setGoverningBody(gb.id)} style={{
                padding:"4px 12px",fontSize:11,fontWeight:700,borderRadius:99,cursor:"pointer",
                border:`1.5px solid ${governingBody===gb.id?gb.color:"rgba(255,255,255,0.12)"}`,
                background:governingBody===gb.id?`${gb.color}30`:"rgba(255,255,255,0.05)",
                color:governingBody===gb.id?gb.color:"#64748b",transition:"all 0.12s",
              }}>{gb.short}</button>
            ))}
            <span style={{marginLeft:8,fontSize:11,color:"#64748b",fontWeight:600}}>Therapist:</span>
            {pinUnlocked ? (
              <input placeholder="Therapist name (supervisor only)" value={therapistName} onChange={e=>setTherapistName(e.target.value)}
                style={{fontSize:12,padding:"5px 12px",borderRadius:8,border:"1px solid rgba(34,197,94,0.4)",background:"rgba(34,197,94,0.08)",color:"#86efac",outline:"none",minWidth:180}}/>
            ) : (
              <button onClick={()=>setShowPinPrompt(true)} style={{fontSize:11,padding:"4px 12px",borderRadius:8,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.05)",color:"#64748b",cursor:"pointer",fontWeight:600}}>
                🔒 Supervisor unlock
              </button>
            )}
            {showPinPrompt && !pinUnlocked && (
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <input type="password" placeholder="PIN" value={pinInput} onChange={e=>setPinInput(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter"){if(pinInput===SUPERVISOR_PIN){setPinUnlocked(true);setShowPinPrompt(false);}else{setPinInput("");alert("Incorrect PIN");}}}}
                  style={{fontSize:12,padding:"4px 10px",borderRadius:8,border:"1px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.07)",color:"#e2e8f0",outline:"none",width:80}}/>
                <button onClick={()=>{if(pinInput===SUPERVISOR_PIN){setPinUnlocked(true);setShowPinPrompt(false);}else{setPinInput("");alert("Incorrect PIN");}}}
                  style={{fontSize:11,padding:"4px 10px",borderRadius:6,border:"none",background:"#3b82f6",color:"#fff",cursor:"pointer",fontWeight:700}}>Enter</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div style={{background:"#fff",borderBottom:"1px solid #e2e8f0",padding:"10px 24px"}}>
        <div style={{maxWidth:860,margin:"0 auto",display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
          {[["Pass",score.passing,"#22c55e"],["Fail",score.failing,"#ef4444"],["N/A",score.na,"#94a3b8"],["Pending",score.pending,"#cbd5e1"]].map(([l,v,c])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:5}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:c}}/>
              <span style={{fontSize:12,color:"#64748b"}}>{l}:</span>
              <span style={{fontSize:13,fontWeight:700,color:c}}>{v}</span>
            </div>
          ))}
          <div style={{marginLeft:"auto",display:"flex",gap:6}}>
            {[["Expand all",expandAll],["Collapse all",collapseAll]].map(([l,fn])=>(
              <button key={l} onClick={fn} style={{padding:"5px 12px",fontSize:11,fontWeight:600,borderRadius:6,border:"1px solid #e2e8f0",background:"#f8fafc",color:"#475569",cursor:"pointer"}}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div style={{maxWidth:860,margin:"18px auto 0",padding:"0 16px",display:"flex",flexDirection:"column",gap:10}}>
        {checklist.map(section => {
          const isOpen = expanded[section.section]??false;
          const {pct:sp,allDone,failing} = sectionStats(section);
          const col = SECTION_COLORS[section.section]||"#64748b";
          return (
            <div key={section.section} style={{background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:"1px solid #e8edf2"}}>
              <div onClick={()=>setExpanded(p=>({...p,[section.section]:!p[section.section]}))}
                style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",cursor:"pointer",borderLeft:`4px solid ${col}`,background:isOpen?"#fafbfc":"#fff",userSelect:"none"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:col,flexShrink:0}}/>
                <span style={{fontSize:13,fontWeight:700,color:"#1e293b",flex:1}}>{section.section}</span>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  {allDone&&<span style={{fontSize:10,color:"#22c55e",fontWeight:700,letterSpacing:0.5}}>✓ DONE</span>}
                  {failing>0&&<span style={{fontSize:11,fontWeight:700,padding:"1px 8px",borderRadius:99,background:"#fee2e2",color:"#dc2626"}}>{failing} fail{failing!==1?"s":""}</span>}
                  {qualityScores[section.section] && (() => {
                    const q = qualityScores[section.section];
                    const qc = q==="exceeds"?"#22c55e":q==="meets"?"#f59e0b":"#ef4444";
                    const qb = q==="exceeds"?"#f0fdf4":q==="meets"?"#fffbeb":"#fef2f2";
                    const ql = q==="exceeds"?"Exceeds":q==="meets"?"Meets":"Below";
                    return <span style={{fontSize:10,fontWeight:700,padding:"1px 8px",borderRadius:99,background:qb,color:qc,border:`1px solid ${qc}33`}}>{ql}</span>;
                  })()}
                  {sp!=null&&<ScoreBadge pct={sp} small/>}
                  <span style={{color:"#94a3b8",fontSize:14}}>{isOpen?"▴":"▾"}</span>
                </div>
              </div>
              {isOpen && (
                <div>
                  {section.items.map((item,i)=>{
                    const key=`${section.section}::${i}`;
                    const val=answers[key]||"pending";
                    return (
                      <div key={key} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 16px 9px 20px",borderTop:"1px solid #f1f5f9",
                        background:val==="fail"?"#fff8f8":val==="pass"?"#f8fffc":val==="na"?"#fafafa":"#fff"}}>
                        <span style={{flex:1,fontSize:13,lineHeight:1.5,color:val==="na"?"#94a3b8":"#334155",textDecoration:val==="na"?"line-through":"none"}}>
                          {item.text}
                          {item.na&&val==="pending"&&<span style={{marginLeft:6,fontSize:10,color:"#cbd5e1",fontStyle:"italic"}}>(may be N/A)</span>}
                        </span>
                        <div style={{display:"flex",gap:4,flexShrink:0}}>
                          {[{v:"pass",l:"Pass",ac:"#22c55e",ab:"#f0fdf4"},{v:"fail",l:"Fail",ac:"#ef4444",ab:"#fef2f2"},{v:"na",l:"N/A",ac:"#64748b",ab:"#f1f5f9"}].map(({v,l,ac,ab})=>(
                            <button key={v} onClick={()=>setAnswer(key,v)} style={{padding:"3px 11px",fontSize:11,fontWeight:700,borderRadius:6,cursor:"pointer",
                              border:`1.5px solid ${val===v?ac:"#e2e8f0"}`,background:val===v?ab:"#fff",
                              color:val===v?ac:"#b0bec5",transition:"all 0.1s",letterSpacing:0.3}}>{l}</button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  <div style={{padding:"8px 16px 12px",borderTop:"1px solid #f1f5f9",background:"#fafbfc",display:"flex",flexDirection:"column",gap:6}}>
                    {/* Documentation quality flag */}
                    {(() => {
                      const note = sectionNotes[section.section]||"";
                      const flags = [];
                      if (note.length > 0 && note.length < 15) flags.push("⚠ Note may be too brief");
                      return flags.length > 0 ? (
                        <div style={{fontSize:11,color:"#d97706",fontWeight:600,padding:"3px 8px",background:"#fef3c7",borderRadius:6,border:"1px solid #fde68a"}}>
                          {flags.join(" · ")}
                        </div>
                      ) : null;
                    })()}
                    <input placeholder="Auditor note (deficiencies, follow-up needed)..."
                      value={sectionNotes[section.section]||""}
                      onChange={e=>setSectionNotes(p=>({...p,[section.section]:e.target.value}))}
                      style={{width:"100%",fontSize:12,padding:"5px 10px",border:"1px solid #e2e8f0",borderRadius:6,color:"#475569",background:"#fff",outline:"none",boxSizing:"border-box"}}/>
                    {pinUnlocked && (
                      <div style={{display:"flex",flexDirection:"column",gap:5}}>
                        {/* Quality score */}
                        <div style={{display:"flex",gap:6,alignItems:"center"}}>
                          <span style={{fontSize:11,color:"#64748b",fontWeight:600,flexShrink:0}}>Quality:</span>
                          {[["below","Below Standard","#ef4444","#fef2f2"],["meets","Meets Standard","#f59e0b","#fffbeb"],["exceeds","Exceeds Standard","#22c55e","#f0fdf4"]].map(([v,l,ac,ab])=>(
                            <button key={v}
                              onClick={()=>setQualityScores(p=>({...p,[section.section]:p[section.section]===v?null:v}))}
                              style={{padding:"2px 10px",fontSize:10,fontWeight:700,borderRadius:99,cursor:"pointer",
                                border:`1.5px solid ${qualityScores[section.section]===v?ac:"#e2e8f0"}`,
                                background:qualityScores[section.section]===v?ab:"#fff",
                                color:qualityScores[section.section]===v?ac:"#94a3b8",
                                transition:"all 0.1s"}}>
                              {l}
                            </button>
                          ))}
                        </div>
                        <input placeholder="🔒 Supervisor quality note (visible to supervisors only)..."
                          value={supervisorNotes[section.section]||""}
                          onChange={e=>setSupervisorNotes(p=>({...p,[section.section]:e.target.value}))}
                          style={{width:"100%",fontSize:12,padding:"5px 10px",border:"1px solid #bbf7d0",borderRadius:6,color:"#166534",background:"#f0fdf4",outline:"none",boxSizing:"border-box"}}/>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{maxWidth:860,margin:"16px auto 0",padding:"0 16px"}}>
        {score.pct!=null&&(
          <div style={{borderRadius:12,padding:"14px 20px",marginBottom:12,
            border:`1.5px solid ${score.pct>=90?"#bbf7d0":score.pct>=75?"#fde68a":"#fecaca"}`,
            background:score.pct>=90?"#f0fdf4":score.pct>=75?"#fffbeb":"#fff5f5",
            display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
            <div style={{fontSize:28,fontWeight:900,color:score.pct>=90?"#16a34a":score.pct>=75?"#d97706":"#dc2626"}}>{score.pct}%</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:14,color:"#1e293b"}}>{score.pct>=90?"Survey-Ready":score.pct>=75?"Needs Attention":"Significant Gaps — Action Required"}</div>
              <div style={{fontSize:12,color:"#64748b",marginTop:2}}>{score.passing} pass · {score.failing} fail · {score.na} N/A · {score.pending} pending</div>
            </div>
            {jcReady&&<span style={{fontSize:11,fontWeight:800,background:"#dcfce7",color:"#166534",padding:"3px 12px",borderRadius:99,border:"1px solid #86efac",letterSpacing:0.5}}>✔ FLAGGED: JC READY</span>}
          </div>
        )}
        <button onClick={()=>onSave({site,loc,chartType,chartLabel,auditorName,auditDate,jcReady,answers,sectionNotes,supervisorNotes,qualityScores,governingBody,therapistName})}
          style={{width:"100%",padding:"13px 0",borderRadius:10,border:"none",background:"linear-gradient(135deg,#1d4ed8,#3b82f6)",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",boxShadow:"0 4px 12px rgba(59,130,246,0.35)"}}>
          {isEdit?"Save Changes":"Save Audit to History"}
        </button>
      </div>
    </div>
  );
}

// ─── ANALYTICS DASHBOARD ─────────────────────────────────────────────────────
function AnalyticsDashboard({ audits }) {
  const [filterSite, setFilterSite] = useState("all");
  const [filterGB, setFilterGB] = useState("all");
  const [pinInput, setPinInput] = useState("");
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [showPinPrompt, setShowPinPrompt] = useState(false);

  const subset = audits.filter(a => {
    if (filterSite !== "all" && a.site !== filterSite) return false;
    if (filterGB !== "all" && a.governingBody !== filterGB) return false;
    return true;
  });

  // ── Section scores ──
  function getSectionScores(auditList) {
    const totals = {};
    auditList.forEach(audit => {
      const cl = getChecklist(audit.site, audit.loc, audit.chartType);
      cl.forEach(sec => {
        if (!totals[sec.section]) totals[sec.section] = { pass: 0, fail: 0, na: 0 };
        sec.items.forEach((_, i) => {
          const v = audit.answers[`${sec.section}::${i}`];
          if (v === "pass") totals[sec.section].pass++;
          else if (v === "fail") totals[sec.section].fail++;
          else if (v === "na") totals[sec.section].na++;
        });
      });
    });
    return Object.entries(totals).map(([section, counts]) => {
      const applicable = counts.pass + counts.fail;
      const pct = applicable === 0 ? null : Math.round((counts.pass / applicable) * 100);
      return { section, ...counts, pct, applicable };
    }).filter(s => s.applicable > 0).sort((a, b) => (a.pct ?? 100) - (b.pct ?? 100));
  }

  // ── Top failing items ──
  function getFailingItems(auditList) {
    const counts = {};
    auditList.forEach(audit => {
      const cl = getChecklist(audit.site, audit.loc, audit.chartType);
      cl.forEach(sec => {
        sec.items.forEach((item, i) => {
          const v = audit.answers[`${sec.section}::${i}`];
          const key = `${sec.section}||${item.text}`;
          if (!counts[key]) counts[key] = { text: item.text, section: sec.section, fail: 0, pass: 0, total: 0 };
          if (v === "pass") { counts[key].pass++; counts[key].total++; }
          if (v === "fail") { counts[key].fail++; counts[key].total++; }
        });
      });
    });
    return Object.values(counts)
      .filter(c => c.total > 0)
      .map(c => ({ ...c, failRate: Math.round((c.fail / c.total) * 100) }))
      .filter(c => c.fail > 0)
      .sort((a, b) => b.failRate - a.failRate)
      .slice(0, 15);
  }

  // ── Trend over time ──
  function getTrend(auditList) {
    const sorted = [...auditList]
      .filter(a => scoreAnswers(a.answers).pct !== null)
      .sort((a, b) => new Date(a.savedAt) - new Date(b.savedAt));
    // Group by week
    const weeks = {};
    sorted.forEach(a => {
      const d = new Date(a.savedAt);
      const monday = new Date(d);
      monday.setDate(d.getDate() - d.getDay() + 1);
      const key = monday.toISOString().split("T")[0];
      if (!weeks[key]) weeks[key] = [];
      weeks[key].push(scoreAnswers(a.answers).pct);
    });
    return Object.entries(weeks).map(([week, scores]) => ({
      week,
      avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      count: scores.length,
    }));
  }

  // ── Site comparison ──
  function getSiteComparison() {
    return SITES.map(site => {
      const sa = audits.filter(a => a.site === site.id);
      const scores = sa.map(a => scoreAnswers(a.answers).pct).filter(p => p !== null);
      const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
      const secScores = getSectionScores(sa);
      const weakest = secScores.filter(s => s.pct !== null).slice(0, 3);
      return { ...site, count: sa.length, avg, weakest };
    });
  }

  const sectionScores = getSectionScores(subset);
  const failingItems = getFailingItems(subset);
  const trend = getTrend(subset);
  const siteComparison = getSiteComparison();

  if (audits.length === 0) {
    return (
      <div style={{textAlign:"center",padding:"80px 16px",color:"#94a3b8"}}>
        <div style={{fontSize:40,marginBottom:12}}>📊</div>
        <div style={{fontSize:16,fontWeight:600,marginBottom:6,color:"#475569"}}>No data yet</div>
        <div style={{fontSize:13}}>Complete some audits first — analytics will appear here automatically.</div>
      </div>
    );
  }

  const pctColor = p => p == null ? "#94a3b8" : p >= 90 ? "#16a34a" : p >= 75 ? "#d97706" : "#dc2626";
  const pctBg = p => p == null ? "#f8fafc" : p >= 90 ? "#dcfce7" : p >= 75 ? "#fef3c7" : "#fee2e2";

  // Simple bar chart via divs
  function Bar({ pct, color }) {
    return (
      <div style={{flex:1,height:8,background:"#f1f5f9",borderRadius:99,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct||0}%`,background:color,borderRadius:99,transition:"width 0.4s ease"}}/>
      </div>
    );
  }

  // Sparkline trend
  function Sparkline({ data }) {
    if (data.length < 2) return <div style={{fontSize:12,color:"#94a3b8",padding:"8px 0"}}>Not enough data for trend yet — need audits across at least 2 weeks.</div>;
    const w = 420, h = 80, pad = 12;
    const minV = Math.min(...data.map(d=>d.avg)) - 5;
    const maxV = Math.max(...data.map(d=>d.avg)) + 5;
    const xStep = (w - pad*2) / (data.length - 1);
    const yScale = v => h - pad - ((v - minV) / (maxV - minV)) * (h - pad*2);
    const pts = data.map((d,i) => `${pad + i*xStep},${yScale(d.avg)}`).join(" ");
    const area = `M${pad},${h-pad} ` + data.map((d,i)=>`L${pad+i*xStep},${yScale(d.avg)}`).join(" ") + ` L${pad+(data.length-1)*xStep},${h-pad} Z`;
    return (
      <div style={{overflowX:"auto"}}>
        <svg width={w} height={h} style={{display:"block"}}>
          {[70,80,90,100].map(v=>(
            <g key={v}>
              <line x1={pad} x2={w-pad} y1={yScale(v)} y2={yScale(v)} stroke="#f1f5f9" strokeWidth={1}/>
              <text x={pad-2} y={yScale(v)+4} textAnchor="end" style={{fontSize:9,fill:"#cbd5e1"}}>{v}</text>
            </g>
          ))}
          <path d={area} fill="rgba(59,130,246,0.08)"/>
          <polyline points={pts} fill="none" stroke="#3b82f6" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"/>
          {data.map((d,i)=>(
            <g key={i}>
              <circle cx={pad+i*xStep} cy={yScale(d.avg)} r={4} fill="#3b82f6"/>
              <text x={pad+i*xStep} y={h-1} textAnchor="middle" style={{fontSize:9,fill:"#94a3b8"}}>{d.week.slice(5)}</text>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  return (
    <div style={{maxWidth:960,margin:"0 auto",padding:"24px 16px",display:"flex",flexDirection:"column",gap:20}}>

      {/* Filters row */}
      <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
        <span style={{fontSize:12,fontWeight:700,color:"#64748b"}}>Site:</span>
        {[{id:"all",label:"All Sites",color:"#3b82f6"},...SITES].map(s=>(
          <button key={s.id} onClick={()=>setFilterSite(s.id)} style={{
            padding:"5px 14px",fontSize:11,fontWeight:700,borderRadius:99,cursor:"pointer",
            border:"1.5px solid",borderColor:filterSite===s.id?s.color:"#e2e8f0",
            background:filterSite===s.id?`${s.color}18`:"#fff",
            color:filterSite===s.id?s.color:"#64748b",transition:"all 0.15s",
          }}>{s.label||s.short}</button>
        ))}
        <span style={{fontSize:12,fontWeight:700,color:"#64748b",marginLeft:8}}>Standard:</span>
        {[{id:"all",label:"All",color:"#64748b"},...GOVERNING_BODIES].map(gb=>(
          <button key={gb.id} onClick={()=>setFilterGB(gb.id)} style={{
            padding:"5px 12px",fontSize:11,fontWeight:700,borderRadius:99,cursor:"pointer",
            border:"1.5px solid",borderColor:filterGB===gb.id?gb.color:"#e2e8f0",
            background:filterGB===gb.id?`${gb.color}18`:"#fff",
            color:filterGB===gb.id?gb.color:"#64748b",transition:"all 0.15s",
          }}>{gb.short||gb.label}</button>
        ))}
        <span style={{fontSize:12,color:"#94a3b8",marginLeft:4}}>{subset.length} audit{subset.length!==1?"s":""} in view</span>
      </div>

      {/* Site comparison row */}
      {filterSite === "all" && (
        <div>
          <div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:10}}>Site Comparison</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
            {siteComparison.map(site=>(
              <div key={site.id} onClick={()=>setFilterSite(site.id)} style={{
                background:"#fff",borderRadius:12,padding:"16px 18px",cursor:"pointer",
                border:`1.5px solid ${filterSite===site.id?site.color:"#e2e8f0"}`,
                boxShadow:"0 1px 4px rgba(0,0,0,0.05)",transition:"all 0.15s",
              }}>
                <div style={{fontSize:11,fontWeight:700,color:site.color,letterSpacing:0.8,textTransform:"uppercase",marginBottom:8}}>{site.short}</div>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                  <div style={{fontSize:28,fontWeight:900,color:pctColor(site.avg)}}>{site.avg!=null?`${site.avg}%`:"—"}</div>
                  <div style={{fontSize:11,color:"#94a3b8"}}>{site.count} chart{site.count!==1?"s":""}</div>
                </div>
                {site.weakest.length > 0 && (
                  <div>
                    <div style={{fontSize:10,color:"#94a3b8",fontWeight:600,marginBottom:4}}>WEAKEST SECTIONS</div>
                    {site.weakest.map(s=>(
                      <div key={s.section} style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                        <span style={{fontSize:11,color:"#334155",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.section}</span>
                        <span style={{fontSize:11,fontWeight:700,color:pctColor(s.pct)}}>{s.pct}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trend */}
      <div style={{background:"#fff",borderRadius:12,padding:"18px 20px",border:"1px solid #e2e8f0",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
        <div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:4}}>Compliance Trend Over Time</div>
        <div style={{fontSize:11,color:"#94a3b8",marginBottom:14}}>Average % compliance by week — based on {subset.length} audit{subset.length!==1?"s":""}</div>
        <Sparkline data={trend}/>
      </div>

      {/* Section scorecard */}
      <div style={{background:"#fff",borderRadius:12,padding:"18px 20px",border:"1px solid #e2e8f0",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
        <div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:4}}>Section Scorecard</div>
        <div style={{fontSize:11,color:"#94a3b8",marginBottom:14}}>Ranked lowest to highest — sections at the top need the most attention</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {sectionScores.map(s=>(
            <div key={s.section} style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:SECTION_COLORS[s.section]||"#64748b",flexShrink:0}}/>
              <span style={{fontSize:12,color:"#334155",width:260,flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.section}</span>
              <Bar pct={s.pct} color={pctColor(s.pct)==="#16a34a"?"#22c55e":pctColor(s.pct)==="#d97706"?"#f59e0b":"#ef4444"}/>
              <span style={{fontSize:12,fontWeight:700,color:pctColor(s.pct),width:38,textAlign:"right",flexShrink:0}}>{s.pct}%</span>
              <span style={{fontSize:10,color:"#94a3b8",width:60,flexShrink:0}}>{s.fail} fail{s.fail!==1?"s":""}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top failing items */}
      <div style={{background:"#fff",borderRadius:12,padding:"18px 20px",border:"1px solid #e2e8f0",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
        <div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:4}}>Top Failing Checklist Items</div>
        <div style={{fontSize:11,color:"#94a3b8",marginBottom:14}}>Specific items failing most often — ranked by fail rate</div>
        {failingItems.length === 0
          ? <div style={{fontSize:12,color:"#94a3b8"}}>No failures recorded yet.</div>
          : (
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {failingItems.map((item,i)=>(
              <div key={i} style={{
                padding:"10px 14px",borderRadius:8,
                background:item.failRate>=50?"#fff8f8":item.failRate>=25?"#fffbeb":"#f8fafc",
                border:`1px solid ${item.failRate>=50?"#fecaca":item.failRate>=25?"#fde68a":"#e2e8f0"}`,
              }}>
                <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                  <span style={{fontSize:20,fontWeight:900,color:pctColor(100-item.failRate),lineHeight:1.2,flexShrink:0,width:44}}>{item.failRate}%</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,color:"#1e293b",fontWeight:600,lineHeight:1.4}}>{item.text}</div>
                    <div style={{fontSize:10,color:"#94a3b8",marginTop:2,display:"flex",gap:10}}>
                      <span style={{color:SECTION_COLORS[item.section]||"#64748b",fontWeight:600}}>{item.section}</span>
                      <span>{item.fail} fail{item.fail!==1?"s":""} out of {item.total} answered</span>
                    </div>
                  </div>
                  <div style={{flexShrink:0}}>
                    <div style={{width:52,height:6,background:"#f1f5f9",borderRadius:99,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${item.failRate}%`,background:item.failRate>=50?"#ef4444":item.failRate>=25?"#f59e0b":"#22c55e",borderRadius:99}}/>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Therapist Support Dashboard (PIN-protected) */}
      <div style={{background:"#fff",borderRadius:12,padding:"18px 20px",border:"1px solid #e2e8f0",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
          <div style={{fontSize:13,fontWeight:700,color:"#1e293b"}}>🔒 Therapist Support Tracker</div>
          {!pinUnlocked && (
            <button onClick={()=>setShowPinPrompt(v=>!v)} style={{fontSize:11,padding:"3px 10px",borderRadius:6,border:"1px solid #e2e8f0",background:"#f8fafc",color:"#475569",cursor:"pointer",fontWeight:600}}>
              Supervisor unlock
            </button>
          )}
          {pinUnlocked && <span style={{fontSize:11,color:"#22c55e",fontWeight:700}}>✔ Unlocked</span>}
        </div>
        {showPinPrompt && !pinUnlocked && (
          <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:10}}>
            <input type="password" placeholder="Supervisor PIN" value={pinInput} onChange={e=>setPinInput(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"){if(pinInput===SUPERVISOR_PIN){setPinUnlocked(true);setShowPinPrompt(false);}else{setPinInput("");}}}}
              style={{fontSize:12,padding:"5px 10px",borderRadius:7,border:"1px solid #e2e8f0",outline:"none",width:120}}/>
            <button onClick={()=>{if(pinInput===SUPERVISOR_PIN){setPinUnlocked(true);setShowPinPrompt(false);}else{setPinInput("");}}}
              style={{fontSize:11,padding:"5px 12px",borderRadius:6,border:"none",background:"#3b82f6",color:"#fff",cursor:"pointer",fontWeight:700}}>Enter</button>
          </div>
        )}
        {!pinUnlocked ? (
          <div style={{fontSize:12,color:"#94a3b8",padding:"12px 0"}}>Enter supervisor PIN to view therapist-level documentation patterns.</div>
        ) : (() => {
          // Build therapist data
          const therapistMap = {};
          subset.filter(a=>a.therapistName).forEach(audit => {
            const name = audit.therapistName;
            if (!therapistMap[name]) therapistMap[name] = { name, audits: [] };
            therapistMap[name].audits.push(audit);
          });
          const therapists = Object.values(therapistMap);
          if (therapists.length === 0) return <div style={{fontSize:12,color:"#94a3b8",padding:"8px 0"}}>No therapist names recorded yet in this view.</div>;
          return (
            <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:10}}>
              {therapists.map(t => {
                // Find their weakest sections
                const secScores = {};
                t.audits.forEach(audit => {
                  const cl = getChecklist(audit.site, audit.loc, audit.chartType);
                  cl.forEach(sec => {
                    if (!secScores[sec.section]) secScores[sec.section] = {pass:0,fail:0};
                    sec.items.forEach((_,i) => {
                      const v = audit.answers[`${sec.section}::${i}`];
                      if (v==="pass") secScores[sec.section].pass++;
                      if (v==="fail") secScores[sec.section].fail++;
                    });
                  });
                });
                const weakSections = Object.entries(secScores)
                  .filter(([,c])=>c.fail>0)
                  .map(([sec,c])=>({sec,failRate:Math.round((c.fail/(c.pass+c.fail))*100),fails:c.fail}))
                  .sort((a,b)=>b.failRate-a.failRate).slice(0,4);
                const supNotes = t.audits.flatMap(a=>Object.entries(a.supervisorNotes||{}).map(([sec,note])=>({sec,note,date:a.auditDate}))).filter(n=>n.note);
                const avgPct = (() => { const s=t.audits.map(a=>scoreAnswers(a.answers).pct).filter(p=>p!=null); return s.length?Math.round(s.reduce((a,b)=>a+b,0)/s.length):null; })();
                return (
                  <div key={t.name} style={{background:"#f8fafc",borderRadius:10,padding:"14px 16px",border:"1px solid #e2e8f0"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                      <span style={{fontWeight:700,fontSize:14,color:"#1e293b"}}>{t.name}</span>
                      <span style={{fontSize:11,color:"#64748b"}}>{t.audits.length} chart{t.audits.length!==1?"s":""} audited</span>
                      {avgPct!=null&&<span style={{fontSize:12,fontWeight:700,padding:"1px 8px",borderRadius:99,background:avgPct>=90?"#dcfce7":avgPct>=75?"#fef3c7":"#fee2e2",color:avgPct>=90?"#16a34a":avgPct>=75?"#d97706":"#dc2626"}}>{avgPct}% avg</span>}
                    </div>
                    {weakSections.length > 0 && (
                      <div style={{marginBottom:8}}>
                        <div style={{fontSize:10,color:"#94a3b8",fontWeight:700,letterSpacing:0.8,marginBottom:4}}>DOCUMENTATION GAPS — SUPERVISION FOCUS AREAS</div>
                        {weakSections.map(w=>(
                          <div key={w.sec} style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                            <div style={{width:8,height:8,borderRadius:"50%",background:SECTION_COLORS[w.sec]||"#64748b",flexShrink:0}}/>
                            <span style={{fontSize:12,color:"#334155",flex:1}}>{w.sec}</span>
                            <span style={{fontSize:11,fontWeight:700,color:w.failRate>=50?"#dc2626":w.failRate>=25?"#d97706":"#16a34a"}}>{w.failRate}% fail rate</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {supNotes.length > 0 && (
                      <div>
                        <div style={{fontSize:10,color:"#94a3b8",fontWeight:700,letterSpacing:0.8,marginBottom:4}}>SUPERVISOR QUALITY NOTES</div>
                        {supNotes.slice(0,3).map((n,i)=>(
                          <div key={i} style={{fontSize:12,color:"#475569",padding:"4px 8px",background:"#fff",borderRadius:6,marginBottom:3,borderLeft:"3px solid #22c55e"}}>
                            <span style={{fontWeight:600,color:"#64748b",fontSize:10}}>{n.sec} · {n.date} — </span>{n.note}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* Quality Notes Summary */}
      <div style={{background:"#fff",borderRadius:12,padding:"18px 20px",border:"1px solid #e2e8f0",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
        <div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:4}}>Quality Documentation Notes</div>
        <div style={{fontSize:11,color:"#94a3b8",marginBottom:14}}>All auditor section notes across current view — patterns and recurring concerns</div>
        {(() => {
          const allNotes = subset.flatMap(a =>
            Object.entries(a.sectionNotes||{})
              .filter(([,v])=>v)
              .map(([sec,note])=>({sec,note,label:a.chartLabel||"No label",date:a.auditDate,site:a.site}))
          );
          if (allNotes.length===0) return <div style={{fontSize:12,color:"#94a3b8"}}>No section notes recorded yet.</div>;
          const bySec = {};
          allNotes.forEach(n=>{ if(!bySec[n.sec]) bySec[n.sec]=[]; bySec[n.sec].push(n); });
          return Object.entries(bySec).sort((a,b)=>b[1].length-a[1].length).map(([sec,notes])=>(
            <div key={sec} style={{marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:SECTION_COLORS[sec]||"#64748b"}}/>
                <span style={{fontSize:12,fontWeight:700,color:"#1e293b"}}>{sec}</span>
                <span style={{fontSize:10,color:"#94a3b8"}}>{notes.length} note{notes.length!==1?"s":""}</span>
              </div>
              {notes.slice(0,4).map((n,i)=>(
                <div key={i} style={{fontSize:12,color:"#475569",padding:"5px 10px",background:"#f8fafc",borderRadius:6,marginBottom:3,borderLeft:`3px solid ${SECTION_COLORS[sec]||"#64748b"}`}}>
                  <span style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>{n.label} · {n.date} · {siteShort(n.site)} — </span>{n.note}
                </div>
              ))}
              {notes.length>4&&<div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>+{notes.length-4} more</div>}
            </div>
          ));
        })()}
      </div>

    </div>
  );
}
export default function App() {
  const [page, setPage] = useState("history");
  const [tab, setTab] = useState("history");
  const [audits, setAudits] = useState([]);
  const [editingAudit, setEditingAudit] = useState(null);
  const [storageReady, setStorageReady] = useState(false);

  // Load all audits from Supabase on mount
  useEffect(()=>{
    async function load() {
      try {
        const { data, error } = await supabase.from("audits").select("*").order("saved_at", { ascending: false });
        if (!error && data) {
          setAudits(data.map(row => ({
            id: row.id, site: row.site, loc: row.loc, chartType: row.chart_type,
            chartLabel: row.chart_label, auditorName: row.auditor_name,
            auditDate: row.audit_date, jcReady: row.jc_ready,
            answers: row.answers, sectionNotes: row.section_notes,
            supervisorNotes: row.supervisor_notes || {},
            qualityScores: row.quality_scores || {},
            governingBody: row.governing_body || "jc",
            therapistName: row.therapist_name || "",
            savedAt: row.saved_at,
          })));
        }
      } catch(_) {}
      setStorageReady(true);
    }
    load();
  },[]);

  async function handleSave(data) {
    const row = {
      id: editingAudit ? editingAudit.id : genId(),
      site: data.site, loc: data.loc, chart_type: data.chartType,
      chart_label: data.chartLabel, auditor_name: data.auditorName,
      audit_date: data.auditDate, jc_ready: data.jcReady,
      answers: data.answers, section_notes: data.sectionNotes,
      supervisor_notes: data.supervisorNotes || {},
      quality_scores: data.qualityScores || {},
      governing_body: data.governingBody || "jc",
      therapist_name: data.therapistName || "",
      saved_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("audits").upsert(row);
    if (!error) {
      const mapped = {
        id: row.id, site: row.site, loc: row.loc, chartType: row.chart_type,
        chartLabel: row.chart_label, auditorName: row.auditor_name,
        auditDate: row.audit_date, jcReady: row.jc_ready,
        answers: row.answers, sectionNotes: row.section_notes,
        supervisorNotes: row.supervisor_notes,
        qualityScores: row.quality_scores || {},
        governingBody: row.governing_body,
        therapistName: row.therapist_name,
        savedAt: row.saved_at,
      };
      if (editingAudit) setAudits(p => p.map(a => a.id === editingAudit.id ? mapped : a));
      else setAudits(p => [mapped, ...p]);
    }
    setEditingAudit(null); setPage("history");
  }

  async function handleDelete(id) {
    if (confirm("Delete this audit? This cannot be undone.")) {
      await supabase.from("audits").delete().eq("id", id);
      setAudits(p => p.filter(a => a.id !== id));
    }
  }

  if(page==="new") return <AuditForm onSave={handleSave} onCancel={()=>setPage("history")}/>;
  if(page==="edit"&&editingAudit) return <AuditForm initial={editingAudit} onSave={handleSave} onCancel={()=>{setEditingAudit(null);setPage("history");}}/>;

  return (
    <div style={{fontFamily:"'DM Sans','Segoe UI',sans-serif",minHeight:"100vh",background:"#f0f4f8"}}>
      {/* Nav */}
      <div style={{background:"linear-gradient(135deg,#0f172a 0%,#1a3555 100%)",padding:"16px 24px 0",boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>
        <div style={{maxWidth:960,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,paddingBottom:14}}>
            <div>
              <div style={{fontSize:10,letterSpacing:2.5,color:"#64748b",fontWeight:700}}>CLARITY CLINIC — CLINICAL COMPLIANCE</div>
              <div style={{fontSize:18,fontWeight:800,color:"#f1f5f9",letterSpacing:-0.3,marginTop:2}}>Clinical Chart Audit</div>
              <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap"}}>
                {SITES.map(s=>(
                  <span key={s.id} style={{fontSize:10,fontWeight:700,padding:"2px 10px",borderRadius:99,background:`${s.color}25`,color:s.color,border:`1px solid ${s.color}44`}}>{s.short}</span>
                ))}
              </div>
            </div>
            <button onClick={()=>{setEditingAudit(null);setPage("new");}} style={{padding:"9px 20px",borderRadius:9,border:"none",background:"linear-gradient(135deg,#1d4ed8,#3b82f6)",color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer",boxShadow:"0 2px 8px rgba(59,130,246,0.4)",whiteSpace:"nowrap"}}>
              + New Audit
            </button>
          </div>
          {/* Tab bar */}
          <div style={{display:"flex",gap:2}}>
            {[["history","📋 Audit History"],["analytics","📊 Focus Areas"]].map(([t,l])=>(
              <button key={t} onClick={()=>setTab(t)} style={{
                padding:"8px 20px",border:"none",cursor:"pointer",fontWeight:700,fontSize:13,
                borderRadius:"8px 8px 0 0",transition:"all 0.15s",
                background:tab===t?"#f0f4f8":"transparent",
                color:tab===t?"#1e293b":"#64748b",
                borderBottom:tab===t?"3px solid #3b82f6":"3px solid transparent",
              }}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {!storageReady
        ? <div style={{textAlign:"center",padding:"80px 0",color:"#94a3b8",fontSize:14}}>Loading...</div>
        : tab==="analytics"
          ? <AnalyticsDashboard audits={audits}/>
          : <HistoryView audits={audits} onEdit={a=>{setEditingAudit(a);setPage("edit");}} onDelete={handleDelete}/>
      }
    </div>
  );
}
