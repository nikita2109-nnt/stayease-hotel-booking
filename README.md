# StayEase – Hotel Booking Portal

A full-stack hotel booking portal built to simplify hotel reservations and provide a coupon-based discount experience. StayEase allows customers to explore hotels, check room availability, book rooms, apply discount coupons, and manage their reservations. It also provides a separate admin dashboard for coupon management.

## Features

### Customer Portal
- Browse available hotels.
- Search hotels by location.
- View hotel details, amenities, room types, and prices.
- Check room availability for selected dates.
- Book hotel rooms without creating a customer account.
- View available discount coupons.
- Apply or remove coupons during booking.
- View booking confirmation and unique booking reference.
- Retrieve bookings using booking reference and email address.
- Cancel eligible confirmed bookings.

### Admin Dashboard
- Secure admin login using JWT authentication.
- Protected admin dashboard.
- View coupon statistics.
- Create discount coupons.
- View existing coupons.
- Delete coupons that have never been redeemed.
- Track coupon usage and redemption statistics.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript, CSS |
| Backend | Node.js, Express.js |
| Database | MySQL |
| API Communication | Axios, REST APIs |
| Authentication | JWT, bcrypt |
| Routing | React Router DOM |
| Icons | Lucide React |
| API Testing | Postman |
| Version Control | Git and GitHub |

## Project Architecture

StayEase follows a frontend-backend architecture.

- **Frontend:** Handles the user interface, navigation, form handling, and API communication.
- **Backend:** Handles business logic, authentication, booking operations, coupon validation, and database operations.
- **Database:** Stores hotel information, room types, bookings, administrators, coupons, and coupon usage history.

## Project Structure

```text
stayease-hotel-booking/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   ├── config/
│   ├── models/
│   ├── services/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── tests/
│   ├── server.js
│   └── package.json
│
├── database/
│   ├── schema.sql
│   ├── seed.sql
│  
│
├── docs/
├── screenshots/
├── README.md
└── .gitignore
```

## Database Design

The application uses MySQL with the following main tables:

- **admins:** Stores administrator account information.
- **hotels:** Stores hotel details and information.
- **room_types:** Stores room categories, prices, and room capacity.
- **bookings:** Stores customer reservation details and booking amounts.
- **coupons:** Stores coupon codes, discount rules, validity, and usage limits.
- **coupon_usages:** Maintains coupon redemption and release history.

## Booking and Coupon Logic

### Booking Calculation

The booking subtotal is calculated using:

`Subtotal = Price Per Night × Total Nights`

### Discount Calculation

StayEase supports two discount types:

**Percentage Discount**

`Discount = Subtotal × Discount Percentage / 100`

**Fixed Discount**

A predefined fixed amount is deducted from the booking subtotal.

The system also supports minimum booking amounts and maximum discount limits.

### Coupon Usage Management

- Only eligible and active coupons can be applied.
- Each booking can use one coupon.
- Coupon usage is updated when a booking is confirmed.
- Coupon usage is restored when an eligible booking is cancelled.
- Previously redeemed coupons cannot be deleted, preserving usage history.

### Booking Concurrency

The backend uses MySQL transactions and row-level locking to protect room availability and coupon usage during simultaneous booking requests.

## API Modules

| Module | Main Endpoints |
|---|---|
| Hotels | `GET /api/hotels` |
| Hotel Search | `GET /api/hotels/search` |
| Hotel Details | `GET /api/hotels/:id` |
| Room Availability | `GET /api/hotels/:id/availability` |
| Create Booking | `POST /api/bookings` |
| Booking Lookup | `POST /api/bookings/lookup` |
| Cancel Booking | `POST /api/bookings/cancel` |
| Admin Login | `POST /api/admin/login` |
| Admin Profile | `GET /api/admin/profile` |
| Available Coupons | `GET /api/coupons/available` |
| View Coupons | `GET /api/coupons` |
| Create Coupon | `POST /api/coupons` |
| Update Coupon | `PUT /api/coupons/:id` |
| Deactivate Coupon | `PATCH /api/coupons/:id/deactivate` |
| Delete Coupon | `DELETE /api/coupons/:id` |

## Installation and Setup

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MySQL Server
- MySQL Workbench (recommended)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/nikita2109-nnt/stayease-hotel-booking.git

cd stayease-hotel-booking
```

### 2. Database Setup

1. Open MySQL Workbench.
2. Execute `database/schema.sql` to create the database and tables.
3. Execute `database/seed.sql` to insert sample data.

Verify that the `stayease_db` database has been created successfully.

### 3. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file using `.env.example` as a reference.

Configure the required database credentials and authentication settings.

Start the backend:

```bash
npm run dev
```

The backend runs on:

`http://localhost:5000`

### 4. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend runs on:

`http://localhost:5173`

## Application Access

| Section | URL |
|---|---|
| Customer Homepage | `http://localhost:5173/` |
| Explore Hotels | `http://localhost:5173/hotels` |
| My Booking | `http://localhost:5173/my-booking` |
| Admin Login | `http://localhost:5173/admin/login` |
| Admin Dashboard | `http://localhost:5173/admin/dashboard` |

The customer portal does not require registration. Customers can retrieve reservations using their booking reference and email address.

The admin dashboard requires administrator authentication.

## Security and Data Integrity

- Passwords are stored using bcrypt hashing.
- JWT authentication protects administrator APIs.
- Protected frontend routes restrict dashboard navigation.
- Backend authorization validates administrator access.
- MySQL transactions maintain booking consistency.
- Row-level locking helps prevent overbooking and coupon over-redemption.
- Backend validation ensures that coupon and booking calculations cannot rely solely on frontend values.

## Testing

API testing and functional verification are performed during development.

The project includes a backend `tests/` directory for testing-related files.

Further end-to-end testing and test coverage verification are part of the final project validation.

## Project Status

The core customer booking flow, administrator authentication, coupon management, and booking cancellation functionality have been implemented.

The project is currently undergoing final development review, documentation, and end-to-end testing.

## Future Enhancements

- Online payment integration.
- Customer registration and login.
- Customer booking history.
- Advanced hotel filtering and sorting.
- Email booking confirmations.
- Enhanced admin analytics.
- Improved mobile responsiveness.

## Repository

GitHub: https://github.com/nikita2109-nnt/stayease-hotel-booking

## AI Usage Disclosure

AI tools were used as development assistance for understanding concepts, debugging, implementation guidance, and documentation support. The project code, integration, testing, and final implementation were reviewed and carried out as part of the development process.

## Author

**Nikita Thakur**

GitHub: https://github.com/nikita2109-nnt
