import { response } from "express";
import { adminModel } from "../models/admin.model.js";
import { baseModel } from "../models/base.model.js";
import { commanderModel } from "../models/commander.model.js";
import { logisticsOfficerModel } from "../models/logisticOfficer.model.js";
import { adminCheck, adminValidationFailed, baseNotfound, internalServerError, missingParameter } from "../utils/function.utils.js";

export const addNewBase=async(request,response)=>{
    const {user_name,base_id,base_name,base_commander,base_location,base_assets,base_import,base_export,base_sales}=request.body;
    try {
        if(!user_name || !base_id || !base_name || !base_commander || !base_location)
        {
            return missingParameter(response);
        }
        if(! await adminCheck(user_name))
        {
            return missingParameter(response);
        }
        const baseDetail=await baseModel.findOne({base_id});
        if(baseDetail)
        {
            return response.status(409).json({message:`Base is already available with ${base_id}`});
        }
        const newBase= new baseModel({base_name,base_id,base_location,base_commander,base_assets,base_import,base_export,base_sales});
        await newBase.save();
        console.log(`New Base ${base_name} add by ${user_name}`);
        return response.status(201).json({message:"New Base has been Added .."});

    } catch (err) {

        console.log(err.message);
        return response.status(500).json({message:"Error while adding new base .."});
               
    }

}

export const getAllBase=async(request,response)=>{
    try {
        const {user_name}=request.body;
        if(!await adminCheck(user_name))
        {
            return missingParameter(response);
        }        
        const allBaseDetails=await baseModel.find();
        console.log(`All Inventory Data has by ${user_name}`);
        return response.status(200).json(allBaseDetails);
    } catch (err) {
        console.log(err.message);
        return response.status(500).json({message:"error while retiving the all base details"});
    }
}



export const getSingleBase=async(request,response)=>{
    try {
        const {user_name,base_id}=request.body;
        const getUserDetails=await commanderModel.findOne({user_name});
        const admin=await adminCheck(user_name);
        if(!admin && (!getUserDetails || getUserDetails.base_id!==base_id))
        {
            return response.status(403).json({message:"Invalid Access"});
        }
        const baseDetail=await baseModel.findOne({base_id}).lean();
        return response.status(200).json(baseDetail);
        
    } catch (err) {
        console.log(err.message);
        return response.status(500).json({message:"Error while Getting single base Details"});
    }
}

export const updateBaseAssets = async (request, response) => {
    try {
        const { user_name, base_id, base_assets } = request.body;

        // Validate user access
        const adminCheck = await adminModel.findOne({ user_name });
        const commanderCheck = await commanderModel.findOne({ user_name });
        if (!adminCheck && (!commanderCheck || commanderCheck.base_id !== base_id)) {
            return response.status(404).json({ message: "Commander is missing or Base_id mismatch." });
        }

        // Validate base existence
        const baseInfo = await baseModel.findOne({ base_id });
        if (!baseInfo) {
            return response.status(404).json({ message: "Base not found." });
        }

        if (!Array.isArray(base_assets)) {
            return response.status(400).json({ message: "base_assets should be an array." });
        }

        // Append or update quantities
        base_assets.forEach(newAsset => {
            const qty = Number(newAsset.equipment_quantity) || 0; // Ensure numeric
            const existingAsset = baseInfo.base_assets.find(asset => asset.equipment_id === newAsset.equipment_id);

            if (existingAsset) {
                existingAsset.equipment_quantity += qty;
            } else {
                baseInfo.base_assets.push({
                    equipment_id: newAsset.equipment_id,
                    equipment_quantity: qty
                });
            }
        });

        await baseInfo.save();

        console.log(`Base: ${base_id} has been updated by ${user_name}`);
        return response.status(200).json({ message: `Base: ${base_id} updated successfully by ${user_name}` });

    } catch (err) {
        console.error(err.message);
        return response.status(500).json({ message: "Error while updating the Base Assets." });
    }
};



//update(append) the base_logs
export const updatedTransactions=async(request,response)=>{
    try {
        const {base_id,base_log}=request.body;
        const baseDetail=await baseModel.findOne({base_id});
        if(!baseDetail)
        {
            return response.status(404).json({message:"Base Not found"});
        }
        await baseDetail.updateOne({$push:{base_log:base_log}});
        console.log(`New transaction in ${base_id}`);
        return response.status(201).json({message:"New transction has been updated"});
        
    } catch (err) {
        console.log("Error while updating the transaction ..");
        return response.status(500).json({message:"Error while adding the new transaction"});
        
    }
}



