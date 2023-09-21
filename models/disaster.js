import mongoose from "mongoose";

const disasterSchema=new mongoose.Schema({
  typeOfDisaster: {
    type: String,
    required: true,
    minlenght:3
  },
  timestamp: {
    type: Date,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
  },
  description: {
    type: String,
    default:'No discription available'
  },
  agencies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
    },
  ],
});

export default mongoose.model("Disasters",disasterSchema)