// Import de dependencias
require("dotenv").config({ path: "variables.env" });
const request = require("supertest");
const { ObjectID } = require("mongodb");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

// Import de server y helper
const app = require("../../app");
const helper = require("../helpers/helper");

// Import json's
const tutorJson = require("../mocks/autoridadTypes/tutor.json");
const legajoJson = require("../mocks/legajos/legajo.json");
const legajoEditJson = require("../mocks/legajos/legajo-edit.json");
const legajoEdit2Json = require("../mocks/legajos/legajo-edit-2.json");
const legajoVersion2Json = require("../mocks/legajos/legajo-version-2.json");
const cursoJson = require("../mocks/cursos/curso.json");
const { createTransport } = require("nodemailer");

// Nodemailer Mock
jest.mock("nodemailer", () => ({
    createTransport: jest.fn().mockImplementation(() => ({
        sendMail: jest.fn((mailOptions, callback) => {
            return {
                accepted: ["test@dominio.com.ar"],
                rejected: [],
                envelopeTime: 0,
                messageTime: 0,
                messageSize: 0,
                response: "250 2.0.0 OK test - gsmtp",
                envelope: {
                    from: "test.info@dominio.com",
                    to: ["test@dominio.com.ar"],
                },
                messageId: "<test-hash@gmail.com>",
            };
        }),
    })),
}));

jest.setTimeout(100000);

