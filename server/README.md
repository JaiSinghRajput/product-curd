# Productr Backend (MERN)

Express + MongoDB backend for the Productr frontend.

## Features

- OTP authentication with login by email or Indian phone
- JWT access token (1h) and refresh token (7d)
- Protected product APIs with ownership checks
- Product CRUD with status toggle
- Multipart image upload with validation
- Standard success/error response format
- MongoDB with Mongoose models

## Tech Stack

- Node.js
- Express
- MongoDB Atlas + Mongoose
- JWT
- Multer
- Joi
- Nodemailer
- Cloudinary

## API Base

- Local: `http://localhost:5000/api`

## Routes

Auth

- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/refresh-token`
- `POST /api/auth/logout`

Products

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `PATCH /api/products/:id/status`
- `DELETE /api/products/:id`

Health

- `GET /api/health`

## Setup

1. Install dependencies

```bash
pnpm install
```

2. Create `.env` in `server/` using `.env.example`

```env
PORT=5000
NODE_ENV=development
API_BASE_URL=http://localhost:5000
DB_URL=mongodb+srv://<db_user>:<db_password>@<cluster-host>/<database>?retryWrites=true&w=majority
DB_NAME=productr
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRY=3600
REFRESH_TOKEN_EXPIRY=604800
CORS_ORIGIN=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=your_email@gmail.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

If `mongodb+srv://` fails with a DNS SRV error (`querySrv ECONNREFUSED`), use the standard `mongodb://` URI from MongoDB Compass and keep `DB_NAME` set.

3. Run in development

```bash
pnpm dev
```

4. Run in production mode

```bash
pnpm start
```

## Frontend Integration

Set in frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Notes

- Uploaded images are stored in Cloudinary under `products/<userId>`
- Allowed image types: jpg, jpeg, png, webp, gif
- Max images per request: 10
- Max file size: 5MB per image
- OTP expires in 5 minutes
- OTP send limit: 5 requests per 10 minutes per user
- OTP verify lock: 15 minutes after 5 failed attempts
- OTP emails are sent using SMTP via Nodemailer
