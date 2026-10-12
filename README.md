# Elysian Grand Marquee — White Label Booking Platform

A modern, elegant wedding marquee and event venue booking website designed to help customers explore a venue and plan their events with a convenient online experience.

**Live Demo:** https://whitelablebooking.web.app/

## Overview

Elysian Grand Marquee is a digital platform concept for showcasing wedding and event venues. It aims to make venue discovery and event planning easier through an attractive interface and a streamlined booking experience.

The project is also intended to support a **white-label SaaS business model**, where multiple marquee owners can have their own branded websites and manage their individual pricing, event packages, and booking enquiries.

## Key Features

* **Premium Venue Website:** Elegant presentation of a wedding and event venue.
* **Responsive Design:** Designed for desktop, tablet, and mobile experiences.
* **Event Booking Experience:** A convenient way for customers to explore venue options and enquire about bookings.
* **Customizable Venue Pricing:** Intended support for venue-specific rates and event packages.
* **White-Label Architecture:** Designed with the potential to serve multiple venue businesses under their own branding.
* **Scalable SaaS Concept:** A foundation for expanding into a multi-tenant venue booking platform.

## Planned SaaS Capabilities

The platform can be extended with the following features:

* Separate admin dashboards for each marquee owner.
* Custom venue details, branding, images, and contact information.
* Configurable marquee rental prices and décor packages.
* Per-person catering prices and customizable food menus.
* Guest capacity limits and event-specific pricing.
* Dynamic cost estimation based on customer selections.
* Booking enquiry submission and WhatsApp integration.
* Booking calendar and availability management.
* Secure authentication and role-based access.
* Isolated tenant data so each business manages its own information.

## Technology Stack

The intended technology stack includes:

* **React.js** — Frontend development.
* **Firebase** — Hosting, authentication, database, and backend services as required.
* **Three.js** — 3D web experiences and visual elements.
* **GSAP** — Smooth animations and interactive transitions.
* **UI/UX Design** — Premium, responsive, and user-friendly interfaces.

*Note: Confirm the actual dependencies in `package.json` before treating this list as the final implementation stack.*

## Getting Started

### Prerequisites

* Node.js and npm
* A code editor such as Visual Studio Code
* Firebase project credentials if Firebase services are used locally

### Installation

1. Clone the repository:

   ```bash
   git clone YOUR_REPOSITORY_URL
   ```

2. Navigate to the project directory:

   ```bash
   cd YOUR_PROJECT_FOLDER
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure the required environment variables and Firebase settings.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL shown in your terminal.

## Project Goals

The long-term goal is to evolve a single venue website into a reusable, multi-tenant SaaS product. Each venue owner would be able to manage their own business information and pricing, while customers could configure event requirements, estimate costs, and contact the venue to finalize their booking.

## Deployment

The current live website is hosted on Firebase:

https://whitelablebooking.web.app/

## Future Improvements

* Multi-tenant authentication and authorization.
* Owner-specific dashboards and custom domains.
* Live venue availability and booking conflict prevention.
* Dynamic quotation generation.
* WhatsApp booking enquiries.
* Admin analytics and booking management.
* Improved performance, accessibility, and SEO.

## Author

**Muhammad Umar Hanif**

Full-Stack Developer

* GitHub: https://github.com/MuhammadUmarHanif
* Portfolio: https://muhammad-umar-developer.vercel.app/

---

*Built with a focus on premium venue presentation, simplified event planning, and scalable white-label booking experiences.*
