import { territories } from "@/data/territories";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ territories });
}
