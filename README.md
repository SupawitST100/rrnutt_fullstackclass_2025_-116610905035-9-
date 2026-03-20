# 🌏 Travel Booking System

ระบบจองการท่องเที่ยวออนไลน์ สร้างด้วย Angular 21 + Express.js + PostgreSQL

## โครงสร้างโปรเจกต์

```
travel-booking/
├── src/                    # Angular Frontend
│   └── app/
│       ├── components/     # UI Components
│       ├── services/       # API & Auth Services
│       ├── models/         # TypeScript Interfaces
│       └── guards/         # Route Guards
├── backend/                # Express.js Backend
│   ├── routes/             # API Routes
│   ├── middleware/         # Auth Middleware
│   ├── db.js               # PostgreSQL Connection
│   ├── server.js           # Main Server
│   └── seed.sql            # Database Schema + Seed Data
└── README.md
```

## วิธีติดตั้งและรัน

### 1. PostgreSQL Setup

```bash
# สร้าง database
createdb travel_booking

# รัน seed (สร้างตารางและข้อมูลตัวอย่าง)
psql -d travel_booking -f backend/seed.sql
```

### 2. Backend (Express.js)

```bash
cd backend
cp .env.example .env        # แก้ไข DB_PASSWORD ให้ตรง
npm install
npm run dev                 # รันที่ port 3000
```

### 3. Frontend (Angular)

```bash
# กลับไปที่ root
npm install
ng serve                    # รันที่ port 4200
```

## บัญชีทดสอบ

| บทบาท | อีเมล | รหัสผ่าน |
|-------|-------|----------|
| Admin | admin@travel.com | admin1234 |
| User | somchai@email.com | 1234 |
| User | malee@email.com | 1234 |

## API Endpoints

| Method | Path | คำอธิบาย |
|--------|------|----------|
| POST | /api/auth/register | สมัครสมาชิก |
| POST | /api/auth/login | เข้าสู่ระบบ |
| GET | /api/destinations | รายการสถานที่ |
| GET | /api/packages | รายการแพ็กเกจ |
| GET | /api/flights | รายการเที่ยวบิน |
| GET | /api/hotels | รายการโรงแรม |
| GET | /api/bookings/my | การจองของฉัน (Auth) |
| POST | /api/bookings | สร้างการจอง (Auth) |
| POST | /api/payments | ชำระเงิน (Auth) |
| GET | /api/reviews | รายการรีวิว |
| POST | /api/reviews | สร้างรีวิว (Auth) |

## Technology Stack

- **Frontend**: Angular 21, Bootstrap 5, Bootstrap Icons, SCSS
- **Backend**: Express.js 4, Node.js
- **Database**: PostgreSQL
- **Auth**: JWT + bcryptjs
