# MenuSathi free deployment

## 1. Create Supabase

1. Create a free project at https://supabase.com/dashboard.
2. Open **SQL Editor**, paste all of `supabase-schema.sql`, and click **Run**.
3. Open **Project Settings → API** and copy:
   - Project URL
   - `service_role` secret key (never put this in GitHub or browser code)

## 2. Get Gemini key

Create or copy a key from https://aistudio.google.com/app/apikey.

## 3. Upload to GitHub

Create a new repository named `menusathi`. Upload this project, but never upload
`.env.local`. The included `.gitignore` protects environment files.

## 4. Deploy with Vercel

1. Sign in at https://vercel.com with GitHub.
2. Click **Add New → Project** and import the `menusathi` repository.
3. Keep Framework Preset as **Next.js**.
4. Add these Environment Variables:

```
GEMINI_API_KEY=your Gemini key
NEXT_PUBLIC_SUPABASE_URL=your Supabase Project URL
SUPABASE_SERVICE_ROLE_KEY=your Supabase service_role key
```

5. Click **Deploy**.

Your free address will resemble `https://menusathi.vercel.app`. Test the complete
flow using **View benchmark result → Publish QR Menu** before testing Gemini.

## Local setup

Copy `.env.example` to `.env.local`, fill in the three values, then run:

```
npm install
npm run dev
```
