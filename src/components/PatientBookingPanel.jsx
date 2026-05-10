import './PatientBookingPanel.css';

function PatientBookingPanel({
  patientTab,
  setPatientTab,
  selectedPhysician,
  slots,
  selectedSlotId,
  setSelectedSlotId,
  patientName,
  setPatientName,
  email,
  setEmail,
  phone,
  setPhone,
  reason,
  setReason,
  formLoading,
  handleBookingSubmit,
  message,
  bookings,
  formatDate,
  STATUS_LABELS
}) {
  return (
    <>
      <div className="patient-tabs">
        <button
          className={patientTab === 'book' ? 'active' : ''}
          type="button"
          onClick={() => setPatientTab('book')}
        >
          Request appointment
        </button>
        <button
          className={patientTab === 'appointments' ? 'active' : ''}
          type="button"
          onClick={() => setPatientTab('appointments')}
        >
          My appointments
        </button>
      </div>

      {patientTab === 'book' ? (
        <>
          <div className="panel-subsection">
            <h2>Available times</h2>
            {selectedPhysician ? (
              <div className="slot-list">
                {slots.length ? (
                  slots.map((slot) => (
                    <label key={slot.id} className={`slot ${slot.id === selectedSlotId ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="slot"
                        value={slot.id}
                        checked={slot.id === selectedSlotId}
                        onChange={() => setSelectedSlotId(slot.id)}
                      />
                      <div>
                        <strong>{formatDate(slot.datetime)}</strong>
                        <span>Available</span>
                      </div>
                    </label>
                  ))
                ) : (
                  <p>No available slots. Select another physician.</p>
                )}
              </div>
            ) : (
              <p>Select a physician to load available times.</p>
            )}
          </div>

          <div className="panel-subsection form-panel">
            <h2>Request appointment</h2>
            <form onSubmit={handleBookingSubmit}>
              <label>
                Patient name
                <input value={patientName} onChange={(e) => setPatientName(e.target.value)} />
              </label>
              <label>
                Email address
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <label>
                Phone number
                <input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>
              <label>
                Reason for visit
                <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows="3" />
              </label>
              <button type="submit" disabled={formLoading}>
                {formLoading ? 'Submitting…' : 'Request Appointment'}
              </button>
            </form>
            {message && <div className="message">{message}</div>}
          </div>
        </>
      ) : (
        <div className="patient-bookings-panel">
          <h2>My Appointments</h2>
          {bookings.length ? (
            <div className="booking-list">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-row">
                    <span className="booking-label">Physician:</span>
                    <span>{booking.physicianName}</span>
                  </div>
                  <div className="booking-row">
                    <span className="booking-label">Date & time:</span>
                    <span>{formatDate(booking.datetime)}</span>
                  </div>
                  <div className="booking-row">
                    <span className="booking-label">Reason:</span>
                    <span>{booking.reason}</span>
                  </div>
                  <div className="booking-row">
                    <span className="booking-label">Status:</span>
                    <span className={`status ${booking.status}`}>{STATUS_LABELS[booking.status]}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">You have no appointments yet.</div>
          )}
        </div>
      )}
    </>
  );
}

export default PatientBookingPanel;
