const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    organization: {
      type: String,
      required: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    fromTime: {
      type: String,
      required: true,
    },
    toTime: {
      type: String,
      required: true,
    },
    financialContribution: {
      type: Number,
      required: true,
    },
    totalDonation: {
      type: Number,
      required: true,
      default: 0
    },
    toolsSupply: {
      type: String,
    },
    images: {
      type: String,
    },
    status: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
