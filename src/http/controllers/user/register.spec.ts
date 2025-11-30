import { app } from "@/app";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Register (e2e)", () => {
    beforeAll( async () => {
        await app.ready()
    }, 30000)

    afterAll(async () => {
        await app.close()
    })

    it("Should be able to register a user", async () => {
        const response = await request(app.server).post("/users").send({
            name: "Daniel",
            email: "daniel@gmail.com",
            password: "123456"
        })

        expect(response.status).toEqual(201)
    })
})