# CivicAI — Your Election Guide

CivicAI is a modern, non-partisan web application designed to help citizens understand the democratic election process clearly and accurately. It demystifies complex electoral concepts, tracks the election journey, and provides an AI-powered assistant to answer questions using verified information.

## ✨ Features

- **Interactive Election Timeline:** An 8-step visual roadmap tracking progress from Voter Registration to Government Formation. Includes saving your progress via Firebase.
- **AI-Powered Civic Expert:** An integrated chat interface powered by **Gemini 2.5 Flash** that explains ballot measures, polling rules, and civic duties in plain, neutral language.
- **Dynamic Civic Quiz:** Automatically generated multiple-choice quizzes (via Gemini) to test your knowledge on local governance and election protocols.
- **Modern Dark Theme UI:** Designed with a stunning, high-contrast "Electric Blue" and "Deep Navy" corporate modern aesthetic, featuring smooth animations via Framer Motion.
- **Secure Authentication:** Google Sign-In powered by Firebase Authentication to keep track of user progress across devices.

## 🛠 Tech Stack

- **Frontend:** Next.js 16 (App Router), React, TypeScript
- **Styling:** Tailwind CSS v4, custom CSS globals, Lucide Icons
- **Components:** shadcn/ui
- **Animations:** Framer Motion
- **AI Engine:** Google Gemini (`@google/generative-ai`, using the `gemini-2.5-flash` model)
- **Backend & Auth:** Firebase (Auth & Firestore)
- **Deployment & CI/CD:** Docker, Google Cloud Build, Google Cloud Run

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+
- A Google AI Studio API Key (for Gemini)
- A Firebase Project (with Authentication and Firestore enabled)

### Installation

1. **Clone the repository** and navigate to the project directory:
   ```bash
   git clone <your-repository-url>
   cd app_build
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add your credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-service-account-email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
   GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## ☁️ Deployment (Google Cloud Run)

This repository is pre-configured for automated deployment to Google Cloud Run using Google Cloud Build.

### Prerequisites for Deployment
- You must have the [Google Cloud CLI (`gcloud`)](https://cloud.google.com/sdk/docs/install) installed and authenticated.
- A Google Cloud Project with billing enabled.

### Steps to Deploy

1. **Enable required APIs** in your Google Cloud Project:
   ```bash
   gcloud services enable cloudbuild.googleapis.com run.googleapis.com artifactregistry.googleapis.com
   ```

2. **Set up Artifact Registry** (if you don't have one):
   ```bash
   gcloud artifacts repositories create civicai --repository-format=docker --location=asia-south1
   ```

3. **Deploy using Cloud Build**:
   From the `app_build` directory, run the following command to build the Docker image and deploy it:
   ```bash
   gcloud builds submit --config cloudbuild.yaml .
   ```

4. **Set Environment Variables in Cloud Run**:
   Go to the Google Cloud Console -> Cloud Run -> Your Service -> Edit & Deploy New Revision -> Variables & Secrets, and securely add your `.env` variables there to ensure the live app can connect to Firebase and Gemini.

---
*Built for the PromptWars Hackathon.*
