# AeroSound Single Product Storefront & Admin Console

A premium, modern, responsive e-commerce web application designed for selling a single product (the flagship **AeroSound X1 Wireless Headphones**). The application features a luxury customer storefront, secure guest checkout (Cash on Delivery only), order confirmation, and a fully featured admin dashboard for tracking orders and customer credentials.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite) styled with Tailwind CSS v4 and animated using Motion.
- **Database / Auth**: Supabase (PostgreSQL with Row Level Security).
- **Deployment**: Netlify (preconfigured redirect fallback rules).

---

## 🚀 Instant Demo Mode (No Setup Required)

To make development and review frictionless, this application includes a **High-Fidelity Simulated local database state engine**.
- If Supabase environment variables are missing, the application **automatically runs in Demo Mode** using local browser storage.
- You can place orders, view customer histories, and update order statuses instantly in AI Studio!
- **Default Admin Login Credentials for Demo Mode**:
  - **Email**: `admin@example.com`
  - **Password**: `admin123`

---

## ⚙️ Real Supabase Setup & Installation Guide

Follow these simple steps to link the application to your live Supabase project:

### 1. Database Schema Installation
1. Go to your [Supabase Dashboard](https://supabase.com).
2. Open the **SQL Editor** tab from the left sidebar.
3. Click on **New Query**.
4. Copy the entire contents of the `/schema.sql` file from this project and paste it into the editor.
5. Click **Run** to provision the tables, triggers, indices, and Row Level Security (RLS) policies.

### 2. Creating the First Admin Account
To log in to the `/admin` portal, you must create a user in Supabase Auth and then whitelist their ID in the database:
1. Navigate to your Supabase project under **Authentication** -> **Users**.
2. Click **Add User** -> **Create User** and enter an email and password.
3. Copy the newly created user's **User UID** (UUID).
4. Go back to the **SQL Editor** and run the following query to whitelist this user as an administrator:
   ```sql
   INSERT INTO public.admins (id)
   VALUES ('YOUR-COPIED-USER-UUID-HERE');
   ```

---

## 🔐 Environment Variables

Add the following environment variables to your local environment, AI Studio secrets panel, or Netlify dashboard:

```env
# Supabase Project Credentials
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```

### Configuration on Netlify
1. Go to your Netlify Site dashboard.
2. Navigate to **Site Configuration** -> **Environment variables**.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as variables.

---

## 📦 Deployment on Netlify

This project includes a customized `/netlify.toml` file that handles production builds and configures SPA redirects automatically:
- When a user refreshes deep URLs like `/admin` or `/login` on Netlify, the server redirects traffic back to `/index.html` to allow client-side React routing to resolve correctly (preventing 404 errors).

To deploy:
1. Import your repository into Netlify.
2. The build command `npm run build` and directory `dist` are pre-set.
3. Add your environment variables and launch!
