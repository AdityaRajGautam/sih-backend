import express  from "express";
import { requireSignIn } from "../middlewares/authenticationMiddleware.js";
import { addDisaster, fetchDisasters, getDisaster, updateDisaster, getAgenciesForDisaster } from "../controllers/disasterController.js";
const router = express.Router();

// Routes

// Add new Disaster
router.route('/addDisaster').post(requireSignIn, addDisaster);
// Updating disaster Info
router.route('/updateDisaster/:id').put(requireSignIn, updateDisaster);
// Fetching single disaster
router.route('/getDisaster/:id').get(getDisaster);
// Fetching all disasters
router.route('/allDisasters').get(fetchDisasters);

router.route('/getAgenciesForDisaster/:id').get(getAgenciesForDisaster);

export default router;