-- 61.2-06B Appointment Foundation Validation Queries
-- Status: PROPOSED / RUN AFTER SCHEMA DEPLOYMENT

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'appointments'
ORDER BY ordinal_position;

SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'appointments'
ORDER BY constraint_name;

SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'appointments'
ORDER BY indexname;

-- Confirm Leads remains present and unchanged as independent source table.
SELECT EXISTS (
  SELECT 1 FROM information_schema.tables WHERE table_name = 'leads'
) AS leads_table_exists;
