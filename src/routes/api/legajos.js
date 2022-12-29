const express = require("express");
const router = express.Router();
const legajoController = require("../../controllers/legajoController");
const auth = require("../../middleware/auth");
const { checkIdValidate } = require("../../middleware/check-id-validate");
const { checkTutorExist } = require("../../middleware/check-type-tutor");

router.get("/", legajoController.obtenerLegajos);

router.get("/archivados", legajoController.obtenerLegajosArchivados);

router.get("/:id", checkIdValidate, legajoController.obtenerLegajoById);

router.post("/", checkTutorExist, legajoController.crearLegajo);

router.put("/:id", legajoController.editarLegajo);

router.delete("/:id", checkIdValidate, legajoController.archivarLegajo);

router.put("/activar/:id", checkIdValidate, legajoController.activarLegajo);

router.put("/asignar/curso", legajoController.asignarCurso);

module.exports = router;
