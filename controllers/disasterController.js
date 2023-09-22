import { filterResults } from "../Utils/filterDisaster.js";
import Disaster from "../models/disaster.js";
import axios from "axios";

// Adding new Disaster
export const addDisaster = async (req, res) => {
  const {
    typeOfDisaster,
    timestamp,
    address,
    description,
    agencies,
    contact,
    status,
    severity,
  } = req.body;
  if (
    !typeOfDisaster ||
    !timestamp ||
    !address ||
    !description ||
    !agencies ||
    !contact ||
    !status ||
    !severity
  ) {
    return res
      .status(404)
      .json({ success: false, message: "All the fields are mandatory" });
  }
  try {
    const addressFormat = `${contact.address.street}, ${contact.address.city}, ${contact.address.state}, ${contact.address.postalCode}, ${contact.address.country}`;
    const geocodingResponse = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        addressFormat
      )}.json?access_token=${process.env.MAPBOX_API_KEY}`
    );

    const features = geocodingResponse.data.features;
    if (!features || features.length === 0) {
      return res.status(400).json({ message: "Invalid address" });
    }
    const { lat, lng } = features[0].geometry.location;

    const newDisaster = await Disaster.create({
      typeOfDisaster,
      timestamp,
      address,
      description,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
      agencies,
      status,
      severity,
    });

    res
      .status(201)
      .json({ success: true, message: "New Disaster info added", newDisaster });
  } catch (error) {
    res.status(500).json({ error: "Failed to create disaster record" });
  }
};

// Update Disaster Info
export const updateDisaster = async (req, res) => {
  const { id } = req.params;
  const {
    typeOfDisaster,
    timestamp,
    address,
    description,
    agencies,
    contact,
    status,
    severity,
  } = req.body;
  try {
    // Fetching Old disaster
    const oldDisaster = await findById(id);

    if (!oldDisaster) {
      return res
        .status(404)
        .json({ success: false, message: "No record found" });
    }

    // Converting to Co-Ordinates
    if (contact) {
      const addressFormat = `${contact.address.street}, ${contact.address.city}, ${contact.address.state}, ${contact.address.postalCode}, ${contact.address.country}`;
      const geocodingResponse = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          addressFormat
        )}.json?access_token=${process.env.MAPBOX_API_KEY}`
      );

      const features = geocodingResponse.data.features;
      if (!features || features.length === 0) {
        return res.status(400).json({ message: "Invalid address" });
      }
      const { lat, lng } = features[0].geometry.location;
    }
    // Updating disaster Info
    const updatedDisaster = await Disaster.findByIdAndUpdate(
      id,
      {
        typeOfDisaster: typeOfDisaster || oldDisaster.typeOfDisaster,
        timestamp: timestamp || oldDisaster.timestamp,
        address: address || oldDisaster.address,
        description: description || oldDisaster.description,
        agencies: agencies || oldDisaster.agencies,
        status: status || oldDisaster.status,
        severity: severity || oldDisaster.severity,
        location: location || oldDisaster.location,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Disaster Info updated",
      updatedDisaster,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server Errror" });
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
