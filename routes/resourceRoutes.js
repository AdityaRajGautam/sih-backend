import express from "express";
import {
  createResource,
  updateResource,
  getResource,
  listResources,
  getResourceStatus,
  shareResource,
  deleteResource,
} from "../controllers/resourceController";
const router = express.Router();

// Create a new resource
router.post("/create", createResource);

// Update an existing resource by ID
router.put("/update/:id", updateResource);

// Get details about a specific resource by name
router.get("/get/:resourceName", getResource);

// List all available shared resources
router.get("/list", listResources);

// Get the status and availability of shared resources
router.get("/status", getResourceStatus);

// Share a resource with another agency
router.post("/share", shareResource);

// Delete a resource by ID
router.delete("/delete/:resourceId", deleteResource);

export default router;
