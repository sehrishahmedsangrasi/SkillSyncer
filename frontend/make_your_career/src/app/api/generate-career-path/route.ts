// // app/api/generate-career-path/route.ts
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextResponse } from "next/server";

// // Simple in-memory rate limiting (use Redis for production)
// const userRequestMap = new Map<string, number[]>();

// function isRateLimited(userId: string): boolean {
//   const now = Date.now();
//   const windowMs = 60 * 1000; // 1 minute window
//   const maxRequests = 2; // Max 2 requests per minute
  
//   if (!userRequestMap.has(userId)) {
//     userRequestMap.set(userId, []);
//   }
  
//   const userRequests = userRequestMap.get(userId)!;
  
//   // Remove old requests outside the window
//   const validRequests = userRequests.filter(time => now - time < windowMs);
  
//   if (validRequests.length >= maxRequests) {
//     return true; // Rate limited
//   }
  
//   // Add current request
//   validRequests.push(now);
//   userRequestMap.set(userId, validRequests);
  
//   return false;
// }

// async function sleep(ms: number): Promise<void> {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// // Function to clean up Gemini's markdown formatting
// function cleanGeminiResponse(text: string): string {
//   console.log("🧹 Original text:", text);
  
//   let cleanedText = text
//     // Remove all ** formatting (both single and multiple)
//     .replace(/\*{2,}/g, '') // Remove ** or *** or ****
//     .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **text**
//     .replace(/\*(.*?)\*/g, '$1')     // Remove *text*
//     .replace(/`(.*?)`/g, '$1')       // Remove `text`
//     .replace(/#{1,6}\s/g, '')        // Remove # headers
//     .replace(/\*+/g, '')             // Remove any remaining * characters
//     .trim();
  
//   console.log("🧹 Cleaned text:", cleanedText);
//   return cleanedText;
// }

// async function callGeminiWithRetry(model: any, prompt: string, maxRetries = 3): Promise<string> {
//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       console.log(`Gemini attempt ${attempt}/${maxRetries}`);
      
//       const result = await model.generateContent(prompt);
//       const text = await result.response.text();
      
//       console.log("✅ Gemini response received successfully");
      
//       // Clean up the response to remove markdown formatting
//       const cleanedText = cleanGeminiResponse(text);
//       return cleanedText;
      
//     } catch (error: any) {
//       console.error(`❌ Attempt ${attempt} failed:`, error.message);
      
//       // Check if it's a rate limit or overload error
//       if (error.message?.includes('overloaded') || 
//           error.message?.includes('quota') || 
//           error.message?.includes('429') ||
//           error.status === 429) {
        
//         if (attempt < maxRetries) {
//           const delayMs = Math.pow(2, attempt) * 1000; // Exponential backoff
//           console.log(`⏳ Waiting ${delayMs}ms before retry...`);
//           await sleep(delayMs);
//           continue;
//         }
//       }
      
//       // If it's the last attempt or not a rate limit error, throw
//       throw error;
//     }
//   }
  
//   throw new Error("Max retries exceeded");
// }

// export async function POST(req: Request) {
//   console.log("=== Career Path API Route Called ===");
  
//   try {
//     // Check API key
//     if (!process.env.GEMINI_API_KEY) {
//       console.error("GEMINI_API_KEY is not set");
//       return NextResponse.json({ error: "API key not configured" }, { status: 500 });
//     }

//     const { userData, userId } = await req.json();
    
//     // Rate limiting check
//     if (userId && isRateLimited(userId)) {
//       console.log(`🚫 Rate limited user: ${userId}`);
//       return NextResponse.json({ 
//         error: "Rate limit exceeded",
//         details: "Please wait a minute before requesting again. Our AI needs a moment to breathe! 🤖"
//       }, { status: 429 });
//     }

//     if (!userData || !Array.isArray(userData) || userData.length === 0) {
//       return NextResponse.json({ error: "User data is required" }, { status: 400 });
//     }

//     // Process user data (keep your existing logic)
//     const allEducation = userData.flatMap((entry: any) => entry.education || []);
//     const allExperience = userData.flatMap((entry: any) => entry.experience || []);
//     const allSkills = userData.flatMap((entry: any) => entry.skills || []);

//     // Optimize prompt - make it shorter and more focused
//     const educationSummary = allEducation.length > 0 
//       ? allEducation.slice(0, 3).map((e: any) => `${e.degree} in ${e.fieldOfStudy}`).join(", ")
//       : "No formal education listed";

