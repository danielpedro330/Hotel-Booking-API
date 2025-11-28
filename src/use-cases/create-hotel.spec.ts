
import { beforeEach, describe, expect, it } from "vitest";
import { HotelUseCase } from "./create-hotel";
import { InMemoryHotelReposytory } from "@/repositories/in-Memory/hotel-in-memory";

let hotelRepository: InMemoryHotelReposytory
let sut: HotelUseCase

describe("Create Hotel Use Cases", () => {
    beforeEach(() => {
        hotelRepository = new InMemoryHotelReposytory()
        sut = new HotelUseCase(hotelRepository)
    })

    it("Should be able create a hotel", async () => {
        const {hotel} = await sut.execute({
            name: "Mainga",
            location: "Angola, Luanda"
        })

        expect(hotel.id).toEqual(expect.any(String))
    })
})