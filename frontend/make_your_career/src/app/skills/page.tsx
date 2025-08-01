// "use client";
// import { useEffect, useState } from "react";
// import { useFormData } from "../context/FormContext";

// type Skill = {
//   skill: string;
//   reason: string;
// };

// export default function SkillsPage() {
//   const { educationData, experienceData } = useFormData();
//   const [skills, setSkills] = useState<Skill[]>([]);
//   const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
//   const [openDescription, setOpenDescription] = useState<string | null>(null);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const fetchSkills = async () => {
//       try {
//         const response = await fetch("/api/generate-skills", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             education: educationData,
//             experience: experienceData,
//           }),
//         });

//         const data = await response.json();
//         if (data.skills) {
//           setSkills(data.skills);
//         }
//       } catch (err) {
//         console.error("Failed to load skills", err);
//       }
//     };

//     fetchSkills();

//     const checkMobile = () => setIsMobile(window.innerWidth < 768);
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   const toggleSkill = (skill: string) => {
//     setSelectedSkills(prev =>
//       prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
//     );
//   };

//   const handleDescriptionToggle = (skill: string) => {
//     setOpenDescription(prev => (prev === skill ? null : skill));
//   };

//   const handleSubmit = () => {
//     console.log("Selected Skills:", selectedSkills);
//   };

//   return (
//     <div className="min-h-screen bg-black text-lavender p-6">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-bold text-center mb-8">
//           Please Select Your Skills
//         </h1>

//         {skills.length === 0 ? (
//           <p className="text-center text-lg">⏳ Generating skills...</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {skills.map(({ skill, reason }, index) => {
//               const isSelected = selectedSkills.includes(skill);
//               const isOpen = openDescription === skill;
//               const isTopRow = index < 2; // Adjust for 2-column layout

//               return (
//                 <div
//                   key={skill}
//                   className={`relative group p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
//                     isSelected
//                       ? "bg-lavender text-black border-lavender"
//                       : "bg-black text-lavender border-lavender shadow-[0_0_15px_rgba(168,85,247,0.8)] hover:shadow-none"
//                   }`}
//                   onClick={() => {
//                     if (isMobile) {
//                       handleDescriptionToggle(skill);
//                     } else {
//                       toggleSkill(skill);
//                     }
//                   }}
//                   onMouseEnter={() => {
//                     if (!isMobile) setOpenDescription(skill);
//                   }}
//                   onMouseLeave={() => {
//                     if (!isMobile) setOpenDescription(null);
//                   }}
//                 >
//                   {/* Tooltip (desktop) or Box (mobile) */}
//                   {isMobile ? (
//                     isOpen && (
//                       <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-lavender text-black text-sm p-3 rounded-lg shadow-md z-20 w-64 text-center">
//                         <div className="flex justify-between items-center mb-1">
//                           <span className="font-semibold">Why?</span>
//                           <button
//                             className="text-black font-bold text-sm"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setOpenDescription(null);
//                             }}
//                           >
//                             🗙
//                           </button>
//                         </div>
//                         <p className="whitespace-pre-line">{reason}</p>
//                       </div>
//                     )
//                   ) : (
//                     <div
//                       className={`absolute z-10 text-sm p-2 rounded-lg shadow-md bg-lavender text-black text-center w-64 opacity-0 group-hover:opacity-100 transition whitespace-pre-line
//                         ${isTopRow ? "top-full mt-2" : "bottom-full mb-2"} left-1/2 transform -translate-x-1/2`}
//                     >
//                       {reason}
//                     </div>
//                   )}

//                   {/* Skill Text and Mobile Plus Button */}
//                   <div className="flex justify-between items-center">
//                     <p className="font-semibold text-lg">{skill}</p>
//                     {isMobile && (
//                       <button
//                         className="text-xl font-bold text-lavender bg-black rounded-full w-7 h-7 flex items-center justify-center"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           toggleSkill(skill);
//                         }}
//                       >
//                         {selectedSkills.includes(skill) ? '✕' : '+'}
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {skills.length > 0 && (
//           <div className="text-center mt-10">
//             <button
//               onClick={handleSubmit}
//               className="bg-lavender text-black px-6 py-3 rounded-lg font-semibold hover:bg-hlavendar transition"
//             >
//               Generate Career Identity 🚀
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

//2


// "use client";
// import { useEffect, useState } from "react";
// import { useFormData } from "../context/FormContext";

// type Skill = {
//   skill: string;
//   reason: string;
// };

// export default function SkillsPage() {
//   const { educationData, experienceData, setSelectedSkills } = useFormData();
//   const [skills, setSkills] = useState<Skill[]>([]);
//   const [selectedSkillsLocal, setSelectedSkillsLocal] = useState<string[]>([]);
//   const [openDescription, setOpenDescription] = useState<string | null>(null);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const fetchSkills = async () => {
//       try {
//         const response = await fetch("/api/generate-skills", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             education: educationData,
//             experience: experienceData,
//           }),
//         });

//         const data = await response.json();
//         if (data.skills) {
//           setSkills(data.skills);
//         }
//       } catch (err) {
//         console.error("Failed to load skills", err);
//       }
//     };

//     fetchSkills();

//     const checkMobile = () => setIsMobile(window.innerWidth < 768);
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   const toggleSkill = (skill: string) => {
//     setSelectedSkillsLocal(prev =>
//       prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
//     );
//   };

//   const handleDescriptionToggle = (skill: string) => {
//     setOpenDescription(prev => (prev === skill ? null : skill));
//   };

//   const handleSubmit = () => {
//     setSelectedSkills(selectedSkillsLocal); // ✅ Save to context
//     console.log("Selected Skills:", selectedSkillsLocal);
//   };

//   return (
//     <div className="min-h-screen bg-black text-lavender p-6">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-bold text-center mb-8">
//           Please Select Your Skills
//         </h1>

//         {skills.length === 0 ? (
//           <p className="text-center text-lg">⏳ Generating skills...</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {skills.map(({ skill, reason }, index) => {
//               const isSelected = selectedSkillsLocal.includes(skill);
//               const isOpen = openDescription === skill;
//               const isTopRow = index < 2;

//               return (
//                 <div
//                   key={skill}
//                   className={`relative group p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
//                     isSelected
//                       ? "bg-lavender text-black border-lavender"
//                       : "bg-black text-lavender border-lavender shadow-[0_0_15px_rgba(168,85,247,0.8)] hover:shadow-none"
//                   }`}
//                   onClick={() => {
//                     if (isMobile) {
//                       handleDescriptionToggle(skill);
//                     } else {
//                       toggleSkill(skill);
//                     }
//                   }}
//                   onMouseEnter={() => {
//                     if (!isMobile) setOpenDescription(skill);
//                   }}
//                   onMouseLeave={() => {
//                     if (!isMobile) setOpenDescription(null);
//                   }}
//                 >
//                   {isMobile ? (
//                     isOpen && (
//                       <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-lavender text-black text-sm p-3 rounded-lg shadow-md z-20 w-64 text-center">
//                         <div className="flex justify-between items-center mb-1">
//                           <span className="font-semibold">Why?</span>
//                           <button
//                             className="text-black font-bold text-sm"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setOpenDescription(null);
//                             }}
//                           >
//                             🗙
//                           </button>
//                         </div>
//                         <p className="whitespace-pre-line">{reason}</p>
//                       </div>
//                     )
//                   ) : (
//                     <div
//                       className={`absolute z-10 text-sm p-2 rounded-lg shadow-md bg-lavender text-black text-center w-64 opacity-0 group-hover:opacity-100 transition whitespace-pre-line
//                       ${isTopRow ? "top-full mt-2" : "bottom-full mb-2"} left-1/2 transform -translate-x-1/2`}
//                     >
//                       {reason}
//                     </div>
//                   )}

//                   <div className="flex justify-between items-center">
//                     <p className="font-semibold text-lg">{skill}</p>
//                     {isMobile && (
//                       <button
//                         className="text-xl font-bold text-lavender bg-black rounded-full w-7 h-7 flex items-center justify-center"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           toggleSkill(skill);
//                         }}
//                       >
//                         {selectedSkillsLocal.includes(skill) ? "✕" : "+"}
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {skills.length > 0 && (
//           <div className="text-center mt-10">
//             <button
//               onClick={handleSubmit}
//               className="bg-lavender text-black px-6 py-3 rounded-lg font-semibold hover:bg-hlavendar transition"
//             >
//               Generate Career Identity 🚀
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

//3

"use client";
import { useEffect, useState } from "react";
import { useFormData } from "../context/FormContext";
import { useAuth,SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type Skill = {
  skill: string;
  reason: string;
};

export default function SkillsPage() {
  const { educationData, experienceData, setSelectedSkills } = useFormData();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkillsLocal, setSelectedSkillsLocal] = useState<string[]>([]);
  const [openDescription, setOpenDescription] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { userId, getToken } = useAuth();
  const router = useRouter(); // ✅ Step 2

  useEffect(() => {
    const fetchSkills = async () => {
      console.log("🔄 Fetching skills...");
      try {
        const response = await fetch("/api/generate-skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            education: educationData,
            experience: experienceData,
          }),
        });

        console.log("📦 Skills response status:", response.status);

        const data = await response.json();
        console.log("✅ Received skills:", data);

        if (data.skills) {
          setSkills(data.skills);
        } else {
          console.warn("⚠️ No skills found in response");
        }
      } catch (err) {
        console.error("❌ Failed to load skills", err);
      }
    };

    fetchSkills();

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSkill = (skill: string) => {
    setSelectedSkillsLocal(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleDescriptionToggle = (skill: string) => {
    setOpenDescription(prev => (prev === skill ? null : skill));
  };

 const handleSubmit = async () => {
  

  console.log("📤 Submitting selected skills...");
  setSelectedSkills(selectedSkillsLocal);

  if (!userId) {
    console.error("❌ User not signed in");
    return;
  }

  if (selectedSkillsLocal.length === 0) {
    alert("Please select at least one skill.");
    return;
  }

  try {
    const token = await getToken();
    console.log("🔑 Clerk token acquired:", token);

    const payload: any = {
      skills: selectedSkillsLocal,
    };

    if (educationData && Object.values(educationData).some(v => v.trim() !== "")) {
      payload.education = educationData;
      console.log("🎓 Included education data:", educationData);
    }

    if (experienceData && Object.values(experienceData).some(v => v.trim() !== "")) {
      payload.experience = experienceData;
      console.log("💼 Included experience data:", experienceData);
    }

    console.log("📦 Payload to send:", payload);

    const response = await fetch("http://localhost:5000/api/save-career-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    console.log("🔴 Raw response from backend:", text);

    try {
      const data = JSON.parse(text);
      console.log("✅ Career data saved:", data);

      // ✅ Redirect to career identity page
      router.push("/career-identity"); // 👈 Put your new route path here
    } catch (e) {
      console.error("❌ Failed to parse backend response:", text);
    }

    setSelectedSkills([]);
  } catch (err) {
    console.error("❌ Failed to save career data:", err);
  }
};

  return (
    <>
    <SignedIn>
    <div className="min-h-screen bg-black text-lavender p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Please Select Your Skills
        </h1>

        {skills.length === 0 ? (
          <p className="text-center text-lg">⏳ Generating skills...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skills.map(({ skill, reason }, index) => {
              const isSelected = selectedSkillsLocal.includes(skill);
              const isOpen = openDescription === skill;
              const isTopRow = index < 2;

              return (
                <div
                  key={skill}
                  className={`relative group p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? "bg-lavender text-black border-lavender"
                      : "bg-black text-lavender border-lavender shadow-[0_0_15px_rgba(168,85,247,0.8)] hover:shadow-none"
                  }`}
                  onClick={() => {
                    if (isMobile) {
                      handleDescriptionToggle(skill);
                    } else {
                      toggleSkill(skill);
                    }
                  }}
                  onMouseEnter={() => {
                    if (!isMobile) setOpenDescription(skill);
                  }}
                  onMouseLeave={() => {
                    if (!isMobile) setOpenDescription(null);
                  }}
                >
                  {isMobile ? (
                    isOpen && (
                      <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-lavender text-black text-sm p-3 rounded-lg shadow-md z-20 w-64 text-center">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold">Why?</span>
                          <button
                            className="text-black font-bold text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDescription(null);
                            }}
                          >
                            🗙
                          </button>
                        </div>
                        <p className="whitespace-pre-line">{reason}</p>
                      </div>
                    )
                  ) : (
                    <div
                      className={`absolute z-10 text-sm p-2 rounded-lg shadow-md bg-lavender text-black text-center w-64 opacity-0 group-hover:opacity-100 transition whitespace-pre-line
                      ${isTopRow ? "top-full mt-2" : "bottom-full mb-2"} left-1/2 transform -translate-x-1/2`}
                    >
                      {reason}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-lg">{skill}</p>
                    {isMobile && (
                      <button
                        className="text-xl font-bold text-lavender bg-black rounded-full w-7 h-7 flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSkill(skill);
                        }}
                      >
                        {selectedSkillsLocal.includes(skill) ? "✕" : "+"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {skills.length > 0 && (
          <div className="text-center mt-10">
            <button
              onClick={handleSubmit}
              className="bg-lavender text-black px-6 py-3 rounded-lg font-semibold hover:bg-hlavendar transition"
            >
              Generate Career Identity 🚀
            </button>
          </div>
        )}
        {skills.length > 0 && (
          <div className={`
          absolute bottom-4 right-4 bg-transparent backdrop-blur-sm border border-purple-500/30 
          rounded-lg text-white z-30
          ${isMobile ? 'p-2' : 'p-4'}
        `}>
          <div className={`space-y-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>
            <div>✨Interactive Guide</div>
            <div>• {isMobile ? 'Tap' : 'Hover over'} career paths for details</div>
            
          </div>
          </div>
        )}
      </div>
    </div>
    </SignedIn>
      <SignedOut>
          <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
