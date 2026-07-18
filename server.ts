import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON request bodies
  app.use(express.json());

  // Lazy-loaded safe Gemini SDK client
  let aiInstance: GoogleGenAI | null = null;
  function getAI() {
    if (!aiInstance) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not defined in the environment. Please add it via Settings > Secrets.");
      }
      aiInstance = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiInstance;
  }

  // API endpoint to generate high-quality copywriting for portfolio projects
  app.post("/api/generate-copy", async (req, res) => {
    try {
      const { projectTitle, category, keywords } = req.body;
      if (!projectTitle) {
        return res.status(400).json({ error: "El título del proyecto es obligatorio." });
      }

      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Eres un redactor profesional de textos publicitarios y especialista en marketing para portafolios creativos (arquitectura, fotografía, diseño y producción audiovisual). 
Escribe una descripción cautivadora, sofisticada y profesional de un solo párrafo (máximo 120 palabras) en español para este proyecto:
- Título: "${projectTitle}"
- Clasificación de Galería/Carrusel: "${category}"
- Palabras Clave o Contexto: "${keywords || "No especificado"}"

Devuelve únicamente la descripción del proyecto redactada. No agregues preámbulos, explicaciones, ni comillas iniciales o finales.`,
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Gemini copywriter API error:", err);
      res.status(500).json({ error: err.message || "Error al comunicarse con la Inteligencia Artificial." });
    }
  });

  // Vite middleware setup for dynamic development vs. static assets in production
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
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start full-stack server:", err);
});
