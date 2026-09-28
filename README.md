# 🚨 ResQGrid — Early Warning & Smart Resource Allocation System

**ResQGrid** is a disaster management and emergency response platform designed to help authorities **identify high-risk zones, assess disaster risk, prioritize emergency resources, and support citizens with location-based risk information**.

The system focuses on **Flood, Heavy Rain, and Earthquake** scenarios and combines a citizen-facing risk assessment interface with an authority-side emergency command center.

---

## 🎯 Problem Statement

### PSN003 — Early Warning & Smart Resource Allocation System

During disasters, emergency authorities need to quickly identify high-risk areas and efficiently allocate limited resources such as:

* 🚑 Ambulances
* 🚒 Rescue Teams
* 🏠 Emergency Shelters
* 📦 Relief Kits

ResQGrid provides a centralized platform that converts disaster-related data into **risk scores, priority zones, and actionable resource recommendations**.

---

## 💡 Proposed Solution

ResQGrid consists of two main interfaces:

### 👤 Citizen — Check My Risk

Citizens can:

* Select a location on the Chennai map
* Select a disaster type
* Check the calculated risk score
* View the risk level
* See population exposure
* View road/accessibility information
* Find the nearest shelter
* View recommended emergency resources
* Receive a response recommendation

### 🖥️ Command Center

Emergency authorities can:

* Monitor active disaster alerts
* Identify critical zones
* View priority zones
* Monitor risk scores
* Simulate different disaster scenarios
* View resource availability
* Identify required resources
* Generate smart allocation recommendations

---

## 🌊 Supported Disaster Scenarios

ResQGrid currently supports:

| Disaster       | Main Risk Factors                                                       |
| -------------- | ----------------------------------------------------------------------- |
| 🌊 Flood       | Rainfall, water level, population, accessibility, previous flood impact |
| 🌧️ Heavy Rain | Rainfall, population, accessibility                                     |
| 🌎 Earthquake  | Magnitude, distance, population, building vulnerability, accessibility  |

The system calculates a risk score based on the relevant factors and assigns an appropriate risk level.

---

## ⚙️ How ResQGrid Works

```text
                 RESQGRID
                     │
          ┌──────────┴──────────┐
          │                     │
      CITIZEN              COMMAND CENTER
          │                     │
   Select Location        Monitor Zones
          │               View Risk Scores
   Select Disaster        Run Simulation
          │               Check Resources
     Check Risk           Smart Allocation
          │                     │
          └──────────┬──────────┘
                     │
              FLASK REST API
                     │
              Risk Engine
                     │
          Resource Optimizer
                     │
                SQLite DB
```

---

## 🧠 Risk Assessment Engine

The risk engine evaluates different factors depending on the selected disaster.

### Flood Risk

```text
Rainfall
   +
Water Level
   +
Population Exposure
   +
Accessibility
   +
Previous Flood Impact
   ↓
Risk Score
   ↓
Risk Level
```

### Heavy Rain Risk

```text
Rainfall
   +
Population
   +
Accessibility
   ↓
Risk Score
   ↓
Risk Level
```

### Earthquake Risk

```text
Magnitude
   +
Distance
   +
Population
   +
Building Vulnerability
   +
Accessibility
   ↓
Risk Score
   ↓
Risk Level
```

---

## 🚑 Smart Resource Allocation

After assessing disaster risk, ResQGrid helps identify resource requirements for priority zones.

Resources considered include:

* Ambulances
* Rescue Teams
* Emergency Shelters
* Relief Kits

The system uses the calculated risk and zone conditions to generate **resource requirements and response recommendations**.

---

## 🖥️ Main Modules

### 1. Home Page

Provides an overview of the ResQGrid platform and navigation to the main modules.

### 2. Command Center

The authority dashboard provides:

* Active alerts
* Critical zones
* Priority zones
* Risk scores
* Disaster simulation
* Resource status
* AI-based recommendations

### 3. Check My Risk

The citizen interface provides:

* Interactive Chennai map
* Location selection
* Disaster selection
* Risk assessment
* Shelter information
* Resource recommendations

### 4. Risk Engine

Processes disaster and environmental data to calculate risk scores.

### 5. Resource Optimizer

Determines resource requirements based on zone priority and disaster conditions.

### 6. Database

