# Food Hunt

---

## Table of Contents

* [About](#about)
* [Features](#features)
* [Technology Stack](#technology-stack)
* [Project Phases & Progress](#project-phases--progress)
* [Getting Started](#getting-started)
* [Contact](#contact)

---

## About

Food Hunt is a MERN stack application inspired by platforms like Too Good To Go and Olio. Our mission is to combat food waste by connecting businesses with surplus food to customers who can purchase it at heavily discounted prices. This app aims to create a sustainable ecosystem where businesses can reduce their waste, and customers can access affordable meals, benefiting both the community and the environment.

---

## Features

### Current Features (Phase 1)

* **User Authentication**:
    * **User Registration**: New users can create an account with their email and password.
    * **User Login**: Registered users can securely log in to their accounts.
* **User Management (Backend)**:
    * Secure password hashing using **bcrypt**.
    * JSON Web Token (**JWT**) generation for authenticated sessions.
    * Basic user data retrieval (for development/admin purposes).

---

## Technology Stack

Food Hunt is built using the following technologies:

### Frontend

* **Next.js**: React framework for production with server-side rendering and static site generation.
* **App Router**: Next.js's new routing paradigm for building performant and scalable applications.
* **Shadcn UI**: Beautifully designed components built with Radix UI and Tailwind CSS.
* **Formik**: For building forms in React, handling form state, validation, and submission.
* **Yup**: Schema builder for value parsing and validation.
* **Axios**: Promise-based HTTP client for making API requests.
* **Redux**: Predictable state container for JavaScript apps.

### Backend

* **Node.js**: JavaScript runtime environment.
* **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
* **Mongoose**: MongoDB object data modeling (ODM) for Node.js, providing a straightforward, schema-based solution for modeling application data.
* **bcrypt**: Library to help you hash passwords.
* **jsonwebtoken (JWT)**: For implementing secure authentication by generating and verifying tokens.

### Database

* **MongoDB**: A NoSQL, document-oriented database.

---

## Project Phases & Progress

We are developing Food Hunt in distinct phases to ensure a robust and scalable application.

### Phase 1: Core User Authentication & Basic Setup (Currently in Progress)

**Goal**: Establish the fundamental user authentication system and set up the project structure.

* **Frontend**:
    * Implemented **Login** page.
    * Implemented **Register** page.
* **Backend**:
    * **User Registration Endpoint**: Allows new users to sign up.
        * Checks for existing emails.
        * Hashes passwords securely using **bcrypt**.
        * Creates new user entries in the database.
    * **User Login Endpoint**: Authenticates users.
        * Verifies email existence.
        * Compares provided password with hashed password using **bcrypt**.
        * Generates a **JWT** upon successful login.
    * **Get All Users Endpoint**: (For internal use/testing) Retrieves a list of all registered users.

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (LTS version recommended)
* MongoDB (local installation or cloud-based service like MongoDB Atlas)

### Installation

1.  **Clone the repository**:

    ```bash
    git clone <your-repository-url>
    cd food-hunt
    ```

2.  **Backend Setup**:

    ```bash
    cd backend
    npm install
    ```

    Create a `.env` file in the `backend` directory and add your MongoDB connection string and JWT secret:

    ```env
    MONGO_URI="your_mongodb_connection_string"
    JWT_SECRET="a_strong_random_secret_key"
    ```

    Run the backend server:

    ```bash
    npm start
    ```

3.  **Frontend Setup**:

    ```bash
    cd frontend
    npm install
    ```

    Run the frontend development server:

    ```bash
    npm run dev
    ```

    The frontend should now be accessible at `http://localhost:3000`.

---

## Contact

If you have any questions, feel free to reach out!

* **Your Name/Team Name**: [Your Name/Team Name]
* **Email**: [Your Email Address]
* **GitHub**: [Link to your GitHub profile/project]