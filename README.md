<div align="center">
  # 🚀 NUMU Landing Page & Auth Gateway
  
  *The public marketing website and top-of-funnel authentication gateway for NUMU — "Shopify for Egypt".*
</div>

## 📖 Overview

This is the primary marketing site for **NUMU**, a multi-tenant SaaS e-commerce platform purpose-built for the Egyptian and MENA market. It showcases platform features, converts visitors into merchants, and serves as the authentication gateway (Login & Sign Up) for the entire NUMU ecosystem. Upon successful authentication, users are seamlessly redirected to their merchant dashboard.

## ✨ Key Features

- **Neumorphic Design System:** A custom, soft UI shadow system (`neu-flat`, `neu-pressed`, `neu-floating`) providing a modern, tactile feel.
- **Interactive Physics Animations:** Uses **Matter.js** for an engaging, split-screen "Ballpit" animation during the authentication flow.
- **Fully Bilingual (i18n):** Native support for both English and Egyptian Arabic (Masri) to cater directly to our local market.
- **Seamless Authentication:** Secure, cookie-based authentication utilizing CSRF double-submit patterns via the core `NUMU-api`.
- **Dynamic Scroll:** Full-page snap-scrolling on desktop & natural fluid scrolling on mobile devices.
- **API-Configurable Sections:** Content visibility (Hero, Features, MultiChannelShowcase, Integrations, Testimonials) is controlled dynamically via backend configuration (`numu-admin`).

## 🛠 Tech Stack

- **Framework:** React 19
- **Language:** TypeScript 5.8 
- **Build Tool:** Vite 6
- **Routing:** React Router v7
- **Styling:** Tailwind CSS (CDN-based structure)
- **Physics/Animation:** Matter.js

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- The primary `NUMU-api` backend must be running locally to handle auth requests.

### Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Environment Variables:**
   Create a `.env` file (if not using the global workspace launcher) with the following standard configurations:
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   VITE_DASHBOARD_URL=http://localhost:8080
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
   *The app will automatically run on **port 3090**: [http://localhost:3090](http://localhost:3090).*

## 🏗 Platform Architecture Context

This repository is one of 5 independent projects within the broader NUMU monorepo:
- Communicates directly with **`NUMU-api`** (Python/FastAPI) to validate credentials and attach `httpOnly` session cookies.
- Redirects successfully authenticated requests to **`numo-merchant-hub`** (React SPA on port 8080).

