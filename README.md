# Course Selling App (Backend Only)

This repository contains the backend for a **Course Selling App**, built with **Node.js** and **Express**, implementing essential features such as JWT-based authentication, CRUD operations, and role-based access for admins and users.

## Features

- **JWT Authentication**: Secure login and signup for users and admins.
- **Admin Dashboard**:
  - Create, update, and delete courses.
  - Manage user data.
- **User Dashboard**:
  - Browse available courses.
  - Enroll in courses.
  - View purchased courses.
- **CRUD Operations**: Full control over course data for admins.
- **Role-based Access Control**: Different routes and functionalities for admins and regular users.

## Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express**: Lightweight web framework for building APIs.
- **JWT (JSON Web Tokens)**: For secure user authentication.
- **Database**: (Specify your database here, e.g., MongoDB, MySQL, or PostgreSQL, if applicable.)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/purrii0/Course-Selling-App.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Course-Selling-App
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     JWT_ADMIN = ""
     JWT_USER = ""
     MONGO_URL = ""
     ```
5. Start the server:
   ```bash
   npm start
   ```
6. The API will be available at `http://localhost:<your-port>`.

## API Endpoints

### Authentication

- **POST** `/auth/signup`: User/admin registration.
- **POST** `/auth/login`: User/admin login.

### Admin Routes

- **GET** `/admin/courses`: Fetch all courses.
- **POST** `/admin/courses`: Create a new course.
- **PUT** `/admin/courses/:id`: Update course details.
- **DELETE** `/admin/courses/:id`: Delete a course.

### User Routes

- **GET** `/user/courses`: View available courses.
- **POST** `/user/courses/:id/enroll`: Enroll in a course.
- **GET** `/user/courses/purchased`: View purchased courses.

## Contribution

Feel free to fork the repository, implement new features, and submit a pull request.
