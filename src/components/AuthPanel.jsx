import './AuthPanel.css';

function AuthPanel({
  authMode,
  setAuthMode,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  signupEmail,
  setSignupEmail,
  signupPassword,
  setSignupPassword,
  signupPasswordConfirm,
  setSignupPasswordConfirm,
  signupFirstName,
  setSignupFirstName,
  signupMiddleName,
  setSignupMiddleName,
  signupLastName,
  setSignupLastName,
  signupPreferredName,
  setSignupPreferredName,
  signupType,
  setSignupType,
  authMessage,
  handleLogin,
  handleSignup
}) {
  return (
    <div className="auth-panel">
      <div className="auth-tabs">
        <button
          className={authMode === 'login' ? 'active' : ''}
          onClick={() => setAuthMode('login')}
          type="button"
        >
          Login
        </button>
        <button
          className={authMode === 'signup' ? 'active' : ''}
          onClick={() => setAuthMode('signup')}
          type="button"
        >
          Sign Up
        </button>
      </div>

      {authMode === 'login' ? (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <label>
            Email
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Login</button>
          <p className="auth-help">
            Demo credentials:<br />
            Patient: john@example.com / patient123<br />
            Doctor: maya@hospital.com / doc123
          </p>
        </form>
      ) : (
        <form onSubmit={handleSignup}>
          <h2>Sign Up</h2>
          <label>
            I am a
            <select value={signupType} onChange={(e) => setSignupType(e.target.value)}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor (admin only)</option>
            </select>
          </label>
          {signupType === 'patient' && (
            <>
              <label>
                First Name
                <input
                  type="text"
                  value={signupFirstName}
                  onChange={(e) => setSignupFirstName(e.target.value)}
                  required
                />
              </label>
              <label>
                Middle Name (optional)
                <input
                  type="text"
                  value={signupMiddleName}
                  onChange={(e) => setSignupMiddleName(e.target.value)}
                />
              </label>
              <label>
                Last Name
                <input
                  type="text"
                  value={signupLastName}
                  onChange={(e) => setSignupLastName(e.target.value)}
                  required
                />
              </label>
              <label>
                Preferred Name (optional)
                <input
                  type="text"
                  value={signupPreferredName}
                  onChange={(e) => setSignupPreferredName(e.target.value)}
                  placeholder="e.g., 'Alex' if your name is 'Alexander'"
                />
              </label>
            </>
          )}
          <label>
            Email
            <input
              type="email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              required
            />
          </label>
          <label>
            Confirm Password
            <input
              type="password"
              value={signupPasswordConfirm}
              onChange={(e) => setSignupPasswordConfirm(e.target.value)}
              required
            />
          </label>
          <button type="submit">Create Account</button>
        </form>
      )}

      {authMessage && <div className="message error">{authMessage}</div>}
    </div>
  );
}

export default AuthPanel;
