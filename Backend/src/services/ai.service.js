require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: `
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
  `
  
  
});

async function simplifyReportAI(filePath, mimetype) {
  try {
    const isImage = mimetype.startsWith("image/");
    let result;

    if (isImage) {
      const imageBuffer = fs.readFileSync(filePath);
      const base64 = imageBuffer.toString("base64");

      result = await model.generateContent([
        {
          inlineData: { data: base64, mimeType: mimetype },
        },
      ]);
    } else {
      const text = fs.readFileSync(filePath, "utf8");
      result = await model.generateContent(text);
    }

    const raw = result.response.text();
    console.log(" Raw AI Response:", raw);

    // Try to extract valid JSON
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      return { status: "unprocessed", reason: "AI did not return valid JSON" };
    }

    const json = JSON.parse(match[0]);
    return json;
  } catch (err) {
    console.error(" AI Service Error:", err);
    return { status: "unprocessed", reason: "AI processing error" };
  } finally {
    
    fs.unlink(filePath, (e) => e && console.error("Failed to delete file:", e));
  }
}

module.exports = { simplifyReportAI };
