// Import de librerias
const express = require("express");
const cors = require("cors");

// imports de rutas
const routes = require("./src/routes/index");
const { SystemConfig } = require("./src/config/system");

// Instancia del servidor
const app = express();

// Middlewares para el uso del servidor
app.use(cors());
app.use(express.json({ extended: true }));

// System config
SystemConfig.setConfig();

// Instancia de las rutas
app.use(routes);

// export app
module.exports = app;
