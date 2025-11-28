import { Prisma, Room } from "@prisma/client";

export interface RoomRepository {
    findById(id: string): Promise<Room | null>
    create(data: Prisma.RoomCreateInput): Promise<Room>
    seve(room: Room): Promise<Room>
    delete(id: string): Promise<void>
}