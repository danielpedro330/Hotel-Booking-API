import fastify from "fastify"
import multipart from "@fastify/multipart"
import { uploadRoutes } from "./http/controllers/cloudinary/routes";
import fastifyJwt from "@fastify/jwt";
import {env} from "./env"
import { userRoutes } from "./http/controllers/user/routes";
import fastifyCookie from "@fastify/cookie";
import { hotelRoutes } from "./http/controllers/hotel/routes";
import { roomRoutes } from "./http/controllers/room/routes";
import { reservationRoutes } from "./http/controllers/reservation/routes";


export const app = fastify()

app.register(multipart, {
  limits: {
    fileSize: 10_000_000,
  },
  attachFieldsToBody: false,
});

app.register(fastifyJwt,{
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false
  },
  sign: {
    expiresIn: '10m'
  }
})

app.register(fastifyCookie)

app.register(userRoutes)
app.register(uploadRoutes)
app.register(hotelRoutes)
app.register(roomRoutes)
app.register(reservationRoutes)
