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

- **Node.js:** (Version 16 or higher recommended) - [Download Node.js](https://nodejs.org/)
- **npm** or **yarn:** (Installed with Node.js)
- **MySQL:** (Version 5.7 or higher recommended) - [Download MySQL](https://www.mysql.com/downloads/)

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```

2.  **Install dependencies:**

    ```bash
    npm install  # or yarn install
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

## Running the Application

1.  **Start the development server:**

    ```bash
    npm run dev  # or yarn dev
    ```

    This will start the server with hot-reloading, making it convenient for development.

2.  **Build and start the production server:**

    ```bash
    npm run build
    npm start
    ```

    This will build the TypeScript code and then run the compiled JavaScript.

## Database Setup

The application attempts to create the `user_management` database and necessary tables automatically on startup if they don't exist.

**Important:** Ensure the MySQL user specified in your `.env` file has the `CREATE DATABASE` privilege.

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

The API endpoints are as follows:

### Users

Base URL: `/users`

| Method | Endpoint   | Description                                 | Request Body                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Response Body (Success)                                                                                                                               | Response Body (Error)                                                                                                                               |
| :----- | :--------- | :------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/`        | Create a new user                           | `{ "name": "string", "surname": "string", "birth_date": "YYYY-MM-DD", "sex": "male" \| "female" \| "other" }`                                                                                                                                                                                                                                                                                                                                                      | `{ "id": number, "message": "User created successfully" }`                                                                                             | `{ "message": "Failed to create user", "error": "string" }` (500), `{ "message": "Validation error", "error": "string" }` (400)                         |
| GET    | `/:id`     | Get a user by ID                            | None                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `User object`                                                                                                                                          | `{ "message": "User with ID [id] not found" }` (404), `{ "message": "Failed to get user", "error": "string" }` (500)                                |
| GET    | `/`        | Get all users                             | None                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `Array of User objects`                                                                                                                                | `{ "message": "Failed to retrieve users", "error": "string" }` (500)                                                                                 |
| PUT    | `/:id`     | Update a user by ID                         | `{ "name"?: "string", "surname"?: "string", "birth_date"?: "YYYY-MM-DD", "sex"?: "male" \| "female" \| "other" }` (All fields are optional)                                                                                                                                                                                                                                                                                                                       | `{ "message": "User with ID [id] updated successfully" }`                                                                                             | `{ "message": "User with ID [id] not found" }` (404), `{ "message": "Failed to update user", "error": "string" }` (500), `{ "message": "Validation error", "error": "string" }` (400)                         |
| DELETE | `/:id`     | Delete a user by ID                         | None                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `204 No Content`                                                                                                                                     | `{ "message": "User with ID [id] not found" }` (404), `{ "message": "Failed to delete user", "error": "string" }` (500)                                |

### Groups

Base URL: `/groups`

| Method | Endpoint   | Description                                | Request Body           | Response Body (Success)                                  | Response Body (Error)                                                              |
| :----- | :--------- | :----------------------------------------- | :--------------------- | :------------------------------------------------------- | :--------------------------------------------------------------------------------- |
| POST   | `/`        | Create a new group                         | `{ "name": "string" }` | `{ "id": number, "message": "Group created successfully" }` | `{ "message": "Failed to create group", "error": "string" }` (500), `{ "message": "Validation error", "error": "string" }` (400) |
| GET    | `/:id`     | Get a group by ID                          | None                   | `Group object`                                           | `{ "message": "Group with ID [id] not found" }` (404), `{ "message": "Failed to get group", "error": "string" }` (500)             |
| GET    | `/`        | Get all groups                           | None                   | `Array of Group objects`                                 | `{ "message": "Failed to get groups", "error": "string" }` (500)                 |
| PUT    | `/:id`     | Update a group by ID                       | `{ "name"?: "string" }` | `{ "message": "Group with ID [id] updated successfully" }` | `{ "message": "Group with ID [id] not found" }` (404), `{ "message": "Failed to update group", "error": "string" }` (500), `{ "message": "Validation error", "error": "string" }` (400) |
| DELETE | `/:id`     | Delete a group by ID                       | None                   | `204 No Content`                                         | `{ "message": "Group with ID [id] not found" }` (404), `{ "message": "Failed to delete group", "error": "string" }` (500)             |

### User Groups

Base URL: `/user-groups`

| Method | Endpoint              | Description                                  | Request Body                      | Response Body (Success)                                | Response Body (Error)                                                              |
| :----- | :-------------------- | :------------------------------------------- | :-------------------------------- | :----------------------------------------------------- | :--------------------------------------------------------------------------------- |
| POST   | `/join`              | Add a user to a group                        | `{ "user_id": number, "group_id": number }` | `{ "message": "User added to group successfully" }` | `{ "message": "Failed to add user to group", "error": "string" }` (500), `{ "message": "Validation error", "error": "string" }` (400) |
| DELETE | `/leave`             | Remove a user from a group                     | `{ "user_id": number, "group_id": number }` | `{ "message": "User removed from group successfully" }` | `{ "message": "Failed to remove user from group", "error": "string" }` (500), `{ "message": "Validation error", "error": "string" }` (400) |
| GET    | `/group/:group_id/users` | Get all users in a specific group           | None                              | `Array of User IDs`                                    | `{ "message": "Failed to get users in group", "error": "string" }` (500)          |
| GET    | `/user/:user_id/groups` | Get all groups a specific user belongs to | None                              | `Array of Group IDs`                                   | `{ "message": "Failed to get groups for user", "error": "string" }` (500)         |

## Testing

You can run the unit tests using the following command:

```bash
npm test  # or yarn test
```