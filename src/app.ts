import fastify from "fastify"
import multipart from "@fastify/multipart"
import { uploadRoutes } from "./http/controllers/cloudinary/routes";

export const app = fastify()

app.register(uploadRoutes)

app.register(multipart, {
  limits: {
    fileSize: 10_000_000,
  },
});