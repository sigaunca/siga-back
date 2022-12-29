const express = require("express");
const router = express.Router();
const alumnoController = require("../../controllers/alumnoController");
const auth = require("../../middleware/auth");

router.get("/", alumnoController.obtenerAlumnos);

router.get("/:id", alumnoController.obtenerAlumnoById);

router.post("/", alumnoController.crearAlumno);

router.put("/:id", alumnoController.actualizarAlumno);

router.delete("/:id", alumnoController.eliminarAlumno);

router.get(
    "/numeroDocumento/:numeroDocumento",
    alumnoController.obtenerAlumnoByNumeroDocumento,
);

router.get("/curso/:id", alumnoController.obtenerAlumnosByCurso);

module.exports = router;
