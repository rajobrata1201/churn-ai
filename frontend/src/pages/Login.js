import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="title">Login</div>

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

        <button className="button" onClick={login}>
          Login
        </button>

        <div
          className="link"
          onClick={() => (window.location.href = "/register")}
        >
          Don’t have an account? Register
        </div>
      </div>
    </div>
  );
}

export default Login;