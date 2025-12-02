import { describe, it, expect, vi } from "vitest";
import { ReservationUseCase } from "./reservation";
import { InMemoryReservationRepository } from "@/repositories/in-Memory/reservation-in-memory";
import { Status } from "@/enum/status";

vi.mock("@/lib/mailer", () => ({
  mailer: {
    sendMail: vi.fn().mockResolvedValue(true)
  }
}));

describe("Reservation Use Case", () => {
  it("should to be able create a reservation", async () => {
    const reservationRepository = new InMemoryReservationRepository();

    const sut = new ReservationUseCase(reservationRepository);

    const {reservation} = await sut.execute({
      userId: "user-1",
      roomId: "room-1",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-01-03"),
      userEmail: "daniel@gmail.com",
      status: Status.confirmed
    });

    expect(reservation.id).toEqual(expect.any(String))
  });
});
