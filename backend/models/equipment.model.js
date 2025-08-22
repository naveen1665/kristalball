import mongoose from "mongoose";
import { EQUIPMENT_MODEL } from "../constants/model.constants.js";

const equipmentSchema = new mongoose.Schema({
    equipment_id: {
        type: String,
        required: true,
        unique: true
    },
    equipment_type: {
        type: String,
        required: true
    },
    equipment_name: {
        type: String,
        required: true
    },
    equipment_cost: {
        type: Number,
        required: true
    },
    equipment_quantity: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

export const equipmentsModel = mongoose.model(EQUIPMENT_MODEL, equipmentSchema);
