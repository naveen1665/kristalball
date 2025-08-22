import React, { useEffect, useState } from 'react';
import { BackendClient } from '../../../AxiosClient/BackendClient';
import {
  ADD_EQUIPMENT,
  GET_ALL_BASE_DETAILS,
  GET_EQUIPMENT,
  UPDATE_BASE_ASSESTS,
} from '../../../Constants/Constants.ApiEndpoints';
import AddEquipmentModal from './FAdmin.AddEquipmentModel';

function FAdminAddEquipments() {
  const [equipments, setEquipments] = useState([]);
  const [bases, setBases] = useState([]);
  const [selectedBase, setSelectedBase] = useState("All");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [equipmentRes, basesRes] = await Promise.all([
          BackendClient.post(GET_EQUIPMENT, { user_name: "Naveen" }),
          BackendClient.post(GET_ALL_BASE_DETAILS, { user_name: "Naveen" })
        ]);

        if (equipmentRes.status === 200) setEquipments(equipmentRes.data);
        if (basesRes.status === 200) setBases(basesRes.data);
      } catch (err) {
        console.error("Error fetching data:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtered data based on dropdown
  const displayedEquipments = selectedBase === "All"
    ? equipments
    : (bases.find(b => b.base_id === selectedBase)?.base_assets || []);

  return (
    <div className="ml-64 p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            ⚙️ Equipment Hub
          </h1>
          <p className="text-gray-300 text-lg">Distribute assets across operational bases.</p>
        </div>

        {/* Dropdown */}
        <select
          value={selectedBase}
          onChange={(e) => setSelectedBase(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600"
        >
          <option value="All">All Equipment</option>
          {bases.map(base => (
            <option key={base.base_id} value={base.base_id}>
              {base.base_name}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="relative w-12 h-12 animate-spin border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="ml-4 text-gray-400 text-lg">Syncing inventory...</span>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          {/* Inventory Table Card */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden mb-8">
            <div className="px-6 py-5 border-b border-white/20">
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                <span className="w-2 h-6 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></span>
                {selectedBase === "All" ? "Available Equipment" : `Assets of ${bases.find(b => b.base_id === selectedBase)?.base_name}`}
              </h2>
            </div>

            <div className="p-6">
              {displayedEquipments.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No equipment found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-300 border-b border-white/20">
                        <th className="pb-4 font-semibold">ID</th>
                        <th className="pb-4 font-semibold">Quantity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {displayedEquipments.map((item) => (
                        <tr key={item.equipment_id} className="hover:bg-white/10 transition duration-200">
                          <td className="py-3 font-mono text-blue-300">{item.equipment_id}</td>
                          <td className="py-3 text-gray-200">{item.equipment_quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Add Equipment Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
            >
              Add Equipment
            </button>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <AddEquipmentModal
              onClose={() => setIsModalOpen(false)}
              bases={bases}
              equipments={equipments}
              onSave={() => {}}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default FAdminAddEquipments;
