const axios = require('axios');
const Agency = require('../models/agency');
const Disaster = require('../models/disaster');
const MAPBOX_API_KEY = 'pk.eyJ1IjoiaGFyc2hzaW5kaHUwNDA4IiwiYSI6ImNsbXMxbnI3ejA3dzgybG85dHVjZXQ0bHgifQ.n4D40V2mXLsYh5Bjs7H78A';

const registerAgency = async (req, res) => {
  try {
    // Check if the user is authenticated (e.g., by verifying the JWT token)
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User is not logged in' });
    }

    // Get the agency details, including the complete address and expertise, from the request body
    const { name, contact, expertise } = req.body;

    // Use a geocoding service to convert the complete address to coordinates
    const address = `${contact.address.street}, ${contact.address.city}, ${contact.address.state}, ${contact.address.postalCode}, ${contact.address.country}`;
    const geocodingResponse = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_API_KEY}`
      );

    const features = geocodingResponse.data.features;

    if (!features || features.length === 0) {
      return res.status(400).json({ message: 'Invalid address' });
    }

    const { lat, lng } = results[0].geometry.location;

    // Create a new agency instance with the provided details
    const agency = new Agency({
      name,
      contact,
      location: {
        type: 'Point',
        coordinates: [lng, lat], // Longitude and Latitude
      },
      expertise,
    });

    // Set the owner (user) of the agency to the authenticated user's _id
    agency.owner = req.user._id;

    // Save the agency to the database
    await agency.save();

    res.status(201).json({ message: 'Agency registered successfully', agency });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering agency', error });
  }
};


// update agency controller
const updateAgency = async (req, res) => {
  try {
    // Check if the user is authenticated (e.g., by verifying the JWT token)
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User is not logged in' });
    }

    // Get the agency ID from the request parameters
    const agencyId = req.params.id;

    // Find the agency in the database by ID
    const agency = await Agency.findById(agencyId);

    // Check if the agency exists
    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }

    // Check if the authenticated user is the owner of the agency
    if (agency.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to update this agency' });
    }

    // Update agency properties based on the request body
    if (req.body.name) {
      agency.name = req.body.name;
    }

    if (req.body.contact) {
      agency.contact = req.body.contact;
    }

    if (req.body.expertise) {
      agency.expertise = req.body.expertise;
    }

    // Update agency location if provided in the request body
    if (req.body.location) {
      if (req.body.location.type === 'Point' && req.body.location.coordinates) {
        agency.location = req.body.location;
      } else {
        return res.status(400).json({ message: 'Invalid location data' });
      }
    }

    // Save the updated agency to the database
    await agency.save();

    res.status(200).json({ message: 'Agency updated successfully', agency });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating agency', error });
  }
};


// get agency controller 
const getAllAgencyLocations = async (req, res) => {
  try {
    // Query all agencies in the database
    const agencies = await Agency.find();

    // Extract relevant information, including location, for each agency
    const agencyLocations = agencies.map((agency) => {
        return {
            _id: agency._id,
            name: agency.name,
            contact: agency.contact,
            expertise: agency.expertise,
            location: agency.location,
          };
    });

    res.status(200).json({ message: 'All agency locations retrieved successfully', agencies: agencyLocations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching agency locations', error });
  }
};


const listAgencies = async (req, res) => {
  try {

    const { typeOfDisaster, resourcesAvailable, latitude, longitude } = req.query;
    const agencyQuery = {};

    if (typeOfDisaster) {
      const disaster = await Disaster.findOne({ typeOfDisaster });

      if (disaster) {
        agencyQuery._id = { $in: disaster.agencies };
      }
    }

    if (resourcesAvailable) {
      const matchingResources = await Resource.find({ name: resourcesAvailable });

      if (matchingResources.length > 0) {
        agencyQuery._id = { $in: matchingResources.map((resource) => resource.ownerAgency) };
      }
    }

    if (latitude && longitude) {
      agencyQuery.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 100000,
        },
      };
    }


    const agencies = await Agency.find(agencyQuery);

    res.status(200).json({ message: 'Agencies listed successfully', agencies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error listing agencies', error });
  }
};

module.exports = {
    registerAgency,
    updateAgency,
    getAllAgencyLocations,
    listAgencies,
};