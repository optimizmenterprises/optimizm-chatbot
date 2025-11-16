import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const last = messages?.[messages.length - 1]?.content || "";

  return new Response(
    "Thanks for chatting with Optimizm AI! You said: " + last,
    {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    }
  );
}
