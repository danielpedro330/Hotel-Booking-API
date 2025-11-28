import { Reservation, Prisma } from "@prisma/client";
import { ReservationRepository } from "../reservation-repository";
import { prisma } from "@/lib/prisma";

export class PrismaReservationRepository implements ReservationRepository {
    async findById(id: string) {
        const reservation = await prisma.reservation.findUnique({
            where: {
                id
            }
        })

        return reservation
    }

    async findOverlapping(roomId: string, startDate: Date, endDate: Date) {
        const reservation = await prisma.reservation.findMany({
            where: {
                roomId,
                startDate,
                endDate
            }
        })

        return reservation
    }

    async cancel(id: string) {
        const reservation = await prisma.reservation.findUnique({
            where: {
                id
            }
        })

        return reservation
    }

    async create(data: Prisma.ReservationCreateInput) {
        const reservation = await prisma.reservation.create({
            data,
        })

        return reservation
    }

    async save(data: Reservation) {
        const reservation = await prisma.reservation.update({
            where: {
                id: data.id,
            },
            data
        })

        return reservation
    }

    async delete(id: string) {
        const reservation = await prisma.reservation.delete({
            where: {
                id
            }
        })
    }

}