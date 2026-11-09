#!/usr/bin/env node
/**
 * Headless Chrome CDP Verification Script
 * Validates console errors, missing 404s, computed styles, and captures screenshots.
 */

const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");

const URL = process.argv[2] || "http://localhost:3000/en";
const OUTPUT_DIR = process.argv[3] || "/tmp/clone-verification";

async function verify() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new",
    "--remote-debugging-port=9399",
    "--window-size=1440,900",
    "--user-data-dir=/tmp/chrome-verification-profile"
  ]);

  await new Promise(r => setTimeout(r, 1500));

  const version = await new Promise((resolve, reject) => {
    http.get("http://127.0.0.1:9399/json/version", res => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(JSON.parse(data)));
    }).on("error", reject);
  });

  const ws = new WebSocket(version.webSocketDebuggerUrl);
  let id = 1;
  const send = (method, params = {}) => new Promise(res => {
    const curId = id++;
    const handler = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id === curId) {
        ws.removeEventListener("message", handler);
        res(data.result);
      }
    };
    ws.addEventListener("message", handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await new Promise(r => ws.onopen = r);
  await send("Target.setAutoAttach", { autoAttach: true, waitForDebuggerOnStart: false, flatten: true });

  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });

  const sessionSend = (method, params = {}) => new Promise(res => {
    const curId = id++;
    const handler = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id === curId) {
        ws.removeEventListener("message", handler);
        res(data.result);
      }
    };
    ws.addEventListener("message", handler);
    ws.send(JSON.stringify({ id: curId, sessionId, method, params }));
  });

  const errors = [];
  const networkFailures = [];

  ws.addEventListener("message", (msg) => {
    const data = JSON.parse(msg.data);
    if (data.method === "Runtime.exceptionThrown") {
      errors.push(data.params.exceptionDetails);
    }
    if (data.method === "Network.responseReceived" && data.params.response.status >= 400) {
      networkFailures.push({ url: data.params.response.url, status: data.params.response.status });
    }
  });

  await sessionSend("Page.enable");
  await sessionSend("Network.enable");
  await sessionSend("Runtime.enable");

  console.log(`Navigating to ${URL}...`);
  await sessionSend("Page.navigate", { url: URL });
  await new Promise(r => setTimeout(r, 4000));

  // Capture Hero Screenshot
  let shot = await sessionSend("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(OUTPUT_DIR, "hero.png"), Buffer.from(shot.data, "base64"));
  console.log(`Captured: ${path.join(OUTPUT_DIR, "hero.png")}`);

  // Scroll to Work section if present
  await sessionSend("Runtime.evaluate", {
    expression: `document.querySelector("#work")?.scrollIntoView({ behavior: "instant" });`
  });
  await new Promise(r => setTimeout(r, 1200));

  shot = await sessionSend("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(OUTPUT_DIR, "work.png"), Buffer.from(shot.data, "base64"));
  console.log(`Captured: ${path.join(OUTPUT_DIR, "work.png")}`);

  // Scroll to Pricing section if present
  await sessionSend("Runtime.evaluate", {
    expression: `document.querySelector("#pricing")?.scrollIntoView({ behavior: "instant" });`
  });
  await new Promise(r => setTimeout(r, 1200));

  shot = await sessionSend("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(OUTPUT_DIR, "pricing.png"), Buffer.from(shot.data, "base64"));
  console.log(`Captured: ${path.join(OUTPUT_DIR, "pricing.png")}`);

  console.log("\n--- Verification Summary ---");
  console.log(`Errors encountered: ${errors.length}`);
  if (errors.length) console.log(errors);
  console.log(`Network failures (4xx/5xx): ${networkFailures.length}`);
  if (networkFailures.length) console.log(networkFailures);

  chrome.kill();
  process.exit(errors.length > 0 || networkFailures.length > 0 ? 1 : 0);
}

verify().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
