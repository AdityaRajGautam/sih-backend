import { filterResults } from "../Utils/filterDisaster.js";
import Disaster from "../models/disaster.js";
import axios from "axios";

// Adding new Disaster
export const addDisaster = async (req, res) => {
  const {
    typeOfDisaster,
    description,
    contact,
    status,
    severity,
  } = req.body;
  const agencies = req.user._id;
  console.log(agencies);

  // Check if agencies is defined and not empty
  if (!agencies || agencies.length === 0) {
    return res.status(400).json({ success: false, message: "Agencies must be provided" });
  }

  if (
    !typeOfDisaster ||
    !description ||
    !contact ||
    !status ||
    !severity
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All the fields are mandatory" });
  }

  try {
    const address = `${contact.address.street}, ${contact.address.city}, ${contact.address.state}, ${contact.address.postalCode}, ${contact.address.country}`;
    const geocodingResponse = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${process.env.MAPBOX_API_KEY}`
    );

    const features = geocodingResponse.data.features;

    if (!features || features.length === 0) {
      return res.status(400).json({ message: "Invalid address" });
    }
    console.log("Coordinates are ->>", features[0].center);
    const coordinates = features[0].center;
    const swappedCoordinates = [coordinates[1], coordinates[0]];

    // Define and provide a valid timestamp for the disaster
    const timestamp = new Date();

    const newDisaster = await Disaster.create({
      typeOfDisaster,
      timestamp,
      contact,
      description,
      location: {
        type: "Point",
        coordinates: swappedCoordinates,
      },
      agencies,
      status,
      severity,
    });

    res
      .status(201)
      .json({ success: true, message: "New Disaster info added", newDisaster });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create disaster record" });
  }
};

// Update Disaster Info
export const updateDisaster = async (req, res) => {
  const { id } = req.params;
  const {
    typeOfDisaster,
    description,
    contact,
    status,
    severity,
  } = req.body;
  const agencyId = req.user._id;

  try {
    // Fetching Old disaster
    const oldDisaster = await Disaster.findById(id);

    if (!oldDisaster) {
      return res
        .status(404)
        .json({ success: false, message: "No record found" });
    }

    // Check if the agency updating the disaster is authorized
    if (!oldDisaster.agencies.includes(agencyId)) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized to update this disaster" });
    }

    // Converting to Co-Ordinates
    const address = `${contact.address.street}, ${contact.address.city}, ${contact.address.state}, ${contact.address.postalCode}, ${contact.address.country}`;
    const geocodingResponse = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${process.env.MAPBOX_API_KEY}`
    );

    const features = geocodingResponse.data.features;

    if (!features || features.length === 0) {
      return res.status(400).json({ message: "Invalid address" });
    }
    console.log("Coordinates are ->>", features[0].center);
    const coordinates = features[0].center;
    const swappedCoordinates = [coordinates[1], coordinates[0]];

    // Define and provide a valid timestamp for the disaster
    const timestamp = new Date();

    // Update disaster Info
    const updatedDisaster = await Disaster.findByIdAndUpdate(
      id,
      {
        typeOfDisaster: typeOfDisaster || oldDisaster.typeOfDisaster,
        timestamp: timestamp || oldDisaster.timestamp,
        contact: contact || oldDisaster.contact,
        description: description || oldDisaster.description,
        $addToSet: { agencies: agencyId }, // Add the new agency ID to the list
        status: status || oldDisaster.status,
        severity: severity || oldDisaster.severity,
        location: swappedCoordinates || oldDisaster.location,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Disaster Info updated",
      updatedDisaster,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch a disaster
export const getDisaster = async (req, res) => {
  const { id } = req.params;
  try {
    const disaster = await Disaster.findById(id);
    if (!disaster) {
      return res.status(404).json({ error: "NO record found" });
    }
    res.status(200).json({ success: true, disaster });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch multiple disasters
export const fetchDisasters = async (req, res) => {
  try {
    const filter = filterResults(req.query);
    const disasters = await Disaster.find(filter).sort({ timestamp: -1 });

    res.status(200).json({ success: true, disasters });
  } catch (error) {
    res.status(500).json({ error: "Internal server Error" });
  }
};
