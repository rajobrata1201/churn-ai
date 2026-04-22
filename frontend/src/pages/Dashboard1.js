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
    <div>

      <div style={{
        background: "#0033a0",
        color: "white",
        padding: "15px",
        display: "flex",
        justifyContent: "space-between"
      }}>
        <b>ChurnAI Dashboard</b>
        <button onClick={goToHistory}>History</button>
      </div>

      <div style={{ padding: "20px" }}>

        <input type="file" onChange={uploadFile} />

        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <div>High: {high}</div>
          <div>Moderate: {moderate}</div>
          <div>Mild: {mild}</div>
          <div>Safe: {safe}</div>
        </div>

        <div style={{
          marginTop: "20px",
          padding: "15px",
          background: "#f0f5ff",
          borderRadius: "10px"
        }}>
          Revenue Saved: ${totalSaved.toFixed(2)} <br />
          Discount Cost: ${totalCost.toFixed(2)} <br />
          Net Gain: ${(totalSaved - totalCost).toFixed(2)}
        </div>

        <div style={{ display: "flex", gap: "40px", marginTop: "30px" }}>
          <PieChart width={300} height={300}>
            <Pie data={pieData} dataKey="value" outerRadius={100}>
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>

          <BarChart width={400} height={300} data={pieData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#0033a0" />
          </BarChart>
        </div>

        <h3 style={{ marginTop: "30px" }}>Users</h3>

        {sortedUsers.map(u => {

          const topReason = (() => {
            if (u.churn_probability <= 0.3) return null;

            const positiveFactors = u.top_factors?.filter(f => f.impact > 0);

            if (!positiveFactors || positiveFactors.length === 0) return null;

            positiveFactors.sort((a,b)=>b.impact-a.impact);

            return explain(positiveFactors[0].feature);
          })();

          return (
            <div key={u.user_id} style={{
              background: getColor(u.churn_probability),
              marginBottom: "12px",
              padding: "15px",
              borderRadius: "10px"
            }}>
              <b>ID:</b> {u.user_id} <br />
              <b>Risk:</b> {getRiskLabel(u.churn_probability)} ({(u.churn_probability * 100).toFixed(1)}%) <br />

              {topReason && (
                <>
                  <b>Top Reason:</b> {topReason} <br />
                </>
              )}

              <b>Recommended (Lenient):</b> {getLenientOffer(u.churn_probability)} <br />
              <b>Recommended (Aggressive):</b> {getAggressiveOffer(u.churn_probability)} <br />

              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => handleDecision(u.user_id, "lenient")}
                  style={{ padding: "12px 25px", fontSize: "16px", marginRight: "10px" }}
                >
                  Go Lenient
                </button>

                <button
                  onClick={() => handleDecision(u.user_id, "aggressive")}
                  style={{ padding: "12px 25px", fontSize: "16px" }}
                >
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