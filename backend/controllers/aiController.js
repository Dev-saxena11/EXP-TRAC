// No import needed: Using modern Node.js global fetch function

export async function parseTransactionNLP(req, res) {
  const { text, clientDate } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return res.status(500).json({
      success: false,
      message: "Gemini API Key is not configured on the server. Please add GEMINI_API_KEY to your .env file.",
    });
  }

  if (!text) {
    return res.status(400).json({
      success: false,
      message: "Text query is required for parsing.",
    });
  }

  // Fallback to current date on server if client didn't supply one
  const referenceDate = clientDate || new Date().toISOString().split("T")[0];

  const systemInstruction = `
    You are a precise financial assistant. Extract transaction details from the user's natural language input.
    Use the reference date: "${referenceDate}" to parse relative dates like "yesterday", "today", "last Friday", etc.
    
    Rule for category selection:
    Map the category to exactly one of the following standard values. If it does not fit, use "Other":
    - Food
    - Housing
    - Transport
    - Shopping
    - Entertainment
    - Utilities
    - Healthcare
    - Salary
    - Freelance
    - Savings
    - Other

    Rule for transaction type:
    Set type to "expense" by default, unless words like "salary", "earned", "freelance", "got paid", "received" imply an income.

    Return ONLY a JSON object matching this schema:
    {
      "description": "Clean title of the transaction",
      "amount": number (must be positive),
      "category": "One of the listed categories",
      "date": "YYYY-MM-DD",
      "type": "expense" or "income"
    }
  `;

  const modelsToTry = [
    "gemini-2.5-flash",
    "gemini-3.5-flash",
    "gemini-2.0-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-2.0-flash"
  ];

  let lastErrorMsg = "";

  for (const model of modelsToTry) {
    try {
      console.log(`Attempting NLP parse using model: ${model}`);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${systemInstruction}\n\nUser Input: "${text}"`,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`Model ${model} failed:`, errText);
        try {
          const errJson = JSON.parse(errText);
          lastErrorMsg = errJson.error?.message || "Service error.";
        } catch {
          lastErrorMsg = errText || "Service error.";
        }
        continue; // Try next model in list
      }

      const data = await response.json();
      const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!candidateText) {
        lastErrorMsg = "Empty generative response.";
        continue;
      }

      const parsedJson = JSON.parse(candidateText.trim());

      console.log(`Successfully parsed transaction using ${model}`);
      return res.status(200).json({
        success: true,
        data: parsedJson,
      });

    } catch (error) {
      console.error(`Error with model ${model}:`, error);
      lastErrorMsg = error.message || "Request exception.";
    }
  }

  return res.status(502).json({
    success: false,
    message: `Gemini AI service is currently unavailable. details: ${lastErrorMsg}`,
  });
}
