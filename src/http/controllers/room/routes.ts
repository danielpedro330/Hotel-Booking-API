import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { createRoom } from "./create";

export function roomRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app.post('/room', createRoom)
}