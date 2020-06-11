const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema(
  {
    gymId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    currentTime: {
      type: String,
      default: Date.now,
    },
    hour: {
      type: Object,
      required: false,
    },
    versionKey: false,
  },
  { collection: "bookings" }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
