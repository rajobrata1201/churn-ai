import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>

        {/* DEFAULT → LOGIN */}
        <Route path="/" element={<Login />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* MAIN */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />

        {/* LOAD PAST UPLOAD */}
        <Route path="/dashboard/:id" element={<Dashboard />} />

      </Routes>
    </Router>
  );
}

export default App;