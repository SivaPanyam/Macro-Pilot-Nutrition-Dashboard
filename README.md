# Macro-Pilot: AI-Driven Nutritional Co-Pilot 🚀

[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/)
[![Gemini API](https://img.shields.io/badge/Gemini_2.5_Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

Macro-Pilot is a next-generation nutritional dashboard designed to eliminate the friction of calorie counting. Powered by Google's **Gemini 2.5 Flash** vision and language models, it allows users to log their dietary intake using multimodal inputs: taking a picture, speaking naturally, or typing plain text. 

The application goes beyond simple tracking by acting as a "System Brain." It actively predicts the remaining nutritional needs for the day, dynamically schedules optimal meals, and implements a psychological "Recovery Protocol" to handle caloric overshoots gracefully.

## ✨ Key Features

### 🎙️ Multimodal Logging (Vision & Voice)
Log your food with zero friction. Take a picture of your plate or tap the microphone and say *"I had a cup of coffee and two eggs."* The backend securely pipes the input to Gemini 2.5 Flash, which parses the exact macros (Protein, Carbs, Fats) and immediately updates your dashboard.

### 🧠 The "System Brain" (Predictive Timeline)
Instead of just showing what you've eaten, Macro-Pilot predicts what you *should* eat. As you log calories throughout the day, the dynamic timeline automatically recalculates and suggests optimal macros for your remaining meals (e.g., dynamically changing "Dinner" to "Protein Shake & Mixed Greens" if your remaining budget is low).

### 🛡️ The "Recovery Protocol" (Psychological Buffering)
Macro-Pilot understands human psychology. If you log a massive meal that exceeds your daily limit (e.g., a 1500 kcal late-night burger), the system doesn't break math or shame you with aggressive red text. Instead, it triggers a **Recovery Protocol** card, offering to gracefully spread the caloric overshoot across the next 48 hours to maintain steady progress.

### ⚡ Enterprise-Grade Resilience
*   **Offline State Safety**: Powered by Zustand `persist`, your dashboard state automatically syncs to your browser's local storage.
*   **Global Error Boundaries**: Catches severe runtime and networking failures to prevent blank-screen crashes, providing a safe fallback.
*   **Rapid Heuristic Fallbacks**: If the Gemini API is unreachable due to network limits or 429 Rate Limits, the application intelligently falls back to local heuristic calculations to ensure zero disruption during a demo.

### ♿ Universal Accessibility
*   Built to **WCAG 2.1** standards.
*   Custom SVG Macro Meters feature semantic `aria-label` and `progressbar` roles.
*   A native **High Contrast Theme** toggle overrides CSS variables instantly for visually impaired users.

---

## 🛠️ Technology Stack

*   **Frontend**: React 18, TypeScript, Vite
*   **State Management**: Zustand (with LocalStorage Persistence)
*   **Styling**: Pure CSS (Variables, Flexbox/Grid, Dark Mode ready)
*   **Backend**: Node.js, Express.js
*   **Security**: `@google-cloud/secret-manager`, `express-rate-limit`
*   **AI Engine**: `@google/generative-ai` (Gemini 2.5 Flash)

---

## 🚀 Quick Start Guide

### Prerequisites
*   Node.js (v18+)
*   A Google Cloud Project with the **Gemini API** enabled.

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/SivaPanyam/Macro-Pilot-Nutrition-Dashboard.git
cd Macro-Pilot-Nutrition-Dashboard
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory and add your API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8080
```
*(Note: In a true production environment on Google Cloud Run, the app is configured to bypass the `.env` file and fetch the key directly from GCP Secret Manager).*

### 3. Run the Application
The application utilizes an Express backend to safely wrap the Gemini calls, while serving the Vite frontend. 

First, build the optimized frontend:
```bash
npm run build
```

Then, start the unified Express server:
```bash
node backend/server.js
```
The application will be live at `http://localhost:8080`.

*(Alternatively, for frontend-only development with Hot-Module Replacement, you can run `npm run dev` and `node backend/server.js` simultaneously).*

---

## 🧪 Testing the "Burger Test"
Want to see the Recovery Protocol in action?
1. Start the app and navigate to the **Logging Portal**.
2. Scroll to the "Developer Sandbox" and click **🍔 The Burger Test**.
3. This intentionally logs a 1200 kcal meal, intentionally blowing past your daily limit.
4. Navigate to the **Intelligence Page**. You will see the system detect the caloric overshoot and present the Recovery Protocol option!
