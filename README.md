# EDUCOURS - Educational Platform

**Apprendre. Comprendre. Réussir.** / **Learn. Understand. Succeed.**

A full-stack educational SaaS platform for secondary school students in Africa (Anglophone & Francophone systems). Features AI-powered tutoring, live classes, Mobile Money payments, and automated monthly assessments.

---

## 🏗 Architecture

```
educours/
├── backend/          # Node.js + Express API
├── frontend/         # React (Vite) + TypeScript SPA
├── mobile/           # React Native (Expo) app
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free M0 cluster)
- Cloudinary account (free tier)
- OpenAI API key
- MeSomb merchant account (MTN & Orange Money)
- SMTP email account (Gmail app password or SendGrid)

### Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev    # Development with nodemon
npm start      # Production
```

### Frontend Setup

```bash
cd frontend
cp .env.example .env
# Edit .env with your API URL
npm install
npm run dev    # Development server
npm run build  # Production build
```

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | API port (default: 5000) |
| `NODE_ENV` | `development`, `staging`, or `production` |
| `MONGO_URI` | MongoDB Atlas connection string |
| `MONGO_URI_STAGING` | Separate database for staging |
| `JWT_ACCESS_SECRET` | JWT access token secret (min 64 chars) |
| `JWT_REFRESH_SECRET` | JWT refresh token secret (min 64 chars) |
| `OPENAI_API_KEY` | OpenAI API key for chatbot & quiz generation |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `EMAIL_HOST` | SMTP host (e.g., smtp.gmail.com) |
| `EMAIL_PORT` | SMTP port (587 for TLS) |
| `EMAIL_USER` | SMTP username |
| `EMAIL_PASSWORD` | SMTP password or app password |
| `MESOMB_APP_KEY` | MeSomb application key |
| `MESOMB_ACCESS_KEY` | MeSomb access key |
| `MESOMB_SECRET_KEY` | MeSomb secret key |
| `FRONTEND_URL` | Frontend URL for CORS |
| `ADMIN_EMAIL` | admin@educour.com (do not change) |
| `ADMIN_DEFAULT_PASSWORD` | Default admin password |
| `PLATFORM_COMMISSION_PERCENT` | Platform fee (default: 40) |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API URL |
| `VITE_SOCKET_URL` | Backend WebSocket URL |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 ID |
| `VITE_SITE_URL` | Frontend deployment URL |

---

## 🌐 Deployment

### Backend → Render

1. Create a Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add all environment variables from `.env`
5. Deploy

### Frontend → Netlify

