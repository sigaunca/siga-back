const AutoridadType = require("../models/AutoridadType");

exports.encontrarTipoDeAutoridadPorNombre = async ({tipo_autoridad_name: tipoAutoridadName}) => {
    const tipoAutoridad = await AutoridadType.findOne({
        tipoAutoridad: tipoAutoridadName,
      });
    
      if (!tipoAutoridad)
        throw new Error(
          `No existe el tipo de autoridad '${tipoAutoridadName}' en nuestros registros.`
        );

    return tipoAutoridad;
}