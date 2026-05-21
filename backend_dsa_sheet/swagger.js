const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DSA Sheet API",
      version: "1.0.0",
      description: "API for DSA Sheet with authentication, topic/problem management, and user progress tracking",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Topic: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            slug: { type: "string" },
            description: { type: "string" },
            difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
            resources: {
              type: "object",
              properties: {
                youtube: { type: "string" },
                article: { type: "string" },
                practice: { type: "string" },
              },
            },
            order: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Problem: {
          type: "object",
          properties: {
            _id: { type: "string" },
            topic: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
            resources: {
              type: "object",
              properties: {
                youtube: { type: "string" },
                article: { type: "string" },
                practice: { type: "string" },
              },
            },
            order: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
    security: [],
  },
  apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options);
