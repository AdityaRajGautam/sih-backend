import express from "express";
import { createAlert, getAlertsForAgency } from "../controllers/alertController.js";
import { requireSignIn } from "../middlewares/authenticationMiddleware.js";

const router=express.Router();

// Route for adding new alert
router.route('/createalerts').post(requireSignIn,createAlert);

// Fetching all the  alerts 
router.route('/getalerts').get(requireSignIn,getAlertsForAgency);

export default router;