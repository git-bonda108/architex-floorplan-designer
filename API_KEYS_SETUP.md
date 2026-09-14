# 🔑 API Keys & Database Setup Guide

Complete guide for setting up all required API keys and database connections for ArchitectPro.

---

## 📊 Database Setup - Supabase (Recommended)

### Quick Instructions - Get Supabase Connection String

**Step 1: Create a Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"New project"**
3. Sign in with GitHub/Google/Email
4. Click **"New project"**
5. Fill in:
   - **Name:** `architect-pro` (or any name)
   - **Database Password:** Create a strong password (save this!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free (includes 500MB database, 5GB bandwidth)
6. Click **"Create new project"** (takes 1-2 minutes)

**Step 2: Get the Connection String**
1. Once project is created, click **"Settings"** (gear icon in left sidebar)
2. Click **"Database"** in the settings menu
3. Scroll down to **"Connection string"** section
4. Select **"URI"** tab
5. Copy the connection string - it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with the password you created in Step 1
7. Add `?sslmode=require` at the end:
   ```
   postgresql://postgres:yourpassword@db.xxx.supabase.co:5432/postgres?sslmode=require
   ```

**Step 3: Add to .env File**
```bash
DATABASE_URL="postgresql://postgres:yourpassword@db.xxx.supabase.co:5432/postgres?sslmode=require"
```

### Alternative: Using Supabase Project URL (From Your Screenshot)

If you see a screen like in your screenshot showing:
- **Project URL:** `https://nhkzgykdnglniravubqj.supabase.co`
- **Publishable API Key:** `sb_publishable_X3thTnIUVbGHMUX4dySvq_A6g2lr9h`

You need the **DATABASE connection string**, not the API URL. Follow these steps:

1. From the screen in your screenshot, click **"API settings"** link (visible in top left)
2. OR navigate to: **Settings** → **Database**
3. Scroll to **"Connection string"** section
4. Select **"URI"** mode
5. Copy and replace password

**Important:** The Project URL and Publishable API Key are for **Supabase client libraries** (JavaScript SDK), NOT for Prisma database connection.

---

## 🤖 AI API Keys Setup

### 1. OpenAI API Key

**Get Your API Key:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Click on your profile (top right) → **"View API keys"**
4. Click **"Create new secret key"**
5. Name it: `ArchitectPro`
6. Copy the key immediately (starts with `sk-proj-...`)
7. Add to `.env`:
   ```bash
   OPENAI_API_KEY="sk-proj-your-key-here"
   ```

**Pricing:**
- GPT-4o: $2.50 / 1M input tokens, $10 / 1M output tokens
- GPT-4o-mini: $0.15 / 1M input tokens, $0.60 / 1M output tokens
- Free trial: $5 credit for first 3 months

**Documentation:** [OpenAI API Docs](https://platform.openai.com/docs)

---

### 2. DeepSeek API Key

**Get Your API Key:**
1. Go to [platform.deepseek.com](https://platform.deepseek.com)
2. Sign up with email or GitHub
3. Navigate to **"API Keys"** section
4. Click **"Create API Key"**
5. Copy the key (starts with `sk-...`)
6. Add to `.env`:
   ```bash
   DEEPSEEK_API_KEY="sk-your-key-here"
   ```

**Pricing:**
- DeepSeek-V3: $0.14 / 1M input tokens, $0.28 / 1M output tokens
- Very cost-effective for large-scale applications

**Documentation:** [DeepSeek API Docs](https://platform.deepseek.com/docs)

---

### 3. Groq API Key

**Get Your API Key:**
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up with email or Google
3. Click **"API Keys"** in left sidebar
4. Click **"Create API Key"**
5. Name it: `ArchitectPro`
6. Copy the key (starts with `gsk_...`)
7. Add to `.env`:
   ```bash
   GROQ_API_KEY="gsk_your-key-here"
   ```

**Pricing:**
- **FREE TIER:** 30 requests/minute, 7,000 tokens/minute
- Llama 3.1 70B: $0.59 / 1M input tokens, $0.79 / 1M output tokens
- Fastest inference speed in the market

**Documentation:** [Groq API Docs](https://console.groq.com/docs)

---

### 4. Google Gemini API Key

**Get Your API Key:**
1. Go to [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Or: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
3. Sign in with your Google account
4. Click **"Create API key"**
5. Select existing Google Cloud project or create new one
6. Copy the key (starts with `AIza...`)
7. Add to `.env`:
   ```bash
   GEMINI_API_KEY="AIzaSy-your-key-here"
   ```

**Pricing:**
- **FREE TIER:** 15 requests/minute, 1M tokens/minute
- Gemini 1.5 Flash: Free up to 1M tokens/day
- Gemini 1.5 Pro: Free up to 50 requests/day

**Documentation:** [Gemini API Docs](https://ai.google.dev/docs)

---

## 🔧 Complete .env File Example

Create `/nextjs_space/.env` with:

```bash
# Database Configuration
DATABASE_URL="postgresql://postgres:your_password@db.xxx.supabase.co:5432/postgres?sslmode=require"

# AI API Keys
OPENAI_API_KEY="<REDACTED-ROTATE-ME>"
DEEPSEEK_API_KEY="<REDACTED-ROTATE-ME>"
GROQ_API_KEY="<REDACTED-ROTATE-ME>"
GEMINI_API_KEY="<REDACTED-ROTATE-ME>"
```

---

## ✅ Verification Steps

### Test Database Connection

```bash
cd nextjs_space
npx prisma db push
```

If successful, you'll see:
```
✔ Generated Prisma Client
Your database is now in sync with your schema.
```

### Test API Keys (Optional)

Create a test file `nextjs_space/test-api.js`:

```javascript
const fetch = require('node-fetch');

// Test OpenAI
async function testOpenAI() {
  const response = await fetch('https://api.openai.com/v1/models', {
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    }
  });
  console.log('OpenAI:', response.ok ? '✅' : '❌');
}

// Test Groq
async function testGroq() {
  const response = await fetch('https://api.groq.com/openai/v1/models', {
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    }
  });
  console.log('Groq:', response.ok ? '✅' : '❌');
}

testOpenAI();
testGroq();
```

Run:
```bash
node --require dotenv/config test-api.js
```

---

## 🔒 Security Best Practices

### ⚠️ NEVER Commit .env to Git

Always verify `.env` is in `.gitignore`:

```bash
grep -n "\.env" .gitignore
```

Should show:
```
14:.env
15:.env.local
16:.env.production.local
```

### ✅ Do's:
- ✅ Use `.env.example` with placeholder values
- ✅ Share API key setup instructions (this file)
- ✅ Use environment variables in production (Vercel, Railway, etc.)
- ✅ Rotate API keys regularly
- ✅ Use different API keys for dev/staging/production

### ❌ Don'ts:
- ❌ Never commit `.env` to GitHub
- ❌ Never share API keys in chat/email
- ❌ Never hardcode API keys in source code
- ❌ Never use production API keys in development
- ❌ Never push `.env` to public repositories

---

## 🚀 Deployment Environment Variables

### Vercel

1. Go to project settings
2. Click **"Environment Variables"**
3. Add each key-value pair:
   - `DATABASE_URL`
   - `OPENAI_API_KEY`
   - `DEEPSEEK_API_KEY`
   - `GROQ_API_KEY`
   - `GEMINI_API_KEY`
4. Select environment: **Production**, **Preview**, **Development**
5. Click **"Save"**
6. Redeploy for changes to take effect

### Railway

1. Go to project
2. Click **"Variables"** tab
3. Click **"New Variable"**
4. Add each key-value pair
5. Click **"Deploy"**

---

## 🆘 Troubleshooting

### Database Connection Failed

**Error:** `Can't reach database server`

**Solutions:**
1. Check `DATABASE_URL` format:
   ```
   postgresql://user:password@host:5432/database?sslmode=require
   ```
2. Verify password is correct (no special URL encoding needed for Supabase)
3. Check if `?sslmode=require` is at the end
4. Verify Supabase project is not paused (free tier pauses after 1 week inactivity)

### API Key Invalid

**Error:** `401 Unauthorized` or `Invalid API key`

**Solutions:**
1. Verify API key is correctly copied (no extra spaces)
2. Check if API key has correct prefix:
   - OpenAI: `sk-proj-...`
   - DeepSeek: `sk-...`
   - Groq: `gsk_...`
   - Gemini: `AIza...`
3. Verify API key is active (not revoked)
4. Check if you have sufficient credits/quota

### Environment Variables Not Loading

**Error:** `process.env.OPENAI_API_KEY is undefined`

**Solutions:**
1. Verify `.env` file exists in `nextjs_space/` directory
2. Restart development server:
   ```bash
   yarn dev
   ```
3. Check file name is exactly `.env` (not `.env.txt`)
4. Use `dotenv` package:
   ```javascript
   require('dotenv').config();
   ```

---

## 📚 Additional Resources

- **Supabase Documentation:** [supabase.com/docs](https://supabase.com/docs)
- **Prisma + Supabase Guide:** [prisma.io/docs/guides/database/supabase](https://www.prisma.io/docs/guides/database/supabase)
- **OpenAI Pricing:** [openai.com/pricing](https://openai.com/pricing)
- **Groq Pricing:** [groq.com/pricing](https://groq.com/pricing)
- **Gemini Pricing:** [ai.google.dev/pricing](https://ai.google.dev/pricing)

---

## ✨ Quick Start Summary

```bash
# 1. Copy example file
cp .env.example .env

# 2. Edit .env and add:
#    - DATABASE_URL from Supabase
#    - API keys from respective platforms

# 3. Install dependencies
yarn install

# 4. Generate Prisma Client
npx prisma generate

# 5. Push database schema
npx prisma db push

# 6. Seed database
npx tsx --require dotenv/config scripts/seed_new.ts

# 7. Start development server
yarn dev
```

---

**🎉 You're all set! Your ArchitectPro application is now ready to run with all API keys configured.**
