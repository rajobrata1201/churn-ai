import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

function Dashboard() {
  const [data, setData] = useState([]);
  const [decisions, setDecisions] = useState({});
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/history/${id}`)
        .then(res => setData(res.data.results || []))
        .catch(() => alert("Failed to load past upload"));
    }
  }, [id]);

  const uploadFile = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    const res = await axios.post("http://localhost:5000/api/upload", formData);
    setData(res.data.results || res.data);
  };

  const goToHistory = () => {
    window.location.href = "/history";
  };

  const CUSTOMER_VALUE = 200;

  const getRiskLabel = (p) => {
    if (p > 0.7) return "High";
    if (p > 0.5) return "Moderate";
    if (p > 0.3) return "Mild";
    return "Safe";
  };

  const getColor = (p) => {
    if (p > 0.7) return "#ff4d4f";
    if (p > 0.5) return "#fa8c16";
    if (p > 0.3) return "#fadb14";
    return "#52c41a";
  };

  const explain = (feature) => {
    if (feature.includes("watch_time")) return "Usage dropped significantly";
    if (feature.includes("payment")) return "Payment issues observed";
    if (feature.includes("inactivity")) return "User inactive recently";
    if (feature.includes("downgrade")) return "Plan downgrade detected";
    if (feature.includes("economic")) return "Economic pressure";
    return "Behavioral change detected";
  };

  const getLenientOffer = (p) => {
    if (p > 0.8) return "15% discount";
    if (p > 0.6) return "10% discount";
    if (p > 0.4) return "5% offer";
    return "No action";
  };

  const getAggressiveOffer = (p) => {
    if (p > 0.8) return "30% discount + perks";
    if (p > 0.6) return "20% discount";
    if (p > 0.4) return "10% discount";
    return "Email engagement";
  };

  const getDiscountRate = (p, type) => {
    return type === "aggressive" ? (0.2 + p * 0.3) : (0.1 + p * 0.2);
  };

  const getRetentionLift = (p, type) => {
    return type === "aggressive" ? (0.2 + p * 0.4) : (0.1 + p * 0.3);
  };

  const handleDecision = (uid, type) => {
    setDecisions(prev => ({
      ...prev,
      [String(uid)]: type
    }));
  };

  const high = data.filter(d => d.churn_probability > 0.7).length;
  const moderate = data.filter(d => d.churn_probability > 0.5 && d.churn_probability <= 0.7).length;
  const mild = data.filter(d => d.churn_probability > 0.3 && d.churn_probability <= 0.5).length;
  const safe = data.filter(d => d.churn_probability <= 0.3).length;

  const pieData = [
    { name: "Safe", value: safe },
    { name: "Mild", value: mild },
    { name: "Moderate", value: moderate },
    { name: "High", value: high }
  ];

  const COLORS = ["#52c41a", "#fadb14", "#fa8c16", "#ff4d4f"];

  let totalSaved = 0;
  let totalCost = 0;

  data.forEach(u => {
    const decision = decisions[String(u.user_id)];
    if (decision) {
      const p = u.churn_probability;
      totalSaved += getRetentionLift(p, decision) * CUSTOMER_VALUE;
      totalCost += getDiscountRate(p, decision) * CUSTOMER_VALUE;
    }
  });

  const sortedUsers = [...data].sort(
    (a, b) => b.churn_probability - a.churn_probability
  );

  return (
    <div style={{ background: "#f5f7fb", minHeight: "100vh" }}>

      <div style={{
        background: "#0033a0",
        color: "white",
        padding: "18px",
        display: "flex",
        justifyContent: "space-between",
        fontSize: "18px",
        fontWeight: "bold",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
      }}>
        <span>ChurnAI Dashboard</span>
        <button onClick={goToHistory} style={{
          padding: "8px 15px",
          background: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}>History</button>
      </div>

      <div style={{ padding: "25px" }}>

        <input type="file" onChange={uploadFile} style={{ marginBottom: "20px" }} />

        {/* KPI CARDS */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          {[["High", high, "#ff4d4f"], ["Moderate", moderate, "#fa8c16"], ["Mild", mild, "#fadb14"], ["Safe", safe, "#52c41a"]]
            .map(([label, value, color]) => (
              <div key={label} style={{
                flex: 1,
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                <div style={{ fontSize: "14px", color: "#888" }}>{label}</div>
                <div style={{ fontSize: "26px", fontWeight: "bold", color }}>{value}</div>
              </div>
            ))}
        </div>

        {/* ROI CARD */}
        <div style={{
          marginBottom: "30px",
          padding: "20px",
          background: "white",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <h3>Business Impact</h3>
          Revenue Saved: ${totalSaved.toFixed(2)} <br />
          Discount Cost: ${totalCost.toFixed(2)} <br />
          Net Gain: ${(totalSaved - totalCost).toFixed(2)}
        </div>

        {/* CHARTS */}
        <div style={{ display: "flex", gap: "30px", marginBottom: "30px" }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
            <PieChart width={300} height={300}>
              <Pie data={pieData} dataKey="value" outerRadius={100}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          <div style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
            <BarChart width={400} height={300} data={pieData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0033a0" />
            </BarChart>
          </div>
        </div>

        {/* USERS */}
        <h3>Users</h3>

        {sortedUsers.map(u => {
          const topReason = (() => {
            if (u.churn_probability <= 0.3) return null;
            const positive = u.top_factors?.filter(f => f.impact > 0);
            if (!positive?.length) return null;
            positive.sort((a, b) => b.impact - a.impact);
            return explain(positive[0].feature);
          })();

          return (
            <div key={u.user_id} style={{
              background: getColor(u.churn_probability),
              marginBottom: "15px",
              padding: "18px",
              borderRadius: "12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
            }}>
              <b>ID:</b> {u.user_id} <br />
              <b>Risk:</b> {getRiskLabel(u.churn_probability)} ({(u.churn_probability * 100).toFixed(1)}%) <br />

              {topReason && (
                <>
                  <b>Top Reason:</b> {topReason} <br />
                </>
              )}

              <b>Lenient:</b> {getLenientOffer(u.churn_probability)} <br />
              <b>Aggressive:</b> {getAggressiveOffer(u.churn_probability)} <br />

              <div style={{ marginTop: "10px" }}>
                <button onClick={() => handleDecision(u.user_id, "lenient")}
                  style={{ padding: "12px 25px", fontSize: "15px", marginRight: "10px" }}>
                  Lenient
                </button>

                <button onClick={() => handleDecision(u.user_id, "aggressive")}
                  style={{ padding: "12px 25px", fontSize: "15px" }}>
                  Aggressive
                </button>
              </div>

              {decisions[String(u.user_id)] && (
                <div style={{ marginTop: "8px" }}>
                  Decision: {decisions[String(u.user_id)]}
                </div>
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default Dashboard;