import { territories } from "@/data/territories";
import { answerChat } from "@/lib/chat";
import { generateChatWithGemini } from "@/lib/gemini";
import { isErrorPayload, readJsonBody, validateChatRequest } from "@/lib/request-validation";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const rawBody = await readJsonBody(request);
    if (isErrorPayload(rawBody)) {
      return NextResponse.json(rawBody, { status: 400 });
    }

    const body = validateChatRequest(rawBody);
    if (!body) {
      return NextResponse.json({ error: "Invalid chat payload" }, { status: 400 });
    }

    let response = null;
    try {
      response = await generateChatWithGemini(body, territories);
    } catch (error) {
      console.error("Gemini chat failure", error);
      response = null;
    }

    if (!response) {
      response = answerChat(body, territories);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat route failure", error);
    return NextResponse.json({ error: "Chat service failure" }, { status: 500 });
  }
}
