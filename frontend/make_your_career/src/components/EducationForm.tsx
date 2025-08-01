// "use client";
// import { useEffect, useState } from "react";
// import { useFormData } from "../app/context/FormContext";

// export default function EducationForm({ onChange }: { onChange: (isFilled: boolean) => void }) {
//   const { educationData, setEducationData } = useFormData();
//   const [form, setForm] = useState(educationData);

//   useEffect(() => {
//     const isFilled = Object.values(form).every((v) => v.trim() !== "");
//     onChange(isFilled);
//     setEducationData(form); // Update context
//   }, [form]);

//   return (
//     <form className="bg-black p-6 rounded-2xl hover:shadow-lg transition w-full border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)]">
//       <h2 className="text-xl font-semibold text-lavender mb-4">Education</h2>
//       <input
//         type="text"
//         placeholder="Favorite Subjects"
//         className="input"
//         value={form.favSubject}
//         onChange={(e) => setForm({ ...form, favSubject: e.target.value })}
//       />
//       <input
//         type="text"
//         placeholder="Degree"
//         className="input"
//         value={form.degree}
//         onChange={(e) => setForm({ ...form, degree: e.target.value })}
//       />
//       <input
//         type="text"
//         placeholder="Field of Study"
//         className="input"
//         value={form.fieldOfStudy}
//         onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })}
//       />
//     </form>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import { useFormData } from "../app/context/FormContext";

export default function EducationForm({ onChange }: { onChange: (isFilled: boolean) => void }) {
  const { educationData, setEducationData } = useFormData();

  // Ensure form is never null — use default values
  const [form, setForm] = useState({
    favSubject: educationData?.favSubject || "",
    degree: educationData?.degree || "",
    fieldOfStudy: educationData?.fieldOfStudy || "",
  });

  useEffect(() => {
    const isFilled = Object.values(form).every((v) => v.trim() !== "");
    onChange(isFilled);
    setEducationData(form); // Update context
  }, [form]);

  return (
    <form className="bg-black p-6 rounded-2xl hover:shadow-lg transition w-full border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)]">
      <h2 className="text-xl font-semibold text-lavender mb-4">Education</h2>
      <input
        type="text"
        placeholder="Favorite Subjects"
        className="input"
        value={form.favSubject}
        onChange={(e) => setForm({ ...form, favSubject: e.target.value })}
      />
      <input
        type="text"
        placeholder="Degree"
        className="input"
        value={form.degree}
        onChange={(e) => setForm({ ...form, degree: e.target.value })}
      />
      <input
        type="text"
        placeholder="Field of Study"
        className="input"
        value={form.fieldOfStudy}
        onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })}
      />
    </form>
  );
}
