# 🗳️ CivicAI — Your Election Guide

> **AI-powered, multilingual civic education platform built for the PromptWars Hackathon**

CivicAI is a modern, non-partisan web application that helps citizens understand the democratic election process clearly and accurately. It demystifies complex electoral concepts using AI-powered explanations, supports 8 Indian languages, and provides an interactive learning experience — from voter registration to government formation.

🔗 **Live Demo:** [https://civic-ai-app-808605522812.asia-south1.run.app](https://civic-ai-app-808605522812.asia-south1.run.app)

---

## ✨ Features

### 🤖 AI-Powered Civic Expert (`/ask`)
- Integrated chat interface powered by **Gemini 2.5 Flash**
- Explains ballot measures, polling rules, and civic duties in plain, neutral language
- **Smart Follow-Up Suggestions** — After every AI response, 3 contextual follow-up questions are dynamically generated to guide deeper exploration
- **Voice Input** — Speak your questions using the browser's Web Speech API with automatic language detection for all 8 supported languages

### 🌐 Multilingual Support (8 Languages)
- English, Hindi (हिंदी), Marathi (मराठी), Tamil (தமிழ்), Telugu (తెలుగు), Bengali (বাংলা), Gujarati (ગુજરાતી), Kannada (ಕನ್ನಡ)
- Language selection persists via `localStorage` and instantly propagates to:
  - AI chat responses
  - Quiz generation
  - News feed content
  - Voice recognition locale
  - UI suggestion chips

### 📰 Election News Feed (`/news`)
- AI-curated, neutral election news generated via Gemini
- Category filters: Voting · Policy · Campaign · Results · Legal
- Color-coded badges and breaking news indicators
- Slide-out detail sheet with "Ask AI about this" deep-link
- Server-side caching with 5-minute TTL per language

### 📋 Dynamic Civic Quiz (`/quiz`)
- Auto-generated multiple-choice quizzes via Gemini in the user's selected language
- Tests knowledge on governance, election protocols, and civic rights

### 🗺️ Interactive Election Timeline (`/journey`)
- 8-step visual roadmap from Voter Registration to Government Formation
- Progress tracking saved via Firebase Firestore

---

## 🏗️ Production-Grade Architecture

### 🔐 Security Hardening
- **API Validation:** Comprehensive Zod schemas for all incoming API requests
- **Rate Limiting:** In-memory sliding window rate limits to prevent abuse (e.g., 20 chat requests/min, 10 quiz requests/min)
- **Token Verification:** Firebase Admin SDK ensures secure server-side validation of ID tokens
- **Headers:** Strict security headers configured in `next.config.ts` (XSS Protection, Frame Options, Permissions Policy)

### 🚀 Performance & Optimization
- **React Optimizations:** Strategic use of `React.memo`, `useMemo`, and `useCallback` to prevent unnecessary re-renders
- **Image Optimization:** Integrated `next/image` for automatic image resizing and modern format delivery
- **Loading States:** Implemented Next.js `loading.tsx` skeletons for seamless route transitions
- **Production Build:** Advanced CSS optimization and compression enabled

### ♿ Accessibility (A11y)
- **WCAG Compliance:** Strict adherence to 4.5:1 color contrast ratios
- **Keyboard Navigation:** Full keyboard support with `tabIndex` and `onKeyDown` listeners
- **Screen Reader Support:** Comprehensive `aria-labels`, `role="alert"`, `aria-live="assertive"`, and semantic HTML (`<main>`, `<article>`)
- **Skip Links:** "Skip to main content" link for rapid navigation
- **Heading Hierarchy:** Strict `h1` → `h2` → `h3` structure

### 📊 Observability & Testing
- **Google Cloud Logging:** Structured server-side logging for API requests capturing performance metrics (`responseTime`), cache hit rates, and usage data. Falls back to console locally.
- **Test Suite:** 100% passing test coverage on critical components and API routes using Jest, React Testing Library, and JSDOM.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS v4, custom design tokens |
| **Components** | shadcn/ui (Base UI), Lucide Icons |
| **Animations** | Framer Motion |
| **AI Engine** | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| **Auth & DB** | Firebase Authentication + Firebase Admin SDK + Firestore |
| **Testing** | Jest, React Testing Library, JSDOM |
| **Observability** | Google Cloud Logging (`@google-cloud/logging`) |
| **Deployment** | Google Cloud Run (asia-south1) |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 20+
- A [Google AI Studio](https://aistudio.google.com/) API Key (for Gemini)
- A Firebase Project (with Authentication and Firestore enabled)
- A Google Cloud Project (for Cloud Logging, optional locally)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/saadzaveri26/Civic-Ai.git
   cd Civic-Ai/app_build
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the `app_build` directory:
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

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the app.

5. **Run tests:**
   ```bash
   npm run test
   ```

---

## ☁️ Deployment (Google Cloud Run)

### Prerequisites
- [Google Cloud CLI (`gcloud`)](https://cloud.google.com/sdk/docs/install) installed and authenticated
- A Google Cloud project with billing enabled

### Deploy from Source

```bash
# Set your project
gcloud config set project YOUR_PROJECT_ID

# Deploy directly from source using Google Cloud Buildpacks
gcloud run deploy civic-ai-app \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars "GEMINI_API_KEY=your-key,FIREBASE_PROJECT_ID=your-id"
```

---

*Built with ❤️ for the PromptWars Challenge*
