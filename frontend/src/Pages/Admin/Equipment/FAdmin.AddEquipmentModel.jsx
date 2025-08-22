import React, { useState } from 'react';

function AddEquipmentModal({ onClose, bases, equipments, onSave }) {
  const [selectedBase, setSelectedBase] = useState('');
  const [equipmentList, setEquipmentList] = useState([{ equipment_id: '', equipment_quantity: '' }]);

  const handleAddRow = () => {
    setEquipmentList([...equipmentList, { equipment_id: '', equipment_quantity: '' }]);
  };

  const handleRemoveRow = (index) => {
    if (equipmentList.length === 1) return;
    setEquipmentList(prev => prev.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = [...equipmentList];
    updated[index][field] = value;
    updated.forEach(item => (item.base_id = selectedBase)); // attach base
    setEquipmentList(updated);
  };

  const handleSave = () => {
    if (!selectedBase) {
      alert("⚠️ Select a base.");
      return;
    }

    const isValid = equipmentList.every(
      item => item.equipment_id && Number(item.equipment_quantity) > 0
    );

    if (!isValid) {
      alert("⚠️ Fill all fields correctly.");
      return;
    }

    onSave(equipmentList);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="backdrop-blur-xl bg-gray-900/90 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-700">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <span className="text-blue-400">➕</span>
            Assign Equipment
          </h3>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Base */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Operational Base</label>
            <select
              value={selectedBase}
              onChange={(e) => setSelectedBase(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="">-- Choose Base --</option>
              {bases.map((base) => (
                <option key={base.base_id} value={base.base_id}>
                  {base.base_name} • {base.base_id}
                </option>
              ))}
            </select>
          </div>

          {/* Equipment List */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Equipment</label>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {equipmentList.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <select
                    value={item.equipment_id}
                    onChange={(e) => handleChange(index, 'equipment_id', e.target.value)}
                    className="flex-1 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">-- Select --</option>
                    {equipments.map((equip) => (
                      <option key={equip.equipment_id} value={equip.equipment_id}>
                        {equip.equipment_name} • {equip.equipment_id}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.equipment_quantity}
                    onChange={(e) => handleChange(index, 'equipment_quantity', e.target.value)}
                    className="w-24 p-3 bg-gray-800 border border-gray-600 rounded-lg text-center text-white focus:ring-2 focus:ring-green-500 outline-none"
                  />

                  {equipmentList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(index)}
                      className="w-10 h-10 bg-red-900 hover:bg-red-800 text-red-100 rounded-lg font-bold transition"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddRow}
              className="mt-3 text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
            >
              ➕ Add Another
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white rounded-xl shadow transition"
          >
            Confirm Dispatch
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddEquipmentModal;