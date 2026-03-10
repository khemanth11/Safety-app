# Safety App 🛡️

A comprehensive personal safety application featuring real-time location tracking, voice-activated SOS alerts, and emergency contact notifications. Built with a React/Capacitor mobile client and a Node.js/Express backend.

## 🚀 Features

- **Voice-Activated SOS:** Utilizes TensorFlow.js Speech Commands to trigger alerts hands-free (e.g., detecting "help" or specific keywords).
- **Real-Time Location Tracking:** Powered by Socket.IO for live location sharing with emergency contacts.
- **Automated Alerts:** Instant email notifications via SendGrid and Nodemailer when an emergency is triggered.
- **User Authentication:** Secure user registration, login, and token-based (JWT) authentication.
- **Mobile-Ready:** Built with web technologies (React) and packaged as a native mobile application using Capacitor.

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** [React](https://reactjs.org/)
- **Mobile Packaging:** [Capacitor](https://capacitorjs.com/)
- **AI/Machine Learning:** [TensorFlow.js](https://www.tensorflow.org/js) (`@tensorflow-models/speech-commands`)
- **Real-Time Communication:** [Socket.IO Client](https://socket.io/)
- **HTTP/API Client:** [Axios](https://axios-http.com/)

### Backend (Server)
- **Runtime Environment:** [Node.js](https://nodejs.org/)
- **API Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (with Mongoose)
- **Real-Time Communication:** [Socket.IO](https://socket.io/)
- **Email Delivery:** [Nodemailer](https://nodemailer.com/), [SendGrid](https://sendgrid.com/)
- **Security & Auth:** [JWT](https://jwt.io/), bcryptjs

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local server or MongoDB Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/Hemanth1234554/Safety-app.git
cd safety-app
```

### 2. Backend Setup
Navigate into the `server` directory and install dependencies:
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key
```
Start the development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the `client` directory, and install dependencies:
```bash
cd client
npm install
```
Start the React development server:
```bash
npm start
```
The client app should now fall back to the live server or `localhost` depending on your active `.env` configuration.

## 📱 Mobile Build
To build the Android app via Capacitor, run the following commands from inside the `client` folder:
```bash
npm run build
npx cap sync android
npx cap open android
```
*(Requires Android Studio installed).*

## 📄 License
This project is licensed under the ISC License.
