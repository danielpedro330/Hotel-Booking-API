import { Room, Prisma } from "@prisma/client";
import { RoomRepository } from "../room-repository";
import { randomUUID } from "node:crypto";

export class InMemoryRoomReposytory implements RoomRepository {
    public items: Room[] = []

    async findById(id: string) {
        const room = await this.items.find(item => item.id === id)
        if (!room) {
            return null
        }

        return room
    }

    async create(data: Prisma.RoomCreateInput) {
        const room = {
            id: randomUUID(),
            hotelId: data.hotel.connect!.id ?? '',
            number: data.number,
            price: data.price,
            capacity: data.capacity,
            imageUrl: data.imageUrl ?? null
        }
        
        this.items.push(room)

        return room
    }

    async seve(hotel: Room){
        const roomIndex = await this.items.findIndex( item => item.id === hotel.id)
        if (roomIndex >= 0) {
            this.items[roomIndex] = hotel
        }

        return hotel
    }

    async delete(id: string) {
         const roomIndex = await this.items.findIndex( item => item.id === id)

         this.items.splice(roomIndex, 1)
    }

}