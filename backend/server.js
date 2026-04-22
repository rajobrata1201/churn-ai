const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// LOCAL MongoDB connection
mongoose.connect("mongodb://admin:proj123@ac-cql8cab-shard-00-00.un2nl37.mongodb.net:27017,ac-cql8cab-shard-00-01.un2nl37.mongodb.net:27017,ac-cql8cab-shard-00-02.un2nl37.mongodb.net:27017/churnDB?ssl=true&replicaSet=atlas-8b8njn-shard-0&authSource=admin&appName=Cluster0")
  .then(() => console.log("Mongo connected"))
  .catch(err => console.log(err));

// test route
app.get("/", (req, res) => {
    res.send("API running");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
const uploadRoute = require("./routes/upload");
app.use("/api/upload", uploadRoute);
const historyRoutes = require("./routes/history");
app.use("/api/history", historyRoutes);
const decisionRoutes = require("./routes/decision");
app.use("/api/decision", decisionRoutes);