import mongoose from "mongoose";
import { ADMIN_MODEL } from "../constants/model.constants.js";

const adminSchema=new mongoose.Schema({

    user_name:{
        type:String,
        unique:true,
        require:true
    },
    user_pass:{
        type:String,
        required:true
    }
})

export const adminModel=mongoose.model(ADMIN_MODEL,adminSchema)