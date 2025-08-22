import { ADMIN } from "../constants/role.constants.js";
import { userModel } from "../models/users.model.js";
import bcrypt from "bcrypt"

export const registerUser=async (request,response)=>{
    const {user_name,user_pass,user_role}=request.body;
    try{
        const userExist=await userModel.findOne({user_name})
        if(userExist)
        {
            return response.status(409).json({message:"User already Exist..."});
        }
        const hashed_pass=await bcrypt.hash(user_pass,10);
        const newUser=new userModel({user_name,user_pass:hashed_pass,user_role});
        await newUser.save();
        console.log(`New User Registered : ${user_name}`)
        return response.status(201).json({message:"User has been Successsfully registered.."});
    }
    catch(err)
    {
        console.log(err.message);
        return response.status(500).json({message:"Error while registering the User.."})

    }
}

export const loginUser=async(request,response)=>{
    const{user_name,user_pass}=request.body;
    try {
        const userExist=await userModel.findOne({user_name:user_name});
        if(!userExist)
        {
            return response.status(404).json({message:"User Information not found .."});
        }
        const isMatch=await bcrypt.compare(user_pass,userExist.user_pass);

        if(!isMatch)
        {
            return response.status(401).json({message:"Invalid Password"});
        }
        console.log(`User Logged in ID : ${user_name}`);

        return response.status(200).json({
            message:"Sucessfull Login",
            role:userExist.user_role
        });
        
    } catch (err) {
        console.log(err.message);
        return response.status(500).json({message:"Error while Login ..."})
    }
}

export const listUser=async(request,response)=>{
    try {
        const userDatas=await userModel.find({},{user_name:true,user_role:true});
        console.log("All User Data have been Retrived ..")
        return response.status(200).json({userDatas});
    } catch (err) {
        console.log(err.message);
        return response.status(500).json({message:"Error while retrieving data .."});
    }
}

export const updateRole=async(request,response)=>{
    try {
        const {admin_user,user_name,user_role}=request.body;
        const adminUserCheck=await userModel.findOne({user_name:admin_user});
        if(!adminUserCheck || adminUserCheck.user_role!==ADMIN)
        {
            return response.status(401).json({message:"Unauthorized. Not an admin .."});
        }
        const getUserDetails=await userModel.findOne({user_name});
        if(!getUserDetails)
        {
            return response.status(404).json({message:"No User Found"})
        }
        if(getUserDetails.user_role===user_role)
        {
            return response.status(409).json({message:`Already in ${getUserDetails.user_role}`});
        }
        getUserDetails.user_role=user_role;
        await getUserDetails.save();
        console.log(`Role of user : " ${getUserDetails.user_name} " updated to "${user_role}" by the admin : "${adminUserCheck.user_name}"`);
        return response.status(200).json({message:"Updated the Role"});

        
    } catch (err) {
        console.log(err.message);
        return response.status(500).json({message:"Error while Updating the User Role"});   
    }
}

export const deleteUser=async(request,response)=>{
    const {user_name,admin_user}=request.body;
    try {
        const adminUserCheck=await userModel.findOne({user_name:admin_user});
        if(!adminUserCheck || adminUserCheck.user_role!==ADMIN)
        {
            return response.status(401).json({message:"Unauthorized. Not an admin .."});
        }
        const getUserDetails=await userModel.findOne({user_name});
        if(!getUserDetails)
        {
            return response.status(404).json({message:"UserID not found .."});
        }
        await User.deleteOne({user_name:getUserDetails.user_name});
        console.log(`User : ${getUserDetails.user_name} is Deleted by ${adminUserCheck.user_name}..`);
        return response.status(200).json({message:"User delted Successfully .."});
        
    } catch (err) {
        console.log(err.message);
        return response.status(500).json({message:"Error while delting the user .."});   
    }
}