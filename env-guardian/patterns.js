export const patterns = {
  openai: /sk-[a-zA-Z0-9]{20,}/g,
  database: /ghp_[a-zA-Z0-9]{20,}/g,
  stripe: /sk_live_[a-zA-Z0-9]+/g,
  groq: /gsk_[a-zA-Z0-9]{20,}/g,
  gemini: /AIza[0-9A-Za-z_-]{35}/g,
};
