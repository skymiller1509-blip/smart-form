import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildForm, renderForm } from "./rules.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "public");
const PORT = process.env.PORT || 4196;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
};

function send(res, status, body, type = "text/html; charset=utf-8") {
  res.writeHead(status, { "content-type": type });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === "POST" && url.pathname === "/api/build") {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", async () => {
      try {
        const { prompt } = JSON.parse(raw || "{}");
        if (!prompt || !String(prompt).trim()) {
          return send(res, 400, JSON.stringify({ error: "Type a prompt first." }), MIME[".json"]);
        }
        const form = buildForm(prompt);
        const { html, jsx, diagnostics } = await renderForm(form);
        send(res, 200, JSON.stringify({ form, html, jsx, diagnostics }), MIME[".json"]);
      } catch (err) {
        console.error(err);
        send(res, 500, JSON.stringify({ error: "Could not build the form: " + err.message }), MIME[".json"]);
      }
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/samples") {
    return send(res, 200, JSON.stringify({
      samples: [
        "book a table for Friday night",
        "sign up for the newsletter",
        "report a bug in the app",
        "apply for a job",
        "give feedback on the new design",
        "contact the support team",
      ],
    }), MIME[".json"]);
  }

  // Static files from public/
  let file = url.pathname === "/" ? "/index.html" : url.pathname;
  const full = path.join(PUBLIC, decodeURIComponent(file));
  if (!full.startsWith(PUBLIC) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) {
    return send(res, 404, "Not found", "text/plain");
  }
  send(res, 200, fs.readFileSync(full), MIME[path.extname(full)] || "application/octet-stream");
});

server.listen(PORT, () => console.log(`smart-form on http://localhost:${PORT}`));
