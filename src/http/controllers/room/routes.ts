import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { createRoom } from "./create";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

export function roomRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app.post('/room',{ onRequest: [verifyUserRole("ADMIN")] } ,createRoom)
}