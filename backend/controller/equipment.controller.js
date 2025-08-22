import express from "express";
import { ADD_EQUIPMENT, GET_EQUIPMENT } from "../constants/apiEndpoints.constant.js";
import { addEquipment, getAllEquipments } from "../service/equipment.service.js";

const router=express.Router();

router.post(ADD_EQUIPMENT,addEquipment);
router.post(GET_EQUIPMENT,getAllEquipments);

export default router;