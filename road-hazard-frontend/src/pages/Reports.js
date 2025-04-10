import { useState, useEffect } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState('all');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/reports');
        
        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }
        
        const data = await response.json();
        
        if (!data || data.length === 0) {
          // Mock data if no actual data
          setReports([
            { id: 1, type: 'Pothole', location: '51.505, -0.09', reported_by: 'John Doe', status: 'pending', reported_at: '2025-04-01T10:30:00Z', description: 'Large pothole in the middle of the road', severity: 'high' },
            { id: 2, type: 'Roadwork', location: '51.507, -0.11', reported_by: 'Jane Smith', status: 'converted', reported_at: '2025-04-02T14:22:00Z', description: 'Ongoing road construction, poorly marked', severity: 'medium' },
            { id: 3, type: 'Accident', location: '51.503, -0.10', reported_by: 'Mike Johnson', status: 'rejected', reported_at: '2025-04-03T08:15:00Z', description: 'Car collision, road partially blocked', severity: 'high' },
            { id: 4, type: 'Flooding', location: '51.509, -0.08', reported_by: 'Sarah Williams', status: 'pending', reported_at: '2025-04-05T17:45:00Z', description: 'Road flooded after heavy rain', severity: 'medium' },
            { id: 5, type: 'Other', location: '51.501, -0.095', reported_by: 'David Brown', status: 'converted', reported_at: '2025-04-07T11:10:00Z', description: 'Fallen tree blocking one lane', severity: 'medium' },
          ]);
        } else {
          setReports(data);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleApproveReport = async (id) => {
    try {
      // In a real app, you would call an API
      // const response = await fetch(`/api/reports/${id}/approve`, { method: 'POST' });
      // if (!response.ok) throw new Error('Failed to approve report');
      
      // Update local state for immediate UI update
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === id ? { ...report, status: 'converted' } : report
        )
      );
    } catch (error) {
      console.error('Error approving report:', error);
    }
  };

  const handleRejectReport = async (id) => {
    try {
      // In a real app, you would call an API
      // const response = await fetch(`/api/reports/${id}/reject`, { method: 'POST' });
      // if (!response.ok) throw new Error('Failed to reject report');
      
      // Update local state for immediate UI update
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === id ? { ...report, status: 'rejected' } : report
        )
      );
    } catch (error) {
      console.error('Error rejecting report:', error);
    }
  };

  const filteredReports = currentFilter === 'all' 
    ? reports 
    : reports.filter(report => report.status === currentFilter);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { 
      Header: 'Type', 
      accessor: 'type',
      Cell: ({ value }) => <span className="font-medium">{value}</span>
    },
    { 
      Header: 'Status', 
      accessor: 'status',
      Cell: ({ value }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(value)}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    { 
      Header: 'Reported By', 
      accessor: 'reported_by'
    },
    { 
      Header: 'Reported At', 
      accessor: 'reported_at',
      Cell: ({ value }) => formatDate(value)
    },
    { 
      Header: 'Actions', 
      accessor: 'id',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          {row.original.status === 'pending' && (
            <>
              <button 
                onClick={() => handleApproveReport(row.original.id)}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Approve
              </button>
              <button 
                onClick={() => handleRejectReport(row.original.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reject
              </button>
            </>
          )}
          <button 
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => alert(`View details for report ${row.original.id}`)}
          >
            View
          </button>
        </div>
      )
    }
  ];

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
            </select>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
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
          
          <Table
            columns={columns}
            data={filteredReports}
          />
        </Card>
      )}
    </>
  );
};

export default Reports;