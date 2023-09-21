import express  from "express";
import { registerAgency, updateAgency, getAllAgencyLocations, updatePasswordController, getAgencyResourcesAndDisasters, loginAgency } from "../controllers/agencyController.js";

const router = express.Router();

// Routes

// Route for adding new agency
router.route('/register').post(registerAgency);
// Route for login
router.route('/login').post(loginAgency);
// Route to update agency password
router.route('/frogotpassword/').put(updatePasswordController);
// Route to update agency details
router.route('/update/:id').put(updateAgency);
// Fetching agencies with typeOfDisaster resourcesAvailable and their locations filter
router.route('/list/:id').get(getAgencyResourcesAndDisasters);
// Fetch all the agencies locations
router.route('/agencyLocations').get(getAllAgencyLocations);

export default router