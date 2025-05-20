// Main application entry point
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import helmet from "helmet";
import fileUpload from "express-fileupload";
import { createServer } from "http";
import { createHttpsProxyAgent } from "https-proxy-agent";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import reportsRoutes from "./routes/reports.routes.js";
import usersRoutes from "./routes/users.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import hazardsRoutes from "./routes/hazards.routes.js";

// Import middleware
import { adminAuthMiddleware } from "./middleware/admin.middleware.js";

dotenv.config();

const app = express();
const server = createServer(app);

// Configure proxy agent if using ngrok
const proxyAgent = process.env.HTTPS_PROXY
  ? createHttpsProxyAgent(process.env.HTTPS_PROXY)
  : null;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(
  fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
    createParentPath: true,
  })
);

// Add proxy settings to app locals if needed
if (proxyAgent) {
  app.locals.httpsAgent = proxyAgent;
}

// API routes
app.use("/api/auth", authRoutes);

// Admin routes - protected by authentication
app.use("/api/dashboard", adminAuthMiddleware, dashboardRoutes);
app.use("/api/reports", adminAuthMiddleware, reportsRoutes);
app.use("/api/users", adminAuthMiddleware, usersRoutes);
app.use("/api/hazards", adminAuthMiddleware, hazardsRoutes);

// Health check endpoints
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Supabase diagnostic endpoint
app.get("/api/supabase-test", async (req, res) => {
  try {
    console.log("Testing Supabase connection...");
    const { data, error } = await supabase
      .from("users")
      .select("count(*)", { count: "exact", head: true });

    if (error) {
      console.error("Supabase test error:", error);
      return res.status(500).json({
        status: "error",
        message: "Failed to connect to Supabase",
        error: error.message,
        details: error,
      });
    }

    // Check if we're using the mock client
    const isMockClient =
      typeof supabase.from("test_table").select === "function" &&
      typeof supabase.from("test_table").select("*").eq === "function" &&
      typeof supabase.from("test_table").select("*").eq().single ===
        "function" &&
      !supabase.from("test_table").select("*").eq().single.native;

    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      supabase: {
        connected: true,
        url: process.env.SUPABASE_URL
          ? `${process.env.SUPABASE_URL.substring(0, 20)}...`
          : "Not set",
        usingMockClient: isMockClient,
        testQueryResult: data,
      },
    });
  } catch (error) {
    console.error("Supabase test error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to test Supabase connection",
      error: error.message,
    });
  }
});

app.get("/api/mock-data", (req, res) => {
  const mockData = {
    dashboard: {
      stats: {
        totalReports: 156,
        totalHazards: 83,
        totalUsers: 327,
        pendingReports: 12,
      },
    },
    reports: [
      {
        id: 1,
        type: "Pothole",
        status: "pending",
        reported_at: new Date().toISOString(),
      },
      {
        id: 2,
        type: "Roadwork",
        status: "approved",
        reported_at: new Date().toISOString(),
      },
    ],
    hazards: [
      {
        id: 1,
        type: "Pothole",
        severity: "high",
        latitude: 51.505,
        longitude: -0.09,
      },
      {
        id: 2,
        type: "Roadwork",
        severity: "medium",
        latitude: 51.51,
        longitude: -0.1,
      },
    ],
  };
  res.status(200).json(mockData);
});

// Root path
app.get("/", (req, res) => {
  res.json({
    message: "Road Hazard API",
    version: "1.0.0",
    docs: "/api-docs",
  });
});

const PORT = process.env.PORT || 3000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
