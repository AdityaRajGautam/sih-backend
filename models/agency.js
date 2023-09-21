const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const agencySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  contact: {
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      postalCode: {
        type: String,
      },
      country: {
        type: String,
      },
    },
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
  expertise: {
    type: [String],
  },
  lastReportedActivity: { // Add this field
    type: Date,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

const Agency = mongoose.model("Agency", agencySchema);

module.exports = Agency;