describe("API Legajos", () => {
    beforeAll(async () => {
        await helper.testDbConnect();
        nodemailer.createTransport.mockClear();
    });

    afterAll(async () => {
        await helper.testDbDisconnect();
    });

    describe("All Endpoints", () => {
        let idTemp = "";
        const randomId = new mongoose.Types.ObjectId();

        it("POST/ legajos - should error response 'Tutor'", async () => {
            const {
                status,
                body: { message },
            } = await request(app).post("/api/legajos").send(legajoJson);

            expect(status).toBe(400);
            expect(message).toBe("Debe crear el tipo de autoridad 'Tutor'.");
        });

        it("POST/ autoridades/types - should create 'Tutor'", async () => {
            const { status, body } = await request(app)
                .post("/api/autoridades/types")
                .send(tutorJson);

            expect(status).toBe(201);
            expect(body.permisos[0]).toBe("test");
            expect(body.tipoAutoridad).toBe("Tutor");
        });

        it("POST/ autoridades/types - should create 'Tutor'", async () => {
            const { status, body } = await request(app).get(
                "/api/autoridades/types/get",
            );

            expect(status).toBe(200);
            expect(body[0].permisos[0]).toBe("test");
            expect(body[0].tipoAutoridad).toBe("Tutor");
        });

        it("POST/ legajos - should create Legajo", async () => {
            const { status, body: legajo } = await request(app)
                .post("/api/legajos")
                .send(legajoJson);

            expect(status).toBe(201);
            expect(legajo.documentos).toBeInstanceOf(Array);
            expect(legajo.archivado).toBe(false);
            expect(ObjectID.isValid(legajo.alumno)).toBeTruthy();
            expect(ObjectID.isValid(legajo.padre)).toBeTruthy();
            expect(ObjectID.isValid(legajo.madre)).toBeTruthy();
            expect(ObjectID.isValid(legajo.tutor)).toBeTruthy();
        });

        it("GET/ legajos - should return array Legajos", async () => {
            const { status, body: data } = await request(app)
                .get("/api/legajos")
                .query({ data: false })
                .send(legajoJson);

            expect(status).toBe(200);
            expect(data).toBeInstanceOf(Array);
            expect(data.length).toBeGreaterThanOrEqual(1);
            expect(ObjectID.isValid(data[0].alumno)).not.toBeTruthy();
            expect(ObjectID.isValid(data[0].madre)).toBeTruthy();
            expect(ObjectID.isValid(data[0].padre)).toBeTruthy();
            expect(ObjectID.isValid(data[0].tutor)).toBeTruthy();
            idTemp = data[0]._id;
        });

        it("GET/ legajos/archivados - should return empty array Legajos", async () => {
            const { status, body: data } = await request(app)
                .get("/api/legajos/archivados")
                .query({ data: false })
                .send(legajoJson);

            expect(status).toBe(200);
            expect(data).toBeInstanceOf(Array);
            expect(data.length).toBe(0);
        });

        it("DELETE/ legajos - should archivate Legajos", async () => {
            const { status, body: data } = await request(app).delete(
                `/api/legajos/${idTemp}`,
            );

            expect(status).toBe(200);
            expect(data.archivado).toBe(true);
            expect(ObjectID.isValid(data.alumno)).toBeTruthy();
            expect(ObjectID.isValid(data.madre)).toBeTruthy();
            expect(ObjectID.isValid(data.padre)).toBeTruthy();
            expect(ObjectID.isValid(data.tutor)).toBeTruthy();
        });

        it("DELETE/ legajos/archivados - should not valid id", async () => {
            const { status, text } = await request(app).delete(
                `/api/legajos/idNotFound`,
            );

            expect(status).toBe(400);
            expect(text).toBe("El id ingresado no es válido.");
        });

        it("DELETE/ legajos/archivados - should not found Legajo", async () => {
            const {
                status,
                body: { message },
            } = await request(app).delete(`/api/legajos/${randomId}`);

            expect(status).toBe(400);
            expect(message).toBe(
                "El legajo no se encuentra en nuestra base de datos.",
            );
        });

        it("PUT/ legajos/activar/:id - should activate an archivate Legajos", async () => {
            const { status, body: data } = await request(app).put(
                `/api/legajos/activar/${idTemp}`,
            );

            expect(status).toBe(200);
            expect(data.archivado).toBe(false);
            expect(ObjectID.isValid(data.alumno)).toBeTruthy();
            expect(ObjectID.isValid(data.madre)).toBeTruthy();
            expect(ObjectID.isValid(data.padre)).toBeTruthy();
            expect(ObjectID.isValid(data.tutor)).toBeTruthy();
        });

        it("PUT/ legajos/activar/:id - should not valid id", async () => {
            const { status, text } = await request(app).put(
                `/api/legajos/activar/idNotFound`,
            );

            expect(status).toBe(400);
            expect(text).toBe("El id ingresado no es válido.");
        });

        it("PUT/ legajos/activar/:id - should not found Legajos", async () => {
            const {
                status,
                body: { message },
            } = await request(app).put(`/api/legajos/activar/${randomId}`);

            expect(status).toBe(400);
            expect(message).toBe(
                "El legajo no se encuentra en nuestra base de datos.",
            );
        });

        it("PUT/ legajos/:id - should not found Legajos", async () => {
            const {
                status,
                body: { message },
            } = await request(app)
                .put(`/api/legajos/${randomId}`)
                .send(legajoEditJson);

            expect(status).toBe(400);
            expect(message).toBe(
                "El legajo no se encuentra en nuestra base de datos.",
            );
        });

        it("PUT/ legajos/:id - should edit Legajos", async () => {
            const {
                status,
                body: { archivado, alumno, padre, madre, tutor },
            } = await request(app)
                .put(`/api/legajos/${idTemp}`)
                .send(legajoEditJson);

            expect(status).toBe(200);
            expect(archivado).toBe(false);
            expect(alumno.persona).toMatchObject({
                tipoDocumento: "DNI",
                nacionalidad: "AR",
                domicilioPais: "Argentina",
                domicilioProvincia: "Catamarca",
                domicilioNumeroCalle: "456",
                domicilioLaboralProvincia: "Catamarca",
                difunto: false,
                nombres: "nombre alumno2",
                apellidos: "apellido alumno2",
                numeroDocumento: "11111111",
                genero: "Masculino",
                grupoFactor: "A+",
                fechaNacimiento: "2014-10-19T16:36:14.197Z",
                domicilioLocalidad: "capital",
                domicilioCodigoPostal: 4700,
                domicilioBarrio: "25 de agosto",
                domicilioCalle: "Test test otro",
                domicilioPiso: 3,
                domicilioDepartamento: "A",
                contactoTelefono: "383444444",
                contactoTelefonoSec: "383444445",
                contactoCorreo: "alumno2@dominio.com.ar",
            });
            expect(padre).toMatchObject({
                tipoDocumento: "DNI",
                nacionalidad: "AR",
                domicilioPais: "Argentina",
                domicilioProvincia: "Catamarca",
                domicilioNumeroCalle: "4444",
                domicilioLaboralProvincia: "Catamarca",
                difunto: false,
                nombres: "nombre padre2",
                apellidos: "apellido padre2",
                numeroDocumento: "22222222",
                genero: "Masculino",
                grupoFactor: "A+",
                fechaNacimiento: "2014-10-19T16:36:14.197Z",
                domicilioLocalidad: "interior padre2",
                domicilioCodigoPostal: 4700,
                domicilioBarrio: "test padre2",
                domicilioCalle: "Test test otro",
                domicilioPiso: 4,
                ocupacion: "Abogado",
                domicilioLaboralLocalidad: "capital",
                domicilioLaboralCodigoPostal: 4700,
                domicilioLaboralCalle: "Test test otro",
                contactoTelefono: "3834434320",
                contactoTelefonoSec: "3834444445",
                contactoCorreo: "padre2@dominio.com.ar",
            });
            expect(madre).toMatchObject({
                tipoDocumento: "DNI",
                nacionalidad: "AR",
                domicilioPais: "Argentina",
                domicilioProvincia: "Catamarca",
                domicilioNumeroCalle: "4444",
                domicilioLaboralProvincia: "Catamarca",
                difunto: false,
                nombres: "nombre madre2",
                apellidos: "apellido madre2",
                numeroDocumento: "33333333",
                genero: "Femenino",
                grupoFactor: "A+",
                fechaNacimiento: "2014-10-19T16:36:14.197Z",
                domicilioLocalidad: "interior madre2",
                domicilioCodigoPostal: 4700,
                domicilioBarrio: "test madre2",
                domicilioCalle: "Test test otro",
                domicilioPiso: 4,
                ocupacion: "Abogado",
                domicilioLaboralLocalidad: "capital",
                domicilioLaboralCodigoPostal: 4700,
                domicilioLaboralCalle: "Test test otro",
                contactoTelefono: "3834434320",
                contactoTelefonoSec: "3834444445",
                contactoCorreo: "madre2@dominio.com.ar",
            });
            expect(tutor.persona).toMatchObject({
                tipoDocumento: "DNI",
                nacionalidad: "AR",
                domicilioPais: "Argentina",
                domicilioProvincia: "Catamarca",
                domicilioNumeroCalle: "4444",
                domicilioLaboralProvincia: "Catamarca",
                difunto: false,
                nombres: "nombre tutor2",
                apellidos: "apellido tutor2",
                numeroDocumento: "44444444",
                genero: "Masculino",
                grupoFactor: "A+",
                fechaNacimiento: "2014-10-19T16:36:14.197Z",
                domicilioLocalidad: "interior tutor2",
                domicilioCodigoPostal: 4700,
                domicilioBarrio: "test tutor2",
                domicilioCalle: "Test test otro",
                domicilioPiso: 4,
                ocupacion: "Abogado",
                domicilioLaboralLocalidad: "capital",
                domicilioLaboralCodigoPostal: 4700,
                domicilioLaboralCalle: "Test test otro",
                contactoTelefono: "3834434320",
                contactoTelefonoSec: "3834444445",
                contactoCorreo: "tutor2@dominio.com.ar",
            });
        });

        it("PUT/ legajos/:id - should edit Legajos - 2", async () => {
            const {
                status,
                body: { archivado, alumno, padre, madre, tutor },
            } = await request(app)
                .put(`/api/legajos/${idTemp}`)
                .send(legajoEdit2Json);

            expect(status).toBe(200);
            expect(archivado).toBe(false);
            expect(alumno.persona).toMatchObject({
                tipoDocumento: "DNI",
                nacionalidad: "AR",
                domicilioPais: "Argentina",
                domicilioProvincia: "Catamarca",
                domicilioNumeroCalle: "456",
                domicilioLaboralProvincia: "Catamarca",
                difunto: false,
                nombres: "nombre alumno3",
                apellidos: "apellido alumno3",
                numeroDocumento: "11111111",
                genero: "Masculino",
                grupoFactor: "A+",
                fechaNacimiento: "2014-10-19T16:36:14.197Z",
                domicilioLocalidad: "capital",
                domicilioCodigoPostal: 4700,
                domicilioBarrio: "25 de agosto",
                domicilioCalle: "Test test otro",
                domicilioPiso: 3,
                domicilioDepartamento: "A",
                contactoTelefono: "383444444",
                contactoTelefonoSec: "383444445",
                contactoCorreo: "alumno3@dominio.com.ar",
            });
            expect(padre).toMatchObject({
                tipoDocumento: "DNI",
                nacionalidad: "AR",
                domicilioPais: "Argentina",
                domicilioProvincia: "Catamarca",
                domicilioNumeroCalle: "4444",
                domicilioLaboralProvincia: "Catamarca",
                difunto: false,
                nombres: "nombre padre3",
                apellidos: "apellido padre3",
                numeroDocumento: "22222222",
                genero: "Masculino",
                grupoFactor: "A+",
                fechaNacimiento: "2014-10-19T16:36:14.197Z",
                domicilioLocalidad: "interior padre3",
                domicilioCodigoPostal: 4700,
                domicilioBarrio: "test padre3",
                domicilioCalle: "Test test otro",
                domicilioPiso: 4,
                ocupacion: "Abogado",
                domicilioLaboralLocalidad: "capital",
                domicilioLaboralCodigoPostal: 4700,
                domicilioLaboralCalle: "Test test otro",
                contactoTelefono: "3834434320",
                contactoTelefonoSec: "3834444445",
                contactoCorreo: "padre3@dominio.com.ar",
            });
            expect(madre).toMatchObject({
                tipoDocumento: "DNI",
                nacionalidad: "AR",
                domicilioPais: "Argentina",
                domicilioProvincia: "Catamarca",
                domicilioNumeroCalle: "4444",
                domicilioLaboralProvincia: "Catamarca",
                difunto: false,
                nombres: "nombre madre3",
                apellidos: "apellido madre3",
                numeroDocumento: "33333333",
                genero: "Femenino",
                grupoFactor: "A+",
                fechaNacimiento: "2014-10-19T16:36:14.197Z",
                domicilioLocalidad: "interior madre3",
                domicilioCodigoPostal: 4700,
                domicilioBarrio: "test madre3",
                domicilioCalle: "Test test otro",
                domicilioPiso: 4,
                ocupacion: "Abogado",
                domicilioLaboralLocalidad: "capital",
                domicilioLaboralCodigoPostal: 4700,
                domicilioLaboralCalle: "Test test otro",
                contactoTelefono: "3834434320",
                contactoTelefonoSec: "3834444445",
                contactoCorreo: "madre3@dominio.com.ar",
            });
            expect(tutor.persona).toMatchObject({
                tipoDocumento: "DNI",
                nacionalidad: "AR",
                domicilioPais: "Argentina",
                domicilioProvincia: "Catamarca",
                domicilioNumeroCalle: "4444",
                domicilioLaboralProvincia: "Catamarca",
                difunto: false,
                nombres: "nombre tutor3",
                apellidos: "apellido tutor3",
                numeroDocumento: "44444444",
                genero: "Masculino",
                grupoFactor: "A+",
                fechaNacimiento: "2014-10-19T16:36:14.197Z",
                domicilioLocalidad: "interior tutor3",
                domicilioCodigoPostal: 4700,
                domicilioBarrio: "test tutor3",
                domicilioCalle: "Test test otro",
                domicilioPiso: 4,
                ocupacion: "Abogado",
                domicilioLaboralLocalidad: "capital",
                domicilioLaboralCodigoPostal: 4700,
                domicilioLaboralCalle: "Test test otro",
                contactoTelefono: "3834434320",
                contactoTelefonoSec: "3834444445",
                contactoCorreo: "tutor3@dominio.com.ar",
            });
        });

        it("GET/ legajos/:id - should return legajo by ID ", async () => {
            const {
                status,
                body: {
                    archivado,
                    alumno,
                    padre: { persona: padre },
                    madre: { persona: madre },
                    tutor,
                },
            } = await request(app).get(`/api/legajos/${idTemp}`);

            expect(status).toBe(200);
            expect(archivado).toBe(false);
            expect(alumno.persona).toMatchObject({
                tipoDocumento: "DNI",
                nacionalidad: "AR",
                domicilioPais: "Argentina",
                domicilioProvincia: "Catamarca",
                domicilioNumeroCalle: "456",
                domicilioLaboralProvincia: "Catamarca",
                difunto: false,
                nombres: "nombre alumno3",
                apellidos: "apellido alumno3",
                numeroDocumento: "11111111",
                genero: "Masculino",
                grupoFactor: "A+",
                fechaNacimiento: "2014-10-19T16:36:14.197Z",
                domicilioLocalidad: "capital",
                domicilioCodigoPostal: 4700,
                domicilioBarrio: "25 de agosto",
                domicilioCalle: "Test test otro",
                domicilioPiso: 3,
                domicilioDepartamento: "A",
                contactoTelefono: "383444444",
                contactoTelefonoSec: "383444445",
                contactoCorreo: "alumno3@dominio.com.ar",
            });
            expect(padre).toMatchObject({
                tipoDocumento: "DNI",
                nacionalidad: "AR",
                domicilioPais: "Argentina",
                domicilioProvincia: "Catamarca",
                domicilioNumeroCalle: "4444",
                domicilioLaboralProvincia: "Catamarca",
                difunto: false,
                nombres: "nombre padre3",
                apellidos: "apellido padre3",
                numeroDocumento: "22222222",
                genero: "Masculino",
                grupoFactor: "A+",
                fechaNacimiento: "2014-10-19T16:36:14.197Z",
                domicilioLocalidad: "interior padre3",
                domicilioCodigoPostal: 4700,
                domicilioBarrio: "test padre3",
                domicilioCalle: "Test test otro",
                domicilioPiso: 4,
                ocupacion: "Abogado",
                domicilioLaboralLocalidad: "capital",
                domicilioLaboralCodigoPostal: 4700,
                domicilioLaboralCalle: "Test test otro",
                contactoTelefono: "3834434320",
                contactoTelefonoSec: "3834444445",
                contactoCorreo: "padre3@dominio.com.ar",
            });
            expect(madre).toMatchObject({
                tipoDocumento: "DNI",
                nacionalidad: "AR",
                domicilioPais: "Argentina",
                domicilioProvincia: "Catamarca",
                domicilioNumeroCalle: "4444",
                domicilioLaboralProvincia: "Catamarca",
                difunto: false,
                nombres: "nombre madre3",
                apellidos: "apellido madre3",
                numeroDocumento: "33333333",
                genero: "Femenino",
                grupoFactor: "A+",
                fechaNacimiento: "2014-10-19T16:36:14.197Z",
                domicilioLocalidad: "interior madre3",
                domicilioCodigoPostal: 4700,
                domicilioBarrio: "test madre3",
                domicilioCalle: "Test test otro",
                domicilioPiso: 4,
                ocupacion: "Abogado",
                domicilioLaboralLocalidad: "capital",
                domicilioLaboralCodigoPostal: 4700,
                domicilioLaboralCalle: "Test test otro",
                contactoTelefono: "3834434320",
                contactoTelefonoSec: "3834444445",
                contactoCorreo: "madre3@dominio.com.ar",
            });
            expect(tutor.persona).toMatchObject({
                tipoDocumento: "DNI",
                nacionalidad: "AR",
                domicilioPais: "Argentina",
                domicilioProvincia: "Catamarca",
                domicilioNumeroCalle: "4444",
                domicilioLaboralProvincia: "Catamarca",
                difunto: false,
                nombres: "nombre tutor3",
                apellidos: "apellido tutor3",
                numeroDocumento: "44444444",
                genero: "Masculino",
                grupoFactor: "A+",
                fechaNacimiento: "2014-10-19T16:36:14.197Z",
                domicilioLocalidad: "interior tutor3",
                domicilioCodigoPostal: 4700,
                domicilioBarrio: "test tutor3",
                domicilioCalle: "Test test otro",
                domicilioPiso: 4,
                ocupacion: "Abogado",
                domicilioLaboralLocalidad: "capital",
                domicilioLaboralCodigoPostal: 4700,
                domicilioLaboralCalle: "Test test otro",
                contactoTelefono: "3834434320",
                contactoTelefonoSec: "3834444445",
                contactoCorreo: "tutor3@dominio.com.ar",
            });
        });
    });

    describe("Booleans in legajo", () => {
        let idTemp = "";
        let idAlumnoTemp = "";
        let idMadreTemp = "";
        let idTutorTemp = "";
        let idCursoTemp = "";

        it("POST/ legajos - should create Legajo whit padre null", async () => {
            legajoVersion2Json.alumno.persona.numeroDocumento = "11111112";
            legajoVersion2Json.tutor.persona.numeroDocumento = "44444443";
            const { status, body: legajo } = await request(app)
                .post("/api/legajos")
                .send(legajoVersion2Json);

            expect(status).toBe(201);
            expect(legajo.documentos).toBeInstanceOf(Array);
            expect(legajo.archivado).toBe(false);
            expect(ObjectID.isValid(legajo.alumno)).toBeTruthy();
            expect(legajo.padre).toBe(null);
            expect(ObjectID.isValid(legajo.madre)).toBeTruthy();
            expect(ObjectID.isValid(legajo.tutor)).toBeTruthy();
            idTemp = legajo._id;
        });

        it("GET/ legajos - should return Legajo by id", async () => {
            const {
                status,
                body: { alumno, padre, madre, tutor },
            } = await request(app).get(`/api/legajos/${idTemp}`);

            expect(status).toBe(200);
            expect(padre.sin_info_persona).toBe(true);
            expect(padre.sin_info_domicilio_laboral).toBe(false);
            expect(padre.persona).toBe(null);
            expect(madre.sin_info_persona).toBe(false);
            expect(madre.sin_info_domicilio_laboral).toBe(false);
            expect(madre.persona).toBeInstanceOf(Object);
            expect(tutor.sin_info_persona).toBe(false);
            expect(tutor.sin_info_domicilio_laboral).toBe(false);
            expect(tutor.persona).toBeInstanceOf(Object);
            idAlumnoTemp = alumno._id;
            idMadreTemp = madre.persona._id;
            idTutorTemp = tutor._id;
        });

        // TODO: si se puede crear usuarios con NOMBRE DE USUARIO repetido - REMOVER
        it("POST/ legajos - should create a same Legajo whit padre null - return same legajo", async () => {
            const {
                status,
                body: { message },
            } = await request(app)
                .post("/api/legajos")
                .send(legajoVersion2Json);

            expect(status).toBe(400);
            expect(message).toBe("El usuario ya existe");
        });

        // TODO: si se puede crear usuarios con NOMBRE DE USUARIO repetido - DESCOMENTAR
        // it("POST/ legajos - should create a same Legajo whit padre null - return same legajo", async () => {
        //     const { status, body: legajo } = await request(app)
        //         .post("/api/legajos")
        //         .send(legajoVersion2Json);

        //     expect(status).toBe(201);
        //     expect(legajo.alumno).toBe(idAlumnoTemp);
        //     expect(legajo.padre).toBe(null);
        //     expect(legajo.madre).toBe(idMadreTemp);
        //     expect(legajo.tutor).toBe(idTutorTemp);
        // });

        // it("POST/ legajos - should create a same Legajo - return same legajo ", async () => {
        //     const { status, body: legajo } = await request(app)
        //         .post("/api/legajos")
        //         .send(legajoVersion2Json);

        //     expect(status).toBe(201);
        //     expect(legajo.alumno).toBe(idAlumnoTemp);
        //     expect(legajo.padre).toBe(null);
        //     expect(legajo.madre).toBe(idMadreTemp);
        //     expect(legajo.tutor).toBe(idTutorTemp);
        // });

        it("POST/ cursos - should create Curso - Need asosiate legajo", async () => {
            const { status, body: data } = await request(app)
                .post("/api/cursos")
                .send(cursoJson);

            expect(status).toBe(201);
            expect(ObjectID.isValid(data._id)).toBeTruthy();
            idCursoTemp = data._id;
        });

        it("PUT/ legajos/asignar/curso - should return Legajo by id whit new curso atribute", async () => {
            const {
                status,
                body: { curso },
            } = await request(app).put(`/api/legajos/asignar/curso`).send({
                legajo: idTemp,
                curso: idCursoTemp,
            });

            expect(status).toBe(200);
            expect(curso).toBe(idCursoTemp);
        });
        it("GET/ legajos - should return Legajo whit new curso atribute", async () => {
            const {
                status,
                body: { curso },
            } = await request(app).get(`/api/legajos/${idTemp}`);

            expect(status).toBe(200);
            expect(curso).toBe(idCursoTemp);
        });
    });

    describe("auth", () => {
        it("POST/ legajos - should return Legajo whit new curso atribute", async () => {
            const {
                status,
                body: { message },
            } = await request(app)
                .post(`/api/auth/forgotpassword`)
                .send({ usuario: "44444443", email:"tutor@dominio.com.ar" });

            expect(status).toBe(200);
            expect(message).toBe(
                "Revise su correo electronico, y siga las instrucciones para procesar el reseteo de su contraseña.",
            );
        });
    });
});
