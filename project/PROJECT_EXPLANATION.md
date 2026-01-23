# AgriSmart - Project Explanation & Guide

## 1. Project Overview
**Project Name:** AgriSmart (Cooperative Farming System)
**Goal:** A comprehensive digital platform for farmers, workers, buyers, and renters to collaborate. It helps with crop management, finding work, selling produce, and renting equipment, powered by AI and real-time data.

---

## 2. Technologies & Languages
Here is the "toolbox" used to build this project:

### Frontend (What you see)
*   **React (JavaScript/TypeScript):** The main library for building the user interface.
*   **Vite:** A tool that runs the website extremely fast during development.
*   **Tailwind CSS:** Used for styling (colors, layout, spacing) to make it look modern and beautiful.
*   **Framer Motion:** Adds smooth animations (like fading in, sliding, etc.).
*   **Lucide React:** Provides the icons (like the leaf, user, or weather icons).

### Backend (The brain)
*   **Node.js & Express.js:** The server code that handles data, logic, and API requests.
*   **MongoDB:** The database where all data (users, lands, crops, jobs) is stored.

### AI & APIs (External Helpers)
*   **Google Gemini Pro:** The AI model used for the "Smart Assistant" chatbot.
*   **OpenWeatherMap & Open-Meteo:** Provides real-time weather and soil moisture data.
*   **EmailJS / Nodemailer:** Sends emails for support or notifications.

---

## 3. How the Project Runs (Step-by-Step Flow)
Imagine starting a car engine. Here is the sequence of events when you run the project:

1.  **Start Command:** You type `npm run dev` in the terminal.
2.  **Vite Server:** Vite starts a local web server (usually at `http://localhost:5173`).
3.  **Entry Point (`main.tsx`):** This file kicks off the React application.
4.  **Routing (`App.tsx`):** This file acts as a traffic controller. It sees the URL (like `/login` or `/farm-owner`) and decides which page to show.
5.  **Page Loading:**
    *   If you go to `/login`, the **LoginModern** component loads.
    *   If you log in successfully, it saves a "Key" (Token) and moves you to your Dashboard.

---

## 4. Connection & Data Logic (Frontend ↔ Backend)
How does the website talk to the database?

1.  **The Request:** When you click "Save" on a profile or load a dashboard, the Frontend sends a message (API Request) to the Backend (e.g., `GET /api/lands`).
2.  **The Server:** The Backend (Express.js) hears this request.
3.  **The Database:** The Backend asks MongoDB for the specific data (e.g., "Give me all land records").
4.  **The Response:** MongoDB gives the data to the Backend, which sends it back to the Frontend.
5.  **The Display:** React uses this data to update the screen instantly without reloading.

---

## 5. Dashboard Walkthrough (Step-by-Step)

### A. Login Page (`/login`)
*   **Features:** Beautiful animated background, multi-language support (English, Hindi, Tamil), and role selection.
*   **Logic:**
    *   User types email/password.
    *   System checks if user exists in the database.
    *   If correct, it redirects to the specific dashboard based on the Role (Farmer, Worker, Buyer, etc.).

### B. Farm Owner Dashboard (`/farm-owner`)
*   **Features:**
    *   **Weather Widget:** Shows live temp, rain chance, and soil moisture.
    *   **My Lands:** List of your farm plots with status (Growing, Harvest ready).
    *   **Resource Sharing:** Rent tractors or tools.
    *   **Marketplace:** Sell your crops directly.
*   **Connection:** Connects to Weather API for live data and MongoDB to fetch your land details.

### C. AI Crop Advisor (`/crop-advisor`)
*   **Features:** Gives advice on Irrigation, Fertilizers, and Pest Control.
*   **Algorithm:**
    *   **Weather Analysis:** It reads the weather forecast. If rain is expected (>5mm) -> it says "Don't Irrigate". If soil is dry -> it says "Irrigate Now".
    *   **Stage Mapping:** Determines if your crop is in `Sowing`, `Growing`, or `Harvest` stage and gives specific advice for that stage.

### D. Features Dashboard (`/features`)
*   **Features:** A hub showing all capabilities like "Crop Price Prediction", "Inventory", "Expense Tracker".
*   **Logic:** Simple navigation hub that links to different tools.

---

## 6. Algorithms Used
The system uses three main types of "intelligence":

### 1. Rule-Based Expert System (Hardcoded)
*   **Concept:** Uses predefined rules from agricultural science.
*   **Example:** "If Crop is Rice and Stage is Growing, then keep 2-3cm water level."
*   **Location:** Logic is built directly into `AICropAdvisor.tsx`.

### 2. Dynamic Heuristic Algorithm (Calculated)
*   **Concept:** Makes decisions based on math and real-time numbers.
*   **Example:** The **Irrigation Advice** feature.
*   **Logic:** `Irrigation Need = (Current Soil Moisture < Threshold) AND (Rainfall Forecast < 5mm)`. If true, update status to "Irrigate".

### 3. Generative AI (Machine Learning)
*   **Concept:** Uses a Large Language Model to understand human language.
*   **Example:** The **Chatbot**.
*   **Logic:** When you ask a question like "How to treat yellow leaves?", the system sends this text to Google's **Gemini Pro** AI model using an API key. The AI processes it and sends back a human-like answer in your chosen language.
