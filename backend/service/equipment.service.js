import { adminCheck, internalServerError, missingParameter } from "../utils/function.utils.js";
import { equipmentsModel } from "../models/equipment.model.js";

export const addEquipment = async (request, response) => {
    try {
        const { user_name, equipment } = request.body;

        if (!user_name || !equipment) {
            return missingParameter(response);
        }

        if (!(await adminCheck(user_name))) {
            return missingParameter(response);
        }

        // Ensure we always work with an array
        const equipmentArray = Array.isArray(equipment) ? equipment : [equipment];

        for (const element of equipmentArray) {
            const equipmentFound = await equipmentsModel.findOne({ equipment_id: element.equipment_id });

            if (!equipmentFound) {
                const newEquipment = new equipmentsModel({
                    equipment_id: element.equipment_id,
                    equipment_type: element.equipment_type || "General",
                    equipment_name: element.equipment_name || element.equipment_id,
                    equipment_cost: element.equipment_cost || 0,
                    equipment_quantity: element.equipment_quantity || 0
                });
                await newEquipment.save();
            } else {
                equipmentFound.equipment_quantity += element.equipment_quantity;
                await equipmentFound.save();
            }
        }

        console.log("New equipment(s) added");
        return response.status(201).json({ message: "Equipments added successfully" });

    } catch (err) {
        return internalServerError(response, err.message, "adding equipments");
    }
};

export const getAllEquipments=async(request,response)=>{
    try {
        const {user_name}=request.body;
        if(!user_name)
        {
            return missingParameter(response);
        }
        if(! await adminCheck(user_name))
        {
            return missingParameter(response);
        }
        const equipmentDetails=await equipmentsModel.find();
        response.status(200).json(equipmentDetails);

        
    } catch (err) {
        return internalServerError(response,err.message,"geting all equipments");
        
    }
}

export const dailyUsageSales = async (request, response) => {
    try {
        const { user_name, base_id, date } = request.body;

        if (!user_name || !base_id || !date) {
            return missingParameter(response);
        }

        if (!await adminCheck(user_name)) {
            return response.status(403).json({ message: "Not authorized" });
        }

        const baseDetail = await baseModel.findOne({ base_id });
        if (!baseDetail) {
            return response.status(404).json({ message: "Base not found" });
        }

        const selectedDate = new Date(date);
        if (isNaN(selectedDate)) {
            return response.status(400).json({ message: "Invalid date format" });
        }

        const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

        // Filter logs for given date
        const filteredLogs = baseDetail.base_log.filter(log => {
            if (!log.createdAt) return false;
            const logDate = new Date(log.createdAt);
            return logDate >= startOfDay && logDate <= endOfDay &&
                   (log.category === "sales" || log.category === "usage");
        });

        return response.status(200).json({
            message: `Usage/Sales logs for ${date}`,
            data: filteredLogs
        });

    } catch (err) {
        return internalServerError(response, err.message, "fetching usage/sales logs");
    }
};

