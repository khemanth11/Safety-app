# 🛡️ GHOST PROTOCOL: Premium Personal Safety Suite
> **Personal Security, Reimagined.** *Investment-Grade Stealth & Protection.*

[![Version](https://img.shields.io/badge/Version-2.1.0-4F46E5.svg)](https://github.com/Hemanth1234554/Safety-app)
[![License: ISC](https://img.shields.io/badge/License-ISC-00D1FF.svg)](https://opensource.org/licenses/ISC)
[![Framework: React](https://img.shields.io/badge/Framework-React-blue.svg)](https://reactjs.org/)

**Ghost Protocol** is a state-of-the-art personal safety application engineered for the modern "Security Professional" aesthetic. Disguised as a high-fidelity calculator, it encapsulates a powerful tactical suite designed to provide immediate protection, silent alerts, and real-time surveillance during critical situations.

🌐 **Live Secure Link:** [https://safety-app-xi.vercel.app/](https://safety-app-xi.vercel.app/)

---

## ✨ The Tactical Suite

### 🕵️‍♂️ Stealth Disguise (Calculator Core)
A pixel-perfect, fully functional calculator interface that serves as the "disguise layer." Strategic PIN entry triggers the transition from utility to security.

### 🤖 Sentinel AI (Voice Trigger)
Utilizes **TensorFlow.js** for real-time auditory pattern recognition. Programmed to detect emergency keywords (e.g., "STOP") even when the phone is not in active use, automatically triggering silent SOS alerts.

### 👁️ Ghost Eye (Live Broadcast)
High-performance P2P video streaming using **WebRTC** and **Socket.io**. Instantly broadcast live encrypted feeds from your device to your trusted network.

### 📍 Tactical Dashboard
A glassmorphism-based "Command Center" featuring:
- **Premium SOS Button**: Immediate silent or loud alert trigger with haptic feedback.
- **Real-Time Telemetry**: Live GPS tracking and system status monitoring.
- **Identity Settings**: Encrypted emergency contact management with quick-add functionality.

### 📞 Phantom Call (Extraction Strategy)
A high-fidelity modern smartphone call simulation. Allows for a professional "exit strategy" from uncomfortable or dangerous social situations with a single tap.

---

## 🛰️ Tactical Local Testing (Cross-Device)
To test the "Ghost Eye" live stream and location alerts on multiple devices (Mobile + PC) simultaneously while running locally:

1. **Find your Local IP**: Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux) to find your IPv4 address (e.g., `192.168.1.5`).
2. **Configure Client**: Create a `.env` file in the `client` directory:
   ```env
   REACT_APP_BASE_URL=http://your_local_ip:3000
   ```
3. **Connectivity**: Ensure all devices are on the **same Wi-Fi network**.
4. **Access**: Open the app on your mobile browser using `http://your_local_ip:3000`. 
5. **Live Tunneling**: For external testing without Wi-Fi parity, we recommend [ngrok](https://ngrok.com/): `ngrok http 3000`.

---

## 🎨 Engineering Stack

### Frontend Architecture
- **Engine:** [React.js](https://reactjs.org/) with Hooks & Functional Components.
- **Design System:** Custom **"Ghost Protocol"** CSS Framework (Glassmorphism, CSS Variables, Inter Typography).
- **Communication:** [Socket.IO Client](https://socket.io/) & [WebRTC](https://webrtc.org/).
- **Intelligence:** [@tensorflow/tfjs-models/speech-commands](https://www.tensorflow.org/js).
- **Mobile Layer:** [Capacitor](https://capacitorjs.com/) (Native Android/iOS packaging).

### Backend Infrastructure
- **Runtime:** [Node.js](https://nodejs.org/) & [Express.js](https://express.js.com/).
- **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose ODM).
- **Security:** [JWT](https://jwt.io/) (Stateless Authentication) & Bcrypt (Password Hashing).
- **Messaging:** [Nodemailer](https://nodemailer.com/).

---

## 🚀 Deployment & Operations

### Prerequisites
- Node.js v18.x+
- MongoDB instance (Local or Atlas)
- Secure Network for WebRTC (STUN/TURN)

### 1. Repository Initialization
```bash
git clone https://github.com/Hemanth1234554/Safety-app.git
cd safety-app
```

### 2. Backend Orchestration
Configure your `.env` in the `server` directory and ignite the core:
```bash
cd server
npm install
npm run dev
```

### 3. Frontend Activation
```bash
cd client
npm install
npm start
```

### 📱 Mobile Synchronization (Capacitor)
> [!IMPORTANT]
> **New Build Required**: Because we have completely overhauled the UI, you **MUST** run a fresh build to synchronize the assets and avoid 404 errors.

Deploy to Android/iOS with native performance:
```bash
npm run build
npx cap sync
npx cap open android
```

---

## 📄 Corporate Intelligence
- **Developer:** [Hemanth](https://github.com/Hemanth1234554)
- **Status:** Production Ready (v2.1)
- **Design Benchmark:** Professional Tier / Investment Quality

*Protected under GHOST PROTOCOL Security Standards.*
