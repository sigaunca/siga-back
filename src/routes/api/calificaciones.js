const express = require("express");
const router = express.Router();
const calificacionController = require("../../controllers/calificacionController");
const { checkIdValidate } = require("../../middleware/check-id-validate");

router.post("/", calificacionController.crearCalificacion);

router.get("/trimestre/:id", checkIdValidate, calificacionController.listarCalificacionesPorTrimestres);

module.exports = router;
