-- Create contact_messages table in Supabase
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Option 1: Disable RLS temporarily for testing
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;

-- Option 2: If you want to keep RLS enabled, uncomment the lines below:
-- ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Allow public inserts" ON contact_messages;
-- CREATE POLICY "Allow public inserts" ON contact_messages
--   FOR INSERT TO anon, authenticated
--   WITH CHECK (true);

-- Optional: Create a policy to allow reads (if you want to view messages)
-- CREATE POLICY "Allow authenticated reads" ON contact_messages
--   FOR SELECT USING (auth.role() = 'authenticated');

-- Optional: Create an index for better performance
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX idx_contact_messages_email ON contact_messages(email);
