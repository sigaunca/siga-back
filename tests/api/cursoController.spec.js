require("dotenv").config({ path: "variables.env" });
const request = require("supertest");
const { ObjectID } = require("mongodb");
const mongoose = require("mongoose");

// Import de server y helper
const app = require("../../app");
const helper = require("../helpers/helper");

// Import json's
const cursoJson = require("../mocks/cursos/curso.json");
const cursoEditJson = require("../mocks/cursos/curso-edit.json");

jest.setTimeout(100000);

describe("API Cursos /", () => {
    let idTemp = "";
    beforeAll(async () => {
        await helper.testDbConnect();
        //await Legajo.deleteMany({});
    });

    afterAll(async () => {
        await helper.testDbDisconnect();
    });

    it("GET/ cursos - should return array whit 0 Cursos", async () => {
        const { status, body: data } = await request(app).get("/api/cursos");

        expect(status).toBe(200);
        expect(data.length).toBe(0);
    });

    it("POST/ cursos - should create Curso", async () => {
        const { status, body: data } = await request(app)
            .post("/api/cursos")
            .send(cursoJson);

        expect(status).toBe(201);
        expect(ObjectID.isValid(data._id)).toBeTruthy();
        //expect(data.escuela).toBe("61dca68d21f43d935e63949a");
        //expect(data.preceptor).toBe("61d9e263efa456561cccc524");
        expect(data.nivel).toBe("Primario");
        expect(data.anio).toBe("2");
        expect(data.seccion).toBe("A");
        expect(data.turno).toBe("Mañana");
        expect(data.asistenciaEstado).toBe(false);
        idTemp = data._id;
    });

    it("GET/ cursos - should return array Cursos", async () => {
        const { status, body: data } = await request(app).get("/api/cursos");

        expect(status).toBe(200);
        expect(data.length).toBe(1);
    });

    it("POST/ cursos - should edit Curso with true data", async () => {
        const { status, body: data } = await request(app)
            .put(`/api/cursos/${idTemp}`)
            .send(cursoEditJson);

        expect(status).toBe(200);
        expect(ObjectID.isValid(data._id)).toBeTruthy();
        //expect(data.escuela).toBe("61dca68d21f43d935e63949a");
        //expect(data.preceptor).toBe("61d9e263efa456561cccc524");
        expect(data.nivel).toBe("Secundario");
        expect(data.anio).toBe("3");
        expect(data.seccion).toBe("B");
        expect(data.turno).toBe("Tarde");
        expect(data.asistenciaEstado).toBe(false);
    });

    it("GET/ cursos - should return array Cursos - length 1", async () => {
        const { status, body: data } = await request(app).get("/api/cursos");

        expect(status).toBe(200);
        expect(data.length).toBe(1);
    });

    it("GET/ cursos - should delete Curso", async () => {
        const { status, body: data } = await request(app).delete(
            `/api/cursos/${idTemp}`,
        );

        expect(status).toBe(200);
        expect(ObjectID.isValid(data._id)).toBeTruthy();
        //expect(data.escuela).toBe("61dca68d21f43d935e63949a");
        //expect(data.preceptor).toBe("61d9e263efa456561cccc524");
        expect(data.nivel).toBe("Secundario");
        expect(data.anio).toBe("3");
        expect(data.seccion).toBe("B");
        expect(data.turno).toBe("Tarde");
        expect(data.asistenciaEstado).toBe(false);
    });

    it("GET/ cursos - should return array Cursos - length 0", async () => {
        const { status, body: data } = await request(app).get("/api/cursos");

        expect(status).toBe(200);
        expect(data.length).toBe(0);
    });

    // TODO: añadir test obtener por AUTORIDAD, Crear Autoridad, crear escuela (traer de autoridadController.spec.js)
});
