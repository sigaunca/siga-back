const Autoridad = require("../models/Autoridad");
const AutoridadType = require("../models/AutoridadType");

// services
const autoridadService = require("../services/autoridadService");
const responseService = require("../services/responseService");

exports.crearAutoridad = async (req, res) => {
    try {
        let autoridad = await autoridadService.crearAutoridad(req.body);
        res.status(201).json(autoridad);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

exports.actualizarAutoridad = async (req, res) => {};

exports.eliminarAutoridad = async (req, res) => {};

exports.obtenerAutoridades = async (req, res) => {
    try {
        let autoridades = await Autoridad.find()
            .populate("persona")
            .populate("tipo")
            .populate("escuela")
            .populate({
                path: "cursos"
            })
        res.status(201).json(autoridades);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};
/**
 * id
 *
 */

exports.obtenerAutoridadesByType = async (req, res) => {
    try {
        let autoridades = await Autoridad.find()
            .populate("persona")
            .populate({
                path: "tipo",
                match: {
                    tipoAutoridad:
                        req.params.type.toUpperCase().charAt(0) +
                        req.params.type.slice(1, -2),
                },
            });
        res.status(200).json(
            autoridades.filter((autoridad) => autoridad.tipo !== null),
        );
    } catch (error) {
        res.status(400).send("Hubo un error");
    }
};

exports.obtenerAutoridadById = async (req, res) => {
    try {
        let autoridad = await Autoridad.findById(req.params.id)
            .populate("persona")
            .populate("tipo")
            .populate({
                path: "cursos"
            })
            .populate({
                path: "alumnos",
                populate: { path: "persona" },
            })
            .populate("escuela");
        if (!autoridad) {
            return res.status(404).json({ msg: "La autoridad no existe" });
        }
        res.status(200).json(autoridad);
    } catch (error) {
        console.log(error)
        res.status(500).send("Hubo un error");
    }
};

exports.obtenerTypesAutoridades = async (req, res) => {
    try {
        let autoridades = await AutoridadType.find();
        res.status(200).json(autoridades);
    } catch (error) {
        res.status(400).send("Hubo un error");
    }
};

exports.crearTypeAutoridad = async (req, res) => {
    const { tipoAutoridad, permisos } = req.body;
    try {
        let type = new AutoridadType({ tipoAutoridad, permisos });
        const typeCreado = await type.save();
        res.status(201).json(typeCreado);
    } catch (error) {
        res.status(400).send("Hubo un error");
    }
};

/**
 * Asociar Curso a un legajo
 * @returns
 */
 exports.asignarCurso = async (req, res) => {
    try {
        const response = await autoridadService.asignarCurso(req.body);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

/**
 * Obtener una autoridad por numero de documento o por sub string en su nombre o nombre completo
 * @returns
 */
 exports.traerAutoridadPorDocumentoOPorString = async (req, res) => {
    try {

        const {type: tipoBusqueda, value, tipoAutoridad: tipoAutoridadName} = req.query
        const type = tipoBusqueda.toUpperCase()
        const useCase = {
            'DOC': async () =>{ return autoridadService.traerPorDNI({numero_documento: value, tipo_autoridad_name: tipoAutoridadName})},
            'NOM': async () =>{ return autoridadService.traerAutoridadPorCoincidenciaEnNombre({cadena: value, tipo_autoridad_name: tipoAutoridadName})},
            "DEFAULT": () => {
                throw new Error(`'${type}' no es un valor aceptado para 'type'. Solo se admite: ['DOC','NOM'].`)
            } 
        }

        const response = useCase[type] && await useCase[type]() || useCase["DEFAULT"]();
        res.status(200).json(response);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};



