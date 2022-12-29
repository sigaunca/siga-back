const router = require("express").Router();
const config = require('config');
const pckJson = require('../../package.json');
router.get("/health", (req, res) => {
    res.status(200).json({
        app: pckJson.description,
        environment: config.get('environment'),
        version: pckJson.version
    });
});
 
// routes
router.use("/api/autoridades", require("./api/autoridades"));
router.use("/api/personas", require("./api/personas"));
router.use("/api/usuarios", require("./api/usuarios"));
router.use("/api/alumnos", require("./api/alumnos"));
router.use("/api/cursos", require("./api/cursos"));
router.use("/api/escuelas", require("./api/escuelas"));
router.use("/api/inasistencias", require("./api/inasistencias"));
router.use("/api/legajos", require("./api/legajos"));
router.use("/api/auth", require("./api/auth"));
router.use("/api/eventos", require("./api/eventos"));
router.use("/api/notificaciones", require("./api/notificaciones"));
router.use("/api/asignaturas", require("./api/asignaturas"));
router.use("/api/calificaciones", require("./api/calificaciones"));
router.use("/api/listado/calificaciones", require("./api/listadoDeCalificaciones"));

module.exports = router;
