require("dotenv").config();
const fs = require("fs");
const { GoogleGenAI } = require("@google/genai"); // new official SDK (old @google/generative-ai is deprecated)

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_KEY });

// CHANGE HERE if Google retires the model: set GEMINI_MODEL in .env / Render instead of editing code.
const MODEL = "gemini-3.8-flash";

const SYSTEM_PROMPT = `
  You are an AI Medical Report Simplifier. Your job is to analyze medical reports (text or image),
  extract test names, values, and statuses, and give clear, patient-friendly explanations.
  
  ### Follow these steps strictly:
  
  1️⃣ OCR / Text Extraction:
    - Read text from image if provided.
    - Extract test names, values, and units.
    - Ignore hospital info, patient names, and dates.
    - Example: "Hemoglobin 10.2 g/dL (Low)" → valid test.
  
  2️⃣ Normalization:
    - Standardize test names, units, and values.
    - Include reference ranges when commonly known.
    - Detect “low”, “normal”, or “high” status.
  
  3️⃣ Patient-Friendly Summary:
    - Write a short, clear summary of abnormal results.
    - Explain each finding in plain English.
    - Mention **possible related conditions or causes** (e.g., "Low hemoglobin may relate to anemia").
    - **Do NOT give a final diagnosis or treatment advice.**
    - **Expected JSON Output Example:**
    {
      "summary": "Low hemoglobin and high white blood cell count.",
      "explanations": [
        "Low hemoglobin may relate to anemia.",
        "High WBC can occur with infections."
      ]
    }
  
  4️⃣ Final JSON Output:
  Return *strictly valid JSON* with this structure:
  
  {
    "tests": [
      {
        "name": "Hemoglobin",
        "value": 10.2,
        "unit": "g/dL",
        "status": "low",
        "ref_range": {"low": 12.0, "high": 15.0}
      }
    ],
    "summary": "[patient-friendly summary]",
    "explanations": ["[explanation 1]", "[explanation 2]"],
    "status": "ok"
  }
  
  ⚠️ Guardrail / Exit Condition:
  If no valid test data is found or JSON cannot be formed, respond ONLY with:
  {"status":"unprocessed","reason":"hallucinated tests not present in input"}
  `;

/**
 * Sends the uploaded report (image OR pdf) to Gemini and returns parsed JSON.
 * Always deletes the temp file afterwards.
 */
async function simplifyReportAI(filePath, mimetype) {
  try {
    // Images and PDFs are both sent the same way (Gemini reads both natively)
    const base64 = fs.readFileSync(filePath).toString("base64");

    const result = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: mimetype, data: base64 } },
            { text: "Analyze this medical report and return the JSON exactly as specified." },
          ],
        },
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json", // forces valid JSON output
        temperature: 0.2, // lower = fewer invented values
      },
    });

    return JSON.parse(result.text);
  } catch (err) {
    console.error("AI Service Error:", err.message); // message only, never the report text
    return { status: "unprocessed", reason: "AI processing error. Please try again." };
  } finally {
    fs.unlink(filePath, (e) => e && console.error("Failed to delete temp file:", e.message));
  }
}

module.exports = { simplifyReportAI };