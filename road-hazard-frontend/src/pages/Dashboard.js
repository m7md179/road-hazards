import PageHeader from '../components/layout/PageHeader';

const Dashboard = () => {
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

      {/* Page content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Stats cards */}
      </div>
    </>
  );
};

export default Dashboard;