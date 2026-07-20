# AI Interview Prep | تحضير المقابلة الذكية

AI Interview Prep is a Next.js application that simulates technical and behavioral interviews using Google's Gemini AI. It provides an immersive experience with speech recognition, text-to-speech, and immediate performance evaluations.

## Features

- **AI-Powered Interviews**: Dynamic conversational interviews tailored to your job title and specialization.
- **Bilingual Support**: Full support for both Arabic and English.
- **Voice Interactions**: Integrated speech-to-text (SpeechRecognition) and text-to-speech capabilities.
- **ATS Resume Parsing**: Upload your resume to have it parsed and incorporated into the interview context.
- **Technical Quizzes**: Generate AI-based technical quizzes related to your role.
- **Leaderboard**: Compete with others and track your progress.
- **Secure Data Storage**: Uses Firebase Auth for user management and Firestore for saving interview history securely.

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Environment Variables

Rename `.env.example` to `.env.local` and provide the following keys:

```bash
# Google Gemini API Key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Firebase Client Keys
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=1:your_app_id:web:your_web_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Admin SDK (Server-side)
FIREBASE_PROJECT_ID=your_project
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Running Tests

This project uses `vitest` for unit testing.

To run the test suite:
```bash
npm run test
```

## Security & Architecture

- **Firestore Rules**: User data is strictly protected. Users can only read and write to their own `/users/{userId}` profile document.
- **API Routes**: API routes are protected via a custom authentication middleware (`verifyAuth`) that verifies Firebase ID Tokens.
- **State Management**: Uses React Context for Theme, Auth, and Language. 
- **Internationalization (i18n)**: Implemented using a custom statically typed translation system, ensuring type safety for all translation keys.

## License

This project is licensed under the MIT License.
