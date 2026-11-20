export type Persona = "priya" | "daniel" | "mei";
export type Source = "Email" | "Slack" | "Teams" | "Doc" | "Meeting notes" | "Calendar" | "CRM" | "Jira";

export const DEMO_DATE = "Tue 17 Nov 2026";
export const COMPANY = "Northwind Cloud";

export const PERSONAS: Record<Persona, { name: string; title: string; initials: string; badge: string; banner: string }> = {
  priya: {
    name: "Priya Raman",
    title: "Director of Product",
    initials: "PR",
    badge: "User",
    banner: "You're viewing Relay as Priya Raman, Director of Product: your personal workspace. Only you can see your data.",
  },
  daniel: {
    name: "Daniel Okafor",
    title: "CIO",
    initials: "DO",
    badge: "Buyer · CIO",
    banner: "You're viewing Relay as Daniel Okafor, CIO: value view. Aggregated metrics only; no access to employee content.",
  },
  mei: {
    name: "Mei Lin",
    title: "CISO",
    initials: "ML",
    badge: "Security · CISO",
    banner: "You're viewing Relay as Mei Lin, CISO: governance view. Agent metadata and audit events only; no access to employee content.",
  },
};

export type QueueType = "reply" | "review" | "unblock" | "nudge";
export interface QueueItem {
  id: string;
  type: QueueType;
  title: string;
  from: string;
  where: Source;
  age: string;
  sources: Source[];
  why: string;
  reason?: string;
  status: "open" | "done" | "snoozed" | "delegated";
  snoozeLabel?: string;
}

export const QUEUE: Omit<QueueItem, "status">[] = [
  { id: "q1", type: "review", title: "Decide EU tier pricing for the QBR deck", from: "Rachel Gomez (VP)", where: "Email", age: "2h", sources: ["Email", "Slack", "Meeting notes"], reason: "CFO needs your pricing decision before the 11:00 QBR", why: "Your VP asked for this, it blocks a leadership meeting in under 2 hours, and the CFO followed up in #exec-pricing." },
  { id: "q2", type: "reply", title: "Reply to Acme Corp on SSO rollout date", from: "Dana Wells, Acme Corp", where: "Email", age: "1d", sources: ["Email", "CRM"], why: "Key account, renewal call at 10:00 today, and this has waited 1 day." },
  { id: "q3", type: "unblock", title: "Approve Kenji's API rate-limit spec", from: "Kenji Sato", where: "Doc", age: "2d", sources: ["Doc", "Jira"], why: "Kenji's sprint work is blocked on your sign-off. Two tickets depend on it." },
  { id: "q4", type: "review", title: "Review Q1 roadmap draft comments", from: "Sofia Marin", where: "Doc", age: "5h", sources: ["Doc"], why: "Sofia tagged you on 3 comments needing a decision." },
  { id: "q5", type: "nudge", title: "Churn analysis from Max is 1 week late", from: "Max Hoffmann", where: "Meeting notes", age: "7d", sources: ["Meeting notes", "Slack"], why: "Max committed to this in the 10 Nov staff meeting. You need it for Friday's Sales review." },
  { id: "q6", type: "reply", title: "Globex asks for roadmap preview", from: "Leo Brandt, Globex", where: "Email", age: "3h", sources: ["Email", "CRM"], why: "Key account, external. Draft ready for approval." },
  { id: "q7", type: "unblock", title: "Hannah needs headcount answer for design contractor", from: "Hannah Okoye", where: "Slack", age: "1d", sources: ["Slack"], why: "Hannah's hiring request expires Friday." },
  { id: "q8", type: "reply", title: "Finance: confirm Q4 tooling budget line", from: "Omar Reyes, Finance", where: "Email", age: "2d", sources: ["Email"], why: "Waiting on you for 2 days; finance close is Thursday." },
  { id: "q9", type: "review", title: "Sign off release notes for 4.12", from: "Tom Becker", where: "Jira", age: "4h", sources: ["Jira", "Doc"], why: "Release goes out tomorrow at 09:00." },
  { id: "q10", type: "nudge", title: "Initech security questionnaire from Leila", from: "Leila Haddad", where: "Email", age: "4d", sources: ["Email"], why: "Leila said it would be done Friday. Initech deal review is next week." },
  { id: "q11", type: "reply", title: "Rachel: one-line update on platform OKR", from: "Rachel Gomez (VP)", where: "Teams", age: "6h", sources: ["Teams"], why: "Your VP asked for a one-liner by end of day." },
  { id: "q12", type: "review", title: "Approve Arjun's onboarding flow experiment", from: "Arjun Mehta", where: "Doc", age: "1d", sources: ["Doc", "Slack"], why: "Experiment start depends on your approval." },
  { id: "q13", type: "unblock", title: "Nadia waiting on access to pricing data", from: "Nadia Petrova", where: "Slack", age: "8h", sources: ["Slack"], why: "Nadia can't finish the pricing model without it." },
  { id: "q14", type: "reply", title: "Accept or decline the offsite agenda", from: "Rachel Gomez (VP)", where: "Calendar", age: "1d", sources: ["Calendar", "Email"], why: "RSVP closes tomorrow." },
  { id: "q15", type: "review", title: "Skim customer advisory board notes", from: "Sofia Marin", where: "Meeting notes", age: "2d", sources: ["Meeting notes"], why: "Two items mention your roadmap area." },
];

