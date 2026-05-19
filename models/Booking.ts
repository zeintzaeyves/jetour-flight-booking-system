import mongoose, { Schema, models } from "mongoose";

const BookingSchema = new Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    flightNo: {
      type: String,
      required: true,
      trim: true,
    },

    flightId: {
      type: Schema.Types.ObjectId,
      ref: "Flight",
      required: false,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    passengers: {
      type: Number,
      required: true,
      default: 1,
    },

    classType: {
      type: String,
      enum: ["Economy", "Premium Economy", "Business"],
      default: "Economy",
    },

    seatPreference: {
      type: String,
      enum: ["Window seat", "Aisle seat", "Middle seat", "Any available seat"],
      default: "Window seat",
    },

    specialRequest: {
      type: String,
      default: "",
      trim: true,
    },

    route: {
      type: String,
      required: true,
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

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Booking = models.Booking || mongoose.model("Booking", BookingSchema);

export default Booking;