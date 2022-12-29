const express = require("express");
const router = express.Router();
const usuarioController = require("../../controllers/usuarioController");
const auth = require("../../middleware/auth");

router.get("/", usuarioController.obtenerUsuarios);

router.get("/:id", usuarioController.obtenerUsuarioById);

router.post("/", usuarioController.crearUsuario);

router.put("/:id", usuarioController.actualizarUsuario);

router.delete("/:id", usuarioController.eliminarUsuario);

module.exports = router;
