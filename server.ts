import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import submitHandler from "./api/submit.js";
import loginHandler from "./api/admin/login.js";
import submissionsHandler from "./api/admin/submissions.js";
import updateHandler from "./api/admin/update.js";
import deleteHandler from "./api/admin/delete.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes (Simulating Vercel Serverless Functions)
  app.post("/api/submit", (req, res) => submitHandler(req, res));
  app.post("/api/admin/login", (req, res) => loginHandler(req, res));
  app.get("/api/admin/submissions", (req, res) => submissionsHandler(req, res));
  app.patch("/api/admin/update", (req, res) => updateHandler(req, res));
  app.delete("/api/admin/delete", (req, res) => deleteHandler(req, res));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
