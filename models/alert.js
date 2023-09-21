const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const alertSchema = new Schema({
  senderAgency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency',
    required: true,
  },
  recipientAgency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency',
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
  },
});

const Alert = mongoose.model('Alert', alertSchema);
module.exports = Alert;
