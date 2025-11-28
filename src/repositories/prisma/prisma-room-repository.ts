import { Room, Prisma } from "@prisma/client";
import { RoomRepository } from "../room-repository";
import { prisma } from "@/lib/prisma";

export class PrismaRoomRepository implements RoomRepository {
    async findById(id: string) {
        const room = await prisma.room.findUnique({
            where: {
                id
            }
        })

        return room
    }

    async create(data: Prisma.RoomCreateInput) {
        const room = await prisma.room.create({
            data,
        })

        return room
    }

    async seve(data: Room) {
        const room = await prisma.room.update({
            where: {
                id: data.id
            },
            data
        })

        return room
    }

    async delete(id: string) {
        const room = await prisma.room.delete({
            where: {
                id
            }
        })
    }

}