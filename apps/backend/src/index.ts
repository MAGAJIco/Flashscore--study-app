import express from "express";
import mongoose from "mongoose";
import newsRoutes from "./routes/news";

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/sportscentral");

// Routes
app.use("/news", newsRoutes);

app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});