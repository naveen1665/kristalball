import mongoose from "mongoose";
import { LOGISTICS_OFFICER_MODEL } from "../constants/model.constants.js";

const logisticsOfficerSchema=new mongoose.Schema({
    user_name:{
        type:String,
        required:true,
        unique:true
    },
    user_pass:{
        type:String,
        required:true
    }
})

export const logisticsOfficerModel=mongoose.model(LOGISTICS_OFFICER_MODEL,logisticsOfficerSchema);