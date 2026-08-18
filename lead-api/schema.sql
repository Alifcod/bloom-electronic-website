CREATE TABLE IF NOT EXISTS leads (
  submission_id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  project_type TEXT NOT NULL,
  project_stage TEXT NOT NULL,
  timeline TEXT,
  budget_range TEXT,
  existing_files TEXT,
  preferred_contact TEXT,
  description TEXT NOT NULL,
  source_page TEXT,
  referrer TEXT,
  attribution_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
