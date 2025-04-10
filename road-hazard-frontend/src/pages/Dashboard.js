import { useState, useEffect } from 'react';
import PageHeader from '../components/layout/PageHeader';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell
} from 'recharts';
import Card from '../components/ui/Card';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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
    userTrustDistribution: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // First set mock data immediately to show something
        const mockData = {
          totalReports: 156,
          totalHazards: 83,
          totalUsers: 327,
          pendingReports: 12,
          reportsByStatus: [
            { name: 'Pending', value: 12 },
            { name: 'Approved', value: 87 },
            { name: 'Rejected', value: 32 },
            { name: 'Converted', value: 25 }
          ],
          hazardsByType: [
            { name: 'Pothole', value: 28 },
            { name: 'Roadwork', value: 22 },
            { name: 'Accident', value: 13 },
            { name: 'Flooding', value: 9 },
            { name: 'Other', value: 11 }
          ],
          reportsOverTime: [
            { name: 'Jan', reports: 12, hazards: 8 },
            { name: 'Feb', reports: 19, hazards: 11 },
            { name: 'Mar', reports: 22, hazards: 15 },
            { name: 'Apr', reports: 25, hazards: 14 },
            { name: 'May', reports: 18, hazards: 9 },
            { name: 'Jun', reports: 29, hazards: 17 },
            { name: 'Jul', reports: 31, hazards: 19 }
          ],
          userTrustDistribution: [
            { name: 'Low (0-30)', value: 45 },
            { name: 'Medium (31-70)', value: 187 },
            { name: 'High (71-100)', value: 95 }
          ]
        };
        
        setStats(mockData);
        setLoading(false);
        
        // Try to fetch real data in the background
        try {
          console.log('Fetching dashboard stats from backend...');
          const response = await fetch('/api/dashboard/stats');
          console.log('Backend response status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('Dashboard stats data:', data);
            
            if (data && Object.keys(data).length > 0) {
              console.log('Setting dashboard stats from backend data');
              setStats(data);
            } else {
              console.log('Backend returned empty data, keeping mock data');
            }
          } else {
            console.log('Backend response not OK:', await response.text());
          }
        } catch (error) {
          console.error('Error fetching dashboard stats:', error);
          console.log('Using mock data because API fetch failed');
        }
      } catch (error) {
        console.error('Error setting up dashboard stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard 
              title="Total Reports" 
              value={stats.totalReports} 
              icon="📊"
              className="bg-blue-50"
            />
            <StatCard 
              title="Verified Hazards" 
              value={stats.totalHazards} 
              icon="⚠️"
              className="bg-orange-50"
            />
            <StatCard 
              title="Registered Users" 
              value={stats.totalUsers} 
              icon="👤"
              className="bg-green-50"
            />
            <StatCard 
              title="Pending Reports" 
              value={stats.pendingReports} 
              icon="⏳"
              className="bg-purple-50"
            />
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Reports by Status</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.reportsByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {stats.reportsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Hazards by Type</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.hazardsByType}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Reports & Hazards Over Time</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={stats.reportsOverTime}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="reports" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="hazards" 
                      stroke="#82ca9d" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">User Trust Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.userTrustDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {stats.userTrustDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </>
      )}
    </>
  );
};

const StatCard = ({ title, value, icon, className }) => {
  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center">
        <div className="text-3xl mr-4">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export default Dashboard;