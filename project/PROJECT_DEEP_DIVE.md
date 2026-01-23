# AgriSmart: Deep Dive into Algorithms & Core Logic

This document details the specific algorithms, logical flows, components, and technical architecture of the AgriSmart project.

---

## 1. AI Crop Advisor (`AICropAdvisor.tsx`)

**Goal:** Provide actionable advice (Irrigation, Fertilizer, Pest Control) based on current crop and stage.

### Algorithm A: Static Expert System (Rule-Based Mapping)
*   **Concepts:** Lookup Table, State Mapping.
*   **Logic:**
    1.  The system maintains a massive `cropAdvice` JSON object acting as a knowledge base.
    2.  **Input:** User selects `CropID` (e.g., 'rice') and `StageID` (e.g., 'growing').
    3.  **Process:** Direct Key-Value lookup: `cropAdvice['rice']['growing']`.
    4.  **Output:** Returns a specific object containing `irrigation`, `fertilizer`, and `pestControl` text.
    5.  **Priority Flag:** Each advice object has a `priority` set to 'high', 'medium', or 'low', which changes the UI color (Red/Yellow/Green) to alert the user.
             
### Algorithm B: Dynamic Irrigation Heuristic (Weather-Based)
*   **Concepts:** Multi-variable Decision Tree.
*   **Logic:** Found in `utils/weather.ts` -> `deriveIrrigationAdvice()`.
    *   **Inputs:**
        *   `SoilMoisture` (Volumetric percentage from Open-Meteo).
        *   `RainForecast` (Sum of rainfall in next 48h from OpenWeatherMap).
        *   `PrecipitationProb` (Probability of rain > 60%).
    *   **Decision Logic:**
        ```javascript
        IF (RainForecast > 5mm OR Probability > 60%) THEN
            Advice = "DEFER IRRIGATION" (Save water, rain is coming)
        ELSE IF (SoilMoisture < 25%) THEN
            Advice = "IRRIGATE NOW" (Crop is thirsty)
        ELSE
            Advice = "NO ACTION NEEDED" (Conditions optimal)
        ```

---

## 2. Smart Crop Doctor (`SmartCropDoctor.tsx`)

**Goal:** Diagnose crop diseases from images.

### Algorithm: Visual Prompt Engineering
*   **Concepts:** Generative AI, Multimodal Input.
*   **Logic:**
    1.  **Image Handling:** User uploads an image -> Converted to Base64 string.
    2.  **Prompt Construction:** The system creates a strict prompt:
        > "Analyze this image. Identify plant disease. Return JSON with {disease_name, confidence_score, treatment_steps}."
    3.  **AI Inference:** This prompt + Image is sent to **Google Gemini Pro Vision** (via `/api/ai` endpoint).
    4.  **Response Parsing:** The AI returns a structured text response. The frontend parses this to display "Confidence: 94%" and "Treatment: Spray Neem Oil".
    *   *Note: For the demo version without a live API key, a "Mock Diagnosis" (`setTimeout`) simulates this extraction process with a hardcoded valid response to demonstrate the UI flow.*

---

## 3. Resource Sharing & Global Marketplace

### Algorithm: Filtering & Matching
*   **File:** `ResourceSharing.tsx`
*   **Concepts:** Linear Search, Filter Chaining.
*   **Logic:** The "Browse" feature uses a reactive filtering chain.
    1.  **State:** `resources` array contains all items.
    2.  **Inputs:** `searchTerm`, `category`, `availability` (from User UI).
    3.  **Execution (in Render loop):**
        ```javascript
        results = resources.filter(item => {
           matchTitle = item.title.includes(searchTerm);
           matchCategory = filter.category ? item.category === filter.category : true;
           matchStatus = item.availability === 'available';
           return matchTitle && matchCategory && matchStatus;
        });
        ```

### Algorithm: Dynamic Pricing
*   **Logic:**
    *   `TotalCost = (DailyRate * DurationDays) + DeliveryCharge`.
    *   This simple linear regression ensures transparent pricing before the request is confirmed.

---

## 4. Farm Owner Dashboard Analysis (`FarmOwnerDashboard.tsx`)

**Goal:** Provide financial and operational insights.

