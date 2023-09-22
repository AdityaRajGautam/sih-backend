import express  from "express";
import { addDisaster, fetchDisasters, getDisaster, updateDisaster } from "../controllers/disasterController.js";
const router = express.Router();

// Routes

// Add new Disaster
router.route('/addNewDisaster').post(addDisaster);
// Updating disaster Info
router.route('/updateDisaster').post(updateDisaster);
// Fetching single disaster
router.route('/detailsOfDisaster').post(getDisaster);
// Fetching all disasters
router.route('/allDisasters').post(fetchDisasters);

export default router;