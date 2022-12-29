const express = require("express");
const router = express.Router();
const inasistenciaController = require("../../controllers/inasistenciaController");
const auth = require("../../middleware/auth");

router.get("/:id", inasistenciaController.obtenerInasistencias);

router.get("/curso/diaria/:id", inasistenciaController.obtenerInasistenciasDiariasByCurso)

router.get("/alumno/diaria/:id", inasistenciaController.obtenerInasistenciasDiariasByAlumno)

router.get("/curso/:id", inasistenciaController.obtenerInasistenciasByCurso)

router.post("/", inasistenciaController.crearInasistencia);

router.put("/:id", inasistenciaController.actualizarInasistencia);

router.delete("/:id", inasistenciaController.eliminarInasistencia);

module.exports = router;
