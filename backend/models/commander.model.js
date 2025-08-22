import mongoose from "mongoose";
import { COMMANDER_MODEL } from "../constants/model.constants.js";

const commanderSchema= new mongoose.Schema({
    user_name:{
        type:String,
        unique:true,
        required:true
    },
    user_pass:{
        type:String,
        required:true
    },
    base_id:{
        type:String,
        required:true
    }
})

export const commanderModel=mongoose.model(COMMANDER_MODEL,commanderSchema);