### Algorithm: Aggregation & Statistics
*   **Concepts:** Array Reduction, dynamic totaling.
*   **Logic:** The system computes "Total Earnings" and "Active Jobs" on the fly using `useAnalytics` hook.
    1.  **Fetch:** Get all `Job` documents from Backend where `status == 'completed'`.
    2.  **Aggregation:**
        ```javascript
        TotalEarnings = Jobs.reduce((sum, job) => sum + job.paymentAmount, 0);
        ```
    3.  **Optimization:** This calculation happens on the **Backend** (`/api/analytics` endpoint) using MongoDB aggregation pipelines (`$match`, `$group`, `$sum`) to ensure fast load times even with thousands of records.

---

## 5. Secure Authentication (`auth.ts` + Backend)

**Goal:** Ensure only valid users access their data.

### Algorithm: Dual-Entity Authentication (User + Profile)
*   **Concepts:** Cryptography, JWT, Separation of Concerns.
*   **Logic:**
    1.  **Registration (`/api/auth/register`):**
        *   **Split Write:** The system creates two documents.
            *   `User`: Stores `email` and `hashed_password`.
            *   `UserProfile`: Stores `fullName`, `address`, `farmDetails`.
        *   **Linking:** `User.profileId` stores the ID of the `UserProfile`.
    2.  **Login (`/api/auth/login`):**
        *   **Verify:** `bcrypt.compare(password, storedHash)`.
        *   **Tokenize:** Parameters `{ id, role }` are signed into a JWT.
        *   **Return:** Returns Token + User Object + Profile Object.
    3.  **Session:**
        *   Frontend stores Token in `localStorage`.
        *   `ProtectedRoute.tsx` validates token presence before rendering keys.

---

## 6. Real-Time & Advanced Features

### A. Data Backup & Recovery (`DataBackup.tsx` / `dataImportExport.ts`)
*   **Algorithm:** JSON Serialization.
*   **Export:**
    1.  Collects all state arrays (Lands, Crops, Finances).
    2.  `JSON.stringify(data)` -> Creates a Blob -> Triggers download of `agrismart_backup.json`.
*   **Import:**
    1.  Reads uploaded file -> `JSON.parse()`.
    2.  Validates schema keys.
    3.  hydrates the LocalStorage/App State with the parsed data.

### B. PDF Report Generation (`pdfReports.ts`)
*   **Algorithm:** Canvas Drawing.
*   **Library:** `jspdf` & `jspdf-autotable`.
*   **Logic:** Programmatically draws text, lines, and tables.
    *   *Header:* Draws Logo and "AgriSmart" title.
    *   *Table:* Iterates over `data` array (e.g., Transaction History) and calculates row heights dynamicallly.
    *   *Footer:* Adds timestamp and translations.

---

## 7. Component Dictionary (`src/components`)

These are the building blocks of the user interface.

### A. Core Dashboards
*   **`FarmOwnerDashboard.tsx`**: The massive control center. Manages Lands, Jobs, Weather.
*   **`FarmWorkerDashboard.tsx`**: Interface for workers to find jobs, view earnings, and update their skills.
*   **`BuyerDashboard.tsx`**: E-commerce style page for browsing crops, filtering by price/location, and ordering.
*   **`RenterDashboard.tsx`**: For equipment owners. Manages inventory and rental requests.
*   **`IoTDashboard.tsx`**: Displays sensor data (Soil, Temp) and controls `SmartIrrigationControl`.
*   **`FeaturesDashboard.tsx`**: Navigation hub for all tools (Calculator, Weather, Market, etc.).

### B. Intelligent AI Features
*   **`AICropAdvisor.tsx`**: Expert system for fertilizers/water based on stage.
*   **`SmartCropDoctor.tsx`**: Visual AI tool for disease diagnosis via Gemini Vision.
*   **`AIChat.tsx` & `FloatingChatbot.tsx`**: The "AgriSmart Assistant" chat interface.
*   **`SmartWaterManager.tsx`**: Logic for water usage optimization.

### C. Advanced Utilities
*   **`ActivityTimeline.tsx`**: Visual timeline of recent farm events (Harvested, Planted).
*   **`DataBackup.tsx`**: UI to trigger Import/Export of data.
*   **`ExpenseTracker.tsx`**: Financial dashboard for tracking specific farm costs.
*   **`InventoryManagement.tsx`**: Tracks seeds, fertilizers, and equipment stock levels.
*   **`CropPriceTracker.tsx`**: Visualization of market trends.
*   **`SupportPage.tsx`**: Form to send emails via `Nodemailer`.

