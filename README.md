# Vero Scribe Booking Prototype

Simple React + Express booking flow with a local `lowdb` database.

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the backend and frontend in development mode:
   ```bash
   npm run start:dev
   ```

The React app will run on `http://localhost:4173` and API requests are proxied to `http://localhost:4000`.

## Available features

- Patient-facing physician selection
- Available appointment time selection
- Patient details form + reason for visit
- Admin bookings dashboard
- Booking statuses: pending, confirmed, cancelled

## Notes

- Backend storage is in `backend/db.json`
- Appointment slot availability is updated when a booking is created or cancelled
