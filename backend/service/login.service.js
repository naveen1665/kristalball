import bcrypt from "bcrypt"
import { adminModel } from "../models/admin.model.js";
import { commanderModel } from "../models/commander.model.js";
import { logisticsOfficerModel } from "../models/logisticOfficer.model.js";


export const loginFunction = async (request, response) => {
  try {
    const { user_name, user_pass, user_role } = request.body;

    if (!user_name || !user_pass || !user_role) {
      return response.status(400).json({ message: "All fields are required" });
    }

    let user;
    if (user_role === "admin") {
      user = await adminModel.findOne({ user_name });
    } else if (user_role === "commander") {
      user = await commanderModel.findOne({ user_name });
    } else if (user_role === "logisticOfficer") {
      user = await logisticsOfficerModel.findOne({ user_name });
    } else {
      return response.status(400).json({ message: "Invalid role" });
    }

    if (!user) {
      return response.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(user_pass, user.user_pass);
    if (!isMatch) {
      return response.status(401).json({ message: "Invalid user_pass" });
    }

    return response.status(200).json({
      message: "Login successful",
      data: {
        user_name: user.user_name,
        role: user_role,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    return response.status(500).json({ message: "Server error" });
  }
};