SQLite stores:

* Disaster zones
* Resources
* Shelters
* Recommendations
* Related system data

---

## 🔌 Backend API

The Flask backend provides REST API endpoints for communication between the frontend and backend.

| Endpoint               | Purpose                          |
| ---------------------- | -------------------------------- |
| `/api/zones`           | Retrieves disaster zones         |
| `/api/resources`       | Retrieves available resources    |
| `/api/shelters`        | Retrieves shelter information    |
| `/api/recommendations` | Retrieves recommendations        |
| `/api/check-risk`      | Calculates citizen location risk |
| `/api/simulate`        | Runs disaster simulations        |

---

## 🏗️ Project Structure

```text
ResQGrid/
│
├── backend/
│   ├── app.py
│   ├── database.py
│   ├── data_generator.py
│   ├── models.py
│   ├── risk_engine.py
│   ├── resource_optimizer.py
│   └── resqgrid.db
│
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── citizen.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       ├── map.js
│       ├── dashboard.js
│       └── citizen.js
│
└── README.md
```

---

## 🛠️ Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Leaflet.js
* OpenStreetMap

### Backend

* Python
* Flask
* Flask-CORS
* REST APIs

### Database

* SQLite

### Core Technologies

* Risk Assessment Engine
* Resource Optimization
* Location-based Analysis
* Disaster Simulation

---

## ▶️ How to Run the Project

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
```

### 2. Open the Project

Open the **ResQGrid** folder in VS Code.

### 3. Open Terminal

Go inside the backend folder:

```bash
cd backend
```

### 4. Run the Flask Server

```bash
python app.py
```

The application will run at:

```text
http://127.0.0.1:5000
```

### 5. Open the Application

Open the above address in your browser.

---

## 🧪 Demo Flow

The recommended demonstration flow is:

```text
Home Page
    ↓
Command Center
    ↓
View Priority Zones
    ↓
Run Flood Simulation
    ↓
View Updated Risk / Resources
    ↓
Check My Risk
    ↓
Select Location
    ↓
Select Disaster
    ↓
Check Risk
    ↓
View Risk Score
    ↓
View Shelter & Resources
    ↓
View Recommendation
```

---

## 📊 Example Priority Zones

The prototype contains sample disaster-zone data to demonstrate prioritization.

```text
Zone C → Risk Score: 87 → Critical
Zone A → Risk Score: 72 → High
Zone B → Risk Score: 42 → Moderate
Zone D → Risk Score: 18 → Low
```

These values are prototype/sample data used to demonstrate how the system prioritizes zones.

---

## 🔐 Current Prototype Scope

The current prototype demonstrates the complete workflow using simulated/sample disaster and resource data.

The system is designed as a foundation that can later integrate with real-time government, weather, sensor, GIS, and emergency-response data sources.

---

## 🚀 Future Enhancements

Possible future improvements include:

* 📡 Real-time IoT sensor integration
* 🌧️ Live weather and rainfall data
* 🛰️ Satellite and GIS data integration
* 📱 Mobile application
* 🔔 Real-time citizen alerts
* 🤖 Advanced AI-based disaster prediction
* 🚑 Live emergency vehicle tracking
* 🗺️ Detailed GIS-based vulnerability mapping
* 📊 Historical disaster analytics
* ☁️ Cloud deployment
* 🔐 Role-based authentication for emergency authorities

---

## 🌟 Key Features

* ✅ Location-based disaster risk assessment
* ✅ Flood, Heavy Rain and Earthquake support
* ✅ Interactive map
* ✅ Risk score calculation
* ✅ Risk-level classification
* ✅ Priority zone identification
* ✅ Disaster simulation
* ✅ Smart resource allocation
* ✅ Emergency shelter information
* ✅ Citizen-facing risk assessment
* ✅ Authority Command Center
* ✅ REST API-based architecture
* ✅ SQLite database

---

## 🎯 Impact

ResQGrid aims to support disaster response by connecting **risk assessment, location intelligence, emergency resources, and decision support** in a single platform.

```text
DATA
 ↓
RISK ASSESSMENT
 ↓
PRIORITY IDENTIFICATION
 ↓
RESOURCE ALLOCATION
 ↓
FASTER RESPONSE
```

---

by
S.Muthu Vaishnavi
