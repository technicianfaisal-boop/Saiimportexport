// Initialize Supabase Client
const SUPABASE_URL = 'https://zztjtewhxpckqgmqimtq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dGp0ZXdoeHBja3FnbXFpbXRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NTU1OTksImV4cCI6MjA5NDQzMTU5OX0.PjvLvaqncoiyiB4m0lNenaCpjp6shml1-dx4vcGlGO4';

// Ensure the Supabase CDN is loaded in HTML files before this script
const _supabaseLib = window.supabase || window.supabaseJs;
const supabase = _supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper function to check if user is logged in
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}
