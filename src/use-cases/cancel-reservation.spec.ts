import { describe, it, expect, vi } from "vitest";
import { InMemoryReservationRepository } from "@/repositories/in-Memory/reservation-in-memory";
import { Status } from "@/enum/status";
import { CancelReservationUseCase } from "./cancel-reservation";

vi.mock("@/lib/mailer", () => ({
  mailer: {
    sendMail: vi.fn().mockResolvedValue(true)
  }
}));

describe("Cancel Reservation Use Case", () => {
  it("should canel a reservation", async () => {
    const reservationRepository = new InMemoryReservationRepository();

    const sut = new CancelReservationUseCase(reservationRepository);

    const now = new Date();
    
    // Reserva daqui a 72h (3 dias) → sempre válida
    const startDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);

    // Termina 2 dias depois
    const endDate = new Date(startDate.getTime() + 48 * 60 * 60 * 1000);

    const reservation = await reservationRepository.create({
      user: { connect: { id: "user-1" } },
      room: { connect: { id: "room-1" } },
      startDate,
      endDate,
      status: Status.confirmed
    })

    const cancelReservation = await sut.execute({
      userId: "user-1",
      reservationId: reservation.id,
      userEmail: "daniel@gmail.com"
    });

    expect(cancelReservation.reservation.id).toEqual(expect.any(String))
  });
});