export interface Meeting {
  id: string;
  title: string;
  time: string;
  end: string;
  day: string;
  past?: boolean;
  status: "Pre-read received" | "No materials yet" | "Brief ready";
  context: string;
  attendees: { name: string; role: string; last: string }[];
  dontMiss: { text: string; source: Source }[];
  preRead?: { title: string; pages: number; summary: string; highlights: { text: string; page: number }[] };
  threads: string[];
  openItems: string[];
  decisions: string[];
  questions: string[];
  grade?: { hit: number; total: number; missed: string; nextTime: string[] };
}

const commonAttendees = [
  { name: "Rachel Gomez", role: "VP Product", last: "1:1 yesterday" },
  { name: "Omar Reyes", role: "Finance Partner", last: "Email 2 days ago" },
];

export const MEETINGS: Meeting[] = [
  { id: "m1", title: "Product staff sync", time: "09:00", end: "09:30", day: "Today", status: "Brief ready", context: "Roadmap comments and Kenji's blocked spec.",
    attendees: [{ name: "Sofia Marin", role: "PM, Growth", last: "Doc comment 5h ago" }, { name: "Kenji Sato", role: "Tech Lead", last: "Slack 2 days ago" }, { name: "Max Hoffmann", role: "Analyst", last: "Staff meeting 10 Nov" }],
    dontMiss: [{ text: "Kenji's spec is blocking 2 tickets", source: "Jira" }, { text: "Max's churn analysis is a week late", source: "Meeting notes" }, { text: "Sofia needs a call on Q1 scope", source: "Doc" }],
    threads: ["#product-staff: sprint risks", "Roadmap v3 comments", "Rate-limit spec review"], openItems: ["PLAT-412 rate limits", "PLAT-418 quota UI"], decisions: ["Q1 scope cut"], questions: ["What would unblock Kenji today?", "Can Max share a partial churn cut by Thursday?"] },
  { id: "m2", title: "Acme Corp renewal call", time: "10:00", end: "10:45", day: "Today", status: "Pre-read received", context: "$420k renewal; SSO rollout date is the open question.",
    attendees: [{ name: "Dana Wells", role: "VP IT, Acme Corp", last: "Email 1 day ago" }, { name: "Chris Vance", role: "Account Exec, Northwind", last: "Slack 3h ago" }, { name: "Arjun Mehta", role: "PM, Identity", last: "Standup today" }],
    dontMiss: [{ text: "Dana is waiting on an SSO rollout date (asked twice)", source: "Email" }, { text: "Acme raised 3 P2 tickets this month, 1 still open", source: "Jira" }, { text: "Renewal is $420k; Chris wants a 2-year term", source: "CRM" }, { text: "Acme's new CISO starts in December", source: "Slack" }],
    preRead: { title: "Acme Corp account review Q4.pdf", pages: 24, summary: "Usage up 18% QoQ, seats flat. Main risk is identity: Acme wants SCIM and SSO enforcement before expanding to 2 more business units.", highlights: [{ text: "SSO enforcement is a renewal condition", page: 7 }, { text: "Expansion to 2 BUs worth ~$140k", page: 12 }, { text: "Support satisfaction dipped to 78%", page: 18 }] },
    threads: ["Re: SSO timeline", "Acme P2: export timeout", "#acme-renewal deal room", "QBR prep notes", "Pricing exception request"], openItems: ["SUP-2231 export timeout (open)", "SSO enforcement GA date"], decisions: ["Commit to SSO date or not", "2-year term discount"], questions: ["What would make SSO enforcement a 'yes' for the new CISO?", "Which 2 business units are first?", "Is a Q1 SSO date enough to sign this quarter?"],
    grade: { hit: 2, total: 4, missed: "Pricing for the EU tier was the real debate", nextTime: ["Pull pricing threads from #deal-desk for renewals", "Weight finance attendees' recent emails higher"] } },
  { id: "m3", title: "QBR: Pricing & packaging", time: "11:00", end: "12:00", day: "Today", status: "Brief ready", context: "CFO wants your EU tier decision.",
    attendees: [...commonAttendees, { name: "Laura Kim", role: "CFO", last: "Slack 2h ago" }],
    dontMiss: [{ text: "CFO expects a decision on EU tier pricing", source: "Slack" }, { text: "Option B is 6% margin-positive", source: "Doc" }, { text: "Sales prefers Option A for Globex", source: "Email" }],
    threads: ["#exec-pricing", "EU tier model v4", "Sales feedback on packaging"], openItems: ["EU tier price point"], decisions: ["EU tier: Option A or B"], questions: ["What is the churn risk at Option B?", "Can we grandfather current EU customers?"] },
  { id: "m4", title: "1:1 with Hannah", time: "13:30", end: "14:00", day: "Today", status: "No materials yet", context: "Design contractor headcount.",
    attendees: [{ name: "Hannah Okoye", role: "Design Lead", last: "Slack 1 day ago" }],
    dontMiss: [{ text: "Contractor request expires Friday", source: "Slack" }, { text: "Hannah asked about a promo timeline last 1:1", source: "Meeting notes" }],
    threads: ["Contractor request"], openItems: [], decisions: ["Contractor: yes/no"], questions: ["What's the impact if we wait a quarter?"] },
  { id: "m5", title: "Globex roadmap preview", time: "15:00", end: "15:45", day: "Today", status: "No materials yet", context: "External; keep forward-looking items vague.",
    attendees: [{ name: "Leo Brandt", role: "Director Eng, Globex", last: "Email 3h ago" }],
    dontMiss: [{ text: "Leo asked about API limits twice", source: "Email" }, { text: "Avoid committing dates externally", source: "Doc" }],
    threads: ["Globex: roadmap preview"], openItems: [], decisions: [], questions: ["Which API limits matter for their batch jobs?"] },
  { id: "m6", title: "Sales review: top accounts", time: "10:00", end: "11:00", day: "Fri", status: "No materials yet", context: "Relay is researching 6 accounts.",
    attendees: [{ name: "Chris Vance", role: "Account Exec", last: "Slack 3h ago" }],
    dontMiss: [{ text: "Need churn analysis from Max", source: "Meeting notes" }], threads: [], openItems: [], decisions: [], questions: [] },
  { id: "m7", title: "Roadmap working session", time: "14:00", end: "16:00", day: "Thu", status: "No materials yet", context: "Focus block with Sofia.",
    attendees: [{ name: "Sofia Marin", role: "PM, Growth", last: "Doc 5h ago" }], dontMiss: [{ text: "Bring Q1 scope cut decision", source: "Doc" }], threads: [], openItems: [], decisions: [], questions: [] },
  { id: "m8", title: "Initech deal review", time: "16:00", end: "16:30", day: "Mon (past)", past: true, status: "Brief ready", context: "Security questionnaire outstanding.",
    attendees: [{ name: "Leila Haddad", role: "Solutions Eng", last: "Email 4 days ago" }],
    dontMiss: [{ text: "Questionnaire due Friday", source: "Email" }, { text: "Initech wants EU hosting", source: "CRM" }, { text: "Champion is leaving", source: "Slack" }],
    threads: [], openItems: [], decisions: [], questions: [],
    grade: { hit: 3, total: 3, missed: "Nothing major. Hosting region came up early.", nextTime: ["Keep CRM notes in the top 3"] } },
];

export interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  reason: string;
  waitingDays: number;
  external: boolean;
  received: string;
  draft?: string;
  draftStatus?: "pending" | "sent" | "approved" | "rejected";
  quarantined?: boolean;
}

export const EMAILS: Email[] = [
  { id: "e1", from: "Rachel Gomez", subject: "EU tier: need your call before QBR", snippet: "Laura wants a firm recommendation at 11…", reason: "From your VP", waitingDays: 0, external: false, received: "07:12", draft: "Rachel, my call is Option B: 6% margin-positive, and we grandfather current EU customers for 12 months. I'll walk through the churn risk at 11.\n\nThanks, P", draftStatus: "pending" },
  { id: "e2", from: "Dana Wells (Acme Corp)", subject: "SSO rollout date?", snippet: "Following up again on the enforcement date…", reason: "Customer escalation", waitingDays: 1, external: true, received: "Mon", draft: "Hi Dana,\n\nSSO enforcement is planned for general availability in Q1. I'll confirm the exact week on today's call.\n\nThanks, Priya", draftStatus: "pending" },
  { id: "e3", from: "Omar Reyes", subject: "Q4 tooling budget line", snippet: "Can you confirm the $38k line…", reason: "Waiting on you 2 days", waitingDays: 2, external: false, received: "Sun", draft: "Omar, confirmed: keep the $38k line as is. Two tools renew in December.\n\nThanks, P", draftStatus: "pending" },
  { id: "e4", from: "Leo Brandt (Globex)", subject: "Roadmap preview", snippet: "Could you share what's coming for API limits…", reason: "Key account", waitingDays: 0, external: true, received: "06:40", draft: "Hi Leo,\n\nHappy to walk through it at 15:00 today. API limits are a focus area for next quarter; I'll cover what we can share.\n\nBest, Priya", draftStatus: "pending" },
  { id: "e5", from: "Kenji Sato", subject: "Rate-limit spec: sign-off?", snippet: "Blocked on this for PLAT-412…", reason: "Blocking your team", waitingDays: 2, external: false, received: "Sun", draft: "Kenji, approved with one change: keep burst limit at 2x. Go ahead with PLAT-412.\n\nThanks, P", draftStatus: "pending" },
  { id: "e6", from: "Tom Becker", subject: "4.12 release notes", snippet: "Final draft attached…", reason: "Deadline within 24h", waitingDays: 0, external: false, received: "09:02", draft: "Tom, looks good. Move the rate-limit note to the top.\n\nThanks, P", draftStatus: "pending" },
  { id: "e7", from: "Leila Haddad", subject: "Initech questionnaire progress", snippet: "About 60% done…", reason: "Commitment due soon", waitingDays: 0, external: false, received: "08:15" },
  { id: "e8", from: "Laura Kim (CFO)", subject: "Pricing model v4", snippet: "Shared the latest model…", reason: "From leadership", waitingDays: 0, external: false, received: "07:50" },
  { id: "e9", from: "Hannah Okoye", subject: "Contractor request", snippet: "Recap ahead of our 1:1…", reason: "Blocking your team", waitingDays: 1, external: false, received: "Mon" },
  { id: "e10", from: "Chris Vance", subject: "Acme: 2-year term?", snippet: "What do you think about…", reason: "Key account", waitingDays: 0, external: false, received: "08:30" },
  { id: "e11", from: "Arjun Mehta", subject: "Onboarding experiment", snippet: "Ready to start Monday…", reason: "Waiting on your approval", waitingDays: 1, external: false, received: "Mon" },
  { id: "e12", from: "Rachel Gomez", subject: "Offsite agenda", snippet: "RSVP by Wednesday…", reason: "From your VP", waitingDays: 1, external: false, received: "Mon" },
];

