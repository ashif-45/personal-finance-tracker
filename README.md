# 💰 Personal Finance Tracker

A modern, full-stack **Personal Finance Tracker** application that helps users manage their income, expenses, budgets, and financial reports — all in one place.

Built with **Spring Boot 4.1** (Java 21) on the backend and **React 19** (Vite 6) on the frontend, featuring JWT authentication, interactive charts, budget alerts, CSV bulk upload, and a fully responsive UI.

---

## ✨ Features

### 🔐 Authentication & Security
- User registration and login with JWT (Access + Refresh tokens)
- Protected routes with automatic 401 redirect
- Token persistence via localStorage
- Role-based access control (ROLE_USER)
- Password change with current password verification

### 💳 Transaction Management
- Create, read, update, and delete transactions
- Categorize as **Income** or **Expense**
- Advanced filtering by date range, category, type, and keyword search
- Paginated transaction list with sorting
- **CSV Bulk Upload** — import hundreds of transactions at once

### 🏷️ Category Management
- 12 pre-seeded default categories (Salary, Food, Transport, etc.)
- Create custom categories with personalized colors
- Auto-filter categories by transaction type in forms
- **CSV Bulk Upload** — import custom categories in bulk

### 📊 Budget Tracking
- Set monthly budgets per category or overall
- Visual progress bars with color-coded thresholds (green → amber → red)
- Smart alerts when spending exceeds budget percentage
- **CSV Bulk Upload** — set multiple budgets at once
- Budget alert banners on the dashboard

### 📈 Dashboard & Reports
- Summary stat cards (Total Income, Expenses, Balance, Savings Rate)
- Interactive spending breakdown pie chart (Recharts)
- Income vs Expense bar chart (daily trend)
- Monthly reports with year selector
- Yearly overview with year-over-year comparison
- Category-wise breakdown with pie chart + detail table

### 👤 User Profile
- View and edit profile information
- Change password securely
- Currency preference (INR, USD, EUR, GBP, JPY, CAD, AUD)

### 📥 CSV Bulk Upload
- Upload CSV files for **Transactions**, **Budgets**, and **Categories**
- Downloadable CSV templates for each entity
- Row-level error reporting (see exactly which rows failed and why)
- Success/failure summary after each import
- Automatic header row detection

### 🎨 UI/UX
- Fully responsive mobile-first design (Tailwind CSS v4)
- Custom-built UI components (no external component libraries)
- Toast notifications for all user actions
- Loading spinners and empty states
- Error boundary for graceful crash recovery
- Collapsible sidebar navigation

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Java | 21 LTS | Runtime |
| Spring Boot | 4.1.1 | Application framework |
| Spring Security | Latest | Authentication & Authorization |
| Spring Data JPA | Latest | ORM / Database access |
| Hibernate | Latest | JPA implementation |
| MySQL | 8.4 LTS | Relational database |
| JJWT | 0.12.6 | JWT token generation & validation |
| Jakarta Validation | Latest | Request validation |
| OpenCSV | 5.9 | CSV file parsing for bulk upload |
| SpringDoc OpenAPI | 2.6.0 | Swagger UI / API docs |
| Maven | 3.9.6 | Build tool |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI library |
| Vite | 6 | Build tool & dev server |
| React Router | 7 | Client-side routing |
| Tailwind CSS | 4 | Utility-first styling |
| React Hook Form | 7 | Form management |
| Zod | 3 | Schema validation |
| Recharts | 2 | Data visualization charts |
| Lucide React | Latest | Icon library |
| Day.js | 1 | Date formatting |
| React Hot Toast | 2 | Toast notifications |

### DevOps
| Technology | Purpose |
|---|---|
| Docker + Docker Compose | Containerized deployment |
| Nginx | Frontend production server & API proxy |
| Git / GitHub | Version control |

---

## 📁 Project Structure

