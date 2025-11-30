import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { createHotel } from "./create";

export function hotelRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app.post('/hotel', createHotel)
}