export const importAssests = async (request, response) => {
    try {
        const { current_base_id, import_base_id, items, user_name } = request.body;

        // Validate user
        const userCheck = await commanderModel.findOne({ user_name }) ||
                          await adminModel.findOne({ user_name }) ||
                          await logisticsOfficerModel.findOne({ user_name });

        if (!userCheck) {
            return response.status(404).json({ message: "No User found" });
        }

        if (!current_base_id || !import_base_id || !items || !user_name) {
            return response.status(400).json({ message: "Missing Input fields" });
        }

        // Get bases
        const current_base_details = await baseModel.findOne({ base_id: current_base_id });
        const import_base_details = await baseModel.findOne({ base_id: import_base_id });

        if (!current_base_details || !import_base_details) {
            return response.status(400).json({ message: "Bases Not found" });
        }

        // Process items
        for (const item of items) {
            const qty = parseInt(item.equipment_quantity, 10) || 0;

            // Find asset in import base
            const importAsset = import_base_details.base_assets.find(a => a.equipment_id === item.equipment_id);
            if (!importAsset || importAsset.equipment_quantity < qty) {
                return response.status(400).json({ message: `Not enough ${item.equipment_id} in base ${import_base_id}` });
            }

            // Deduct from import base
            importAsset.equipment_quantity -= qty;

            // Add to current base
            let currentAsset = current_base_details.base_assets.find(a => a.equipment_id === item.equipment_id);
            if (currentAsset) {
                currentAsset.equipment_quantity += qty;
            } else {
                current_base_details.base_assets.push({ equipment_id: item.equipment_id, equipment_quantity: qty });
            }
        }

        // Record logs
        current_base_details.base_import.push({ base_id: import_base_id, equipments: items });
        import_base_details.base_export.push({ base_id: current_base_id, equipments: items });

        current_base_details.base_log.push({
            category: "IMPORT",
            transaction_id: "I" + new Date().getTime(),
            equipments: items
        });
        import_base_details.base_log.push({
            category: "EXPORT",
            transaction_id: "E" + new Date().getTime(),
            equipments: items
        });

        await current_base_details.save();
        await import_base_details.save();

        return response.status(200).json({ message: `Successfully imported from ${import_base_id}` });

    } catch (err) {
        console.log(err.message);
        return response.status(500).json({ message: "Error while importing assets" });
    }
};

export const exportAssests = async (request, response) => {
    try {
        const { current_base_id, export_base_id, items, user_name } = request.body;

        // Validate user
        const userCheck = await commanderModel.findOne({ user_name }) ||
                          await adminModel.findOne({ user_name }) ||
                          await logisticsOfficerModel.findOne({ user_name });

        if (!userCheck) {
            return response.status(404).json({ message: "No User found" });
        }

        if (!current_base_id || !export_base_id || !items || !user_name) {
            return response.status(400).json({ message: "Missing Input fields" });
        }

        // Get bases
        const current_base_details = await baseModel.findOne({ base_id: current_base_id });
        const export_base_details = await baseModel.findOne({ base_id: export_base_id });

        if (!current_base_details || !export_base_details) {
            return response.status(400).json({ message: "Bases Not found" });
        }

        // Process items
        for (const item of items) {
            const qty = parseInt(item.equipment_quantity, 10) || 0;

            // Check current base inventory
            const currentAsset = current_base_details.base_assets.find(a => a.equipment_id === item.equipment_id);
            if (!currentAsset || currentAsset.equipment_quantity < qty) {
                return response.status(400).json({ message: `Not enough ${item.equipment_id} in base ${current_base_id}` });
            }

            // Deduct from current base
            currentAsset.equipment_quantity -= qty;

            // Add to export base
            let exportAsset = export_base_details.base_assets.find(a => a.equipment_id === item.equipment_id);
            if (exportAsset) {
                exportAsset.equipment_quantity += qty;
            } else {
                export_base_details.base_assets.push({ equipment_id: item.equipment_id, equipment_quantity: qty });
            }
        }

        // Record logs
        export_base_details.base_import.push({ base_id: current_base_id, equipments: items });
        current_base_details.base_export.push({ base_id: export_base_id, equipments: items });

        current_base_details.base_log.push({
            category: "EXPORT",
            transaction_id: "E" + new Date().getTime(),
            equipments: items
        });
        export_base_details.base_log.push({
            category: "IMPORT",
            transaction_id: "I" + new Date().getTime(),
            equipments: items
        });

        await current_base_details.save();
        await export_base_details.save();

        return response.status(200).json({ message: `Successfully exported to ${export_base_id}` });

    } catch (err) {
        console.log(err.message);
        return response.status(500).json({ message: "Error while exporting assets" });
    }
};

