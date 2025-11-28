import { PrismaReservationRepository } from "@/repositories/prisma/prisma-reservation-repository"
import { ReservationUseCase } from "../reservation"

export function makeReservationUseCase() {
    const reservationRepository = new PrismaReservationRepository()
    const reservationUseCase = new ReservationUseCase(reservationRepository)

    return reservationUseCase
}