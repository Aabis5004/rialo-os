import { GoogleGenerativeAI } from "@google/generative-ai";
import { loadCorpus } from "@/lib/corpus";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { question } = await req.json();

  if (!question || typeof question !== "string") {
    return Response.json({ error: "No question." }, { status: 400 });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return Response.json({ error: "Assistant not configured." }, { status: 500 });
  }

  const corpus = loadCorpus();
  const context = corpus
    .map((c) => `### Source: ${c.source}\n${c.text}`)
    .join("\n\n");

  const system = `You are Ask Rialo, an assistant that answers questions about the Rialo blockchain using ONLY the sources provided below.

Rules:
- Answer only from the sources. Never use outside knowledge.
- If the sources do not contain the answer, say exactly: "The Rialo papers I have don't cover that yet." Do not guess.
- Cite the source name in your answer, e.g. (source: reactive transactions).
- Be concise. Two or three sentences unless more is needed.
- Never invent numbers, names, or API details.

SOURCES:
${context}`;

  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: system,
    });
    const result = await model.generateContent(question);
    return Response.json({ answer: result.response.text() });
  } catch (e) {
    console.error("GEMINI ERROR:", e);
    return Response.json(
      { error: "The assistant is unavailable right now." },
      { status: 500 }
    );
  }
}
