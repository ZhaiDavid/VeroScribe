import './AdminBookings.css';

function AdminBookings({
  bookings,
  physicianId,
  refreshBookings,
  updateBookingStatus,
  formatDate,
  STATUS_LABELS,
  message
}) {
  const physicianBookings = bookings.filter((booking) => booking.physicianId === physicianId);

  return (
    <main className="admin-panel">
      <h2>Your Bookings</h2>
      <div className="admin-actions">
        <button onClick={refreshBookings}>Refresh</button>
      </div>
      <div className="booking-table">
        <div className="booking-row header">
          <span>Patient</span>
          <span>Contact</span>
          <span>Time</span>
          <span>Reason</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {physicianBookings.length ? (
          physicianBookings.map((booking) => (
            <div key={booking.id} className="booking-row">
              <span>{booking.patientName}</span>
              <span>
                {booking.email}
                <br />
                {booking.phone}
              </span>
              <span>{formatDate(booking.datetime)}</span>
              <span>{booking.reason}</span>
              <span className={`status ${booking.status}`}>{STATUS_LABELS[booking.status]}</span>
              <span className="actions">
                {booking.status === 'pending' && (
                  <button onClick={() => updateBookingStatus(booking.id, 'confirmed')}>
                    Confirm
                  </button>
                )}
                {booking.status !== 'cancelled' && (
                  <button className="danger" onClick={() => updateBookingStatus(booking.id, 'cancelled')}>
                    Cancel
                  </button>
                )}
              </span>
            </div>
          ))
        ) : (
          <div className="empty-state">No bookings for you.</div>
        )}
      </div>
      {message && <div className="message">{message}</div>}
    </main>
  );
}

export default AdminBookings;
