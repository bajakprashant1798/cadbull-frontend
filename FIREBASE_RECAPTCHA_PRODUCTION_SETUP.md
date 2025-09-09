# Firebase reCAPTCHA Enterprise Production Setup

## Problem
Getting `auth/invalid-recaptcha-token` error in production due to:
1. Domain not authorized for reCAPTCHA Enterprise
2. reCAPTCHA configuration mismatch between development and production

## Solution Steps

### 1. Firebase Console Configuration
Go to [Firebase Console](https://console.firebase.google.com/) → Your Project → Authentication → Settings → Phone

#### Add Authorized Domains:
- `cadbull.com`
- `www.cadbull.com`
- `beta.cadbull.com` (if using staging)

### 2. Google Cloud Console - reCAPTCHA Enterprise
Go to [Google Cloud Console](https://console.cloud.google.com/) → Security → reCAPTCHA Enterprise

#### Create/Update reCAPTCHA Site Key:
1. Select your project: `cadbull-8e9a8`
2. Go to reCAPTCHA Enterprise
3. Create or edit existing site key
4. Add domains:
   - `cadbull.com`
   - `www.cadbull.com`
   - `beta.cadbull.com`
   - `localhost` (for development)

### 3. Environment Variables (Production)
Make sure production environment has:
```env
NODE_ENV=production
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB1aPF5DktAc6yojjYODVWA7jVUtf-UqTU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cadbull-8e9a8.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cadbull-8e9a8
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LfVsXkrAAAAAGkPvANAmHtu2dAEowT_Mq6W1a1H
```

### 4. Domain Verification
Ensure your production domain is verified in:
- Firebase Console → Project Settings → General → Authorized domains
- Google Cloud Console → reCAPTCHA Enterprise → Site settings

### 5. Testing Steps
1. Deploy the updated code to production
2. Test phone registration from production domain
3. Check browser console for detailed error messages
4. Verify reCAPTCHA widget loads and functions

## Quick Fix Commands
If still getting errors, try:
1. Clear browser cache and cookies
2. Test from incognito mode
3. Check network tab for blocked requests
4. Verify CSP headers allow reCAPTCHA scripts

## Fallback Solution
If domain issues persist, temporarily use:
- Test phone numbers in Firebase Console
- Or implement email-based registration as backup
