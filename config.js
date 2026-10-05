/* ============================================================
   FabFashion Application Configuration
   ============================================================
   IMPORTANT SECURITY NOTE:
   Do NOT hardcode private secrets or plain-text credentials in client JS.
   Configure your Supabase URL & Key below or load from window.ENV.
   ============================================================ */

window.FABFASHION_CONFIG = {
  // Supabase API credentials
  // NOTE: Supabase anon key is intentionally a public client key per Supabase security design.
  SUPABASE_URL: window.ENV_SUPABASE_URL || "https://cyugscorahdggfbmehpw.supabase.co",
  SUPABASE_KEY: window.ENV_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5dWdzY29yYWhkZ2dmYm1laHB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0NjU4ODUsImV4cCI6MjA5ODA0MTg4NX0.yVdBovq723AMpOdaCkXd9TOEzczEYjCbfaETK-BkLAE",

  // Initial Admin Username (Used on initial setup if browser storage is empty)
  INITIAL_ADMIN_USERNAME: "FabFashion"
};
