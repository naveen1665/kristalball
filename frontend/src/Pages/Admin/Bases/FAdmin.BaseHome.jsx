import { useEffect, useState } from 'react';
import DetailedBase from '../../../Components/Component.DetailedBase';
import { BackendClient } from '../../../AxiosClient/BackendClient';
import { GET_ALL_BASE_DETAILS } from '../../../Constants/Constants.ApiEndpoints';
import FAdminAddBaseModal from './FAdmin.AddBaseModal';

function FAdminBaseHome() {
  const [baseData, setBaseData] = useState([]);
  const [selectedBase, setSelectedBase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await BackendClient.post(GET_ALL_BASE_DETAILS, { user_name: "Naveen" });
      if (response.status === 200) setBaseData(response.data);
    } catch (err) {
      console.error("Error fetching base data", err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white ml-64 p-6">
      <header className="max-w-7xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          🛰️ Base Network
        </h1>
        <p className="text-gray-300 mt-2 text-lg">Select a base to access its command hub.</p>
      </header>

      {!selectedBase ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Add New Base Card */}
          <div onClick={() => setIsModalOpen(true)} className="group cursor-pointer">
            <div className="h-full backdrop-blur-sm bg-white/5 border border-dashed border-gray-600 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-white/10 transition-all duration-300 aspect-square">
              <div className="w-14 h-14 mb-4 bg-gray-800 group-hover:bg-blue-900 rounded-full flex items-center justify-center transition">
                <span className="text-2xl font-light text-gray-300 group-hover:text-blue-200">+</span>
              </div>
              <span className="text-gray-300 font-medium text-sm">Register New Base</span>
            </div>
          </div>

          {/* Existing Base Cards */}
          {baseData.map((base) => (
            <div
              key={base._id}
              className="backdrop-blur-md bg-white/5 border border-gray-700 rounded-2xl p-5 cursor-pointer hover:bg-white/10 hover:border-blue-600 transition-all duration-300 transform hover:scale-105 aspect-square flex flex-col text-center group"
              onClick={() => setSelectedBase(base)}
            >
              <h2 className="text-xl font-semibold text-gray-100 mb-3 group-hover:text-blue-300 transition-colors line-clamp-2">
                {base.base_name}
              </h2>
              <div className="flex items-center justify-center text-sm text-gray-400 mb-4">
                <span className="text-blue-400 mr-1">📍</span>
                <span className="truncate max-w-[90%]">{base.base_location}</span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-xs text-gray-300">
                  <span className="text-gray-500 block">Commander</span>
                  <span className="font-semibold text-gray-100 mt-1 block truncate max-w-[80%] mx-auto">
                    {base.base_commander || "N/A"}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-wider">
                ID: {base.base_id.slice(-6)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          <DetailedBase
            base_id={selectedBase.base_id}
            user_name="Naveen"
            setSelectedBase={setSelectedBase}
          />
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <FAdminAddBaseModal
          onClose={() => setIsModalOpen(false)}
          onBaseAdded={fetchData}
          userName="Naveen"
        />
      )}
    </div>
  );
}

export default FAdminBaseHome;
