import { randomInt } from "node:crypto";

// No 0/O/1/I/L to avoid read-aloud mistakes.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** e.g. JT-7K3QX9PM — ~40 bits of entropy. Uniqueness is enforced by a DB index + retry. */
export function generateBookingReference(length = 8): string {
  let out = "";
  for (let i = 0; i < length; i++) out += ALPHABET[randomInt(ALPHABET.length)];
  return `JT-${out}`;
}
