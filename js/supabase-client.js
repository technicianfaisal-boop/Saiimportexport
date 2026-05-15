// Initialize Supabase Client
var SUPABASE_URL = 'https://zztjtewhxpckqgmqimtq.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dGp0ZXdoeHBja3FnbXFpbXRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NTU1OTksImV4cCI6MjA5NDQzMTU5OX0.PjvLvaqncoiyiB4m0lNenaCpjp6shml1-dx4vcGlGO4';

var saiDB = null;
try {
    saiDB = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch(e) {
    console.warn('Supabase CDN not loaded, using local fallback data.', e);
}

// Helper function to check if user is logged in
async function checkAuth() {
    if (!saiDB) return null;
    var r = await saiDB.auth.getSession();
    return r.data.session;
}
