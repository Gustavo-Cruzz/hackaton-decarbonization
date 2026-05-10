import { territories } from "@/data/territories";
import { answerChat } from "@/lib/chat";
import { generateChatWithGemini } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  let response = null;

  try {
    response = await generateChatWithGemini(body, territories);
  } catch {
    response = null;
  }

  if (!response) {
    response = answerChat(body, territories);
  }

  return NextResponse.json(response);
}
