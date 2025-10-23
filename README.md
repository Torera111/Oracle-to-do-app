# Oracle Todo Application

A full-stack Todo application built with Node.js and Oracle Database integration. This application provides a secure and efficient way to manage your tasks with user authentication.

## Features

- User Authentication (Sign up, Login)
- Create, Read, Update, and Delete Todos
- Oracle Database Integration
- RESTful API Architecture
- Simple and intuitive web interface

## Tech Stack

- Backend: Node.js/Express.js
- Database: Oracle
- Authentication: JWT (JSON Web Tokens)
- Frontend: HTML/JavaScript

## Project Structure

```
├── config/          # Database and configuration files
├── controllers/     # Business logic handlers
├── middleware/     # Authentication middleware
├── public/         # Static frontend files
├── routes/         # API route definitions
└── server.js       # Main application entry point
```

## Getting Started

### Prerequisites

1. Node.js (v14 or higher)
2. Oracle Database (v19c or higher)
3. Oracle Instant Client

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Torera111/Oracle-to-do-app.git
   cd Oracle-to-do-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=3000
   DB_USER=your_oracle_username
   DB_PASSWORD=your_oracle_password
   DB_CONNECT_STRING=your_oracle_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Setup Oracle Database
   - Ensure Oracle Database is installed and running
   - Create a new user and grant necessary privileges
   - Note down the connection string (usually in format: `localhost:1521/YOUR_SERVICE_NAME`)

### Database Schema Setup

Run the following SQL commands in your Oracle Database:

```sql
-- Create TODO table
CREATE TABLE todos (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR2(255) NOT NULL,
    completed NUMBER(1) DEFAULT 0,
    user_id NUMBER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create USERS table
CREATE TABLE users (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR2(50) UNIQUE NOT NULL,
    password VARCHAR2(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Running the Application

1. Start the server
   ```bash
   npm start
   ```
   The server will start on http://localhost:3000 (or the PORT specified in your .env file)

2. Test the API
   - Use the provided endpoints in the API Documentation section
   - You can use tools like Postman or curl to test the endpoints
   - Remember to include the JWT token in the Authorization header for protected routes

### Development

For development, the application uses nodemon which will automatically restart the server when file changes are detected.

### Troubleshooting

1. Oracle Connection Issues:
   - Verify Oracle Database is running
   - Check connection string format
   - Ensure Oracle Instant Client is properly installed
   - Verify database user permissions

2. JWT Token Issues:
   - Ensure JWT_SECRET is properly set in .env
   - Check token expiration
   - Verify token format in Authorization header

## API Documentation

### Authentication Endpoints

#### Register New User
- **URL:** `/auth/register`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Success Response:** 
  - **Code:** 201
  - **Content:** `{ "message": "User registered successfully" }`

#### Login
- **URL:** `/auth/login`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:** `{ "token": "JWT_TOKEN" }`

### Todo Endpoints
All todo endpoints require authentication. Include the JWT token in the Authorization header:
`Authorization: Bearer YOUR_JWT_TOKEN`

#### Get All Todos
- **URL:** `/todos`
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200
  - **Content:** Array of todo items
  ```json
  [
    {
      "id": "number",
      "title": "string",
      "completed": "boolean"
    }
  ]
  ```

#### Create New Todo
- **URL:** `/todos`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "title": "string",
    "completed": "boolean"
  }
  ```
- **Success Response:**
  - **Code:** 201
  - **Content:** Created todo item

#### Update Todo
- **URL:** `/todos/:id`
- **Method:** `PUT`
- **URL Params:** `id=[number]`
- **Request Body:**
  ```json
  {
    "title": "string",
    "completed": "boolean"
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:** Updated todo item

#### Delete Todo
- **URL:** `/todos/:id`
- **Method:** `DELETE`
- **URL Params:** `id=[number]`
- **Success Response:**
  - **Code:** 200
  - **Content:** `{ "message": "Todo deleted successfully" }`

## License

This project is licensed under the ISC License - see below for details:

```
Copyright (c) 2025 Torera111

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```
