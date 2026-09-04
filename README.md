# 💪 GymForce — Premium Gym Management System

<div align="center">

![GymForce Banner](https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80)

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Recharts](https://img.shields.io/badge/Recharts-3-FF6B6B?style=for-the-badge)](https://recharts.org)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-39FF14?style=for-the-badge)](./LICENSE)

**A production-ready, investor-demo quality Gym Management SaaS platform**  
built with React 19 + Tailwind CSS 4 + Vite 8

[🚀 Live Demo](#) · [📋 Features](#-features) · [🖥️ Screenshots](#️-screenshots) · [⚡ Quick Start](#-quick-start)

</div>

---

## ✨ Overview

**GymForce** is a full-featured, premium gym management web application built as a SaaS-style platform. It combines a stunning public landing page with a fully functional admin dashboard — designed to look and feel like a real production product.

The UI is inspired by leading fitness brands and modern SaaS admin panels, featuring a dark athletic aesthetic with neon green, electric blue, and orange accents, glassmorphism cards, smooth animations, and a fully responsive mobile-first layout.

---

## 🎯 Features

### 🌐 Public Landing Page
| Section | Description |
|---|---|
| **Hero** | Full-screen background image, gradient overlays, CTA buttons, animated stats bar |
| **Features** | 6-card grid showcasing all platform modules with hover effects |
| **How It Works** | 4-step process with numbered steps and connector lines |
| **Pricing** | 4-tier plan cards (Basic / Standard / Premium / VIP) with feature lists |
| **Testimonials** | Mobile carousel + desktop grid with star ratings |
| **Roadmap** | Phase 2 feature cards with status badges and ETAs |
| **CTA Banner** | Conversion-focused section with gradient background |
| **Footer** | 4-column footer with links, social icons, system status |

### 🔐 Auth Pages
- **Login** — Split-panel design with gym background image, role-based selector (Admin / Manager / Trainer / Member), Google SSO button
- **Register** — Multi-role signup with gym name field, password strength meter, T&C checkbox
- **Forgot Password** — Email form with animated success state

### 📊 Admin Dashboard

#### Overview Page
- 4 KPI cards: Monthly Revenue, Active Members, Avg Attendance, Expiring Memberships
- Revenue & Member Growth — Area chart (Jan–Aug)
- Weekly Attendance — Grouped bar chart (Morning vs Evening)
- Plan Distribution — Donut/pie chart
- Recent Payments table with pagination and status badges
- Top Active Members widget
- Quick Actions panel (Add Member, Record Payment, Mark Attendance, Add Trainer)

#### Core Modules
| Module | Capabilities |
|---|---|
| **Members** | Sortable + filterable table, search by name/email, member detail modal, add member drawer, status/plan badges |
| **Membership Plans** | Plan cards with feature lists, Billing History tab with paginated payment records |
| **Attendance** | KPI stats, bar chart, zone usage progress bars, filterable check-in log table |
| **Trainers** | Card grid, mobile slider, profile modal with certifications, schedule table |
| **Notifications** | Filterable by severity, mark as read, delete, unread count badge |
| **Reports** | 4 tabbed views — Revenue trends + monthly breakdown, Attendance analysis, Membership retention donut, Trainer performance table |

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev) | 19 | UI framework |
| [Vite](https://vitejs.dev) | 8 | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Utility-first styling |
| [@tailwindcss/vite](https://tailwindcss.com/docs/installation/vite) | 4 | Tailwind Vite plugin |
| [React Router DOM](https://reactrouter.com) | 7 | Client-side routing |
| [Recharts](https://recharts.org) | 3 | Chart components |
| [Lucide React](https://lucide.dev) | Latest | Icon library |
| [TypeScript](https://www.typescriptlang.org) | 6 | Type checking |

---

## 🖥️ Screenshots

### Landing Page — Hero
> Dark athletic theme with gym background, neon green gradient headline, CTA buttons and animated stats

### Admin Dashboard
> Professional SaaS panel with sidebar navigation, KPI cards, area charts, and data tables

### Member Management
> Sortable, filterable table with member detail modal and slide-in add-member drawer

### Reports & Analytics
> Tabbed analytics with area charts, bar charts, donut charts, and performance tables

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ & npm 9+
- Python 3.11+ (for FastAPI backend)

### Setup & Running Locally

#### 1. Frontend (React + Vite — Port 3000)
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

#### 2. Backend (FastAPI — Port 8000)
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000/api`
- **Interactive Swagger Docs**: `http://localhost:8000/api/docs`
- **ReDoc Documentation**: `http://localhost:8000/api/redoc`
- **Security & Protection**: Argon2id Hashing, CORS Credentials, Double-Submit CSRF Protection


---

## 📁 Project Structure

```
Gym-managemnet-system/
├── backend/                    # FastAPI + Pydantic v2 + SQLAlchemy backend
│   ├── app/
│   │   ├── core/               # Security, JWT tokens & Auth dependencies
│   │   ├── models/             # SQLAlchemy ORM models & Seed loader
│   │   ├── schemas/            # Pydantic validation schemas
│   │   ├── routers/            # API endpoints (Auth, Members, Plans, etc.)
│   │   ├── database.py         # DB connection & session factory
│   │   ├── config.py           # Application settings
│   │   └── main.py             # FastAPI app instance & middleware
│   ├── main.py                 # Server runner
│   ├── cli.py                  # CLI utility commands
│   └── requirements.txt
│
└── frontend/                   # React 19 + Vite 8 frontend
    ├── src/
    │   ├── main.jsx            # React entry point
    │   ├── App.jsx             # Router + all route definitions
    │   ├── index.css           # Tailwind imports + custom utilities
    │   ├── context/            # Auth & global state
    │   ├── layouts/            # DashboardLayout & MemberLayout
    │   ├── pages/              # Landing, Auth, Dashboard, Member portal
    │   └── data/               # Sample data & mocks
    ├── package.json
    └── vite.config.js
```

---

## 🗺️ Application Routes

| Route | Page |
|---|---|
| `/` | Public landing page |
| `/login` | Login (role-based) |
| `/register` | Registration |
| `/forgot-password` | Password reset |
| `/dashboard` | Admin overview |
| `/dashboard/members` | Member management |
| `/dashboard/plans` | Membership plans & billing |
| `/dashboard/attendance` | Attendance tracking |
| `/dashboard/trainers` | Trainer management |
| `/dashboard/notifications` | Notification center |
| `/dashboard/reports` | Reports & analytics |

---

## 🎨 Design System

### Color Palette
| Name | Hex | Usage |
|---|---|---|
| Neon Green | `#39FF14` | Primary accent, active states, success |
| Electric Blue | `#00D4FF` | Secondary accent, charts, info |
| Orange | `#FF6B00` | Tertiary accent, warnings, CTA |
| Purple | `#A855F7` | Charts, miscellaneous data |
| Dark Base | `#030712` (gray-950) | Page background |
| Surface | `#111827` (gray-900) | Card/panel background |

### Custom Utilities
```css
.glass          /* Frosted glass card effect */
.glass-dark     /* Dark frosted glass (navbar) */
.neon-glow      /* Green glow box-shadow */
.gradient-text  /* Green → blue gradient text */
.card-hover     /* Lift effect on hover */
```

---

## 🚀 Phase 2 Roadmap

- [ ] 📱 **Mobile App** (iOS & Android) — Q1 2027
- [ ] 🤖 **AI Workout Recommendations** — Q2 2027
- [ ] 📅 **Class Scheduling System** — Q1 2027 *(In Progress)*
- [ ] 🛒 **POS & Retail Integration** — Q3 2027
- [ ] 🏢 **Multi-Location Support** — Q2 2027
- [ ] ⌚ **Wearables & IoT Integration** — Q4 2027

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **Apache License 2.0** — see the [LICENSE](./LICENSE) file for details.

---

## 👩‍💻 Author

**Pallavi Dhadage**  
📧 psdhadage18@gmail.com  
🐙 [@pallavi-dhadage](https://github.com/pallavi-dhadage)

---

<div align="center">

Made with ❤️ and ☕ | GymForce © 2026

⭐ Star this repo if you found it useful!

</div>
