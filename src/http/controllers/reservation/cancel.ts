import { makeCancelReservationUseCase } from "@/use-cases/factories/make-cancel-reservate-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function cancelReservation(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  const cancelReservationBodySchema = z.object({
    userEmail: z.string().email()
  })

  const { id } = paramsSchema.parse(request.params);
  const { userEmail } = cancelReservationBodySchema.parse(request.body)

  const cancelReservationUseCase = makeCancelReservationUseCase();

  await cancelReservationUseCase.execute({
    reservationId: id,
    userEmail,
    userId: request.user.sub, // saber quem está cancelando
  });

  return reply.status(204).send(); // 204 = cancelado sem retornar conteúdo
}