### D. Authentication Layouts
*   **`LoginModern.tsx`**: Animated entry page. Handles Login/Reg/Routing.
*   **`FarmerProfileSetup.tsx`**: Wizard for new farmers to enter Farm Name/Location.
*   **`ProfileCompletion.tsx`**: Wizard for Workers/Buyers to complete bio.
*   **`ProtectedRoute.tsx`**: Security wrapper that redirects unauthenticated users.

---

## 8. Logic Dictionary (`src/utils`)

The "brainpower" without UI.

### A. Connectivity
*   **`api.ts`**: Centralized Axios/Fetch wrapper. automatically attatches Bearer Tokens.
*   **`auth.ts`**: Manages `localStorage` tokens and Logout logic.
*   **`notifications.ts`**: Handles system-wide alerts.

### B. Business Logic
*   **`weather.ts`**: Irrigation heuristics and API integration for OpenWeatherMap.
*   **`pdfReports.ts`**: Canvas drawing logic for receipts/reports.
*   **`i18n.tsx`**: Dictionary for English/Tamil/Hindi translations.
*   **`dataImportExport.ts`**: Logic for reading/writing JSON backups.
*   **`logger.ts`**: System logging utility.

### C. Domain Managers
*   **`equipmentManagement.ts`**: Logic specifically for the Renter Dashboard.
*   **`orderManagement.ts`**: Logic for Buyer Dashboard transactions.
*   **`productReviews.ts`**: Logic for star ratings and comments.
*   **`earningsTracker.ts`**: Financial calculations.

---

## 9. Backend Dictionary (`server/`)

### A. API Routes (`server/index.js`)
1.  **Auth**:
    *   `POST /api/auth/register`: Create User + Profile.
    *   `POST /api/auth/login`: Validate and issue JWT.
2.  **User Data**:
    *   `GET/PATCH /api/user/profile/:userId`: Manage personal details.
3.  **Core Entities**:
    *   `GET/POST/PATCH/DELETE /api/lands`: Land management (Global/Seeded).
    *   `GET /api/workers`: List available workers (Seeded).
    *   `GET/POST /api/jobs`: Job board management.
    *   `POST /api/jobs/:id/apply`: Worker application logic.
4.  **Services**:
    *   `POST /api/ai`: Proxy to Google Gemini Pro (filters non-agri queries).
    *   `GET /api/analytics`: Aggregates stats (Total Jobs, Earnings).
    *   `POST /api/send-support-email`: Uses Nodemailer.

### B. Database Models (`server/models/`)
*   **`User.js`**: Auth credentials (Email, PasswordHash, Role, ProfileLink).
*   **`UserProfile.js`**: Extended details (Name, Address, FarmSize, Crops).
*   **`Land.js`**: Farm plot details (Acreage, Crop, Stage, SoilType).
*   **`Worker.js`**: Public profile for workers (Skills, Rating, HourlyRate).
*   **`Job.js`**: Job listing (Title, Pay, Requirements, Applicants).

---

## 10. Technology Stack Deep Dive

*   **Frontend**: React 18, TypeScript, Vite.
*   **Styling**: Tailwind CSS (Utility-first), Framer Motion (Animations).
*   **Icons**: Lucide React.
*   **Charts**: Recharts (for Price/Expense visualization).
*   **forms**: React Hook Form (Efficient validation).
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (Mongoose ODM).
*   **AI**: Google Gemini Pro (via REST API).
*   **Email**: Nodemailer (SMTP).
*   **PDF**: jsPDF + AutoTable.
*   **Security**: BCryptJS (Hashing), JWT (Tokens), CORS.

---

## 11. Directory Structure Reference

```
project/
├── src/
│   ├── components/       # UI (Dashboards, Widgets, Modals)
│   ├── utils/            # Logic (Weather, API, Calculations)
│   ├── api/              # (Legacy/folder structure support)
│   ├── assets/           # Images/SVGs
│   ├── App.tsx           # Main Router
│   └── main.tsx          # Entry Point
├── server/
│   ├── models/           # Mongoose Schemas (User, Land, Job)
│   ├── index.js          # Main Application Entry (Routes)
│   └── db.js             # Database Connection
└── public/               # Static Assets
```
