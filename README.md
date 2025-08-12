````markdown
# 📱 MediaZip

MediaZip is a React Native app for picking, compressing, and saving/uploading photos & videos from iOS devices.  
It supports **iCloud files**, handles **video thumbnails**, and saves compressed media to the **Photos app**.

---

## 🚀 Features
- 🎯 Pick media from **Photos** or **iCloud/Files**
- 📦 Compress **images** and **videos**
- 💾 Save compressed media to Photos
- ☁️ Upload to a server (configurable)
- ☑️ Handles iCloud `ph://` assets correctly
- 📸 Generates thumbnails for videos

---

## 📦 Installation
```bash
git clone https://github.com/srihas-eycrowd/media-compression-app.git
cd media-compression-app
yarn install
npx pod-install
````

---

## ⚙️ iOS Setup

Add these permissions to `ios/MediaZip/Info.plist`:

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>We need access to your photos to select media.</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>We need access to save compressed media to your library.</string>
```

---

## ▶️ Run the App

```bash
npx react-native run-ios
```

---

## 📌 Notes

* The default upload URL is `http://localhost:3000/upload`.
  Change `UPLOAD_URL` in `App.tsx` for production.
* Tested on iOS Simulator & iPhone with iCloud media.