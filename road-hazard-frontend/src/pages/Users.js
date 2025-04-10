import { useState, useEffect } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        
        if (!data || !data.users || data.users.length === 0) {
          // Mock data if no actual data
          setUsers([
            { id: 1, name: 'John Doe', email: 'john@example.com', trusted_score: 85, is_admin: true, is_banned: false },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', trusted_score: 92, is_admin: false, is_banned: false },
            { id: 3, name: 'Mike Johnson', email: 'mike@example.com', trusted_score: 45, is_admin: false, is_banned: true },
            { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', trusted_score: 78, is_admin: false, is_banned: false },
            { id: 5, name: 'David Brown', email: 'david@example.com', trusted_score: 23, is_admin: false, is_banned: false },
          ]);
        } else {
          setUsers(data.users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = filter === 'all' 
    ? users 
    : filter === 'banned' 
      ? users.filter(user => user.is_banned)
      : filter === 'admins'
        ? users.filter(user => user.is_admin)
        : filter === 'low_trust'
          ? users.filter(user => user.trusted_score < 50)
          : users;

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { 
      Header: 'Name', 
      accessor: 'name',
      Cell: ({ value }) => <span className="font-medium">{value}</span>
    },
    { 
      Header: 'Email', 
      accessor: 'email' 
    },
    { 
      Header: 'Trust Score', 
      accessor: 'trusted_score',
      Cell: ({ value }) => {
        let colorClass = 'bg-red-100 text-red-800';
        if (value >= 70) colorClass = 'bg-green-100 text-green-800';
        else if (value >= 40) colorClass = 'bg-yellow-100 text-yellow-800';
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {value}
          </span>
        );
      }
    },
    { 
      Header: 'Role', 
      accessor: 'is_admin',
      Cell: ({ value }) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value ? 'Admin' : 'User'}
        </span>
      )
    },
    { 
      Header: 'Status', 
      accessor: 'is_banned',
      Cell: ({ value }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {value ? 'Banned' : 'Active'}
        </span>
      )
    },
    { 
      Header: 'Actions', 
      accessor: 'id',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button 
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => alert(`View details for user ${row.original.id}`)}
          >
            View
          </button>
          {row.original.is_banned ? (
            <button 
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => alert(`Unban user ${row.original.id}`)}
            >
              Unban
            </button>
          ) : (
            <button 
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => alert(`Ban user ${row.original.id}`)}
            >
              Ban
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <>
      <PageHeader
        title="User Management"
        description="Manage registered users and their trust scores"
        actions={
          <div className="flex space-x-2">
            <select 
              className="px-4 py-2 border rounded-lg"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Users</option>
              <option value="admins">Admins Only</option>
              <option value="banned">Banned Users</option>
              <option value="low_trust">Low Trust Score</option>
            </select>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Export Users
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
            <h2 className="text-xl font-semibold">User List</h2>
            <span className="text-sm text-gray-500">
              Showing {filteredUsers.length} of {users.length} users
            </span>
          </div>
          
          <Table
            columns={columns}
            data={filteredUsers}
          />
        </Card>
      )}
    </>
  );
};

export default Users;