import express, { Response, NextFunction } from "express";
import morgan from "morgan";
import { CustomRequest } from "./src/utils/request-model";
import userRoute from "./src/routes/userRoute";
import {errorHandler} from "./src/middlewares/userMiddlewares"
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import cors from "cors"

const app = express();

app.use(express.json());
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // You can customize allowed methods
  // allowedHeaders: ['Content-Type', 'authorization',], // You can customize allowed headers
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions))

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
      version: "1.0.0"
    },
    schemes: ["http", "https"],
    servers: [{ url: `${process.env.API_URL}` }]
  },
  apis: ["./src/routes/userRoute.ts", "../../dist/src/routes/userRoute.js"]
};

const swaggerSpec = swaggerJSDoc(options);

app.use(
  `${process.env.API_URL}/api-docs`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);
app.use(`${process.env.API_URL}/users`, userRoute);
app.use(errorHandler);

export default app;
