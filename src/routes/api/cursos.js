const express = require("express");
const router = express.Router();
const cursoController = require("../../controllers/cursoController");
const auth = require("../../middleware/auth");
const { checkIdValidate } = require("../../middleware/check-id-validate");

router.get("/", cursoController.obtenerCursos);

router.get("/:id", cursoController.obtenerCursoById);

router.get(
    "/autoridad/:id",
    checkIdValidate,
    cursoController.obtenerCursosByAutoridad,
);

router.post("/", cursoController.crearCurso);

router.put("/:id", checkIdValidate, cursoController.actualizarCurso);

router.delete("/:id", checkIdValidate, cursoController.eliminarCurso);

module.exports = router;
