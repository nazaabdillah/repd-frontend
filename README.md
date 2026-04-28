# ██████╗ ███████╗██████╗ ██████╗
# ██╔══██╗██╔════╝██╔══██╗██╔══██╗
# ██████╔╝█████╗  ██████╔╝██║  ██║
# ██╔══██╗██╔══╝  ██╔═══╝ ██║  ██║

> **No Equipment. V-Taper. Real Results.**

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-0057FF?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-0057FF?style=for-the-badge&logo=supabase&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk_Auth-000000?style=for-the-badge&logo=clerk&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## ▌WHAT IS REPD?

**REPD** adalah aplikasi tracking workout berbasis web yang dirancang khusus untuk program **No Equipment V-Taper** — program latihan calisthenics pembentuk tubuh ideal tanpa alat gym.

Catat setiap set, lacak berat badan, dan dokumentasikan progress fisik kamu — semuanya tersimpan di cloud dan bisa diakses dari mana saja.

---

## ▌FEATURES

```
✦ Login dengan Google (OAuth via Clerk)
✦ Catat sesi workout harian
✦ Log berat badan dengan chart progress
✦ Upload foto progress
✦ Data tersimpan per user di cloud
✦ Responsive — mobile & desktop
```

---

## ▌TECH STACK

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Auth** | Clerk (Google OAuth) |
| **Database** | PostgreSQL via Supabase |
| **Storage** | Supabase Storage |
| **Styling** | CSS-in-JS (inline styles) |
| **Deployment** | Vercel |

---

## ▌PROJECT STRUCTURE

```
repd-app/
├── app/
│   ├── (auth)/
│   │   └── login/          # Login page dengan Google OAuth
│   ├── (dashboard)/
│   │   ├── workout/        # Catat sesi workout
│   │   ├── weight/         # Log berat badan
│   │   └── photos/         # Upload foto progress
│   ├── sso-callback/       # Handler OAuth redirect
│   └── layout.tsx
├── components/             # Reusable UI components
├── lib/                    # Utilities & API calls
└── public/
```

---

## ▌RELATED REPOSITORY

> Backend API dibangun terpisah menggunakan **Golang + Gin**

[![repd-backend](https://img.shields.io/badge/→_repd--backend-0057FF?style=for-the-badge)](https://github.com/nazaabdillah/repd-backend)

---

## ▌LOCAL DEVELOPMENT

**1. Clone repo**
```bash
git clone https://github.com/nazaabdillah/repd-app.git
cd repd-app
```

**2. Install dependencies**
```bash
npm install
```

**3. Setup environment variables**
```bash
cp .env.example .env.local
```

Isi file `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**4. Run development server**
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## ▌DEPLOYMENT

Frontend di-deploy ke **Vercel** dengan auto-deploy dari branch `main`.

```
Production URL: https://repd-frontend.vercel.app
```

---

## ▌AUTHOR

**Naza Abdillah**
Mahasiswa Sistem Informasi — Universitas Siliwangi (UNSIL)

[![GitHub](https://img.shields.io/badge/GitHub-000000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/nazaabdillah)

---

> *"Track the reps. Trust the process."*
