import { adminModel } from "../models/admin.model.js";
import { commanderModel } from "../models/commander.model.js";
import { logisticsOfficerModel } from "../models/logisticOfficer.model.js";
import bcrypt from "bcrypt"

export const registerAdmin = async (request, response) => {
    const { user_name, user_pass } = request.body;
    try {
        if(!user_name||!user_pass)
        {
            return response.status(400).json({message:"All parameters required .."})
        }
        const userExist = await adminModel.findOne({ user_name })
        if (userExist) {
            return response.status(409).json({ message: "ADMIN already Exist..." });
        }
        const hashed_pass = await bcrypt.hash(user_pass, 10);
        const newUser = new adminModel({ user_name, user_pass: hashed_pass });
        await newUser.save();
        console.log(`New ADMIN Registered : ${user_name}`)
        return response.status(201).json({ message: "ADMIN has been Successsfully registered.." });
    }
    catch (err) {
        console.log(err.message);
        return response.status(500).json({ message: "Error while registering the User.." })

    }
}


export const registerCommader = async (request, response) => {
    const { admin_name, user_name, user_pass, base_id } = request.body;
    try {
        const adminCheck = await adminModel.findOne({ user_name: admin_name })
        if (!adminCheck) {
            return response.status(404).json({ message: "Admin Creadential Not Found" });
        }
        const userExist = await commanderModel.findOne({ user_name })
        if (userExist) {
            return response.status(409).json({ message: "User already Exist..." });
        }
        const hashed_pass = await bcrypt.hash(user_pass, 10);
        const newUser = new commanderModel({ user_name, user_pass: hashed_pass, base_id });
        await newUser.save();
        console.log(`New User Registered : ${user_name}`)
        return response.status(201).json({ message: "User has been Successsfully registered.." });
    }
    catch (err) {
        console.log(err.message);
        return response.status(500).json({ message: "Error while registering the User.." })

    }
}


export const registerLogisticOfficer = async (request, response) => {
    const { admin_name, user_name, user_pass } = request.body;
    try {
        const adminCheck = await adminModel.findOne({ user_name: admin_name })
        if (!adminCheck) {
            return response.status(404).json({ message: "Admin Creadential Not Found" });
        }
        const userExist = await logisticsOfficerModel.findOne({ user_name })
        if (userExist) {
            return response.status(409).json({ message: "User already Exist..." });
        }
        const hashed_pass = await bcrypt.hash(user_pass, 10);
        const newUser = new logisticsOfficerModel({ user_name, user_pass: hashed_pass, base_id });
        await newUser.save();
        console.log(`New User Registered : ${user_name}`)
        return response.status(201).json({ message: "User has been Successsfully registered.." });
    }
    catch (err) {
        console.log(err.message);
        return response.status(500).json({ message: "Error while registering the User.." })

    }
}

export const listAllAdmin = async (request, response) => {
    const { user_name } = request.body;
    try {
        const adminCheck = await adminModel.findOne({ user_name })
        if (!adminCheck) {
            return response.status(404).json({ message: "Admin Creadential Not Found" });
        }
        const commanderDatas = await adminModel.find({}, { user_name: true, base_id: true });
        console.log(`All User Data have been Retrived by ${adminCheck.user_name} ..`)
        return response.status(200).json({ commanderDatas });
    } catch (err) {
        console.log(err.message);
        return response.status(500).json({ message: "Error while retrieving data .." });
    }
}

export const listAllCommader = async (request, response) => {
    const { user_name } = request.body;
    try {
        const adminCheck = await adminModel.findOne({ user_name })
        if (!adminCheck) {
            return response.status(404).json({ message: "Admin Creadential Not Found" });
        }
        const commanderDatas = await commanderModel.find({}, { user_name: true, base_id: true });
        console.log(`All User Data have been Retrived by ${adminCheck.user_name} ..`)
        return response.status(200).json({ commanderDatas });
    } catch (err) {
        console.log(err.message);
        return response.status(500).json({ message: "Error while retrieving data .." });
    }
}

export const listAllLogisticOfficer = async (request, response) => {
    const { user_name } = request.body;
    try {
        const adminCheck = await adminModel.findOne({ user_name })
        if (!adminCheck) {
            return response.status(404).json({ message: "Admin Creadential Not Found" });
        }
        const commanderDatas = await logisticsOfficerModel.find({}, { user_name: true });
        console.log(`All User Data have been Retrived by ${adminCheck.user_name} ..`)
        return response.status(200).json({ commanderDatas });
    } catch (err) {
        console.log(err.message);
        return response.status(500).json({ message: "Error while retrieving data .." });
    }
}

export const deleteCommander = async (request, response) => {
    const { user_name, admin_user } = request.body;
    try {
        const adminUserCheck = await adminModel.findOne({ user_name: admin_user });
        if (!adminUserCheck) {
            return response.status(401).json({ message: "Unauthorized. Not an admin .." });
        }
        const getUserDetails = await commanderModel.findOne({ user_name });
        if (!getUserDetails) {
            return response.status(404).json({ message: "Commander not found .." });
        }
        await commanderModel.deleteOne({ user_name: getUserDetails.user_name });
        console.log(`User : ${getUserDetails.user_name} is Deleted by ${adminUserCheck.user_name}..`);
        return response.status(200).json({ message: "User delted Successfully .." });

    } catch (err) {
        console.log(err.message);
        return response.status(500).json({ message: "Error while deleting the user .." });
    }
}

export const deleteAdmin = async (request, response) => {
    const { user_name, admin_user } = request.body;
    try {
        const adminUserCheck = await adminModel.findOne({ user_name: admin_user });
        if (!adminUserCheck) {
            return response.status(401).json({ message: "Unauthorized. Not an admin .." });
        }
        const getUserDetails = await adminModel.findOne({ user_name });
        if (!getUserDetails) {
            return response.status(404).json({ message: "Commander not found .." });
        }
        await adminModel.deleteOne({ user_name: getUserDetails.user_name });
        console.log(`User : ${getUserDetails.user_name} is Deleted by ${adminUserCheck.user_name}..`);
        return response.status(200).json({ message: "User deleted Successfully .." });

    } catch (err) {
        console.log(err.message);
        return response.status(500).json({ message: "Error while deleting the user .." });
    }
}

export const deleteLogisticOfficer = async (request, response) => {
    const { user_name, admin_user } = request.body;
    try {
        const adminUserCheck = await adminModel.findOne({ user_name: admin_user });
        if (!adminUserCheck) {
            return response.status(401).json({ message: "Unauthorized. Not an admin .." });
        }
        const getUserDetails = await logisticsOfficerModel.findOne({ user_name });
        if (!getUserDetails) {
            return response.status(404).json({ message: "Commander not found .." });
        }
        await logisticsOfficerModel.deleteOne({ user_name: getUserDetails.user_name });
        console.log(`User : ${getUserDetails.user_name} is Deleted by ${adminUserCheck.user_name}..`);
        return response.status(200).json({ message: "User deleted Successfully .." });

    } catch (err) {
        console.log(err.message);
        return response.status(500).json({ message: "Error while deleting the user .." });
    }
}



