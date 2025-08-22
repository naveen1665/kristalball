import express from "express";
import {USER_LOGIN} from "../constants/apiEndpoints.constant.js";
import { loginFunction } from "../service/login.service.js";


const router = express.Router();

router.post(USER_LOGIN,loginFunction);


export default router;