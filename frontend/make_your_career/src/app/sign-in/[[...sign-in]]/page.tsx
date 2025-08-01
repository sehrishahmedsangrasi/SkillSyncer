"use client";

import { SignIn } from "@clerk/nextjs";
import { dark } from '@clerk/themes';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <SignIn
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: "#a06bf5",
            colorBackground: "#000000",
            colorForeground: "#FFFFFF",
            colorInput: "#1a1a1a",
            colorInputForeground: "#FFFFFF",
            colorPrimaryForeground: "#000000",
          },
          elements: {
           card: {
            backgroundColor: "#000000",
            border: "2px solid #a855f7", // exact tailwind's purple-500
            boxShadow: "0 0 20px rgba(168,85,247,0.6)", // match shadow
            borderRadius: "1rem", // tailwind's rounded-2xl = 1rem = 16px
            transition: "box-shadow 0.3s ease", // optional for hover feel
            },

            formButtonPrimary: {
              backgroundColor: "#a06bf5",
              color: "#000000",
              borderRadius: "8px",
              fontWeight: "600",
              transition: "all 0.3s ease",
            },
            headerTitle: {
              color: "#a06bf5",
            },
            headerSubtitle: {
              color: "#CCCCCC",
            },
            socialButtonsBlockButton: {
              backgroundColor: "#1a1a1a",
              color: "#E6E6FA",
              border: "1px solid #E6E6FA",
              borderRadius: "6px",
            },
            formFieldLabel: {
              color: "#E6E6FA",
            },
            footerActionText: {
              color: "#E6E6FA",
            },
            footerActionLink: {
              color: "#FFFFFF",
            },
          },
        }}
      />
    </div>
  );
}