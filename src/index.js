const express = require("express");
const { ConnectDB } = require("./utils/config-database");
const { default: helmet } = require("helmet");
const { CORS_ORIGIN, PORT } = require("./utils/secret");
const cors = require("cors");
const { HttpException } = require("./utils/http-exception");
const { StatusCodes } = require("http-status-codes");
const { default: rateLimit } = require("express-rate-limit");
const { mainRouter } = require("./routes");
const { errorMiddleware } = require("./middlewares/error.middleware");
const { default: mongoose } = require("mongoose");

const app = express();

ConnectDB();

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);

const allowedOrigins = CORS_ORIGIN.split(",").map((origin) => origin.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);

      console.log(`CORS blocked origin: ${origin}`);
      callback(
        new HttpException(
          StatusCodes.FORBIDDEN,
          "CORS policy: Access denied from this origin",
        ),
      );
    },

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: {
    status: 429,
    message: "Too many requests. Please try again later.",
  },
});

app.use(limiter);

app.use(express.json({ limit: "10mb" }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Api is running!",
  });
});

mainRouter.forEach((rItem) => {
  app.use(rItem.path, rItem.rout);
});

app.use((req, res) => {
  throw new HttpException(
    StatusCodes.NOT_FOUND,
    `Route ${req.originalUrl} not found`,
  );
});

app.use(errorMiddleware);

const server = app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(async () => {
    console.log("HTTP server closed");
    await mongoose.connection.close();
    console.log("MongoDb connection closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received");
  process.exit(0);
});
