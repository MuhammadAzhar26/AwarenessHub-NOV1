# 📱 AwarenessHub Android App

Your cybersecurity training website is now an Android app ready for Google Play Store!

## ✅ What's Included

- ✨ Full Android app wrapping your React website
- 📦 Ready-to-build APK/AAB files
- 🎨 Customizable app icon and splash screen
- 🔒 Secure HTTPS configuration
- 📱 Optimized for mobile devices

## 🚀 Quick Commands

| Command | Description |
|---------|-------------|
| `pnpm run android:build` | Build web app + sync to Android |
| `pnpm run android:open` | Open project in Android Studio |
| `pnpm run android:run` | Run on connected device/emulator |
| `pnpm run android:sync` | Sync web assets to Android |

## 📚 Documentation

- **Quick Start:** See [ANDROID_QUICK_START.md](./ANDROID_QUICK_START.md)
- **Full Guide:** See [ANDROID_BUILD_GUIDE.md](./ANDROID_BUILD_GUIDE.md)

## 🏁 Next Steps

### 1. Install Android Studio
Download from: https://developer.android.com/studio

### 2. Test the App
```powershell
pnpm run android:open
```
Click the ▶️ button to run on emulator or device.

### 3. Build for Testing (APK)
In Android Studio:
- **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**

### 4. Customize App Icon
1. Right-click `app/res` in Android Studio
2. **New** → **Image Asset**
3. Upload your icon (1024x1024 PNG)

### 5. Publish to Play Store
1. Create keystore for signing
2. Build signed AAB
3. Upload to Google Play Console

**Detailed instructions in:** [ANDROID_BUILD_GUIDE.md](./ANDROID_BUILD_GUIDE.md)

## 📋 Requirements

- ✅ Node.js 18+
- ✅ pnpm (already installed)
- ⬜ Android Studio
- ⬜ JDK 17+ (comes with Android Studio)
- ⬜ Android SDK 34+ (install via Android Studio)

## 🛠️ Project Structure

```
AwarenessHub-NOV1/
├── android/                    # Android native project
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── assets/        # Your web app files
│   │   │   ├── res/           # App icons & resources
│   │   │   └── AndroidManifest.xml
│   │   └── build.gradle       # App configuration
│   └── keystore/              # Signing keys (keep private!)
├── capacitor.config.ts        # Capacitor configuration
├── ANDROID_BUILD_GUIDE.md     # Detailed guide
└── ANDROID_QUICK_START.md     # Quick reference
```

## 🎯 App Details

- **App Name:** AwarenessHub
- **Package ID:** com.awarenesshub.app
- **Platform:** Android 7.0+ (API 24+)
- **Type:** Hybrid (Web + Native)

## 🔒 Security Notes

- ⚠️ **Never commit keystore files** to git
- ⚠️ **Save keystore passwords securely**
- ⚠️ **Backup keystore file** - you can't recover it!

## 📱 Testing Checklist

Before publishing, test:
- [ ] App installs successfully
- [ ] Login/authentication works
- [ ] All modules load correctly
- [ ] Challenges function properly
- [ ] Leaderboard displays
- [ ] Images and assets load
- [ ] Navigation works smoothly
- [ ] No white screens or crashes

## 🆘 Troubleshooting

### White screen on launch
```powershell
pnpm build && npx cap sync android
```

### Build errors
1. Sync Gradle files in Android Studio
2. Clean & Rebuild project
3. Check Java/SDK versions

### App crashes
Check Android Studio Logcat for error messages.

## 📞 Support Resources

- Capacitor Docs: https://capacitorjs.com/docs
- Android Developer: https://developer.android.com
- Play Console: https://play.google.com/console

---

**Ready to publish? See [ANDROID_BUILD_GUIDE.md](./ANDROID_BUILD_GUIDE.md) for step-by-step instructions!**
