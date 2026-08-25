# MenuSathi

Photo-to-digital-menu MVP for Nepalese restaurants, cafes, and chiya hubs.

## Run locally

1. Install Node.js 22 or newer.
2. Open Terminal in this project folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

5. Add your Google AI Studio API key to `.env.local`:

   ```text
   GEMINI_API_KEY=your_real_key
   ```

6. Start the app:

   ```bash
   npm run dev
   ```

7. Open the local address shown in Terminal, normally `http://localhost:3000`.

## Model fallback

The extraction endpoint tries these models in order:

1. `gemini-3.7-flash`
2. `gemini-3-flash-preview`
3. `gemini-3.6-flash`

Fallback occurs for quota, temporary availability, and server errors. Menu data must be verified by the restaurant owner before publishing.

## Security

Never commit `.env.local` or expose the Gemini API key in browser-side code.
