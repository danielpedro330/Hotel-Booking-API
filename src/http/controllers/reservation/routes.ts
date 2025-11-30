import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { createReservation } from "./create";
import { cancelReservation } from "./cancel";

export function reservationRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app.post('/reservations', createReservation)

    app.patch('/reservations /:id/cancel', cancelReservation)
}