// server/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import resumeRouter from "./routes/resumeRoutes.js";
import userRouter from "./routes/userRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

const app = express();
const port = process.env.PORT || 5000;
// Connect to MongoDB
await connectDB();

app.use(express.json());
app.use(cors());



app.get("/", (req, res) => {
  res.send("✅ Server is running...");
});

app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);


app.listen(port, () => {
  console.log(`🚀 Server running at port ${port}`);
});
