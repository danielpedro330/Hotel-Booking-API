import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import path from "path";

vi.mock("@/lib/cloudinary", () => ({
  default: {
    uploader: {
      upload_stream: (_options: any, callback: any) => {
        callback(null, { secure_url: "https://fake-url.com/hotel-room.jpg" });
      }
    }
  }
}));

describe("Create Room (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to create room", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const hotel = await prisma.hotel.create({
      data: {
        name: "Test Hotel",
        location: "Luanda"
      },
    });

    const filePath = path.resolve(__dirname, "hotel-room.jpg");

    const response = await request(app.server)
      .post("/room")
      .set("authorization", `Bearer ${token}`)
      .field("hotelId", hotel.id)  
      .field("number", "9999999")
      .field("capacity", "3")
      .field("price", "2000.00")
      .attach("file", filePath);

    expect(response.status).toEqual(201);
  }, 20000);
});
