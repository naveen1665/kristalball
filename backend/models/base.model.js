import mongoose from "mongoose";
import { BASE_MODEL } from "../constants/model.constants.js";

const equipmentSchema = new mongoose.Schema({
    equipment_id: { type: String, required: true },
    equipment_quantity: { type: Number, required: true }
}, { _id: false });

const baseImportSchema = new mongoose.Schema({
    base_id: { type: String },
    equipments: [equipmentSchema]
}, { timestamps: true, _id: false });

const baseExportSchema = new mongoose.Schema({
    base_id: { type: String },
    equipments: [equipmentSchema]
}, { timestamps: true, _id: false });

const baseSalesSchema = new mongoose.Schema({
    buyer_name: { type: String },
    items: [equipmentSchema]
}, { timestamps: true, _id: false });

const baseLogSchema = new mongoose.Schema({
    category: { type: String },   // import, export, sales, usage
    transaction_id: { type: String },
    equipments: [equipmentSchema]
}, { timestamps: true, _id: false });


const baseSchema = new mongoose.Schema({
    base_name: {
        type: String,
        required: true
    },
    base_id: {
        type: String,
        required: true,
        unique: true
    },
    base_location: {
        type: String,
        required: true,
        unique: true
    },
    base_commander: {
        type: String,
        required: true,
        unique: true
    },
    base_assets: [equipmentSchema],

    base_import: [baseImportSchema],
    base_export: [baseExportSchema],
    base_sales: [baseSalesSchema],

    base_log: [baseLogSchema],

    base_export_request: [{
        from_base_id: { type: String },
        to_base_id: { type: String },
        items: [equipmentSchema],
        status: { type: Boolean, default: false }
    }]
});

export const baseModel = mongoose.model(BASE_MODEL, baseSchema);
