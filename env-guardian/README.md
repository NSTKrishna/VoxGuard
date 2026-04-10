# 🔐 VoxGuard: Env Guardian

**Advanced Environment Secrets Scanner & AI Validator**

VoxGuard's `env-guardian` is a powerful, visually stunning CLI tool designed to scan your local environment variables and actively search GitHub for leaked API keys (OpenAI, Gemini, Groq, Stripe, etc.). It goes a step further by **validating** the discovered keys against live AI provider endpoints to tell you exactly which keys are still active and which have been revoked.

## ✨ Features

- **Local Local Scan**: Analyzes your current `.env` configuration for sensitive keys.
- **Continuous GitHub Scanning**: Searches random public GitHub repositories for leaked secrets (up to 100 files per run).
- **Live AI Validation**: Tests OpenAI, Groq, and Gemini keys against their respective endpoints to determine validity.
- **Beautiful CLI UI**: Powered by `figlet`, `gradient-string`, `cli-table3`, and `boxen` for a visually rich, tabular reporting interface.

## 🚀 Installation

1. Clone the repository and navigate to the directory:
   ```bash
   cd /path/to/VoxGuard/env-guardian
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## ⚙️ Configuration

Create a `.env` file in the root of the `env-guardian` folder to power the GitHub scanner and provide local test keys.

```env
# Required: Your GitHub Personal Access Token for scanning public repos
GITHUB_TOKEN=ghp_YOUR_GITHUB_TOKEN

# Optional: Add keys here to test local environment scanning
OPENAI_API_KEY=sk-xxxx...
GEMINI_API_KEY=AIzaxxxx...
```

## 💻 Usage

Run the scanner using Node.js:

```bash
node index.js
```

### Example Output

```text
 __     __                  ____                              _ 
 \ \   / /   ___   __  __  / ___|  _   _    __ _   _ __    __| |
  \ \ / /   / _ \  \ \/ / | |  _  | | | |  / _` | | '__|  / _` |
   \ V /   | (_) |  >  <  | |_| | | |_| | | (_| | | |    | (_| |
    \_/     \___/  /_/\_\  \____|  \__,_|  \__,_| |_|     \__,_|
                                                                
   ╔════════════════════════════════════════════════════════════╗
   ║                                                            ║
   ║   🔐 Advanced Environment Secrets Scanner & AI Validator   ║
   ║                                                            ║
   ╚════════════════════════════════════════════════════════════╝

✔ Env scan complete
✔ GitHub scan complete (6 secrets found)
✔ Validation done

╔═══════════╤═════════╤════════╤═════════════╤═════════════════╗
║ Status    │ Service │ Source │ Key/Context │ Value (Masked)  ║
╟───────────┼─────────┼────────┼─────────────┼─────────────────╢
║ ✖ REVOKED │ openai  │ github │ unknown     │ sk-xxxxx...xxxx ║
║ ✔ VALID   │ gemini  │ env    │ GEMINI_API  │ AIzaSyAL...d1F8 ║
╚═══════════╧═════════╧════════╧═════════════╧═════════════════╝

╭─────────────────── Scan Summary ───────────────────╮
│                                                    │
│    ✔ 1 Valid  |  ✖ 1 Invalid  |  ⚠ 0 Unknown       │
│                                                    │
╰────────────────────────────────────────────────────╯
```

## 🛠️ Supported Integrations
- [OpenAI](https://openai.com/)
- [Gemini](https://deepmind.google/technologies/gemini/)
- [Groq AI](https://groq.com/)
- [GitHub PATs](https://github.com/)
- [Stripe](https://stripe.com/)

---
*Disclaimer: This tool is intended for educational and security research purposes. Ensure you have authorization before performing broad scans.*
