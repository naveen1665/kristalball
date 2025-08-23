import { adminModel } from "../models/admin.model.js";

export const missingParameter=(response)=>{
    return response.status(400).json({message:"Missing parameter or access Denied .."});
}



export const internalServerError=(response,message,functionName)=>{
    console.log(message);
    return response.status(500).json({message:`Error in ${functionName}`})
}

export const adminCheck=async (user_name)=>{
    const details=await adminModel.findOne({user_name});
    if(details)
        return true;
    return false;
}

export const adminValidationFailed=(response)=>{
    return response.status(403).json({ message: "Unauthorized - Admin access required" });
}

export const baseNotfound=(response)=>{
    console.log("Base not found");
    return response.status(404).json({message:"the Base id not found"})
}