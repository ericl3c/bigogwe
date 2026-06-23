# Bigogwe Eco-Cultural Tourism - Booking System Setup Guide

## Backend Setup

### 1. Database Setup
Ensure MySQL is running and create the database using the provided SQL file:
```sql
-- Run bigogwe_db.sql to create tables
-- Tables: bookings, gallery, users
```

### 2. Environment Configuration
Backend `.env` file is configured at `backend/.env`:
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=bigogwe_db
DB_USER=root
DB_PASS=
JWT_SECRET=bigogwe_secret_key_change_in_production
PORT=5000
```

### 3. Install Dependencies
```bash
cd project/backend
npm install
```

### 4. Start Backend Server
```bash
# Development mode with nodemon
npm run dev

# OR production mode
npm start
```

Server will run on: **http://localhost:5000**

---

## Frontend Setup

### 1. Install Dependencies
```bash
cd project/frontend
npm install
```

### 2. Start Frontend Application
```bash
npm start
```

Frontend will run on: **http://localhost:3000**

---

## API Endpoints Available

### Bookings
- **POST** `/api/bookings` - Create a new booking
  ```json
  {
    "fullname": "John Doe",
    "email_address": "john@example.com",
    "phone_number": "+250788123456",
    "visitor_category": "international",
    "select_activities": "Hiking",
    "booking_date": "2026-06-15"
  }
  ```

- **GET** `/api/bookings` - Retrieve all bookings
- **GET** `/api/bookings/:id` - Retrieve specific booking

### Gallery
- **POST** `/api/gallery` - Add gallery image
  ```json
  {
    "image": "https://example.com/image.jpg",
    "description": "Mountain hiking experience",
    "date_added": "2026-06-09"
  }
  ```
- **GET** `/api/gallery` - Get all gallery images
- **DELETE** `/api/gallery/:id` - Delete gallery image

### Authentication
- **POST** `/api/auth/register` - Register new admin/guide
  ```json
  {
    "name_user": "Admin Name",
    "email": "admin@bigogwe.com",
    "password": "securepassword",
    "role": "ceo"
  }
  ```
- **POST** `/api/auth/login` - Login
  ```json
  {
    "email": "admin@bigogwe.com",
    "password": "securepassword"
  }
  ```

---

## Features Implemented

### Backend
✅ Booking creation with validation (fullname, email, phone, category, activities, date)
✅ Gallery management (Create, Read, Delete)
✅ User authentication (Register, Login with JWT)
✅ Database models aligned with SQL schema
✅ Error handling and response messages

### Frontend
✅ Booking form with all required fields
✅ Form validation and error messages
✅ API integration with backend
✅ Loading states and success/error feedback
✅ Form reset on successful submission
✅ Responsive design maintained

---

## Database Schema

### bookings table
- booking_id (PRIMARY KEY, AUTO_INCREMENT)
- fullname (VARCHAR 100, NOT NULL)
- email_address (VARCHAR 100, NOT NULL)
- phone_number (VARCHAR 20, NOT NULL)
- visitor_category (VARCHAR 50, NOT NULL)
- select_activities (VARCHAR 255, NOT NULL)
- booking_date (DATE, NOT NULL)
- created_at (TIMESTAMP)

### gallery table
- gallery_id (PRIMARY KEY, AUTO_INCREMENT)
- image (VARCHAR 255, NOT NULL)
- description (TEXT, NULLABLE)
- date_added (DATE, NOT NULL)
- created_at (TIMESTAMP)

### users table
- id (PRIMARY KEY, AUTO_INCREMENT)
- name_user (VARCHAR 100, NOT NULL)
- email (VARCHAR 100, UNIQUE, NOT NULL)
- password (VARCHAR 255, NOT NULL)
- role (ENUM 'ceo', 'Tour_Guide')
- created_at (TIMESTAMP)

---

## Testing the Booking System

1. **Start Backend**: `npm run dev` (from backend folder)
2. **Start Frontend**: `npm start` (from frontend folder)
3. **Navigate** to http://localhost:3000/booking
4. **Fill Form**:
   - Full Name: John Doe
   - Email: john@example.com
   - Phone: +250788123456
   - Visitor Category: International Visitor
   - Activity: Hiking
   - Date: Select today or future date
5. **Submit** - Should see success message and data in database

---

## Troubleshooting

### Backend won't start
- Check MySQL is running
- Verify .env database credentials
- Run `npm install` in backend folder
- Clear node_modules and reinstall if needed

### Frontend API errors
- Ensure backend is running on port 5000
- Check browser console for network errors
- Verify CORS is enabled in backend

### Database connection fails
- Verify MySQL credentials in .env
- Ensure bigogwe_db database exists
- Run the SQL setup file to create tables

