# User and Group Management API

This is a RESTful API built with Node.js, Express, and TypeScript for managing users and groups, along with their relationships.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
  - [Users](#users)
  - [Groups](#groups)
  - [User Groups](#user-groups)
- [Testing](#testing)

## Features

- **User Management:**
  - Create, read, update, and delete user information (name, surname, birth date, sex).
- **Group Management:**
  - Create, read, update, and delete groups.
- **User-Group Relationships:**
  - Add users to groups.
  - Remove users from groups.
  - Get all users in a specific group.
  - Get all groups a specific user belongs to.
- **Input Validation:**
  - Uses Joi for robust input validation on request bodies.
- **Error Handling:**
  - Centralized error handling for consistent API responses.
- **Database Setup:**
  - Programmatic database creation and table setup.
- **Environment Configuration:**
  - Uses `.env` files for environment-specific settings.
  
## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js:** (Version 20 or higher recommended) - [Download Node.js](https://nodejs.org/)
- **npm** or **yarn:** (Installed with Node.js)
- **MySQL:** (Version 5.7 or higher recommended) - [Download MySQL](https://www.mysql.com/

## Installation

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd translated-test
   ```

2. Install dependencies using npm or yarn:

   ```bash
   npm install
   # or
   yarn install
   ```

## Configuration

1.  **Create a `.env` file** in the root of your project.

2.  **Add your MySQL database connection details** to the `.env` file. Replace the placeholder values with your actual credentials:

    ```env
    PORT=3000
    DB_HOST=localhost
    DB_USER=your_mysql_user
    DB_PASSWORD=your_mysql_password
    DB_DATABASE=user_management
    ```

    - `PORT`: The port the API will run on (default is 3000).
    - `DB_HOST`: The hostname or IP address of your MySQL server.
    - `DB_USER`: Your MySQL username.
    - `DB_PASSWORD`: Your MySQL password.
    - `DB_DATABASE`: The name of the MySQL database to use (should be `user_management`).

2. **Port Configuration (Optional):**
   - You can configure the server port in the `.env` file:

     ```env
     PORT=3000
     ```
   - If not specified, the application will likely use a default port defined in your `config.ts` file.

## Running the Application

1. **Start the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   This command usually uses `nodemon` to watch for file changes and restart the server automatically.

2. **Start the production server:**

   ```bash
   npm start
   # or
   yarn start
   ```

   Make sure you have built your project for production (e.g., `npm run build` or `yarn build`) before running this command.

## Database Setup

The application attempts to create the `user_management` database and necessary tables automatically on startup if they don't exist.


If you encounter issues with automatic setup, you can manually create the database and tables using a MySQL client (like MySQL Workbench or the command line). The SQL schema is as follows:

```sql
CREATE DATABASE IF NOT EXISTS user_management;
USE user_management;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  surname VARCHAR(255) NOT NULL,
  birth_date DATE NOT NULL,
  sex ENUM('male', 'female', 'other') NOT NULL,
  INDEX name_idx (name),
  INDEX surname_idx (surname)
);

CREATE TABLE IF NOT EXISTS groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  INDEX name_idx (name)
);

CREATE TABLE IF NOT EXISTS user_groups (
  user_id INT NOT NULL,
  group_id INT NOT NULL,
  PRIMARY KEY (user_id, group_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);
```

## API Documentation

The API endpoints are described below. All endpoints are relative to the base URL (e.g., `http://localhost:3000`).

### Users

#### POST /users

**Description:** Creates a new user.

**Request Body:**

```json
{
  "name": "John",
  "surname": "Doe",
  "birth_date": "2000-01-01",
  "sex": "male"
}
```

**Response:**

- **201 Created:**
  ```json
  {
    "id": 123,
    "message": "User created successfully"
  }
  ```
- **400 Bad Request:** If validation fails (e.g., missing required fields, invalid date format).
- **500 Internal Server Error:** If there's a server error.

#### GET /users/:id

**Description:** Gets a user by ID.

**Path Parameter:** `id` (integer) - The ID of the user to retrieve.

**Response:**

- **200 OK:**
  ```json
  {
    "id": 123,
    "name": "John",
    "surname": "Doe",
    "birth_date": "2000-01-01T00:00:00.000Z",
    "sex": "male"
  }
  ```
- **404 Not Found:** If the user with the given ID is not found.
- **500 Internal Server Error:** If there's a server error.

#### GET /users

**Description:** Gets all users with optional pagination.

**Query Parameters:**

- `page` (integer, optional): The page number to retrieve. Defaults to `1`.
- `limit` (integer, optional): The number of users to retrieve per page. Defaults to `10`.

**Explanation:**

This endpoint supports pagination to efficiently retrieve a large number of users. You can use the `page` and `limit` query parameters to control the number of users returned and the specific page you want to view.

- **Without Pagination:** If no `page` or `limit` parameters are provided, the endpoint will return the first 10 users.

- **With Pagination:** If `page` and `limit` are provided, the endpoint will return a subset of users based on those parameters, along with pagination metadata.

**Response:**

- **200 OK:**
  - **Without Pagination:**
    ```json
    [
      {
        "id": 123,
        "name": "John",
        "surname": "Doe",
        "birth_date": "2000-01-01T00:00:00.000Z",
        "sex": "male"
      },
      // ... up to 10 users
    ]
    ```
  - **With Pagination:**
    ```json
    {
      "users": [
        // Users for the requested page
      ],
      "totalCount": 50,
      "totalPages": 5,
      "currentPage": 1
    }
    ```
- **500 Internal Server Error:** If there's a server error.

#### PUT /users/:id

**Description:** Updates an existing user.

**Path Parameter:** `id` (integer) - The ID of the user to update.

**Request Body:** (Optional fields to update)

```json
{
  "name": "Jane",
  "birth_date": "1995-05-05"
}
```

**Response:**

- **200 OK:**
  ```json
  {
    "message": "User updated successfully"
  }
  ```
- **400 Bad Request:** If validation fails (e.g., invalid date format).
- **404 Not Found:** If the user with the given ID is not found.
- **500 Internal Server Error:** If there's a server error.

#### DELETE /users/:id

**Description:** Deletes a user by ID.

**Path Parameter:** `id` (integer) - The ID of the user to delete.

**Response:**

- **204 No Content:** If the user is successfully deleted.
- **404 Not Found:** If the user with the given ID is not found.
- **500 Internal Server Error:** If there's a server error.

### Groups

#### POST /groups

**Description:** Creates a new group.

**Request Body:**

```json
{
  "name": "Admin"
}
```

**Response:**

- **201 Created:**
  ```json
  {
    "id": 456,
    "message": "Group created successfully"
  }
  ```
- **400 Bad Request:** If validation fails (e.g., missing name).
- **500 Internal Server Error:** If there's a server error.

#### GET /groups/:id

**Description:** Gets a group by ID.

**Path Parameter:** `id` (integer) - The ID of the group to retrieve.

**Response:**

- **200 OK:**
  ```json
  {
    "id": 456,
    "name": "Admin"
  }
  ```
- **404 Not Found:** If the group with the given ID is not found.
- **500 Internal Server Error:** If there's a server error.

#### GET /groups

**Description:** Gets all groups.

**Response:**

- **200 OK:**
  ```json
  [
    {
      "id": 456,
      "name": "Admin"
    },
    {
      "id": 789,
      "name": "Moderator"
    }
    // ... more groups
  ]
  ```
- **500 Internal Server Error:** If there's a server error.

#### PUT /groups/:id

**Description:** Updates an existing group.

**Path Parameter:** `id` (integer) - The ID of the group to update.

**Request Body:** (Optional fields to update)

```json
{
  "name": "Super Admin"
}
```

**Response:**

- **200 OK:**
  ```json
  {
    "message": "Group updated successfully"
  }
  ```
- **400 Bad Request:** If validation fails (e.g., empty name).
- **404 Not Found:** If the group with the given ID is not found.
- **500 Internal Server Error:** If there's a server error.

#### DELETE /groups/:id

**Description:** Deletes a group by ID.

**Path Parameter:** `id` (integer) - The ID of the group to delete.

**Response:**

- **204 No Content:** If the group is successfully deleted.
- **404 Not Found:** If the group with the given ID is not found.
- **500 Internal Server Error:** If there's a server error.

### User Groups

#### POST /user-groups

**Description:** Adds a user to a group.

**Request Body:**

```json
{
  "user_id": 123,
  "group_id": 456
}
```

**Response:**

- **201 Created:**
  ```json
  {
    "message": "User added to group successfully"
  }
  ```
- **400 Bad Request:** If validation fails (e.g., missing user_id or group_id).
- **500 Internal Server Error:** If there's a server error.

#### DELETE /user-groups

**Description:** Removes a user from a group.

**Request Body:**

```json
{
  "user_id": 123,
  "group_id": 456
}
```

**Response:**

- **204 No Content:** If the user is successfully removed from the group.
- **404 Not Found:** If the user or group doesn't exist or the association doesn't exist.
- **500 Internal Server Error:** If there's a server error.

## Testing

To run the tests, use the following command:

```bash
npm test
# or
yarn test
```

Ensure you have your test environment configured correctly.