import React from 'react';

function AdminDetailedBase({ selectedBase, setSelectedBase }) {
  // Total Equipment Count
  const totalAssets = selectedBase.base_assets?.reduce(
    (sum, a) => sum + Number(a.equipment_quantity),
    0
  ) || 0;

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="px-8 py-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-b border-white/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{selectedBase.base_name}</h1>
            <p className="text-gray-300 mt-1">Operational Command Center</p>
          </div>
          <button
            onClick={() => setSelectedBase(null)}
            className="self-start md:self-auto px-5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-sm border border-white/30 transition"
          >
            ← Back to Network
          </button>
        </div>
      </div>

      {/* Base Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-black/20">
        <InfoCard label="Base ID" value={selectedBase.base_id} mono />
        <InfoCard label="Location" value={selectedBase.base_location} />
        <InfoCard label="Commander" value={selectedBase.base_commander || 'Unassigned'} />
        <InfoCard label="Total Assets" value={`${totalAssets} units`} color="text-green-300" />
      </div>

      {/* Content Sections */}
      <div className="p-6 space-y-8">

        {/* Assets */}
        {selectedBase.base_assets?.length > 0 && (
          <Section title="🛠️ Equipment Assets" color="blue">
            <Table
              headers={['Equipment ID', 'Quantity']}
              data={selectedBase.base_assets}
              render={(asset) => (
                <>
                  <td className="px-4 py-3 font-mono text-blue-300">{asset.equipment_id}</td>
                  <td className="px-4 py-3 text-gray-200">{asset.equipment_quantity}</td>
                </>
              )}
            />
          </Section>
        )}

        {/* Imports */}
        {selectedBase.base_import?.length > 0 && (
          <Section title="📥 Inbound Transfers" color="green">
            {selectedBase.base_import.map((imp) => (
              <TransferCard
                key={imp._id}
                title={`From: ${imp.base_id}`}
                color="green"
                items={imp.equipments}
              />
            ))}
          </Section>
        )}

        {/* Exports */}
        {selectedBase.base_export?.length > 0 && (
          <Section title="📤 Outbound Transfers" color="red">
            {selectedBase.base_export.map((exp) => (
              <TransferCard
                key={exp._id}
                title={`To: ${exp.base_id}`}
                color="red"
                items={exp.equipments}
              />
            ))}
          </Section>
        )}

        {/* Logs */}
        {selectedBase.base_log?.length > 0 && (
          <Section title="📜 Transaction Logs" color="purple">
            {selectedBase.base_log.map((log) => (
              <LogEntry key={log._id} log={log} />
            ))}
          </Section>
        )}

        {/* No Data Fallback */}
        {!selectedBase.base_assets?.length &&
          !selectedBase.base_import?.length &&
          !selectedBase.base_export?.length &&
          !selectedBase.base_log?.length && (
            <div className="text-center py-12 border-t border-gray-700">
              <p className="text-gray-500 text-lg">No data available for this base.</p>
            </div>
          )}
      </div>
    </div>
  );
}

// Reusable Components

function InfoCard({ label, value, mono, color = "text-gray-200" }) {
  return (
    <div className="p-4 bg-black/30 rounded-xl border border-white/10">
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className={`${mono ? 'font-mono' : ''} ${color} mt-1 text-sm truncate`}>
        {value}
      </p>
    </div>
  );
}

function Section({ title, color, children }) {
  const colorClasses = {
    blue: 'text-blue-300 border-blue-500/50',
    green: 'text-green-300 border-green-500/50',
    red: 'text-red-300 border-red-500/50',
    purple: 'text-purple-300 border-purple-500/50',
  };

  return (
    <section>
      <h3 className={`text-xl font-bold mb-4 flex items-center ${colorClasses[color]}`}>
        <span className={`w-1.5 h-5 rounded-r bg-${color}-500/70 mr-3`}></span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function Table({ headers, data, render }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {data.map((item, idx) => (
            <tr key={idx} className="hover:bg-white/5 transition">
              {render(item)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TransferCard({ title, color, items }) {
  const colorClasses = {
    green: 'border-green-500/40 bg-green-900/20 text-green-300',
    red: 'border-red-500/40 bg-red-900/20 text-red-300',
  };

  return (
    <div className={`border rounded-lg p-5 ${colorClasses[color]} space-y-3`}>
      <h4 className="font-bold text-lg">{title}</h4>
      <ul className="space-y-1 text-sm">
        {items.map((eq, i) => (
          <li key={i} className="font-mono">
            {eq.equipment_id} × <strong>{eq.equipment_quantity}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LogEntry({ log }) {
  return (
    <div className="border border-gray-700 rounded-lg p-5 bg-gray-900/50">
      <div className="flex flex-wrap justify-between gap-3 mb-3">
        <span className="font-bold text-purple-300 capitalize">{log.category}</span>
        <code className="text-xs bg-gray-800 px-2 py-1 rounded border border-gray-600">
          {log.transaction_id.slice(-8)}
        </code>
      </div>
      <ul className="space-y-1 text-sm text-gray-300">
        {log.equipments.map((eq, i) => (
          <li key={i}>
            {eq.equipment_id} × <strong>{eq.equipment_quantity}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDetailedBase;