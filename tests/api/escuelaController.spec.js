require("dotenv").config({ path: "variables.env" });
const request = require("supertest");
const { ObjectID } = require("mongodb");
const mongoose = require("mongoose");

// Import de server y helper
const app = require("../../app");
const helper = require("../helpers/helper");

// Import json's
const escuelaJson = require("../mocks/escuelas/escuela.json");

jest.setTimeout(100000);

describe("API Escuelas /", () => {
    beforeAll(async () => {
        await helper.testDbConnect();
        //await Legajo.deleteMany({});
    });

    afterAll(async () => {
        await helper.testDbDisconnect();
    });

    it("GET/ escuelas - should return array whit 0 Escuelas", async () => {
        const { status, body: data } = await request(app).get("/api/escuelas");
        expect(status).toBe(200);
        expect(data.length).toBe(0);
    });

    it("POST/ escuelas - should create Escuela", async () => {
        const { status, body: data } = await request(app)
            .post("/api/escuelas")
            .send(escuelaJson);
        expect(status).toBe(201);
        expect(ObjectID.isValid(data._id)).toBeTruthy();
        expect(data.nombre).toBe("Fray Mamerto Esquiú");
        expect(data.codigoPostal).toBe("4700");
        expect(data.barrio).toBe("25 de agosto");
        expect(data.calle).toBe("Av. Belgrano");
        expect(data.numeroCalle).toBe("298");
        expect(data.telefono).toBe("4428009");
    });

    it("GET/ escuelas - should return array Escuelas", async () => {
        const { status, body: data } = await request(app).get("/api/escuelas");
        expect(status).toBe(200);
        expect(data.length).toBe(1);
    });
});
