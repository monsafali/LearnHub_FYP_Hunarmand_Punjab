# Learning Management System (LMS)

A full-stack Learning Management System built with the MERN stack to simplify online education, course management, student enrollment, and assignment management. The platform provides separate dashboards for **Admins, Teachers, and Students**, with role-based access to the features and resources relevant to each user.

## Features

### Admin Dashboard

* Manage teachers and students.
* Oversee courses and platform activities.
* Manage user access and administrative operations.
* Monitor platform information through the admin dashboard.

### Teacher Dashboard

* Create and manage courses.
* Upload and manage course information.
* View enrolled students.
* Manage student assignments and related academic activities.
* Track course and enrollment information.

### Student Dashboard

* Browse available courses.
* Enroll in courses.
* Access enrolled course information.
* View and manage assignments.
* Track assignment status and learning progress.

## Tech Stack

### Frontend

* **React 19** — Building interactive user interfaces.
* **Vite** — Development server and build tooling.
* **React Router DOM** — Client-side routing.
* **Zustand** — State management.
* **Axios** — API requests.
* **Tailwind CSS 4** — Utility-first styling.
* **Lucide React** — Icons.
* **React Hook Form** — Form handling and validation.
* **Recharts** — Charts and data visualization.
* **React Hot Toast & React Toastify** — Notifications.
* **Socket.IO Client** — Real-time communication.


### Backend

* **Node.js** — JavaScript runtime.
* **Express.js** — REST API and server-side application framework.
* **MongoDB & Mongoose** — Database and object modeling.
* **JWT (jsonwebtoken)** — Token-based authentication.
* **bcryptjs** — Password hashing.
* **Cookie Parser** — Cookie handling.
* **CORS** — Cross-origin request configuration.
* **Multer & Express File Upload** — File upload handling.
* **Cloudinary** — Cloud-based media storage.
* **Socket.IO** — Real-time communication.
* **Nodemailer & Brevo SDK** — Email integration.
* **Node-Cron** — Scheduled tasks.
* **dotenv** — Environment variable management.
* **Validator** — Data validation.
* **Moment.js** — Date and time utilities.

## Project Architecture

The application follows a client-server architecture:

* **Frontend:** React application that provides role-specific dashboards and user interfaces.
* **Backend:** Express.js application that exposes REST APIs and handles authentication, business logic, and data processing.
* **Database:** MongoDB stores application data using Mongoose models.
* **External Services:** Cloudinary, Stripe, Google APIs, email services, and OpenAI support integrated features.

## User Roles

| Role    | Responsibilities                                  |
| ------- | ------------------------------------------------- |
| Admin   | Platform administration and user management       |
| Teacher | Course management and student academic activities |
| Student | Course enrollment, learning, and assignments      |

## Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* MongoDB (local installation or MongoDB Atlas account)
* Git

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd YOUR_PROJECT_FOLDER
```

Replace `YOUR_REPOSITORY_URL` with your GitHub repository URL.

### 2. Set Up the Frontend

Navigate to your frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory and configure the variables required by your application.

For example, with Vite:

```env
VITE_BACKEND_URLL=http://localhost:5000/api
```

Use the actual environment variable names referenced in your frontend code.

Start the frontend development server:

```bash
npm run dev
```

### 3. Set Up the Backend

Open another terminal and navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory.

Example configuration:

```env

MONGO_URI=
PORT=
JWT_SECRET_KEY=
JWT_EXPIRES=
COOKIE_EXPIRE=
BREVO_API_KEY
CLIENT_URL=
SUPER_ADMIN_NAME=
SUPER_ADMIN_USERNAME=
SUPER_ADMIN_PASSWORD=
SUPER_ADMIN_EMAIL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_SECRET=
CLOUDINARY_API_KEY=
BACKEND_URL=
SENDER_EMAIL=
JWT_TIMEOUT=1h



```

Add any other environment variables required by your integrations, such as Cloudinary, Stripe, Google OAuth, OpenAI, and email services.

**Important:** The variable names above are examples. Match them to the names actually used in your source code. Never commit real credentials or secret keys to GitHub.

Start the backend:

```bash
npm run dev
```

If your backend does not have a `dev` script, use the start command configured in its `package.json`.

### 4. Open the Application

Visit the local frontend URL provided by Vite, usually:

```text
http://localhost:5173
```

The backend will run on the port configured in your environment variables.

## Environment Variables

Configure the variables required by your project.

| Variable                  | Purpose                                |
| ------------------------- | -------------------------------------- |
| `PORT`                    | Backend server port                    |
| `MONGO_URI`               | MongoDB connection string              |
| `JWT_SECRET`              | Secret used for JWT signing            |
| `CLIENT_URL`              | Frontend origin for CORS and redirects |
| Cloudinary credentials    | Media upload and storage               |
| Stripe credentials        | Payment integration                    |
| Google OAuth credentials  | Google authentication                  |
| OpenAI API key            | AI-powered features                    |
| Email service credentials | Email delivery                         |

Use the exact variable names required by your implementation. Keep all secret values in environment files and exclude those files from version control.

## Security

* Password hashing with bcryptjs.
* JWT-based authentication.
* Role-based authorization for Admin, Teacher, and Student routes.
* Environment variables for sensitive configuration.
* CORS configuration for frontend-backend communication.
* Server-side validation and access control.

Security features should be configured and verified according to the application's actual implementation.

## Future Improvements

* Live classes and video conferencing.
* Course progress tracking and completion certificates.
* Quizzes and automated grading.
* Advanced analytics and reporting.
* Notifications for assignments and course updates.
* Improved mobile responsiveness.

## Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push the branch to your fork.
5. Open a pull request.

## License

Add a license to this repository if you intend to distribute the project under specific terms.

---

**Built with React, Node.js, Express.js, and MongoDB.**