//     const experienceSummary = allExperience.length > 0
//       ? allExperience.slice(0, 3).map((e: any) => e.jobTitle).join(", ")
//       : "No work experience listed";

//     const skillsSummary = allSkills.length > 0
//       ? allSkills.slice(0, 10).join(", ")
//       : "No specific skills listed";

//     const prompt = `
// Profile Summary:
// Education: ${educationSummary}
// Experience: ${experienceSummary}  
// Skills: ${skillsSummary}

// Suggest 8 realistic career paths for this profile. Format as plain text with:
// • Career Title: One sentence description
// • Career Title: One sentence description
// (etc.)

// Keep descriptions under 20 words each. Do not use any markdown formatting like bold, italic, or code blocks. Use plain text only.`;

//     console.log("🤖 Initializing Gemini with retry logic...");
//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
//     // Use gemini-1.5-flash (not latest) for better stability
//     const model = genAI.getGenerativeModel({ 
//       model: "gemini-2.0-flash",
//       generationConfig: {
//         maxOutputTokens: 800, // Limit response size
//         temperature: 0.7,
//       }
//     });
    
//     const text = await callGeminiWithRetry(model, prompt);

//     return NextResponse.json({ careerPaths: text });
    
//   } catch (error: any) {
//     console.error("=== Career Path API Error ===");
//     console.error("Full error:", error);
    
//     // Handle specific Gemini errors
//     if (error.message?.includes('overloaded') || error.status === 429) {
//       return NextResponse.json({ 
//         error: "Service temporarily overloaded",
//         details: "overloaded - The AI service is busy right now. Please try again in a few minutes! 🤖"
//       }, { status: 503 });
//     }
    
//     if (error.message?.includes('quota')) {
//       return NextResponse.json({ 
//         error: "Quota exceeded",
//         details: "Daily API quota reached. Please try again tomorrow! 📅"
//       }, { status: 429 });
//     }
    
//     return NextResponse.json({ 
//       error: "Failed to generate career paths",
//       details: error.message || "Unknown error occurred"
//     }, { status: 500 });
//   }
// }
// app/api/generate-career-path/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Simple in-memory rate limiting (use Redis for production)
const userRequestMap = new Map<string, number[]>();

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 2; // Max 2 requests per minute
  
  if (!userRequestMap.has(userId)) {
    userRequestMap.set(userId, []);
  }
  
  const userRequests = userRequestMap.get(userId)!;
  
  // Remove old requests outside the window
  const validRequests = userRequests.filter(time => now - time < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return true; // Rate limited
  }
  
  // Add current request
  validRequests.push(now);
  userRequestMap.set(userId, validRequests);
  
  return false;
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to clean up Gemini's markdown formatting
function cleanGeminiResponse(text: string): string {
  console.log("🧹 Original text:", text);
  
  let cleanedText = text
    // Remove all ** formatting (both single and multiple)
    .replace(/\*{2,}/g, '') // Remove ** or *** or ****
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **text**
    .replace(/\*(.*?)\*/g, '$1')     // Remove *text*
    .replace(/`(.*?)`/g, '$1')       // Remove `text`
    .replace(/#{1,6}\s/g, '')        // Remove # headers
    .replace(/\*+/g, '')             // Remove any remaining * characters
    .trim();
  
  console.log("🧹 Cleaned text:", cleanedText);
  return cleanedText;
}

// Model fallback configuration
const MODEL_FALLBACK_ORDER = [
  "gemini-1.5-flash",
  "gemini-2.0-flash", 
  "gemini-2.5-flash"
];

function isOverloadError(error: any): boolean {
  return error.message?.includes('overloaded') || 
         error.message?.includes('quota') || 
         error.message?.includes('429') ||
         error.status === 429 ||
         error.message?.includes('unavailable') ||
         error.message?.includes('service');
}

async function callGeminiWithModelFallback(genAI: GoogleGenerativeAI, prompt: string): Promise<string> {
  let lastError: any;
  
  for (let modelIndex = 0; modelIndex < MODEL_FALLBACK_ORDER.length; modelIndex++) {
    const modelName = MODEL_FALLBACK_ORDER[modelIndex];
    console.log(`🤖 Trying model: ${modelName} (${modelIndex + 1}/${MODEL_FALLBACK_ORDER.length})`);
    
    try {
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 0.7,
        }
      });
      
      // Try the model with retry logic
      const result = await callGeminiWithRetry(model, prompt, 2); // Reduced retries per model
      console.log(`✅ Success with model: ${modelName}`);
      return result;
      
    } catch (error: any) {
      console.error(`❌ Model ${modelName} failed:`, error.message);
      lastError = error;
      
      // If it's an overload error and we have more models to try, continue
      if (isOverloadError(error) && modelIndex < MODEL_FALLBACK_ORDER.length - 1) {
        console.log(`⏭️  Trying next model due to overload...`);
        await sleep(1000); // Brief pause before trying next model
        continue;
      }
      
      // If it's not an overload error or we're on the last model, throw
      throw error;
    }
  }
  
  // This should never be reached, but just in case
  throw lastError || new Error("All models failed");
}

