import React, { useState, useEffect } from 'react';
import { BackendClient } from '../../../AxiosClient/BackendClient';
import { EXPORT_BASE, IMPORT_BASE, GET_ALL_BASE_DETAILS } from '../../../Constants/Constants.ApiEndpoints';

function CImportExportComm({ base_id }) {
  const [bases, setBases] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(''); // "import" or "export"
  const [formData, setFormData] = useState({
    current_base_id: base_id,
    target_base_id: '',
    user_name: 'Naveen',
    items: [{ equipment_id: '', equipment_quantity: 0 }]
  });
  const [warning, setWarning] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch all bases (exclude current base)
  useEffect(() => {
    const fetchBases = async () => {
      try {
        const res = await BackendClient.post(GET_ALL_BASE_DETAILS, { user_name: 'Naveen' });
        setBases(res.data.filter(b => b.base_id !== base_id));
      } catch (err) {
        console.error('Error fetching bases:', err);
      }
    };
    fetchBases();
  }, [base_id]);

  // Fetch available items for current base
  useEffect(() => {
    const fetchBaseAssets = async () => {
      try {
        const res = await BackendClient.post(GET_ALL_BASE_DETAILS, { user_name: 'Naveen' });
        const currentBase = res.data.find(b => b.base_id === base_id);
        setAvailableItems(currentBase?.base_assets || []);
      } catch (err) {
        console.error('Error fetching assets:', err);
      }
    };
    fetchBaseAssets();
  }, [base_id]);

  // Handle form input
  const handleChange = (e, index) => {
    const { name, value } = e.target;

    if (name === 'equipment_id' || name === 'equipment_quantity') {
      const newItems = [...formData.items];
      newItems[index][name] = value;

      if (name === 'equipment_quantity' && actionType === 'export') {
        const eq = availableItems.find(eq => eq.equipment_id === newItems[index].equipment_id);
        if (eq && Number(value) > eq.equipment_quantity) {
          setWarning(`⚠️ Quantity exceeds available stock for ${eq.equipment_id}`);
        } else {
          setWarning('');
        }
      }

      setFormData({ ...formData, items: newItems });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Add/remove equipment
  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { equipment_id: '', equipment_quantity: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) return;
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      current_base_id: base_id,
      target_base_id: '',
      user_name: 'Naveen',
      items: [{ equipment_id: '', equipment_quantity: 0 }]
    });
    setWarning('');
  };

  // Show success modal
  const showSuccessModal = (msg) => {
    setSuccessMessage(msg);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!formData.target_base_id) {
      alert('❌ Please select a target base.');
      return;
    }

    const payload = {
      current_base_id: base_id,
      [actionType === 'export' ? 'export_base_id' : 'import_base_id']: formData.target_base_id,
      user_name: formData.user_name,
      items: formData.items.filter(item => item.equipment_id && item.equipment_quantity > 0)
    };

    try {
      const url = actionType === 'export' ? EXPORT_BASE : IMPORT_BASE;
      const res = await BackendClient.post(url, payload);
      showSuccessModal(res.data.message || `${actionType} successful!`);
      setShowModal(false);
      resetForm();
    } catch (err) {
      alert(`❌ ${err.response?.data?.message || `Failed to ${actionType} assets.`}`);
    }
  };

  return (
    <div className="ml-64 p-6 min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-green-500 bg-clip-text text-transparent">
          🔄 Import / Export Assets
        </h1>
        <p className="text-gray-300 mt-2">Manage equipment transfers from this base.</p>
      </div>

      {/* Action Buttons */}
      {!showModal && (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <button
            onClick={() => { setActionType('import'); setShowModal(true); }}
            className="group p-8 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-700/50 rounded-2xl text-white text-center transition-all"
          >
            📥 Import Assets
          </button>
          <button
            onClick={() => { setActionType('export'); setShowModal(true); }}
            className="group p-8 bg-green-900/30 hover:bg-green-900/50 border border-green-700/50 rounded-2xl text-white text-center transition-all"
          >
            📤 Export Assets
          </button>
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <TransferModal
          actionType={actionType}
          formData={formData}
          bases={bases}
          availableItems={availableItems}
          warning={warning}
          handleChange={handleChange}
          addItem={addItem}
          removeItem={removeItem}
          handleSubmit={handleSubmit}
          closeModal={() => { setShowModal(false); resetForm(); }}
        />
      )}

      {/* ✅ SuccessModal is now DEFINED and used */}
      {showSuccess && <SuccessModal message={successMessage} />}
    </div>
  );
}

