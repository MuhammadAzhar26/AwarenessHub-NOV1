# 🚀 Quick Start - Android App

## Build & Test Your App

### 1️⃣ Build the Android App
```powershell
pnpm run android:build
```
This command:
- Builds your React website (`pnpm build`)
- Syncs files to Android project (`npx cap sync android`)

### 2️⃣ Open in Android Studio
```powershell
pnpm run android:open
```
This opens the Android project in Android Studio.

### 3️⃣ Run on Device/Emulator
```powershell
pnpm run android:run
```
Or click the green ▶️ play button in Android Studio.

---

## 📦 Build APK for Testing

**In Android Studio:**
1. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for build to complete
3. Click **locate** to find APK file
4. Transfer to phone and install

**APK Location:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🏪 Build for Play Store

### Step 1: Generate Signing Key (One-time)
```powershell
mkdir android\keystore
keytool -genkey -v -keystore android\keystore\awarenesshub.keystore -alias awarenesshub -keyalg RSA -keysize 2048 -validity 10000
```

**⚠️ IMPORTANT:** Save passwords securely! You'll need them for every release.

### Step 2: Build Signed AAB

**In Android Studio:**
1. **Build** → **Generate Signed Bundle / APK**
2. Select **Android App Bundle (AAB)**
3. Click **Next**
4. Choose your keystore file
5. Enter passwords
6. Select **release** build variant
7. Click **Finish**

**AAB Location:**
```
android/app/build/outputs/bundle/release/app-release.aab
```

### Step 3: Upload to Play Store
1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app (or select existing)
3. Navigate to **Production** → **Create New Release**
4. Upload `app-release.aab`
5. Add release notes
6. Click **Review** → **Start Rollout to Production**

---

## 🎨 Customize App Icon

### Easy Way (Android Studio):
1. Open Android Studio
2. Right-click **app/src/main/res**
3. Select **New** → **Image Asset**
4. Upload your icon (1024x1024 PNG)
5. Click **Next** → **Finish**

### Manual Way:
Replace these files with your icon:
```
android/app/src/main/res/
├── mipmap-mdpi/ic_launcher.png (48x48)
├── mipmap-hdpi/ic_launcher.png (72x72)
├── mipmap-xhdpi/ic_launcher.png (96x96)
├── mipmap-xxhdpi/ic_launcher.png (144x144)
└── mipmap-xxxhdpi/ic_launcher.png (192x192)
```

---

## 🔄 Update App After Website Changes

```powershell
# 1. Make changes to your website code
# 2. Rebuild and sync
pnpm run android:build

# 3. Open Android Studio
pnpm run android:open

# 4. In Android Studio, update version:
# Open: android/app/build.gradle
# Change: versionCode and versionName

# 5. Build new AAB and upload to Play Store
```

---

## 🐛 Troubleshooting

### App shows white screen
```powershell
pnpm build
npx cap sync android
# Then rebuild in Android Studio
```

### "No JDK found" error
Install Android Studio first: https://developer.android.com/studio

### Build failed in Android Studio
1. **File** → **Sync Project with Gradle Files**
2. **Build** → **Clean Project**
3. **Build** → **Rebuild Project**

---

## 📋 Pre-Publishing Checklist

- [ ] App works on physical Android device
- [ ] Login/authentication functions properly
- [ ] All pages load correctly
- [ ] Custom app icon added
- [ ] Version number incremented
- [ ] Privacy policy URL ready
- [ ] Screenshots captured (at least 2)
- [ ] App signed with production keystore

---

## 🔗 Important Links

- **Full Guide:** See `ANDROID_BUILD_GUIDE.md`
- **Capacitor Docs:** https://capacitorjs.com/docs
- **Play Console:** https://play.google.com/console
- **Android Studio:** https://developer.android.com/studio

---

## 💡 Tips

1. **Always test on real device** before publishing
2. **Keep keystore file safe** - you can't publish updates without it!
3. **Use AAB format** for Play Store (smaller download size)
4. **Version numbers** must increase with each update
5. **Privacy policy is required** by Google

---

**Need help?** Check the full guide in `ANDROID_BUILD_GUIDE.md`
