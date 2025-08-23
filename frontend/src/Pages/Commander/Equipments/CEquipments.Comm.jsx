import React from 'react';

function CEquipmentsComm({ base_assets }) {
  // Handle missing or empty data
  if (!base_assets || base_assets.length === 0) {
    return (
      <div className="ml-64 p-6 min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">📦 Equipment Inventory</h2>
          <p className="text-gray-500 text-center py-10 bg-gray-800 rounded-2xl">
            No equipment assigned to this base.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-64 p-6 min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          📦 Equipment Inventory
        </h2>
        <p className="text-gray-400 mb-8">View all assets currently assigned to this base.</p>

        {/* Equipment Table */}
        <div className="backdrop-blur-sm bg-white/5 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300 uppercase tracking-wider">
                    Equipment ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300 uppercase tracking-wider">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {base_assets.map((asset, index) => (
                  <tr
                    key={asset._id || `${asset.equipment_id}-${index}`}
                    className="hover:bg-white/5 transition duration-200"
                  >
                    {/* Equipment ID */}
                    <td className="px-6 py-4 text-sm font-mono text-blue-300">
                      {asset.equipment_id}
                    </td>
                    {/* Quantity */}
                    <td className="px-6 py-4 text-sm text-gray-200 font-semibold">
                      {Intl.NumberFormat().format(asset.equipment_quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 text-sm text-gray-400">
          <p>
            Total Asset Types: <strong className="text-white">{base_assets.length}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CEquipmentsComm;