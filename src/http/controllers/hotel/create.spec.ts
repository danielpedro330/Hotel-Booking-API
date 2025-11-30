import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import path from "path";

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
        await app.ready();
    }, 30000);

    afterAll(async () => {
        await app.close();
    });

    it("Should be able to create hotel", async () => {
        const { token } = await createAndAuthenticateUser(app);

        const filePath = path.resolve(__dirname, "hotel.jpg"); // coloca qualquer imagem na pasta do teste

        const response = await request(app.server)
            .post("/hotel")
            .set("authorization", `Bearer ${token}`)
            .field("name", "Mainga")
            .field("location", "Baixa de Luanda")
            .attach("file", filePath);  // ← MULTIPART AQUI

        expect(response.status).toEqual(201);
    }, 20000);
});
