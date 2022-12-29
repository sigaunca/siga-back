const express = require("express");
const router = express.Router();
const listadoDeCalificacionController = require("../../controllers/listadoDecalificacionController");
const { checkIdValidate } = require("../../middleware/check-id-validate");

router.get("/", listadoDeCalificacionController.obtenerListados)

router.post("/", listadoDeCalificacionController.crearListadoCalificacion);

router.get("/:id", checkIdValidate, listadoDeCalificacionController.obtenerListadoById);

router.get("/asignatura/:id", checkIdValidate, listadoDeCalificacionController.obtenerListadosByAsignaturaId);

router.put("/:id", checkIdValidate, listadoDeCalificacionController.actualizarListadoById);

router.delete("/:id", checkIdValidate,  listadoDeCalificacionController.eliminarListado);

module.exports = router;
