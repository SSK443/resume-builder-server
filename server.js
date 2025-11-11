// server/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import resumeRouter from "./routes/resumeRoutes.js";
import userRouter from "./routes/userRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import testRouter from  "./routes/testRouter.js"

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
app.use("/api",testRouter)


// app.listen(port,()=>{console.log(`running at ${port}`);
// })
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${ PORT }`));
}

export default app;