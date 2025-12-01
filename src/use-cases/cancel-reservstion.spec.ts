import { describe, it, expect, vi, beforeEach } from "vitest";
import { CancelReservationUseCase } from "./cancel-reservation";
import { CancelReservationError } from "./error/cancel-reservation-error";
import { mailer } from "@/lib/mailer";

vi.mock("@/lib/mailer", () => ({
  mailer: {
    sendMail: vi.fn()
  }
}));

function createFakeRepository() {
  return {
    findById: vi.fn(),
    cancel: vi.fn()
  };
}

describe("Cancel Reservation Use Case", () => {
  let reservationRepository: any;
  let sut: CancelReservationUseCase;

  beforeEach(() => {
    reservationRepository = createFakeRepository();
    sut = new CancelReservationUseCase(reservationRepository);
    vi.clearAllMocks();
  });

  it("Should be able to successfully cancel the reservation and send an email.", async () => {
    const futureStart = new Date(Date.now() + 72 * 60 * 60 * 1000); // +72h
    const futureEnd = new Date(Date.now() + 96 * 60 * 60 * 1000);

    const fakeReservation = {
      id: "res_01",
      startDate: futureStart,
      endDate: futureEnd,
      userId: "1"
    };

    reservationRepository.findById.mockResolvedValue(fakeReservation);
    reservationRepository.cancel.mockResolvedValue(fakeReservation);

    const result = await sut.execute({
      reservationId: "res_01",
      userEmail: "daniel@gmail.com",
      userId: "1"
    });

    expect(result.reservation).toEqual(fakeReservation);
    expect(reservationRepository.findById).toHaveBeenCalledWith("res_01");
    expect(reservationRepository.cancel).toHaveBeenCalledWith("res_01");
    expect(mailer.sendMail).toHaveBeenCalledOnce();
  });

  it("Should be possible to throw an error if the reservation does not exist.", async () => {
    reservationRepository.findById.mockResolvedValue(null);

    await expect(
      sut.execute({
        reservationId: "invalid",
        userEmail: "daniel@gmail.com",
        userId: "1"
      })
    ).rejects.toThrowError("Reservation not found");
  });

  it("It should not be able to cancel with less than 48 hours notice.", async () => {
    const startSoon = new Date(Date.now() + 10 * 60 * 60 * 1000); // +10h
    const endSoon = new Date(Date.now() + 20 * 60 * 60 * 1000);

    reservationRepository.findById.mockResolvedValue({
      id: "res_02",
      startDate: startSoon,
      endDate: endSoon,
      userId: "1"
    });

    await expect(
      sut.execute({
        reservationId: "res_02",
        userEmail: "daniel@gmail.com",
        userId: "1"
      })
    ).rejects.toBeInstanceOf(CancelReservationError);

    expect(reservationRepository.cancel).not.toHaveBeenCalled();
    expect(mailer.sendMail).not.toHaveBeenCalled();
  });
});
