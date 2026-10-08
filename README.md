# ♻️ Smart Waste Management System

A full-stack, enterprise-grade, role-based Smart Waste Management platform built with **React**, **Spring Boot 3**, **Maven**, **Java 21**, and a **Relational Database (H2 / PostgreSQL / MySQL ready)**.

Inspired by real-world smart city and circular economy operations, the system connects **Citizens**, **Sanitation Workers**, and **Municipal Authorities** into a cohesive environmental management loop with automated GPS geolocation, camera evidence verification, Eco Points reward incentives, and real-time notification workflows.

---

## 📸 Key Capabilities

1. **Role-Based Portals & Dashboards**:
   - 👤 **Citizen Portal**: Report waste, browser GPS positioning, photo capture, track complaint statuses, earn and redeem Eco Points.
   - 🚶 **Sanitation Worker Portal**: View nearby assignments, GPS route navigation, start tasks, capture Before & After cleanup photo evidence, add sanitation notes.
   - 🏛️ **Municipal Authority Portal**: City-wide oversight, interactive live incident map, 1-click worker assignment and priority dispatch, analytics trends, and recycling quota tracking.
2. **Real-time Lifecycle & Notifications**:
   - `Citizen reports waste` ➔ `Authorities notified` & `Task created`.
   - `Authority assigns/reassigns task` ➔ `Worker notified`.
   - `Worker starts task on-site` ➔ `Citizen & Authority notified (Status: In Progress)`.
   - `Worker completes task with After-photo` ➔ `Citizen receives verified completion alert + bonus Eco Points`, `Authority receives completion verification`.
3. **Interactive GPS & Mapping**:
   - Integrated OpenStreetMap + Leaflet interactive maps without expensive Google Maps API key requirements.
   - Real-time browser Geolocation API (`navigator.geolocation`) with one-click "Detect GPS" and draggable pin placement.
   - Direct Google Maps external navigation link for field sanitation workers.
4. **Camera & Evidence Capture**:
   - Supports both device photo file uploads and live camera capture (`navigator.mediaDevices.getUserMedia`) for on-site evidence verification.
5. **Gamified Citizen Eco Points**:
   - Welcome registration bonus: `100 pts`
   - Valid waste report: `+50 pts`
   - Verified cleanup completion bonus: `+25 pts`
   - Real-time celebratory confetti animation and point history logs.

---

## 🏗️ System Architecture

```
Smart-Waste-App/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/smartwaste/
│       ├── SmartWasteApplication.java       # Spring Boot main application
│       ├── config/
│       │   ├── SecurityConfig.java         # Spring Security with CORS & JWT filter
│       │   ├── JwtTokenProvider.java       # HMAC-SHA256 JWT generator & validator
│       │   └── DataInitializer.java        # Seeds default users, sample reports & tasks
│       ├── controller/
│       │   ├── AuthController.java         # Login, register, me
│       │   ├── ComplaintController.java    # Citizen & authority complaint endpoints
│       │   ├── TaskController.java         # Worker task execution & photo verification
│       │   ├── NotificationController.java # Notification feed & read receipts
│       │   ├── EcoPointController.java     # Eco points ledger
│       │   ├── AnalyticsController.java    # Operations & recycling KPIs
│       │   └── UserController.java         # Worker listings for assignments
│       ├── dto/                            # Data Transfer Objects
│       ├── model/                          # JPA Entities (User, Complaint, Task, Location, etc.)
│       ├── repository/                     # Spring Data JPA Repositories
│       └── service/                        # Business logic & notification dispatching
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js                      # Vite config with backend API proxy
│   └── src/
│       ├── App.jsx                         # Main React router & role protection
│       ├── index.css                       # Forest green theme, cards, mobile bottom nav
│       ├── context/
│       │   ├── AuthContext.jsx             # User authentication state & role helpers
│       │   └── NotificationContext.jsx     # Live notification polling & counter
│       ├── components/
│       │   ├── common/                     # Navbar, BottomNav, StatCard, StatusBadge, Modal
│       │   ├── map/                        # InteractiveMap, LocationPicker (Leaflet)
│       │   └── camera/                     # CameraCapture (Webcam + file upload)
│       └── pages/
│           ├── Splash.jsx                  # Animated introductory splash
│           ├── RoleSelect.jsx              # Role selection cards
│           ├── Login.jsx                   # Login & registration with 1-click demo accounts
│           ├── citizen/                    # Dashboard, ReportWaste, ComplaintsList
│           ├── worker/                     # WorkerDashboard, TaskDetails
│           ├── authority/                  # AuthorityDashboard, AuthorityMap, Analytics, Recycling
│           └── shared/                     # NotificationsPage, ProfilePage
```

---

## 🔑 Default Demo Accounts

For fast testing and demonstrations, the system seeds 3 pre-configured demo accounts:

| Role | Identifier ID | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Citizen** | `CITIZEN01` | `password123` | Citizen Dashboard, Report Waste, Track Complaints, Eco Points |
| **Sanitation Worker** | `WORKER01` | `password123` | Worker Dashboard, Nearby Tasks, Before/After Photo Upload |
| **Municipal Authority** | `AUTH01` | `password123` | Authority Dashboard, Live City Map, Assign Workers, Analytics |

*(You can also use the 1-click demo login buttons directly on the Login screen, or register a new Citizen account).*

---

## 🚀 Running the Application Locally

### 1. Prerequisites
- **Java 17, 21, or 25**
- **Apache Maven 3.8+**
- **Node.js 18+** & **npm**

### 2. Start the Backend API

```powershell
cd backend
mvn spring-boot:run
```
- The backend will start on: **`http://localhost:8080/api`**
- In-memory H2 database console is available at: **`http://localhost:8080/api/h2-console`**
  - JDBC URL: `jdbc:h2:mem:smartwastedb`
  - Username: `sa`
  - Password: *(leave blank)*

### 3. Start the Frontend Application

```powershell
cd frontend
npm install
npm run dev
```
- The frontend will start on: **`http://localhost:5173`**
- Requests to `/api/*` are automatically proxied by Vite to the Spring Boot backend (`http://localhost:8080`).

---

## 💾 Database Configuration

The application is configured by default with an **H2 in-memory relational database** so it runs out-of-the-box without requiring database installation or Docker.

### Switching to PostgreSQL (Production):
Edit `backend/src/main/resources/application.properties`:

```properties
# PostgreSQL Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/smartwaste
spring.datasource.username=postgres
spring.datasource.password=your_postgres_password
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
```
Add the PostgreSQL driver to `backend/pom.xml`:
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

---

## 🗺️ Map and Geolocation Configuration

The system utilizes OpenStreetMap with Leaflet via `react-leaflet`. It operates out of the box with zero third-party API keys required.

1. **Browser Geolocation**: When submitting a complaint, clicking **Detect GPS** triggers `navigator.geolocation.getCurrentPosition()`.
2. **Map Interaction**: Citizens can click anywhere on the interactive map in the **Report Waste** screen to reposition the waste pickup marker.
3. **Turn-by-turn Navigation**: Field sanitation workers can click **Navigate** on any assigned task card to open the route directly in their device's default GPS navigation application.

---

## 📦 Production Build & Deployment

### Building Frontend:
```powershell
cd frontend
npm run build
```
Generates production assets in `frontend/dist/`.

### Building Backend:
```powershell
cd backend
mvn clean package -DskipTests
```
Produces an executable JAR in `backend/target/smart-waste-backend-0.0.1-SNAPSHOT.jar`.
Run via:
```powershell
java -jar backend/target/smart-waste-backend-0.0.1-SNAPSHOT.jar
```
