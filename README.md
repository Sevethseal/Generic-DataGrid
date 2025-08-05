# Generic DataGrid App

A full-stack, generic data table application with powerful CRUD operations, search, filtering, and AI-driven insights, built with React, AG Grid, Express.js, Supabase, and OpenAI.

---

## 📝 Table of Contents

1. [Project Overview](#project-overview)  
2. [Tech Stack](#tech-stack)  
3. [Key Features](#key-features)  
4. [Project Structure](#project-structure)  
5. [Environment Variables](#environment-variables)  
6. [Setup & Installation](#setup--installation)  
7. [Running the App](#running-the-app)  
8. [Deployment](#deployment)  
9. [Future Scope](#future-scope)  
10. [Contributing](#contributing)  
11. [License](#license)

---

## 🚀 Project Overview

This project delivers a **generic, reusable data grid** component powered by AG Grid and styled with Material UI. The front-end is a React + TypeScript client that interacts with an Express.js + TypeScript server, which in turn communicates with a PostgreSQL database hosted on Supabase. A flagship feature uses OpenAI's API to compare and analyze up to 5 AI models side-by-side.

---

## 🔧 Tech Stack

| Layer            | Technology                                  |
| ---------------- | ------------------------------------------- |
| **Frontend**     | React, TypeScript, MUI, AG Grid, CSS, Webpack |
| **Backend**      | Node.js, Express.js, TypeScript            |
| **Database**     | PostgreSQL (Supabase Cloud)                |
| **AI Integration** | OpenAI API                                |
| **Deployment**   | Render                                     |

---

## ✨ Key Features

- **Generic DataGrid Component**  
  - Dynamic column definitions  
  - Add / edit / delete rows with form validation  
  - Detail view for individual records  

- **Search & Filtering**  
  - Full-text search across table data  
  - Column-based filters  

- **CRUD Backend Service**  
  - RESTful API endpoints in Express.js  
  - Supabase-powered PostgreSQL storage  

- **OpenAI Model Comparison**  
  - Select up to 5 OpenAI models  
  - Compare performance metrics side-by-side  
  - Navigate to in-depth analysis pages  



---

## 📁 Project Structure

```
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/         # Reusable React components 
│   │   ├── pages/              # Page views 
│   │   ├── services/           # API wrappers 
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx             # Root component
│   │   └── index.tsx           # Entry point
│   ├── package.json
│   └── tsconfig.json
├── server/
│   ├── src/
│   │   ├── config/             # Supabase & Express configuration
│   │   ├── controllers/        # Request handlers
│   │   ├── models/             # Database models
│   │   ├── routes/             # Express routers
│   │   ├── services/           # Business logic
│   │   ├── middleware/         # Auth & error handlers
│   │   └── index.ts            # Server entry
│   ├── package.json
│   └── tsconfig.json
├── .env                        # Environment variables
├── webpack.config.js
└── README.md
```

---

## 🔑 Environment Variables

Create a `.env` file in the **root** directory and add:

```bash
# Supabase (backend)
EXPRESS_APP_SUPABASE_URL=<your-supabase-url>
EXPRESS_APP_SUPABASE_KEY=<your-supabase-service-key>

# OpenAI (frontend)
REACT_APP_OPENAI_API_KEY=<your-openai-api-key>
```

**Note:** Front-end vars must start with `REACT_APP_` to be picked up by Create React App.

---

## 🛠️ Setup & Installation

### Clone the repository

```bash
git clone <repository-url>
cd Generic-DataGrid
```

### Install dependencies

**Client:**

```bash
cd client
npm install
```

**Server:**

```bash
cd ../server
npm install
```

---

## ▶️ Running the App

### Start the backend (port 4000):

```bash
cd server
npm start
```

### Start the frontend (port 3000):

```bash
cd client
npm start
```

Open http://localhost:3000 in your browser.

---

## ☁️ Deployment

This project is configured for Render:

- **Server:** Dockerized Express app
- **Client:** Static build served by Render

Live Link:https://generic-datagrid.onrender.com/

---

## 🚀 Future Scope

- Natural language querying via ChatGPT
- AI-driven data summaries & predictions
- Custom report generation
- Voice-enabled interactions

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---
<img width="1342" height="611" alt="image" src="https://github.com/user-attachments/assets/18e0c006-53ff-47e6-baf0-3bcbc6654e20" />

<img width="1206" height="742" alt="image" src="https://github.com/user-attachments/assets/93b7ca15-399f-49ac-8363-c31cc5e85aca" />
<img width="1291" height="519" alt="image" src="https://github.com/user-attachments/assets/ae71a79a-d0e2-4635-8f0f-979b1497030b" />
<img width="1042" height="474" alt="image" src="https://github.com/user-attachments/assets/2225a842-687e-49ef-9a4e-5e4b3953d5e6" />
<img width="1130" height="413" alt="image" src="https://github.com/user-attachments/assets/d6e64df1-5798-4562-a07f-67ca136e10e9" />




