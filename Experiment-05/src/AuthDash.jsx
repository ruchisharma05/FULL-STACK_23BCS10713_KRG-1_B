import React, { useState, useEffect, useCallback } from "react";
import bcrypt from "bcryptjs";
import StudyGroupModule from "./StudyGroupModule";
import "./AuthDash.css";

const STORAGE_USERS_KEY = "doubtconnect_users";
const STORAGE_SESSION_KEY = "doubtconnect_session";

const getStoredUsers = () => {
  const usersStr = localStorage.getItem(STORAGE_USERS_KEY);
  return usersStr ? JSON.parse(usersStr) : [];
};

const saveUsers = (users) => {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
};

const Input = ({ label, type = "text", value, onChange, textarea = false }) => (
  <div className="input-group">
    <label className="label">{label}</label>
    {textarea ? (
      <textarea value={value} onChange={onChange} className="input" rows={3} />
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

const AuthDash = ({ onLogin }) => {
  const [view, setView] = useState("login"); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);


  useEffect(() => {
    const sessionUser = localStorage.getItem(STORAGE_SESSION_KEY);
    if (sessionUser) {
      const parsedUser = JSON.parse(sessionUser);
      setUser(parsedUser);
      setView("dashboard");
    }
  }, []);


  const clearMessages = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  const validateEmail = useCallback(
    (email) => /\S+@\S+\.\S+/.test(email),
    []
  );

  const resetForm = useCallback(() => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUsername("");
  }, []);

  useEffect(() => {
    resetForm();
    clearMessages();
  }, [view, resetForm, clearMessages]);


  const handleSignup = useCallback(() => {
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
    const users = getStoredUsers();
    const userExists = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() ||
        u.username.toLowerCase() === username.toLowerCase()
    );
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
    };
    users.push(newUser);
    saveUsers(users);
    setSuccess("Signup successful! You can now login.");
    setView("login");
  }, [email, password, confirmPassword, username, clearMessages, validateEmail]);

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
        u.email.toLowerCase() === loginInput || u.username.toLowerCase() === loginInput
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
    if (onLogin) onLogin(foundUser);
  }, [email, password, clearMessages, onLogin]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_SESSION_KEY);
    clearMessages();
    resetForm();
    setView("login");
  };

  const handleUpdateUser = (updatedUser) => {
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.email === updatedUser.email);
    if (index !== -1) {
      users[index] = updatedUser;
      saveUsers(users);
      setUser(updatedUser);
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(updatedUser));
      setSuccess("Profile updated successfully!");
    }
  };

  const Dashboard = () => {
    const [dashboardView, setDashboardView] = useState("profile"); 
    const [editMode, setEditMode] = useState(false);
    const [editedUsername, setEditedUsername] = useState(user.username || "");

    const handleSave = () => {
      if (!editedUsername.trim()) {
        alert("Username cannot be empty.");
        return;
      }
      const updatedUser = {
        ...user,
        username: editedUsername,
      };
      handleUpdateUser(updatedUser);
      setEditMode(false);
    };

    return (
      <div className="dashboard-wrapper">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-book"
                viewBox="0 0 24 24"
                style={{ verticalAlign: "middle", marginRight: 8 }}
                aria-hidden="true"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M4 4.5A2.5 2.5 0 0 1 6.5 7H20v13a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 19.5z" />
              </svg>
              DoubtConnect
            </h2>
          </div>
          <nav className="sidebar-nav" aria-label="Dashboard Navigation">
            <button
              className={`nav-button ${dashboardView === "profile" ? "active" : ""}`}
              onClick={() => {
                setDashboardView("profile");
                setEditMode(false);
                clearMessages();
              }}
              aria-current={dashboardView === "profile" ? "page" : undefined}
            >
              👤 Profile
            </button>
            <button
              className={`nav-button ${
                dashboardView === "studyGroups" ? "active" : ""
              }`}
              onClick={() => {
                setDashboardView("studyGroups");
                clearMessages();
              }}
              aria-current={dashboardView === "studyGroups" ? "page" : undefined}
            >
              📚 Study Groups
            </button>
          </nav>
          <button
            className="nav-button logout-button"
            onClick={handleLogout}
            aria-label="Logout"
          >
            🚪 Logout
          </button>
        </aside>

        <main className="dashboard-main">
          <header className="dashboard-header" aria-label="Welcome header">
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div>
                <h1>
                  Welcome back{user.username ? `, ${user.username}` : "!"}
                </h1>
                <p className="dashboard-subtitle">
                  Your academic support community for instant doubt clearing,
                  peer & mentor interaction, and collaborative learning.
                </p>
              </div>
              <img
                src= "dashboard_imggg.svg"
                style={{ width: 140, height: "auto", userSelect: "none" }}
                draggable={false}
                loading="lazy"
              />
            </div>
          </header>

          <section className="dashboard-content" aria-live="polite">
            {dashboardView === "profile" && (
  <div className="profile-card" tabIndex={0} aria-label="User profile">
    <h2>Your Profile</h2>
    <div className="profile-info-group">
      <label>Email:</label>
      <p className="profile-info">{user.email}</p>
    </div>
    <div className="profile-info-group">
      <label>Username:</label>
      {!editMode ? (
        <p className="profile-info">{user.username || "(Not set)"}</p>
      ) : (
        <input
          type="text"
          className="input profile-input"
          value={editedUsername}
          onChange={(e) => setEditedUsername(e.target.value)}
          aria-label="Edit username"
          autoFocus
          maxLength={30}
        />
      )}
    </div>
    {!editMode ? (
      <button
        className="button edit-btn"
        onClick={() => setEditMode(true)}
        aria-label="Edit Profile"
      >
        ✏️ Edit Profile
      </button>
    ) : (
      <div className="edit-actions">
        <button
          className="button save-btn"
          onClick={() => {
            if (!editedUsername.trim()) {
              alert("Username cannot be empty.");
              return;
            }
            handleSave();
          }}
          aria-label="Save Profile"
        >
          💾 Save
        </button>
        <button
          className="button cancel-btn"
          onClick={() => {
            setEditMode(false);
            setEditedUsername(user.username || "");
          }}
          aria-label="Cancel Edit"
        >
          ❌ Cancel
        </button>
      </div>
    )}
  </div>
)}

            {dashboardView === "studyGroups" && (
              <StudyGroupModule currentUserId={user.email} />
            )}
          </section>
        </main>
      </div>
    );
  };

  return (
    <>
      {(view === "login" || view === "signup") && (
        <div className="auth-page-wrapper">
          <div className="auth-card" role="main" aria-label="Authentication card">
            <div className="auth-illustration" aria-hidden="true">
              <img
                src={view === "login" ? "login.svg" : "signup.svg"}
                alt={
                  view === "login"
                    ? "Login illustration"
                    : "Signup illustration"
                }
                draggable={false}
                loading="lazy"
              />
            </div>

            <div className="auth-form">
              <h2 className="form-header">
                {view === "login"
                  ? "🔐 Login to DoubtConnect"
                  : "✍️ Signup for DoubtConnect"}
              </h2>
              <Input
                label={view === "login" ? "Email or Username" : "Email"}
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value.trimStart())}
              />
              {view === "signup" && (
                <Input
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
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
              {error && (
                <p className="error" role="alert" aria-live="assertive">
                  ❌ {error}
                </p>
              )}
              {success && (
                <p className="success" role="alert" aria-live="polite">
                  ✅ {success}
                </p>
              )}
              <button
                className="button"
                onClick={view === "login" ? handleLogin : handleSignup}
                aria-label={view === "login" ? "Login" : "Signup"}
              >
                {view === "login" ? "🔐 Login" : "✍️ Signup"}
              </button>
              <p className="switch-text">
                {view === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <span
                  className="link-text"
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    clearMessages();
                    setView(view === "login" ? "signup" : "login");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      clearMessages();
                      setView(view === "login" ? "signup" : "login");
                    }
                  }}
                >
                  {view === "login" ? "Signup here" : "Login here"}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
      {view === "dashboard" && user && <Dashboard />}
    </>
  );
};

export default AuthDash;