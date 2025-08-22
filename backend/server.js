import { connectDB } from "./configs/db.config.js";
import express from "express";
import cors from "cors";
import userController from "./controller/user.controller.js";
import adminController from "./controller/admin.controller.js"
import baseController from "./controller/base.controller.js";
import equipmentController from "./controller/equipment.controller.js";
connectDB();
const app=express();

app.use(cors());
app.use(express.json());

app.use("/",userController);
app.use("/",adminController);
app.use("/",baseController);
app.use("/",equipmentController);

app.listen(process.env.PORT,()=>{
    console.log(`Server is started in ${process.env.PORT}`)
})
