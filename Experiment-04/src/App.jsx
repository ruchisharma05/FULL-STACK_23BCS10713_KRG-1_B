import React, { useState, useEffect, useCallback } from "react";
import bcrypt from "bcryptjs";
import "./App.css";

const STORAGE_USERS_KEY = "doubtconnect_users";
const STORAGE_SESSION_KEY = "doubtconnect_session";

// Helper to load all users from localStorage
const getStoredUsers = () => {
  const usersStr = localStorage.getItem(STORAGE_USERS_KEY);
  return usersStr ? JSON.parse(usersStr) : [];
};

// Helper to save updated users list to localStorage
const saveUsers = (users) => {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
};

// Reusable input with label, supports textarea too
const Input = ({ label, type = "text", value, onChange, textarea = false }) => (
  <div style={{ marginBottom: 16, width: "100%" }}>
    <label className="label">{label}</label>
    {textarea ? (
      <textarea
        value={value}
        onChange={onChange}
        className="input"
        rows={3}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="input"
        autoComplete="off"
      />
    )}
  </div>
);

// Form used for both login and signup views
const AuthForm = React.memo(
  ({
    view,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    username,
    setUsername,
    academicDetails,
    setAcademicDetails,
    error,
    success,
    onSubmit,
    switchView,
    forgotPasswordClick,
  }) => {
    return (
      <div className="form-container">
        <h2 style={{ marginBottom: 24 }}>
          {view === "login"
            ? "🔐 Login to DoubtConnect"
            : "✍️ Signup for DoubtConnect"}
        </h2>
        {/* Login input label changes to reflect it accepts email OR username */}
        <Input
          label={view === "login" ? "Email or Username" : "Email"}
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {view === "signup" && (
          <>
            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              label="Academic Details"
              textarea
              value={academicDetails}
              onChange={(e) => setAcademicDetails(e.target.value)}
            />
          </>
        )}
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {view === "signup" && (
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        {/* Display error or success messages with emojis */}
        {error && <p className="error">❌ {error}</p>}
        {success && <p className="success">✅ {success}</p>}
        <button className="button" onClick={onSubmit}>
          {view === "login" ? "🔐 Login" : "✍️ Signup"}
        </button>
        {/* Forgot password link only on login view */}
        {view === "login" && (
          <p className="forgot-password-text">
            <span className="link-text" onClick={forgotPasswordClick}>
              Forgot Password?
            </span>
          </p>
        )}
        {/* Switch between login and signup */}
        <p style={{ marginTop: 16 }}>
          {view === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <span className="link-text" onClick={switchView}>
            {view === "login" ? "Signup here" : "Login here"}
          </span>
        </p>
      </div>
    );
  }
);

// Form for handling forgot password requests
const ForgotPasswordForm = React.memo(
  ({ forgotEmail, setForgotEmail, forgotError, forgotSuccess, onSubmit, backToLogin }) => (
    <div className="form-container">
      <h2 style={{ marginBottom: 24 }}>❓ Forgot Password</h2>
      <Input
        label="Enter your registered email"
        type="email"
        value={forgotEmail}
        onChange={(e) => setForgotEmail(e.target.value)}
      />
      {/* Show messages for forgot password with emojis */}
      {forgotError && <p className="error">❌ {forgotError}</p>}
      {forgotSuccess && <p className="success">✅ {forgotSuccess}</p>}
      <button className="button" onClick={onSubmit}>
        Send Reset Link
      </button>
      <p style={{ marginTop: 16 }}>
        <span className="link-text" onClick={backToLogin}>
          Back to Login
        </span>
      </p>
    </div>
  )
);

// Dashboard shows profile info and allows editing username & academic details
const Dashboard = React.memo(({ user, onLogout, onUpdateUser }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user.username || "");
  const [editedAcademicDetails, setEditedAcademicDetails] = useState(user.academicDetails || "");

  // Save changes to profile info
  const handleSave = () => {
    if (!editedUsername.trim()) {
      alert("Username cannot be empty.");
      return;
    }
    const updatedUser = {
      ...user,
      username: editedUsername,
      academicDetails: editedAcademicDetails,
    };
    onUpdateUser(updatedUser);
    setEditMode(false);
  };

  return (
    <div className="dashboard-container">
      <h1 style={{ marginBottom: 12, color: "#4a5568" }}>
        🎉 Welcome back{user.username ? `, ${user.username}` : "!"}
      </h1>
      <p className="dashboard-subtitle">
        Your academic support community for instant doubt clearing, peer & mentor interaction, and collaborative learning.
      </p>
      <div className="profile-card">
        <h3 style={{ marginBottom: 8, color: "#2d3748" }}>👤 Your Profile</h3>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        {!editMode ? (
          <>
            <p>
              <strong>Username:</strong> {user.username || "(Not set)"}
            </p>
            <p>
              <strong>Academic Details:</strong>{" "}
              {user.academicDetails || "(Not set)"}
            </p>
          </>
        ) : (
          <>
            <Input
              label="Username"
              value={editedUsername}
              onChange={(e) => setEditedUsername(e.target.value)}
            />
            <Input
              label="Academic Details"
              textarea
              value={editedAcademicDetails}
              onChange={(e) => setEditedAcademicDetails(e.target.value)}
            />
          </>
        )}
      </div>
      {/* Edit and Save/Cancel buttons */}
      {!editMode ? (
        <button
          className="button"
          style={{ marginTop: 24, backgroundColor: "#48bb78" }}
          onClick={() => setEditMode(true)}
          aria-label="Edit Profile"
        >
          ✏️ Edit Profile
        </button>
      ) : (
        <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            className="button"
            style={{ backgroundColor: "#4299e1", width: 120 }}
            onClick={handleSave}
            aria-label="Save Profile"
          >
            💾 Save
          </button>
          <button
            className="button"
            style={{ backgroundColor: "#f56565", width: 120 }}
            onClick={() => setEditMode(false)}
            aria-label="Cancel Edit"
          >
            ❌ Cancel
          </button>
        </div>
      )}
      {/* Logout button */}
      <button
        className="button"
        style={{ marginTop: 24, backgroundColor: "#f56565" }}
        onClick={onLogout}
        aria-label="Logout"
      >
        🚪 Logout
      </button>
    </div>
  );
});

const App = () => {
  const [view, setView] = useState("login"); // current screen: login, signup, forgotPassword, dashboard
  const [email, setEmail] = useState(""); // holds email or username input on login, email on signup
  const [password, setPassword] = useState(""); // password input
  const [confirmPassword, setConfirmPassword] = useState(""); // confirmation for signup
  const [username, setUsername] = useState(""); // username input on signup
  const [academicDetails, setAcademicDetails] = useState(""); // academic details input on signup
  const [error, setError] = useState(""); // error message display
  const [success, setSuccess] = useState(""); // success message display
  const [user, setUser] = useState(null); // logged-in user object
  const [forgotEmail, setForgotEmail] = useState(""); // email input for forgot password
  const [forgotError, setForgotError] = useState(""); // forgot password error message
  const [forgotSuccess, setForgotSuccess] = useState(""); // forgot password success message

  // On app load, try to restore user session from localStorage
  useEffect(() => {
    const sessionUser = localStorage.getItem(STORAGE_SESSION_KEY);
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
      setView("dashboard");
    }
  }, []);

  // Clear all messages helper
  const clearMessages = useCallback(() => {
    setError("");
    setSuccess("");
    setForgotError("");
    setForgotSuccess("");
  }, []);

  // Simple email format validation
  const validateEmail = useCallback((email) => /\S+@\S+\.\S+/.test(email), []);

  // Reset all form inputs
  const resetForm = useCallback(() => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUsername("");
    setAcademicDetails("");
    setForgotEmail("");
  }, []);

  // Clear messages and reset forms when view changes
  useEffect(() => {
    resetForm();
    clearMessages();
  }, [view, resetForm, clearMessages]);

  // Handle signup logic with checks and bcrypt password hashing
  const handleSignup = useCallback(async () => {
    clearMessages();
    if (!validateEmail(email)) {
      setError("Invalid email format.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!username.trim()) {
      setError("Username is required.");
      return;
    }
    if (!academicDetails.trim()) {
      setError("Academic details are required.");
      return;
    }
    const users = getStoredUsers();
    const userExists = users.find((u) => u.email === email || u.username.toLowerCase() === username.toLowerCase());
    if (userExists) {
      setError("User with this email or username already exists.");
      return;
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = {
      email,
      password: hashedPassword,
      username,
      academicDetails,
    };
    users.push(newUser);
    saveUsers(users);
    setSuccess("Signup successful! You can now login.");
    setView("login");
  }, [email, password, confirmPassword, username, academicDetails, clearMessages, validateEmail]);

  // Handle login logic: allow login by email or username, verify hashed password
  const handleLogin = useCallback(() => {
    clearMessages();
    if (!email.trim()) {
      setError("Email or username cannot be empty.");
      return;
    }
    if (password.length === 0) {
      setError("Password cannot be empty.");
      return;
    }
    const users = getStoredUsers();
    const loginInput = email.trim().toLowerCase();
    const foundUser = users.find(
      (u) =>
        u.email.toLowerCase() === loginInput ||
        u.username.toLowerCase() === loginInput
    );
    if (!foundUser) {
      setError("Invalid email/username or password.");
      return;
    }
    const passwordMatch = bcrypt.compareSync(password, foundUser.password);
    if (!passwordMatch) {
      setError("Invalid email/username or password.");
      return;
    }
    setUser(foundUser);
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(foundUser));
    setSuccess("Login successful!");
    setView("dashboard");
  }, [email, password, clearMessages]);

  // Log out user and clear session and form
  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_SESSION_KEY);
    clearMessages();
    resetForm();
    setView("login");
  }, [clearMessages, resetForm]);

  // Handle forgot password (simulated)
  const handleForgotPassword = useCallback(() => {
    setForgotError("");
    setForgotSuccess("");
    if (!validateEmail(forgotEmail)) {
      setForgotError("Please enter a valid email.");
      return;
    }
    const users = getStoredUsers();
    const userFound = users.find((u) => u.email === forgotEmail);
    if (!userFound) {
      setForgotError("Email not found.");
      return;
    }
    setForgotSuccess("Password reset link sent to your email (simulation).");
  }, [forgotEmail, validateEmail]);

  // Update user profile info and persist changes
  const handleUpdateUser = useCallback(
    (updatedUser) => {
      const users = getStoredUsers();
      const index = users.findIndex((u) => u.email === updatedUser.email);
      if (index !== -1) {
        users[index] = updatedUser;
        saveUsers(users);
        setUser(updatedUser);
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(updatedUser));
      }
    },
    []
  );

  return (
    <div className="page-container">
      {(view === "login" || view === "signup") && (
        <AuthForm
          view={view}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          username={username}
          setUsername={setUsername}
          academicDetails={academicDetails}
          setAcademicDetails={setAcademicDetails}
          error={error}
          success={success}
          onSubmit={view === "login" ? handleLogin : handleSignup}
          switchView={() => {
            clearMessages();
            setView(view === "login" ? "signup" : "login");
          }}
          forgotPasswordClick={() => {
            clearMessages();
            setView("forgotPassword");
          }}
        />
      )}
      {view === "forgotPassword" && (
        <ForgotPasswordForm
          forgotEmail={forgotEmail}
          setForgotEmail={setForgotEmail}
          forgotError={forgotError}
          forgotSuccess={forgotSuccess}
          onSubmit={handleForgotPassword}
          backToLogin={() => {
            clearMessages();
            setView("login");
          }}
        />
      )}
      {view === "dashboard" && user && (
        <Dashboard user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
      )}
    </div>
  );
};

export default App;