import { ReservationRepository } from "@/repositories/reservation-repository";
import { mailer } from "@/lib/mailer";
import { reservationCanceledTemplate } from "@/templates/reservation-canceled";
import { Reservation } from "@prisma/client";
import { CancelReservationError } from "./error/cancel-reservation-error";

interface CancelReservationUseCaseRequest {
  reservationId: string;
  userEmail: string;
  userId: string
}

interface CancelReservationUseCaseResponse {
  reservation: Reservation;
}

export class CancelReservationUseCase {
  constructor(private _reservationRepository: ReservationRepository) {}

  async execute({
    reservationId,
    userEmail,
    userId
  }: CancelReservationUseCaseRequest): Promise<CancelReservationUseCaseResponse> {

    const reservation = await this._reservationRepository.findById(reservationId);

    if (!reservation) {
      throw new Error("Reservation not found");
    }

    if (reservation.userId !== userId) {
      throw new Error("You are not allowed to cancel this reservation.");
    }

    // regra das 48h
    const now = new Date();
    const diffHours =
      (reservation.startDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 48) {
      throw new CancelReservationError();
    }

    // cancelar no banco
    const canceledReservation = await this._reservationRepository.cancel(reservationId);

    // enviar email
    await mailer.sendMail({
      to: userEmail,
      from: "Hotel Booking <no-reply@hotel.com>",
      subject: "Reservation Canceled",
      html: reservationCanceledTemplate(
        reservation.startDate,
        reservation.endDate
      )
    });

    return { reservation: canceledReservation };
  }
}