1. Create a new site on [Netlify](https://netlify.com)
2. Connect your GitHub repository
3. Set:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
4. Add environment variables:
   - `VITE_API_BASE_URL`: `https://your-backend.onrender.com/api`
   - `VITE_SOCKET_URL`: `https://your-backend.onrender.com`
5. Deploy
6. Configure custom domain (e.g., `educours.com`)

### MongoDB Atlas

1. Create a free M0 cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user with read/write permissions
3. Add your IP to the network access whitelist (or use `0.0.0.0/0` for Render)
4. Copy the connection string into your `MONGO_URI`

### Cloudinary

1. Create a free account at [Cloudinary](https://cloudinary.com)
2. Get `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` from the dashboard

### OpenAI

1. Create an API key at [OpenAI](https://platform.openai.com/api-keys)
2. Add the key to your `.env` as `OPENAI_API_KEY`

### MeSomb (MTN Mobile Money & Orange Money)

1. Register at [MeSomb](https://mesomb.com)
2. Create an application
3. Get `Application Key`, `Access Key`, and `Secret Key` from the dashboard
4. Set the webhook URL in your MeSomb dashboard: `https://your-backend.onrender.com/api/payments/mesomb-webhook`

### Email (SMTP)

**Using Gmail:**
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password at https://myaccount.google.com/apppasswords
3. Use your email as `EMAIL_USER` and the app password as `EMAIL_PASSWORD`

**Using SendGrid/Brevo:**
1. Create an account and get your SMTP credentials
2. Set the host, port, username, and password accordingly

---

## 💾 Backup & Restore

### Automatic Backups (MongoDB Atlas)

1. In MongoDB Atlas, go to your cluster → "Backup"
2. Enable "Continuous Cloud Backup" or "Scheduled Snapshots"
3. Configure daily snapshots at a specific time
4. Snapshots are retained for 1-7 days depending on your plan

### Manual Backup Script

```bash
cd backend
node scripts/backup.js
```

This exports critical collections (`User`, `Student`, `Teacher`, `Course`, `Enrollment`, `Transaction`, `QuizResult`, `SupportTicket`) to `backend/backups/<timestamp>/` as JSON files.

### Restore from Backup

```bash
# Using mongoimport
mongoimport --uri <MONGO_URI> --collection <collection> --file backups/<timestamp>/<collection>.json
```

---

## 🧪 Staging Environment

A separate staging environment should mirror production exactly but with a different database.

1. **Database**: Create a second MongoDB Atlas database (e.g., `educours_staging`)
2. **Backend**: Deploy a second Render Web Service with `NODE_ENV=staging` and `MONGO_URI_STAGING` set
3. **Frontend**: Deploy a second Netlify site from the `develop` branch
4. Test all features with fake data before deploying to production

---

## 📱 Mobile App (React Native / Expo)

### Development

```bash
cd mobile
npm install
npx expo start
```

### Building for Stores

```bash
# Install EAS CLI
npm install -g eas-cli

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

### Key Configuration

- API URL: Set in `app.json` → `extra.apiUrl`
- The mobile app reuses the same backend API — no duplicate business logic
- Admin panel remains web-only for security reasons

---

## 🔐 Security Checklist

- [x] Passwords hashed with bcrypt (salt rounds: 12)
- [x] JWT access tokens expire in 15 minutes
- [x] JWT refresh tokens expire in 7 days
- [x] All input validated with Joi schemas
- [x] CORS restricted to frontend domain
- [x] Rate limiting on auth routes (20 req/15min)
- [x] Rate limiting on API (200 req/15min)
- [x] Helmet security headers
- [x] NoSQL injection protection (mongo-sanitize)
- [x] Environment variables for all secrets
- [x] Single admin account enforced
- [x] Payment webhooks verified by signature
- [x] Sensitive action logging

---

## 📊 Analytics & SEO

### Google Analytics 4

1. Create a GA4 property at https://analytics.google.com
2. Copy the Measurement ID (`G-XXXXXXXXXX`)
3. Add it to frontend `.env` as `VITE_GA_MEASUREMENT_ID`
4. Events tracked: page views, course enrollment, payment, chatbot usage

### SEO

- Dynamic meta tags per page via `react-helmet-async`
- Open Graph tags for social sharing (WhatsApp, Facebook)
- Sitemap generated automatically
- `robots.txt` blocks private dashboards from indexing
- Clean URLs with slugs for courses

### Cookie Consent

A banner appears on first visit, storing consent preference. GA4 only loads after user accepts.

---

## 📋 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register/student` | Register as student |
| POST | `/api/auth/register/teacher` | Register as teacher |
| POST | `/api/auth/verify-email` | Verify email with 6-digit code |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh-token` | Refresh access token |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |

### Students (requires student role)
| GET | `/api/students/dashboard` | Dashboard data |
| GET | `/api/students/enrollments` | Enrolled courses |
| GET | `/api/students/transactions` | Payment history |

### Teachers (requires teacher role)
| GET | `/api/teachers/dashboard` | Dashboard data |
| GET | `/api/teachers/courses` | Assigned courses |
| GET | `/api/teachers/revenue` | Revenue & payouts |

### Admin (requires admin role)
| GET | `/api/admin/dashboard` | Platform stats |
| GET | `/api/admin/users` | List all users |
| PATCH | `/api/admin/teachers/:id/approve` | Approve teacher |
| POST | `/api/admin/broadcast` | Send broadcast |
| GET/PUT | `/api/admin/settings` | Platform settings |

### Courses
| GET | `/api/courses` | Public course catalog |
| POST | `/api/courses` | Create course (admin) |
| POST | `/api/courses/:id/enroll` | Enroll (student) |

### Payments
| POST | `/api/payments/initiate` | Start payment |
| POST | `/api/payments/mesomb-webhook` | MeSomb payment callback |

### Chatbot (requires student role)
| POST | `/api/chatbot/session` | Create chat session |
| POST | `/api/chatbot/message` | Send message to AI tutor |

### Support Tickets
| POST | `/api/tickets` | Create ticket |
| GET | `/api/tickets/my` | My tickets |
| GET | `/api/tickets/all` | All tickets (admin) |

---

## 🎯 Key Business Rules

1. **Single Admin Only**: One admin account (`admin@educour.com`) — no secondary admin creation possible
2. **Teachers Cannot Create Courses**: Only admins create courses and assign teachers
3. **Teacher Eligibility**: Must be 1st or 2nd year university student
4. **Pending Approval**: Teacher accounts are "pending" until admin approves
5. **Revenue Split**: 60% teacher / 40% platform (configurable in Settings)
6. **Monthly Payouts**: Automatic via cron job on the 1st of each month
7. **Monthly Quizzes**: AI generates 15 new questions per student per month based on course content
8. **Socratic Chatbot**: Never gives answers directly — guides step by step
9. **All Prices in FCFA**: No other currency supported
10. **Dark Mode & Font Size**: Persisted per user across sessions/devices

---

## 🛟 Support

- Admin: Notio Fopa Joel
- Email: notiofopajoel@gmail.com
- Phone: +237 678095581 / +237 659792288
- Location: Buea, Cameroon

---

## 📄 License

Private — All rights reserved. EDUCOURS
