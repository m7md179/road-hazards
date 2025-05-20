import { useState, useEffect } from "react";
import PageHeader from "../components/layout/PageHeader";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Card from "../components/ui/Card";
import {
  fetchDashboardStats,
  verifyDatabaseSchema,
} from "../lib/supabaseClient";
import TableauDashboard from "../components/TableauDashboard";
import TableauGraphs from "../components/TableauGraphs";
import StatCard from "../components/ui/StatCard";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReports: 0,
    totalHazards: 0,
    totalUsers: 0,
    pendingReports: 0,
    reportsByStatus: [],
    hazardsByType: [],
    reportsOverTime: [],
    userTrustDistribution: [],
    activeHazards: 0,
    resolvedHazards: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async (retries = 3) => {
      try {
        setLoading(true);
        setError(null);

        // Verify database schema first
        const isSchemaValid = await verifyDatabaseSchema();
        if (!isSchemaValid) {
          throw new Error("Database schema verification failed");
        }

        const dashboardData = await fetchDashboardStats();
        setStats(dashboardData);
        console.log("Dashboard data loaded successfully:", dashboardData);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        if (retries > 0) {
          console.log(`Retrying... ${retries} attempts left`);
          setTimeout(() => loadDashboardData(retries - 1), 2000);
        } else {
          setError(`Failed to load dashboard data: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of road hazard reports and statistics"
        actions={
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Export Report
          </button>
        }
      />

      {/* Statistics Dashboard */}
      <TableauDashboard />

      {/* Graphs Dashboard */}
      <TableauGraphs />
    </>
  );
};

export default Dashboard;
