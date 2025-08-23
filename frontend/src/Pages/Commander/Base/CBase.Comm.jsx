import React from 'react';

function CBaseComm({ baseDetails, loading }) {
  if (loading)
    return (
      <div className="ml-64 p-6 min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="text-gray-400 mt-3">Loading Base Details...</p>
        </div>
      </div>
    );

  if (!baseDetails)
    return (
      <div className="ml-64 p-6">
        <div className="text-red-400 bg-red-900/20 border border-red-800 p-4 rounded-lg max-w-md mx-auto text-center">
          No base data available.
        </div>
      </div>
    );

  const { base_name, base_id, base_location, base_commander, base_log } = baseDetails;

  return (
    <div className="ml-64 p-6 min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
      {/* Base Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="backdrop-blur-sm bg-white/5 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold text-white">{base_name}</h1>
            <div className="mt-3 space-y-2 text-gray-300">
              <p>
                <strong className="text-gray-400">Base ID:</strong>{' '}
                <code className="font-mono bg-gray-800 px-2 py-1 rounded text-sm border border-gray-600">
                  {base_id}
                </code>
              </p>
              <p>
                <strong className="text-gray-400">Location:</strong> {base_location}
              </p>
              <p>
                <strong className="text-gray-400">Commander:</strong>{' '}
                <span className="text-green-400 font-medium">{base_commander || 'N/A'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Asset Types */}
          <div className="backdrop-blur-sm bg-white/5 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-blue-300">Total Asset Types</h3>
              <p className="text-3xl font-bold text-white mt-2">{baseDetails?.base_assets?.length || 0}</p>
            </div>
          </div>

          {/* Today's Usage */}
          <div className="backdrop-blur-sm bg-white/5 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-green-300">Today's Usage</h3>
              <p className="text-3xl font-bold text-white mt-2">50</p>
            </div>
          </div>

          {/* Today's Sales */}
          <div className="backdrop-blur-sm bg-white/5 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-yellow-300">Today's Sales</h3>
              <p className="text-3xl font-bold text-white mt-2">$1478</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2">
          📜 Recent Transactions
        </h2>

        {base_log && base_log.length > 0 ? (
          <div className="space-y-4">
            {base_log.slice(-3).reverse().map((log, idx) => (
              <div
                key={idx}
                className="backdrop-blur-sm bg-white/5 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                    <div>
                      <p className="font-bold text-blue-200 text-lg capitalize">{log.category}</p>
                      <p className="text-gray-400 text-sm mt-1">
                        <strong>Tx ID:</strong> {log.transaction_id}
                      </p>
                      <div className="text-gray-300 text-sm mt-2 space-y-1">
                        <strong>Equipments:</strong>
                        <div className="ml-2 mt-1 space-y-1">
                          {log.equipments.map((eq, i) => (
                            <div key={i} className="font-mono text-blue-200 text-sm">
                              {eq.equipment_id} × <strong>{eq.equipment_quantity}</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs text-right whitespace-nowrap self-start">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No recent transactions.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CBaseComm;