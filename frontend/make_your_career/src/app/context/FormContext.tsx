// // context/FormContext.tsx
// "use client";
// import React, { createContext, useContext, useState } from "react";

// type EducationFormData = {
//   favSubject: string;
//   degree: string;
//   fieldOfStudy: string;
// };

// type ExperienceFormData = {
//   jobTitle: string;
//   description: string;
// };

// type FormContextType = {
//   educationData: EducationFormData;
//   setEducationData: (data: EducationFormData) => void;
//   experienceData: ExperienceFormData;
//   setExperienceData: (data: ExperienceFormData) => void;
//   selectedSkills: string[];
//   setSelectedSkills: (skills: string[]) => void;
// };

// const FormContext = createContext<FormContextType | undefined>(undefined);

// export const FormProvider = ({ children }: { children: React.ReactNode }) => {
//   const [educationData, setEducationData] = useState<EducationFormData>({
//     favSubject: "",
//     degree: "",
//     fieldOfStudy: "",
//   });

//   const [experienceData, setExperienceData] = useState<ExperienceFormData>({
//     jobTitle: "",
//     description: "",
//   });

//   const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

//   return (
//     <FormContext.Provider
//       value={{
//         educationData,
//         setEducationData,
//         experienceData,
//         setExperienceData,
//         selectedSkills,
//         setSelectedSkills,
//       }}
//     >
//       {children}
//     </FormContext.Provider>
//   );
// };

// export const useFormData = () => {
//   const context = useContext(FormContext);
//   if (!context) {
//     throw new Error("useFormData must be used within a FormProvider");
//   }
//   return context;
// };
"use client";
import React, { createContext, useContext, useState } from "react";

type EducationFormData = {
  favSubject: string;
  degree: string;
  fieldOfStudy: string;
};

type ExperienceFormData = {
  jobTitle: string;
  description: string;
};

type FormContextType = {
  educationData: EducationFormData | null;
  setEducationData: (data: EducationFormData | null) => void;
  experienceData: ExperienceFormData | null;
  setExperienceData: (data: ExperienceFormData | null) => void;
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [educationData, setEducationData] = useState<EducationFormData | null>(null);
  const [experienceData, setExperienceData] = useState<ExperienceFormData | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  return (
    <FormContext.Provider
      value={{
        educationData,
        setEducationData,
        experienceData,
        setExperienceData,
        selectedSkills,
        setSelectedSkills,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormData = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormData must be used within a FormProvider");
  }
  return context;
};
