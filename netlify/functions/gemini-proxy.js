// Netlify Function: Secure Gemini API Proxy
// This keeps your API key secret on the server

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Get API key from environment variable (set in Netlify dashboard)
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured' })
    };
  }

  try {
    // Parse the request body
    const { userPrompt, systemPrompt, useSearch, modelName } = JSON.parse(event.body);

    // Build the Gemini API request
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName || 'gemini-2.5-flash-preview-05-20'}:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [{ parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };
    
    // Add search tool if requested
    if (useSearch) {
      payload.tools = [{ "google_search": {} }];
    }

    // Call Gemini API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API Error:', errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: `Gemini API error: ${response.status}`,
          details: errorData 
        })
      };
    }

    const result = await response.json();

    // Return successful response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow requests from your frontend
      },
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Function Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};