require("dotenv").config();
const { onRequest } = require("firebase-functions/v2/https");
const cors = require("cors")({ origin: true });

// Gemini API Proxy Function
exports.geminiProxy = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Get API key from environment variable
    const apiKey = process.env.GEMINI_KEY;

    if (!apiKey) {
      console.error("GEMINI_KEY not configured");
      return res.status(500).json({ error: "API key not configured" });
    }

    try {
      const { userPrompt, systemPrompt, useSearch, modelName } = req.body;

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${
        modelName || "gemini-2.5-flash"
      }:generateContent?key=${apiKey}`;

      const payload = {
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
      };

      if (useSearch) {
        payload.tools = [{ google_search: {} }];
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Gemini API Error:", errorData);
        return res.status(response.status).json({
          error: `Gemini API error: ${response.status}`,
          details: errorData,
        });
      }

      const result = await response.json();
      return res.status(200).json(result);
    } catch (error) {
      console.error("Function Error:", error);
      return res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
  });
});

// Get Firebase Config Function
exports.getConfig = onRequest((req, res) => {
  cors(req, res, () => {
    try {
      const config = {
        apiKey: process.env.FB_API_KEY,
        authDomain: process.env.FB_AUTH_DOMAIN,
        projectId: process.env.FB_PROJECT_ID,
        storageBucket: process.env.FB_STORAGE_BUCKET,
        messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
        appId: process.env.FB_APP_ID,
      };

      if (!config.apiKey || !config.projectId) {
        console.error("Firebase config incomplete");
        return res.status(500).json({ error: "Firebase config incomplete" });
      }

      return res.status(200).json({ firebaseConfig: config });
    } catch (error) {
      console.error("Error in get-config:", error);
      return res.status(500).json({ error: error.message });
    }
  });
});
