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

### Core Features

* **User & Business Authentication**: Secure registration and login for both general users and business owners.
* **Shop/Organization Registration**: Businesses can register their establishments for verification.
* **Discounted Item Listing**: Verified businesses can add surplus food items at discounted prices.
* **Location-Based Search**: Users can search for nearby discounted items.
* **Item Booking/Reservation**: Users can book available discounted items.
* **Order Confirmation Emails**: Automated email notifications upon order confirmation.
* **Interactive Maps**: Visualize nearby discounts on a map.
* **Invoice/PDF Generation**: Generate invoices or PDFs for orders.
* **Magic Basket Creation**: Businesses can create curated "magic baskets" of mixed items at a discounted price.
* **Rider Integration**: Functionality for riders to pick up and deliver orders.
* **Seller Ratings**: Users can rate their experience with sellers.
* **Payment Integration**: Secure payment processing for orders.
* **User Preferences**: Personalized recommendations based on user history and preferences.
* **Reward Points**: Earn reward points for purchases.
* **Coupon Codes**: Generate and use coupon codes for discounts.
* **Chat with Sellers**: Real-time communication between users and sellers.

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

### Phase 1: Core User & Business Authentication, Basic Listings & Search (Currently in Progress)

**Goal**: Establish fundamental user and business authentication, enable business registration, and allow users to find and book items.

* **Frontend**:
    * ✅ Implemented **User Login** page.
    * ✅ Implemented **User Register** page.
    * ✅ Basic **Logout** functionality.
    * ⬜ Search interface for nearby discounts.
    * ⬜ Item booking/reservation flow.
* **Backend**:
    * ✅ **User Registration Endpoint**: Allows new users to sign up.
        * Checks for existing emails.
        * Hashes passwords securely using **bcrypt**.
        * Creates new user entries in the database.
    * ✅ **User Login Endpoint**: Authenticates users.
        * Verifies email existence.
        * Compares provided password with hashed password with **bcrypt**.
        * Generates a **JWT** upon successful login.
    * ✅ **Get All Users Endpoint**: (For internal use/testing) Retrieves a list of all registered users.
    * ✅ Business Approval UI (pending verification flow).
    * ✅ Endpoints for verified businesses to add discounted items.
    * ⬜ Endpoints for users to search nearby items.
    * ⬜ Endpoint for booking items.

### Phase 2: Enhanced Order Management, Mapping & Payment Integration

**Goal**: Improve the order process, introduce location-based services, and integrate payment gateways.

* ⬜ **Email Notifications**: Send order confirmation emails to users and sellers.
* ⬜ **Interactive Maps**: Integrate mapping services to display nearby discounts visually.
* ⬜ **Invoice/PDF Generation**: Implement functionality to generate invoices or order summaries.
* ⬜ **Magic Basket Creation**: Allow sellers to create and list special "magic baskets" of mixed items.
* ⬜ **Rider Request System**: Develop a system for riders to be requested for order pickups.
* ⬜ **Seller Rating System**: Implement a rating and review system for businesses.
* ⬜ **Payment Gateway Integration**: Integrate a secure payment gateway for transactions (test environment).
* ⬜ **Add-ons**: Explore and implement additional features as required.

### Phase 3: Personalization, Rewards & Communication

**Goal**: Enhance user experience with personalization, loyalty programs, and direct communication.

* ⬜ **User Specific Preferences**: Implement features that allow users to set preferences for personalized recommendations.
* ⬜ **Reward Points System**: Introduce a system for users to earn and redeem reward points.
* ⬜ **Coupon Code Generation**: Enable the generation and redemption of coupon codes for promotions.
* ⬜ **Chat with Sellers**: Implement a real-time chat feature for users to communicate directly with sellers.

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