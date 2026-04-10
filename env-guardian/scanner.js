import { patterns } from "./patterns.js";

export function scanObject(obj) {
  const results = [];

  for (const [key, value] of Object.entries(obj)) {
    if (!value) continue;

    for (const [service, regex] of Object.entries(patterns)) {
      if (regex.test(value)) {
        results.push({
          key,
          value,
          service,
          source: "env"
        });
      }
    }
  }

  return results;
}

export function scanText(text) {
  const results = [];

  for (const [service, regex] of Object.entries(patterns)) {
    const matches = text.match(regex);
    if (matches) {
      matches.forEach(m => {
        results.push({
          key: "unknown",
          value: m,
          service,
          source: "github"
        });
      });
    }
  }

  return results;
}