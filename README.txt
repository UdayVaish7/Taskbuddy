# TaskBuddy (Full-Stack)

A full-stack web application for managing team projects and tasks with Role-Based Access Control (Admin/Member). 

## 🚀 Key Features

*   **Authentication**: Secure Signup & Login functionality using JSON Web Tokens (JWT).
*   **Role-Based Access Control (RBAC)**: 
    *   **Admin**: Can create projects, assign tasks to any user, and view all tasks.
    *   **Member**: Can only view tasks assigned to them and update their status.
*   **Project & Team Management**: Admins can create and manage projects.
*   **Task Management**: Create tasks, assign them to members, and track status (TODO, IN_PROGRESS, DONE).
*   **Dashboard**: Overview of tasks and their current statuses.

## 💻 Tech Stack

**Frontend:**
*   React.js
*   Vite
*   TypeScript
*   Tailwind / Vanilla CSS (Glassmorphism UI)
*   Lucide React (Icons)
*   Axios

**Backend:**
*   Node.js
*   Express.js
*   TypeScript
*   Prisma ORM
*   SQLite (Local Development) / PostgreSQL (Production)
*   JSON Web Tokens (JWT) for Authentication
*   Bcryptjs for password hashing

## 🛠️ Local Development Setup

### Prerequisites
*   Node.js installed
*   Git installed

### Installation

1.  **Clone the repository** (or extract the folder):
    ```bash
    git clone <your-repo-url>
    cd task-manager-assignment
    ```

2.  **Setup Backend**:
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` folder with the following:
    ```env
    DATABASE_URL="file:./dev.db"
    JWT_SECRET="your_super_secret_key"
    PORT=5000
    ```
    Run database migrations and start the backend:
    ```bash
    npx prisma db push
    npx prisma generate
    npm run dev
    ```

3.  **Setup Frontend**:
    Open a new terminal and run:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Access the Application**:
    Open your browser and navigate to `http://localhost:5173`.

## 🌐 Deployment

This application is ready to be deployed to Railway. 
The backend connects to a database via the `DATABASE_URL` environment variable, making it seamless to switch from SQLite to PostgreSQL in production.
