
// "use client";

// import { useEffect, useState } from "react";
// import { useUser,SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import NavBar from "../../components/navbar";

// export default function CareerIdentityPage() {
//   const { user } = useUser();
//   const router = useRouter();

//   const [userData, setUserData] = useState<any[]>([]);
//   const [careerStatement, setCareerStatement] = useState<string>("");
//   const [loading, setLoading] = useState(false);
//   const [copied, setCopied] = useState(false); // ✅ added

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user?.id) return;

//       try {
//         const res = await axios.get(`http://localhost:5000/api/userData/${user.id}`);
//         console.log("✅ Fetching data for user ID:", user.id);

//         const data = res.data;
//         console.log("📄 Full fetched user data:", data);

//         setUserData(data);
//       } catch (error) {
//         console.error("❌ Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [user]);

//   const handleDelete = async (docId: string) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/userData/${docId}`);
//       setUserData(prev => prev.filter(entry => entry._id !== docId));
//     } catch (err) {
//       console.error("❌ Error deleting entry:", err);
//     }
//   };

//   const generateStatement = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.post("/api/generate-statement", { userData });
//       setCareerStatement(res.data.output);
//     } catch (err) {
//       console.error("Failed to generate statement", err);
//     }
//     setLoading(false);
//   };

//   const handleCopy = () => {
//     navigator.clipboard.writeText(careerStatement);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 1000);
//   };

//   useEffect(() => {
//     if (userData.length) generateStatement();
//   }, [userData]);

//   return (
//      <>
//      <SignedIn>
//      <NavBar />
//     <div className="flex flex-col lg:flex-row min-h-screen bg-black text-white p-6 gap-6">
//       <div className="lg:w-1/2">
//         <h2 className="text-lavender text-xl font-bold mb-4">
//           {user?.firstName
//             ? `${user.firstName.charAt(0).toUpperCase()}${user.firstName.slice(1)}'s Profile`
//             : "Your Profile"}
//         </h2>

//         {userData.map((entry, idx) => (
//           <div
//             key={entry._id}
//             className="mb-6 border-2 border-purple-500 p-4 rounded-2xl bg-black shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:shadow-none transition duration-300"
//           >
//             <p className="text-sm text-gray-400 mb-2">Entry ID: {entry._id}</p>

