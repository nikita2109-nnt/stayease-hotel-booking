# StayEase – Design Documentation

## 1. Project Overview

StayEase is a full-stack hotel booking portal developed to simplify hotel reservations and provide customers with a convenient booking experience.

The application allows customers to browse hotels, search by location, check room availability, book rooms, apply discount coupons, retrieve existing reservations, and cancel eligible bookings.

The application also includes an administrator dashboard for managing discount coupons.

### 1.1 Project Objectives

- Provide a simple and user-friendly hotel booking experience.
- Allow customers to book rooms without creating an account.
- Maintain accurate room availability.
- Prevent overbooking during simultaneous booking requests.
- Introduce a surprise coupon feature to provide booking discounts.
- Provide an administrator interface for coupon management.

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, JavaScript, CSS |
| Frontend Build Tool | Vite |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Database Driver | mysql2 |
| API Communication | Axios, REST APIs |
| Routing | React Router DOM |
| Authentication | JWT |
| Password Hashing | bcrypt |
| Icons | Lucide React |
| API Testing | Postman |
| Version Control | Git and GitHub |

## 3. System Architecture

StayEase follows a three-layer architecture consisting of the frontend, backend, and database.

### 3.1 Frontend Layer

The frontend is developed using React.js.

It is responsible for:

- Displaying hotel information.
- Collecting customer booking details.
- Displaying room availability.
- Showing available coupons.
- Calculating estimated booking discounts.
- Retrieving and displaying booking information.
- Providing the administrator dashboard.

The frontend communicates with the backend through REST APIs using Axios.

### 3.2 Backend Layer

The backend is developed using Node.js and Express.js.

It handles:

- API request processing.
- Hotel and room information.
- Booking creation and cancellation.
- Availability validation.
- Coupon validation and discount calculation.
- Administrator authentication.
- Database transactions and concurrency control.

The backend follows a structured organization using routes, controllers, services, and models.

### 3.3 Database Layer

MySQL is used to persist application data.

It stores:

- Administrator information.
- Hotel information.
- Room types.
- Customer bookings.
- Coupon information.
- Coupon redemption history.

### 3.4 Architecture Flow

```text
             CUSTOMER / ADMIN
                    |
                    v
              REACT FRONTEND
                    |
                  AXIOS
                    |
                    v
              EXPRESS SERVER
                    |
                ROUTES LAYER
                    |
             CONTROLLERS LAYER
                    |
              SERVICES LAYER
                    |
               MODELS LAYER
                    |
                    v
                 MYSQL DB
```

## 4. Project Structure

The project is organized into separate frontend, backend, database, documentation, and screenshot directories.

### 4.1 Frontend

- `components/` – Reusable UI components.
- `pages/` – Customer and administrator pages.
- `services/` – Functions for communicating with backend APIs.
- `App.jsx` – Application routing.
- `main.jsx` – React application entry point.

### 4.2 Backend

- `config/` – Database connection configuration.
- `models/` – Database queries and data access.
- `services/` – Business logic.
- `controllers/` – Request and response handling.
- `routes/` – API endpoint definitions.
- `middleware/` – Authentication and authorization.
- `tests/` – Testing-related files.
- `server.js` – Backend application entry point.

### 4.3 Database

- `schema.sql` – Database and table definitions.
- `seed.sql` – Sample data.

## 5. Database Design

StayEase uses a relational MySQL database named `stayease_db`. The database contains six main tables.

### 5.1 Admins

Stores administrator account information.

Important fields:

- `id` – Primary key.
- `username` – Unique administrator username.
- `password_hash` – Hashed administrator password.
- `is_active` – Administrator account status.
- `created_at` – Account creation timestamp.

### 5.2 Hotels

Stores hotel information.

Important fields:

- `id` – Primary key.
- `name` – Hotel name.
- `location` – Hotel location.
- `description` – Hotel description.
- `amenities` – JSON field containing hotel amenities.
- `image_url` – Hotel image URL.
- `created_at` – Creation timestamp.

An index is created on the location field to support hotel location searches.

### 5.3 Room Types

Stores room category and capacity information.

Important fields:

- `id` – Primary key.
- `hotel_id` – Foreign key referencing `hotels`.
- `room_name` – Room category.
- `price_per_night` – Room price.
- `total_rooms` – Total capacity for the room type.

Each room type belongs to a hotel. The combination of hotel ID and room name is unique.

### 5.4 Coupons

Stores coupon configuration and usage limits.

Important fields:

- `id` – Primary key.
- `created_by` – Foreign key referencing `admins`.
- `code` – Unique coupon code.
- `description` – Coupon description.
- `discount_type` – `PERCENTAGE` or `FIXED`.
- `discount_value` – Discount amount or percentage.
- `max_discount` – Maximum permitted discount.
- `min_booking_amount` – Minimum booking subtotal.
- `usage_limit` – Maximum permitted redemptions.
- `usage_count` – Current redemption count.
- `start_date` – Coupon validity start.
- `expiry_date` – Coupon expiry.
- `is_active` – Coupon activation status.
- `created_at` – Creation timestamp.

