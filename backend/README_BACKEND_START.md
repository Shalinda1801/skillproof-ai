# SkillProof AI Backend Starter

## Run backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Test in browser

Open:

```txt
http://localhost:5000/api/health
```

## Main auth endpoints

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

For protected routes, send:

```txt
Authorization: Bearer YOUR_TOKEN
```
