import React, { useEffect, useState } from 'react';
import { BackendClient } from '../../../AxiosClient/BackendClient';
import { GET_ALL_TRANSACTIONS } from '../../../Constants/Constants.ApiEndpoints';

function FAdminTransaction() {
  const [logData, setLogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(logData.length / itemsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await BackendClient.post(GET_ALL_TRANSACTIONS);
        if (response.status === 200) {
          setLogData(response.data);
        }
      } catch (err) {
        console.error("Error fetching transactions:", err.message);
        setError("Failed to load transaction data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get current page data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = logData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle pagination
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handlePageClick = (page) => setCurrentPage(page);

  // Generate page numbers for display (show max 5 page buttons)
  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    if (start > 1) pages.push(1, '...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) pages.push('...', totalPages);

    return pages;
  };

  if (loading) {
    return (
      <div className="ml-64 p-6 min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="text-gray-400 mt-3">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-64 p-6">
        <div className="text-red-500 p-4 bg-red-900/20 border border-red-800 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="ml-64 p-6 min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          📜 Transaction Log
        </h1>
        <p className="text-gray-300 mt-1">View and navigate through all equipment transfers.</p>
      </div>

      {/* Table */}
      {logData.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No transactions found.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-sm bg-white/5 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300 uppercase tracking-wider">Tx ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300 uppercase tracking-wider">Equipment</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-300 uppercase tracking-wider">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {currentItems.map((log, index) => (
                    <tr key={log._id || index} className="hover:bg-white/5 transition duration-200">
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize
                          ${log.category === 'import' ? 'bg-green-900/40 text-green-300' :
                            log.category === 'export' ? 'bg-red-900/40 text-red-300' :
                              'bg-blue-900/40 text-blue-300'}`}
                        >
                          {log.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-200">
                        {log.transaction_id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm space-y-1">
                        {log.equipments?.map((eq, i) => (
                          <div key={i} className="font-mono text-blue-300">
                            {eq.equipment_id} × <strong>{eq.equipment_quantity}</strong>
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 bg-black/20 border-t border-gray-700">
              <div className="text-sm text-gray-400">
                Page <strong>{currentPage}</strong> of <strong>{totalPages || 1}</strong>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${currentPage === 1
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-300 hover:bg-gray-700'
                    }`}
                >
                  ❮
                </button>

                {getPageNumbers().map((page, i) =>
                  page === '...' ? (
                    <span key={i} className="px-2 text-gray-500">...</span>
                  ) : (
                    <button
                      key={i}
                      onClick={() => handlePageClick(page)}
                      className={`w-8 h-8 rounded ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${currentPage === totalPages
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-300 hover:bg-gray-700'
                    }`}
                >
                  ❯
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FAdminTransaction;