const express = require("express");
const router = express.Router();
const autoridadController = require("../../controllers/autoridadController");
const auth = require("../../middleware/auth");
const checkAutoridadType = require("../../middleware/check-autoridad");
const checkEscueladType = require("../../middleware/check-escuela");

router.get("/", autoridadController.obtenerAutoridades);

router.get("/type/:type", autoridadController.obtenerAutoridadesByType);

router.get("/:id", autoridadController.obtenerAutoridadById);

router.get("/types/get", autoridadController.obtenerTypesAutoridades);

router.post("/types", autoridadController.crearTypeAutoridad);

router.post(
    "/",
    checkAutoridadType,
    checkEscueladType,
    autoridadController.crearAutoridad,
);

router.put("/:id", autoridadController.actualizarAutoridad);

router.delete("/:id", autoridadController.eliminarAutoridad);

router.put("/asignar/curso", autoridadController.asignarCurso);

router.get("/find/v2", autoridadController.traerAutoridadPorDocumentoOPorString)

module.exports = router;
