const express = require("express");
const router = express.Router();
const escuelaController = require("../../controllers/escuelaController");

router.get("/", escuelaController.obtenerEscuelas);
router.post("/", escuelaController.crearEscuela);

module.exports = router;
