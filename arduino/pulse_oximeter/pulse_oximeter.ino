#include <DFRobot_MAX30102.h>  // Sensor library
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266mDNS.h>
#include <Arduino_JSON.h>      // Use Arduino_JSON
#include "secrets.h"           // Includes WiFi info

// Objects
DFRobot_MAX30102 particleSensor;  // Declare sensor object
ESP8266WiFiMulti wifiMulti;       // Create an instance of the ESP8266WiFiMulti class, called 'wifiMulti'
WiFiClient client;  // WiFiClient object

// Sensor values
int32_t SPO2;
int8_t SPO2Valid;
int32_t heartRate;
int8_t heartRateValid;

// Timing
unsigned long lastSensorRead = 0;
const unsigned long sensorInterval = 1000;  // 1s
unsigned long lastBackendPost = 0;
const unsigned long backendInterval = 5000;  // 5s

// Fuction prototypes
void handleRoot();
void handleNotFound();
void handleSensorData();
void sendDataToBackend();

// Setup
void setup(void) {
  Serial.begin(115200);  // Start the Serial communication to send messages to the computer
  delay(10);
  Serial.println('\n');

  //Wifi setup
  wifiMulti.addAP(WIFI_SSID, WIFI_PASS);  // add Wi-Fi networks you want to connect to

  Serial.println("Connecting ...");
  int i = 0;
  while (wifiMulti.run() != WL_CONNECTED) {  // Wait for the Wi-Fi to connect: scan for Wi-Fi networks, and connect to the strongest of the networks above
    delay(250);
    Serial.print('.');
  }
  Serial.println('\n');
  Serial.print("Connected to ");
  Serial.println(WiFi.SSID());  // Tell us what network we're connected to
  Serial.print("IP address:\t");
  Serial.println(WiFi.localIP());  // Send the IP address of the ESP8266 to the computer

  if (MDNS.begin("esp8266")) {  // Start the mDNS responder for esp8266.local
    Serial.println("mDNS responder started");
  } else {
    Serial.println("Error setting up MDNS responder!");
  }

  delay(10);

  //Sensor setup
  while (!particleSensor.begin()) {
    Serial.println("MAX30102 was not found");
    delay(1000);
  }

  particleSensor.sensorConfiguration(/*ledBrightness=*/50, /*sampleAverage=*/SAMPLEAVG_4,
                                     /*ledMode=*/MODE_MULTILED, /*sampleRate=*/SAMPLERATE_100,
                                     /*pulseWidth=*/PULSEWIDTH_411, /*adcRange=*/ADCRANGE_16384);
}

// Main loop
void loop(void) {
  unsigned long now = millis();

  // Update sensor reading
  if (now - lastSensorRead >= sensorInterval) {
    particleSensor.heartrateAndOxygenSaturation(&SPO2, &SPO2Valid, &heartRate, &heartRateValid);
    lastSensorRead = now;
  }

  // POST to backend periodically
  if (now - lastBackendPost >= backendInterval) {
    sendDataToBackend();
    lastBackendPost = now;
  }
}

// POST to Backend
void sendDataToBackend() {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(client, "http://" BACKEND_IP ":3001/api/sensorData");
  http.addHeader("Content-Type", "application/json");

  // Build JSON object
  JSONVar json;
  json["heartRate"] = heartRate;
  json["heartRateValid"] = heartRateValid;
  json["SPO2"] = SPO2;
  json["SPO2Valid"] = SPO2Valid;

  // Convert JSONVar to string
  String payload = JSON.stringify(json);

  int httpResponseCode = http.POST(payload);
  if (httpResponseCode > 0) {
    Serial.println("POST success: " + String(httpResponseCode));
  } else {
    Serial.println("POST failed");
  }

  http.end();
}
