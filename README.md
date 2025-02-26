# Social Media REST API

## Project Overview

This project is a robust social media backend REST-API that empowers users to post, comment, like, send friend requests, and reset their passwords using OTP for enhanced security.

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/Dev-Reddy/Postaway-II.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Postaway-II-main
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables in a `.env` file.

5. Start the server:

   ```bash
   npm start
   ```

## Environment Variables

- `PORT = [PORT NO]`
- `DB_URL = [Your Database URL]`
- `JWT_SECRET = [Your JWT Secret]`
- `MAILER_SERVICE = [Your Mailer Service]`
- `MAILER_USER = [Your Mailer User]`
- `MAILER_PASSWORD = [Your Mailer Password]`

## API Documentation

After starting the server, you can access the complete API documentation at:

```bash
/api-docs
```

This provides a Swagger UI interface for easy interaction with the API endpoints.

## Features

### 1. RESTful API Development

- Developed using **Node.js**, **ExpressJS**, and **MongoDB** for efficient data handling and routing control.

### 2. Code Modularity

- Organized using **ES6 Modules** for maintainability and modularity.

### 3. User Authentication

- User authentication system with signup, login, and logout features.
- Advanced feature: **Log out from all devices** by storing login tokens in an array within the user's document.
- Registration includes **name**, **email**, **password**, and **gender**.

### 4. Post Management

- CRUD operations for posts with fields like **caption** and **image URL**.
- Each post references the user who created it.
- Only the post owner can update or delete the post.

### 5. Comment System

- Add, update, and delete comments on posts.
- Comments can be managed by the post owner or the commenter.

### 6. Like Functionality

- Like system for posts with MongoDB logic.
- Displays counts of likes and comments.
- Populates user info (ID, name, email) for likes, comments, and posts.

### 7. Friend Requests

- Send, accept, and reject friend requests.
- Manage friend lists effectively.

### 8. Password Reset with OTP

- Secure password reset mechanism using OTP sent to the user's email.

## License

This project is licensed under the MIT License.
