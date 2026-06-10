import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import judgeRoutes from "./routes/judge.routes.js";
import evaluationRoutes from "./routes/evaluation.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend server is running");
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/judge", judgeRoutes);
app.use("/api/evaluations", evaluationRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});