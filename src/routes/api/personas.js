const express = require("express");
const router = express.Router();
const personaController = require("../../controllers/personaController");
const auth = require("../../middleware/auth");

router.get(
    "/:numeroDocumento",
    personaController.obtenerPersonaByNumeroDocumento,
);

module.exports = router;
