import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { BackendClient } from "../../../AxiosClient/BackendClient";
import { BASE_ADD_NEW_BASE, GET_EQUIPMENT } from "../../../Constants/Constants.ApiEndpoints";

function FAdminAddBaseModal({ onClose, onBaseAdded, userName }) {
  const [baseDetails, setBaseDetails] = useState({
    base_id: "",
    base_name: "",
    base_location: "",
    base_commander: "",
    base_assets: [{ equipment_id: "", equipment_quantity: "" }]
  });

  const [equipment, setEquipment] = useState([]);
  const [eqLoading, setEqLoading] = useState(false);
  const [eqError, setEqError] = useState("");

  // fetch equipment list once
  useEffect(() => {
    let ignore = false;
    const loadEquipment = async () => {
      try {
        setEqLoading(true);
        setEqError("");
        const res = await BackendClient.post(GET_EQUIPMENT, { user_name: userName });
        if (!ignore) setEquipment(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        if (!ignore) setEqError("Failed to fetch equipment list.");
        console.error(e);
      } finally {
        if (!ignore) setEqLoading(false);
      }
    };
    loadEquipment();
    return () => { ignore = true; };
  }, [userName]);

  // close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBaseDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssetChange = (index, field, value) => {
    setBaseDetails((prev) => {
      const nextAssets = [...prev.base_assets];
      nextAssets[index] = { ...nextAssets[index], [field]: value };
      return { ...prev, base_assets: nextAssets };
    });
  };

  const addAssetRow = () => {
    setBaseDetails((prev) => ({
      ...prev,
      base_assets: [...prev.base_assets, { equipment_id: "", equipment_quantity: "" }]
    }));
  };

  const removeAssetRow = (index) => {
    setBaseDetails((prev) => ({
      ...prev,
      base_assets: prev.base_assets.filter((_, i) => i !== index)
    }));
  };

  // Build options label safely: prefer equipment_id + name if exists
  const equipmentOptions = useMemo(
    () =>
      equipment.map((eq) => ({
        value: eq.equipment_id || eq._id,
        label:
          (eq.equipment_id || eq._id) +
          (eq.equipment_name ? ` — ${eq.equipment_name}` : "")
      })),
    [equipment]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // prune empty asset rows & coerce quantity to Number
    const cleanAssets = (baseDetails.base_assets || [])
      .map((a) => ({
        equipment_id: (a.equipment_id || "").trim(),
        equipment_quantity: Number(a.equipment_quantity)
      }))
      .filter((a) => a.equipment_id && a.equipment_quantity > 0);

    // IMPORTANT: avoid sending an empty stub row that causes Mongoose "required" error
    const payload = {
      user_name: userName, // passed in by parent (no input field for it)
      base_id: baseDetails.base_id.trim(),
      base_name: baseDetails.base_name.trim(),
      base_location: baseDetails.base_location.trim(),
      base_commander: baseDetails.base_commander.trim(),
      base_assets: cleanAssets.length ? cleanAssets : [] // send [] if none valid
    };

    if (!payload.base_id || !payload.base_name || !payload.base_location || !payload.base_commander) {
      alert("Please fill Base ID, Name, Location, and Commander.");
      return;
    }

    try {
      const res = await BackendClient.post(BASE_ADD_NEW_BASE, payload);
      if (res.status === 201) {
        onBaseAdded?.();
        onClose();
        return;
      }
      alert("Unexpected response while adding base.");
    } catch (err) {
      console.error("Error adding base:", err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Failed to add base");
    }
  };

  // Render via portal so it sits above everything
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg mx-4 rounded-2xl border border-gray-700 bg-gray-900 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-red-900 hover:bg-red-800 flex items-center justify-center text-xl"
          aria-label="Close"
        >
          ×
        </button>

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-700">
          <h2 className="text-2xl font-bold">🛠️ Register New Base</h2>
          <p className="text-gray-400 text-sm mt-1">Enter base details and initial assets.</p>
        </div>

        {/* Body */}
        <form className="p-6 space-y-5" onSubmit={handleSubmit}>
          {[
            { name: "base_id", label: "Base ID", placeholder: "e.g., B002" },
            { name: "base_name", label: "Base Name", placeholder: "e.g., Base Bravo" },
            { name: "base_location", label: "Location", placeholder: "e.g., Bangalore" },
            { name: "base_commander", label: "Commander", placeholder: "e.g., CommanderB" }
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-300 mb-1">{f.label}</label>
              <input
                type="text"
                name={f.name}
                value={baseDetails[f.name]}
                onChange={handleInputChange}
                placeholder={f.placeholder}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          ))}

          {/* Assets */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Initial Equipment Assets</label>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {baseDetails.base_assets.map((asset, index) => (
                <div key={index} className="flex gap-2 items-center">
                  {/* Equipment dropdown */}
                  <select
                    className="flex-1 p-2.5 bg-gray-800 border border-gray-600 rounded text-white"
                    value={asset.equipment_id}
                    onChange={(e) => handleAssetChange(index, "equipment_id", e.target.value)}
                  >
                    <option value="">{eqLoading ? "Loading..." : "Select equipment"}</option>
                    {equipmentOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  {/* Quantity */}
                  <input
                    type="number"
                    min="0"
                    className="w-24 p-2.5 bg-gray-800 border border-gray-600 rounded text-white text-center"
                    value={asset.equipment_quantity}
                    onChange={(e) => handleAssetChange(index, "equipment_quantity", e.target.value)}
                    placeholder="Qty"
                  />

                  {/* Remove row */}
                  {baseDetails.base_assets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAssetRow(index)}
                      className="w-10 h-10 bg-red-900 hover:bg-red-800 text-red-100 rounded font-bold transition"
                      title="Remove row"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add row */}
            <button
              type="button"
              onClick={addAssetRow}
              className="mt-3 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
            >
              ➕ Add Asset
            </button>

            {/* Equipment fetch error */}
            {eqError && <p className="mt-2 text-sm text-red-400">{eqError}</p>}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition transform hover:scale-105"
            >
              Register Base
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default FAdminAddBaseModal;
