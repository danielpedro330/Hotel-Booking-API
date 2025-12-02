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


describe("Create Hotel (e2e)", () => {
  beforeAll(async () => {
    await prisma.$connect()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
    await prisma.$disconnect()
  })


  it("Should be able to create hotel", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const filePath = path.resolve(__dirname, "hotel.jpg");
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "fake image content")

    const response = await request(app.server)
    .post("/hotel")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Mainga",
      location: "Baixa de Luanda",
      imageUrl: "https://fake-url.com/hotel.jpg"
    });

    expect(response.status).toEqual(201);
  }, 20000);
});
