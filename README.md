# Elysian Marquee — Production-Ready White-Label Marquee Booking & Event Cost Calculator Website

A commercial-grade, multi-tenant-ready yet **independently deployable** web application built for marquee owners, wedding banquet halls, and luxury event venues.

This product is engineered to be sold to multiple marquee businesses as an independent turnkey solution: each client receives their own Firebase project, custom domain, database, admin portal, and branding.

---

## 🏛️ Key Features & Architecture

### 1. Public Luxury Wedding Experience
* **Cinematic Hero**: Ultra-refined aesthetics, typography (`Cormorant Garamond` + `Plus Jakarta Sans`), warm champagne gold palette, and GSAP smooth reveals.
* **Tasteful 3D Visual in Three.js**: Interactive interlocking dual wedding bands & diamond solitaire with metallic gold reflections, stardust particle float, mouse parallax, and fallback for reduced-motion/non-WebGL devices.
* **Database-Driven Packages & Halls**: Comprehensive showcases for ballrooms, lawns, and master dining tiers where all prices are pulled directly from Firestore.
* **Photo Galleria with Fullscreen Lightbox**: Filterable by ballroom, open-air lawn, stage florals, and dining banquets.
* **Concierge & Tour Requests**: Walkthrough bookings, interactive Google Maps directions, and direct WhatsApp concierge integration.

### 2. Multi-Step Interactive Cost Calculator
The centerpiece of the application with centralized, typed, deterministic pricing logic:
* **Step 1: Event Schedule & Attendance**: Occasion type, calendar date, lunch/dinner/full-day slots, headcount, and layout.
* **Step 2: Venue Space & Capacity Rules**: Real-time capacity checks, minimum guest billable thresholds, and weekend/peak-season surcharges.
* **Step 3: Royal Catering Banquets**: Tiered dining packages or custom a la carte chef creations with dietary tags.
* **Step 4: Stage Décor & Florals**: Floral crescent arches, contemporary stages, and centerpieces with fixed or per-guest rates.
* **Step 5: Power & Audio-Visuals**: Mandatory 300kVA backup generators, climate AC, Bose concert audio, and executive valet.
* **Step 6: Itemized Breakdown & Printable Quotation**: Quantity, unit price, discounts, service charges, government VAT, and required advance deposit.
* **Instant Recalculation**: Pure calculation engine (`src/services/pricingEngine.ts`) with automated unit tests for edge cases (zero guests, capacity overflows, holiday surcharges).

### 3. Booking Confirmation & Conflict Prevention
* **Immutable Quotation Snapshots**: Each submitted booking locks the exact itemized prices and selections agreed upon; future admin price adjustments will never alter past quotations.
* **Race Condition Prevention**: Double-booking for the same hall and time slot is prevented both in the application layer and through transactional Cloud Functions (`functions/index.js`).
* **Active Hold Policy**: Inquiries start as `pending` or owner-approved holds with an explicit expiry date, preventing unconfirmed inquiries from indefinitely blocking dates.
* **Printable / Shareable Quotation View**: Clean, branded print stylesheet with digital acceptance signature lines (`/quotation/:id`).

### 4. Authenticated Admin Dashboard
* **Executive Financial Metrics**: Clear distinction between **Estimated Pipeline Revenue**, **Contracted Value**, and **Payments Actually Received**.
* **Visual Event Calendar**: Monthly calendar tracking confirmed events, holds, and pending inquiries across lunch and dinner slots.
* **Venue & Capacity Management**: Add/edit pillarless halls, lawns, minimum billable guest limits, and rental prices.
* **Menu & Banquet Management**: Configure food categories, dishes, live counters, and package course highlights.
* **Décor & Service Management**: Configure stage options and required venue policies.
* **Pricing & Tax Settings**: Live management of VAT %, service charge %, advance %, weekend surcharge %, and peak season months.
* **White-Label Website Customization**: Instant database updates for venue name, logo, primary color token, editorial copy, and contact info.
* **Data Export**: Instant CSV and JSON export of bookings, client contacts, and payment ledgers.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, Vite 8, TypeScript |
| **Styling** | Tailwind CSS v4, Lucide React |
| **3D & Animation** | Three.js (Torus & Diamond geometries), GSAP 3 |
| **Backend & Auth** | Firebase Authentication, Cloud Firestore, Firebase Storage |
| **Server-Side Logic** | Firebase Cloud Functions (v2 Transactional locking) |
| **Forms & Validation** | React Hook Form, Zod |
| **Charts & Metrics** | Recharts (Responsive Area & Bar charts) |
| **Automated Testing** | Vitest (13+ unit tests for pricing & conflict rules) |

---

## 📂 Project Directory Structure

```
├── .env.example                # Template for Vite Firebase environment credentials
├── firestore.rules             # Production security rules (least-privilege model)
├── firestore.indexes.json      # Composite indexes for hall/date queries
├── storage.rules               # Storage bucket security rules
├── firebase.json               # Firebase deployment configuration
├── functions/                  # Cloud Functions for atomic booking conflict checks
│   ├── index.js
│   └── package.json
├── scripts/
│   └── seedFirebase.js         # Automated client onboarding seed script
├── src/
│   ├── types/                  # Typed models for venues, menus, bookings, rules
│   ├── config/
│   │   ├── firebase.ts         # Firebase initialization with offline fallback
│   │   └── defaultSettings.ts  # Default luxury venue presets & starter data
│   ├── services/
│   │   ├── pricingEngine.ts    # Pure, deterministic pricing calculation module
│   │   ├── pricingEngine.test.ts # Vitest automated test suite for calculations
│   │   ├── bookingConflictEngine.ts # Slot overlap and date conflict engine
│   │   ├── bookingConflictEngine.test.ts
│   │   └── firebaseService.ts  # Firestore & Storage CRUD operations
│   ├── context/
│   │   ├── AuthContext.tsx     # Admin authentication state & demo fallback
│   │   └── BrandContext.tsx    # Live white-label branding & dynamic color theming
│   ├── components/
│   │   ├── common/             # Navbar, Footer, ThreeHeroVisual, Lightbox
│   │   ├── calculator/         # Steps 1 to 6 and MultiStepCalculator container
│   │   └── admin/              # AdminLayout, AdminSidebar, AdminHeader
│   └── pages/
│       ├── public/             # HomePage, Packages, Calculator, Booking, Quotation, Gallery, Contact
│       └── admin/              # Dashboard, Bookings, Details, Calendar, Venues, Menus, Decor, Pricing, Customization, Settings
```

