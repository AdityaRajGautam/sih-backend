import express from "express";
import { createAlertController, getAlertsForAgencyController } from "../controllers/alertController.js";

const router=express.Router();

// Route for adding new alert
router.route('/createalerts').post(createAlertController);

// Fetching all the  alerts 
router.route('/getalerts/:id').post(getAlertsForAgencyController);

export default router;