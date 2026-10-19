CREATE TABLE IF NOT EXISTS internships (
  id UUID PRIMARY KEY,
  title VARCHAR(100) NOT NULL CHECK (char_length(title) BETWEEN 3 AND 100),
  company VARCHAR(100) NOT NULL CHECK (char_length(company) BETWEEN 2 AND 100),
  domain VARCHAR(100) NOT NULL CHECK (char_length(domain) BETWEEN 2 AND 100),
  location VARCHAR(100) NOT NULL CHECK (char_length(location) BETWEEN 2 AND 100),
  duration VARCHAR(50) NOT NULL CHECK (char_length(duration) BETWEEN 1 AND 50),
  stipend NUMERIC NOT NULL CHECK (stipend >= 0),
  description VARCHAR(2000) NOT NULL CHECK (char_length(description) BETWEEN 10 AND 2000),
  status VARCHAR(10) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS internships_domain_status_idx
  ON internships (LOWER(domain), status);

CREATE INDEX IF NOT EXISTS internships_location_idx
  ON internships (LOWER(location));

CREATE INDEX IF NOT EXISTS internships_created_at_idx
  ON internships (created_at DESC);
