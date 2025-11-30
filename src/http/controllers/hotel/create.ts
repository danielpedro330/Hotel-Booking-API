import { makeHotelUseCase } from "@/use-cases/factories/make-hotel-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

function extractField(field: unknown): string | undefined {
    if (!field) return undefined;

    if (Array.isArray(field)) {
        return (field[0] as any).value;
    }

    return (field as any).value;
}

export async function createHotel(request: FastifyRequest, reply: FastifyReply) {
    let file = null;
    let name: string | undefined;
    let location: string | undefined;

    // Caso seja upload multipart
    if (request.isMultipart()) {
        const data = await request.file();

        if (!data) {
            return reply.status(400).send({ error: "Image file is required" });
        }

        function extractField(field: any) {
            if (!field) return undefined;
            if (Array.isArray(field)) return field[0].value?.toString();
            return field.value?.toString();
        }

        name = extractField(data.fields.name);
        location = extractField(data.fields.location);
        file = data;
    }

    // Caso seja JSON
    else {
        const bodySchema = z.object({
            name: z.string(),
            location: z.string(),
            imageUrl: z.string().optional()
        });

        const parsed = bodySchema.parse(request.body);

        name = parsed.name;
        location = parsed.location;

        // Caso exista imageUrl, usa sem upload
        return reply.status(201).send({
            hotel: await makeHotelUseCase().execute({
                name,
                location,
                imageUrl: parsed.imageUrl ?? null,
                file: null
            })
        });
    }

    // Validação final
    const hotelBodySchema = z.object({
        name: z.string(),
        location: z.string(),
    });

    const parsed = hotelBodySchema.parse({ name, location });

    const hotelUseCase = makeHotelUseCase();

    const hotel = await hotelUseCase.execute({
        name: parsed.name,
        location: parsed.location,
        file
    });

    return reply.status(201).send();
}
