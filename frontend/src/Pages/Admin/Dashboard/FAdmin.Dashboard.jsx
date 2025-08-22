import React, { useEffect, useState } from 'react';
import NavbarAdmin from '../../../Components/Component.NavbarAdmin';
import { BackendClient } from '../../../AxiosClient/BackendClient';
import AdminDetailedBase from './FAdmin.DetailedBase';
import { GET_ALL_BASE_DETAILS } from '../../../Constants/Constants.ApiEndpoints';

function AdminDashboard() {
  const [baseData, setBaseData] = useState([]);
  const [selectedBase, setSelectedBase] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await BackendClient.post(GET_ALL_BASE_DETAILS, { user_name: "Naveen" });
        if (response.status === 200) {
          setBaseData(response.data);
        }
      } catch (err) {
        console.error("Error fetching base data", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">

      {/* Main Content */}
      <main className="ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="text-center mb-10">
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              🛰️ ADMIN DASHBOARD
            </h1>
            <p className="text-gray-300 mt-2 text-lg">Monitor and manage all operational bases.</p>
          </header>

          {!selectedBase ? (
            /* Grid of Base Cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {baseData.map((base) => (
                <div
                  key={base._id}
                  className="group cursor-pointer"
                  onClick={() => setSelectedBase(base)}
                >
                  <div className="backdrop-blur-md bg-white/5 border border-gray-700 rounded-2xl p-6 hover:bg-white/10 hover:border-blue-600 transition-all duration-300 transform hover:scale-105"
                  >
                    {/* Base Name */}
                    <h2 className="text-2xl font-bold text-gray-100 mb-3 group-hover:text-blue-300">
                      {base.base_name}
                    </h2>

                    {/* Location */}
                    <p className="text-gray-400 flex items-center gap-2 mb-4">
                      <span className="text-blue-400">📍</span>
                      {base.base_location}
                    </p>

                    {/* Commander */}
                    <div className="flex items-center justify-between text-sm text-gray-300">
                      <span>
                        <strong className="text-gray-500">Commander:</strong> {base.base_commander || 'N/A'}
                      </span>
                      <code className="text-xs bg-gray-800 px-2 py-1 rounded border border-gray-600">
                        {base.base_id.slice(-6).toUpperCase()}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Detailed View */
            <div className="transform transition-all">
              <AdminDetailedBase selectedBase={selectedBase} setSelectedBase={setSelectedBase} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;