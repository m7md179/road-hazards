import { useState, useEffect } from "react";
import PageHeader from "../components/layout/PageHeader";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import { supabase } from "../lib/supabaseClient";

const Hazards = () => {
  const [hazards, setHazards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [hazardTypes, setHazardTypes] = useState({});

  const fetchHazardTypes = async () => {
    try {
      const { data, error } = await supabase.from("hazard_types").select("*");
      if (error) throw error;
      const hazardTypesMap = {};
      data.forEach((type) => {
        hazardTypesMap[type.hazard_type_id] = type.name;
      });
      setHazardTypes(hazardTypesMap);
    } catch (error) {
      console.error("Error fetching hazard types:", error);
    }
  };

  const fetchHazards = async () => {
    try {
      setLoading(true);

      // First get the hazard types
      const { data: typeData, error: typeError } = await supabase
        .from("hazard_types")
        .select("*");

      if (typeError) throw typeError;

      const hazardTypesMap = {};
      typeData.forEach((type) => {
        hazardTypesMap[type.hazard_type_id] = type.name;
      });
      setHazardTypes(hazardTypesMap);

      // Then fetch hazards with location data
      const { data, error } = await supabase
        .from("hazards")
        .select(
          `
          *,
          locations (*)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        const transformedData = data.map((hazard) => ({
          id: hazard.hazard_id,
          type: hazardTypesMap[hazard.hazard_type_id] || "Unknown",
          hazard_type_id: hazard.hazard_type_id,
          location: hazard.locations
            ? `${hazard.locations.latitude}, ${hazard.locations.longitude}`
            : "Unknown",
          location_address: hazard.locations?.address || "No address",
          status: hazard.status || "active",
          created_at: hazard.created_at,
          last_updated: hazard.last_updated,
          risk_level: hazard.risk_level || "medium",
          description: hazard.description || "No description",
        }));

        setHazards(transformedData);
      }
    } catch (error) {
      console.error("Error fetching hazards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchHazardTypes();
      await fetchHazards();
    };

    loadData();

    const hazardsSubscription = supabase
      .channel("hazards-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "hazards" },
        () => {
          fetchHazards();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(hazardsSubscription);
    };
  }, []);

  const handleUpdateHazardType = async (id, newHazardTypeId) => {
    try {
      const { error } = await supabase
        .from("hazards")
        .update({ hazard_type_id: newHazardTypeId })
        .eq("hazard_id", id);

      if (error) throw error;

      setHazards((prevHazards) =>
        prevHazards.map((hazard) =>
          hazard.id === id
            ? {
                ...hazard,
                hazard_type_id: newHazardTypeId,
                type: hazardTypes[newHazardTypeId],
              }
            : hazard
        )
      );
    } catch (error) {
      console.error("Error updating hazard type:", error);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from("hazards")
        .update({
          status: newStatus,
          last_updated: new Date().toISOString(),
        })
        .eq("hazard_id", id);

      if (error) throw error;

      setHazards((prevHazards) =>
        prevHazards.map((hazard) =>
          hazard.id === id ? { ...hazard, status: newStatus } : hazard
        )
      );
    } catch (error) {
      console.error("Error updating hazard status:", error);
    }
  };

  const filteredHazards =
    currentFilter === "all"
      ? hazards
      : hazards.filter((hazard) => hazard.status === currentFilter);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "resolved":
        return "bg-blue-100 text-blue-800";
      case "investigating":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskBadgeClass = (risk) => {
    switch (risk) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
          <select
            className="px-2 py-1 text-xs border rounded"
            value={row.original.status}
            onChange={(e) =>
              handleUpdateStatus(row.original.id, e.target.value)
            }
          >
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
            <option value="investigating">Investigating</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      ),
    },
    {
      Header: "Risk Level",
      accessor: "risk_level",
      Cell: ({ value }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskBadgeClass(
            value
          )}`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
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
      Header: "Created At",
      accessor: "created_at",
      Cell: ({ value }) => formatDate(value),
    },
    {
      Header: "Last Updated",
      accessor: "last_updated",
      Cell: ({ value }) => formatDate(value),
    },
  ];

  return (
    <>
      <PageHeader
        title="Active Hazards"
        description="Manage and monitor identified road hazards"
        actions={
          <div className="flex space-x-2">
            <select
              className="px-4 py-2 border rounded-lg"
              value={currentFilter}
              onChange={(e) => setCurrentFilter(e.target.value)}
            >
              <option value="all">All Hazards</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
              <option value="investigating">Investigating</option>
              <option value="archived">Archived</option>
            </select>
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
            <h2 className="text-xl font-semibold">Hazard List</h2>
            <span className="text-sm text-gray-500">
              Showing {filteredHazards.length} of {hazards.length} hazards
            </span>
          </div>

          {hazards.length > 0 ? (
            <Table columns={columns} data={filteredHazards} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No hazards found.{" "}
              {currentFilter !== "all" && "Try changing your filter."}
            </div>
          )}
        </Card>
      )}
    </>
  );
};

export default Hazards;