export const DRAFT_DIFF = {
  draft: ["Hi Omar,", "I hope you're having a great week!", "Just wanted to confirm that we can keep the $38k line as it is.", "Let me know if you need anything else!", "Best regards,", "Priya"],
  sent: ["Omar, confirmed: keep the $38k line as is.", "Two tools renew in December.", "Thanks, P"],
};

export interface Rule { id: string; text: string; status: "learned" | "kept" }
export const LEARNED_RULES: Rule[] = [
  { id: "r1", text: "You open with the decision, not pleasantries", status: "learned" },
  { id: "r2", text: "You sign off with 'Thanks, P' internally", status: "learned" },
  { id: "r3", text: "You avoid exclamation marks", status: "learned" },
  { id: "r4", text: "You add the reason in one short sentence", status: "learned" },
];

export interface Commitment {
  id: string;
  direction: "owed" | "owe";
  who: string;
  what: string;
  source: Source;
  promised: string;
  status: "On track" | "Due soon" | "Overdue" | "Done";
  nudged?: boolean;
}
export const COMMITMENTS: Commitment[] = [
  { id: "c1", direction: "owed", who: "Max Hoffmann", what: "Churn analysis for Sales review", source: "Meeting notes", promised: "Tue 10 Nov", status: "Overdue" },
  { id: "c2", direction: "owed", who: "Leila Haddad", what: "Initech security questionnaire", source: "Email", promised: "Fri 20 Nov", status: "Due soon" },
  { id: "c3", direction: "owed", who: "Kenji Sato", what: "Rate-limit load test results", source: "Slack", promised: "Mon 23 Nov", status: "On track" },
  { id: "c4", direction: "owed", who: "Chris Vance", what: "Acme expansion forecast", source: "Slack", promised: "Fri 13 Nov", status: "Overdue" },
  { id: "c5", direction: "owed", who: "Sofia Marin", what: "Q1 roadmap v4", source: "Doc", promised: "Thu 19 Nov", status: "On track" },
  { id: "c6", direction: "owe", who: "Rachel Gomez", what: "One-line platform OKR update", source: "Teams", promised: "Today", status: "Due soon" },
  { id: "c7", direction: "owe", who: "Dana Wells (Acme)", what: "SSO enforcement date", source: "Email", promised: "Mon 16 Nov", status: "Overdue" },
  { id: "c8", direction: "owe", who: "Hannah Okoye", what: "Contractor headcount answer", source: "Slack", promised: "Fri 20 Nov", status: "Due soon" },
  { id: "c9", direction: "owe", who: "Omar Reyes", what: "Confirm tooling budget", source: "Email", promised: "Wed 18 Nov", status: "On track" },
  { id: "c10", direction: "owe", who: "Arjun Mehta", what: "Feedback on onboarding experiment", source: "Doc", promised: "Thu 19 Nov", status: "On track" },
];