```
personal-finance-tracker/
├── backend/
│   ├── src/main/java/com/personalfinancetracker/
│   │   ├── PersonalFinanceTrackerApplication.java
│   │   ├── config/
│   │   │   ├── SecurityConfig.java
│   │   │   ├── CorsConfig.java
│   │   │   ├── OpenApiConfig.java
│   │   │   └── DataInitializer.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── TransactionController.java
│   │   │   ├── CategoryController.java
│   │   │   ├── BudgetController.java
│   │   │   ├── DashboardController.java
│   │   │   ├── ReportController.java
│   │   │   └── UserController.java
│   │   ├── dto/
│   │   │   ├── request/
│   │   │   │   ├── LoginRequest.java
│   │   │   │   ├── RegisterRequest.java
│   │   │   │   ├── TransactionRequest.java
│   │   │   │   ├── CategoryRequest.java
│   │   │   │   ├── BudgetRequest.java
│   │   │   │   ├── UpdateProfileRequest.java
│   │   │   │   └── ChangePasswordRequest.java
│   │   │   └── response/
│   │   │       ├── ApiResponse.java
│   │   │       ├── AuthResponse.java
│   │   │       ├── CategoryResponse.java
│   │   │       ├── TransactionResponse.java
│   │   │       ├── BudgetResponse.java
│   │   │       ├── BudgetAlertResponse.java
│   │   │       ├── DashboardResponse.java
│   │   │       ├── ReportResponse.java
│   │   │       ├── UserProfileResponse.java
│   │   │       ├── PageResponse.java
│   │   │       └── BulkUploadResponse.java
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   ├── Transaction.java
│   │   │   ├── Category.java
│   │   │   ├── Budget.java
│   │   │   └── enums/TransactionType.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── TransactionRepository.java
│   │   │   ├── CategoryRepository.java
│   │   │   └── BudgetRepository.java
│   │   ├── service/
│   │   │   ├── AuthService.java
│   │   │   ├── TransactionService.java
│   │   │   ├── CategoryService.java
│   │   │   ├── BudgetService.java
│   │   │   ├── DashboardService.java
│   │   │   ├── ReportService.java
│   │   │   ├── UserService.java
│   │   │   └── CsvImportService.java
│   │   ├── security/
│   │   │   ├── JwtTokenProvider.java
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   ├── JwtAuthEntryPoint.java
│   │   │   └── CustomUserDetailsService.java
│   │   ├── exception/
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   ├── ResourceNotFoundException.java
│   │   │   └── BadRequestException.java
│   │   └── util/DtoMapper.java
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── application-dev.yml
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── fetchClient.js
│   │   │   ├── authApi.js
│   │   │   ├── transactionApi.js
│   │   │   ├── budgetApi.js
│   │   │   ├── categoryApi.js
│   │   │   ├── dashboardApi.js
│   │   │   ├── reportApi.js
│   │   │   └── userApi.js
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   ├── Spinner.jsx
│   │   │   │   ├── ProgressBar.jsx
│   │   │   │   └── CsvUpload.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── DashboardLayout.jsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── StatCards.jsx
│   │   │   │   ├── SpendingChart.jsx
│   │   │   │   ├── IncomeExpenseChart.jsx
│   │   │   │   └── RecentTransactions.jsx
│   │   │   ├── transactions/
│   │   │   │   ├── TransactionList.jsx
│   │   │   │   ├── TransactionForm.jsx
│   │   │   │   └── TransactionFilters.jsx
│   │   │   ├── budgets/
│   │   │   │   ├── BudgetList.jsx
│   │   │   │   ├── BudgetForm.jsx
│   │   │   │   ├── BudgetProgressBar.jsx
│   │   │   │   └── BudgetAlertBanner.jsx
│   │   │   ├── reports/
│   │   │   │   ├── MonthlyReport.jsx
│   │   │   │   ├── YearlyReport.jsx
│   │   │   │   └── CategoryBreakdown.jsx
│   │   │   ├── categories/
│   │   │   │   ├── CategoryForm.jsx
│   │   │   │   └── CategoryManager.jsx
│   │   │   ├── profile/
│   │   │   │   ├── ProfileForm.jsx
│   │   │   │   └── ChangePassword.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── context/AuthContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useFetch.js
│   │   │   └── useBudgets.js
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── TransactionsPage.jsx
│   │   │   ├── BudgetsPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── utils/
│   │   │   ├── formatCurrency.js
│   │   │   ├── formatDate.js
│   │   │   └── constants.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── nginx.conf
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Java 21** (LTS) — [Download](https://adoptium.net/)
- **Node.js 22** (LTS) — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MySQL 8.4** — [Download](https://dev.mysql.com/downloads/)
- **Maven 3.9.6** — [Download](https://maven.apache.org/download.cgi)
- **Git** — [Download](https://git-scm.com/)
- **STS / IntelliJ IDEA** (backend), **VS Code** (frontend)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/personal-finance-tracker.git
cd personal-finance-tracker
```

---

### 2️⃣ Database Setup

Create a MySQL database (or let Spring auto-create it):

