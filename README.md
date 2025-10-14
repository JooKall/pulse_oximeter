# Pulse Oximeter Project (ESP8266 + React + Node.js/MongoDB)

This project combines an **ESP8266 microcontroller with MAX30102 sensor**, a **Node.js backend with MongoDB** and a **React frontend** to measure, store and display heart rate and SpO2 levels.

---

## How it works

1. **ESP8266**
   - Connects to 2.4 ghz Wi-Fi.
   - Reads values from the MAX30102 pulse oximeter sensor (heart rate and SpO2).
   - Periodically **POSTs sensor data** to the backend API (`/api/sensor`).
   - Example JSON payload sent to backend:
     ```json
     {
       "heartRate": 72,
       "heartRateValid": 1,
       "SPO2": 98,
       "SPO2Valid": 1
     }
     ```

2. **Backend (Node.js + Express + MongoDB)**
   - Receives sensor data via POST requests.
   - Saves data to MongoDB with timestamps.
   - Provides endpoints to fetch the latest data:
     - `GET /api/sensor/latest` → latest sensor reading
     - `GET /api/sensor` → last 10 readings

3. **React frontend**
   - Fetches JSON data from backend periodically.
   - Displays:
     - Heart Rate (bpm)
     - SpO2 (%)
   - Example UI:
     ```
     Heart Rate: 72 (valid: 1)
     SpO2: 98 (valid: 1)
     ```

---

## How to run

### Backend
1. Navigate to the backend folder (e.g., `/backend`).
2. Install dependencies:
```bash
npm install
```
3. Configure environment variables in .env:
```env
PORT=3001
MONGODB_URI=<your_mongodb_connection_string>
```
4. Start the backend server:
```bash
npm run dev
```

### ESP8266 (ArduinoIDE)
1. Open the Arduino sketch from `/arduino/pulse_oximeter/pulse_oximeter.ino` in **Arduino IDE**.
2. Configure your **2.4 ghz Wi-Fi SSID (WIFI_SSID), password (WIFI_PASS) and backend IP (BACKEND_IP)** in `secrets.h`.
3. Upload the code to ESP8266.
4. Open Serial Monitor to see status messages including connection and POST success.
5. The ESP will now POST sensor data automatically to the backend.

### React frontend
1. Go to /frontend folder.
2. Install dependencies:
```bash
npm install
```
3. Start development server:
```bash
npm run dev
```
4. Access the frontend in your browser (http://localhost:5173 if using Vite default).

---
## Using the Sensor

1. Place your finger gently on the MAX30102 sensor.
2. Observe the frontend UI updating with heart rate and SpO2 values from the backend.