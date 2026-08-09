import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatbotPage from "./Pages/chatbot";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";
import ProfileSettings from "./Pages/ProfileSettings";
import ScrollToTop from "./components/ScrolltoTop";

function App() {
  return (
    <Router>
      <div className="App">
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatbotPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/settings" element={<ProfileSettings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
