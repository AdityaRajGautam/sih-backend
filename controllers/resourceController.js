import Resource from '../models/resource';
import Agency from '../models/agency'; // Import your Agency model

export const createResource = async (req, res) => {
  try {
    const { name, quantity, status, availability} = req.body;
    const ownerAgencyId = req.user._id; // Assuming you have user authentication and can access the owner agency's ID from the request

    // Find the owner agency to get its location coordinates
    const ownerAgency = await Agency.findById(ownerAgencyId);

    if (!ownerAgency) {
      return res.status(404).json({ message: 'Owner agency not found' });
    }

    // Create a new resource instance with the owner agency's location coordinates
    const resource = new Resource({
      name,
      quantity,
      location: {
        type: 'Point',
        coordinates: ownerAgency.location.coordinates,
      },
      ownerAgency: ownerAgencyId,
      status,
      availability,
    });

    // Save the resource to the database
    await resource.save();

    // Add the resource reference to the owner agency's resources
    await Agency.findByIdAndUpdate(ownerAgencyId, {
      $push: { resources: resource._id },
    });

    res.status(201).json({ message: 'Resource created and added successfully', resource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating resource', error });
  }
};

export const updateResource = async (req, res) => {
  try {
    const resourceId = req.params.id;
    const { quantity, name, status, availability} = req.body; // Update fields you want to change

    // Find the resource by its ID
    const resource = await Resource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Update resource fields if provided in the request body
    if (quantity !== undefined) {
      resource.quantity = quantity;
    }

    if (name !== resource.name) {
      resource.name = name;
    }

    if(status !== status) {
        resource.status = status;
    }

    if(availability !== resource.availability) {
        resource.availability = availability;
    }

    // Save the updated resource
    await resource.save();

    res.status(200).json({ message: 'Resource updated successfully', resource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating resource', error });
  }
};

export const getResource = async (req, res) => {
  try {
    const { resourceName } = req.params; 
    const resource = await Resource.findOne({ name: resourceName });

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.status(200).json({ message: 'Resource retrieved successfully', resource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving resource', error });
  }
};


export const listResources = async (req, res) => {
  try {
    // Find all resources in the database
    const resources = await Resource.find();

    res.status(200).json({ message: 'Resources retrieved successfully', resources });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving resources', error });
  }
};

export const getResourceStatus = async (req, res) => {
  try {
    // Fetch all resources
    const resources = await Resource.find();

    // Extract the status and availability of each resource
    const resourceStatusList = resources.map((resource) => ({
      id: resource._id,
      name: resource.name,
      status: resource.status,
      availability: resource.availability,
    }));

    res.status(200).json({ message: 'Resource status fetched successfully', resourceStatusList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching resource status', error });
  }
};


export const shareResource = async (req, res) => {
  try {
    // const { resourceId,  sharedWithAgencyId} = req.params; 
    // const resource = await Resource.findOne({ name: resourceId });

    const { resourceId, sharedWithAgencyId } = req.body;
    const resource = await Resource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if the requesting agency owns the resource
    if (resource.ownerAgency.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are the owner bhai !!' });
    }

    // Share the resource with the specified agency
    resource.sharedWith.push(sharedWithAgencyId);
    await resource.save();

    res.status(200).json({ message: 'Resource shared successfully', resource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sharing resource', error });
  }
};


export const deleteResource = async (req, res) => {
  try {
    const resourceId = req.params.resourceId;
    const ownerAgencyId = req.user._id; 
    const resource = await Resource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (resource.ownerAgency.toString() !== ownerAgencyId.toString()) {
      return res.status(403).json({ message: 'Permission denied. You are not the owner of this resource.' });
    }

    await Agency.findByIdAndUpdate(ownerAgencyId, {
      $pull: { resources: resourceId },
    });

    await Resource.findByIdAndRemove(resourceId);

    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting resource', error });
  }
};

