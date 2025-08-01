// import { NextRequest, NextResponse } from 'next/server';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// export async function POST(request: NextRequest) {
//   console.log('API Route called');
  
//   try {
//     // Check if API key is configured first
//     if (!process.env.GEMINI_API_KEY) {
//       console.error('GEMINI_API_KEY environment variable is not set');
//       return NextResponse.json(
//         { error: 'Gemini API key is not configured' },
//         { status: 500 }
//       );
//     }

//     // Parse the request body
//     const body = await request.json();
//     console.log('Request body received:', { 
//       hasResumeText: !!body.resumeText, 
//       hasJobDesc: !!body.jobDesc,
//       resumeLength: body.resumeText?.length || 0,
//       jobDescLength: body.jobDesc?.length || 0
//     });

//     const { resumeText, jobDesc } = body;

//     // Validate input
//     if (!resumeText || !jobDesc) {
//       console.error('Missing required fields:', { resumeText: !!resumeText, jobDesc: !!jobDesc });
//       return NextResponse.json(
//         { error: 'Resume text and job description are required' },
//         { status: 400 }
//       );
//     }

//     console.log('Initializing GoogleGenerativeAI...');
//     // Initialize Gemini AI with server-side environment variable
//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//     console.log('Getting Gemini model...');
//     const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); // ✅ Updated model name

//     // Create the prompt for detailed analysis
//     const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze the resume against the job description and provide:

// 1. A compatibility score (0-100)
// 2. Detailed analysis of strengths and weaknesses
// (dont give output with ** these aestarsik)
// Resume: ${resumeText}

// Job Description: ${jobDesc}

// Please respond in this EXACT format:

// SCORE: [number between 0-100]

// ANALYSIS:
// ✅ STRENGTHS:
// - [List 3-4 key strengths/matches]

// ⚠️ AREAS FOR IMPROVEMENT:
// - [List 3-4 specific areas that need work]

// 💡 RECOMMENDATIONS:
// - [List 3-4 actionable suggestions to improve the match]

// 🎯 KEY MISSING KEYWORDS:
// - [List important keywords from job description that are missing from resume]`;

//     console.log('Sending request to Gemini...');
//     // Generate content
//     const result = await model.generateContent(prompt);
//     const response = result.response;
//     const text = response.text();

//     console.log('Gemini response:', text);

//     // Extract score from response
//     const scoreMatch = text.match(/SCORE:\s*(\d+)/);
//     const matchScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;

//     // Extract analysis (everything after "ANALYSIS:")
//     const analysisMatch = text.match(/ANALYSIS:([\s\S]*)/);
//     const analysis = analysisMatch ? analysisMatch[1].trim() : "Analysis not available.";

//     // Ensure score is between 0-100
//     const finalScore = Math.min(Math.max(matchScore, 0), 100);

//     console.log('Final score:', finalScore);
//     console.log('Analysis length:', analysis.length);

//     return NextResponse.json({ 
//       matchScore: finalScore,
//       analysis: analysis,
//       rawResponse: text.trim()
//     });

//   } catch (error: any) {
//     console.error('API Route Error:', error);
//     console.error('Error stack:', error.stack);
    
//     // Handle specific error types
//     if (error.message?.includes('API key')) {
//       return NextResponse.json(
//         { error: 'Invalid API key configuration' },
//         { status: 401 }
//       );
//     }

//     if (error.message?.includes('quota')) {
//       return NextResponse.json(
//         { error: 'API quota exceeded. Please try again later.' },
//         { status: 429 }
//       );
//     }

//     if (error.message?.includes('SAFETY')) {
//       return NextResponse.json(
//         { error: 'Content filtered by safety settings. Please try with different text.' },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { 
//         error: 'Failed to process ATS check. Please try again.',
//         details: error.message 
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
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
          maxOutputTokens: 1500,
          temperature: 0.7,
        }
      });
      
      // Try the model with retry logic
      const result = await callGeminiWithRetry(model, prompt, 2);
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
      return text;
      
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

export async function POST(request: NextRequest) {
  console.log('API Route called');
  
  try {
    // Check if API key is configured first
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    // Parse the request body
    const body = await request.json();
    console.log('Request body received:', { 
      hasResumeText: !!body.resumeText, 
      hasJobDesc: !!body.jobDesc,
      resumeLength: body.resumeText?.length || 0,
      jobDescLength: body.jobDesc?.length || 0
    });

    const { resumeText, jobDesc } = body;

    // Validate input
    if (!resumeText || !jobDesc) {
      console.error('Missing required fields:', { resumeText: !!resumeText, jobDesc: !!jobDesc });
      return NextResponse.json(
        { error: 'Resume text and job description are required' },
        { status: 400 }
      );
    }

    console.log('Initializing GoogleGenerativeAI with model fallback...');
    // Initialize Gemini AI with server-side environment variable
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Create the prompt for detailed analysis
    const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze the resume against the job description and provide:

1. A compatibility score (0-100)
2. Detailed analysis of strengths and weaknesses
(dont give output with ** these aestarsik)
Resume: ${resumeText}

Job Description: ${jobDesc}

Please respond in this EXACT format:

SCORE: [number between 0-100]

ANALYSIS:
✅ STRENGTHS:
- [List 3-4 key strengths/matches]

⚠️ AREAS FOR IMPROVEMENT:
- [List 3-4 specific areas that need work]

💡 RECOMMENDATIONS:
- [List 3-4 actionable suggestions to improve the match]

🎯 KEY MISSING KEYWORDS:
- [List important keywords from job description that are missing from resume]`;

    console.log('Sending request to Gemini with fallback mechanism...');
    // Generate content using fallback mechanism
    const text = await callGeminiWithModelFallback(genAI, prompt);

    console.log('Gemini response:', text);

    // Extract score from response
    const scoreMatch = text.match(/SCORE:\s*(\d+)/);
    const matchScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    // Extract analysis (everything after "ANALYSIS:")
    const analysisMatch = text.match(/ANALYSIS:([\s\S]*)/);
    const analysis = analysisMatch ? analysisMatch[1].trim() : "Analysis not available.";

    // Ensure score is between 0-100
    const finalScore = Math.min(Math.max(matchScore, 0), 100);

    console.log('Final score:', finalScore);
    console.log('Analysis length:', analysis.length);

    return NextResponse.json({ 
      matchScore: finalScore,
      analysis: analysis,
      rawResponse: text.trim()
    });

  } catch (error: any) {
    console.error('API Route Error:', error);
    console.error('Error stack:', error.stack);
    
    // Handle specific error types
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'Invalid API key configuration' },
        { status: 401 }
      );
    }

    if (isOverloadError(error)) {
      return NextResponse.json(
        { error: 'All AI models are busy right now. Please try again in a few minutes! 🤖' },
        { status: 503 }
      );
    }

    if (error.message?.includes('SAFETY')) {
      return NextResponse.json(
        { error: 'Content filtered by safety settings. Please try with different text.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to process ATS check. Please try again.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}