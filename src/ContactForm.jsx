import { useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "./analytics.js";
import { icons } from "./components.jsx";
import { buildWhatsAppUrl, siteConfig } from "./config.js";
import { BUDGET_RANGES, buildLeadPayload, createEmptyLead, FIELD_LIMITS, PROJECT_STAGES, PROJECT_TYPES, submitLead, TIMELINES, validateLead } from "./lead.js";

const { ArrowRight, Check, PaperPlaneTilt, SpinnerGap, WarningCircle } = icons;

function FieldError({ id, children }) {
  return children ? <span className="field-error" id={id}><WarningCircle aria-hidden="true" />{children}</span> : null;
}

export function ContactForm({ initialType = "" }) {
  const matchedType = useMemo(() => {
    const typeMap = {
      "pcb-review-rescue": "PCB design review and rescue",
      "custom-pcb-prototype": "Custom PCB and embedded prototype",
      "prototype-troubleshooting": "Prototype troubleshooting and revision",
      "manufacturing-handoff": "Manufacturing handoff",
      "pcb-design-malaysia": "Custom PCB and embedded prototype",
      "embedded-systems-malaysia": "Embedded systems and firmware",
      "pcb-troubleshooting": "Prototype troubleshooting and revision",
      "iot-controller-development-malaysia": "IoT controller development",
      "prototype-and-production-support": "Manufacturing handoff",
    };
    return typeMap[initialType] ?? "";
  }, [initialType]);
  const [values, setValues] = useState(() => createEmptyLead(matchedType));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [turnstileToken, setTurnstileToken] = useState("");
  const formSucceeded = status.state === "success";
  const formRef = useRef(null);
  const turnstileElement = useRef(null);
  const turnstileWidget = useRef(null);
  const submitting = useRef(false);
  const startedAt = useRef(Date.now());
  const startedTracked = useRef(false);

  useEffect(() => {
    if (matchedType) setValues((current) => ({ ...current, projectType: matchedType }));
  }, [matchedType]);

  useEffect(() => {
    if (!siteConfig.turnstileSiteKey || !siteConfig.leadApiUrl || formSucceeded) return undefined;
    let cancelled = false;
    const renderWidget = () => {
      if (cancelled || !turnstileElement.current || !window.turnstile || turnstileWidget.current !== null) return;
      turnstileWidget.current = window.turnstile.render(turnstileElement.current, {
        sitekey: siteConfig.turnstileSiteKey,
        callback: (token) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
        theme: "dark",
      });
    };
    let script = document.getElementById("bloom-turnstile-script");
    if (!script) {
      script = document.createElement("script");
      script.id = "bloom-turnstile-script";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.append(script);
    }
    script.addEventListener("load", renderWidget);
    renderWidget();
    return () => {
      cancelled = true;
      script?.removeEventListener("load", renderWidget);
      if (turnstileWidget.current !== null && window.turnstile) window.turnstile.remove(turnstileWidget.current);
      turnstileWidget.current = null;
    };
  }, [formSucceeded]);

  const setField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: "" }));
  };

  const markStarted = () => {
    if (startedTracked.current) return;
    startedTracked.current = true;
    trackEvent("form_start", { page_path: window.location.pathname });
  };

  const focusFirstError = (nextErrors) => {
    const field = Object.keys(nextErrors)[0];
    requestAnimationFrame(() => formRef.current?.querySelector(`[name="${field}"]`)?.focus());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status.state === "submitting" || submitting.current) return;
    const result = validateLead(values);
    if (!result.valid) {
      setErrors(result.errors);
      setStatus({ state: "error", message: "Review the highlighted fields and submit again." });
      focusFirstError(result.errors);
      return;
    }
    if (siteConfig.turnstileSiteKey && !turnstileToken) {
      setStatus({ state: "error", message: "Complete the spam-protection check and submit again." });
      turnstileElement.current?.focus();
      return;
    }
    const submission = buildLeadPayload(result.data, { formStartedAt: new Date(startedAt.current).toISOString() });
    submission.payload.turnstileToken = turnstileToken;
    submitting.current = true;
    setStatus({ state: "submitting", message: "Sending your enquiry securely…" });
    try {
      await submitLead(siteConfig.leadApiUrl, submission.payload);
      setStatus({ state: "success", message: "Your enquiry was delivered to Bloom Electronic." });
      trackEvent("generate_lead", { service_category: submission.payload.projectType, page_path: submission.payload.sourcePage, submission_id: submission.payload.submissionId });
      trackEvent("form_submit_success", { service_category: submission.payload.projectType, page_path: submission.payload.sourcePage, submission_id: submission.payload.submissionId });
      requestAnimationFrame(() => formRef.current?.querySelector("[data-success-heading]")?.focus());
    } catch (error) {
      const errorType = error?.name === "AbortError" ? "timeout" : "delivery_error";
      setStatus({ state: "error", message: errorType === "timeout" ? "The request timed out. Your details are still here—please try again or use email." : "We could not confirm delivery. Your details are still here—please try again or use email." });
      trackEvent("form_submit_error", { service_category: result.data.projectType, page_path: window.location.pathname, error_type: errorType });
      if (siteConfig.turnstileSiteKey && turnstileWidget.current !== null && window.turnstile) window.turnstile.reset(turnstileWidget.current);
      setTurnstileToken("");
      requestAnimationFrame(() => formRef.current?.querySelector("[data-status]")?.focus());
    } finally {
      submitting.current = false;
    }
  };

  const whatsappUrl = buildWhatsAppUrl(values.projectStage || "project");
  if (!siteConfig.leadApiUrl) {
    return (
      <div className="form-unavailable" role="region" aria-labelledby="form-unavailable-heading">
        <WarningCircle aria-hidden="true" />
        <p className="mini-label">Online form setup in progress</p>
        <h2 id="form-unavailable-heading">Use a verified contact route for now.</h2>
        <p>The enquiry form will only be enabled after its secure delivery endpoint is configured and tested. No project details are being captured by this page today.</p>
        <div className="fallback-actions">
          <a className="button button--primary" href={`mailto:${siteConfig.primaryEmail}?subject=${encodeURIComponent("Bloom Electronic project enquiry")}`} onClick={() => trackEvent("click_email", { cta_location: "form_unavailable", page_path: window.location.pathname })}>Email Bloom <ArrowRight weight="bold" /></a>
          {whatsappUrl && <a className="button button--secondary" href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("click_whatsapp", { cta_location: "form_unavailable", page_path: window.location.pathname })}>WhatsApp an engineer</a>}
        </div>
      </div>
    );
  }

  if (status.state === "success") {
    return (
      <div className="form-success" ref={formRef} role="status">
        <div><Check weight="bold" /></div>
        <p>Enquiry delivered</p>
        <h2 data-success-heading tabIndex="-1">Thank you. Bloom Electronic has received your project brief.</h2>
        <span>Keep the submission confirmation for your records. A reply will be made using your selected contact method where practical.</span>
        <button type="button" onClick={() => { setValues(createEmptyLead()); setStatus({ state: "idle", message: "" }); setErrors({}); setTurnstileToken(""); startedAt.current = Date.now(); startedTracked.current = false; }}>Send another enquiry</button>
      </div>
    );
  }

  return (
    <form className="enquiry-form" ref={formRef} onSubmit={handleSubmit} onFocus={markStarted} noValidate>
      <div className="form-intro"><p className="mini-label">Project enquiry</p><h2>Tell us what stage the engineering work has reached.</h2><p>Required fields are marked with <span aria-hidden="true">*</span><span className="sr-only">an asterisk</span>.</p></div>
      <div className="field-row">
        <label>Full name <span aria-hidden="true">*</span><input required name="fullName" autoComplete="name" maxLength={FIELD_LIMITS.fullName} value={values.fullName} onChange={(event) => setField("fullName", event.target.value)} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "fullName-error" : undefined} /><FieldError id="fullName-error">{errors.fullName}</FieldError></label>
        <label>Company<input name="company" autoComplete="organization" maxLength={FIELD_LIMITS.company} value={values.company} onChange={(event) => setField("company", event.target.value)} /></label>
      </div>
      <div className="field-row">
        <label>Email <span aria-hidden="true">*</span><input required type="email" name="email" autoComplete="email" maxLength={FIELD_LIMITS.email} value={values.email} onChange={(event) => setField("email", event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} /><FieldError id="email-error">{errors.email}</FieldError></label>
        <label>Phone or WhatsApp<input name="phone" type="tel" autoComplete="tel" maxLength={FIELD_LIMITS.phone} value={values.phone} onChange={(event) => setField("phone", event.target.value)} /></label>
      </div>
      <div className="field-row">
        <label>Project type <span aria-hidden="true">*</span><select required name="projectType" value={values.projectType} onChange={(event) => setField("projectType", event.target.value)} aria-invalid={Boolean(errors.projectType)} aria-describedby={errors.projectType ? "projectType-error" : undefined}><option value="">Select a project type</option>{PROJECT_TYPES.map((item) => <option key={item}>{item}</option>)}</select><FieldError id="projectType-error">{errors.projectType}</FieldError></label>
        <label>Project stage <span aria-hidden="true">*</span><select required name="projectStage" value={values.projectStage} onChange={(event) => setField("projectStage", event.target.value)} aria-invalid={Boolean(errors.projectStage)} aria-describedby={errors.projectStage ? "projectStage-error" : undefined}><option value="">Select the current stage</option>{PROJECT_STAGES.map((item) => <option key={item}>{item}</option>)}</select><FieldError id="projectStage-error">{errors.projectStage}</FieldError></label>
      </div>
      <div className="field-row">
        <label>Estimated timeline<select name="timeline" value={values.timeline} onChange={(event) => setField("timeline", event.target.value)}><option value="">Not specified</option>{TIMELINES.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Budget range<select name="budgetRange" value={values.budgetRange} onChange={(event) => setField("budgetRange", event.target.value)}><option value="">Not specified</option>{BUDGET_RANGES.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      <div className="field-row">
        <label>Existing files available<select name="existingFiles" value={values.existingFiles} onChange={(event) => setField("existingFiles", event.target.value)}><option value="">Not specified</option><option>Schematic</option><option>PCB source files</option><option>Gerber files only</option><option>Firmware source</option><option>Physical prototype</option><option>Measurements or test logs</option><option>No existing files</option></select></label>
        <label>Preferred contact method<select name="preferredContact" value={values.preferredContact} onChange={(event) => setField("preferredContact", event.target.value)}><option>Email</option>{siteConfig.whatsappNumber && <option>WhatsApp</option>}<option>Phone</option></select></label>
      </div>
      <label>Project description <span aria-hidden="true">*</span><textarea required name="description" rows="7" maxLength={FIELD_LIMITS.description} value={values.description} onChange={(event) => setField("description", event.target.value)} placeholder="Describe the application, expected behaviour, current evidence and engineering support required." aria-invalid={Boolean(errors.description)} aria-describedby={`description-help${errors.description ? " description-error" : ""}`} /><span className="field-help" id="description-help">Do not include passwords, private keys or unnecessary personal information. {values.description.length}/{FIELD_LIMITS.description}</span><FieldError id="description-error">{errors.description}</FieldError></label>
      <label className="consent-field"><input type="checkbox" name="consent" checked={values.consent} onChange={(event) => setField("consent", event.target.checked)} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "consent-error" : undefined} /><span>I agree that Bloom Electronic may use these details to assess and respond to this enquiry. <span aria-hidden="true">*</span></span><FieldError id="consent-error">{errors.consent}</FieldError></label>
      {siteConfig.turnstileSiteKey && <div className="turnstile-field"><p>Spam-protection check</p><div ref={turnstileElement} className="turnstile-widget" tabIndex="-1" aria-label="Cloudflare Turnstile spam-protection check" /></div>}
      <label className="honeypot" aria-hidden="true">Website<input tabIndex="-1" autoComplete="off" name="website" value={values.website} onChange={(event) => setField("website", event.target.value)} /></label>
      <div className={`form-status form-status--${status.state}`} data-status tabIndex={status.state === "error" ? "-1" : undefined} aria-live="polite">{status.message}</div>
      <button className="button button--primary submit-button" type="submit" disabled={status.state === "submitting"}>{status.state === "submitting" ? <>Sending enquiry <SpinnerGap className="spin" /></> : <>Submit project enquiry <PaperPlaneTilt weight="bold" /></>}</button>
      <p className="form-note">Submission is sent only to the configured Bloom lead endpoint. Project details are not sent to analytics.</p>
    </form>
  );
}
