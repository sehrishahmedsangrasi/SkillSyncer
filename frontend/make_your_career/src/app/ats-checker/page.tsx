"use client";

import { useState, useEffect } from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import NavBar from "../../components/navbar";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// // @ts-ignore
// import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/webpack";



// ✅ Dynamic worker loading to match installed version

export default function ATSChecker() {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [workerLoaded, setWorkerLoaded] = useState(false);

  // Remove the genAI initialization since we'll use API route

  // ✅ Load PDF.js worker dynamically
  useEffect(() => {
  const loadWorker = async () => {
    try {
      if (typeof window !== 'undefined') {
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
        setWorkerLoaded(true);
      }
    } catch (error) {
      console.error('Worker loading failed:', error);
      setWorkerLoaded(true);
    }
  };
  loadWorker();
}, []);

  const extractTextFromPDF = async (file: File) => {
  if (!workerLoaded) {
    alert("Please wait, PDF processor is loading...");
    return "";
  }
  
  try {
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf');
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(" ");
      text += pageText + "\n";
    }

    return text;
  } catch (error) {
    console.error("PDF extraction error:", error);
    alert("Error extracting PDF text. Try another file.");
    return "";
  }
};

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF.");
      return;
    }

    const text = await extractTextFromPDF(file);
    setResumeText(text);
  };

  const handleCheckATS = async () => {
    if (!resumeText || !jobDesc) {
      alert("Upload resume and job description first.");
      return;
    }

    setLoading(true);

    try {
      // Call our API route instead of directly using Gemini
      const response = await fetch('/api/check-ats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText,
          jobDesc,
        }),
      });

      // Log response details for debugging
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        // Try to get error details
        let errorMessage = 'Failed to check ATS compatibility';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.error('API Error:', errorData);
        } catch (parseError) {
          // If response isn't JSON, get text
          const errorText = await response.text();
          console.error('Non-JSON Error Response:', errorText);
          errorMessage = `Server error (${response.status}): ${errorText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Success response:', data);
      setMatchScore(data.matchScore);
      setAnalysis(data.analysis || "");
    } catch (err: any) {
      console.error("ATS Check Error:", err);
      alert(err.message || "Something went wrong while checking compatibility.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <SignedIn>
    <NavBar />
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12 gap-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-lavender mb-4 text-center  w-full">
        ATS Compatibility Checker
      </h1>
      <input
        type="file"
        accept="application/pdf"
        className="bg-black text-lavender border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)] rounded-lg p-2"
        onChange={handleFileChange}
      />

      <textarea
        placeholder="Paste Job Description here..."
        className="bg-black text-white border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)] rounded-xl p-4 w-full max-w-lg h-40"
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
      />

      <button
        onClick={handleCheckATS}
        className="mt-4 bg-purple-600 hover:bg-purple-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg"
      >
        {loading ? "Checking..." : "Check ATS Score"}
      </button>

      {matchScore !== null && (
        <div className="mt-8 flex flex-col items-center gap-6 w-full max-w-4xl">
          {/* Progress Circle */}
          <div className="w-48 h-48">
            <CircularProgressbar
              value={matchScore}
              text={`${matchScore}%`}
              styles={buildStyles({
                textColor: "#ffffff", // ✅ Changed to white for visibility
                pathColor: matchScore >= 70 ? "#a06bf5" : matchScore >= 50 ? "#a06bf5" : "#ef4444", // Green/Yellow/Red based on score
                trailColor: "#301934", // Dark gray trail
                textSize: "24px", // ✅ Larger text
                pathTransitionDuration: 1.5,
                
              })}
            />
          </div>

          {/* Score Interpretation */}
          <div className="text-center">
            <p className={`text-2xl font-bold ${
              matchScore >= 70 ? "text-green-400" : 
              matchScore >= 50 ? "text-yellow-400" : 
              "text-red-400"
            }`}>
              {matchScore >= 70 ? "Excellent Match! 🎉" : 
               matchScore >= 50 ? "Good Match 👍" : 
               "Needs Improvement 📝"}
            </p>
            <p className="text-gray-300 mt-2">
              {matchScore >= 70 ? "Your resume is well-aligned with this job!" : 
               matchScore >= 50 ? "Your resume has potential for this role." : 
               "Consider optimizing your resume for better ATS compatibility."}
            </p>
          </div>

          {/* Detailed Analysis */}
          {analysis && (
            <div
                className="w-full bg-black border border-purple-500 rounded-xl p-6 shadow-lg"
                style={{
                  boxShadow: "0 0 8px 2px rgba(168, 85, 247, 0.8)", // purple glow
                }}
              >
              <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                📊 Detailed Analysis
              </h3>
              <div className="text-gray-300 whitespace-pre-line leading-relaxed">
                {analysis}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </SignedIn>
    <SignedOut>
          <RedirectToSignIn />
      </SignedOut>
    </>
  );
}