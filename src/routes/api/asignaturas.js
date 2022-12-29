const express = require("express");
const router = express.Router();
const asignaturaController = require("../../controllers/asignaturaController");

router.get("/", asignaturaController.obtenerAsignaturas);

router.get("/:id", asignaturaController.obtenerAsignaturaById);

router.get(
    "/autoridad/:id",
    asignaturaController.obtenerAsignaturasByAutoridad,
);

router.get(
    "/curso/:id",
    asignaturaController.obtenerAsignaturasByCurso,
);

router.post("/", asignaturaController.crearAsignatura);

router.put("/:id", asignaturaController.actualizarAsignatura);

router.delete("/:id", asignaturaController.eliminarAsignatura);

module.exports = router;
