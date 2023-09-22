import express from "express";
import { createAlertController, getAlertsForAgencyController } from "../controllers/alertController.js";
import { requireSignIn } from "../middlewares/authenticationMiddleware.js";

const router=express.Router();

// Route for adding new alert
router.route('/createalerts').post(requireSignIn,createAlertController);

// Fetching all the  alerts 
router.route('/getalerts/').get(requireSignIn,getAlertsForAgencyController);

export default router;