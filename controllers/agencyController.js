const axios = require("axios");
const Agency = require("../models/agency");
const Disaster = require("../models/disaster");
const MAPBOX_API_KEY =
  "pk.eyJ1IjoiaGFyc2hzaW5kaHUwNDA4IiwiYSI6ImNsbXMxbnI3ejA3dzgybG85dHVjZXQ0bHgifQ.n4D40V2mXLsYh5Bjs7H78A";
import { comparePassword, hashPassword } from "../helpers/bcrypt.js";

export const registerAgency = async (req, res) => {
  try {
    const { name, email, password, contact, phoneNumber, expertise } = req.body;
    if (
      !name ||
      !email ||
      !password ||
      !contact ||
      !phoneNumber ||
      !expertise
    ) {
      return res.status(404).send({
        success: false,
        message: "All the fields are required",
      });
    }

    const exixtingAgency = await Agency.findOne({ email });
    if (exixtingAgency) {
      return res.status(400).send({
        success: false,
        message: "User is Already Register please login",
      });
    }

    // Use a geocoding service to convert the complete address to coordinates
    const address = `${contact.address.street}, ${contact.address.city}, ${contact.address.state}, ${contact.address.postalCode}, ${contact.address.country}`;
    const geocodingResponse = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${MAPBOX_API_KEY}`
    );

    const features = geocodingResponse.data.features;

    if (!features || features.length === 0) {
      return res.status(400).json({ message: "Invalid address" });
    }
    const { lat, lng } = results[0].geometry.location;

    const hashedPassword = await hashPassword(password);

    const agency = new Agency({
      name,
      email,
      password: hashedPassword,
      contact,
      phoneNumber,
      location: {
        type: "Point",
        coordinates: [lng, lat], // Longitude and Latitude
      },
      expertise,
    });

    // Save the agency to the database
    await agency.save();

    res.status(201).json({
      success: true,
      message: "Agency registered successfully",
      agency,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error registering agency", error });
  }
};

export const loginAgency = async (req, res) => {
  try {
    const { email, password } = req.body;
    //vaildation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check agency
    const user = await Agency.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "This email is not registered with us",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "Invalid password or email",
      });
    }

    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECERT, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

//forgotpasswordController
export const forgotPasswordController = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User is not logged in" });
    }
    const { email, oldpassword, newpassword } = req.body;
    if (!email || !newpassword) {
      res.status(400).send({ message: "All fields are mandatory" });
    }

    //check
    const user = await Agency.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is invalid",
      });
    }

    const match = await comparePassword(oldpassword, user.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "Enter your old password correctly",
      });
    }

    const hashed = await hashPassword(newpassword);
    await Agency.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

// update agency controller
export const updateAgency = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User is not logged in" });
    }

    const { name, email, contact, phone, expertise } = req.body;
    const agency = await Agency.findById(req.user._id);

    // Check if the agency exists
    if (!agency) {
      return res.status(404).json({ message: "Agency not found" });
    }

    if (req.body.contact) {
      const address = `${contact.address.street}, ${contact.address.city}, ${contact.address.state}, ${contact.address.postalCode}, ${contact.address.country}`;
      const geocodingResponse = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${MAPBOX_API_KEY}`
      );

      const features = geocodingResponse.data.features;

      if (!features || features.length === 0) {
        return res.status(400).json({ message: "Invalid address" });
      }
      const { lat, lng } = results[0].geometry.location;
    }

    const updatedAgency = await Agency.findByIdAndUpdate(
      req.user._id,
      {
        name: name || agency.name,
        email: email || agency.email,
        contact: contact || agency.contact,
        phone: phone || agency.phone,
        location:
          {
            location: {
              type: "Point",
              coordinates: [lng, lat], // Longitude and Latitude
            },
          } || agency.location,
        expertise: expertise || agency.expertise,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      // updatedUser,
    });

    // Update agency location if provided in the request body
    if (req.body.location) {
      if (req.body.location.type === "Point" && req.body.location.coordinates) {
        agency.location = req.body.location;
      } else {
        return res.status(400).json({ message: "Invalid location data" });
      }
    }

    // Save the updated agency to the database
    await agency.save();

    res.status(200).json({ message: "Agency updated successfully", agency });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating agency", error });
  }
};

// get agency controller
export const getAllAgencyLocations = async (req, res) => {
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

    res.status(200).json({
      message: "All agency locations retrieved successfully",
      agencies: agencyLocations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching agency locations", error });
  }
};

export const listAgencies = async (req, res) => {
  try {
    const { typeOfDisaster, resourcesAvailable, latitude, longitude } =
      req.query;
    const agencyQuery = {};

    if (typeOfDisaster) {
      const disaster = await Disaster.findOne({ typeOfDisaster });

      if (disaster) {
        agencyQuery._id = { $in: disaster.agencies };
      }
    }

    if (resourcesAvailable) {
      const matchingResources = await Resource.find({
        name: resourcesAvailable,
      });

      if (matchingResources.length > 0) {
        agencyQuery._id = {
          $in: matchingResources.map((resource) => resource.ownerAgency),
        };
      }
    }

    if (latitude && longitude) {
      agencyQuery.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: 100000,
        },
      };
    }

    const agencies = await Agency.find(agencyQuery);

    res.status(200).json({ message: "Agencies listed successfully", agencies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error listing agencies", error });
  }
};

