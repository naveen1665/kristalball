import express from 'express'
import { BASE_ADD_NEW_BASE, DELETE_SINGLE_BASE, GET_ALL_BASE_DETAILS, GET_SINGLE_BASE, IMPORT_BASE, UPDATE_BASE_ASSESTS, UPDATE_TRANSACTION_LOGS } from '../constants/apiEndpoints.constant.js';
import { addNewBase, deleteBase, getAllBase, getSingleBase, importAssests, updateBaseAssets, updatedTransactions } from '../service/base.service.js';

const router=express.Router();

router.post(BASE_ADD_NEW_BASE,addNewBase);
router.post(GET_ALL_BASE_DETAILS,getAllBase);
router.post(UPDATE_BASE_ASSESTS,updateBaseAssets);
router.post(UPDATE_TRANSACTION_LOGS,updatedTransactions);
router.post(IMPORT_BASE,importAssests);
router.post(GET_SINGLE_BASE,getSingleBase);
router.post(DELETE_SINGLE_BASE,deleteBase);


export default router;
