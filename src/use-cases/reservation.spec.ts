import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// Mock do envio de e-mail para evitar erro "No recipients defined"
vi.mock("@/lib/mailer", () => ({
  mailer: {
    sendMail: vi.fn().mockResolvedValue(true)
  }
}));

describe("Create reservation (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to create a reservation", async () => {
    // 1️⃣ Cria e autentica usuário
    const { token, user } = await createAndAuthenticateUser(app);

    // 2️⃣ Cria hotel e sala
    const hotel = await prisma.hotel.create({
      data: {
        name: "Mainga",
        location: "Luanda, Angola"
      }
    });

    const room = await prisma.room.create({
      data: {
        number: "101",
        capacity: 2,
        price: 2000,
        hotelId: hotel.id
      }
    });

    // 3️⃣ Faz a requisição para criar a reserva
    const response = await request(app.server)
      .post("/reservations")
      .set("authorization", `Bearer ${token}`)
      .send({
        roomId: room.id,
        startDate: "2025-01-01",
        endDate: "2025-01-03",
        status: "Pending",
        userEmail: user.email
      });

    // 4️⃣ Validações do teste
    expect(response.status).toEqual(201);
    expect(response.body.message).toEqual("Reserva criada com sucesso.");

    // Opcional: verifica no banco
    const reservationInDb = await prisma.reservation.findFirst({
      where: { roomId: room.id, userId: user.id }
    });
    expect(reservationInDb).not.toBeNull();
  }, 20000);
});
