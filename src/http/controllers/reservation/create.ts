import { Status } from "@/enum/status";
import { prisma } from "@/lib/prisma";
import { makeReservationUseCase } from "@/use-cases/factories/make-reservation-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function createReservation(request: FastifyRequest, reply: FastifyReply) {
  // Schema da requisição (sem userEmail)
  const reservationBodySchema = z.object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    status: z.nativeEnum(Status),
    roomId: z.string().uuid("Invalid roomId format")
  });

  const { startDate, endDate, status, roomId } = reservationBodySchema.parse(request.body);

  const userId = request.user.sub;

  // Busca usuário no banco
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || !user.email) {
    return reply.status(400).send({
      message: "Erro ao criar reserva.",
      error: "Usuário não encontrado ou sem e-mail cadastrado"
    });
  }
  
  try {
    const reservationUseCase = makeReservationUseCase();

    await reservationUseCase.execute({
      startDate,
      endDate,
      status,
      roomId,
      userEmail: user.email,
      userId
    });

    return reply.status(201).send({ message: "Reserva criada com sucesso." });
  } catch (error) {
    console.error(error);

    return reply.status(400).send({
      message: "Erro ao criar reserva.",
      error: error instanceof Error ? error.message : error
    });
  }
}
