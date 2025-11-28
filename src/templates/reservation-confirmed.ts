export function reservationConfirmedTemplate(startDate: Date, endDate: Date) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Your Reservation is Confirmed</h2>
      <p>Your stay is booked:</p>

      <ul>
        <li><strong>Check-in:</strong> ${startDate.toDateString()}</li>
        <li><strong>Check-out:</strong> ${endDate.toDateString()}</li>
      </ul>

      <p>We look forward to welcoming you!</p>
    </div>
  `;
}
