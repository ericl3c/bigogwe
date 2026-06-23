# Deployment Guide

This project has two deployable parts:

- `backend`: Node.js/Express API with MySQL
- `frontend`: React static build

## Required Services

You need:

- Node.js hosting for the backend
- MySQL database hosting
- Static hosting for the frontend

You can deploy both on one VPS, or deploy them separately. For example, the backend can run on a Node host and the frontend can run on static hosting.

## Backend Environment Variables

Set these variables in your production backend host:

```env
DB_HOST=your_mysql_host
DB_PORT=3306
DB_NAME=bigogwe_db
DB_USER=your_mysql_user
DB_PASS=your_mysql_password
JWT_SECRET=use_a_long_random_secret
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

Do not use the local `.env` values in production.

## Backend Deploy Commands

From the `backend` folder:

```bash
npm install
npm start
```

The backend entry point is:

```bash
backend/server.js
```

If your host asks for a start command, use:

```bash
npm start
```

## Database

Create a MySQL database, then import the SQL file from the project root:

```bash
mysql -h your_mysql_host -u your_mysql_user -p bigogwe_db < bigogwe_db.sql
```

The backend also runs Sequelize sync on startup.

## Frontend Environment Variables

Set this before building the frontend:

```env
REACT_APP_API_URL=https://your-backend-domain.com
```

Do not include `/api` at the end. The app adds `/api` automatically.

## Frontend Build Commands

From the `frontend` folder:

```bash
npm install
npm run build
```

Deploy the generated folder:

```bash
frontend/build
```

## Deployment Order

1. Create and configure the production MySQL database.
2. Import `bigogwe_db.sql`.
3. Deploy the backend with the production environment variables.
4. Confirm the backend responds at `https://your-backend-domain.com/api/...`.
5. Set `REACT_APP_API_URL` for the frontend.
6. Build and deploy `frontend/build`.
7. Test booking, contact form, gallery loading, admin login, and image upload.