export interface Approval { id: string; action: string; target: string; preview: string; risk: "Low" | "Medium" | "High"; why: string; status: "pending" | "approved" | "rejected" }
export const APPROVALS: Approval[] = ([
  { id: "a1", action: "Send external email", target: "Dana Wells, Acme Corp", preview: "SSO enforcement is planned for general availability in Q1…", risk: "Medium", why: "Dana has asked twice and the renewal call is at 10:00. External email always needs your approval." },
  { id: "a2", action: "Update CRM field", target: "Acme Corp · Renewal stage → 'Commit'", preview: "Stage: Negotiation → Commit", risk: "Low", why: "Chris marked verbal agreement in #acme-renewal. CRM writes are at L3: approval required." },
] as Omit<Approval, "status">[]).map((a) => ({ ...a, status: "pending" as const }));

export interface TrustClass { id: string; name: string; level: number; max: number; evalPass: number; accept: number; pending?: boolean }
export const LEVELS = ["L0 Observe", "L1 Brief", "L2 Draft", "L3 Act with approval", "L4 Act within policy"];
export const TRUST: TrustClass[] = [
  { id: "t1", name: "Accept internal meeting invites", level: 4, max: 4, evalPass: 98, accept: 96 },
  { id: "t2", name: "Send internal replies", level: 2, max: 3, evalPass: 94, accept: 88 },
  { id: "t3", name: "Send external email", level: 2, max: 3, evalPass: 86, accept: 71 },
  { id: "t4", name: "Update CRM fields", level: 3, max: 3, evalPass: 92, accept: 90 },
  { id: "t5", name: "Decline meetings", level: 1, max: 3, evalPass: 81, accept: 64 },
];

