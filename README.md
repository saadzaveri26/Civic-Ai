# 🗳️ CivicAI — Your Election Guide

> **AI-powered, multilingual civic education platform built for the PromptWars Hackathon**

CivicAI is a modern, non-partisan web application that helps citizens understand the democratic election process clearly and accurately. It demystifies complex electoral concepts using AI-powered explanations, supports 8 Indian languages, and provides an interactive learning experience — from voter registration to government formation.

🔗 **Live Demo:** [https://civicai-808605522812.asia-south1.run.app](https://civicai-808605522812.asia-south1.run.app)

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

### 🔐 Secure Authentication
- Google Sign-In via Firebase Authentication
- Popup-based auth with automatic redirect fallback
- Cross-Origin-Opener-Policy configured for Next.js 16+ compatibility

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS v4, custom design tokens (Electric Blue / Deep Navy) |
| **Components** | shadcn/ui (Base UI), Lucide Icons |
| **Animations** | Framer Motion |
| **AI Engine** | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| **Auth & DB** | Firebase Authentication + Firestore |
| **Voice** | Web Speech API (SpeechRecognition) |
| **Deployment** | Docker → Google Cloud Run (asia-south1) |
| **CI/CD** | Google Cloud Build |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts        # AI chat + follow-up generation
│   │   ├── news/route.ts        # AI news feed with caching
│   │   ├── quiz/generate/route.ts
│   │   ├── quiz/submit/route.ts
│   │   └── progress/route.ts
│   ├── ask/page.tsx              # Chat interface with voice input
│   ├── news/page.tsx             # Election news feed
│   ├── quiz/page.tsx             # Civic quiz
│   ├── journey/page.tsx          # Election timeline
│   ├── layout.tsx                # Root layout with LanguageProvider
│   └── page.tsx                  # Homepage
├── components/
│   ├── ui/                       # shadcn components
│   ├── BottomNav.tsx
│   ├── ChatBubble.tsx            # Chat bubble with voice indicator
│   ├── LanguageSelector.tsx      # 8-language dropdown
│   ├── NewsCard.tsx              # News card with detail sheet
│   ├── NewsNavLink.tsx
│   ├── SuggestionChip.tsx        # Reusable chip (sm/md sizes)
│   └── VoiceInputButton.tsx      # Mic button with pulse animation
├── lib/
│   ├── hooks/
│   │   ├── useAuth.ts            # Firebase auth with redirect fallback
│   │   └── useSpeechRecognition.ts  # Web Speech API hook
│   ├── firebase.ts
│   ├── i18n.ts                   # LanguageProvider + context
│   └── utils.ts
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 20+
- A [Google AI Studio](https://aistudio.google.com/) API Key (for Gemini)
- A Firebase Project (with Authentication and Firestore enabled)

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

---

## ☁️ Deployment (Google Cloud Run)

### Prerequisites
- [Google Cloud CLI (`gcloud`)](https://cloud.google.com/sdk/docs/install) installed and authenticated
- A Google Cloud project with billing enabled

### Quick Deploy

```bash
# Set your project
gcloud config set project YOUR_PROJECT_ID

# Deploy with environment variables
gcloud run deploy civicai \
  --source . \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --port 3080 \
  --memory 1Gi \
  --set-env-vars "GEMINI_API_KEY=your-key"
```

### Using Cloud Build (CI/CD)

1. **Enable required APIs:**
   ```bash
   gcloud services enable cloudbuild.googleapis.com run.googleapis.com artifactregistry.googleapis.com
   ```

2. **Create Artifact Registry:**
   ```bash
   gcloud artifacts repositories create civicai --repository-format=docker --location=asia-south1
   ```

3. **Submit build:**
   ```bash
   gcloud builds submit --config cloudbuild.yaml .
   ```

4. **Set environment variables** in Cloud Run Console → Edit & Deploy → Variables & Secrets.

---

## 🔒 Security

- All sensitive keys (`GEMINI_API_KEY`, `FIREBASE_PRIVATE_KEY`) are server-side only — never exposed to the client
- Firebase client config keys (`NEXT_PUBLIC_*`) are public by design and restricted via Firebase Security Rules
- `.env*` files are excluded from version control via `.gitignore`
- Docker runs as non-root user (`nextjs:nodejs`)

---

*Built with ❤️ for the PromptWars Hackathon.*
