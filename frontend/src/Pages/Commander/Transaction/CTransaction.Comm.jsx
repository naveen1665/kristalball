import React from 'react';

function CTransactionComm({ base_log }) {
  if (!base_log || base_log.length === 0) {
    return (
      <div className="ml-64 p-6 min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            📜 Transaction Logs
          </h2>
          <p className="text-gray-400 text-center py-10 bg-gray-800/50 rounded-2xl border border-gray-700">
            No transaction logs available for this base.
          </p>
        </div>
      </div>
    );
  }

  // Segregate logs
  const imports = base_log.filter(log => log.category?.toLowerCase() === 'import');
  const exports = base_log.filter(log => log.category?.toLowerCase() === 'export');
  const others = base_log.filter(log => !['import', 'export'].includes(log.category?.toLowerCase()));

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="ml-64 p-6 min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          📜 Transaction Logs
        </h2>
        <p className="text-gray-300 mb-8">Review all import, export, and system operations.</p>

        {/* Import Logs */}
        {imports.length > 0 && (
          <LogSection title="📥 Import Logs" color="blue" logs={imports} formatDate={formatDate} />
        )}

        {/* Export Logs */}
        {exports.length > 0 && (
          <LogSection title="📤 Export Logs" color="green" logs={exports} formatDate={formatDate} />
        )}

        {/* Other Logs */}
        {others.length > 0 && (
          <LogSection title="⚙️ Other Operations" color="purple" logs={others} formatDate={formatDate} />
        )}
      </div>
    </div>
  );
}

// Reusable Section Component
function LogSection({ title, color, logs, formatDate }) {
  const colorClasses = {
    blue: {
      badge: 'bg-blue-900/60 text-blue-200 border border-blue-700/50',
      title: 'text-blue-300',
      gradient: 'from-blue-500 to-blue-700',
    },
    green: {
      badge: 'bg-green-900/60 text-green-200 border border-green-700/50',
      title: 'text-green-300',
      gradient: 'from-green-500 to-green-700',
    },
    purple: {
      badge: 'bg-purple-900/60 text-purple-200 border border-purple-700/50',
      title: 'text-purple-300',
      gradient: 'from-purple-500 to-purple-700',
    }
  };

  return (
    <section className="mb-8 last:mb-0">
      <h3 className={`text-2xl font-bold ${colorClasses[color].title} mb-5 flex items-center gap-2`}>
        <span
          className={`w-2 h-6 rounded-r bg-gradient-to-b ${colorClasses[color].gradient}`}
          aria-hidden="true"
        ></span>
        {title}
      </h3>

      <div className="space-y-4">
        {logs.map((log) => (
          <div
            key={log._id || log.transaction_id}
            className="backdrop-blur-sm bg-white/5 border border-gray-700 rounded-2xl shadow-lg overflow-hidden hover:border-gray-600 transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1 space-y-3">
                  {/* Category & Transaction ID */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${colorClasses[color].badge}`}>
                      {log.category || 'Unknown'}
                    </span>
                    <code className="text-sm bg-gray-800 px-3 py-1.5 rounded border border-gray-600 font-mono text-gray-100 shadow-sm">
                      {log.transaction_id || 'N/A'}
                    </code>
                  </div>

                  {/* Equipment List */}
                  {log.equipments && log.equipments.length > 0 && (
                    <div>
                      <span className="text-gray-300 text-sm font-medium">Items:</span>
                      <div className="ml-2 mt-1 space-y-1">
                        {log.equipments.map((eq, i) => (
                          <div key={i} className="font-mono text-sm text-blue-100 bg-gray-800/60 px-2.5 py-1 rounded border border-gray-700 inline-block">
                            {eq.equipment_id} ×{' '}
                            <strong className="text-white">{Intl.NumberFormat().format(eq.equipment_quantity)}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div className="text-right text-sm text-gray-400 whitespace-nowrap self-start">
                  {formatDate(log.createdAt)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CTransactionComm;