---

## 🚀 Getting Started Locally

### Prerequisites
* Node.js v18 or later
* npm v9 or later

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd white-lable-marquee

# Install dependencies
npm install
```

### Running in Standalone Evaluation Mode
The application includes an automatic local storage fallback. You can run and test the application immediately without providing Firebase credentials:

```bash
npm run dev
```

* **Public Website**: `http://localhost:5173/`
* **Admin Portal**: `http://localhost:5173/admin/login`
* **Evaluation Admin Credentials**:
  * Email: `admin@marquee.com`
  * Password: `admin123`

### Running Automated Tests
```bash
npm test
```
Runs Vitest verifying:
1. Zero guests edge cases
2. Hall minimum billable guest adjustments
3. Capacity under/over warnings
4. Weekend surcharge calculations
5. Peak wedding season detection
6. Compound VAT and hospitality charges
7. Double-booking conflict detection for overlapping time slots

---

## 📦 Client Onboarding & Deployment Workflow

Follow this 10-step checklist to deploy an independent copy for a new marquee owner:

### Step 1: Create a Dedicated Firebase Project
1. Navigate to [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and name it after your client (e.g. `royal-palace-marquee-prod`).
3. (Optional) Disable Google Analytics if not required.

### Step 2: Enable Firebase Authentication
1. Go to **Build > Authentication > Sign-in method**.
2. Enable **Email/Password**.
3. Under **Authorized domains**, add the client's custom domain (e.g. `royalpalaceevents.com`) and your hosting domain.

### Step 3: Enable Firestore & Storage
1. Go to **Build > Firestore Database** > Create database > Select production mode and your preferred geographic region.
2. Go to **Build > Storage** > Get started > Select standard bucket.

### Step 4: Configure Client Environment Variables
Duplicate `.env.example` to `.env.local` and populate the Firebase Web App credentials:

```bash
cp .env.example .env.local
```

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=royal-palace-marquee-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=royal-palace-marquee-prod
VITE_FIREBASE_STORAGE_BUCKET=royal-palace-marquee-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

VITE_DEFAULT_VENUE_NAME="Royal Palace Marquee"
```

### Step 5: Deploy Security Rules & Indexes
Deploy the production-grade rules and indexes:

```bash
# Login to Firebase CLI
firebase login

# Set active project
firebase use royal-palace-marquee-prod

# Deploy firestore rules, storage rules, and indexes
firebase deploy --only firestore:rules,storage:rules,firestore:indexes
```

### Step 6: Deploy Cloud Functions (Conflict Prevention)
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### Step 7: Seed Initial Venue & Pricing Data
Run the automated seed script to populate default halls, royal dining tiers, stage options, and pricing rules into the client's database:

```bash
npm run seed
```

### Step 8: Create the Client's First Administrator
1. In the Firebase Console, go to **Authentication > Users > Add user**.
2. Enter the marquee owner's email (e.g. `owner@royalpalaceevents.com`) and a temporary secure password.
3. Provide these credentials to the venue owner.

### Step 9: Build and Deploy the Web Application
```bash
npm run build
firebase deploy --only hosting
```

### Step 10: Connect Customer Custom Domain
1. In Firebase Console, go to **Hosting > Add custom domain**.
2. Enter `royalpalaceevents.com`.
3. Add the provided `A` and `TXT` records in the client's DNS registrar (GoDaddy, Namecheap, Cloudflare, etc.).
4. Firebase automatically provisions an SSL certificate.

---

## 🔄 Maintaining Master Code vs Client Copies

To deliver future improvements to all clients without overwriting their individual business data:

1. **Keep Code and Data Strictly Separated**:
   All client-specific prices, menus, halls, branding, and booking records live exclusively in Firestore.
2. **Git Upstream Strategy**:
   Maintain a master template repository (`upstream/main`). When creating a new client deployment, clone or fork this repository into `client-repo-xyz`.
3. **Pulling Upstream Updates**:
   To update a client's site with new UI enhancements or calculator features:
   ```bash
   git checkout main
   git pull upstream main
   npm run test
   npm run build
   firebase deploy --only hosting
   ```
   *Because all venue details and pricing rules are stored in Firestore, deploying code updates will never modify or erase their existing booking records or prices.*

---

## 🛡️ Security Audit & Privacy Assurance

* **Strict Customer Scoping**: Public users can only read published venue specifications (`halls`, `menuPackages`, `decorations`, `services`, `brand`, `pricingRules`).
* **Protected Bookings**: Customer payment records, internal notes, and management audit logs are restricted to authenticated administrators in `firestore.rules`.
* **Zero Client-Side Confirmation**: Customers cannot mark bookings as confirmed or tamper with balance sheets; status transitions require admin authorization or the transactional Cloud Function.
* **No Secret Keys in Frontend**: No Firebase Admin service account keys are bundled into Vite builds. Only public Firebase web client credentials are used.
#   W h i t e - l a b l e - b o o k i n g  
 