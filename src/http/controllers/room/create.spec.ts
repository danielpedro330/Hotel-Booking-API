import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import path from "path";
import fs from "fs";
import { prisma } from "@/lib/prisma";


vi.mock("@/lib/cloudinary", () => ({
  default: {
    uploader: {
      upload_stream: (_options: any, callback: any) => {
        callback(null, { secure_url: "https://fake-url.com/hotel.jpg" });
      }
    }
  }
}));


describe("Create Room (e2e)", () => {
  beforeAll(async () => {
    await prisma.$connect()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
    await prisma.$disconnect()
  })


  it("Should be able to create room", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const filePath = path.resolve(__dirname, "hotel-room.jpg");
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "fake image content")

    const hotel = await prisma.hotel.create({
      data: {
        name: "Mainga",
        location: "Luanda, Angola"
      }
    });

    const response = await request(app.server)
    .post("/room")
    .set("Authorization", `Bearer ${token}`)
    .send({
      hotelId: hotel.id,
      number: '999999',
      capacity: 2,
      price: 20000.00,
      imageUrl: "https://fake-url.com/hotel-room.jpg"
    });

    expect(response.status).toEqual(201);
  }, 20000);
});
