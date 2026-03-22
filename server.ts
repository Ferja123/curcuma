import express from "express";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());

// Ensure public directory exists
const publicDir = path.join(process.cwd(), "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, publicDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "img-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use(express.json());

const dataFile = path.join(process.cwd(), "data.json");

// API Route for getting persisted data
app.get("/api/data", (req, res) => {
  if (fs.existsSync(dataFile)) {
    try {
      const data = fs.readFileSync(dataFile, "utf-8");
      res.json(JSON.parse(data));
    } catch (e) {
      res.json({});
    }
  } else {
    res.json({});
  }
});

// API Route for saving persisted data
app.post("/api/data", (req, res) => {
  try {
    const currentData = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, "utf-8")) : {};
    const newData = { ...currentData, ...req.body };
    fs.writeFileSync(dataFile, JSON.stringify(newData, null, 2));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to save data" });
  }
});

// API Route for uploading images
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  // Return the public URL path
  res.json({ url: `/${req.file.filename}` });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(publicDir)); // Serve uploaded files
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
