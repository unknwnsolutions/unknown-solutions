# Firebase Setup Guide for Unknown Solutions

Follow these steps to configure Firebase for your project.

---

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** (or **Create a project**)
3. Enter project name: `unknown-solutions` (or any name you prefer)
4. Click **Continue**
5. **Disable Google Analytics** (optional, not needed right now)
6. Click **Create project**
7. Wait for project creation, then click **Continue**

---

## Step 2: Register Your Web App

1. In Firebase Console, click the **Web** icon (`</>`) under "Get started by adding Firebase to your app"
2. Enter app nickname: `Unknown Solutions Web`
3. **Do NOT** check "Also set up Firebase Hosting" (we use GitHub Pages)
4. Click **Register app**
5. You'll see a `firebaseConfig` object like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```
6. **Copy this config** — you'll need it in Step 5
7. Click **Continue to console**

---

## Step 3: Enable Email/Password Authentication

1. In Firebase Console, click **Authentication** in the left sidebar
2. Click **Get started**
3. Click the **Email/Password** sign-in method
4. Toggle **Enable** to ON
5. Click **Save**

---

## Step 4: Create Firestore Database

1. In Firebase Console, click **Firestore Database** in the left sidebar
2. Click **Create database**
3. Select **Start in test mode** (we'll update rules later)
4. Choose a location close to your users (e.g., `us-central`, `europe-west`, `asia-southeast`)
5. Click **Enable**
6. Wait for database creation (~1-2 minutes)

---

## Step 5: Update Your Firebase Config

1. Open `js/firebase.js` in your code editor
2. Replace the placeholder config at the top with your actual Firebase config from Step 2:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_ACTUAL_API_KEY",
     authDomain: "your-project-id.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project-id.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```
3. Save the file

---

## Step 6: Update Firestore Security Rules

For production, you need to secure your Firestore database. Here are the recommended rules:

1. In Firebase Console, go to **Firestore Database** → **Rules** tab
2. Replace the default rules with:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only read/write their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // No other collections are publicly accessible
       match /{document=**} {
         allow read, write: if false;
       }
     }
   }
   ```
3. Click **Publish**

---

## Step 7: Test Your Setup

### Local Testing
Since Firebase uses ES modules, you need to serve files over HTTP (not `file://`):

1. Install a simple HTTP server (if you don't have one):
   ```bash
   npm install -g serve
   ```
2. Start the server in your project directory:
   ```bash
   serve .
   ```
3. Open `http://localhost:3000` in your browser
4. Try:
   - Register a new account
   - Login with that account
   - Check if dashboard loads
   - Mark a module as complete

### Push to GitHub Pages
1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Integrate Firebase authentication"
   git push origin main
   ```
2. Wait 1-2 minutes for GitHub Pages to deploy
3. Visit `https://unknwnsolutions.github.io/unknown-solutions/`
4. Test registration, login, and dashboard

---

## Step 8: Verify in Firebase Console

After testing:
1. Go to **Authentication** → **Users** — you should see your test user
2. Go to **Firestore Database** → **Data** — you should see a `users` collection with your user's document
3. Check the document structure:
   ```
   users/{uid}/
     name: "Test User"
     email: "test@example.com"
     createdAt: (timestamp)
     progress:
       modulesCompleted: []
       resourcesDownloaded: []
   ```

---

## Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"
- Your `apiKey` in `js/firebase.js` is incorrect. Double-check the config.

### "Firebase: Error (auth/email-already-in-use)"
- The email you're trying to register is already in use. Try a different email or login instead.

### "Firebase: Error (auth/weak-password)"
- Password must be at least 6 characters.

### "Firebase: Error (auth/unauthorized-domain)"
- You need to add your GitHub Pages domain to Firebase:
  1. Go to **Authentication** → **Settings** → **Authorized domains**
  2. Click **Add domain**
  3. Add: `unknwnsolutions.github.io`
  4. Click **Add**

### Dashboard redirects to login immediately
- You're not authenticated. Try logging in again.
- Check browser console for Firebase errors.

### Firestore permission denied
- Your security rules are too strict. Make sure you're using the rules from Step 6.
- Or temporarily switch back to test mode while debugging.

---

## What Happens Next

Once Firebase is configured:
- ✅ Users can register accounts
- ✅ Users can login/logout
- ✅ User progress is saved to Firestore
- ✅ Dashboard shows personalized data
- ✅ No server needed — everything runs client-side
- ✅ Free forever (up to 50K reads/day, 20K writes/day)

---

## Future Enhancements (Optional)

- **Password reset emails**: Enable in Firebase Auth settings
- **Email verification**: Require email confirmation on registration
- **Google Sign-In**: Add one-click login with Google accounts
- **Firebase Analytics**: Track user behavior and page views
- **Firebase Hosting**: Deploy directly from Firebase instead of GitHub Pages (optional)
