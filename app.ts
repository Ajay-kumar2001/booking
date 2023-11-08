import express, { Response, NextFunction } from "express";
import morgan from "morgan";
import { CustomRequest } from "./src/utils/request-model";
import userRoute from "./src/routes/userRoute";
import { errorHandler } from "./src/middlewares/errorHandler";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import cookieParser from 'cookie-parser';
import cors from "cors";
import helmet from "helmet"
const app = express();
app.use(cookieParser());
app.use(express.json());
// app.use(helmet())
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"], // You can customize allowed methods
  // allowedHeaders: ['Content-Type', 'authorization',], // You can customize allowed headers
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use((req: CustomRequest, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "REST API for booking management",
      version: "1.0.0",
    },
    schemes: ["http", "https"],
    servers: [{ url: `${process.env.API_URL}` }],
    components: {
      securitySchemes: {
        BearerAuth: {
          bearerFormat: 'JWT',
          scheme: 'bearer',
          type: 'http',
        },
      },
    },

    security: [
      {
        BearerAuth: []
      }
    ],
    
  },

  apis: ["./src/routes/userRoute.ts", "../../dist/src/routes/userRoute.js"],
};

const swaggerSpec = swaggerJSDoc(options);

app.use(
  `${process.env.API_URL}/api-docs`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);
app.use(`${process.env.API_URL}/users`, userRoute);

app.use("/uploads", express.static("uploads"));
app.use(errorHandler);

export default app;