### 5.5 Bookings

Stores customer reservation information.

Important fields:

- `id` – Primary key.
- `booking_reference` – Unique booking reference.
- `room_type_id` – Foreign key referencing `room_types`.
- `customer_name` – Customer name.
- `customer_email` – Customer email.
- `check_in` – Check-in date.
- `check_out` – Check-out date.
- `total_nights` – Total reservation nights.
- `subtotal` – Original booking amount.
- `coupon_id` – Optional foreign key referencing `coupons`.
- `coupon_code_snapshot` – Original coupon code.
- `discount_type_snapshot` – Original discount type.
- `discount_value_snapshot` – Original discount value.
- `discount_amount` – Applied discount.
- `final_amount` – Final booking amount.
- `status` – `CONFIRMED` or `CANCELLED`.
- `created_at` – Booking creation timestamp.

Coupon snapshots preserve important discount information associated with a booking. The coupon foreign key uses `ON DELETE SET NULL`, so a coupon record can be deleted without deleting its associated booking.

### 5.6 Coupon Usages

Stores coupon redemption and release history.

Important fields:

- `id` – Primary key.
- `coupon_id` – Foreign key referencing `coupons`.
- `booking_id` – Unique foreign key referencing `bookings`.
- `status` – `REDEEMED` or `RELEASED`.
- `redeemed_at` – Redemption timestamp.
- `released_at` – Release timestamp.

This table maintains a history of coupon usage independently of the current coupon usage count.

## 6. Database Relationships and Constraints

### 6.1 Relationships

1. **Hotels to Room Types:** One-to-many. A hotel can have multiple room types.
2. **Room Types to Bookings:** One-to-many. A room type can be associated with multiple bookings.
3. **Admins to Coupons:** One-to-many. An administrator can create multiple coupons.
4. **Coupons to Coupon Usages:** One-to-many. A coupon can have multiple usage records.
5. **Bookings to Coupon Usages:** One-to-zero-or-one. Each booking can have at most one coupon usage record because `booking_id` is unique.
6. **Coupons to Bookings:** One-to-many optional relationship. A booking may have one coupon or no coupon.

### 6.2 Important Database Constraints

- Hotel location has an index for search operations.
- Room prices and total room capacity must be positive.
- A hotel cannot have duplicate room names within the same hotel.
- Coupon codes and booking references are unique.
- Coupon discount values must be positive.
- Coupon usage count cannot exceed the usage limit.
- Coupon expiry must be later than its start date.
- Percentage discounts cannot exceed 100%.
- Check-out must be after check-in.
- Booking total nights must be positive.
- Booking subtotal must be positive.
- Discount amount cannot be negative or exceed the subtotal.
- Final amount must equal subtotal minus discount amount.
- Foreign keys maintain relationships between related records.

## 7. API Design

The backend exposes REST APIs for hotel information, booking operations, administrator authentication, and coupon management.

### 7.1 Hotel APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/hotels` | Retrieve hotels |
| GET | `/api/hotels/search` | Search hotels by location |
| GET | `/api/hotels/:id` | Retrieve hotel details |
| GET | `/api/hotels/:id/availability` | Check room availability |

### 7.2 Booking APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/bookings` | Create a booking |
| POST | `/api/bookings/lookup` | Retrieve a booking |
| POST | `/api/bookings/cancel` | Cancel a booking |

### 7.3 Admin APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/admin/login` | Authenticate administrator |
| GET | `/api/admin/profile` | Retrieve admin profile |

### 7.4 Coupon APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/coupons/available` | Retrieve eligible coupons |
| GET | `/api/coupons` | Retrieve all coupons |
| POST | `/api/coupons` | Create a coupon |
| PUT | `/api/coupons/:id` | Update a coupon |
| PATCH | `/api/coupons/:id/deactivate` | Deactivate a coupon |
| DELETE | `/api/coupons/:id` | Delete an unused coupon |

Administrator coupon management endpoints are protected using JWT authentication. The available coupons endpoint is public. The backend includes update and deactivate endpoints; these operations are not exposed as actions in the current administrator interface.

## 8. Booking Logic

### 8.1 Booking Process

The booking process follows these steps:

1. Customer selects a hotel and room type.
2. Customer provides check-in and check-out dates.
3. The frontend calculates the number of nights and displays an estimated subtotal.
4. Customer enters personal information.
5. Customer optionally applies a coupon.
6. Frontend submits the booking request.
7. Backend validates the submitted information.
8. Backend checks room availability.
9. Backend calculates the authoritative booking amount.
10. Booking is saved in the database.
11. A unique booking reference is generated and returned.

