import { filterResults } from "../Utils/filterDisaster.js";
import Disaster from "../models/disaster.js";

// Adding new Disaster
export const addDisaster = async (req, res) => {
  const { typeOfDisaster, timestamp, location, description, agencies } = req.body;
  if (!typeOfDisaster || !timestamp || !location || !description || !agencies) {
    return res
      .status(404)
      .json({ success: false, message: "All the fields are mandatory" });
  }
  try {
    const newDisaster = await Disaster.create({
      typeOfDisaster,
      timestamp,
      location,
      description,
      agencies,
    });
    res.status(201).json({ success: true, message: "New Disaster info added",newDisaster });
  } catch (error) {
    res.status(500).json({ error: "Failed to create disaster record" });
  }
};

// Update Disaster Info
export const updateDisaster = async (req, res) => {
  const { id } = req.params;
  const { typeOfDisaster, timestamp, location, description, agencies } = req.body;
  try {
    // Fetching Old disaster
    const oldDisaster = await findById(id);

    if(!oldDisaster){
      return res.status(404).json({success:false,message:'No record found'})
    }

    // Updating disaster Info
    const updatedDisaster = await Disaster.findByIdAndUpdate( id,
      {
        typeOfDisaster: typeOfDisaster || oldDisaster.typeOfDisaster,
        timestamp: timestamp || oldDisaster.timestamp,
        location: location || oldDisaster.location,
        description: description || oldDisaster.description,
        agencies: agencies || oldDisaster.agencies,
      }, { new: true,}
    );

    res.status(200).json({success:true,message:'Disaster Info updated',updatedDisaster})
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
    res.status(200).json({success:true,disaster});
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch multiple disasters
export const fetchDisasters = async (req, res) => {

  try {
    const filter = filterResults(req.query)
    const disasters = await Disaster.find(filter).sort({ timestamp: -1 });

    res.status(200).json({success:true,disasters});
  } catch (error) {
    res.status(500).json({ error: "Internal server Error" });
  }
};
