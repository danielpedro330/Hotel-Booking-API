import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { createHotel } from "./create";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

export function hotelRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app.post('/hotel', { onRequest: [verifyUserRole('ADMIN')] }, createHotel)
}