```sql
CREATE DATABASE IF NOT EXISTS finance_tracker;
```

> Tables are auto-created via `spring.jpa.hibernate.ddl-auto=update`.

Update credentials in `backend/src/main/resources/application.yml` if your MySQL username/password differ from `your-username/your-password`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/<your-database-name>?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: <your-username>
    password: <your-password>
```

---

### 3️⃣ Backend Setup

```bash
cd backend
```

**Option A: Using STS / IntelliJ**
1. Import the project as a Maven project.
2. Run `PersonalFinanceTrackerApplication.java` as a Spring Boot App.

**Option B: Using Command Line**
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**.

**Verify:**
- Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- Health check: `GET http://localhost:8080/api/auth/login` (should return 400, not 404)

---

### 4️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on **http://localhost:5173**.

> The Vite dev server proxies all `/api` requests to `http://localhost:8080` automatically.

---

### 5️⃣ Test the Application

1. Open http://localhost:5173
2. Register a new account
3. Add transactions, set budgets, view reports
4. Try CSV bulk upload from the Transactions page

---

## 📥 CSV Bulk Upload Guide

### How It Works
1. Navigate to **Transactions**, **Budgets**, or **Categories**
2. Click the **"Import CSV"** button
3. Download the template (optional but recommended)
4. Fill in your data and upload the `.csv` file
5. Review the success/failure report with row-level error details

### CSV Formats

#### Transactions
```csv
amount,type,categoryName,transactionDate,description
500.00,EXPENSE,Food,2025-01-15,Lunch at restaurant
50000.00,INCOME,Salary,2025-01-01,January salary
200.00,EXPENSE,Transport,2025-01-10,Uber ride
```
- `type`: Must be `INCOME` or `EXPENSE`
- `categoryName`: Must match an existing category name (case-insensitive)
- `transactionDate`: Format `yyyy-MM-dd`

#### Budgets
```csv
amount,month,year,categoryName,alertThreshold
5000,1,2025,Food,80
3000,1,2025,Transport,90
10000,1,2025,,85
```
- `categoryName`: Leave empty for an overall budget
- `alertThreshold`: Percentage (10-100), defaults to 80

#### Categories
```csv
name,type,icon,color
Groceries,EXPENSE,ShoppingCart,#EF4444
Crypto,INCOME,Bitcoin,#F59E0B
Gym,EXPENSE,Dumbbell,#8B5CF6
```
- `type`: Must be `INCOME` or `EXPENSE`
- `color`: Hex code (e.g. `#3B82F6`), defaults to `#64748B`

---

## 🐳 Docker Deployment

```bash
# Build and start all services
docker-compose up --build

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Fresh start (wipe database)
docker-compose down -v && docker-compose up --build
```

| Service | Port | URL |
|---|---|---|
| Frontend (Nginx) | 3000 | http://localhost:3000 |
| Backend (Spring Boot) | 8080 | http://localhost:8080 |
| MySQL | 3306 | localhost:3306 |
| Swagger UI | 8080 | http://localhost:8080/swagger-ui.html |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login & get JWT | ❌ |
| POST | `/api/auth/refresh` | Refresh access token | ❌ |

### Transactions
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/transactions` | List (paginated, filterable) | ✅ |
| GET | `/api/transactions/{id}` | Get single transaction | ✅ |
| POST | `/api/transactions` | Create transaction | ✅ |
| PUT | `/api/transactions/{id}` | Update transaction | ✅ |
| DELETE | `/api/transactions/{id}` | Delete transaction | ✅ |
| POST | `/api/transactions/bulk-upload` | **CSV bulk upload** | ✅ |

### Categories
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/categories` | List all categories | ✅ |
| POST | `/api/categories` | Create custom category | ✅ |
| PUT | `/api/categories/{id}` | Update category | ✅ |
| DELETE | `/api/categories/{id}` | Delete category | ✅ |
| POST | `/api/categories/bulk-upload` | **CSV bulk upload** | ✅ |

### Budgets
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/budgets` | List all budgets | ✅ |
| GET | `/api/budgets/current` | Current month budgets | ✅ |
| POST | `/api/budgets` | Create budget | ✅ |
| PUT | `/api/budgets/{id}` | Update budget | ✅ |
| DELETE | `/api/budgets/{id}` | Delete budget | ✅ |
| GET | `/api/budgets/alerts` | Get budget alerts | ✅ |
| POST | `/api/budgets/bulk-upload` | **CSV bulk upload** | ✅ |

### Dashboard
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/dashboard/summary` | Financial summary + charts | ✅ |

