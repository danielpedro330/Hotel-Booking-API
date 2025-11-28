export function reservationCanceledTemplate(startDate: Date, endDate: Date) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #c62828;">Reservation Canceled</h2>
      <p>Your reservation has been successfully canceled.</p>

      <p><strong>Original Reservation Details:</strong></p>
      <ul>
        <li><strong>Check-in:</strong> ${startDate.toDateString()}</li>
        <li><strong>Check-out:</strong> ${endDate.toDateString()}</li>
      </ul>

      <p>If this cancellation was a mistake, feel free to make a new reservation at any time.</p>
      <p>Thank you for using our service.</p>
    </div>
  `;
}
