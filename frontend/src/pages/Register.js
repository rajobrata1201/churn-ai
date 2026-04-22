import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyType, setCompanyType] = useState("");

  const register = async () => {
    if (!companyName || !email || !password || !companyType) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        companyName,
        email,
        password,
        companyType
      });

      alert("Registered successfully");
      window.location.href = "/";
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="title">Create Account</div>

        <input
          className="input"
          placeholder="Company Name"
          onChange={e => setCompanyName(e.target.value)}
        />

        <input
          className="input"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        {/* DROPDOWN FIX */}
        <select
          className="input"
          value={companyType}
          onChange={e => setCompanyType(e.target.value)}
        >
          <option value="">Select Company Type</option>
          <option value="music">Music Streaming</option>
          <option value="video">Video Streaming</option>
          <option value="cloud">Cloud Service</option>
          <option value="ai">AI Platform</option>
        </select>

        <button className="button" onClick={register}>
          Register
        </button>

        <div
          className="link"
          onClick={() => (window.location.href = "/")}
        >
          Already have an account? Login
        </div>
      </div>
    </div>
  );
}

export default Register;