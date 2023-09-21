import express  from "express";
import { addDisaster, fetchDisasters, getDisaster, updateDisaster } from "../controllers/disasterController.js";
const router = express.Router();

// Routes

// Add new Disaster
router.route('/add').post(addDisaster);
// Updating disaster Info
router.route('/update').post(updateDisaster);
// Fetching single disaster
router.route('/details').post(getDisaster);
// Fetching all disasters
router.route('/all').post(fetchDisasters);

export default router;