# Create .env.local File

The Firebase API is returning 500 errors because the environment variables are not set up.

**Instructions:**

1. Create a file named `.env.local` in the project root (same directory as package.json)
2. Add the following content:

```
NEXT_PUBLIC_FIREBASE_PROJECT_ID=life-in-rhythm-21a42
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBSjvBBFihpAYSE09Xsv3X4LbbFv_xyt1s
```

3. Restart the development server (`npm run dev`)

This will fix the 500 Internal Server Error and allow the Firebase leaderboard to work properly.
