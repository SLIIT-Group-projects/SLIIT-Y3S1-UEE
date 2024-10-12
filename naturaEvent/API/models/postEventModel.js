const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  organization: { type: String, required: true },
  eventName: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  fromTime: { type: String, required: true },
  toTime: { type: String, required: true },
  totalDonation:{type:Number,required:true},
  financialContribution: { type: Number, required: true },
  toolsSupplies: { type: String, required: true },
  images: { type: [String], deafult: '' }, // Array of image URLs
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
