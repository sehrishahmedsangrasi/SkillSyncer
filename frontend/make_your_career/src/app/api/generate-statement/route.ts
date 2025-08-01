// // app/api/generate-statement/route.ts
// import { NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { userData } = body;

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//    const prompt = `
// You are a professional career advisor and expert writer.

// Task: Write a concise and inspiring career statement for a user based on their background, education, skills, and experiences.

// Context: The user profile is as follows:
// ${JSON.stringify(userData)}

// Format & Tone:
// - Use clear, professional, and human-like English.
// - The statement should sound authentic and motivating.
// - Avoid buzzwords or clichés; instead, focus on realistic aspirations and strengths.
// - Length: Around 3–5 sentences.

// Output:
// Return only the final career statement.
// `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();

//     return NextResponse.json({ output: text });
//   } catch (error) {
//     console.error("❌ Error in generate-statement route:", error);
//     return NextResponse.json(
//       { error: "Failed to generate statement." },
//       { status: 500 }
//     );
//   }
// }
// app/api/generate-statement/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userData } = body;

    const prompt = `
You are a professional career advisor and expert writer.

Task: Write a concise and inspiring career statement for a user based on their background, education, skills, and experiences.

Context: The user profile is as follows:
${JSON.stringify(userData)}

Format & Tone:
- Use clear, professional, and human-like English.
- The statement should sound authentic and motivating.
- Avoid buzzwords or clichés; instead, focus on realistic aspirations and strengths.
- Length: Around 3–5 sentences.

Output:
Return only the final career statement.
`.trim();

    // 1st attempt: gemini-1.5-flash
    try {
      const model1 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result1 = await model1.generateContent(prompt);
      const text1 = await result1.response.text();
      return NextResponse.json({ output: text1.trim() });
    } catch (err1: any) {
      console.warn("gemini-1.5-flash failed:", err1?.status || err1?.message);

      // 2nd attempt: gemini-2.5-flash
      try {
        const model2 = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result2 = await model2.generateContent(prompt);
        const text2 = await result2.response.text();
        return NextResponse.json({ output: text2.trim() });
      } catch (err2: any) {
        console.warn("gemini-2.5-flash failed:", err2?.status || err2?.message);

        // 3rd attempt: gemini-2.0-pro
        try {
          const model3 = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Or "gemini-pro" if needed
          const result3 = await model3.generateContent(prompt);
          const text3 = await result3.response.text();
          return NextResponse.json({ output: text3.trim() });
        } catch (err3) {
          console.error("All Gemini models failed:", err3);
          return NextResponse.json(
            { error: "All Gemini models are currently unavailable." },
            { status: 503 }
          );
        }
      }
    }
  } catch (error) {
    console.error("❌ Error in generate-statement route:", error);
    return NextResponse.json(
      { error: "Failed to generate statement." },
      { status: 500 }
    );
  }
}
