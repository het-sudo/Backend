# Modern Backend Boilerplate (TypeScript + Express)

A robust, production-ready backend starter kit featuring a secure **Dual-Token Authentication System** (Access & Refresh Tokens) with **HTTP-only Cookie** support.

## 🚀 Features

- **🛡️ Secure Auth:** Uses JWT with both Access and Refresh tokens.
- **🍪 Automatic Login:** Implemented via HTTP-only Cookies for automatic browser/Postman handling.
- **🔄 Token Rotation:** Refresh tokens are rotated and stored in MongoDB for security.
- **🔍 Type Safe:** Built with TypeScript and Zod for environment and request validation.
- **📝 Logging:** structured logging with Winston.
- **🧱 Modular Structure:** Clean separation of concerns with Services, Controllers, and Routes.
- **✨ error Handling:** Centralized Error Middleware with a custom `ApiError` class.

## 🛠️ Tech Stack

- **Framework:** Express (Node.js)
- **Language:** TypeScript
- **Database:** MongoDB (via Mongoose)
- **Validation:** Zod
- **Authentication:** jsonwebtoken, bcrypt, cookie-parser
- **Logging:** Winston

---

## 🚦 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **pnpm** (preferred) or npm
- **MongoDB** (local or Atlas)

### 2. Environment Setup
Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string

# JWT Secrets
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

# Expiry Times
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

### 3. Installation
```bash
pnpm install
```

### 4. Start the Server
```bash
# Development mode (with auto-reload)
pnpm run dev

# Production build
pnpm run build
pnpm start
```

---

## 📁 Folder Structure

```text
src/
├── common/             # Helpers, Utils, Errors, Middlewares
├── config/             # Database, Env config
├── modules/            
│   └── auth/           # Auth Module (Service, Controller, Interface, Routes)
├── app.ts              # Express App setup
├── server.ts           # Server start point
└── index.ts            # Main API Router
```

---

## 📡 API Endpoints

### Auth Module (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/register` | Register a new user | No |
| POST | `/login` | Log in and receive tokens in cookies | No |
| POST | `/refresh-token` | Get new access token via refresh token | No (Uses Cookie) |
| POST | `/logout` | Clear cookies and revoke refresh token | Yes |

---

## 🧪 Testing with Cookies (Automated)

Instead of manually adding `Authorization` headers, this project uses **HTTP-only Cookies**:

1. Use **Postman** to send a LOGIN request.
2. The server will send back two cookies: `accessToken` and `refreshToken`.
3. Postman will automatically save these.
4. For all future requests (like `logout`), **you don't need to do anything!** Postman will send the cookies automatically.

---

## 🔒 Security Notes
- Cookies are marked `HttpOnly` to prevent XSS attacks.
- In production, cookies are automatically set to `Secure: true`.
- Tokens are stored in the database to allow for remote revocation.
