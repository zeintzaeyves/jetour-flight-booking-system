import dns from "node:dns";

import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

// Some home routers / ISPs / local DNS proxies refuse the SRV lookups that
// `mongodb+srv://` needs ("querySrv ECONNREFUSED"). Opt in to public resolvers with
// MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1 . Unset = Node's normal DNS (what hosting uses).
let dnsConfigured = false;
function configureDns() {
  if (dnsConfigured) return;
  dnsConfigured = true;
  const servers = process.env.MONGODB_DNS_SERVERS?.split(",").map((s) => s.trim()).filter(Boolean);
  if (servers?.length) {
    // Node keeps separate server lists for the callback and promise DNS APIs, and the
    // MongoDB driver uses the promise one, so both must be set.
    dns.setServers(servers);
    dns.promises.setServers(servers);
  }
}

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in your .env.local file");
  }

  if (cached.conn) {
    return cached.conn;
  }

  configureDns();

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "jetour",
      bufferCommands: false,
      // Fail fast instead of hanging a request for the 30s default.
      serverSelectionTimeoutMS: 8000,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Don't cache a failed attempt, or every later request would fail too.
    cached.promise = null;
    throw error;
  }
  return cached.conn;
}
