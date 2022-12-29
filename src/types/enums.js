// types roles
const rolesPermitidos = {
    values: ["ADMIN_ROLE", "USER_ROLE"],
    message: "{VALUE} no es un rol permitido",
};

// types genero
const generosPermitidos = {
    values: ["Masculino", "Femenino", "Otro", "Sin genero"],
    message: "{VALUE} no es un genero permitido",
};

// types nacionalidad
const nacionalidadPermitidos = {
    values: ["AR", "EX"],
    message: "{VALUE} no es una nacionalidad permitida, se acepta 'AR'/'EX'",
};

const tipoAutoridadPermitidos = {
    values: ["Preceptor", "Profesor", "Tutor", "Administrador"],
    message: "{VALUE} no es un tipo de autoridad permitida",
};

module.exports = {
    rolesPermitidos,
    nacionalidadPermitidos,
    generosPermitidos,
    tipoAutoridadPermitidos,
};
