const { TIPOS_AUTORIDADES_ACEPTADAS } = require("../../common/constans");
const Autoridad = require("../../models/Autoridad");
const {
    crearPersona,
    recuperarOCrearPersona,
} = require("../../services/personaService");

// TODO: preguntar si se necesita mejorar para que siempre reciban los mismos parametros
module.exports = function AutoridadFactory() {
    this.crearTutor = async ({
        personaId,
        tipoAutoridad,
        cursos,
        alumnos,
        escuelaId,
    }) => {
        return await this.createAutoridad({
            personaId,
            tipoAutoridadId: tipoAutoridad._id,
            alumnos,
            cursos,
            escuelaId,
        });
    };

    this.crearPreceptor = async ({
        personaId,
        tipoAutoridad,
        cursos,
        alumnos,
        escuelaId,
    }) => {
        // const persona = await recuperarOCrearPersona({ reqPersona });
        return await this.createAutoridad({
            personaId,
            tipoAutoridadId: tipoAutoridad._id,
            alumnos,
            cursos,
            escuelaId,
        });
    };

    this.crearProfesor = async ({
        personaId,
        tipoAutoridad,
        cursos,
        alumnos,
        escuelaId,
    }) => {
        // const persona = await recuperarOCrearPersona({ reqPersona });
        return await this.createAutoridad({
            personaId,
            tipoAutoridadId: tipoAutoridad._id,
            alumnos,
            cursos,
            escuelaId,
        });
    };

    this.createAutoridad = async ({
        personaId,
        tipoAutoridadId,
        alumnos,
        cursos,
        escuelaId,
    }) => {
        const autoridad = await new Autoridad({
            persona: personaId,
            tipo: tipoAutoridadId,
            alumnos: alumnos,
            cursos: cursos,
            escuela: escuelaId,
        });
        await autoridad.save();
        return autoridad;
    };
};
/*
reqPersona: personaCompleta,
                    tipoAutoridad,
                    cursos,
                    alumnos, */
