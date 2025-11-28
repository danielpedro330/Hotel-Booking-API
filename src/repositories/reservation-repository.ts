import { Reservation, Prisma } from "@prisma/client";

export interface ReservationRepository {
    findById(id: string): Promise<Reservation | null>
    findOverlapping(roomId: string, startDate: Date, endDate: Date): Promise<Reservation[]>
    cancel(id: string): Promise<Reservation | null>
    create(data: Prisma.ReservationCreateInput): Promise<Reservation>
    save(reservation: Reservation): Promise<Reservation>
    delete(id: string): Promise<void>
}