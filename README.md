# Learning Management System (LMS)

A full-stack **Learning Management System (LMS)** built with the MERN stack to simplify online education, course management, student enrollment, assignment submissions, and academic progress tracking.

The platform provides dedicated dashboards for **Admins, Instructors, and Students**, with role-based access control, secure authentication, Stripe payment integration, email OTP verification, and real-time student communication.

## Features

### Admin Dashboard

- Manage instructors, including creating, updating, and deleting instructor accounts.
- Manage platform users and administrative operations.
- Access administrative dashboard information and platform activity.
- Maintain centralized control over instructor management and platform access.

### Instructor Dashboard

- Create and upload courses.
- Manage course details and learning materials.
- Upload and organize course lectures.
- Create and manage course assignments.
- View enrolled students.
- Review and check student assignment submissions.
- Grade assignments and award marks.
- Track student performance and academic progress.

### Student Dashboard

- Browse available courses.
- Enroll in courses after successful Stripe payment.
- Access enrolled courses and course lectures.
- View course assignments and submission requirements.
- Submit assignments for instructor review.
- View assignment grades and awarded marks.
- Chat with other students in real time.

### Authentication & User Profiles

- Role-based authentication for Admins, Instructors, and Students.
- JWT-based authentication.
- Login verification using email OTP.
- Password hashing and secure authentication workflows.
- Forgot password and reset password functionality.
- Update password functionality.
- Update profile information.
- Google OAuth integration.
- Protected routes based on user roles.

### Payments & Enrollment

- Stripe payment integration.
- Secure payment flow before course enrollment.
- Course enrollment after successful payment.
- Stripe frontend integration using Stripe.js and React Stripe.js.

### Communication & Notifications

- Email OTP delivery using Brevo.
- Real-time student-to-student chat using Socket.IO.
- Toast notifications for application feedback.

### Additional Features

- Responsive user interfaces.
- Interactive dashboards and charts.
- Course and assignment management.
- Form handling and validation.
- File and media uploads using Cloudinary.
- QR code, barcode, and PDF-related frontend utilities.

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | Component-based user interfaces |
| Vite | Development server and build tooling |
| React Router DOM | Client-side routing |
| Zustand | Global state management |
| Axios | HTTP requests |
| Tailwind CSS 4 | Utility-first styling |
| Material UI | UI components |
| Emotion | CSS-in-JS styling |
| Lucide React | Icons |
| React Hook Form | Form management |
| Recharts | Charts and data visualization |
| React Hot Toast | Notifications |
| React Toastify | Toast notifications |
| Socket.IO Client | Real-time communication |
| Stripe.js | Payment processing |
| React OAuth Google | Google authentication |
| jsPDF | PDF generation |
| html2canvas | HTML-to-image conversion |
| QRCode React | QR code generation |
| JsBarcode | Barcode generation |

### Backend

- **Node.js** — JavaScript runtime.
- **Express.js** — REST API and backend application framework.
- **MongoDB** — NoSQL database.
- **Mongoose** — MongoDB object modeling.
- **JWT** — Token-based authentication.
- **bcryptjs** — Password hashing.
- **Brevo SDK** — Transactional email and OTP delivery.
- **Cloudinary** — Cloud-based media storage.
- **Stripe** — Payment processing.
- **Socket.IO** — Real-time communication.
- **OpenAI API** — AI-powered functionality, where configured.
- **dotenv** — Environment variable management.

## User Roles

| Role | Permissions |
|---|---|
| Admin | Create, update, and delete instructors; access administrative features. |
| Instructor | Create courses, upload lectures, create assignments, review submissions, and grade students. |
| Student | Browse and purchase courses, access lectures, submit assignments, view grades, and chat with other students. |

## Project Architecture

The application follows a client-server architecture.

