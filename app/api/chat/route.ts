// import { NextResponse } from "next/server";

// type IncomingMessage = {
//     role: "user" | "assistant" | "system";
//     content: string;
// };

// export async function POST(req: Request) {
//     try {
//         const apiKey = process.env.OPENAI_API_KEY;
//         if (!apiKey) {
//             return NextResponse.json(
//                 { error: "Missing OPENAI_API_KEY in environment" },
//                 { status: 500 }
//             );
//         }

//         const body = await req.json();
//         const messages = (body?.messages as IncomingMessage[] | undefined) ?? [];

//         if (!Array.isArray(messages) || messages.length === 0) {
//             return NextResponse.json(
//                 { error: "Request must include non-empty messages array" },
//                 { status: 400 }
//             );
//         }

//         const response = await fetch("https://api.openai.com/v1/chat/completions", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${apiKey}`,
//             },
//             body: JSON.stringify({
//                 model: "gpt-4o-mini",
//                 messages,
//                 temperature: 0.7,
//             }),
//         });

//         if (!response.ok) {
//             const err = await safeJson(response);
//             return NextResponse.json(
//                 { error: "Upstream error", details: err },
//                 { status: 502 }
//             );
//         }

//         const data = await response.json();
//         const reply: string = data?.choices?.[0]?.message?.content ?? "";

//         return NextResponse.json({ reply });
//     } catch (error) {
//         return NextResponse.json({ error: toErrorMessage(error) }, { status: 500 });
//     }
// }

// async function safeJson(res: Response) {
//     try {
//         return await res.json();
//     } catch {
//         return { status: res.status, statusText: res.statusText };
//     }
// }

// function toErrorMessage(error: unknown): string {
//     return error instanceof Error ? error.message : "Unknown error";
// }

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("q") || "space"; // default keyword if none

    const res = await fetch(
      `https://api.spaceflightnewsapi.net/v4/articles/?search=${keyword}&limit=5`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch news" }, { status: res.status });
    }

    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      return NextResponse.json({ headlines: [] });
    }

    const headlines = data.results.map((a: any) => ({
      title: a.title,
      url: a.url,
    }));

    return NextResponse.json({ headlines });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", details: String(error) },
      { status: 500 }
    );
  }
}







