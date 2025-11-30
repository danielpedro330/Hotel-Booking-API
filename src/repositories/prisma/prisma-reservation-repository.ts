import { Reservation, Prisma } from "@prisma/client";
import { ReservationRepository } from "../reservation-repository";
import { prisma } from "@/lib/prisma";

export class PrismaReservationRepository implements ReservationRepository {

  async findById(id: string) {
    return prisma.reservation.findUnique({ where: { id } });
  }

  async findOverlapping(roomId: string, startDate: Date, endDate: Date) {
    return prisma.reservation.findMany({
      where: {
        roomId,
        AND: [
          { startDate: { lte: endDate } },
          { endDate: { gte: startDate } }
        ]
      }
    });
  }

  async cancel(id: string) {
    return prisma.reservation.update({
      where: { id },
      data: { status: "Canceled" }
    });
  }

  async create(data: Prisma.ReservationCreateInput) {
    return prisma.reservation.create({ data });
  }

  async save(data: Reservation) {
    return prisma.reservation.update({
      where: { id: data.id },
      data
    });
  }

  async delete(id: string) {
    await prisma.reservation.delete({ where: { id } });
  }
}
