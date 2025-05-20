import { useState, useEffect } from "react";
import PageHeader from "../components/layout/PageHeader";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import { supabase } from "../lib/supabaseClient";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [hazardTypes, setHazardTypes] = useState({});
  const [users, setUsers] = useState({});

  // Fetch hazard types and create a lookup object
  const fetchHazardTypes = async () => {
    try {
      const { data, error } = await supabase.from("hazard_types").select("*");

      if (error) throw error;

      // Create a lookup object with hazard_type_id as keys
      const hazardTypesMap = {};
      data.forEach((type) => {
        hazardTypesMap[type.hazard_type_id] = type.name;
      });

      setHazardTypes(hazardTypesMap);
    } catch (error) {
      console.error("Error fetching hazard types:", error);
    }
  };

  // Fetch users for reporter information
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("id,name");

      if (error) throw error;

      // Create a lookup object with user id as keys
      const usersMap = {};
      data.forEach((user) => {
        usersMap[user.id] = user.name;
      });

      setUsers(usersMap);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch reports with related location data
  const fetchReports = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("reports")
        .select(
          `
          report_id,
          user_id,
          hazard_type_id,
          description,
          status,
          report_timestamp,
          similar_reports_count,
          locations (
            latitude,
            longitude,
            address
          )
        `
        )
        .order("report_timestamp", { ascending: false });

      if (error) throw error;

      if (data) {
        const transformedData = data.map((report) => {
          const location = report.locations
            ? `${report.locations.latitude}, ${report.locations.longitude}`
            : "Unknown";

          return {
            id: report.report_id,
            type: hazardTypes[report.hazard_type_id] || "Unknown",
            hazard_type_id: report.hazard_type_id,
            location: location,
            location_address: report.locations?.address || "No address",
            reported_by: users[report.user_id] || "Unknown User",
            user_id: report.user_id,
            status: report.status || "pending",
            reported_at: report.report_timestamp,
            description: report.description || "No description",
            similar_reports: report.similar_reports_count || 0,
          };
        });

        setReports(transformedData);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch reference data first
    const loadData = async () => {
      await fetchHazardTypes();
      await fetchUsers();
      await fetchReports();
    };

    loadData();

    // Set up a subscription to reports changes
    const reportsSubscription = supabase
      .channel("reports-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reports" },
        () => {
          fetchReports();
        }
      )
      .subscribe();

    // Clean up subscription
    return () => {
      supabase.removeChannel(reportsSubscription);
    };
  }, []);

  const handleApproveReport = async (id) => {
    try {
      const { error } = await supabase
        .from("reports")
        .update({ status: "converted" })
        .eq("report_id", id);

      if (error) throw error;

      // Also add to the hazards table
      const reportToConvert = reports.find((report) => report.id === id);
      if (reportToConvert) {
        const { error: hazardError } = await supabase.from("hazards").insert({
          hazard_type_id: reportToConvert.hazard_type_id,
          location_id: reportToConvert.location_id,
          description: reportToConvert.description,
          created_from_report_id: id,
          status: "active",
        });

        if (hazardError) throw hazardError;
      }

      // Optimistic update
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === id ? { ...report, status: "converted" } : report
        )
      );
    } catch (error) {
      console.error("Error approving report:", error);
    }
  };

  const handleRejectReport = async (id) => {
    try {
      const { error } = await supabase
        .from("reports")
        .update({ status: "rejected" })
        .eq("report_id", id);

      if (error) throw error;

      // Optimistic update
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === id ? { ...report, status: "rejected" } : report
        )
      );
    } catch (error) {
      console.error("Error rejecting report:", error);
    }
  };

  const handleUpdateReportState = async (id, newState) => {
    try {
      const { error } = await supabase
        .from("reports")
        .update({ status: newState })
        .eq("report_id", id);

      if (error) throw error;

      // Optimistic update
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === id ? { ...report, status: newState } : report
        )
      );
    } catch (error) {
      console.error("Error updating report state:", error);
    }
  };

  const handleUpdateHazardType = async (id, newHazardTypeId) => {
    try {
      const { error } = await supabase
        .from("reports")
        .update({ hazard_type_id: newHazardTypeId })
        .eq("report_id", id);

      if (error) throw error;

      // Optimistic update
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === id
            ? {
                ...report,
                hazard_type_id: newHazardTypeId,
                type: hazardTypes[newHazardTypeId],
              }
            : report
        )
      );
    } catch (error) {
      console.error("Error updating hazard type:", error);
    }
  };

  const filteredReports =
    currentFilter === "all"
      ? reports
      : reports.filter((report) => report.status === currentFilter);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "converted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "investigating":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Type",
      "Location",
      "Address",
      "Reported By",
      "Status",
      "Reported At",
      "Description",
      "Similar Reports",
    ];

    const rows = filteredReports.map((report) => [
      report.id,
      report.type,
      report.location,
      report.location_address,
      report.reported_by,
      report.status,
      formatDate(report.reported_at),
      report.description,
      report.similar_reports,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "hazard_reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    { Header: "ID", accessor: "id" },
    {
      Header: "Type",
      accessor: "type",
      Cell: ({ row }) => (
        <select
          className="px-2 py-1 border rounded"
          value={row.original.hazard_type_id}
          onChange={(e) =>
            handleUpdateHazardType(row.original.id, e.target.value)
          }
        >
          {Object.entries(hazardTypes).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) => (
        <div className="flex flex-col space-y-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium text-center ${getStatusBadgeClass(
              row.original.status
            )}`}
          >
            {row.original.status.charAt(0).toUpperCase() +
              row.original.status.slice(1)}
          </span>
          {row.original.status === "pending" && (
            <div className="flex space-x-1">
              <button
                onClick={() => handleApproveReport(row.original.id)}
                className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => handleRejectReport(row.original.id)}
                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          )}
          <select
            className="px-2 py-1 text-xs border rounded"
            value={row.original.status}
            onChange={(e) =>
              handleUpdateReportState(row.original.id, e.target.value)
            }
          >
            <option value="pending">Pending</option>
            <option value="converted">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="processing">Processing</option>
            <option value="investigating">Investigating</option>
          </select>
        </div>
      ),
    },
    { Header: "Reported By", accessor: "reported_by" },
    {
      Header: "Location",
      accessor: "location_address",
      Cell: ({ row }) => (
        <div className="text-sm">
          <div>{row.original.location_address}</div>
          <div className="text-gray-500">{row.original.location}</div>
        </div>
      ),
    },
    {
      Header: "Reported At",
      accessor: "reported_at",
      Cell: ({ value }) => formatDate(value),
    },
    {
      Header: "Similar Reports",
      accessor: "similar_reports",
      Cell: ({ value }) => (
        <span className={value > 0 ? "font-medium text-blue-600" : ""}>
          {value}
        </span>
      ),
    },
  ].filter(Boolean); // This ensures no undefined columns

  return (
    <>
      <PageHeader
        title="Hazard Reports"
        description="Manage and review user-submitted hazard reports"
        actions={
          <div className="flex space-x-2">
            <select
              className="px-4 py-2 border rounded-lg"
              value={currentFilter}
              onChange={(e) => setCurrentFilter(e.target.value)}
            >
              <option value="all">All Reports</option>
              <option value="pending">Pending</option>
              <option value="converted">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="processing">Processing</option>
              <option value="investigating">Investigating</option>
            </select>
            <button
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              onClick={handleExportCSV}
            >
              Export CSV
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Report List</h2>
            <span className="text-sm text-gray-500">
              Showing {filteredReports.length} of {reports.length} reports
            </span>
          </div>

          {reports.length > 0 ? (
            <Table columns={columns} data={filteredReports} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No reports found.{" "}
              {currentFilter !== "all" && "Try changing your filter."}
            </div>
          )}
        </Card>
      )}
    </>
  );
};

export default Reports;
