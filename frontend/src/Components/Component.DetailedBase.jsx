import React, { useEffect, useState } from 'react';
import { BackendClient } from '../AxiosClient/BackendClient';
import {
  DELETE_SINGLE_BASE,
  GET_SINGLE_BASE,
  UPDATE_BASE_ASSESTS,
} from '../Constants/Constants.ApiEndpoints';

function DetailedBase({ user_name, base_id, setSelectedBase }) {
  const [localSelectedBase, setLocalSelectedBase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    base_name: '',
    base_location: '',
    base_commander: '',
  });

  // Fetch base details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await BackendClient.post(GET_SINGLE_BASE, { user_name, base_id });
        if (response.status === 200 && response.data.length > 0) {
          setLocalSelectedBase(response.data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch base:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user_name, base_id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full"></div>
        <span className="ml-3 text-gray-500">Loading base...</span>
      </div>
    );
  }

  if (!localSelectedBase) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">❌ Base not found.</p>
      </div>
    );
  }

  // Total Equipment Count
  const totalEquipment = localSelectedBase.base_assets?.reduce(
    (sum, asset) => sum + Number(asset.equipment_quantity),
    0
  ) || 0;

  // Open Edit Modal
  const openEditModal = () => {
    setFormData({
      base_name: localSelectedBase.base_name,
      base_location: localSelectedBase.base_location,
      base_commander: localSelectedBase.base_commander,
    });
    setIsEditModalOpen(true);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save edited base
  const handleSave = async () => {
    try {
      const response = await BackendClient.post(UPDATE_BASE_ASSESTS, {
        user_name,
        base_id,
        updatedData: formData,
      });

      if (response.status === 200) {
        setLocalSelectedBase({ ...localSelectedBase, ...formData });
        setIsEditModalOpen(false);
        alert("✅ Base updated successfully.");
      }
    } catch (err) {
      alert("❌ Failed to update base.");
      console.error("Update error:", err);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Base ID', 'Name', 'Location', 'Commander', 'Equip ID', 'Quantity'];
    const assets = localSelectedBase.base_assets || [];

    const rows = [
      headers,
      ...assets.map((asset) => [
        localSelectedBase.base_id,
        localSelectedBase.base_name,
        localSelectedBase.base_location,
        localSelectedBase.base_commander,
        asset.equipment_id,
        asset.equipment_quantity,
      ]),
    ];

    if (assets.length === 0) {
      rows.push([localSelectedBase.base_id, localSelectedBase.base_name, localSelectedBase.base_location, localSelectedBase.base_commander, 'No equipment', '0']);
    }

    const csv = rows.map(r => r.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `base_${localSelectedBase.base_id.slice(-6)}_data.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  // Delete Base
  const deleteBase = () => {
    if (window.confirm("⚠️ Delete base? This cannot be undone.")) {
      BackendClient.post(DELETE_SINGLE_BASE, { base_id, user_name })
        .then(() => {
          alert("🗑️ Base deleted.");
          setSelectedBase(null);
        })
        .catch(() => alert("❌ Delete failed."));
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="px-8 py-6 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-b border-white/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{localSelectedBase.base_name}</h1>
            <p className="text-blue-200 mt-1">Operational Command Base</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedBase(null)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm border border-white/30 transition"
            >
              ← Back
            </button>
            <button
              onClick={openEditModal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              ✏️ Edit
            </button>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              📥 CSV
            </button>
            <button
              onClick={deleteBase}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-black/20">
        <StatCard label="ID" value={localSelectedBase.base_id} mono />
        <StatCard label="Location" value={localSelectedBase.base_location} />
        <StatCard label="Commander" value={localSelectedBase.base_commander || 'Unassigned'} />
        <StatCard label="Total Assets" value={`${totalEquipment} units`} color="text-green-300" />
      </div>

      {/* Equipment Table */}
      <div className="p-6">
        <Section title="🛠️ Equipment Assets" count={localSelectedBase.base_assets?.length || 0}>
          {localSelectedBase.base_assets?.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                    <th className="px-4 py-3">Equipment ID</th>
                    <th className="px-4 py-3">Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {localSelectedBase.base_assets.map((asset) => (
                    <tr key={asset._id} className="hover:bg-white/5 transition">
                      <td className="px-4 py-3 font-mono text-blue-300">{asset.equipment_id}</td>
                      <td className="px-4 py-3 text-gray-200 font-semibold">{asset.equipment_quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">No equipment assigned.</p>
          )}
        </Section>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <h3 className="text-xl font-bold mb-5 text-white">Edit Base Info</h3>

          <div className="space-y-4">
            {['base_name', 'base_location', 'base_commander'].map((field) => (
              <div key={field}>
                <label className="block text-sm text-gray-300 mb-1 capitalize">
                  {field.replace(/_/g, ' ')}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Save Changes
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Reusable Components

function StatCard({ label, value, mono, color = "text-gray-200" }) {
  return (
    <div className="p-4 bg-black/30 rounded-xl border border-white/10 text-center">
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className={`${mono ? 'font-mono' : ''} ${color} mt-1 text-sm truncate`}>
        {value}
      </p>
    </div>
  );
}

function Section({ title, count, children }) {
  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
          {title}
        </h3>
        <span className="text-sm text-gray-400 bg-gray-800 px-2.5 py-1 rounded-full">
          {count}
        </span>
      </div>
      {children}
    </section>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div
        className="backdrop-blur-xl bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default DetailedBase;