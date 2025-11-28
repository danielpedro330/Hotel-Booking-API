import { PrismaRoomRepository } from "@/repositories/prisma/prisma-room-repository"
import { RoomUseCase } from "../create-room"

export function makeRoomUseCase() {
    const roomRepository = new PrismaRoomRepository()
    const roomUseCase = new RoomUseCase(roomRepository)

    return roomUseCase
}