const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resourceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  location: { // where the resource is stored or available
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
  },
  ownerAgency: {
    type: Schema.Types.ObjectId,
    ref: 'Agency',
    required: true,
  },
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