export const exportRequest=async(request,response)=>{
    try {
        const {from_base_id,to_base_id,items}=request.body;
        if(!from_base_id||!to_base_id || !items)
        {
            return response.status(400).json({message:"BaseID or Items is Missing .."});
        }
        const baseDetail=await baseModel.findOne({base_id:to_base_id});
        if(!baseDetail)
        {
            return response.status(404).json({message:`The BaseID : ${to_base_id} is not found ..`});
        }
        baseDetail.base_export_request.push({base_export_request:{from_base_id:from_base_id,to_base_id:to_base_id,items:items}})
        await baseDetail.save();
        return response.status(201).json({message:"New request has been initialted .."});
        
    } catch (err) {
        console.log(err.message);
        return response.status(500).json({message:"Error while Request to the Export"})
        
    }
}

export const salesUsage=async(request,response)=>{
    try {
        const {base_id,category,transaction_id,equipments}=request.body;
        if(!base_id||!category||!transaction_id||!equipments)
        {
            return response.status(404).json({message:"Paramenters are Missing .."});
        }
        const baseDetail=await baseModel.findOne({base_id});
        if(!baseDetail)
        {
            return response.status(404).json({message:"Base not found .."})
        }
        baseDetail.base_log.push({category:category,
            transaction_id:transaction_id,
            equipments:equipments
        })

        for(const item of equipments){
            const currentAsset=baseDetail.base_assets.find(a=>a.equipment_id===item.equipment_id)
            if(!currentAsset)
            {
                return response.status(404).json({message:"The EquipmentID is not found"});
            }
            if(currentAsset.equipment_quantity<item.equipment_quantity)
            {
                return response.status(400).json({message:"The usage or sales is greater than available .."});
            }
            currentAsset.equipment_quantity-=item.equipment_quantity;
        }
        await baseDetail.save();
        return response.status(201).json({message:"Assets Updated and Logged .."});

        
        
    } catch (err) {
        console.log(err.message);
        return response.status(500).json({message:"Error while updating sales and usages .."});
        
    }
}

export const deleteBase=async(request,response)=>{
    try {
        const {base_id,user_name}=request.body;
        if(!base_id || !user_name)
        {
            return missingParameter(response);
        }
        if(!await adminCheck(user_name))
        {
            return adminValidationFailed(response);
        }
        if(! await baseModel.findOneAndDelete({base_id}))
        {
            return response.status(404).json({message:"base not found"});
        }
        return response.status(200).json({message:"Deleted Succesfully"});


        
    } catch (err) {
        return internalServerError(response,err.message,"deleteBase");       
    }
}

export const updateCommander=async(request,response)=>{
    try {
        const {user_name,base_id,commander_name}=request.body;
        if(!user_name||!base_id||!commander_name)
        {
            return missingParameter(response);
        }
        if(!await adminCheck(user_name))
        {
            return adminValidationFailed(response);
        }
        const baseDetail=await baseModel.findOne({base_id});
        if(!baseDetail)
        {
            return baseNotfound(response);
        }
        baseDetail.base_commander=commander_name;
        await baseDetail.save();

        return response.status(200).json({message:"Updated the comander"})

        
    } catch (err) {
        return internalServerError(response,err.message,"update comander");
    }
}

export const getTransaction = async (request, response) => {
    try {
        const baseDetail = await baseModel.find().lean();
        let result = [];

        baseDetail.forEach((base) => {
            if (Array.isArray(base.base_log)) {
                result.push(...base.base_log); // Spread operator to merge arrays
            }
        });

        return response.status(200).json(result);

    } catch (err) {
        return internalServerError(response,err.message,"getTransaction");
     }
};
