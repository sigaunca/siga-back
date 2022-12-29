const express = require("express");
const router = express.Router();
const notificacionController = require("../../controllers/notificacionController");


router.get("/", notificacionController.obtenerNotificaciones);

router.get("/leida/:id", notificacionController.marcarLeida);

router.get("/:id", notificacionController.obtenerNotificacionesByAlumno);

router.delete("/:id", notificacionController.eliminarNotificacionByEvento);

module.exports = router;
