// swagger-ui.js
import express from "express";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express router for Swagger
const swaggerRouter = express.Router();

// Load your swagger.json
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, "swagger.json"), "utf8")
);

// Custom CSS for Swagger UI
const customCss = fs.readFileSync(
  path.join(
    __dirname,
    "node_modules",
    "swagger-ui-express",
    "static",
    "swagger-ui.css"
  ),
  "utf8"
);

// Custom JS files for Swagger UI
const swaggerUiBundle = fs.readFileSync(
  path.join(
    __dirname,
    "node_modules",
    "swagger-ui-express",
    "static",
    "swagger-ui-bundle.js"
  ),
  "utf8"
);

const swaggerUiStandalonePreset = fs.readFileSync(
  path.join(
    __dirname,
    "node_modules",
    "swagger-ui-express",
    "static",
    "swagger-ui-standalone-preset.js"
  ),
  "utf8"
);

// Serve the static files manually
swaggerRouter.get("/swagger-ui.css", (req, res) => {
  res.setHeader("Content-Type", "text/css");
  res.send(customCss);
});

swaggerRouter.get("/swagger-ui-bundle.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.send(swaggerUiBundle);
});

swaggerRouter.get("/swagger-ui-standalone-preset.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.send(swaggerUiStandalonePreset);
});

// Serve the favicon files
swaggerRouter.get("/favicon-32x32.png", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "node_modules",
      "swagger-ui-express",
      "static",
      "favicon-32x32.png"
    )
  );
});

swaggerRouter.get("/favicon-16x16.png", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "node_modules",
      "swagger-ui-express",
      "static",
      "favicon-16x16.png"
    )
  );
});

// Configure Swagger UI options
const options = {
  customCss: "",
  customJs: "",
  swaggerUrl: undefined,
  customCssUrl: "/api-docs/swagger-ui.css",
  customJsUrl: [
    "/api-docs/swagger-ui-bundle.js",
    "/api-docs/swagger-ui-standalone-preset.js",
  ],
};

// Setup the main Swagger UI route
swaggerRouter.get("/", swaggerUi.setup(swaggerDocument, options));

export default swaggerRouter;
