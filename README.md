# Pulse Oximeter Project (ESP8266 + React)

This project combines an **ESP8266 microcontroller with MAX30102 sensor** and a **React frontend** to measure and display heart rate and SpO2 levels.

---

## How it works

1. **ESP8266 as a server**
   - The ESP8266 connects to Wi-Fi.
   - It reads values from the MAX30102 pulse oximeter sensor (heart rate and SpO2).
   - It runs a simple HTTP server on port `80`.
   - When a client requests `/sensor`, the ESP8266 responds with live sensor data in JSON format, e.g.:
     ```json
     {
       "heartRate": 72,
       "heartRateValid": 1,
       "SPO2": 98,
       "SPO2Valid": 1
     }
     ```

2. **React frontend**
   - The React app fetches the JSON data from the ESP8266 server periodically.
   - The values are displayed on a web page:
     - Heart Rate (bpm)
     - SpO2 (%)
   - Example UI:
     ```
     Heart Rate: 72 (valid: 1)
     SpO2: 98 (valid: 1)
     ```

---

## How to run

### ESP8266 (Arduino)
1. Open the Arduino sketch from `/arduino` folder in **Arduino IDE**.
2. Configure your Wi-Fi SSID and password in `secrets.h`.
3. Upload the code to ESP8266.
4. Open Serial Monitor → you will see the ESP8266 IP address (e.g. `192.168.1.xxx`).
5. Test in browser:  http://<ESP_IP>/sensor


### React frontend
1. Go to `/frontend` folder.
2. Install dependencies:
```bash
npm install
```
Start development server:
```bash
npm run dev
```
Access the frontend in your browser

