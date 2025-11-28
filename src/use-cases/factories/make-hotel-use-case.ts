import { PrismaHotelRepository } from "@/repositories/prisma/prisma-hotel-respository";
import { HotelUseCase } from "../create-hotel";

export function makeHotelUseCase() {
    const hotelRepository = new PrismaHotelRepository()
    const hotelUseCase = new HotelUseCase(hotelRepository)

    return hotelUseCase
}