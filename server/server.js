import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import judgeRoutes from "./routes/judge.routes.js";
import evaluationRoutes from "./routes/evaluation.routes.js";
import participantRoutes from "./routes/participant.routes.js";
import teamRoutes from "./routes/team.routes.js";
import hackathonRoutes from "./routes/hackathon.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import invitationRoutes from "./routes/invitation.routes.js";
import announcementRoutes from "./routes/announcement.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/files/preview/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  // Force browser to display inline as PDF
  res.sendFile(filePath, { 
    headers: { 
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="preview.pdf"'
    } 
  }, (err) => {
    if (err) res.status(404).send("File not found");
  });
});

app.get('/api/files/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  // Force browser to download as PDF if no extension
  const fileName = req.params.filename.includes('.') ? req.params.filename : 'document.pdf';
  res.download(filePath, fileName, (err) => {
    if (err) res.status(404).send("File not found");
  });
});

app.get("/", (req, res) => {
  res.send("Backend server is running");
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/judge", judgeRoutes);
app.use("/api/evaluations", evaluationRoutes);
app.use("/api/participant", participantRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/announcements", announcementRoutes);
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});