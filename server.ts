import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, GenerateVideosOperation } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Setup body parsers for base64 image uploads
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ limit: "25mb", extended: true }));

  // API Check / Health Route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Start Video Generation
  app.post("/api/generate-video", async (req: express.Request, res: express.Response) => {
    try {
      const { image, prompt, aspectRatio, resolution, model } = req.body;

      if (!image) {
        res.status(400).json({ error: "Missing image data" });
        return;
      }

      // Extract MIME type and base64 string
      const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      let mimeType = "image/png";
      let base64Data = image;

      if (matches && matches.length === 3) {
        mimeType = matches[1];
        base64Data = matches[2];
      }

      console.log(`Starting video generation using model: ${model || "veo-3.1-fast-generate-preview"}`);
      console.log(`MimeType: ${mimeType}, AspectRatio: ${aspectRatio || "16:9"}, Resolution: ${resolution || "720p"}`);

      // We use the specified model, fallback to veo-3.1-fast-generate-preview
      const targetModel = model || "veo-3.1-fast-generate-preview";

      const operation = await ai.models.generateVideos({
        model: targetModel,
        prompt: prompt || "Transform this image into a subtle cinematic movie",
        image: {
          imageBytes: base64Data,
          mimeType: mimeType,
        },
        config: {
          numberOfVideos: 1,
          resolution: resolution || "720p",
          aspectRatio: aspectRatio || "16:9",
        },
      });

      console.log(`Operation created: ${operation.name}`);
      res.json({ operationName: operation.name });
    } catch (error: any) {
      console.error("Error generating video:", error);
      res.status(500).json({ error: error.message || "Failed to generate video" });
    }
  });

  // Poll Operation Status
  app.post("/api/video-status", async (req: express.Request, res: express.Response) => {
    try {
      const { operationName } = req.body;
      if (!operationName) {
        res.status(400).json({ error: "Missing operationName" });
        return;
      }

      const op = new GenerateVideosOperation();
      op.name = operationName;

      const updated = await ai.operations.getVideosOperation({ operation: op });
      
      // Send back status details
      res.json({
        done: updated.done,
        error: updated.error,
        metadata: updated.metadata,
        hasVideo: !!(updated.response?.generatedVideos?.[0]?.video?.uri),
      });
    } catch (error: any) {
      console.error("Error checking video status:", error);
      res.status(500).json({ error: error.message || "Failed to check video status" });
    }
  });

  // Streaming Proxy for Finished Video
  app.get("/api/video-download", async (req: express.Request, res: express.Response) => {
    try {
      const operationName = req.query.operationName as string;
      if (!operationName) {
        res.status(400).send("Missing operationName parameter");
        return;
      }

      const op = new GenerateVideosOperation();
      op.name = operationName;

      console.log(`Downloading video for operation: ${operationName}`);
      const updated = await ai.operations.getVideosOperation({ operation: op });
      
      if (!updated.done) {
        res.status(400).send("Operation is not complete yet");
        return;
      }

      const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
      if (!uri) {
        res.status(404).send("No video URI found in completed operation");
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.status(500).send("Gemini API key is not configured on the server");
        return;
      }

      console.log(`Streaming video from upstream: ${uri}`);
      const videoRes = await fetch(uri, {
        headers: { "x-goog-api-key": apiKey },
      });

      if (!videoRes.ok) {
        res.status(videoRes.status).send(`Failed to fetch video from Google: ${videoRes.statusText}`);
        return;
      }

      res.setHeader("Content-Type", "video/mp4");
      const contentLength = videoRes.headers.get("content-length");
      if (contentLength) {
        res.setHeader("Content-Length", contentLength);
      }

      // Stream body chunks to Express response
      const reader = videoRes.body?.getReader();
      if (!reader) {
        res.status(500).send("Unable to read video stream body");
        return;
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    } catch (error: any) {
      console.error("Error downloading video stream:", error);
      res.status(500).send(error.message || "Failed to stream video");
    }
  });

  // Serve static UI assets or delegate to Vite in dev
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cinematic Animator server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
