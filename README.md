# SkillSyncer

SkillSyncer is a MERN stack web application that helps users take control of their career journey by generating personalized skills, evaluating their resume's ATS performance, and exploring career paths based on their unique strengths. Designed to make job searching smarter and more intuitive, SkillSyncer blends technology with career insight to guide users toward roles that truly fit.

---

## ✨ Features

- **Skill Generator** – Discover personalized, job-relevant skills.
- **ATS Score Checker** – Check how your resume performs against ATS filters.
- **Career Path Explorer** – Get career suggestions based on your skills.
- **Career Identity Matcher** – Find roles aligned with your strengths and passions.

---

## 🔧 Tech Stack

- **Frontend:** NextJS, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** Clerk
- **APIs:** RESTful APIs

---

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/sehrishahmedsangrasi/skillsyncer.git

# Navigate into the project directory
cd skillsyncer

# Install dependencies
cd frontend
npm install
cd backend
npm install

# Add environment variables to a .env file in /server
# Example:
# MONGO_URI=your_mongo_connection
# clerk_SECRET=your_clerk_secret
# PORT=5000

# Run the app
# You can use concurrently or start both servers separately
npm run dev
