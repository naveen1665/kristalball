import express from "express"
import { ADMIN_REGISTRATION, BASE_ADD_NEW_BASE } from "../constants/apiEndpoints.constant.js";
import { registerAdmin } from "../service/admin.service.js";

const router=express.Router();

router.post(ADMIN_REGISTRATION,registerAdmin);

export default router
