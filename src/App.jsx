import { useState, useEffect } from "react";

// ─── SITES ────────────────────────────────────────────────────────────────────
const SITES = [
  { id: "loop",       label: "Chicago Loop",                  short: "Loop",   color: "#3b82f6" },
  { id: "ah_adult",   label: "Arlington Heights — Adult",     short: "AH Adult", color: "#8b5cf6" },
  { id: "ah_adol",    label: "Arlington Heights — Adolescent",short: "AH Adolescent", color: "#ec4899" },
];

// ─── SHARED CHECKLIST SECTIONS (adult) ────────────────────────────────────────
const ADULT_OPEN_PHP = [
  { section: "Consent & Disclosure", items: [
    { text: "Informed consent for treatment signed and dated" },
    { text: "HIPAA Notice of Privacy Practices signed" },
    { text: "ROI forms completed for all applicable parties" },
    { text: "Emergency contact ROI completed" },
    { text: "Financial consent / fee agreement signed" },
    { text: "Mindful movement consent signed" },
    { text: "Consent for telehealth signed (if applicable)", na: true },
    { text: "Consent for specific treatment modalities documented (e.g., EMDR, exposure therapy)", na: true },
  ]},
  { section: "Patient Rights", items: [
    { text: "Patient rights reviewed verbally with patient at admission" },
    { text: "Patient rights document signed by patient" },
    { text: "Grievance process explained and documented" },
    { text: "Right to refuse treatment explained and documented" },
    { text: "Confidentiality rights and limits explained" },
    { text: "Language preference assessed at admission" },
    { text: "Interpreter services offered/provided if needed", na: true },
  ]},
  { section: "Screening & Intake (Biopsychosocial)", items: [
    { text: "Biopsychosocial assessment completed within 24 hrs of admission" },
    { text: "Presenting problem and psychiatric/substance use history documented" },
    { text: "Trauma history assessed" },
    { text: "Cultural and spiritual considerations noted" },
    { text: "Strengths and supports identified" },
    { text: "Diagnosis documented by qualified clinician" },
    { text: "Pain screening completed at admission" },
    { text: "Pain reassessment documented as clinically indicated" },
  ]},
  { section: "Treatment Plan", items: [
    { text: "Master treatment plan completed within 5 business days of admission" },
    { text: "Goals are measurable and patient-centered" },
    { text: "Interventions align with diagnosis and goals" },
    { text: "Patient signature present" },
    { text: "Clinician signature present" },
    { text: "Treatment plan reviewed and updated bi-weekly" },
    { text: "Family/support involvement documented (if applicable)", na: true },
  ]},
  { section: "Psychiatric Evaluation & Medication Management", items: [
    { text: "Initial psychiatric evaluation (60 min) completed within 24 hrs of admission" },
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
    { text: "Late entries identified and labeled per policy" },
  ]},
  { section: "Safety Assessments & Risk Documentation", items: [
    { text: "Safety/risk assessment completed at admission" },
    { text: "Validated suicide risk screening tool used (e.g., C-SSRS) and documented" },
    { text: "C-SSRS or equivalent reassessment documented per policy frequency" },
    { text: "Ongoing risk monitoring documented per policy frequency" },
    { text: "Safety plan documented (if indicated)", na: true },
    { text: "Higher level of care referral documented (if indicated)", na: true },
    { text: "Crisis contacts identified and documented" },
    { text: "Means restriction counseling documented (if applicable)", na: true },
    { text: "Restraint/seclusion not used — documentation confirms absence", na: true },
    { text: "If restraint/seclusion used: full documentation present per JC standards", na: true },
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
];

const ADULT_CLOSED_PHP = [
  { section: "Consent & Disclosure", items: [
    { text: "Informed consent for treatment signed and dated" },
    { text: "HIPAA Notice of Privacy Practices signed" },
    { text: "ROI forms completed for all applicable parties" },
    { text: "Emergency contact ROI completed" },
    { text: "Financial consent / fee agreement signed" },
    { text: "Mindful movement consent signed" },
    { text: "Consent for specific treatment modalities present (if applicable)", na: true },
  ]},
  { section: "Patient Rights", items: [
    { text: "Patient rights document signed by patient" },
    { text: "Grievance process explained and documented" },
    { text: "Right to refuse treatment documented" },
    { text: "Confidentiality rights and limits documented" },
    { text: "Language preference assessed and documented" },
    { text: "Interpreter services provided if needed", na: true },
  ]},
  { section: "Screening & Intake (Biopsychosocial)", items: [
    { text: "Biopsychosocial assessment present and complete" },
    { text: "Diagnosis documented by qualified clinician" },
    { text: "Psychiatric, substance use, and trauma history present" },
    { text: "Pain screening present at admission" },
  ]},
  { section: "Treatment Plan", items: [
    { text: "Master treatment plan completed within 5 business days of admission" },
    { text: "Goals are measurable and patient-centered" },
    { text: "Patient and clinician signatures present" },
    { text: "Bi-weekly treatment plan reviews documented throughout episode" },
    { text: "Treatment plan updated to reflect clinical changes" },
  ]},
  { section: "Psychiatric Evaluation & Medication Management", items: [
    { text: "Initial 60-min psychiatric evaluation present" },
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
    { text: "Safety plan present (if indicated)", na: true },
    { text: "Crisis response or escalation documented (if applicable)", na: true },
    { text: "Restraint/seclusion documentation present if applicable", na: true },
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
];

const ADULT_OPEN_IOP = [
  { section: "Consent & Disclosure", items: [
    { text: "Informed consent for treatment signed and dated" },
    { text: "HIPAA Notice of Privacy Practices signed" },
    { text: "ROI forms completed for all applicable parties" },
    { text: "Emergency contact ROI completed" },
    { text: "Financial consent / fee agreement signed" },
    { text: "Mindful movement consent signed" },
    { text: "Consent for telehealth signed (if applicable)", na: true },
    { text: "Consent for specific treatment modalities documented (e.g., EMDR, exposure therapy)", na: true },
  ]},
  { section: "Patient Rights", items: [
    { text: "Patient rights reviewed verbally with patient at admission" },
    { text: "Patient rights document signed by patient" },
    { text: "Grievance process explained and documented" },
    { text: "Right to refuse treatment explained and documented" },
    { text: "Confidentiality rights and limits explained" },
    { text: "Language preference assessed at admission" },
    { text: "Interpreter services offered/provided if needed", na: true },
  ]},
  { section: "Screening & Intake (Biopsychosocial)", items: [
    { text: "Biopsychosocial assessment completed within required timeframe" },
    { text: "Presenting problem and psychiatric/substance use history documented" },
    { text: "Trauma history assessed" },
    { text: "Diagnosis documented by qualified clinician" },
    { text: "Strengths and supports identified" },
    { text: "Pain screening completed at admission" },
    { text: "Pain reassessment documented as clinically indicated" },
  ]},
  { section: "Treatment Plan", items: [
    { text: "Master treatment plan completed within 5 business days of admission" },
    { text: "Goals are measurable and patient-centered" },
    { text: "Interventions align with diagnosis and goals" },
    { text: "Patient signature present" },
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
    { text: "Safety plan documented (if indicated)", na: true },
    { text: "Crisis contacts identified and documented" },
    { text: "Higher level of care referral documented (if indicated)", na: true },
    { text: "Restraint/seclusion not used — documentation confirms absence", na: true },
    { text: "If restraint/seclusion used: full documentation present per JC standards", na: true },
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
];

const ADULT_CLOSED_IOP = [
  { section: "Consent & Disclosure", items: [
    { text: "Informed consent for treatment signed and dated" },
    { text: "HIPAA Notice of Privacy Practices signed" },
    { text: "ROI forms completed for all applicable parties" },
    { text: "Emergency contact ROI completed" },
    { text: "Financial consent / fee agreement signed" },
    { text: "Mindful movement consent signed" },
    { text: "Consent for specific treatment modalities present (if applicable)", na: true },
  ]},
  { section: "Patient Rights", items: [
    { text: "Patient rights document signed by patient" },
    { text: "Grievance process explained and documented" },
    { text: "Right to refuse treatment documented" },
    { text: "Confidentiality rights and limits documented" },
    { text: "Language preference assessed and documented" },
    { text: "Interpreter services provided if needed", na: true },
  ]},
  { section: "Screening & Intake (Biopsychosocial)", items: [
    { text: "Biopsychosocial assessment present and complete" },
    { text: "Diagnosis documented by qualified clinician" },
    { text: "Psychiatric and substance use history documented" },
    { text: "Pain screening present at admission" },
  ]},
  { section: "Treatment Plan", items: [
    { text: "Master treatment plan completed within 5 business days of admission" },
    { text: "Patient and clinician signatures present" },
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
    { text: "Safety plan present (if indicated)", na: true },
    { text: "Crisis response documented (if applicable)", na: true },
    { text: "Restraint/seclusion documentation present if applicable", na: true },
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
];

// ─── MASTER CHECKLIST LOOKUP ──────────────────────────────────────────────────
// AH Adolescent uses the same checklist as adult — site is a tag only
function getChecklist(site, loc, chartType) {
  const map = {
    PHP: { open: ADULT_OPEN_PHP, closed: ADULT_CLOSED_PHP },
    IOP: { open: ADULT_OPEN_IOP, closed: ADULT_CLOSED_IOP },
  };
  return map[loc]?.[chartType] || ADULT_OPEN_PHP;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const SECTION_COLORS = {
  "Consent & Disclosure": "#6366f1",
  "Patient Rights": "#a855f7",
  "Screening & Intake (Biopsychosocial)": "#0ea5e9",
  "Treatment Plan": "#10b981",
  "Psychiatric Evaluation & Medication Management": "#f59e0b",
  "Individual Therapy Sessions": "#ec4899",
  "Group Notes": "#8b5cf6",
  "Safety Assessments & Risk Documentation": "#ef4444",
  "Authorizations & Medical Necessity": "#f97316",
  "Adverse Events & Incident Reporting": "#64748b",
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
  const rows = [["Chart ID","Site","LOC","Type","Auditor","Audit Date","Score %","Passing","Failing","N/A","Pending","JC Ready","Saved At"]];
  audits.forEach(a => {
    const s = scoreAnswers(a.answers);
    rows.push([a.chartLabel||"", siteLabel(a.site), a.loc, a.chartType, a.auditorName||"",
      a.auditDate||"", s.pct!=null?`${s.pct}%`:"—", s.passing, s.failing, s.na, s.pending,
      a.jcReady?"Yes":"No", fmt(a.savedAt)]);
  });
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], {type:"text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download="clarity_jc_audits.csv"; a.click();
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
                    {audit.jcReady && <span style={{fontSize:10,fontWeight:800,background:"#dcfce7",color:"#166534",padding:"1px 8px",borderRadius:99,border:"1px solid #bbf7d0",letterSpacing:0.5}}>✔ JC READY</span>}
                    <SitePill siteId={audit.site}/>
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
              <div style={{fontSize:10,letterSpacing:2.5,color:"#64748b",fontWeight:700,marginBottom:4}}>CLARITY CLINIC — HLOC COMPLIANCE</div>
              <div style={{fontSize:20,fontWeight:800,color:"#f1f5f9",letterSpacing:-0.4}}>{isEdit?"Edit Audit":"New Chart Audit"}</div>
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

          {/* Meta fields */}
          <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
            {[{ph:"Chart ID / Patient Initials",val:chartLabel,set:setChartLabel},{ph:"Auditor name",val:auditorName,set:setAuditorName}].map(({ph,val,set})=>(
              <input key={ph} placeholder={ph} value={val} onChange={e=>set(e.target.value)} style={{fontSize:12,padding:"6px 12px",borderRadius:8,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.07)",color:"#e2e8f0",outline:"none",minWidth:160}}/>
            ))}
            <input type="date" value={auditDate} onChange={e=>setAuditDate(e.target.value)} style={{fontSize:12,padding:"6px 12px",borderRadius:8,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.07)",color:"#cbd5e1",outline:"none"}}/>
            <button onClick={onCancel} style={{marginLeft:"auto",padding:"6px 14px",borderRadius:8,border:"1px solid rgba(255,255,255,0.15)",background:"transparent",color:"#94a3b8",fontSize:12,fontWeight:700,cursor:"pointer"}}>← Back</button>
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
                  <div style={{padding:"8px 16px 12px",borderTop:"1px solid #f1f5f9",background:"#fafbfc"}}>
                    <input placeholder="Section note (deficiencies, follow-up needed)..."
                      value={sectionNotes[section.section]||""}
                      onChange={e=>setSectionNotes(p=>({...p,[section.section]:e.target.value}))}
                      style={{width:"100%",fontSize:12,padding:"5px 10px",border:"1px solid #e2e8f0",borderRadius:6,color:"#475569",background:"#fff",outline:"none",boxSizing:"border-box"}}/>
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
        <button onClick={()=>onSave({site,loc,chartType,chartLabel,auditorName,auditDate,jcReady,answers,sectionNotes})}
          style={{width:"100%",padding:"13px 0",borderRadius:10,border:"none",background:"linear-gradient(135deg,#1d4ed8,#3b82f6)",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",boxShadow:"0 4px 12px rgba(59,130,246,0.35)"}}>
          {isEdit?"Save Changes":"Save Audit to History"}
        </button>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
const STORAGE_KEY = "clarity_jc_audits_v2";

export default function App() {
  const [page, setPage] = useState("history");
  const [audits, setAudits] = useState([]);
  const [editingAudit, setEditingAudit] = useState(null);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(()=>{
    async function load() {
      try { const r=await window.storage.get(STORAGE_KEY,true); if(r?.value) setAudits(JSON.parse(r.value)); } catch(_){}
      setStorageReady(true);
    }
    load();
  },[]);

  useEffect(()=>{
    if(!storageReady) return;
    async function save() { try { await window.storage.set(STORAGE_KEY,JSON.stringify(audits),true); } catch(_){} }
    save();
  },[audits,storageReady]);

  function handleSave(data) {
    if(editingAudit) setAudits(p=>p.map(a=>a.id===editingAudit.id?{...a,...data,savedAt:new Date().toISOString()}:a));
    else setAudits(p=>[...p,{...data,id:genId(),savedAt:new Date().toISOString()}]);
    setEditingAudit(null); setPage("history");
  }

  function handleDelete(id) {
    if(confirm("Delete this audit? This cannot be undone.")) setAudits(p=>p.filter(a=>a.id!==id));
  }

  if(page==="new") return <AuditForm onSave={handleSave} onCancel={()=>setPage("history")}/>;
  if(page==="edit"&&editingAudit) return <AuditForm initial={editingAudit} onSave={handleSave} onCancel={()=>{setEditingAudit(null);setPage("history");}}/>;

  return (
    <div style={{fontFamily:"'DM Sans','Segoe UI',sans-serif",minHeight:"100vh",background:"#f0f4f8"}}>
      <div style={{background:"linear-gradient(135deg,#0f172a 0%,#1a3555 100%)",padding:"16px 24px",boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>
        <div style={{maxWidth:960,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}}>
          <div>
            <div style={{fontSize:10,letterSpacing:2.5,color:"#64748b",fontWeight:700}}>CLARITY CLINIC — HLOC COMPLIANCE</div>
            <div style={{fontSize:18,fontWeight:800,color:"#f1f5f9",letterSpacing:-0.3,marginTop:2}}>Joint Commission Chart Audit</div>
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
      </div>
      {!storageReady
        ? <div style={{textAlign:"center",padding:"80px 0",color:"#94a3b8",fontSize:14}}>Loading audit history...</div>
        : <HistoryView audits={audits} onEdit={a=>{setEditingAudit(a);setPage("edit");}} onDelete={handleDelete}/>
      }
    </div>
  );
}