export interface MemoryFact { id: string; group: string; text: string; source: Source; learned: string; origin: "Stated" | "Inferred" }
export const MEMORY: MemoryFact[] = [
  { id: "f1", group: "Preferences", text: "Keep 09:00–11:00 Thursdays free for deep work", source: "Calendar", learned: "3 Nov", origin: "Stated" },
  { id: "f2", group: "Preferences", text: "Prefers briefs under 150 words", source: "Teams", learned: "28 Oct", origin: "Inferred" },
  { id: "f3", group: "People", text: "Rachel Gomez is your manager; reply same day", source: "Email", learned: "20 Oct", origin: "Inferred" },
  { id: "f4", group: "People", text: "Dana Wells is the decision-maker at Acme Corp", source: "CRM", learned: "2 Nov", origin: "Inferred" },
  { id: "f5", group: "Projects", text: "EU tier pricing is the top Q4 decision", source: "Meeting notes", learned: "9 Nov", origin: "Inferred" },
  { id: "f6", group: "Projects", text: "Platform OKR: API reliability to 99.95%", source: "Doc", learned: "15 Oct", origin: "Stated" },
  { id: "f7", group: "Writing style", text: "Opens with the decision, signs off 'Thanks, P'", source: "Email", learned: "12 Nov", origin: "Inferred" },
  { id: "f8", group: "Standing instructions", text: "Don't let me go more than 2 days without replying to the leadership team", source: "Teams", learned: "1 Nov", origin: "Stated" },
  { id: "f9", group: "Standing instructions", text: "Never accept external meetings on Fridays", source: "Teams", learned: "5 Nov", origin: "Stated" },
];

export const SHADOW_LOG = [
  { id: "s1", day: "Mon 14:20", text: "Globex asked about API limits (key account)" },
  { id: "s2", day: "Mon 16:05", text: "Kenji's PR blocked on your review for 6h" },
  { id: "s3", day: "Tue 08:10", text: "Laura Kim shared pricing model v4" },
  { id: "s4", day: "Tue 09:40", text: "Sofia moved the roadmap review to Thursday" },
];

