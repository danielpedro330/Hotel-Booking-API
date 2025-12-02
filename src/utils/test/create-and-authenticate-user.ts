import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(app: FastifyInstance, isAdmin = false) {
    const user = await prisma.user.create({
        data: {
            name: 'Daniel',
            email: `daniel@gmail${randomUUID()}.com`,
            password: await hash('123456', 6),
            role: isAdmin ? 'ADMIN' : 'MEMBER'
        }
    })

    const authResponse = await request(app.server).post("/session").send({
        email: user.email,
        password: '123456'
    })

    const {token} = await authResponse.body

    return {
        token,
        user,
    }
}