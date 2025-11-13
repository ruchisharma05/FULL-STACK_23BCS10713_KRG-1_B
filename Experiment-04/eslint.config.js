import React, { useState, useEffect, useCallback } from "react";
import bcrypt from "bcryptjs";

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
    <label style={styles.label}>{label}</label>
    {textarea ? (
      <textarea
        value={value}
        onChange={onChange}
        style={styles.input}
        rows={3}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        style={styles.input}
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
      <div style={styles.formContainer}>
        <h2 style={{ marginBottom: 24 }}>
          {view === "login"
            ? "Login to DoubtConnect"
            : "Signup for DoubtConnect"}
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
        {/* Display error or success messages */}
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <button style={styles.button} onClick={onSubmit}>
          {view === "login" ? "Login" : "Signup"}
        </button>
        {/* Forgot password link only on login view */}
        {view === "login" && (
          <p style={styles.forgotPasswordText}>
            <span style={styles.linkText} onClick={forgotPasswordClick}>
              Forgot Password?
            </span>
          </p>
        )}
        {/* Switch between login and signup */}
        <p style={{ marginTop: 16 }}>
          {view === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <span style={styles.linkText} onClick={switchView}>
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
    <div style={styles.formContainer}>
      <h2 style={{ marginBottom: 24 }}>Forgot Password</h2>
      <Input
        label="Enter your registered email"
        type="email"
        value={forgotEmail}
        onChange={(e) => setForgotEmail(e.target.value)}
      />
      {/* Show messages for forgot password */}
      {forgotError && <p style={styles.error}>{forgotError}</p>}
      {forgotSuccess && <p style={styles.success}>{forgotSuccess}</p>}
      <button style={styles.button} onClick={onSubmit}>
        Send Reset Link
      </button>
      <p style={{ marginTop: 16 }}>
        <span style={styles.linkText} onClick={backToLogin}>
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
    <div style={styles.dashboardContainer}>
      <h1 style={{ marginBottom: 12, color: "#4a5568" }}>
        Welcome back{user.username ? `, ${user.username}` : "!"}
      </h1>
      <p style={styles.dashboardSubtitle}>
        Your academic support community for instant doubt clearing, peer & mentor interaction, and collaborative learning.
      </p>
      <div style={styles.profileCard}>
        <h3 style={{ marginBottom: 8, color: "#2d3748" }}>Your Profile</h3>
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
          style={{ ...styles.button, marginTop: 24, backgroundColor: "#48bb78" }}
          onClick={() => setEditMode(true)}
          aria-label="Edit Profile"
        >
          Edit Profile
        </button>
      ) : (
        <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            style={{ ...styles.button, backgroundColor: "#4299e1", width: 120 }}
            onClick={handleSave}
            aria-label="Save Profile"
          >
            Save
          </button>
          <button
            style={{ ...styles.button, backgroundColor: "#f56565", width: 120 }}
            onClick={() => setEditMode(false)}
            aria-label="Cancel Edit"
          >
            Cancel
          </button>
        </div>
      )}
      {/* Logout button */}
      <button
        style={{ ...styles.button, marginTop: 24, backgroundColor: "#f56565" }}
        onClick={onLogout}
        aria-label="Logout"
      >
        Logout
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
    <div style={styles.pageContainer}>
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

const styles = {
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: 20,
  },
  formContainer: {
    width: 400,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 32,
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.15)",
    boxSizing: "border-box",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    fontSize: 16,
    borderRadius: 6,
    border: "1.5px solid #ccc",
    outline: "none",
    transition: "border-color 0.3s",
    boxSizing: "border-box",
  },
  label: {
    display: "block",
    textAlign: "left",
    marginBottom: 6,
    fontWeight: "600",
    color: "#444",
  },
  button: {
    width: "100%",
    padding: "14px 0",
    backgroundColor: "#5a67d8",
    color: "#fff",
    fontSize: 18,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "600",
    boxShadow: "0 6px 12px rgba(90,103,216,0.5)",
    transition: "background-color 0.3s",
  },
  error: {
    color: "#e53e3e",
    marginBottom: 16,
    fontWeight: "600",
  },
  success: {
    color: "#38a169",
    marginBottom: 16,
    fontWeight: "600",
  },
  linkText: {
    color: "#5a67d8",
    cursor: "pointer",
    fontWeight: "600",
    textDecoration: "underline",
  },
  forgotPasswordText: {
    marginTop: 12,
    textAlign: "right",
    fontSize: 14,
  },
  dashboardContainer: {
    width: 480,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 36,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    boxSizing: "border-box",
    textAlign: "center",
    color: "#2d3748",
  },
  dashboardSubtitle: {
    fontSize: 16,
    marginBottom: 28,
    color: "#4a5568",
  },
  profileCard: {
    backgroundColor: "#edf2f7",
    borderRadius: 10,
    padding: 24,
    textAlign: "left",
    fontSize: 16,
    lineHeight: 1.6,
    color: "#2d3748",
  },
};

export default App;