### 8.2 Booking Rules and Assumptions

1. Check-in dates cannot be earlier than the current date in Indian Standard Time.
2. Check-out must be later than check-in.
3. Total nights are calculated using the difference between check-in and check-out dates.
4. Booking subtotal is calculated using the room price multiplied by the total number of nights.
5. Only confirmed bookings are considered when calculating room availability.
6. A booking is considered overlapping when the existing check-in date is earlier than the requested check-out date and the existing check-out date is later than the requested check-in date.
7. A customer checking out on a particular date does not prevent another customer from checking in on that same date.
8. Cancelled bookings are excluded from availability calculations, releasing the reserved room capacity.
9. Customers can retrieve bookings using their booking reference and registered email address.
10. Customers can cancel confirmed bookings only before the check-in date.
11. Each booking can contain a maximum of one coupon.

### 8.3 Total Nights and Booking Amount Calculation

The number of nights is calculated using the difference between the check-out and check-in dates.

`Total Nights = Check-out Date - Check-in Date`

For example:

- Check-in: 19 November.
- Check-out: 22 November.
- Total nights: 3.

The subtotal is calculated using:

`Subtotal = Price Per Night × Total Nights`

The backend performs the final calculation rather than relying on a frontend-submitted amount.

### 8.4 Availability Checking

The application checks overlapping confirmed bookings for the requested room type.

The overlap condition is:

```sql
existing.check_in < requested_check_out
AND existing.check_out > requested_check_in
```

Only confirmed bookings are considered when calculating reserved capacity. Cancelled bookings no longer consume availability.

The backend performs another availability check during booking creation to avoid relying only on the initial frontend availability result.

## 9. Booking Concurrency Control

One important challenge in a booking system is preventing overbooking when multiple customers attempt to reserve the last available room simultaneously.

StayEase uses MySQL transactions and row-level locking to handle this situation.

### 9.1 Transaction Management

The booking process starts a database transaction using `beginTransaction()`.

The following operations are performed within the transaction:

- Room availability verification.
- Booking amount calculation.
- Coupon validation, when a coupon is provided.
- Booking record insertion.
- Coupon usage count update, when a coupon is used.
- Coupon redemption history insertion, when a coupon is used.

If all operations succeed, the transaction is committed using `COMMIT`.

If an error occurs, the transaction is rolled back using `ROLLBACK`, preventing partial database updates.

### 9.2 Room Availability Locking

Before checking room availability, the application executes a query equivalent to:

```sql
SELECT id, total_rooms, price_per_night
FROM room_types
WHERE id = ?
FOR UPDATE;
```

This locks the selected room type row until the transaction completes.

Other transactions attempting to lock the same room type row must wait until the current transaction commits or rolls back.

### 9.3 Availability Calculation

After acquiring the room type lock, the application counts confirmed bookings that overlap with the requested dates.

Available capacity is calculated as:

`Available Rooms = Total Rooms - Booked Rooms`

If the available room count is zero or less, the booking is rejected.

### 9.4 Preventing Simultaneous Overbooking

For example, suppose a room type has five rooms and four are already booked for the requested dates.

Two customers simultaneously attempt to book the last available room.

1. The first transaction locks the room type row.
2. It checks availability, inserts the booking and commits.
3. The second transaction waits for the lock.
4. After obtaining the lock, the second transaction runs the availability query again.
5. The second transaction finds that no rooms remain and the booking is rejected.

This approach prevents simultaneous booking requests from exceeding the configured room capacity, provided all booking operations use this transactional path.

### 9.5 Concurrency Design Trade-off

StayEase locks the room type record rather than individual room dates.

This approach simplifies concurrency control and ensures that booking requests for the same room type are processed sequentially.

However, it can reduce concurrency because bookings for non-overlapping dates of the same room type also wait for the same lock.

For the scope of this project, consistency and prevention of overbooking are prioritized over maximum concurrent booking throughput.

## 10. Surprise Feature – Coupon Management

The surprise feature in StayEase is a coupon-based discount system.

It allows customers to discover available offers and reduce their booking amount.

### 10.1 What the Feature Does

StayEase provides customers with available promotional coupons during the booking process. Customers can apply an eligible coupon to receive a percentage-based or fixed discount.

The administrator can create and view coupons through the administrator dashboard. The current interface also allows unused coupons to be deleted. Used coupon records are protected from deletion so redemption history can be retained.

### 10.2 Why We Chose It

The feature improves the customer booking experience by providing promotional discounts and giving customers an opportunity to save money.

It also demonstrates business logic involving discount calculations, coupon validity, usage limits, and redemption history.

### 10.3 Supported Discounts and Rules

**Percentage Discount**

`Discount = Subtotal × Discount Percentage / 100`

**Fixed Discount**

