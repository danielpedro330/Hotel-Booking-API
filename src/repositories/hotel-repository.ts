import { Hotel, Prisma } from "@prisma/client";

export interface HotelRepository {
    findById(id: string): Promise<Hotel | null>
    findByName(name: string): Promise<Hotel | null>
    create(data: Prisma.HotelCreateInput): Promise<Hotel>
    seve(hotel: Hotel): Promise<Hotel>
    delete(id: string): Promise<void>
}