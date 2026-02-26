# 🌐 Planexa — Next.js AI Study Planner Frontend

Planexa is a modern, AI-driven study planning application built with Next.js. It provides a sleek, SaaS-style interface for students and professionals to generate, manage, and track their study plans with the help of AI.

## 🚀 Key Features

- **AI Plan Generation:** 3-phased study plan generation pipeline.
- **Interactive Dashboard:** Personal overview with quick links to all features.
- **My Plans:** Manage and view all your saved study plans.
- **Analytics:** Visualize your progress with interactive charts (Recharts).
- **To-Do List:** Integrated task management with progress tracking.
- **Responsive Design:** Fully optimized for Desktop, Tablet, and Mobile.
- **Dark/Light Theme:** Professional Blue-themed UI with smooth transitions.
- **Protected Routes:** Secure access control for dashboard and planning features.
- **Smooth UX:** Framer Motion animations and skeleton loaders to prevent "black screens".

## 🛠️ Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Yup](https://github.com/jquense/yup)
- **Charts:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **API Client:** [Axios](https://axios-http.com/)

## 🚦 Getting Started

### 1. Prerequisites
- Node.js 18.x or later
- Backend server running (see `Backend/README.md`)

### 2. Installation
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the `frontend` directory and add your backend URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components.
- `lib/`: Utility functions, API clients, and state stores.
- `public/`: Static assets.

## 🔒 Routing & Access

| Route | Access | Description |
|-------|--------|------------|
| `/` | Public | Landing page & CTA |
| `/signup` | Public | User registration |
| `/login` | Public | User authentication |
| `/dashboard` | Protected | Main overview |
| `/dashboard/my-plans` | Protected | Saved plans management |
| `/dashboard/generate-plan` | Protected | AI Plan generation pipeline |
| `/dashboard/analytics` | Protected | Progress visualization |
| `/dashboard/todo` | Protected | Task management |

---
*Built with ❤️ for organized learning.*
