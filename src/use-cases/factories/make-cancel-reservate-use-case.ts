import { PrismaReservationRepository } from "@/repositories/prisma/prisma-reservation-repository"
import { CancelReservationUseCase } from "../cancel-reservation"

export function makeCancelReservationUseCase() {
    const reservationRepository = new PrismaReservationRepository()
    const cancelReservationRepository = new CancelReservationUseCase(reservationRepository)

    return cancelReservationRepository
}