### Reports
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/reports/monthly?year=2025` | Monthly report | ✅ |
| GET | `/api/reports/yearly` | Yearly overview | ✅ |
| GET | `/api/reports/category?month=1&year=2025` | Category breakdown | ✅ |

### User Profile
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/users/profile` | Get profile | ✅ |
| PUT | `/api/users/profile` | Update profile | ✅ |
| PUT | `/api/users/change-password` | Change password | ✅ |

> **Full interactive API docs** available at [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) when the backend is running.

---

## 🗄️ Database Schema

```
users ──────────┐
  │             │
  ├──< categories (12 defaults + custom)
  │
  ├──< transactions ──> categories
  │
  └──< budgets ───────> categories
```

| Table | Description |
|---|---|
| `users` | User accounts with profile info |
| `categories` | Income/Expense categories |
| `transactions` | Financial records linked to user & category |
| `budgets` | Monthly spending limits per category |

---

## 🔑 Environment Variables

### Backend (`application.yml`)
| Variable | Default | Description |
|---|---|---|
| `spring.datasource.url` | `jdbc:mysql://localhost:3306/<your-database-name>` | Database URL |
| `spring.datasource.username` | `your-username` | MySQL username |
| `spring.datasource.password` | `your-password` | MySQL password |
| `app.jwt.secret` | *(Base64 encoded)* | JWT signing secret |
| `app.jwt.expiration-ms` | `86400000` (24h) | Access token expiry |
| `app.jwt.refresh-expiration-ms` | `604800000` (7d) | Refresh token expiry |

---

## 📸 Screenshots

> *Screenshots will be added after Phase 5 completion.*

| Page | Preview |
|---|---|
| Login | *Coming soon* |
| Dashboard | *Coming soon* |
| Transactions | *Coming soon* |
| Budgets | *Coming soon* |
| Reports | *Coming soon* |

---

## 🏗️ Development Phases

| Phase | Status | Description |
|---|---|---|
| Phase 1 | ✅ Complete | Project setup, JWT auth, Login/Register |
| Phase 2 | ✅ Complete | Transaction CRUD, Category management, Filtering |
| Phase 3 | ✅ Complete | Budget tracking, Alert system |
| Phase 4 | ✅ Complete | Dashboard, Charts, Reports |
| Phase 5 | ✅ Complete | Profile, CSV Upload, Docker, Polish, Deploy |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 📧 Contact

**Your Name** — Ashif Ansari

**Project Link:** [https://github.com/ashif-45/personal-finance-tracker](https://github.com/ashif-45/personal-finance-tracker)

---

> ⭐ If you found this project helpful, please give it a star on GitHub!


---

## 📋 PHASE 5 + CSV UPLOAD CHECKLIST

| Feature | Status |
|---|---|
| UserController (profile, change password) | ✅ |
| ProfilePage with tabs | ✅ |
| ProfileForm + ChangePassword components | ✅ |
| ErrorBoundary | ✅ |
| DashboardLayout (Sidebar + Navbar) | ✅ |
| Docker Compose (MySQL + Backend + Frontend) | ✅ |
| Backend Dockerfile (multi-stage, non-root) | ✅ |
| Frontend Dockerfile + nginx.conf | ✅ |
| application.yml (Docker env vars) | ✅ |
| .gitignore | ✅ |
| README.md | ✅ |
| **CSV: OpenCSV dependency** | ✅ |
| **CSV: CsvImportService (3 import methods)** | ✅ |
| **CSV: BulkUploadResponse DTO** | ✅ |
| **CSV: Transaction bulk-upload endpoint** | ✅ |
| **CSV: Budget bulk-upload endpoint** | ✅ |
| **CSV: Category bulk-upload endpoint** | ✅ |
| **CSV: fetchClient.upload() (FormData)** | ✅ |
| **CSV: CsvUpload.jsx (reusable component)** | ✅ |
| **CSV: Template download feature** | ✅ |
| **CSV: Row-level error reporting** | ✅ |
| **CSV: Upload modals on all 3 pages** | ✅ |

---

## 📋 Quick GitHub Setup Checklist

After creating the repo on GitHub:

```bash
# Initialize git in your project root
cd personal-finance-tracker
git init
git add .
git commit -m "Initial commit: Phase 1 & 2 complete"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/personal-finance-tracker.git
git push -u origin main
```