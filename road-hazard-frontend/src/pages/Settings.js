import { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [theme, setTheme] = useState('light');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <>
      <PageHeader
        title="Settings"
        description="Configure application settings and preferences"
        actions={
          <button
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            onClick={handleSaveSettings}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Application Settings</h2>
          
          <div className="space-y-6">
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <span>Enable Notifications</span>
              </label>
              <p className="text-sm text-gray-500 mt-1 ml-6">
                Receive notifications for new reports and system alerts
              </p>
            </div>
            
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={() => setAutoRefresh(!autoRefresh)}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <span>Auto-refresh Data</span>
              </label>
              <p className="text-sm text-gray-500 mt-1 ml-6">
                Automatically refresh dashboard data
              </p>
              
              {autoRefresh && (
                <div className="mt-2 ml-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Refresh Interval (minutes)
                  </label>
                  <input
                    type="number"
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(parseInt(e.target.value) || 1)}
                    min="1"
                    max="60"
                    className="w-20 px-3 py-2 border rounded-md"
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
                <option value="system">Follow System</option>
              </select>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value="admin@example.com"
                disabled
                className="w-full px-3 py-2 border rounded-md bg-gray-100"
              />
              <p className="text-sm text-gray-500 mt-1">
                Contact support to change your email address
              </p>
            </div>
            
            <div>
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                onClick={() => alert('Change password dialog would open here')}
              >
                Change Password
              </button>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-2">Danger Zone</h3>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    alert('Account deletion would happen here');
                  }
                }}
              >
                Delete Account
              </button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Settings;