import express from "express";
import cors from "cors";
import { getPool } from "./db/connect.js";
const app = express();
import { connectDB } from "./db/connect.js";
import studentRoutes from "./routes/students.js";
import departmentRoutes from "./routes/departments.js";
import roomsRoutes from "./routes/rooms.js";
import authRoutes from "./routes/auth.routes.js";
import leaveRoutes from "./routes/leave.routes.js";

// await connectDB();


// cors configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://hostel-14.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
};

app.use(cors(corsOptions));
// app.options("/*", cors(corsOptions));

// basic configs
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/departments", departmentRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/leave", leaveRoutes);

app.get("/students-list", async (req, res) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query('CALL GetStudentList()');
        res.json(rows[0]);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/", (req, res) => {
    res.send("Hostel 14 Backend API Running");
});
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});
export default app