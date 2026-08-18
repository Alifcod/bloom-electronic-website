export const PROJECT_STAGES = [
  "Initial concept",
  "Requirements available",
  "Existing schematic",
  "Existing PCB design",
  "Prototype fabricated",
  "Prototype not working",
  "Revision required",
  "Preparing for manufacturing",
  "Exploring options",
];

export const PROJECT_TYPES = [
  "PCB design review and rescue",
  "Custom PCB and embedded prototype",
  "Prototype troubleshooting and revision",
  "Embedded systems and firmware",
  "IoT controller development",
  "Manufacturing handoff",
  "Other engineering support",
];

export const BUDGET_RANGES = [
  "Prefer not to say",
  "Below RM5,000",
  "RM5,000–RM15,000",
  "RM15,000–RM40,000",
  "RM40,000 and above",
  "Needs scoping",
];

export const TIMELINES = ["Less than 1 month", "1–3 months", "3–6 months", "More than 6 months", "Exploring options"];

export const FIELD_LIMITS = {
  fullName: 100,
  email: 254,
  company: 120,
  phone: 40,
  projectType: 100,
  projectStage: 100,
  timeline: 80,
  budgetRange: 80,
  preferredContact: 40,
  description: 4000,
  existingFiles: 120,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ATTRIBUTION_KEY = "bloom_first_touch_attribution";

export function createEmptyLead(initialProjectType = "") {
  return {
    fullName: "",
    email: "",
    company: "",
    phone: "",
    projectType: initialProjectType,
    projectStage: "",
    timeline: "",
    budgetRange: "",
    preferredContact: "Email",
    existingFiles: "",
    description: "",
    consent: false,
    website: "",
  };
}

export function trimLead(values) {
  return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value]));
}

export function validateLead(values) {
  const data = trimLead(values);
  const errors = {};
  if (!data.fullName) errors.fullName = "Enter your full name.";
  if (!data.email) errors.email = "Enter your email address.";
  else if (!EMAIL_PATTERN.test(data.email)) errors.email = "Enter a valid email address.";
  if (!data.projectType) errors.projectType = "Select a project type.";
  if (!data.projectStage) errors.projectStage = "Select the current project stage.";
  if (!data.description) errors.description = "Describe the project and the support you need.";
  if (!data.consent) errors.consent = "Confirm that Bloom Electronic may contact you about this enquiry.";
  for (const [field, limit] of Object.entries(FIELD_LIMITS)) {
    if (typeof data[field] === "string" && data[field].length > limit) errors[field] = `Use ${limit} characters or fewer.`;
  }
  return { data, errors, valid: Object.keys(errors).length === 0 };
}

function attributionFromSearch(search = "") {
  const params = new URLSearchParams(search);
  return Object.fromEntries(["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].map((key) => [key, (params.get(key) ?? "").slice(0, 120)]));
}

export function getAttribution(locationLike = typeof window !== "undefined" ? window.location : { search: "", href: "", pathname: "/" }) {
  const current = attributionFromSearch(locationLike.search);
  if (typeof window === "undefined") return { firstTouch: current, currentSession: current };
  let firstTouch = current;
  try {
    const stored = window.sessionStorage.getItem(ATTRIBUTION_KEY);
    if (stored) firstTouch = JSON.parse(stored);
    else window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(current));
  } catch {
    firstTouch = current;
  }
  return { firstTouch, currentSession: current };
}

export function createSubmissionId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `bloom-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function buildLeadPayload(values, options = {}) {
  const { data, errors, valid } = validateLead(values);
  if (!valid) return { data, errors, valid };
  const locationLike = options.location ?? (typeof window !== "undefined" ? window.location : { search: "", href: "", pathname: "/" });
  const attribution = options.attribution ?? getAttribution(locationLike);
  const submissionId = options.submissionId ?? createSubmissionId();
  return {
    valid: true,
    errors: {},
    payload: {
      ...data,
      submissionId,
      submittedAt: new Date(options.now ?? Date.now()).toISOString(),
      formStartedAt: options.formStartedAt,
      sourcePage: locationLike.pathname || "/",
      pageUrl: locationLike.href || "",
      referrer: options.referrer ?? (typeof document !== "undefined" ? document.referrer : ""),
      browserLanguage: options.browserLanguage ?? (typeof navigator !== "undefined" ? navigator.language : ""),
      attribution,
    },
  };
}

export async function submitLead(endpoint, payload, options = {}) {
  if (!endpoint) throw new Error("lead_api_unconfigured");
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? 15000;
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const fetchImpl = options.fetchImpl ?? fetch;
  try {
    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Submission-ID": payload.submissionId },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    let body = {};
    try { body = await response.json(); } catch { body = {}; }
    if (!response.ok || body?.ok !== true || body?.submissionId !== payload.submissionId) {
      const error = new Error(body?.message || "submission_rejected");
      error.status = response.status;
      throw error;
    }
    return body;
  } finally {
    clearTimeout(timer);
  }
}
