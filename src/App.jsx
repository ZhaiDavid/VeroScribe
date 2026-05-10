import { useEffect, useMemo, useState } from 'react';
import AuthPanel from './components/AuthPanel.jsx';
import PhysicianList from './components/PhysicianList.jsx';
import PhysicianDetails from './components/PhysicianDetails.jsx';
import PatientBookingPanel from './components/PatientBookingPanel.jsx';
import AdminBookings from './components/AdminBookings.jsx';

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled'
};

const DEFAULT_PROFILE_PICTURE = "assets/default-pfp.webp";

function formatDate(datetime) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(new Date(datetime))
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authMode, setAuthMode] = useState('login')
  const [loginEmail, setLoginEmail] = useState('john@example.com')
  const [loginPassword, setLoginPassword] = useState('patient123')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState('')
  const [signupFirstName, setSignupFirstName] = useState('')
  const [signupMiddleName, setSignupMiddleName] = useState('')
  const [signupLastName, setSignupLastName] = useState('')
  const [signupPreferredName, setSignupPreferredName] = useState('')
  const [signupType, setSignupType] = useState('patient')
  const [authMessage, setAuthMessage] = useState('')

  const [physicians, setPhysicians] = useState([])
  const [selectedPhysicianId, setSelectedPhysicianId] = useState('')
  const [slots, setSlots] = useState([])
  const [selectedSlotId, setSelectedSlotId] = useState('')
  const [bookings, setBookings] = useState([])
  const [patientTab, setPatientTab] = useState('book')
  const [patientName, setPatientName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [reason, setReason] = useState('')
  const [message, setMessage] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  // Restore user session
  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadPhysicians = async () => {
      try {
        const res = await fetch('/api/physicians');
        const data = await res.json();
        setPhysicians(data);
      } catch {
        setPhysicians([]);
      }
    };

    loadPhysicians();

    // Auto-fill patient info if logged in
    if (user.type === 'patient') {
      const displayName = user.preferredName || `${user.firstName} ${user.lastName}`.trim();
      setPatientName(displayName);
      setEmail(user.email);
    }
  }, [user])

  useEffect(() => {
    if (!user || !selectedPhysicianId) {
      return;
    }

    const loadSlots = async () => {
      setSlots([]);
      try {
        const res = await fetch(`/api/physicians/${selectedPhysicianId}/slots`);
        const data = await res.json();
        setSlots(data);
      } catch {
        setSlots([]);
      }
    };

    loadSlots();
  }, [user, selectedPhysicianId])

  useEffect(() => {
    if (user) {
      refreshBookings()
    }
  }, [user])

  const selectedPhysician = useMemo(
    () => physicians.find((physician) => physician.id === selectedPhysicianId),
    [physicians, selectedPhysicianId]
  )

  async function handleLogin(event) {
    event.preventDefault();
    setAuthMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      if (!res.ok) {
        throw new Error('Login failed');
      }

      const userData = await res.json();
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setAuthMessage('');
    } catch {
      setAuthMessage('Login failed. Check email and password.');
    }
  }

  async function handleSignup(event) {
    event.preventDefault();
    setAuthMessage('');

    if (signupPassword !== signupPasswordConfirm) {
      setAuthMessage('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signupEmail,
          password: signupPassword,
          type: signupType,
          ...(signupType === 'patient'
            ? {
                firstName: signupFirstName,
                middleName: signupMiddleName,
                lastName: signupLastName,
                preferredName: signupPreferredName
              }
            : {})
        })
      });

      if (!res.ok) {
        throw new Error('Signup failed');
      }

      const userData = await res.json();
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setAuthMessage('');
    } catch {
      setAuthMessage('Signup failed. Try again.');
    }
  }

  function handleLogout() {
    localStorage.removeItem('user')
    setUser(null)
    setAuthMode('login')
    setLoginEmail('john@example.com')
    setLoginPassword('patient123')
    setSignupEmail('')
    setSignupPassword('')
    setSignupPasswordConfirm('')
    setSignupFirstName('')
    setSignupMiddleName('')
    setSignupLastName('')
    setSignupPreferredName('')
    setMessage('')
    setAuthMessage('')
  }

  async function refreshBookings() {
    try {
      const res = await fetch('/api/bookings', {
        headers: { 'x-user-id': user.id }
      });
      const data = await res.json();
      setBookings(data);
    } catch {
      setBookings([]);
    }
  }

  async function handleBookingSubmit(event) {
    event.preventDefault();
    if (!selectedPhysicianId || !selectedSlotId || !patientName || !email || !phone || !reason) {
      setMessage('Please complete every field and choose a physician plus a slot.');
      return;
    }

    setFormLoading(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({
          physicianId: selectedPhysicianId,
          slotId: selectedSlotId,
          patientName,
          email,
          phone,
          reason
        })
      });

      const booking = await res.json();
      setMessage(`Booking requested for ${formatDate(booking.datetime)} with ${booking.physicianName}. Status: ${STATUS_LABELS[booking.status]}`);
      setSelectedSlotId('');
      setPatientName('');
      setEmail('');
      setPhone('');
      setReason('');
      setFormLoading(false);
      refreshBookings();
    } catch {
      setMessage('Unable to submit booking. Try again later.');
      setFormLoading(false);
    }
  }

  async function updateBookingStatus(bookingId, newStatus) {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({ status: newStatus })
      });

      await res.json();
      refreshBookings();
    } catch {
      setMessage('Unable to update booking status.');
    }
  }

  if (loading) {
    return <div className="app-shell"><p>Loading...</p></div>
  }

  if (!user) {
    return (
      <div className="app-shell">
        <header className="topbar">
          <div>
            <h1>Booking App </h1>
            <p>Patient booking and physician management system.</p>
          </div>
        </header>

        <main className="auth-container">
          <AuthPanel
            authMode={authMode}
            setAuthMode={setAuthMode}
            loginEmail={loginEmail}
            setLoginEmail={setLoginEmail}
            loginPassword={loginPassword}
            setLoginPassword={setLoginPassword}
            signupEmail={signupEmail}
            setSignupEmail={setSignupEmail}
            signupPassword={signupPassword}
            setSignupPassword={setSignupPassword}
            signupPasswordConfirm={signupPasswordConfirm}
            setSignupPasswordConfirm={setSignupPasswordConfirm}
            signupFirstName={signupFirstName}
            setSignupFirstName={setSignupFirstName}
            signupMiddleName={signupMiddleName}
            setSignupMiddleName={setSignupMiddleName}
            signupLastName={signupLastName}
            setSignupLastName={setSignupLastName}
            signupPreferredName={signupPreferredName}
            setSignupPreferredName={setSignupPreferredName}
            signupType={signupType}
            setSignupType={setSignupType}
            authMessage={authMessage}
            handleLogin={handleLogin}
            handleSignup={handleSignup}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1> Booking App </h1>
          <p>Welcome, {user.type === 'patient' ? (user.preferredName || user.firstName) : physicians.find(p => p.id === user.physicianId)?.name || user.email}</p>
        </div>
        <div className="topbar-actions">
          {user.type === 'patient' && (
            <div className="mode-switch">
              <span>Patient</span>
            </div>
          )}
          {user.type === 'doctor' && (
            <div className="mode-switch">
              <span>Admin</span>
            </div>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {user.type === 'patient' ? (
        <main className="grid-layout">
          <section className="panel">
            <h2>Choose a physician</h2>
            <PhysicianList
              physicians={physicians}
              selectedPhysicianId={selectedPhysicianId}
              setSelectedPhysicianId={setSelectedPhysicianId}
              setSelectedSlotId={setSelectedSlotId}
              setMessage={setMessage}
            />
            {selectedPhysician && (
              <PhysicianDetails
                selectedPhysician={selectedPhysician}
                profilePicture={DEFAULT_PROFILE_PICTURE}
              />
            )}
          </section>

          <section className="panel patient-tab-panel">
            <PatientBookingPanel
              patientTab={patientTab}
              setPatientTab={setPatientTab}
              selectedPhysician={selectedPhysician}
              slots={slots}
              selectedSlotId={selectedSlotId}
              setSelectedSlotId={setSelectedSlotId}
              patientName={patientName}
              setPatientName={setPatientName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              reason={reason}
              setReason={setReason}
              formLoading={formLoading}
              handleBookingSubmit={handleBookingSubmit}
              message={message}
              bookings={bookings}
              formatDate={formatDate}
              STATUS_LABELS={STATUS_LABELS}
            />
          </section>
        </main>
      ) : (
        <AdminBookings
          bookings={bookings}
          physicianId={user.physicianId}
          refreshBookings={refreshBookings}
          updateBookingStatus={updateBookingStatus}
          formatDate={formatDate}
          STATUS_LABELS={STATUS_LABELS}
          message={message}
        />
      )}
    </div>
  )
}

export default App