async function callGeminiWithRetry(model: any, prompt: string, maxRetries = 2): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`  Attempt ${attempt}/${maxRetries} for current model`);
      
      const result = await model.generateContent(prompt);
      const text = await result.response.text();
      
      console.log("  ✅ Model response received successfully");
      
      // Clean up the response to remove markdown formatting
      const cleanedText = cleanGeminiResponse(text);
      return cleanedText;
      
    } catch (error: any) {
      console.error(`  ❌ Attempt ${attempt} failed:`, error.message);
      
      // Check if it's a rate limit or overload error
      if (isOverloadError(error)) {
        if (attempt < maxRetries) {
          const delayMs = Math.pow(2, attempt) * 1000; // Exponential backoff
          console.log(`  ⏳ Waiting ${delayMs}ms before retry...`);
          await sleep(delayMs);
          continue;
        }
      }
      
      // If it's the last attempt or not a rate limit error, throw
      throw error;
    }
  }
  
  throw new Error("Max retries exceeded for current model");
}

export async function POST(req: Request) {
  console.log("=== Career Path API Route Called ===");
  
  try {
    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const { userData, userId } = await req.json();
    
    // Rate limiting check
    if (userId && isRateLimited(userId)) {
      console.log(`🚫 Rate limited user: ${userId}`);
      return NextResponse.json({ 
        error: "Rate limit exceeded",
        details: "Please wait a minute before requesting again. Our AI needs a moment to breathe! 🤖"
      }, { status: 429 });
    }

    if (!userData || !Array.isArray(userData) || userData.length === 0) {
      return NextResponse.json({ error: "User data is required" }, { status: 400 });
    }

    // Process user data (keep your existing logic)
    const allEducation = userData.flatMap((entry: any) => entry.education || []);
    const allExperience = userData.flatMap((entry: any) => entry.experience || []);
    const allSkills = userData.flatMap((entry: any) => entry.skills || []);

    // Optimize prompt - make it shorter and more focused
    const educationSummary = allEducation.length > 0 
      ? allEducation.slice(0, 3).map((e: any) => `${e.degree} in ${e.fieldOfStudy}`).join(", ")
      : "No formal education listed";

    const experienceSummary = allExperience.length > 0
      ? allExperience.slice(0, 3).map((e: any) => e.jobTitle).join(", ")
      : "No work experience listed";

    const skillsSummary = allSkills.length > 0
      ? allSkills.slice(0, 10).join(", ")
      : "No specific skills listed";

    const prompt = `
Profile Summary:
Education: ${educationSummary}
Experience: ${experienceSummary}  
Skills: ${skillsSummary}

Suggest 8 realistic career paths for this profile. Format as plain text with:
• Career Title: One sentence description
• Career Title: One sentence description
(etc.)

Keep descriptions under 20 words each. Do not use any markdown formatting like bold, italic, or code blocks. Use plain text only.`;

    console.log("🤖 Initializing Gemini with model fallback...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const text = await callGeminiWithModelFallback(genAI, prompt);

    return NextResponse.json({ careerPaths: text });
    
  } catch (error: any) {
    console.error("=== Career Path API Error ===");
    console.error("Full error:", error);
    
    // Handle specific Gemini errors
    if (isOverloadError(error)) {
      return NextResponse.json({ 
        error: "Service temporarily overloaded",
        details: "All AI models are busy right now. Please try again in a few minutes! 🤖"
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      error: "Failed to generate career paths",
      details: error.message || "Unknown error occurred"
    }, { status: 500 });
  }
}

