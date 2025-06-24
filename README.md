# 🌍 Travel Agent Backend API

This is a lightweight and fast backend service to manage **travel preferences** and **convert currencies** for users. It uses **Node.js**, **Express**, and **SQLite** as the database. You can perform CRUD operations on travel preferences using REST APIs.

## 🚀 Live Demo

API is deployed at:  
👉 **https://travel-agent-backend-i7pc.onrender.com**

---

## 📦 Features

- Add new travel preferences
- View preferences by user name
- Update existing preferences
- Delete preferences
- Convert currencies
- SQLite database with fast performance and local development ease
- RESTful endpoints following best practices

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **SQLite3**

---

## 📌 Authentication

Currently, the API uses basic API key authentication.  
For the sake of convenience, I have used a public API Key for authentication.

Header: X-API-Key your_secret_key_here
.

---

## 📂 Endpoints Overview

| Method | Endpoint         | Description                          |
|--------|------------------|--------------------------------------|
| POST   | `/preferences`   | Create a new travel preference       |
| GET    | `/preferences`   | Retrieve preferences by user number |
| PUT    | `/preferences`   | Update stored preferences            |
| DELETE | `/preferences`   | Delete a user's preferences          |
| GET    | `/convert`       | Convert currency between two codes   |

---

### 📮 POST `/preferences`

#### ➤ Create a new travel preference

**Request Body (JSON):**

```json
{
  "name": "Alice",
  "budget": "1500",
  "number": "1234567890",
  "currency": "USD",
  "destination": "Paris",
  "preferences": {
    "accommodation": "hotel",
    "activities": ["museum", "sightseeing"]
  }
}
```

**Response:**

```json
{
  "message": "Preferences saved"
}
```

### 📮 GET `/preferences?number={number}`

#### ➤ Fetch travel preferences by user number

**Query Parameters:**

| Name   | Type   | Required | Description          |
| ------ | ------ | -------- | -------------------- |
| number | string | ✅        | User's mobile number |


**Example:**

`GET /preferences?number=1234567890`


**Response (JSON):**

```json
[
  {
    "id": 1,
    "name": "Alice",
    "budget": "1500",
    "number": "1234567890",
    "currency": "USD",
    "destination": "Paris",
    "preferences": {
      "accommodation": "hotel",
      "activities": ["museum", "sightseeing"]
    },
    "created_at": "2025-06-21T15:32:00.000Z"
  }
]
```

### 📮 PUT `/preferences?number={number}`

#### ➤ Update travel preferences by user number

**Example:**

`PUT /preferences?number=1234567890`


**Request Body (JSON):**

```json
{
  "preferences": {
    "accommodation": "hostel",
    "activities": ["surfing", "hiking"]
  }
}
```

**Response:**

```json
{
  "message": "Preferences updated"
}
```


### 📮 DELETE `/preferences??number={number}`

#### ➤ Delete travel preferences by user number

**Query Parameters:**

| Name   | Type   | Required | Description          |
| ------ | ------ | -------- | -------------------- |
| number | string | ✅        | User's mobile number |


**Example:**

`DELETE /preferences?number=1234567890`


**Response (JSON):**

```json
{
  "message": "Preferences deleted"
}
```

### 💱 GET `/convert`

#### ➤ Convert currency between two ISO currency codes

**Query Parameters:**

| Name   | Type   | Required | Description                      |
| ------ | ------ | -------- | -------------------------------- |
| amount | number | ✅        | Amount to convert                |
| from   | string | ✅        | Source currency code (e.g., USD) |
| to     | string | ✅        | Target currency code (e.g., INR) |


**Example:**

`GET /convert?amount=100&from=USD&to=INR`


**Response (JSON):**

```json
{
  "original": "100 USD",
  "converted": "8315.00 INR",
  "rate": 83.15
}

```


## 🔧 Setup Instructions
#### 1. Clone the Repo
```
git clone https://github.com/yourusername/travel-agent-backend.git
cd travel-agent-backend
```
#### 2. Install Dependencies
```
npm install
```
#### 3. Setup Environment Variables
Create a .env file:
```env
API_KEY=your_secret_key_here
```
#### 4. Start the Server
```
node server.js
```
Server will start at http://localhost:3000.