- **Frontend:** React and Vite provide the user interface and role-specific dashboards.
- **Backend:** Node.js and Express.js handle API requests, authentication, authorization, payments, and business logic.
- **Database:** MongoDB stores application data through Mongoose.
- **Payment Service:** Stripe handles course payment processing.
- **Email Service:** Brevo supports transactional email and OTP delivery.
- **Media Storage:** Cloudinary stores uploaded media.
- **Real-Time Communication:** Socket.IO supports student chat.
- **AI Integration:** OpenAI API supports configured AI-powered functionality.

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB locally or a MongoDB Atlas account
- Git
- Stripe account for payment integration
- Brevo account for email delivery
- Cloudinary account for media uploads
- OpenAI API key if AI functionality is enabled

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd YOUR_PROJECT_FOLDER
```

Replace `YOUR_REPOSITORY_URL` and `YOUR_PROJECT_FOLDER` with your repository URL and project directory.

### 2. Configure the Backend

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
MONGO_URI=mongodb://localhost:27017/Hunarmandpunjab

PORT=5000

JWT_SECRET_KEY=your_secure_jwt_secret
JWT_EXPIRES=7d
COOKIE_EXPIRE=7

CLIENT_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=your_verified_sender_email

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key

SUPER_ADMIN_NAME=your_admin_name
SUPER_ADMIN_USERNAME=admin
SUPER_ADMIN_EMAIL=your_admin_email
SUPER_ADMIN_PASSWORD=your_secure_admin_password

OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini

NODE_ENV=development
```

**Configuration notes:**

- Replace all example values with your own credentials.
- Use a strong, unique JWT secret.
- Use a verified sender email with Brevo.
- Keep all private API keys in the backend environment.
- Set `OPENAI_API_KEY` only if your application uses OpenAI.
- Confirm that every environment variable matches the names used by your backend code.
- If MongoDB is hosted remotely, use your MongoDB Atlas connection string.

Start the backend using the script defined in your `package.json`. For example:

```bash
npm run dev
```

### 3. Configure the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_BACKEND_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

Use your Stripe **publishable key** on the frontend. Never expose your Stripe secret key through a `VITE_` variable.

Start the frontend:

```bash
npm run dev
```

### 4. Open the Application

Visit the local development URL:

```text
http://localhost:5173
```

Make sure MongoDB and the backend server are running before testing the application.

## Demo Credentials

The following credentials are example/demo credentials. They will work only if the corresponding accounts and OTP behavior are configured in your application.

| Role | Username | Password | Demo OTP |
|---|---|---|---|
| Admin | `admin` | `Admin@123` | `123456` |
| Instructor | `teacher` | `Teacher@123` | `123456` |
| Student | `student` | `Student@123` | `123456` |

**Demo login instructions:**

1. Open the application.
2. Enter the username and password for your selected role.
3. Complete the OTP verification step using the configured demo OTP.
4. Access the dashboard associated with the account's role.

**Note:** In a production environment, OTPs should be generated securely, delivered to the user's registered email address, and expire after a short period. Do not use a fixed OTP or publish real account credentials in a public repository.

## Payment Workflow

The student enrollment workflow is designed around course payments:

1. The student browses available courses.
2. The student selects a course and initiates checkout.
3. The backend creates or coordinates the Stripe payment process.
4. Stripe processes the payment.
5. The backend verifies payment success.
6. The student receives course enrollment and access to the relevant lectures.

Payment verification and enrollment authorization must be enforced on the backend, not solely by the frontend.

## Security

The application is designed to support:

- JWT-based authentication.
- Password hashing.
- Role-based route and resource authorization.
- Email OTP verification.
- Environment-based secret management.
- Protected instructor and student resources.
- Server-side payment verification.
- Restricted access to enrolled course materials.

Production deployments should also use HTTPS, secure cookie settings, request validation, rate limiting, and appropriate OTP expiration and retry limits.

## Environment Variables

Never commit `.env` files containing real secrets to GitHub.

Add these entries to `.gitignore`:

```gitignore
node_modules/
.env
.env.*
!.env.example
dist/
```

You can provide `.env.example` files containing placeholder values so other developers can configure their own environments.

## Future Improvements

Potential future enhancements include:

- Live classes and video conferencing.
- Course completion certificates.
- Quizzes and automated grading.
- Course progress tracking.
- Advanced analytics and reporting.
- Assignment deadline reminders.
- Additional payment and subscription options.
- Mobile application support.

## Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push your branch.
5. Open a pull request.

## License

Add a `LICENSE` file if you intend to distribute the project under a specific open-source license.

---

**Built with React, Node.js, Express.js, MongoDB, Stripe, and Socket.IO.**
