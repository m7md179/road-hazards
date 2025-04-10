const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy middleware for real backend
  const apiProxy = createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/api',
    },
    onError: (err, req, res) => {
      console.log('Proxy error:', err);
      console.log('Falling back to mock data...');
      
      // Return mock data based on the endpoint
      let mockData = {};
      
      if (req.path.includes('/dashboard/stats')) {
        mockData = {
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
      } else if (req.path.includes('/reports')) {
        mockData = {
          reports: [
            { id: 1, type: 'Pothole', status: 'pending', reported_at: new Date().toISOString() },
            { id: 2, type: 'Roadwork', status: 'approved', reported_at: new Date().toISOString() }
          ]
        };
      } else if (req.path.includes('/users')) {
        mockData = {
          users: [
            { id: 1, name: 'John Doe', email: 'john@example.com', trusted_score: 85, is_admin: true, is_banned: false },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', trusted_score: 92, is_admin: false, is_banned: false },
          ]
        };
      } else if (req.path.includes('/hazards')) {
        mockData = [
          { id: 1, hazard_type: 'Pothole', latitude: 51.505, longitude: -0.09, description: 'Large pothole', severity: 'high' },
          { id: 2, hazard_type: 'Roadwork', latitude: 51.51, longitude: -0.1, description: 'Road construction', severity: 'medium' }
        ];
      }
      
      res.writeHead(200, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify(mockData));
    }
  });
  
  app.use('/api', apiProxy);
};