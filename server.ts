import express from "express";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import sharp from "sharp";

const app = express();
const PORT = 3000;

app.use(cors());

// Ensure public directory exists
const publicDir = path.join(process.cwd(), "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Configure Multer for file uploads using memory storage
const storage = multer.memoryStorage();
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
app.post("/api/upload", upload.single("image"), async (req, res) => {
  console.log("Upload route hit!", req.file ? "File received" : "No file", req.body);
  if (!req.file) {
    console.error("No file uploaded!");
    return res.status(400).json({ error: "No file uploaded" });
  }
  
  try {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `img-${uniqueSuffix}.webp`;
    const filepath = path.join(publicDir, filename);
    
    await sharp(req.file.buffer)
      .webp({ quality: 80 })
      .toFile(filepath);
      
    console.log("File uploaded and converted to webp successfully:", filename);
    // Return the public URL path
    res.json({ url: `/${filename}` });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Failed to process image" });
  }
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
