// Import de dependencias
require("dotenv").config({ path: "variables.env" });
const config = require('config');
const request = require("supertest");
const pckJson = require('../../package.json');

// Import de server y helper
const app = require("../../app");

jest.setTimeout(8000);

describe("GET Health endpoint /health", () => {
    describe("", () => {
        it.skip("should return whit a 200 status code and Siga backend text", async () => {
            const response = await request(app).get("/health").send();
            expect(response.status).toBe(200);
            expect(response.text).toBe({
                app: pckJson.description,
                environment: config.get('environment'),
                version: pckJson.version
        });
        });
    });
});
