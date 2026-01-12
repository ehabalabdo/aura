<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Aura AI Fashion Assistant

Your personal AI-powered fashion stylist and designer.

View your app in AI Studio: https://ai.studio/apps/drive/1I8M7ON9ZLTrLg0d44fWL2eUt8wUX87X2

## Features

- 🎨 **AI Outfit Stylist** - Digitize your wardrobe and get AI-powered styling recommendations
- 🖌️ **AI Fashion Designer** - Co-create dream garments with AI
- 🛍️ **Artisan Boutique** - Shop exclusive handcrafted fashion pieces
- 🌐 **Bilingual** - Full support for English and Arabic (RTL layout)
- 💾 **Local Storage** - Your data is saved locally in your browser

## Run Locally

**Prerequisites:**  
- Node.js (v16 or higher)
- npm or yarn

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Add your Gemini API key from [Google AI Studio](https://ai.google.dev):
     ```
     VITE_GEMINI_API_KEY=your_api_key_here
     ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

4. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/        # React components
│   ├── Home.tsx
│   ├── Wardrobe.tsx
│   ├── Atelier.tsx
│   ├── Boutique.tsx
│   ├── Dashboard.tsx
│   ├── AdminPortal.tsx
│   ├── Navbar.tsx
│   ├── AuthModal.tsx
│   └── CartModal.tsx
├── App.tsx           # Main app component
├── types.ts          # TypeScript type definitions
├── geminiService.ts  # Gemini AI integration
├── constants.tsx     # App constants
└── vite.config.ts    # Vite configuration
```

## Security Notes

- ⚠️ Never commit your `.env` file to version control
- API keys should always be kept private
- File uploads are limited to 5MB per file
- Supported image formats: JPEG, PNG, WebP, GIF

## Recent Improvements

- ✅ Fixed Vite environment variable configuration (`VITE_GEMINI_API_KEY`)
- ✅ Enhanced error handling with user-friendly messages
- ✅ Added input validation for image uploads (size & format checks)
- ✅ Improved error logging for debugging
- ✅ Created `.env.example` for easy project setup
