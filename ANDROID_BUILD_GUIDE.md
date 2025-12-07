# Android App Build & Play Store Publishing Guide

## 🎯 Overview
Your AwarenessHub website has been wrapped as an Android app using **Capacitor**, making it ready for Google Play Store submission.

---

## 📱 What Was Created

### 1. **Capacitor Configuration** (`capacitor.config.ts`)
- App ID: `com.awarenesshub.app`
- App Name: `AwarenessHub`
- Web directory: `dist` (your built React app)

### 2. **Android Project** (`android/` folder)
- Full native Android project structure
- Ready to open in Android Studio
- Contains all necessary files for Play Store submission

---

## 🚀 Building the App

### **Method 1: Using Package Scripts (Easiest)**

```powershell
# Build web app + sync to Android
pnpm run android:build

# Open in Android Studio
pnpm run android:open
```

### **Method 2: Manual Steps**

```powershell
# 1. Build the React web app
pnpm build

# 2. Sync web assets to Android
npx cap sync android

# 3. Open in Android Studio
npx cap open android
```

---

## 🏗️ Building APK/AAB for Play Store

### **Step 1: Install Android Studio**
1. Download from: https://developer.android.com/studio
2. Install with default settings
3. Open "SDK Manager" and ensure Android SDK 34+ is installed

### **Step 2: Generate Signing Key** (First Time Only)

```powershell
# Navigate to project root
cd C:\Users\Jonirao\Desktop\AwarenessHub-NOV1

# Create keystore directory
mkdir android\keystore

# Generate keystore file
keytool -genkey -v -keystore android\keystore\awarenesshub.keystore -alias awarenesshub -keyalg RSA -keysize 2048 -validity 10000
```

**Save these credentials securely:**
- Keystore password
- Key alias password
- Your name/organization details

### **Step 3: Configure Signing in Android Studio**

1. Open project in Android Studio: `npx cap open android`
2. Go to: **Build > Generate Signed Bundle/APK**
3. Select **Android App Bundle** (AAB) for Play Store
4. Choose your keystore file
5. Enter passwords
6. Select **release** build variant
7. Click **Finish**

### **Step 4: Locate Built Files**

- **APK** (testing): `android/app/build/outputs/apk/release/app-release.apk`
- **AAB** (Play Store): `android/app/build/outputs/bundle/release/app-release.aab`

---

## 🎨 Customizing App Icons & Splash Screen

### **Option 1: Use Android Studio Asset Studio** (Recommended)

1. Open Android Studio
2. Right-click `android/app/src/main/res`
3. Select **New > Image Asset**
4. Choose **Launcher Icons** (Adaptive and Legacy)
5. Upload your logo/icon image (1024x1024 PNG recommended)
6. Adjust foreground/background layers
7. Click **Finish**

### **Option 2: Manual Icon Placement**

Place icons in these folders:
```
android/app/src/main/res/
├── mipmap-mdpi/ic_launcher.png (48x48)
├── mipmap-hdpi/ic_launcher.png (72x72)
├── mipmap-xhdpi/ic_launcher.png (96x96)
├── mipmap-xxhdpi/ic_launcher.png (144x144)
└── mipmap-xxxhdpi/ic_launcher.png (192x192)
```

### **Splash Screen**

Edit: `android/app/src/main/res/values/styles.xml`

---

## 🌐 Internet Permissions (Already Added)

Your app needs internet access for Supabase API calls. This is automatically configured in:
- `android/app/src/main/AndroidManifest.xml`

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

---

## 🛡️ Testing Before Publishing

### **1. Test on Physical Device**

```powershell
# Connect phone via USB (enable USB debugging)
npx cap run android

# Or open in Android Studio and click "Run"
```

### **2. Test APK Installation**

1. Build APK using Android Studio
2. Transfer APK to phone
3. Install and test all features
4. Check Supabase authentication works
5. Verify all pages load correctly

---

## 📤 Publishing to Google Play Store

### **Prerequisites**

1. **Google Play Developer Account** ($25 one-time fee)
   - Sign up: https://play.google.com/console

2. **Required Assets**
   - App Icon: 512x512 PNG
   - Feature Graphic: 1024x500 PNG
   - Screenshots: At least 2 (phone + tablet)
   - Privacy Policy URL

### **Step-by-Step Publishing**

#### **1. Create App in Play Console**

1. Go to: https://play.google.com/console
2. Click **Create App**
3. Fill in:
   - **App Name**: AwarenessHub
   - **Default Language**: English (US)
   - **App/Game**: App
   - **Free/Paid**: Free

#### **2. Complete Store Listing**

- **Short Description** (80 chars max):
  ```
  Learn cybersecurity through interactive challenges and gamified training
  ```

- **Full Description** (4000 chars max):
  ```
  AwarenessHub is an interactive cybersecurity training platform designed to teach 
  security concepts through hands-on challenges, simulations, and real-world scenarios.

  🎯 KEY FEATURES:
  • 12 comprehensive modules covering basic to advanced security topics
  • Interactive challenges with instant feedback
  • Gamified learning with points and badges
  • Real-time leaderboard competition
  • DFIR (Digital Forensics) training
  • Security tools demonstrations
  • Progress tracking and achievements

  📚 TOPICS COVERED:
  • Cryptography & Encryption
  • Password Security
  • Email Phishing Detection
  • Network Security
  • Malware Analysis
  • Firewall Configuration
  • Mobile Security
  • Cloud Security
  • Social Engineering
  • Secure Coding
  • Payment Security
  • Digital Forensics

  Perfect for students, professionals, and anyone interested in learning 
  cybersecurity in an engaging, interactive way.
  ```

