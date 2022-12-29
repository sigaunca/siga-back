const express = require("express");
const router = express.Router();
const eventoController = require("../../controllers/eventoController");

router.get("/", eventoController.obtenerEventos);

router.get("/:id", eventoController.obtenerEventosById);

router.get("/alumno/:id", eventoController.obtenerEventosByAlumno);

router.get("/autoridad/:id", eventoController.obtenerEventosByAutoridad);

router.post("/", eventoController.crearEvento);

// router.get("/asignatura/:id", eventoController.obtenerEventosByAsignatura);

router.get(
    "/curso/:id",
    eventoController.obtenerEventosByCurso,
);

router.delete("/:id", eventoController.eliminarEvento);

module.exports = router;
