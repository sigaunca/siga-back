require("dotenv").config({ path: "variables.env" });
const request = require("supertest");
const { ObjectID } = require("mongodb");
const mongoose = require("mongoose");

// Import de server y helper
const app = require("../../app");
const helper = require("../helpers/helper");

// Import json's
const tutorTypeJson = require("../mocks/autoridadTypes/tutor.json");
const preceptorTypeJson = require("../mocks/autoridadTypes/preceptor.json");
const profesorTypeJson = require("../mocks/autoridadTypes/profesor.json");
const autoridadGenericJson = require("../mocks/autoridades/autoridadGeneric.json");
const escuelaJson = require("../mocks/escuelas/escuela.json");

jest.setTimeout(100000);

describe("API Escuelas /", () => {
    let escuelaTempId = "";
    let autoridadTypePreceptorTempId = "";
    let autoridadTypeProfesorTempId = "";
    beforeAll(async () => {
        await helper.testDbConnect();
    });

    afterAll(async () => {
        await helper.testDbDisconnect();
    });

    describe("Autoridades Types", () => {
        it("POST/ autoridades/types - should create 'Tutor'", async () => {
            const { status, body } = await request(app)
                .post("/api/autoridades/types")
                .send(tutorTypeJson);

            expect(status).toBe(201);
            expect(body.permisos[0]).toBe("test");
            expect(body.tipoAutoridad).toBe("Tutor");
        });

        it("POST/ autoridades/types - should return all autoridades types whit 'Tutor'", async () => {
            const { status, body } = await request(app).get(
                "/api/autoridades/types/get",
            );

            expect(status).toBe(200);
            expect(body.length).toBe(1);
            expect(body[0].permisos[0]).toBe("test");
            expect(body[0].tipoAutoridad).toBe("Tutor");
        });

        it("POST/ autoridades/types - should create 'Preceptor'", async () => {
            const { status, body } = await request(app)
                .post("/api/autoridades/types")
                .send(preceptorTypeJson);

            expect(status).toBe(201);
            expect(body.permisos[0]).toBe("test");
            expect(body.tipoAutoridad).toBe("Preceptor");
        });

        it("POST/ autoridades/types - should return all autoridades types whit 'Preceptor'", async () => {
            const { status, body } = await request(app).get(
                "/api/autoridades/types/get",
            );

            expect(status).toBe(200);
            expect(body.length).toBe(2);
            expect(body[1].permisos[0]).toBe("test");
            expect(body[1].tipoAutoridad).toBe("Preceptor");
            autoridadTypePreceptorTempId = body[1]._id;
        });

        it("POST/ autoridades/types - should create 'Profesor'", async () => {
            const { status, body } = await request(app)
                .post("/api/autoridades/types")
                .send(profesorTypeJson);

            expect(status).toBe(201);
            expect(body.permisos[0]).toBe("test");
            expect(body.tipoAutoridad).toBe("Profesor");
        });

        it("POST/ autoridades/types - should return all autoridades types whit 'Profesor'", async () => {
            const { status, body } = await request(app).get(
                "/api/autoridades/types/get",
            );

            expect(status).toBe(200);
            expect(body.length).toBe(3);
            expect(body[2].permisos[0]).toBe("test");
            expect(body[2].tipoAutoridad).toBe("Profesor");
            autoridadTypeProfesorTempId = body[2]._id;
        });
    });

    describe("Autoridades", () => {
        it("POST/ escuelas - should create Escuela - Autoridad Need", async () => {
            const { status, body: data } = await request(app)
                .post("/api/escuelas")
                .send(escuelaJson);
            expect(status).toBe(201);
        });

        it("GET/ escuelas - should return id escuela before create", async () => {
            const { status, body: data } = await request(app).get(
                "/api/escuelas",
            );
            expect(status).toBe(200);
            expect(data.length).toBe(1);
            escuelaTempId = data[0]._id;
        });

        it("POST/ autoridades/ - should create autoridad 'Preceptor''", async () => {
            autoridadGenericJson.tipoAutoridad = autoridadTypePreceptorTempId;
            autoridadGenericJson.escuela = escuelaTempId;

            const { status, body: autoridad } = await request(app)
                .post("/api/autoridades/")
                .send(autoridadGenericJson);

            expect(status).toBe(201);
            expect(ObjectID.isValid(autoridad._id)).toBeTruthy();
            expect(ObjectID.isValid(autoridad.persona)).toBeTruthy();
            expect(ObjectID.isValid(autoridad.tipo)).toBeTruthy();
            expect(autoridad.tipo).toBe(autoridadTypePreceptorTempId);
            expect(ObjectID.isValid(autoridad.escuela)).toBeTruthy();
            expect(autoridad.escuela).toBe(escuelaTempId);
            expect(autoridad.cursos).toBeInstanceOf(Array);
            expect(autoridad.alumnos).toBeInstanceOf(Array);
        });

        it("POST/ autoridades/ - should return already exist'", async () => {
            autoridadGenericJson.tipoAutoridad = autoridadTypePreceptorTempId;
            autoridadGenericJson.escuela = escuelaTempId;

            const { status, body } = await request(app)
                .post("/api/autoridades/")
                .send(autoridadGenericJson);

            expect(status).toBe(400);
            expect(body.message).toBe(
                `La persona con numero de documento: ${autoridadGenericJson.persona.numeroDocumento} ya corresponde a una autoridad en la base de datos.`,
            );
        });

        it("POST/ autoridades/ - should create autoridad 'Profesor''", async () => {
            autoridadGenericJson.tipoAutoridad = autoridadTypeProfesorTempId;
            autoridadGenericJson.escuela = escuelaTempId;
            autoridadGenericJson.persona.numeroDocumento = "12345678";

            const { status, body: autoridad } = await request(app)
                .post("/api/autoridades/")
                .send(autoridadGenericJson);

            expect(status).toBe(201);
            expect(ObjectID.isValid(autoridad._id)).toBeTruthy();
            expect(ObjectID.isValid(autoridad.persona)).toBeTruthy();
            expect(ObjectID.isValid(autoridad.tipo)).toBeTruthy();
            expect(autoridad.tipo).toBe(autoridadTypeProfesorTempId);
            expect(ObjectID.isValid(autoridad.escuela)).toBeTruthy();
            expect(autoridad.escuela).toBe(escuelaTempId);
            expect(autoridad.cursos).toBeInstanceOf(Array);
            expect(autoridad.alumnos).toBeInstanceOf(Array);
        });
    });
});
