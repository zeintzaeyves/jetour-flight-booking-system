/** Trim, drop control characters and cap length. Applied to every string that reaches the model. */
export function cleanText(input: string, max: number): string {
  return input
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

/** First JSON object in a model reply (models sometimes wrap it in prose or code fences). */
export function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return undefined;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return undefined;
  }
}

/** Logging aid only. The real defences are structural (no write tools, validated outputs). */
export function looksLikeInjection(text: string): boolean {
  return /(ignore|disregard|forget)\s+(all\s+|any\s+|the\s+|your\s+)*(previous|prior|above|earlier)?\s*(instructions|rules|prompt)|system prompt|you are now|developer mode|reveal your (instructions|prompt)/i.test(
    text
  );
}
