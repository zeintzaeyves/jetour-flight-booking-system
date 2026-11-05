import mongoose, { Schema, models } from "mongoose";

// One document per (bucket, window). Documents expire via a TTL index, so the
// collection cleans itself up.
const RateLimitSchema = new Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, required: true, default: 0 },
  expiresAt: { type: Date, required: true },
});

RateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RateLimit = models.RateLimit || mongoose.model("RateLimit", RateLimitSchema);

export default RateLimit;
