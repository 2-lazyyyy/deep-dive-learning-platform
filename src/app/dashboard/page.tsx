export default function DashboardOverview() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 font-medium">Online Students</h3>
          <p className="text-4xl font-bold text-green-500 mt-2">24</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 font-medium">Total Submissions</h3>
          <p className="text-4xl font-bold text-blue-500 mt-2">1,204</p>
        </div>
      </div>
    </div>
  );
}