A predefined fixed amount is deducted from the subtotal.

The system supports:

- Minimum booking amount.
- Maximum discount limit.
- Coupon start date.
- Coupon expiry date.
- Global usage limit.
- Active/inactive status.
- One coupon per booking.

The backend validates coupon eligibility and calculates the final discount during booking creation. The frontend displays an estimated discount to the customer; the backend performs the authoritative validation and calculation.

### 10.4 Coupon Usage Limit Protection

The coupon usage count is incremented through a conditional database update that checks that the coupon is active and that its current usage count is below its usage limit.

If the update does not affect exactly one row, the booking operation fails with a coupon usage limit error. Since this update is part of the booking transaction, the booking changes are rolled back as well.

This conditional update provides a database-level safeguard against the usage count exceeding the configured limit.

## 11. Booking Cancellation

Customers can retrieve bookings using their booking reference and registered email address.

Cancellation is permitted only for confirmed bookings before their check-in date.

During cancellation:

1. The booking record is locked using `SELECT ... FOR UPDATE`.
2. The backend verifies the booking and customer email.
3. It checks the booking status and cancellation eligibility.
4. The booking status is updated to `CANCELLED`.
5. If a coupon was redeemed, its usage record is locked.
6. The coupon usage count is decreased.
7. The corresponding coupon usage record is updated to `RELEASED`.
8. The transaction is committed.

All these changes are performed within a database transaction to maintain consistency. If an operation fails, the transaction is rolled back.

The released usage record is retained as history rather than deleted.

## 12. Authentication and Authorization

StayEase uses JWT-based authentication for administrator access.

### 12.1 Administrator Login

1. Administrator submits username and password.
2. Backend retrieves the administrator account.
3. bcrypt compares the submitted password with the stored password hash.
4. If credentials are valid, the backend generates a JWT token.
5. Frontend stores the token in local storage.
6. The administrator is redirected to the dashboard.

### 12.2 Protected Routes

The frontend uses a protected route component to prevent unauthenticated users from navigating to the Admin Dashboard.

An Axios request interceptor attaches the JWT token to protected API requests using the Authorization header.

The backend independently verifies the token using authentication middleware.

The customer portal does not require account registration or login. Booking retrieval uses the booking reference and email address.

## 13. Error Handling and Validation

Validation is performed on both frontend and backend.

### 13.1 Frontend

The React application handles:

- Required form fields.
- Input changes.
- Loading indicators.
- API error messages.
- Success messages.
- Conditional display of cancellation actions.

### 13.2 Backend

The backend validates:

- Customer booking details.
- Booking date format and calendar validity.
- Check-in dates and check-out dates.
- Room availability.
- Coupon eligibility.
- Coupon usage limits.
- Administrator authentication.
- Booking cancellation eligibility.

The backend is responsible for enforcing important business rules because frontend validation can be bypassed.

The booking controller returns appropriate HTTP status codes for validation failures, missing records, and conflicts. Unexpected errors are handled with a server error response.

## 14. Important Design Decisions and Trade-offs

### 14.1 React and Express Architecture

We selected React for the frontend and Express.js for the backend.

This separation allows the frontend and backend to be developed independently and communicate through REST APIs.

### 14.2 MySQL Relational Database

We selected MySQL because the application contains structured data with clear relationships between hotels, rooms, bookings, administrators, and coupons.

Relational constraints and transactions help maintain data consistency.

### 14.3 Customer Booking Without Registration

Customers can book and retrieve reservations without creating an account.

This reduces friction during the booking process.

The trade-off is that customers must retain their booking reference and use their registered email address to retrieve reservations.

### 14.4 Database Transactions

Transactions are used for booking creation and cancellation because multiple related database changes must succeed or fail together.

### 14.5 Coupon Usage History

Coupon usage history is retained rather than permanently deleting redemption records.

This provides a record of previous redemptions and cancellations.

### 14.6 Room Type Locking

Locking the room type row makes the availability check and booking insertion safe against competing booking requests that follow the same transaction flow.

The trade-off is reduced concurrency for bookings of the same room type, including requests for different date ranges.

## 15. Limitations and Future Improvements

Potential improvements include:

- Online payment integration.
- Customer registration and authentication.
- Email booking confirmations.
- Advanced hotel filtering and sorting.
- Improved mobile navigation and responsive design.
- Automated end-to-end testing.
- Improved monitoring and logging.
- Production deployment and secure token management.

## 16. Conclusion

StayEase demonstrates the development of a full-stack hotel booking application using React.js, Node.js, Express.js, and MySQL.

The project implements hotel discovery, room availability, booking management, coupon-based discounts, administrator authentication, and transactional booking operations.

Special attention is given to booking consistency, coupon redemption limits, cancellation handling, and maintaining usage history.

The architecture separates presentation, business logic, and data persistence, making the application easier to maintain and extend.