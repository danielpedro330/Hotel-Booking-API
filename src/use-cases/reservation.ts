import { Status } from "@/enum/status";
import { ReservationRepository } from "@/repositories/reservation-repository";
import { Reservation } from "@prisma/client";
import { mailer } from "@/lib/mailer";
import { reservationConfirmedTemplate } from "@/templates/reservation-confirmed";
import { RoomUnavailableError } from "./error/room-unavailable-error";

interface ReservationUseCaseRequest {
    userId: string;
    userEmail: string;
    roomId: string;
    startDate: Date;
    endDate: Date;
    status: Status;
}

interface ReservationUseCaseResponse {
    reservation: Reservation;
}

export class ReservationUseCase {
    constructor(
        private _reservationRepository: ReservationRepository,
    ) {}

    async execute({
        userId,
        userEmail,
        roomId,
        startDate,
        endDate,
        status
    }: ReservationUseCaseRequest): Promise<ReservationUseCaseResponse> {

        // 1. Verificar disponibilidade antes de reservar
        const overlapping = await this._reservationRepository.findOverlapping(
            roomId,
            startDate,
            endDate
        );

        if (overlapping.length > 0) {
            throw new RoomUnavailableError();
        }

        // 2. Criar reserva
        const reservation = await this._reservationRepository.create({
            user: {
                connect: { id: userId }
            },
            room: {
                connect: { id: roomId }
            },
            startDate,
            endDate,
            status
        });

        if (!userEmail) {
            throw new Error("No recipients defined");
        }

        // 3. Enviar e-mail somente DEPOIS de criar a reserva
        await mailer.sendMail({
            to: userEmail,
            from: "Hotel Booking <no-reply@hotel.com>",
            subject: "Reservation Confirmed",
            html: reservationConfirmedTemplate(startDate, endDate),
        });

        return { reservation };
    }
}
