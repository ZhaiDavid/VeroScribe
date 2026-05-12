# Vero Scribe Booking Prototype

Simple React + Express booking flow with a local `lowdb` database.

## Technical Decisions

I chose React because the prototype depends on several changing states, such as booking statuses, appointment times and form inputs. 
The application is also component-heavy, and React allows for the organization and management of reusable interface elements such as appointment cards, dashboard views and booking forms. 

## Future Improvements

Besides a more robust authentication system and backend, I would implement the following features to improve communication between physicians and patients: 
   - An autofill/AI assistant to help patients describe their symptoms and reason for visit in greater detail
   - An AI overview system that summarizes patient concerns and relevant visit history for physicians before the consultation begins

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
- User authentication for patients and physicians 
- Patient-facing physician selection
  - Available appointment time selection
  - Patient details form + reason for visit
- physician bookings dashboard
- Booking statuses: pending, confirmed, cancelled

## Demo accounts
Patient Account  
Email: john@example.com  
Password: patient123  

physician Account  
Email: maya@hospital.com  
Password: doc123  

## Notes

- Backend storage is in `backend/db.json`
- Appointment slot availability is updated when a booking is created or cancelled
