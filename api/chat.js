export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Supabase Configuration
  const SUPABASE_URL = 'https://zztjtewhxpckqgmqimtq.supabase.co';
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
    return res.status(500).json({ error: 'Server configuration error: Database access key missing' });
  }

  try {
    // 1. Fetch Gemini API Key securely from Supabase
    const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?key=eq.gemini&select=value`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    if (!dbRes.ok) {
      console.error('Supabase fetch failed:', dbRes.status, await dbRes.text());
      throw new Error(`Failed to fetch settings from Supabase: ${dbRes.status}`);
    }

    const settingsData = await dbRes.json();
    if (!settingsData || settingsData.length === 0 || !settingsData[0].value || !settingsData[0].value.apikey) {
      return res.status(500).json({ error: 'Gemini API key is not configured in the Admin Panel.' });
    }

    const apiKey = settingsData[0].value.apikey;
    const { system_instruction, contents } = req.body;

    // 2. Model fallback chain — try primary, then backup
    const MODELS = [
      'gemini-2.5-flash',        // Stable, production-ready (May 2026)
      'gemini-2.5-flash-lite',   // Fallback: fastest, cheapest
      'gemini-3.1-flash-lite',   // Fallback: newest stable
    ];

    let lastError = null;

    for (const model of MODELS) {
      try {
        console.log(`Trying model: ${model}`);

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction,
              contents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000,
                topP: 0.9
              }
            })
          }
        );

        const data = await geminiRes.json();

        if (geminiRes.ok && data.candidates && data.candidates.length > 0) {
          console.log(`Success with model: ${model}`);
          return res.status(200).json(data);
        }

        // Model-specific error — try next model
        console.warn(`Model ${model} failed:`, data.error?.message || 'Unknown error');
        lastError = data;

      } catch (fetchErr) {
        console.warn(`Fetch error for model ${model}:`, fetchErr.message);
        lastError = { error: { message: fetchErr.message } };
      }
    }

    // All models failed
    console.error('All Gemini models failed. Last error:', JSON.stringify(lastError));
    return res.status(502).json({ 
      error: 'All AI models failed to respond', 
      details: lastError 
    });

  } catch (error) {
    console.error('Chat API Error:', error.message || error);
    return res.status(500).json({ error: 'Failed to communicate with AI service', details: error.message });
  }
}
