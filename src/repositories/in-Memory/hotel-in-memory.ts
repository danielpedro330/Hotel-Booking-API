import { Hotel, Prisma } from "@prisma/client";
import { HotelRepository } from "../hotel-repository";
import { randomUUID } from "node:crypto";

export class InMemoryHotelReposytory implements HotelRepository {
    public items: Hotel[] = []

    async findById(id: string) {
        const hotel = this.items.find(item => item.id == id)
        if (!hotel) {
            return null
        }

        return hotel
    }

    async findByName(name: string) {
         const hotel = this.items.find(item => item.name == name)
        if (!hotel) {
            return null
        }

        return hotel
    }

    async create(data: Prisma.HotelCreateInput){
        const hotel = {
            id: randomUUID(),
            name: data.name,
            location: data.location,
            imageUrl: data.imageUrl ?? null,
            createdAt: new Date()
        }

        this.items.push(hotel)

        return hotel
    }

    async seve(hotel: Hotel) {
        const hotelIndex = await this.items.findIndex(item => item.id == hotel.id)

        if (hotelIndex >= 0) {
            this.items[hotelIndex] = hotel
        }

        return hotel
    }

    async delete(id: string) {
        const hotelIndex = await this.items.findIndex(item => item.id == id)

        if (hotelIndex >= 0) {
            this.items.splice(hotelIndex, 1)
        }

    }

}