export interface Activity { id: string; time: string; kind: "Read" | "Drafted" | "Proposed" | "Did" | "Blocked"; action: string; target: string; policy: "Passed" | "Blocked" | "Needs approval"; approval: "Approved" | "Pending" | "Not required" | "Rejected"; why: string; undoable?: boolean; undone?: boolean }
const act = (time: string, kind: Activity["kind"], action: string, target: string, policy: Activity["policy"], approval: Activity["approval"], why: string, undoable = false): Activity => ({ id: `act-${time}-${action}`.replace(/\W/g, ""), time, kind, action, target, policy, approval, why, undoable });
export const ACTIVITY: Activity[] = [
  act("Tue 09:12", "Did", "Accepted meeting invite", "Platform guild · Thu 16:00", "Passed", "Not required", "Internal invite, no conflict, class is at L4.", true),
  act("Tue 09:05", "Drafted", "Drafted reply", "Tom Becker · 4.12 release notes", "Passed", "Pending", "Release goes out tomorrow."),
  act("Tue 08:40", "Read", "Read thread", "#acme-renewal", "Passed", "Not required", "Preparing the Acme renewal brief."),
  act("Tue 08:31", "Proposed", "Proposed CRM update", "Acme Corp renewal stage", "Needs approval", "Pending", "Chris posted verbal agreement."),
  act("Tue 08:20", "Read", "Read document", "Acme Corp account review Q4.pdf", "Passed", "Not required", "Pre-read for 10:00 call."),
  act("Tue 08:02", "Drafted", "Drafted reply", "Rachel Gomez · EU tier", "Passed", "Pending", "From your VP, before the QBR."),
  act("Tue 07:55", "Drafted", "Drafted external reply", "Dana Wells · SSO date", "Needs approval", "Pending", "External email needs approval."),
  act("Tue 07:30", "Did", "Delivered morning brief", "Teams", "Passed", "Not required", "Scheduled daily at 07:30."),
  act("Tue 07:28", "Read", "Read calendar", "Today's meetings", "Passed", "Not required", "Building the morning brief."),
  act("Tue 07:25", "Read", "Read inbox", "38 new emails", "Passed", "Not required", "Overnight triage."),
  act("Tue 07:20", "Read", "Read Slack mentions", "12 mentions", "Passed", "Not required", "Overnight triage."),
  act("Mon 18:30", "Did", "Logged commitments", "3 from today's meetings", "Passed", "Not required", "End-of-day wrap-up."),
  act("Mon 17:45", "Did", "Moved focus block", "Thu 09:00 → 09:30", "Passed", "Approved", "You approved to fit the guild sync.", true),
  act("Mon 17:10", "Did", "Sent internal reply", "Sofia Marin · roadmap", "Passed", "Approved", "You reviewed and sent."),
  act("Mon 16:40", "Proposed", "Proposed nudge", "Max Hoffmann · churn analysis", "Needs approval", "Rejected", "You chose to raise it in person."),
  act("Mon 16:05", "Read", "Read PR status", "PLAT-412", "Passed", "Not required", "Kenji is blocked on you."),
  act("Mon 15:30", "Drafted", "Drafted reply", "Omar Reyes · budget", "Passed", "Pending", "Waiting 2 days."),
  act("Mon 14:50", "Did", "Declined meeting", "Vendor demo · Fri", "Passed", "Approved", "Standing instruction: no external meetings Fridays.", true),
  act("Mon 14:20", "Read", "Read email", "Leo Brandt · Globex", "Passed", "Not required", "Key account."),
  act("Mon 13:00", "Drafted", "Drafted 5 replies", "Inbox", "Passed", "Pending", "Midday triage."),
  act("Mon 12:10", "Did", "Updated CRM field", "Globex next step", "Passed", "Approved", "You approved."),
  act("Mon 11:30", "Read", "Read meeting notes", "Staff meeting", "Passed", "Not required", "Extracting commitments."),
  act("Mon 10:45", "Did", "Accepted meeting invite", "Design crit · Wed", "Passed", "Not required", "Internal, L4.", true),
  act("Mon 10:00", "Read", "Read document", "Pricing model v3", "Passed", "Not required", "Preparing QBR."),
  act("Mon 09:30", "Proposed", "Proposed focus block", "Thu 09:00–11:00", "Passed", "Approved", "Standing preference."),
  act("Mon 09:00", "Did", "Delivered morning brief", "Teams", "Passed", "Not required", "Scheduled daily."),
  act("Sun 20:00", "Read", "Read weekly calendar", "Next week", "Passed", "Not required", "Week load forecast."),
  act("Fri 17:30", "Did", "Logged commitments", "4 from today", "Passed", "Not required", "Wrap-up."),
  act("Fri 16:00", "Drafted", "Drafted nudge", "Chris Vance · forecast", "Needs approval", "Approved", "You approved a gentle nudge."),
  act("Fri 15:10", "Did", "Sent internal reply", "Nadia Petrova", "Passed", "Approved", "You reviewed and sent."),
  act("Fri 11:00", "Read", "Read Jira board", "Platform sprint", "Passed", "Not required", "Status for staff sync."),
  act("Fri 09:00", "Did", "Delivered morning brief", "Slack", "Passed", "Not required", "Scheduled daily."),
];

export interface AuditEvent { id: string; time: string; actor: string; agent: string; action: string; target: string; policy: "Allowed" | "Blocked" | "Approval required"; approval: string }
export const AUDIT: AuditEvent[] = Array.from({ length: 22 }, (_, i) => {
  const agents = ["relay-pr-018", "relay-ac-004", "relay-jt-011", "relay-mk-027", "relay-sv-033"];
  const actions: [string, string, AuditEvent["policy"], string][] = [
    ["Read message", "Email", "Allowed", "Not required"],
    ["Draft created (internal)", "Email", "Allowed", "Not required"],
    ["Send external email", "Email", "Approval required", "Approved by owner"],
    ["Update CRM field", "CRM record", "Approval required", "Approved by owner"],
    ["Accept meeting", "Calendar event", "Allowed", "Not required (L4)"],
    ["Read file", "Document", "Allowed", "Not required"],
    ["Write to finance sheet", "Spreadsheet", "Blocked", "Policy: no finance actions"],
  ];
  const a = actions[i % actions.length]!;
  const h = 17 - Math.floor(i / 3);
  return { id: `au${i}`, time: `Tue ${String(Math.max(h, 7)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`, actor: "Agent (on behalf of owner)", agent: agents[i % agents.length]!, action: a[0], target: a[1], policy: a[2], approval: a[3] };
});