- **App Icon**: Upload 512x512 PNG
- **Feature Graphic**: Create 1024x500 PNG banner
- **Screenshots**: Capture from app (2-8 screenshots)

#### **3. Content Rating**

1. Click **Content Rating** in left menu
2. Fill out questionnaire
3. Likely rating: **Everyone** or **Teen** (depending on content)

#### **4. Target Audience & Content**

- **Target Age Group**: Select appropriate age range
- **In-App Purchases**: No
- **Ads**: No (unless you add ads later)

#### **5. Privacy Policy**

**Required!** Host a privacy policy online. Simple template:

```markdown
# Privacy Policy for AwarenessHub

Last updated: December 6, 2025

## Information Collection
AwarenessHub collects:
- Email address (for account creation)
- Usage data (progress, scores)
- Device information (for app functionality)

## Data Usage
Your data is used to:
- Provide app functionality
- Track learning progress
- Display leaderboard rankings

## Data Storage
All data is securely stored using Supabase cloud infrastructure.

## Third-Party Services
- Supabase (database & authentication)

## Contact
Email: [your-email@example.com]
```

Host this at: `yourwebsite.com/privacy-policy` or use GitHub Pages.

#### **6. App Access**

- If login required: Provide test account credentials
- If public: Select "All functionality available without restrictions"

#### **7. Data Safety**

Fill out data collection practices:
- Email addresses: Yes
- User IDs: Yes
- App activity: Yes
- Data encryption: Yes
- Data deletion: Allow users to request deletion

#### **8. Upload App Bundle**

1. Go to **Production > Create New Release**
2. Upload `app-release.aab` file
3. Add release notes:
   ```
   Initial release
   - 12 cybersecurity training modules
   - Interactive challenges
   - Gamified learning experience
   - Leaderboard & badges
   ```

#### **9. Review & Publish**

1. Review all sections (green checkmarks required)
2. Click **Send for Review**
3. Wait 1-7 days for Google review
4. Once approved, app goes live!

---

## 🔄 Updating the App

### **When You Update Your Website**

```powershell
# 1. Build updated web app
pnpm build

# 2. Sync to Android
npx cap sync android

# 3. Increment version in android/app/build.gradle
# Change: versionCode 2, versionName "1.1.0"

# 4. Build new AAB
# Open Android Studio > Build > Generate Signed Bundle

# 5. Upload to Play Console
# Production > Create New Release > Upload AAB
```

---

## 🐛 Common Issues & Fixes

### **Issue: "Cleartext HTTP traffic not permitted"**
**Fix**: Ensure all API calls use HTTPS (Supabase already does this)

### **Issue: "App crashes on startup"**
**Fix**: 
1. Check `AndroidManifest.xml` has `INTERNET` permission
2. Verify `dist/` folder has built files
3. Run `npx cap sync android`

### **Issue: "White screen on launch"**
**Fix**: 
1. Clear app cache
2. Rebuild: `pnpm build && npx cap sync android`
3. Check browser console in Chrome DevTools (for WebView debugging)

### **Issue: "Build failed in Android Studio"**
**Fix**:
1. Update Gradle: Change version in `android/gradle/wrapper/gradle-wrapper.properties`
2. Sync project: File > Sync Project with Gradle Files
3. Clean build: Build > Clean Project

---

## 📊 App Performance Optimization

### **Reduce APK Size**

In `android/app/build.gradle`, add:

```gradle
android {
    buildTypes {
        release {
            shrinkResources true
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt')
        }
    }
    
    // Enable app bundle compression
    bundle {
        language {
            enableSplit = true
        }
        density {
            enableSplit = true
        }
        abi {
            enableSplit = true
        }
    }
}
```

### **Enable Offline Mode** (Optional)

Install Capacitor plugins:
```powershell
pnpm add @capacitor/network @capacitor/storage
```

---

## 🎓 Resources

- **Capacitor Docs**: https://capacitorjs.com/docs
- **Android Developer Guide**: https://developer.android.com
- **Play Console Help**: https://support.google.com/googleplay/android-developer
- **App Signing**: https://developer.android.com/studio/publish/app-signing

---

## 🆘 Support

If you encounter issues:
1. Check `npx cap doctor` for configuration problems
2. Review Android Studio Logcat for error messages
3. Consult Capacitor docs: https://capacitorjs.com/docs/android
4. Stack Overflow tag: `capacitor`

---

## ✅ Checklist Before Publishing

- [ ] Tested app on physical Android device
- [ ] All features work (login, challenges, leaderboard)
- [ ] App icon looks good on home screen
- [ ] Privacy policy hosted and linked
- [ ] Screenshots captured (at least 2)
- [ ] Feature graphic created (1024x500)
- [ ] Store listing description complete
- [ ] Content rating questionnaire filled
- [ ] App signed with production keystore
- [ ] AAB file built successfully
- [ ] Version number set correctly

---

**Good luck with your Play Store launch! 🚀**
