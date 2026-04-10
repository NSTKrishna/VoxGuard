import axios from "axios";

export async function validateKey(service, key) {
  try {
    if (service === "openai" || key.startsWith("sk-")) {
      const res = await axios.get("https://api.openai.com/v1/models", {
        headers: { Authorization: `Bearer ${key}` },
      });
      return res.status === 200;
    }

    if (service === "groq" || key.startsWith("gsk_")) {
      const res = await axios.get("https://api.groq.com/openai/v1/models", {
        headers: { Authorization: `Bearer ${key}` },
      });
      return res.status === 200;
    }

    if (service === "gemini") {
      const res = await axios.get(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`,
      );
      return res.status === 200;
    }

    return null;
  } catch (error) {
    return false;
  }
}
