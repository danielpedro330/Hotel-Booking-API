import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "./authenticate";
import { refresh } from "./refresh";

export function userRoutes (app: FastifyInstance) {
    app.post("/users", register)
    app.post("/session", authenticate)

    app.patch("/token/refresh", refresh)
}