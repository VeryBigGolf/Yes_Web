const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const path = require("path");
const dotenv = require("dotenv");
const { loadCsv, getColumns, getSeries } = require("./csv");
const { groqChat } = require("./chat");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const loaded = loadCsv(); // load on boot
console.log(loaded.ok ? `[CSV] Loaded: ${loaded.path}` : "[CSV] Demo data mode");

app.get("/api/parameters", (_, res) => {
  return res.json(getColumns());
});

app.get("/api/data", (req, res) => {
  const feature = String(req.query.feature || "");
  const range = String(req.query.range || "1h");
  if (!feature) return res.status(400).json({ error: "feature is required" });
  return res.json(getSeries(feature, range));
});

app.get("/api/suggestions", (_, res) => {
  // simple mock
  res.json([
    {
      id: "sug-001",
      title: "Increase TOTAL AIR FLOW by 3%",
      reason: "O2 trending low; raising air improves combustion margin.",
      feature: "TOTAL AIR FLOW ACTUAL",
      delta: "+3%",
      priority: "high",
      confidence: 0.78,
    },
  ]);
});

// Chat with GROQ
app.post("/api/chat", async (req, res) => {
  const msg = String(req.body?.message ?? "");
  const out = await groqChat(msg, process.env.GROQ_API_KEY);
  res.json(out);
});

// Serve built front-end in prod
const DIST_DIR = path.resolve(process.cwd(), "dist");
app.use(express.static(DIST_DIR));
app.get("*", (_, res) => res.sendFile(path.join(DIST_DIR, "index.html")));

// Socket.IO ticks (mock)
function randomStep(v, amp = 1.5) {
  return v + (Math.random() - 0.5) * amp;
}
io.on("connection", (socket) => {
  // emit random ticks for the current selected feature name provided by client
  let feature = "MAIN STEAM PRESSURE";
  let v = 50;
  socket.on("selectFeature", (name) => { feature = name; });
  const timer = setInterval(() => {
    v = randomStep(v);
    socket.emit("tick", { feature, t: new Date().toISOString(), v });
  }, 2000 + Math.random() * 2000);
  socket.on("disconnect", () => clearInterval(timer));
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
