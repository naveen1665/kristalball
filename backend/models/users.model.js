import mongoose from "mongoose";
import { USER_MODEL } from "../constants/model.constants.js";

const userSchema=new mongoose.Schema({
    user_name:{
        type:String,
        required:true,
        unique:true
    },
    user_pass:{
        type:String,
        required:true,
    },
    user_role:{
        type:String,
        required:true
    }
})

export const userModel=mongoose.model(USER_MODEL,userSchema);