require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const connectDB = require("./config/db");
const passport = require("./config/passport");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const fileRoutes = require("./routes/file");

const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Your API Documentation",
      version: "1.0.0",
      description: "Documentation for your API endpoints",
    },
  },
  apis: ["./routes/*.js"], // Path to your API routes directory
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(express.static(path.resolve(__dirname, "client/build")));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/file", fileRoutes);
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client/build", "index.html"));
});

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
