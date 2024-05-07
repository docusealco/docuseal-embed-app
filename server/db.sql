CREATE TABLE IF NOT EXISTS templates (
  id SERIAL PRIMARY KEY,
  external_id VARCHAR(100),
  name VARCHAR(100),
  slug VARCHAR(100),
  preview_image_url VARCHAR(200),
  submitters jsonb[] default '{}'
);

CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES templates(id),
  external_id VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS submitters (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER REFERENCES submissions(id),
  external_id VARCHAR(100),
  uuid VARCHAR(100),
  email VARCHAR(100),
  slug VARCHAR(100),
  sent_at TIMESTAMP,
  opened_at TIMESTAMP,
  completed_at TIMESTAMP,
  status VARCHAR(100)
);

CREATE UNIQUE INDEX IF NOT EXISTS templates_external_id_idx ON templates(external_id);
CREATE UNIQUE INDEX IF NOT EXISTS submissions_external_id_idx ON submissions(external_id);
CREATE UNIQUE INDEX IF NOT EXISTS submitters_external_id_idx ON submitters(external_id);
