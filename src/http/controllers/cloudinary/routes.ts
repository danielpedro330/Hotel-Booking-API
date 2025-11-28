import cloudinary from "@/lib/cloudinary";
import { FastifyInstance } from "fastify";
import { upload } from "./upload";

export async function uploadRoutes(app: FastifyInstance) {
  app.post("/upload", upload);
}