export interface SecEvent { id: string; time: string; kind: "Blocked" | "Scope change" | "Kill switch" | "Incident"; text: string; detail?: { source: string; rule: string; prevented: string } }
export const SEC_EVENTS: SecEvent[] = [
  { id: "se1", time: "Tue 11:02", kind: "Blocked", text: "relay-mk-027 tried to write to a finance sheet" },
  { id: "se2", time: "Mon 15:40", kind: "Scope change", text: "Slack connector: added channels:history (read) for Leadership pilot" },
  { id: "se3", time: "Mon 09:12", kind: "Blocked", text: "External send without approval prevented (relay-sv-033)" },
  { id: "se4", time: "Fri 16:30", kind: "Kill switch", text: "relay-tw-040 paused by owner during leave" },
];

const teams = ["Product", "Sales", "Engineering", "Finance", "Marketing", "People"];
const owners = ["Priya Raman", "Alex Chen", "Jordan Taylor", "Morgan Kelly", "Sam Vega", "Riley Moore", "Casey Park", "Drew Ellis", "Jamie Fox", "Taylor Reid", "Avery Lund", "Quinn Ortiz"];
export interface Agent { id: string; owner: string; team: string; status: "Active" | "Paused"; apps: string[]; level: number; last: string }
export const AGENTS: Agent[] = owners.map((o, i) => ({
  id: `relay-${o.split(" ").map((p) => p.charAt(0).toLowerCase()).join("")}-${String(18 + i * 3).padStart(3, "0")}`,
  owner: o, team: teams[i % teams.length]!, status: i === 10 ? "Paused" : "Active",
  apps: i % 3 === 0 ? ["M365", "Slack", "Salesforce"] : i % 3 === 1 ? ["Google", "Slack"] : ["M365", "Slack"],
  level: [3, 2, 2, 3, 1, 2, 3, 2, 2, 1, 2, 3][i] ?? 2, last: `${(i * 4) % 50 + 1} min ago`,
}));

export const CONNECTORS = [
  { id: "M365", name: "Microsoft 365", letter: "M", read: ["Mail.Read", "Calendars.Read", "Files.Read"], write: ["Mail.Send (approval)", "Calendars.ReadWrite (internal)"] },
  { id: "Google", name: "Google Workspace", letter: "G", read: ["gmail.readonly", "calendar.readonly", "drive.readonly"], write: ["gmail.compose (approval)"] },
  { id: "Slack", name: "Slack", letter: "S", read: ["channels:history", "im:history", "users:read"], write: ["chat:write (DM owner only)"] },
  { id: "Salesforce", name: "Salesforce", letter: "SF", read: ["Account.read", "Opportunity.read"], write: ["Opportunity.update (approval)"] },
];

export const POLICY_PACKS = [
  { id: "pp1", name: "Leadership pilot", members: 42, rules: ["External email always requires approval", "No autonomous actions on finance data", "Untrusted content cannot trigger actions", "Delete actions are disabled"], caps: { t1: 4, t2: 3, t3: 3, t4: 3, t5: 3 } as Record<string, number> },
  { id: "pp2", name: "Sales", members: 0, rules: ["External email always requires approval", "CRM writes require approval", "No access to HR folders"], caps: { t1: 4, t2: 3, t3: 2, t4: 3, t5: 2 } as Record<string, number> },
];

export const WEEKS = ["W1", "W2", "W3", "W4", "W5", "W6"];
export const METRICS = {
  northStar: [1.2, 2.1, 3.0, 3.8, 4.6, 5.3],
  wau: [14, 22, 28, 31, 34, 36],
  briefAccuracy: [41, 52, 58, 66, 74, 81],
  injectionSuccess: [4.1, 2.8, 1.6, 0.9, 0.4, 0.2],
  shadowAI: [62, 55, 47, 40, 34, 29],
  credits: [1800, 2600, 3400, 3900, 4300, 4700],
};
export const ADOPTION_BY_TEAM = [
  { team: "Product", active: 92 }, { team: "Sales", active: 81 }, { team: "Engineering", active: 74 }, { team: "Finance", active: 68 }, { team: "Marketing", active: 77 }, { team: "People", active: 60 },
];
export const FUNNEL = [
  { stage: "Invited", n: 42 }, { stage: "Connected", n: 40 }, { stage: "First brief", n: 39 }, { stage: "Weekly active", n: 36 },
];
