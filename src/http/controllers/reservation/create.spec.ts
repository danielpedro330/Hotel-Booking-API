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

describe("Create reservation (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to create reservation", async () => {
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

    const response = await request(app.server)
      .post("/reservations")
      .set("authorization", `Bearer ${token}`)
      .send({
        roomId: room.id,
        startDate: "2025-01-01",
        endDate: "2025-01-03",
        status: "Confirmed",
        userEmail: user.email
      });
 
    expect(response.status).toEqual(201);
    expect(response.body.message).toEqual("Reserva criada com sucesso.");
  }, 20000);
});
