# 💰 Personal Finance Tracker

A modern, full-stack **Personal Finance Tracker** application that helps users manage their income, expenses, budgets, and financial reports — all in one place.

Built with **Spring Boot 4.1** (Java 21) on the backend and **React 19** (Vite 6) on the frontend, featuring JWT authentication, interactive charts, budget alerts, and a fully responsive UI.

---

## ✨ Features

### 🔐 Authentication
- User registration and login with JWT (Access + Refresh tokens)
- Protected routes with automatic 401 redirect
- Token persistence via localStorage

### 💳 Transaction Management
- Create, read, update, and delete transactions
- Categorize as **Income** or **Expense**
- Advanced filtering by date range, category, type, and keyword search
- Paginated transaction list with sorting

### 🏷️ Category Management
- 12 pre-seeded default categories (Salary, Food, Transport, etc.)
- Create custom categories with personalized colors
- Auto-filter categories by transaction type in forms

### 📊 Budget Tracking *(Phase 3)*
- Set monthly budgets per category
- Visual progress bars with color-coded thresholds
- Smart alerts when spending exceeds budget percentage

### 📈 Dashboard & Reports *(Phase 4)*
- Summary stat cards (Total Income, Expenses, Balance, Savings Rate)
- Interactive spending breakdown pie chart (Recharts)
- Income vs Expense bar chart
- Monthly and yearly trend reports
- Category-wise breakdown analysis

### 👤 User Profile *(Phase 5)*
- View and edit profile information
- Change password securely
- Currency preference (default: INR)

### 🎨 UI/UX
- Fully responsive mobile-first design (Tailwind CSS v4)
- Custom-built UI components (no external component libraries)
- Toast notifications for all user actions
- Loading spinners and empty states
- Dark/light theme support *(planned)*

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
│   │   │   └── response/
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   ├── Transaction.java
│   │   │   ├── Category.java
│   │   │   ├── Budget.java
│   │   │   └── enums/TransactionType.java
│   │   ├── repository/
│   │   ├── service/
│   │   ├── security/
│   │   ├── exception/
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
│   │   ├── components/
│   │   │   ├── ui/          (Button, Input, Card, Modal, etc.)
│   │   │   ├── layout/      (Navbar, Sidebar, DashboardLayout)
│   │   │   ├── auth/        (LoginForm, RegisterForm)
│   │   │   ├── transactions/
│   │   │   ├── budgets/
│   │   │   ├── dashboard/
│   │   │   ├── reports/
│   │   │   └── profile/
│   │   ├── context/         (AuthContext, ThemeContext)
│   │   ├── hooks/           (useAuth, useFetch, etc.)
│   │   ├── pages/
│   │   ├── routes/
│   │   └── utils/
│   ├── package.json
│   ├── vite.config.js
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
- **STS / IntelliJ IDEA** (for backend)
- **VS Code** (for frontend)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ashif-45/personal-finance-tracker
cd personal-finance-tracker
```

---

### 2️⃣ Database Setup

Create a MySQL database (or let Spring auto-create it):

```sql
CREATE DATABASE IF NOT EXISTS finance_tracker;
```

> **Note:** The application uses `spring.jpa.hibernate.ddl-auto=update`, so all tables will be created automatically on first run.

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

1. Open [http://localhost:5173](http://localhost:5173) in your browser.
2. Click **Register** and create a new account.
3. You'll be redirected to the dashboard.
4. Click **Add Transaction** to start tracking your finances.
5. Click **Categories** to manage your income/expense categories.

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# From the project root
docker-compose up --build
```

This will spin up:
| Service | Port | Description |
|---|---|---|
| MySQL | 3306 | Database |
| Backend | 8080 | Spring Boot API |
| Frontend | 3000 | React app (production build) |

Access the app at **http://localhost:3000**.

### Stop all services
```bash
docker-compose down
```

### Stop and remove volumes (fresh start)
```bash
docker-compose down -v
```

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
| GET | `/api/transactions` | List transactions (paginated, filterable) | ✅ |
| GET | `/api/transactions/{id}` | Get single transaction | ✅ |
| POST | `/api/transactions` | Create transaction | ✅ |
| PUT | `/api/transactions/{id}` | Update transaction | ✅ |
| DELETE | `/api/transactions/{id}` | Delete transaction | ✅ |

### Categories
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/categories` | List all categories | ✅ |
| POST | `/api/categories` | Create custom category | ✅ |
| PUT | `/api/categories/{id}` | Update category | ✅ |
| DELETE | `/api/categories/{id}` | Delete category | ✅ |

### Budgets
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/budgets` | List all budgets | ✅ |
| GET | `/api/budgets/current` | Current month budgets | ✅ |
| POST | `/api/budgets` | Create budget | ✅ |
| PUT | `/api/budgets/{id}` | Update budget | ✅ |
| DELETE | `/api/budgets/{id}` | Delete budget | ✅ |
| GET | `/api/budgets/alerts` | Get budget alerts | ✅ |

### Dashboard
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/dashboard/summary` | Financial summary | ✅ |
| GET | `/api/dashboard/recent` | Recent transactions | ✅ |
| GET | `/api/dashboard/chart-data` | Chart data | ✅ |

### Reports
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/reports/monthly` | Monthly report | ✅ |
| GET | `/api/reports/yearly` | Yearly report | ✅ |
| GET | `/api/reports/category` | Category breakdown | ✅ |

### User Profile
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/users/profile` | Get profile | ✅ |
| PUT | `/api/users/profile` | Update profile | ✅ |
| PUT | `/api/users/change-password` | Change password | ✅ |

> **Full interactive API docs** available at [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) when the backend is running.

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

## 🗄️ Database Schema

```
users ──────────┐
  │             │
  ├──< categories (default + custom)
  │
  ├──< transactions ──> categories
  │
  └──< budgets ───────> categories
```

### Tables
- **users** — User accounts with profile info
- **categories** — Income/Expense categories (12 defaults + custom)
- **transactions** — Financial transactions linked to user & category
- **budgets** — Monthly spending limits per category

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
| Phase 1 | ✅ Complete | Project setup, JWT authentication, Login/Register |
| Phase 2 | ✅ Complete | Transaction CRUD, Category management, Filtering |
| Phase 3 | 🔄 In Progress | Budget tracking, Alert system |
| Phase 4 | ⏳ Pending | Dashboard, Charts, Reports |
| Phase 5 | ⏳ Pending | Profile, Docker, Polish, Deploy |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

**Your Name** — Ashif Ansari

**Project Link:** [https://github.com/ashif-45/personal-finance-tracker](https://github.com/ashif-45/personal-finance-tracker)

---

> ⭐ If you found this project helpful, please give it a star on GitHub!
```

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