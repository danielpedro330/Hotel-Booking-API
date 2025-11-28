import cloudinary from "@/lib/cloudinary";
import { FastifyReply, FastifyRequest } from "fastify";

export async function upload (req: FastifyRequest, reply: FastifyReply) {
    const data = await req.file();

    if (!data) {
      return reply.code(400).send({ error: "Nenhum arquivo enviado" });
    }

    const upload = await cloudinary.uploader.upload_stream(
      {
        folder: "hotel-api",
      },
      (error, result) => {
        if (error) {
          console.log(error);
          return reply.code(500).send({ error: "Erro no upload" });
        }

        return reply.send({
          url: result?.secure_url,
          public_id: result?.public_id,
        });
      }
    );

    data.file.pipe(upload);
  }