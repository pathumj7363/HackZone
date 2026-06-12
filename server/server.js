import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import judgeRoutes from "./routes/judge.routes.js";
import evaluationRoutes from "./routes/evaluation.routes.js";
import participantRoutes from "./routes/participant.routes.js";
import teamRoutes from "./routes/team.routes.js";
import hackathonRoutes from "./routes/hackathon.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
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
app.use("/api/participant", participantRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/submissions", submissionRoutes);
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});