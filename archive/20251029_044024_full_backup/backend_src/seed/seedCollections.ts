import mongoose, { Types } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// ✅ Named imports from model files
import { NewsAuthor } from "../models/NewsAuthor.js";
import { News } from "../models/News.js";
import { Prediction } from "../models/Predictions.js";
import { User } from "../models/User.js";

// Ensure MONGO_URI exists
const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) throw new Error("MONGODB_URI not set in environment");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

// Seed function
const seedData = async () => {
  try {
    // Clear existing data
    await NewsAuthor.deleteMany();
    await News.deleteMany();
    await Prediction.deleteMany();
    await User.deleteMany();

    // Seed authors - cast to any to access _id
    const authors = await NewsAuthor.insertMany([
      { name: "John Doe", email: "john@example.com", role: "admin" },
      { name: "Jane Smith", email: "jane@example.com", role: "editor" },
    ]) as any[];

    // Seed users
    const users = await User.insertMany([
      { name: "Alice", email: "alice@example.com" },
      { name: "Bob", email: "bob@example.com" },
    ]) as any[];

    // Seed news/articles
    const articles = await News.insertMany([
      { title: "First Article", content: "Hello World!", author: authors[0]._id },
      { title: "Second Article", content: "Testing...", author: authors[1]._id },
    ]) as any[];

    // Seed predictions
    const predictions = await Prediction.insertMany([
      { game: "Team A vs Team B", prediction: "Team A wins", author: authors[0]._id },
    ]) as any[];

    console.log("🎉 Database seeded successfully!");
    console.log(`📊 Seeded: ${authors.length} authors, ${users.length} users, ${articles.length} articles, ${predictions.length} predictions`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
};

// Run seeding
connectDB().then(seedData);