//             {entry.education?.length > 0 && (
//               <div className="mb-2">
//                 <h3 className="font-semibold text-lavender">Education</h3>
//                 <ul className="list-disc list-inside">
//                   {entry.education.map((edu: any, i: number) => (
//                     <li key={i}>
//                       {edu.degree} in {edu.fieldOfStudy} (Fav Subject: {edu.favSubject})
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {entry.experience?.length > 0 && (
//               <div className="mb-2">
//                 <h3 className="font-semibold text-lavender">Experience</h3>
//                 <ul className="list-disc list-inside">
//                   {entry.experience.map((exp: any, i: number) => (
//                     <li key={i}>{exp.jobTitle}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {entry.skills?.length > 0 && (
//               <div className="mb-2">
//                 <h3 className="font-semibold text-lavender">Skills</h3>
//                 <ul className="list-disc list-inside">
//                   {entry.skills.map((skill: string, i: number) => (
//                     <li key={i}>{skill}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             <button
//               onClick={() => handleDelete(entry._id)}
//               className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-600 hover:border hover:border-red-500 hover:shadow-md hover:shadow-red-500 transition duration-300"
//             >
//               Delete Entry
//             </button>
//           </div>
//         ))}

//         <button
//           onClick={() => router.push("/skill-generator")}
//           className="bg-lavender text-black px-4 py-2 rounded-lg hover:bg-hlavendar"
//         >
//           Add Education/Skills
//         </button>
//       </div>

//       <div className="lg:w-1/2 bg-black border-2 border-purple-500 p-6 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:shadow-none transition duration-300">
//         <h2 className="text-2xl font-bold text-lavender mb-4">🎯 Career Identity</h2>

//         <div className="bg-black p-4 rounded-md min-h-[150px]">
//           {loading ? <p>Generating...</p> : <p>{careerStatement}</p>}
//         </div>

//         <div className="flex gap-4 mt-4 relative">
//           <button
//             onClick={handleCopy}
//             className="bg-lavender text-black px-4 py-2 rounded-lg font-semibold hover:bg-hlavendar transition"
//           >
//             Copy
//           </button>

//           {copied && (
//             <div className="absolute top-[-35px] left-0 bg-black text-green-400 px-3 py-1 rounded-md text-sm shadow-lg">
//               Copied!
//             </div>
//           )}

//           <button
//             onClick={generateStatement}
//             className="bg-lavender text-black px-4 py-2 rounded-lg font-semibold hover:bg-hlavendar"
//           >
//             Regenerate
//           </button>
//         </div>
//       </div>
//     </div>
//     </SignedIn>
//     <SignedOut>
//           <RedirectToSignIn />
//       </SignedOut>
//     </>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useUser,SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import NavBar from "../../components/navbar";

export default function CareerIdentityPage() {
  const { user } = useUser();
  const router = useRouter();

  const [userData, setUserData] = useState<any[]>([]);
  const [careerStatement, setCareerStatement] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dataFetchError, setDataFetchError] = useState(false); // Track fetch errors

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        setDataFetchError(false); // Reset error state
        const res = await axios.get(`http://localhost:5000/api/userData/${user.id}`);
        console.log("✅ Fetching data for user ID:", user.id);

        const data = res.data;
        console.log("📄 Full fetched user data:", data);

        setUserData(data);
        
        // If no data is returned or empty array, don't show career identity
        if (!data || data.length === 0) {
          setDataFetchError(true);
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
        setDataFetchError(true); // Set error state
        setUserData([]); // Clear any existing data
      }
    };

    fetchData();
  }, [user]);

  const handleDelete = async (docId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/userData/${docId}`);
      const updatedData = userData.filter(entry => entry._id !== docId);
      setUserData(updatedData);
      
      // If no data left after deletion, hide career identity
      if (updatedData.length === 0) {
        setDataFetchError(true);
        setCareerStatement("");
      }
    } catch (err) {
      console.error("❌ Error deleting entry:", err);
    }
  };

  const generateStatement = async () => {
    if (!userData || userData.length === 0) return; // Don't generate if no data
    
    setLoading(true);
    try {
      const res = await axios.post("/api/generate-statement", { userData });
      setCareerStatement(res.data.output);
    } catch (err) {
      console.error("Failed to generate statement", err);
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(careerStatement);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  useEffect(() => {
    if (userData.length > 0) {
      setDataFetchError(false); // Reset error state when data is available
      generateStatement();
    }
  }, [userData]);

  // Check if we should show career identity section
  const shouldShowCareerIdentity = userData && userData.length > 0 && !dataFetchError;

  return (
     <>
     <SignedIn>
     <NavBar />
    <div className={`flex flex-col ${shouldShowCareerIdentity ? 'lg:flex-row' : ''} min-h-screen bg-black text-white p-6 gap-6`}>
      <div className={shouldShowCareerIdentity ? "lg:w-1/2" : "w-full"}>
        <h2 className="text-lavender text-xl font-bold mb-4">
          {user?.firstName
            ? `${user.firstName.charAt(0).toUpperCase()}${user.firstName.slice(1)}'s Profile`
            : "Your Profile"}
        </h2>

        {/* Show message when no data is available */}
        {(!userData || userData.length === 0 || dataFetchError) && (
          <div className="mb-6 border-2 border-lavender p-6 rounded-2xl bg-black text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-300 mb-2">No Profile Data Found</h3>
              <p className="text-sm text-gray-500 mb-4">
                {dataFetchError 
                  ? "You haven't added any education, skills, or experience yet."
                  : "You haven't added any education, skills, or experience yet."
                }
              </p>
            </div>
          </div>
        )}

        {/* Show existing userData entries */}
        {userData.map((entry, idx) => (
          <div
            key={entry._id}
            className="mb-6 border-2 border-purple-500 p-4 rounded-2xl bg-black shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:shadow-none transition duration-300"
          >
            <p className="text-sm text-gray-400 mb-2">Entry ID: {entry._id}</p>

            {entry.education?.length > 0 && (
              <div className="mb-2">
                <h3 className="font-semibold text-lavender">Education</h3>
                <ul className="list-disc list-inside">
                  {entry.education.map((edu: any, i: number) => (
                    <li key={i}>
                      {edu.degree} in {edu.fieldOfStudy} (Fav Subject: {edu.favSubject})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {entry.experience?.length > 0 && (
              <div className="mb-2">
                <h3 className="font-semibold text-lavender">Experience</h3>
                <ul className="list-disc list-inside">
                  {entry.experience.map((exp: any, i: number) => (
                    <li key={i}>{exp.jobTitle}</li>
                  ))}
                </ul>
              </div>
            )}

            {entry.skills?.length > 0 && (
              <div className="mb-2">
                <h3 className="font-semibold text-lavender">Skills</h3>
                <ul className="list-disc list-inside">
                  {entry.skills.map((skill: string, i: number) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => handleDelete(entry._id)}
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-600 hover:border hover:border-red-500 hover:shadow-md hover:shadow-red-500 transition duration-300"
            >
              Delete Entry
            </button>
          </div>
        ))}

        <button
          onClick={() => router.push("/skill-generator")}
          className="bg-lavender text-black px-4 py-2 rounded-lg hover:bg-hlavendar"
        >
          {userData && userData.length > 0 ? "Add More Education/Skills" : "Add Education/Skills"}
        </button>
      </div>

      {/* Career Identity Section - Only show when data is available */}
      {shouldShowCareerIdentity && (
        <div className="lg:w-1/2 bg-black border-2 border-purple-500 p-6 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:shadow-none transition duration-300">
          <h2 className="text-2xl font-bold text-lavender mb-4">🎯 Career Identity</h2>

          <div className="bg-black p-4 rounded-md min-h-[150px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lavender"></div>
                <p className="ml-3 text-gray-400">Generating your career identity...</p>
              </div>
            ) : (
              <p className="text-gray-200 leading-relaxed">
                {careerStatement || "Click 'Generate' to create your personalized career identity statement."}
              </p>
            )}
          </div>

          <div className="flex gap-4 mt-4 relative">
            <button
              onClick={handleCopy}
              disabled={!careerStatement}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                careerStatement 
                  ? "bg-lavender text-black hover:bg-hlavendar" 
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              Copy
            </button>

            {copied && (
              <div className="absolute top-[-35px] left-0 bg-black text-green-400 px-3 py-1 rounded-md text-sm shadow-lg border border-green-400/20">
                Copied!
              </div>
            )}

            <button
              onClick={generateStatement}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                loading 
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
                  : "bg-lavender text-black hover:bg-hlavendar"
              }`}
            >
              {loading ? "Generating..." : "Regenerate"}
            </button>
          </div>
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