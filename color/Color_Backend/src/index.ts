import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import * as dotenv from "dotenv";
import { userApi } from "./api/user_api";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { db } from "./db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../.env") });

const API_KEY = process.env.X_API_KEY || "your-api-key";
const CORS_ALLOWED_ORIGINS = process.env.CORS_ALLOWED_ORIGINS || "http://localhost:4200";

const app = new Elysia()
  .use(
    cors({
      origin: CORS_ALLOWED_ORIGINS.split(","),
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
    })
  )
  .use(
    swagger({
      path: "/w",
      documentation: {
        info: {
          title: "color API",
          version: "1.0.0",
          description: "A modern web application API built with ElysiaJS",
        },
        tags: [
          { name: "Users", description: "User management endpoints" },
          { name: "Health", description: "Health check endpoints" },
        ],
      },
    })
  )
  .get("/health", () => ({ status: "ok", timestamp: new Date().toISOString() }), {
    detail: {
      tags: ["Health"],
      summary: "Health check endpoint",
      description: "Check if API is running and healthy",
    },
  })
  .group("/api", (app) =>
    app
      .onBeforeHandle(({ headers, set }) => {
        const apiKey = headers["x-api-key"];
        if (!apiKey || apiKey !== API_KEY) {
          set.status = 401;
          return { error: "Unauthorized: Invalid or missing API key" };
        }
      })
      .use(userApi)
  )
  .get("/", () => `Hello Elysia color`)
  .listen(4100);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
console.log(`🦊 CORS allowed origins: ${CORS_ALLOWED_ORIGINS}`);
console.log(`🦊 Swagger docs available at ${app.server?.hostname}:${app.server?.port}/w`);

export type App = typeof app;
