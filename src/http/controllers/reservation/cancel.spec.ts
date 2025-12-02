import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// Mock do envio de e-mail
vi.mock("@/lib/mailer", () => ({
  mailer: {
    sendMail: vi.fn().mockResolvedValue(true)
  }
}));

describe("Cancel reservation (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to cancel reservation", async () => {
  const { token, user } = await createAndAuthenticateUser(app);

  const hotel = await prisma.hotel.create({
    data: {
      id: crypto.randomUUID(),
      name: "Mainga",
      location: "Luanda, Angola"
    }
  });

  const room = await prisma.room.create({
    data: {
      id: crypto.randomUUID(),
      number: "101",
      capacity: 2,
      price: 2000,
      hotelId: hotel.id
    }
  });

  const now = new Date();

  // Reserva daqui a 72h (3 dias) → sempre válida
  const startDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);

  // Termina 2 dias depois
  const endDate = new Date(startDate.getTime() + 48 * 60 * 60 * 1000);

  const reservation = await prisma.reservation.create({
    data: {
      id: crypto.randomUUID(),
      startDate,
      endDate,
      status: "Confirmed",
      roomId: room.id,
      userId: user.id 
    }
  });


  const response = await request(app.server)
    .patch(`/reservations/${reservation.id}/cancel`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      userEmail: 'daniel@gmail.com'
    });

  expect(response.status).toEqual(200);
  expect(response.body.message).toEqual("Reserva cancelada com sucesso.");

}, 20000);
});
