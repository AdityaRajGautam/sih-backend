const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const disasterSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
  },
  description: {
    type: String,
  },
  agencies: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Agency',
    },
  ],
});

const Disaster = mongoose.model('Disaster', disasterSchema);

module.exports = Disaster;
