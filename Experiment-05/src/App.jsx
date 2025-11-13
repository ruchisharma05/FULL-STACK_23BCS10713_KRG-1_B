import React, { useState } from "react";
import AuthDash from "./AuthDash";
import StudyGroupModule from "./StudyGroupModule";
import "./App.css";

const App = () => {
  const [user, setUser] = useState(null); 
  const [view, setView] = useState("auth"); 

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setView("studyGroups");
  };

  const handleLogout = () => {
    setUser(null);
    setView("auth");
  };

  return (
    <div className="page-container">
      {view === "auth" && <AuthDash onLogin={handleLogin} />}
      {view === "studyGroups" && user && (
        <>
          <StudyGroupModule currentUserId={user.email || user.username} />
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button
              onClick={handleLogout}
              className="button"
              aria-label="Logout and Back to Login"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;