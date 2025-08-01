// "use client";
import { useEffect, useState } from "react";
import { useFormData } from "../app/context/FormContext";

export default function ExperienceForm({ onChange }: { onChange: (isFilled: boolean) => void }) {
  const { experienceData, setExperienceData } = useFormData();

  // Default to empty strings if experienceData is null/undefined
  const [form, setForm] = useState({
    jobTitle: experienceData?.jobTitle || "",
    description: experienceData?.description || "",
  });

  useEffect(() => {
    const isFilled = Object.values(form).every((v) => v.trim() !== "");
    onChange(isFilled);
    setExperienceData(form); // Update context
  }, [form]);

  return (
    <form className="bg-black p-6 rounded-2xl hover:shadow-lg transition w-full border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)]">
      <h2 className="text-xl font-semibold text-lavender mb-4">Experience</h2>
      <input
        type="text"
        placeholder="Job Title"
        className="input"
        value={form.jobTitle}
        onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
      />
      <textarea
        placeholder="Description"
        className="input min-h-[100px]"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
    </form>
  );
}
