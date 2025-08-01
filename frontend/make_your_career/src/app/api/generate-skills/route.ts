// import { NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// export async function POST(req: Request) {
//   try {
//     const { education, experience } = await req.json();

//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const prompt = `
// You are a professional career coach AI helping users identify skills from their background.

// Your task is to analyze the user's education and experience and generate a list of relevant **skills** they might possess. For each skill, also include a brief explanation of **why** it is inferred. Your reasoning should help the user understand how their academic and professional background has contributed to building that skill.

// EDUCATION:
// - Favorite Subject: ${education.favSubject}
// - Degree: ${education.degree}
// - Field of Study: ${education.fieldOfStudy}

// EXPERIENCE:
// - Job Title: ${experience.jobTitle}
// - Description: ${experience.description}

// Output format:
// [
//   {
//     "skill": "Skill Name",
//     "reason": "Explanation why this skill is relevant"
//   }
// ]

// Return **only** the JSON array.
// `.trim();

//     const result = await model.generateContent(prompt);
//     let text = await result.response.text();

//     // Defensive: remove triple backticks if present
//     text = text.trim();
//     if (text.startsWith("```")) {
//       text = text.replace(/^```(json)?/, "").replace(/```$/, "").trim();
//     }

//     const skillsArray = JSON.parse(text);

//     return NextResponse.json({ skills: skillsArray });
//   } catch (err) {
//     console.error("API Error:", err);
//     return NextResponse.json({ error: "Failed to generate skills" }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { education, experience } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const prompt = `
You are a professional career coach AI helping users identify skills from their background.

Your task is to analyze the user's education and experience and generate a list of relevant **skills** they might possess. For each skill, also include a brief explanation of **why** it is inferred. Your reasoning should help the user understand how their academic and professional background has contributed to building that skill.

EDUCATION:
- Favorite Subject: ${education.favSubject}
- Degree: ${education.degree}
- Field of Study: ${education.fieldOfStudy}

EXPERIENCE:
- Job Title: ${experience.jobTitle}
- Description: ${experience.description}

Output format:
[
  {
    "skill": "Skill Name",
    "reason": "Explanation why this skill is relevant"
  }
]

Return **only** the JSON array.
`.trim();

    // Try Gemini 1.5 Flash
    try {
      const model1 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result1 = await model1.generateContent(prompt);
      const text1 = cleanAndParse(await result1.response.text());
      return NextResponse.json({ skills: text1 });
    } catch (err: any) {
      console.warn("gemini-1.5-flash failed, attempting gemini-2.5-flash", err?.status || err?.message);

      // Try Gemini 2.5 Flash
      try {
        const model2 = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result2 = await model2.generateContent(prompt);
        const text2 = cleanAndParse(await result2.response.text());
        return NextResponse.json({ skills: text2 });
      } catch (err2: any) {
        console.warn("gemini-2.5-flash also failed, attempting gemini-2.0-flash", err2?.status || err2?.message);

        // Final fallback to Gemini 2.0 Pro
        try {
          const model3 = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Adjust if it's just "gemini-pro"
          const result3 = await model3.generateContent(prompt);
          const text3 = cleanAndParse(await result3.response.text());
          return NextResponse.json({ skills: text3 });
        } catch (err3) {
          console.error("All model attempts failed.", err3);
          return NextResponse.json(
            { error: "All Gemini models are currently unavailable." },
            { status: 503 }
          );
        }
      }
    }

  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Failed to generate skills" }, { status: 500 });
  }
}

// Helper to sanitize and parse JSON
function cleanAndParse(text: string) {
  text = text.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(json)?/, "").replace(/```$/, "").trim();
  }
  return JSON.parse(text);
}
