import { Reservation, Prisma } from "@prisma/client";
import { ReservationRepository } from "../reservation-repository";
import { randomUUID } from "node:crypto";
import { CancelReservationError } from "@/use-cases/error/cancel-reservation-error";

export class InMemoryReservationRepository implements ReservationRepository {
    public items: Reservation[] = []

    async findById(id: string) {
        const reservation = await this.items.find(item => item.id === id)
        if (!reservation) {
            return null
        }

        return reservation
    }

    async findOverlapping(roomId: string, startDate: Date, endDate: Date): Promise<Reservation[]> {
        const reservation = await this.items.filter(item => item.roomId === roomId && item.startDate <= startDate && item.endDate <= endDate)

        return reservation
    }
    async cancel(id: string): Promise<Reservation> {
        const reservation = await this.items.find(item => item.id === id)
        if (!reservation) {
            throw new CancelReservationError()
        }

        return reservation 
    }

    async create(data: Prisma.ReservationCreateInput) {
        const reservation = {
            id: randomUUID(),
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            status: data.status,
            userId: data.user.connect!.id ?? '',
            roomId: data.room.connect!.id ?? '',
            createdAt: new Date(),
        }

        this.items.push(reservation)
      
        return reservation
    }

    async save(reservation: Reservation) {
        const reservationIndex = await this.items.findIndex(item => item.id === reservation.id)

        if (reservationIndex >= 0) {
            this.items[reservationIndex] = reservation
        }

        return reservation
    }

    async delete(id: string) {
        const reservationIndex = await this.items.findIndex(item => item.id === id)

        if (reservationIndex >= 0) {
            this.items.splice(reservationIndex, 1)
        }
    }

}