// ✅ 1. Define SuccessModal
function SuccessModal({ message }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      <div className="backdrop-blur-lg bg-gray-900 border border-green-700/50 rounded-2xl p-8 text-center max-w-xs w-full mx-4 shadow-2xl">
        <div className="w-16 h-16 mx-auto mb-4">
          <svg
            className="w-full h-full text-green-400"
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="2" className="opacity-30" />
            <path
              d="M16 25L22 31L34 19"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="draw-check"
            />
          </svg>
        </div>
        <p className="text-gray-100 text-sm">{message}</p>
      </div>
      <style jsx>{`
        .draw-check {
          stroke-dasharray: 36;
          stroke-dashoffset: 36;
          animation: drawCheck 0.6s ease-out forwards;
        }
        @keyframes drawCheck {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}

// ✅ 2. Define TransferModal
function TransferModal({
  actionType,
  formData,
  bases,
  availableItems,
  warning,
  handleChange,
  addItem,
  removeItem,
  handleSubmit,
  closeModal,
}) {
  const currentBase = bases.find(b => b.base_id === formData.current_base_id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-70"
        onClick={closeModal}
      ></div>

      <div className="relative backdrop-blur-xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg text-white">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 w-8 h-8 bg-red-900 hover:bg-red-800 rounded-full flex items-center justify-center text-lg z-10"
        >
          ×
        </button>

        <div
          className={`px-6 py-5 border-b ${
            actionType === 'import'
              ? 'bg-blue-900/40 border-blue-700/50'
              : 'bg-green-900/40 border-green-700/50'
          }`}
        >
          <h2 className="text-2xl font-bold flex items-center gap-3">
            {actionType === 'import' ? '📥 Import' : '📤 Export'} Assets
          </h2>
        </div>

        <div className="p-6 space-y-5">
          {/* Current Base (Locked) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {actionType === 'import' ? 'Source Base' : 'Origin Base'}
            </label>
            <div className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white font-mono text-sm">
              {currentBase ? `${currentBase.base_name} (${currentBase.base_id})` : formData.current_base_id}
            </div>
            <input type="hidden" name="current_base_id" value={formData.current_base_id} />
          </div>

          {/* Target Base */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {actionType === 'import' ? 'Target Base' : 'Destination Base'}
            </label>
            <select
              name="target_base_id"
              value={formData.target_base_id}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Select Base</option>
              {bases.map(b => (
                <option key={b.base_id} value={b.base_id}>
                  {b.base_name} ({b.base_id})
                </option>
              ))}
            </select>
          </div>

          {/* Equipment List */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Equipment to Transfer</label>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <select
                    name="equipment_id"
                    value={item.equipment_id}
                    onChange={e => handleChange(e, index)}
                    className="flex-1 p-2.5 bg-gray-800 border border-gray-600 rounded text-white"
                  >
                    <option value="">Select Equipment</option>
                    {availableItems.map(eq => (
                      <option key={eq.equipment_id} value={eq.equipment_id}>
                        {eq.equipment_id} (Stock: {eq.equipment_quantity})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="equipment_quantity"
                    value={item.equipment_quantity}
                    onChange={e => handleChange(e, index)}
                    min="1"
                    className="w-24 p-2.5 bg-gray-800 border border-gray-600 rounded text-white text-center"
                    placeholder="Qty"
                  />
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="w-10 h-10 bg-red-900 hover:bg-red-800 text-red-100 rounded font-bold transition"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {warning && (
              <p className="text-yellow-400 text-sm mt-2 flex items-center gap-1">
                <span>⚠️</span>
                {warning}
              </p>
            )}

            <button
              type="button"
              onClick={addItem}
              className="mt-3 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
            >
              ➕ Add Another Item
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
          <button
            onClick={closeModal}
            className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-5 py-2.5 rounded-lg font-medium transition transform hover:scale-105 ${
              actionType === 'import'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            Confirm {actionType === 'import' ? 'Import' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CImportExportComm;