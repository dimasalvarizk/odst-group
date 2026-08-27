# ODST Group Corporate Portal & Control Center

A modern, high-performance corporate portal for **ODST Group** — a premier conglomerate providing premium hospitality, aviation & charter flight solutions, and bespoke pilgrim tour packages for Hajj & Umrah.

This system is built with a decoupled architecture containing a fast React SPA frontend and a secure Node.js Express **Microservices backend** coordinated by a central **API Gateway** connected to a MySQL database.

---

## 🏛️ Project Architecture

The codebase is split into two primary modules:

1. **`odst-frontend`** (Frontend):
   - **Tech Stack:** React (TypeScript), Vite, Tailwind CSS, Lucide Icons, React Router.
   - **Description:** Premium customer-facing pages (Home, Contact, Privacy, Terms) and a responsive, secure **Admin Control Center Dashboard** for managing inquiries, subscriptions, services, and contacts.

2. **`backend`** (Backend API Gateway & Microservices):
   - **Tech Stack:** Node.js, Express.js, Sequelize ORM, MySQL, Concurrently.
   - **Description:** A microservices architecture where services are split into logical domain modules:
     - **API Gateway (`server.js`):** Pinned on Port `5000`. Acts as the single entry point routing requests to separate microservice ports locally or routing in-memory when deployed in Serverless Vercel Mode.
     - **Auth Service (`services/auth-service.js`):** Runs on Port `5001`. Handles admin credentials, JWT tokens, and account access.
     - **Contact Service (`services/contact-service.js`):** Runs on Port `5002`. Manages user inquiries and contact forms.
     - **Newsletter Service (`services/newsletter-service.js`):** Runs on Port `5003`. Manages newsletter subscriptions.
     - **Content Service (`services/content-service.js`):** Runs on Port `5004`. Handles lander service details and image configurations.

---

## 🚀 Key Features

* **Dynamic Landing Page Services:** Edit titles, badge names, action links, descriptions, image layouts, and upload custom images directly from the dashboard.
* **Direct Connections Directory:** Dedicated tab to adjust phone numbers, email addresses, and locations for division coordinators (Hotels, Airlines, Travel).
* **Live Inquiries Management:** Review and filter customer messages, mark status as Read/Replied, and delete inquiries.
* **Newsletter Subscription Controls:** View list of active subscribers, unsubscribe emails, and auto-sync contacts directly with the **Mailchimp Marketing API** (Audience list).
* **Branded Admin Gateways:** Fully customized split-screen brand login page and dashboard using official logos.
* **API Connection Hydration:** Full integration connecting form submissions to live database models with local asset fallback.

---

## ⚙️ Getting Started

### 1. Database Setup
Ensure you have a MySQL server running (e.g. at `localhost:3306`). Create a database named `odst_db`:
```sql
CREATE DATABASE odst_db;
```

### 2. Backend Installation & Dev Server
Navigate to the `backend` folder:
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory based on `.env.example`:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=odst_db
JWT_SECRET=your_jwt_secret_token

# Mailchimp Integration
MAILCHIMP_API_KEY=your_mailchimp_api_key
MAILCHIMP_SERVER_PREFIX=us11
MAILCHIMP_AUDIENCE_ID=your_mailchimp_audience_id
```

Run database sync and start the dev server (it will automatically seed the initial admin account `admin@odst.id` / `password123` and default services if the tables are empty). This command runs the API Gateway and all microservices concurrently on ports 5000-5004:
```bash
npm run dev
```

### 3. Frontend Installation & Dev Server
Navigate to the `odst-frontend` folder:
```bash
cd ../odst-frontend
npm install
npm run dev
```
The client website will run at `http://localhost:5173`.

---

## 📦 Production Build

To compile a production-ready bundle for Vercel or other static hosting providers:

```bash
# In odst-frontend/
npm run build
```

This compiles optimized HTML, CSS, and JS files into the `dist/` directory.

---

## 🔐 Credentials (Initial Seed)
* **Email:** `admin@odst.id`
* **Password:** `password123`
*(Ensure you modify these credentials after first login for security).*
