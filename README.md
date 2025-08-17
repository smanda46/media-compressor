# Media Compressor

Media Compressor is a clean, modern React Native app for iOS that lets you **pick, compress, and save or upload** photos and videos with ease. It works seamlessly with both **local media** and **iCloud/Files**, generates **video thumbnails**, and saves compressed files directly to your Photos app.

---

## Features
- Pick media from **Photos** or **iCloud/Files**
- Compress both **images** and **videos** without losing quality
- Save compressed media directly to the Photos library
- Optional server upload (fully configurable)
- Correctly handles iCloud `ph://` assets
- Auto-generates thumbnails for videos
- Tested on **iOS Simulator** and real iPhone devices

---

## Installation
```bash
git clone https://github.com/smanda46/media-compressor.git
cd media-compressor
yarn install
npx pod-install
````

---

## iOS Setup

Add these permissions to `ios/MediaCompressor/Info.plist`:

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>We need access to your photos so you can select media.</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>We need access to save compressed media to your library.</string>
```

---

## Run the App

```bash
npx react-native run-ios
```

---

## Notes

* The default upload URL is set to `http://localhost:3000/upload`.
  Update `UPLOAD_URL` in `App.tsx` if you want to send files to a different server.
* Compression is optimized for speed while keeping quality high.
* Works with media stored in **iCloud** as well as on the device.

---

## Tech Stack

* **React Native** for cross-platform UI
* **react-native-image-picker** for media selection
* **react-native-video-compressor** for video compression
* **react-native-image-resizer** for image compression
* **@react-native-camera-roll/camera-roll** for saving media
