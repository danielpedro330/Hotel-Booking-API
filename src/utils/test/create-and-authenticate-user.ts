import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(app: FastifyInstance) {
    const userResponse = await request(app.server).post("/users").send({
        name: 'Daniel',
        email: 'daniel@gmail.com',
        password: '123456'
    })

    const user = userResponse.body.user

    const authResponse = await request(app.server).post("/session").send({
        email: 'daniel@gmail.com',
        password: '123456'
    })

    const {token} = authResponse.body

    return {
        token,
        user
    }
}