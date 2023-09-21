import express  from "express";
import { registerAgency, updateAgency, getAllAgencyLocations, listAgencies } from "../controllers/agencyController";

const router = express.Router();

// Routes

// Route for adding new agency
router.route('/agencies/register').post(registerAgency);
// Route to update agency details
router.route('/agencies/update/:id').put(updateAgency);
// Fetching agencies with typeOfDisaster resourcesAvailable and their locations filter
router.route('/agencies/list/:id').get(listAgencies);
// Fetch all the agencies locations
router.route('/agencyLocations').get(getAllAgencyLocations);

export default router