const { TIPOS_AUTORIDADES } = require("../common/constans");
const AutoridadFactory = require("./factorys/autoridadFactory");

class AutoridadHandler {
    static factoryInstance = null;

    static createFactoryInstance = () => {
        this.factoryInstance = new AutoridadFactory();
    };

    static prepareFactoryInstance = () => {
        if (!this.factoryInstance) {
            this.createFactoryInstance();
        }
    };
    static autoridadFactoryCreate = async ({
        actionKey,
        tipoAutoridadData,
        personaId,
        cursos,
        alumnos,
        escuelaId,
    }) => {
        this.prepareFactoryInstance();

        let autoridadCreate = null;
        switch (actionKey) {
            case TIPOS_AUTORIDADES.TUTOR:
                autoridadCreate = await this.factoryInstance.crearTutor({
                    personaId,
                    tipoAutoridad: tipoAutoridadData,
                    cursos,
                    alumnos,
                    escuelaId: null,
                });
                break;
            case TIPOS_AUTORIDADES.PRECEPTOR:
                autoridadCreate = await this.factoryInstance.crearPreceptor({
                    personaId,
                    tipoAutoridad: tipoAutoridadData,
                    cursos,
                    alumnos,
                    escuelaId,
                });

                break;
            case TIPOS_AUTORIDADES.PROFESOR:
                autoridadCreate = await this.factoryInstance.crearProfesor({
                    personaId,
                    tipoAutoridad: tipoAutoridadData,
                    cursos,
                    alumnos,
                    escuelaId,
                });

                break;
            default:
                break;
        }

        return autoridadCreate;
    };
}

module.exports = { AutoridadHandler };
