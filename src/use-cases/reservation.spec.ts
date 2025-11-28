import { InMemoryReservationRepository } from "@/repositories/in-Memory/reservation-in-memory";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ReservationUseCase } from "./reservation";
import { Status } from "@/enum/status";
import { mailer } from "@/lib/mailer";
import { RoomUnavailableError } from "./error/room-unavailable-error";

vi.mock("@/lib/mailer", () => ({
    mailer: {
        sendMail: vi.fn(),
    },
}));

let reservationRepository: InMemoryReservationRepository;
let sut: ReservationUseCase;

describe("Reservation Use Case", () => {
    beforeEach(() => {
        reservationRepository = new InMemoryReservationRepository();
        sut = new ReservationUseCase(reservationRepository);

        vi.clearAllMocks();
    });

    it("should be able create a reservation successfully", async () => {
        const { reservation } = await sut.execute({
            roomId: "2",
            userEmail: "daniel@gmail.com",
            userId: "22",
            startDate: new Date("2022-01-22"),
            endDate: new Date("2022-01-26"),
            status: Status.confirmed,
        });

        expect(reservation).toBeDefined();
        expect(reservation.roomId).toEqual("2");
        expect(reservation.userId).toEqual("22");
        expect(reservation.status).toEqual(Status.confirmed);

        // Email enviado
        expect(mailer.sendMail).toHaveBeenCalledOnce();
        expect(mailer.sendMail).toHaveBeenCalledWith(
            expect.objectContaining({
                to: "daniel@gmail.com",
                subject: "Reservation Confirmed",
            })
        );
    });

    it("should not be able allow overlapping reservations", async () => {
        await reservationRepository.create({
            user: { connect: { id: "22" } },
            room: { connect: { id: "2" } },
            startDate: new Date("2022-01-20"),
            endDate: new Date("2022-01-25"),
            status: Status.confirmed,
        });

        await expect(
            sut.execute({
                roomId: "2",
                userEmail: "test@example.com",
                userId: "22",
                startDate: new Date("2022-01-22"),
                endDate: new Date("2022-01-26"),
                status: Status.confirmed,
            })
        ).rejects.toBeInstanceOf(RoomUnavailableError);
    });

    it("should be able call repository.create with correct data", async () => {
        const createSpy = vi.spyOn(reservationRepository, "create");

        await sut.execute({
            roomId: "2",
            userEmail: "x@gmail.com",
            userId: "22",
            startDate: new Date("2022-02-10"),
            endDate: new Date("2022-02-12"),
            status: Status.pending,
        });

        expect(createSpy).toHaveBeenCalledOnce();
        expect(createSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                startDate: new Date("2022-02-10"),
                endDate: new Date("2022-02-12"),
                status: Status.pending,
                user: { connect: { id: "22" } },
                room: { connect: { id: "2" } },
            })
        );
    });
});
