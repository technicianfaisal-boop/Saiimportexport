// Initialize Supabase Client
const SUPABASE_URL = 'https://zztjtewhxpckqgmqimtq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dGp0ZXdoeHBja3FnbXFpbXRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NTU1OTksImV4cCI6MjA5NDQzMTU5OX0.PjvLvaqncoiyiB4m0lNenaCpjp6shml1-dx4vcGlGO4';

// The Supabase CDN (v2) exposes createClient on window.supabase
// It may also be under window.supabase.createClient directly
let supabase;
try {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else if (window.supabaseJs && typeof window.supabaseJs.createClient === 'function') {
        supabase = window.supabaseJs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        console.error('Supabase CDN not loaded! window.supabase:', window.supabase);
    }
} catch(e) {
    console.error('Supabase init error:', e);
}

// Helper function to check if user is logged in
async function checkAuth() {
    if (!supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}
