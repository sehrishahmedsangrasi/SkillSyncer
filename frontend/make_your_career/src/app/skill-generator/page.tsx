"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth,SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import EducationForm from "../../components/EducationForm";
import ExperienceForm from "../../components/ExperienceForm";
import NavBar from "../../components/navbar";


export default function SkillsGenerator() {
  const [eduFilled, setEduFilled] = useState(false);
  const [expFilled, setExpFilled] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const router = useRouter();
  const { userId, isSignedIn } = useAuth();

  const canProceed = eduFilled || expFilled;

  // Upload user ID to backend on mount
  // useEffect(() => {
  //   if (isSignedIn && userId) {
  //     fetch("http://localhost:5000/api/save-user", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ userId }),
  //     })
  //     .then(res => res.json())
  //     .then(data => console.log("User saved:", data))
  //     .catch(err => console.error("Error uploading user ID:", err));
  //   }
  // }, [userId, isSignedIn]);
  useEffect(() => {
    if (isSignedIn && userId) {
      fetch("https://skillsyncer-production.up.railway.app/api/save-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })
      .then(res => res.json())
      .then(data => console.log("User saved:", data))
      .catch(err => console.error("Error uploading user ID:", err));
    }
  }, [userId, isSignedIn]);


  const handleClick = () => {
    if (canProceed) {
      router.push("/skills");
    } else {
      setShowMsg(true);
      setTimeout(() => setShowMsg(false), 2500); // Hide after 2.5s
    }
  };

  return (
    <>
    <SignedIn>
        <NavBar />
        <main className="min-h-screen bg-black text-white p-6 pt-[2.5rem] flex flex-col items-center">
          <h1 className="text-4xl font-bold text-lavender mb-[3rem]">
            Skills Generator
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            <EducationForm onChange={setEduFilled} />
            <ExperienceForm onChange={setExpFilled} />
          </div>

          <div className="relative mt-[2.8rem]">
            <div className="flex flex-row items-center gap-4">
              <button
                onClick={handleClick}
                className={`font-semibold px-6 py-3 rounded-xl shadow-md transition ${
                  canProceed
                    ? "bg-lavender text-black hover:bg-[#9458f3]"
                    : "bg-lavender text-black cursor-not-allowed"
                }`}
              >
                Generate Skills
              </button>
            </div>

            {!canProceed && showMsg && (
              <div className="absolute top-full mt-2 text-sm text-red-400 bg-black border border-red-500 px-2 py-2 rounded-lg shadow">
                Please fill at least one form to proceed.
              </div>
            )}
          </div>

        </main>
    </SignedIn>
    <SignedOut>
          <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
