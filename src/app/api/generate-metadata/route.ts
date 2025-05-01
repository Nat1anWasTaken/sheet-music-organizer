import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) {
  throw new Error("Missing GOOGLE_API_KEY in environment");
}

interface GeminiUploadResponse {
  file: {
    uri: string;
    mimeType: string;
  };
}

interface GeminiGenerateResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text: string }>;
    };
  }>;
}

export type PartInformation = {
  label: string;
  is_full_score: boolean;
  start_page: number;
  end_page: number;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

async function uploadToGemini(pdfData: Uint8Array): Promise<GeminiUploadResponse> {
  const res = await fetch(`https://generativelanguage.googleapis.com/upload/v1beta/files?uploadType=media&key=${GOOGLE_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/pdf" },
    body: pdfData,
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Upload failed: ${errText}`);
  }
  return res.json();
}

const JSON_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    composers: { type: "array", items: { type: "string" } },
    arrangement_type: { type: "string" },
    parts: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          is_full_score: { type: "boolean" },
          start_page: { type: "integer" },
          end_page: { type: "integer" },
        },
        required: ["label", "is_full_score", "start_page", "end_page"],
      },
    },
  },
  required: ["title", "composers", "arrangement_type", "parts"],
} as const;

async function callGemini(fileUri: string, mimeType: string): Promise<GeminiGenerateResponse> {
  const systemPrompt = `
You are the conductor of a world-renowned orchestra, with extensive knowledge of sheet music from around the globe.

As your assistant, I will provide you with a PDF file containing sheet music. Please analyze the content of the music score and provide the following information:

- **title**: The title of the score, typically the name of the music piece. Please write out the full original title, e.g., "Washington Post March".
- **composers**: The composers and arrangers of the piece. Please write out their full original names, e.g., "John Philip Sousa".
- **arrangement_type**: The type of arrangement, please name based on the instrumentation in the music sheet. e.g., "String Quartet", "Percussion Ensemble", "Concert Band". THIS IS NOT PART NAME SO IT SHOULDN'T BE SOMETHING LIKE "Full Score", "Flute 1"
- **parts**: A list of the individual parts included within the file. Carefully examine the document and specify the start and end pages of each part to facilitate later extraction. This means you must carefully inspect each page individually, rather than treating the entire document as one unit.
  - **label**: The type of part, typically the instrument or section name, such as "Flute I", "Percussion II". Reproduce exactly the label as written in the score. For the full ensemble score, always use "Full Score".
  - **is_full_score**: Indicates whether this part is the full score. If the music file includes introductions, prefaces, or other textual content, categorize it within the full score.
  - **start_page**: The starting page number of this part in the document.
  - **end_page**: The ending page number of this part in the document.
`;
  const payload = {
    model: "gemini-2.0-flash-lite",
    systemInstruction: { role: "system", parts: [{ text: systemPrompt }] },
    contents: [
      { role: "user", parts: [{ fileData: { fileUri, mimeType } }] },
      {
        role: "user",
        parts: [{ text: "Please extract all fields as JSON only." }],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: JSON_SCHEMA,
    },
  };

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${payload.model}:generateContent?key=${GOOGLE_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GenerateContent failed: ${errText}`);
  }
  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const files = form.getAll("files") as File[];
    if (files.length === 0) {
      return jsonError("Please upload at least one file.", 400);
    }

    // Get the first file (which should be the already merged PDF from the client)
    const pdfFile = files[0];
    const pdfData = new Uint8Array(await pdfFile.arrayBuffer());
    const { file } = await uploadToGemini(pdfData);
    const genResult = await callGemini(file.uri, file.mimeType);

    const raw = genResult.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) {
      throw new Error("No content found in Gemini response");
    }
    const parsed = JSON.parse(raw) as {
      title: string;
      composers: string[];
      arrangement_type: string;
      parts: PartInformation[];
    };

    return NextResponse.json({
      title: parsed.title,
      composers: parsed.composers,
      arrangement_type: parsed.arrangement_type,
      parts: parsed.parts,
    });
  } catch (error: unknown) {
    console.error(error);
    const message = error instanceof Error ? error.message : String(error);
    return jsonError(message, 500);
  }
}
