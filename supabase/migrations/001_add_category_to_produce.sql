-- Add category column to produce table
ALTER TABLE produce ADD COLUMN category TEXT;

-- Update existing rows to have a default category
UPDATE produce SET category = 'Other' WHERE category IS NULL;

-- Make the column NOT NULL with a default for future inserts
ALTER TABLE produce ALTER COLUMN category SET NOT NULL;
ALTER TABLE produce ALTER COLUMN category SET DEFAULT 'Other';