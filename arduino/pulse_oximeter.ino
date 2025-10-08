#include <DFRobot_MAX30102.h>  // Sensor library
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266mDNS.h>
#include <ESP8266WebServer.h>  // Include the WebServer library
#include <Arduino_JSON.h>      // Use Arduino_JSON
#include "secrets.h"          // Includes WiFi info

DFRobot_MAX30102 particleSensor;  // Declare sensor object

ESP8266WiFiMulti wifiMulti;  // Create an instance of the ESP8266WiFiMulti class, called 'wifiMulti'

ESP8266WebServer server(80);  // Create a webserver object that listens for HTTP request on port 80

void handleRoot();  // function prototypes for HTTP handlers
void handleNotFound();
void handleSensorData();

// sensor values
int32_t SPO2;
int8_t SPO2Valid;
int32_t heartRate;
int8_t heartRateValid;

unsigned long lastRead = 0;
const unsigned long readInterval = 1000; // read sensor every (1) second

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

  // Web server setup
  server.on("/", handleRoot);  // Call the 'handleRoot' function when a client requests URI "/"
  server.on("/sensor", handleSensorData);
  server.onNotFound(handleNotFound);  // When a client requests an unknown URI (i.e. something other than "/"), call function "handleNotFound"

  server.begin();  // Actually start the server
  Serial.println("HTTP server started");
}

void loop(void) {
  // Update sensor reading
  if (millis() - lastRead > readInterval) {
    particleSensor.heartrateAndOxygenSaturation(&SPO2, &SPO2Valid, &heartRate, &heartRateValid);
    lastRead = millis();
  }
  server.handleClient();  // Listen for HTTP requests from clients
}

void handleRoot() {
  server.send(200, "text/plain", "Hello world!");  // Send HTTP status 200 (Ok) and send some text to the browser/client
}

void handleNotFound() {
  server.send(404, "text/plain", "404: Not found");  // Send HTTP status 404 (Not Found) when there's no handler for the URI in the request
}

void handleSensorData() {
  // Build JSON object
  JSONVar json;
  json["heartRate"] = heartRate;
  json["heartRateValid"] = heartRateValid;
  json["SPO2"] = SPO2;
  json["SPO2Valid"] = SPO2Valid;

  // Convert JSONVar to string
  String jsonString = JSON.stringify(json);

  server.send(200, "application/json", jsonString);
}
