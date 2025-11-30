import { makeRoomUseCase } from "@/use-cases/factories/make-room-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function createRoom(request: FastifyRequest, reply: FastifyReply) {
  let hotelId: string;
  let number: string;
  let capacity: number;
  let price: number;
  let file: { file: NodeJS.ReadableStream; filename: string; mimetype: string } | null = null;
  let imageUrl: string | null = null;

  // ====== Multipart ======
  if (request.isMultipart && (await request.isMultipart())) {
    const mp = await request.file();
    if (!mp) return reply.status(400).send({ error: "Image file is required" });

    // Extrai campos do multipart
    const extractField = (f: any) => (Array.isArray(f) ? f[0].value : f?.value)?.toString();
    hotelId = extractField(mp.fields.hotelId) ?? "";
    number = extractField(mp.fields.number) ?? "";

    // Converte para number
    capacity = Number(extractField(mp.fields.capacity));
    price = Number(extractField(mp.fields.price));
    file = { file: mp.file, filename: mp.filename, mimetype: mp.mimetype };

    // Validação zod (após conversão)
    const multipartSchema = z.object({
      hotelId: z.string().min(1),
      number: z.string().min(1),
      capacity: z.number().positive(),
      price: z.number().positive()
    });
    multipartSchema.parse({ hotelId, number, capacity, price });
  } 
  // ====== JSON ======
  else {
    const bodySchema = z.object({
      hotelId: z.string().min(1),
      number: z.string().min(1),
      capacity: z.number().positive(),
      price: z.number().positive(),
      imageUrl: z.string().url().optional()
    });

    const parsed = bodySchema.parse(request.body);
    hotelId = parsed.hotelId;
    number = parsed.number;
    capacity = parsed.capacity;
    price = parsed.price;
    imageUrl = parsed.imageUrl ?? null;
  }

  // ====== Executa Use Case ======
  const room = await makeRoomUseCase().execute({
    hotelId,
    number,
    capacity,
    price,
    file,
    imageUrl
  });
  

  return reply.status(201).send();
}
