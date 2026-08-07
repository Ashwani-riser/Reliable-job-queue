import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Queue API",
      version: "1.0.0",
      description: "Production-ready Job Queue System using BullMQ, Redis and MongoDB",
    },

    servers: [
      {
        url: "http://localhost:5000/api/v1",
      },
    ],
  },

  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;