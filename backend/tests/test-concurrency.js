
const sendBooking = async (customerName, customerEmail) => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/bookings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          roomTypeId: 1,
          customerName,
          customerEmail,
          checkIn: "2026-12-25",
          checkOut: "2026-12-28"
        })
      }
    );

    const data = await response.json();

    return {
      customer: customerName,
      status: response.status,
      response: data
    };

  } catch (error) {
    return {
      customer: customerName,
      error: error.message
    };
  }
};

// Send both booking requests concurrently
const results = await Promise.all([
  sendBooking("Customer A", "a@example.com"),
  sendBooking("Customer B", "b@example.com")
]);

console.log("Concurrency Test Results:");
console.log(JSON.stringify(results, null, 2));
