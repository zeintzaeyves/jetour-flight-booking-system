import mongoose, { Schema, models } from "mongoose";

const FlightSchema = new Schema(
  {
    flightNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    airline: {
      type: String,
      required: true,
      trim: true,
      default: "Jetour Airways",
    },

    origin: {
      type: String,
      required: true,
      trim: true,
    },

    destination: {
      type: String,
      required: true,
      trim: true,
    },

    originCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    destinationCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    departureDate: {
      type: String,
      required: true,
    },

    departureTime: {
      type: String,
      required: true,
    },

    arrivalTime: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    classType: {
      type: String,
      enum: ["Economy", "Premium Economy", "Business"],
      default: "Economy",
    },

    baggage: {
      type: String,
      default: "20kg",
    },

    price: {
      type: Number,
      required: true,
    },

    availableSeats: {
      type: Number,
      required: true,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Scheduled", "Delayed", "Cancelled", "Completed"],
      default: "Scheduled",
    },

    tag: {
      type: String,
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

const Flight = models.Flight || mongoose.model("Flight", FlightSchema);

export default Flight;