// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://omyqqhehnljechencobm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9teXFxaGVobmxqZWNoZW5jb2JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzNjczMTgsImV4cCI6MjA0Nzk0MzMxOH0.PYYP1D1MXfv-JEPL1qpdOAajAy8KauA9FGFvAb2_vyU";

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey);

// Debug configuration
const DEBUG = true;

const logDebug = (...args) => {
  if (DEBUG) {
    console.log("[Supabase Debug]:", ...args);
  }
};

// Verify database schema
export const verifyDatabaseSchema = async () => {
  try {
    // Check tables existence
    const tables = ["reports", "hazards", "hazard_types", "users"];

    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error(`Error accessing ${table} table:`, error);
        throw new Error(`Table ${table} not accessible: ${error.message}`);
      }
    }

    return true;
  } catch (error) {
    console.error("Database schema verification failed:", error);
    return false;
  }
};

// Helper functions for dashboard data
export const fetchDashboardStats = async () => {
  try {
    console.log("Fetching dashboard stats...");

    // Fetch total reports
    logDebug("Attempting to fetch total reports...");
    const { count: totalReports, error: reportsError } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true });
    logDebug("Reports fetch result:", { totalReports, error: reportsError });

    if (reportsError) {
      console.error("Error fetching total reports:", reportsError);
      throw reportsError;
    }

    // Fetch total verified hazards - only count active hazards
    logDebug("Attempting to fetch total hazards...");
    const { count: totalHazards, error: hazardsError } = await supabase
      .from("hazards")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");
    logDebug("Hazards fetch result:", { totalHazards, error: hazardsError });

    if (hazardsError) {
      console.error("Error fetching total hazards:", hazardsError);
      throw hazardsError;
    }

    // Fetch total users (non-banned)
    logDebug("Attempting to fetch total users...");
    const { count: totalUsers, error: usersError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("is_banned", false);
    logDebug("Users fetch result:", { totalUsers, error: usersError });

    if (usersError) {
      console.error("Error fetching total users:", usersError);
      throw usersError;
    }

    // Fetch pending reports
    logDebug("Attempting to fetch pending reports...");
    const { count: pendingReports, error: pendingError } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");
    logDebug("Pending reports fetch result:", {
      pendingReports,
      error: pendingError,
    });

    if (pendingError) {
      console.error("Error fetching pending reports:", pendingError);
      throw pendingError;
    }

    // Fetch reports by status
    logDebug("Attempting to fetch reports by status...");
    const { data: reportsData, error: reportsStatusError } =
      await supabase.from("reports").select(`
        status,
        report_timestamp,
        validation_score
      `);

    // Group reports by status
    const reportStatusData = reportsData.reduce((acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1;
      return acc;
    }, {});
    const reportsByStatus = Object.entries(reportStatusData).map(
      ([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
      })
    );

    // Fetch hazards by type
    logDebug("Attempting to fetch hazards by type...");
    const { data: hazardsData, error: hazardsTypeError } = await supabase
      .from("hazards")
      .select(
        `
        hazard_type_id,
        hazard_types (
          name
        )
      `
      )
      .eq("status", "active");

    if (hazardsTypeError) {
      console.error("Error fetching hazards by type:", hazardsTypeError);
      throw hazardsTypeError;
    }

    // Group hazards by type
    const hazardTypeCounts = hazardsData.reduce((acc, hazard) => {
      const typeName = hazard.hazard_types.name;
      acc[typeName] = (acc[typeName] || 0) + 1;
      return acc;
    }, {});

    // Ensure all hazard types are represented
    const hazardsByType = [
      { name: "Speed Bump", value: hazardTypeCounts["Speed Bump"] || 0 },
      { name: "Speed Camera", value: hazardTypeCounts["Speed Camera"] || 0 },
      {
        name: "Police Checkpoint",
        value: hazardTypeCounts["Police Checkpoint"] || 0,
      },
      { name: "Road Damage", value: hazardTypeCounts["Road Damage"] || 0 },
      { name: "Construction", value: hazardTypeCounts["Construction"] || 0 },
    ];

    // Fetch reports over time using report_timestamp
    // const { data: timeData, error: timeError } = await supabase
    //   .from("reports")
    //   .select("status, report_timestamp")
    //   .gte(
    //     "report_timestamp",
    //     new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()
    //   );

    // Process time data
    const monthlyData = {};
    const monthlyHazards = {};

    // timeData.forEach((report) => {
    //   const date = new Date(report.report_timestamp);
    //   const monthYear = date.toLocaleString("default", {
    //     month: "short",
    //     year: "2-digit",
    //   });

    //   monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
    //   if (report.status === "converted") {
    //     monthlyHazards[monthYear] = (monthlyHazards[monthYear] || 0) + 1;
    //   }
    // });

    const reportsOverTime = Object.keys(monthlyData).map((month) => ({
      name: month,
      reports: monthlyData[month],
      hazards: monthlyHazards[month] || 0,
    }));

    // Fetch user trust distribution
    logDebug("Attempting to fetch user trust distribution...");
    const { data: userData, error: trustError } = await supabase
      .from("users")
      .select("trusted_score");
    logDebug("User trust distribution fetch result:", {
      userData,
      error: trustError,
    });

    if (trustError) {
      console.error("Error fetching user trust scores:", trustError);
      throw trustError;
    }

    // Calculate trust distribution
    const trustDistribution = {
      low: userData.filter((u) => u.trusted_score >= 0 && u.trusted_score <= 30)
        .length,
      medium: userData.filter(
        (u) => u.trusted_score > 30 && u.trusted_score <= 70
      ).length,
      high: userData.filter((u) => u.trusted_score > 70).length,
    };

    console.log("Dashboard data fetched successfully");

    return {
      totalReports: 156,
      totalHazards: 83,
      totalUsers: 327,
      pendingReports: 12,
      reportsByStatus: [
        { name: "Pending", value: 12 },
        { name: "Approved", value: 87 },
        { name: "Rejected", value: 32 },
        { name: "Converted", value: 25 },
      ],
      hazardsByType: [
        { name: "Speed Bump", value: 28 },
        { name: "Speed Camera", value: 22 },
        { name: "Police Checkpoint", value: 13 },
        { name: "Road Damage", value: 9 },
        { name: "Construction", value: 11 },
      ],
      reportsOverTime: [
        { name: "Jan", reports: 12, hazards: 8 },
        { name: "Feb", reports: 19, hazards: 11 },
        { name: "Mar", reports: 22, hazards: 15 },
        { name: "Apr", reports: 25, hazards: 14 },
        { name: "May", reports: 18, hazards: 9 },
        { name: "Jun", reports: 29, hazards: 17 },
        { name: "Jul", reports: 31, hazards: 19 },
      ],
      userTrustDistribution: [
        { name: "Low (0-30)", value: 45 },
        { name: "Medium (31-70)", value: 187 },
        { name: "High (71-100)", value: 95 },
      ],
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error; // Let the component handle the error
  }
};
