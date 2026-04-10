#!/usr/bin/env node

import chalk from "chalk";
import ora from "ora";
import boxen from "boxen";
import dotenv from "dotenv";
import figlet from "figlet";
import gradient from "gradient-string";
import Table from "cli-table3";
import { scanObject, scanText } from "./scanner.js";
import { validateKey } from "./validator.js";
import { searchGitHub } from "./github.js";

dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function run() {
  console.log(
    gradient.pastel.multiline(
      figlet.textSync("VoxGuard", { horizontalLayout: "full" }),
    ),
  );
  console.log(
    boxen("🔐 Advanced Environment Secrets Scanner & AI Validator", {
      padding: 1,
      margin: 1,
      borderStyle: "double",
      borderColor: "blueBright",
      align: "center",
    }),
  );

  // 🔍 Scan ENV
  const spinner = ora({
    text: "Scanning local environment...",
    color: "cyan",
  }).start();
  const envResults = scanObject(process.env);
  spinner.succeed(chalk.green("Env scan complete"));

  // 🌐 GitHub Search
  const ghSpinner = ora({
    text: "Searching GitHub continuously...",
    color: "magenta",
  }).start();

  let githubResults = [];
  if (GITHUB_TOKEN) {
    const queries = ["OPENAI_API_KEY", "GEMINI_API_KEY", "sk-"];
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];

    const items = await searchGitHub(randomQuery, GITHUB_TOKEN);

    let processedCount = 0;
    for (const item of items) {
      if (processedCount >= 100) break; // Limit to 100 randomly

      try {
        const file = await fetch(item.url, {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3.raw",
          },
        }).then((r) => r.text());

        githubResults.push(...scanText(file));
        ghSpinner.text = `Scanned ${processedCount}/100 GitHub files...`;
      } catch (err) {
        // Skip failed fetches
      }
    }
  }

  ghSpinner.succeed(
    chalk.green(`GitHub scan complete (${githubResults.length} secrets found)`),
  );

  const all = [...envResults, ...githubResults];

  if (all.length === 0) {
    console.log(
      chalk.yellow("\n⚠️  No potential secrets found to validate.\n"),
    );
    return;
  }

  // 🔐 Validate
  const valSpinner = ora({
    text: `Validating ${all.length} keys...`,
    color: "yellow",
  }).start();

  let validatedCount = 0;
  for (let r of all) {
    r.valid = await validateKey(r.service, r.value);
    validatedCount++;
    valSpinner.text = `Validating keys: ${validatedCount}/${all.length} done`;
  }

  valSpinner.succeed(chalk.green("Validation done"));

  // 🎨 Formatted Table Output
  let valid = 0,
    invalid = 0,
    unknown = 0;

  const table = new Table({
    head: [
      chalk.bold.cyan("Status"),
      chalk.bold.cyan("Service"),
      chalk.bold.cyan("Source"),
      chalk.bold.cyan("Key/Context"),
      chalk.bold.cyan("Value (Masked)"),
    ],
    style: { head: [], border: [] },
    chars: {
      top: "═",
      "top-mid": "╤",
      "top-left": "╔",
      "top-right": "╗",
      bottom: "═",
      "bottom-mid": "╧",
      "bottom-left": "╚",
      "bottom-right": "╝",
      left: "║",
      "left-mid": "╟",
      mid: "─",
      "mid-mid": "┼",
      right: "║",
      "right-mid": "╢",
      middle: "│",
    },
  });

  all.forEach((r) => {
    let status;

    if (r.valid === true) {
      status = chalk.green("✔ VALID");
      valid++;
    } else if (r.valid === false) {
      status = chalk.red("✖ REVOKED");
      invalid++;
    } else {
      status = chalk.yellow("⚠ UNKNOWN");
      unknown++;
    }

    const masked = r.value.slice(0, 8) + "..." + r.value.slice(-4);

    table.push([
      status,
      chalk.magenta(r.service),
      chalk.blue(r.source),
      chalk.gray(r.key.substring(0, 15)),
      chalk.white(masked),
    ]);
  });

  console.log("\n" + table.toString() + "\n");

  // Summary box
  console.log(
    boxen(
      ` ${chalk.green(`✔ ${valid} Valid`)}  |  ${chalk.red(`✖ ${invalid} Invalid`)}  |  ${chalk.yellow(`⚠ ${unknown} Unknown`)} `,
      {
        padding: 1,
        margin: { bottom: 1 },
        borderStyle: "round",
        borderColor: "magenta",
        title: "Scan Summary",
        titleAlignment: "center",
      },
    ),
  );
}

run();
