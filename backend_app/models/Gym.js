const mongoose = require("mongoose");
const gymSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    currentTime: {
      type: String,
      default: Date.now,
    },
    sqft: {
      type: String,
      required: false,
    },
    totalCapacity: {
      type: String,
      required: true,
    },
    hours: {
      type: Object,
      required: true,
    },
    versionKey: false,
  },
  { collection: "gyms" }
);

const Gym = mongoose.model("Gym", gymSchema);

module.exports = Gym;
