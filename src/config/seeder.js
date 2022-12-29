"use strict";
const config = require("config");
const mongoose = require("mongoose");
var colors = require('colors/safe');
// Importamos el modelo
const Alumno = require("../models/Alumno");
const Archivo = require("../models/Archivo");
const Asignatura = require("../models/Asignatura");
const Autoridad = require("../models/Autoridad");
const AutoridadType = require("../models/AutoridadType");
const Calificacion = require("../models/Calificacion");
const Curso = require("../models/Curso");
const Escuela = require("../models/Escuela");
const Evento = require("../models/Evento");
const Inasistencia = require("../models/Inasistencia");
const Legajo = require("../models/Legajo");
const ListadoCalificaciones = require("../models/ListadoCalificaciones");
const Notificacion = require("../models/Notificacion");
const Persona = require("../models/Persona");
const Representante = require("../models/Representante");
const Usuario = require("../models/Usuario");

(async () => {
  await mongoose.connect(config.get("db_atlas_dev"));
  const db = mongoose.createConnection(config.get("db_atlas_dev"));

  // Borramos la coleccion
  // console.log(colors.green("Iniciando Delete de colecciones"));
  // await db.collection("alumnos").deleteMany();
  // console.log(".");
  // await db.collection("asignaturas").deleteMany();
  // console.log("..");
  // await db.collection("autoridades").deleteMany();
  // console.log("...");
  // await db.collection("autoridadtypes").deleteMany();
  // console.log("....");
  // await db.collection("calificacions").deleteMany();
  // console.log(".....");
  // await db.collection("cursos").deleteMany();
  // console.log("......");
  // await db.collection("escuelas").deleteMany();
  // console.log(".......");
  // await db.collection("eventos").deleteMany();
  // console.log("........");
  // await db.collection("inasistencias").deleteMany();
  // console.log(".........");
  // await db.collection("legajos").deleteMany();
  // console.log("..........");
  // await db.collection("listadocalificaciones").deleteMany();
  // console.log("...........");
  // await db.collection("personas").deleteMany();
  // console.log("............");
  // await db.collection("usuarios").deleteMany();
  console.log(".............");
  console.log(colors.green("Finalizando Delete de colecciones"));

  console.log(colors.green("\nIniciando carga de directorios"));
  console.log(colors.cyan("Creando Escuelas"));
  
  const escuelaEnet = await Escuela({
    nombre: "E.N.E.T N° 1",
    telefono: "38344423303",
    localidad: "capital",
    codigoPostal: "4700",
    barrio: "25 de septiembre",
    calle: "Mariano Moreno Nte.",
    numeroCalle: 599,
  }).save();

  const escuelaFray = await Escuela({
    nombre: "Fray Mamerto Esquiú",
    telefono: "38344428009",
    localidad: "capital",
    codigoPostal: "4700",
    barrio: "25 de agosto",
    calle: "Av. Belgrano",
    numeroCalle: 298,
  }).save();

  console.log(colors.cyan("Tipos de autoridades"));
  await AutoridadType({
    tipoAutoridad: "Administrador",
    permisos: ["superuser"],
  }).save();

  const autoridadPreceptorType = await AutoridadType({
    tipoAutoridad: "Preceptor",
    permisos: ["lst-inasistenci"],
  }).save();

  const autoridadProfesorType = await AutoridadType({
    tipoAutoridad: "Profesor",
    permisos: ["lst-inasistenci"],
  }).save();

  await AutoridadType({
    tipoAutoridad: "Tutor",
    permisos: ["lst-inasistenci"],
  }).save();

  console.log(colors.cyan("Personas"));
  const personaPreceptor = await Persona({
    nombres: "Marcos",
    apellidos: "Romero",
    numeroDocumento: "0000001",
    tipoDocumento: "DNI",
    genero: "Masculino",
    grupoFactor: "B+",
    nacionalidad: "AR",
    fechaNacimiento: "2014-10-19T16:36:14.197Z",
    domicilioLocalidad: "San Fernando del Valle de Catamarca",
    domicilioCodigoPostal: 4700,
    domicilioBarrio: "barrio preceptor",
    domicilioCalle: "domicilio preceptor",
    domicilioNumeroCalle: 4444,
    domicilioPiso: 4,
    domicilioCepartamento: "A",
    ocupacion: "Preceptor",
    domicilioLaboralLocalidad: "capital",
    domicilioLaboralCodigoPostal: 4700,
    domicilioLaboralBarrio: "25 de septiembre",
    domicilioLaboralCalle: "Av. Belgrano",
    domicilioLaboralNumeroCalle: 599,
    domicilioLaboralPiso: null,
    domicilioLaboralDepartamento: null,
    contactoTelefono: "1500000002",
    contactoTelefonoSec: "1500000001",
    contactoCorreo: "preceptor@dominio.com"
  });

  const personaPreceptor1 = await Persona({
    nombres: "Federico",
    apellidos: "Martinez",
    numeroDocumento: "0000002",
    tipoDocumento: "DNI",
    genero: "Masculino",
    grupoFactor: "A+",
    nacionalidad: "AR",
    fechaNacimiento: "2014-10-19T16:36:14.197Z",
    domicilioLocalidad: "San Fernando del Valle de Catamarca",
    domicilioCodigoPostal: 4700,
    domicilioBarrio: "barrio preceptor",
    domicilioCalle: "domicilio preceptor",
    domicilioNumeroCalle: 3333,
    domicilioPiso: 4,
    domicilioCepartamento: "A",
    ocupacion: "Preceptor",
    domicilioLaboralLocalidad: "capital",
    domicilioLaboralCodigoPostal: 4700,
    domicilioLaboralBarrio: "25 de septiembre",
    domicilioLaboralCalle: "Av. Belgrano",
    domicilioLaboralNumeroCalle: 599,
    domicilioLaboralPiso: null,
    domicilioLaboralDepartamento: null,
    contactoTelefono: "1500000004",
    contactoTelefonoSec: "1500000003",
    contactoCorreo: "preceptor@dominio.com"
  });

  const personaProfesor = await Persona({
    nombres: "Martin el changuito",
    apellidos: "Hidalgo",
    numeroDocumento: "11111111",
    tipoDocumento: "DNI",
    genero: "Masculino",
    grupoFactor: "B+",
    nacionalidad: "AR",
    fechaNacimiento: "1982-10-19T16:36:14.197Z",
    domicilioLocalidad: "San Fernando del Valle de Catamarca",
    domicilioCodigoPostal: 4700,
    domicilioBarrio: "barrio preceptor",
    domicilioCalle: "domicilio preceptor",
    domicilioNumeroCalle: 5555,
    domicilioPiso: 3,
    domicilioCepartamento: "Z",
    ocupacion: "Preceptor",
    domicilioLaboralLocalidad: "capital",
    domicilioLaboralCodigoPostal: 4700,
    domicilioLaboralBarrio: "25 de septiembre",
    domicilioLaboralCalle: "Av. Belgrano",
    domicilioLaboralNumeroCalle: 599,
    domicilioLaboralPiso: null,
    domicilioLaboralDepartamento: null,
    contactoTelefono: "1511111112",
    contactoTelefonoSec: "1511111111",
    contactoCorreo: "preceptor2@dominio.com"
  });

  const personaProfesor1 = await Persona({
    nombres: "Martin el changuito",
    apellidos: "Hidalgo",
    numeroDocumento: "11111111",
    tipoDocumento: "DNI",
    genero: "Masculino",
    grupoFactor: "B+",
    nacionalidad: "AR",
    fechaNacimiento: "1982-10-19T16:36:14.197Z",
    domicilioLocalidad: "San Fernando del Valle de Catamarca",
    domicilioCodigoPostal: 4700,
    domicilioBarrio: "barrio preceptor",
    domicilioCalle: "domicilio preceptor",
    domicilioNumeroCalle: 5555,
    domicilioPiso: 3,
    domicilioCepartamento: "Z",
    ocupacion: "Preceptor",
    domicilioLaboralLocalidad: "capital",
    domicilioLaboralCodigoPostal: 4700,
    domicilioLaboralBarrio: "25 de septiembre",
    domicilioLaboralCalle: "Av. Belgrano",
    domicilioLaboralNumeroCalle: 599,
    domicilioLaboralPiso: null,
    domicilioLaboralDepartamento: null,
    contactoTelefono: "1511111112",
    contactoTelefonoSec: "1511111111",
    contactoCorreo: "preceptor2@dominio.com"
  });

  console.log(colors.cyan("Autoridad - Preceptores"));
  const autoridadPreceptor = await Autoridad({
    persona: personaPreceptor._id,
    tipo: autoridadPreceptorType._id,
    alumnos: [],
    cursos: [],
    escuela: escuelaFray._id,
  }).save();
  
  const autoridadPreceptor1 = await Autoridad({
    persona: personaPreceptor1._id,
    tipo: autoridadPreceptorType._id,
    alumnos: [],
    cursos: [],
    escuela: escuelaFray._id,
  }).save();

  console.log(colors.cyan("Autoridad - Profesores"));
  const autoridadProfesor = await Autoridad({
    tipoAutoridad: autoridadProfesorType._id,
    escuela: escuelaFray._id,
    personaRelacionada: null,
    persona: personaProfesor._id,
    cursos: []
  }).save();

 const autoridadProfesor1 =  await Autoridad({
    tipoAutoridad: autoridadProfesorType._id,
    escuela: escuelaFray._id,
    personaRelacionada: null,
    persona: personaProfesor1._id,
    cursos: []
  }).save();
  
  console.log(colors.cyan("Cursos"));
  const curso1A = await Curso({
    escuela: escuelaFray._id,
    preceptor: autoridadPreceptor._id,
    nivel: "Secundario",
    anio: "1",
    seccion: "A",
    turno: "Mañana"
  }).save();

  const curso1B = await Curso({
    escuela: escuelaFray._id,
    preceptor: autoridadPreceptor._id,
    nivel: "Secundario",
    anio: "1",
    seccion: "B",
    turno: "Mañana"
  }).save();

  const curso1C = await Curso({
    escuela: escuelaFray._id,
    preceptor: autoridadPreceptor._id,
    nivel: "Secundario",
    anio: "1",
    seccion: "C",
    turno: "Mañana"
  }).save();

  const curso1D = await Curso({
    escuela: escuelaFray._id,
    preceptor: autoridadPreceptor._id,
    nivel: "Secundario",
    anio: "1",
    seccion: "D",
    turno: "Mañana"
  }).save();


  const curso2A = await Curso({
    escuela: escuelaFray._id,
    preceptor: autoridadPreceptor1._id,
    nivel: "Secundario",
    anio: "2",
    seccion: "A",
    turno: "Mañana"
  }).save();

  const curso2B = await Curso({
    escuela: escuelaFray._id,
    preceptor: autoridadPreceptor1._id,
    nivel: "Secundario",
    anio: "2",
    seccion: "B",
    turno: "Mañana"
  }).save();

  const curso2C = await Curso({
    escuela: escuelaFray._id,
    preceptor: autoridadPreceptor1._id,
    nivel: "Secundario",
    anio: "2",
    seccion: "C",
    turno: "Mañana"
  }).save();

  const curso2D = await Curso({
    escuela: escuelaFray._id,
    preceptor: autoridadPreceptor1._id,
    nivel: "Secundario",
    anio: "2",
    seccion: "D",
    turno: "Mañana"
  }).save();

  console.log(colors.cyan("Actualizando autoridades preceptor"));
  await Autoridad.findByIdAndUpdate({_id: autoridadPreceptor._id},{$set: {cursos: [curso1A._id.toString(),curso1B._id.toString(),curso1C._id.toString(),curso1D._id.toString()]}});
  await Autoridad.findByIdAndUpdate({_id: autoridadPreceptor1._id},{$set: {cursos: [curso2A._id.toString(),curso2B._id.toString(),curso2C._id.toString(),curso2D._id.toString()]}});
  
  console.log(colors.cyan("Actualizando autoridades profesor"));
  await Autoridad.findByIdAndUpdate({_id: autoridadProfesor._id},{$set: {cursos: [curso1A._id.toString(),curso1B._id.toString(),curso2A._id.toString(),curso2B._id.toString()]}});
  await Autoridad.findByIdAndUpdate({_id: autoridadProfesor1._id},{$set: {cursos: [curso1C._id.toString(),curso1D._id.toString(),curso2C._id.toString(),curso2D._id.toString()]}});
  
  console.log(colors.cyan("Asignaturas"));

  const arrayNombreMaterias = ["Matematica", "Lengua", "Cs Sociales", "Cs Naturales"];

  const arrayCursosProfesor = [ 
    {profesor:autoridadProfesor ,curso:curso1A},
    {profesor:autoridadProfesor ,curso:curso1B},
    {profesor:autoridadProfesor ,curso:curso1C},
    {profesor:autoridadProfesor ,curso:curso1D},
    {profesor:autoridadProfesor1 ,curso:curso2A},
    {profesor:autoridadProfesor1 ,curso:curso2B},
    {profesor:autoridadProfesor1 ,curso:curso2C},
    {profesor:autoridadProfesor1 ,curso:curso2D},
   ];

   for (let index = 0; index < arrayNombreMaterias.length; index++) {
    // nombre de la materia
    const materia = arrayNombreMaterias[index];
    // sagundo array
    for (let index = 0; index < arrayCursosProfesor.length; index++) { 
      // objeto curso
      const curso = arrayCursosProfesor[index].curso;
      // objeto profesor
      const profesor = arrayCursosProfesor[index].profesor;
      await Asignatura({
        nombre: materia,
        curso: curso._id,
        profesor: profesor._id 
      }).save();
    }
   }
 
  
  // salimos del script 20 segundos despues de haber insertado los documentos
  setTimeout(function () {
    console.log(colors.red("Proceso Terminado"));
    return process.exit(1);
  }, 2000);
})();



const crearAsignaturaPorCurso = async ({asignatura,curso, profesor}) => {
  return await Asignatura({
    nombre: asignatura,
    curso: curso._id,
    profesor: profesor._id 
}).save();
}