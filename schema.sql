-- ============================================================
-- FabFashion — Supabase reference (matches your ACTUAL tables)
-- ============================================================
-- Your project already has these tables, created before this
-- integration existed: ff_collections, ff_inquiries, ff_newsletter,
-- ff_users, ff_edit_log. The application code now points at these
-- real tables/columns directly. This file no longer creates new
-- tables — it only adds two missing columns and documents the
-- RLS lockdown to run once the admin panel is confirmed working.

-- ============================================================
-- STEP 1 — Already run (safe to re-run, no-op if columns exist)
-- ============================================================
alter table ff_inquiries add column if not exists status text not null default 'unread';
alter table ff_users add column if not exists role text not null default 'admin';

-- ============================================================
-- STEP 2 — RUN THIS ONLY AFTER confirming the admin panel works
-- end-to-end (login, viewing/editing enquiries, collections, users,
-- subscribers, edit log) using the new /api/* routes.
-- ============================================================
-- Right now, ff_collections allows ANONYMOUS insert/update/delete —
-- meaning anyone with your public anon key (visible in browser
-- devtools, not a secret) could add, edit, or delete your entire
-- fabric catalog directly, no login required. The statements below
-- remove that and leave only what's actually needed:
--   - ff_collections: public can still READ (needed for the public
--     website), but only the admin backend (service-role key) can
--     write.
--   - ff_inquiries / ff_newsletter: public can INSERT (needed so the
--     contact form and newsletter signup work without logging in),
--     but cannot read or modify existing rows — one visitor can never
--     see another visitor's enquiry.
--   - ff_users / ff_edit_log: no public access at all — admin backend
--     only.
--
-- Uncomment and run when ready:

-- drop policy if exists "Allow anonymous update collections" on ff_collections;
-- drop policy if exists "Allow anonymous delete collections" on ff_collections;
-- -- keep "Allow anonymous read all collections" and "Allow anonymous insert collections"
-- -- is NOT needed either, since admin writes now go through the service-role API:
-- drop policy if exists "Allow anonymous insert collections" on ff_collections;

-- alter table ff_inquiries enable row level security;
-- drop policy if exists "anon insert only" on ff_inquiries;
-- create policy "anon insert only" on ff_inquiries for insert to anon with check (true);

-- alter table ff_newsletter enable row level security;
-- drop policy if exists "anon insert only" on ff_newsletter;
-- create policy "anon insert only" on ff_newsletter for insert to anon with check (true);

-- alter table ff_users enable row level security;      -- no policies = no anon access at all
-- alter table ff_edit_log enable row level security;   -- no policies = no anon access at all
