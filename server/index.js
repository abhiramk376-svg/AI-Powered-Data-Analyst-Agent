const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use(helmet());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const port = process.env.PORT || 5000;

//import routes
const authRoutes = require("./Routes/auth.js");

//use Routes
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
