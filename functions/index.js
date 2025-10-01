const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

// Gemini API Proxy Function
exports.geminiProxy = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = functions.config().gemini?.key;
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY not configured');
      return res.status(500).json({ error: 'API key not configured' });
    }

    try {
      const { userPrompt, systemPrompt, useSearch, modelName } = req.body;

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName || 'gemini-2.5-flash-preview-05-20'}:generateContent?key=${apiKey}`;
      
      const payload = {
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      };
      
      if (useSearch) {
        payload.tools = [{ "google_search": {} }];
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Gemini API Error:', errorData);
        return res.status(response.status).json({ 
          error: `Gemini API error: ${response.status}`,
          details: errorData 
        });
      }

      const result = await response.json();
      return res.status(200).json(result);

    } catch (error) {
      console.error('Function Error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
      });
    }
  });
});

// Get Firebase Config Function
exports.getConfig = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    try {
      const config = {
		 apiKey: functions.config().fbconfig?.api_key,
		 authDomain: functions.config().fbconfig?.auth_domain,
		 projectId: functions.config().fbconfig?.project_id,
		 storageBucket: functions.config().fbconfig?.storage_bucket,
		 messagingSenderId: functions.config().fbconfig?.messaging_sender_id,
		 appId: functions.config().fbconfig?.app_id
	  };

      if (!config.apiKey || !config.projectId) {
        console.error('Firebase config incomplete');
        return res.status(500).json({ error: 'Firebase config incomplete' });
      }

      return res.status(200).json({ firebaseConfig: config });
    } catch (error) {
      console.error('Error in get-config:', error);
      return res.status(500).json({ error: error.message });
    }
  });
});