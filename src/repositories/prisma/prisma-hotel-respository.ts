import { Hotel, Prisma } from "@prisma/client";
import { HotelRepository } from "../hotel-repository";
import { prisma } from "@/lib/prisma";

export class PrismaHotelRepository implements HotelRepository {
    async findById(id: string) {
        const hotel = await prisma.hotel.findUnique({
            where: {
                id
            }
        })

        return hotel
    }

    async findByName(name: string) {
        const hotel = await prisma.hotel.findFirst({
            where: {
                name
            }
        })

        return hotel
    }

    async create(data: Prisma.HotelCreateInput) {
        const hotel = await prisma.hotel.create({
            data,
        })

        return hotel
    }

    async seve(data: Hotel) {
        const hotel = await prisma.hotel.update({
            where: {
                id: data.id
            },
            data
        })

        return hotel
    }

    async delete(id: string) {
        const hotel = await prisma.hotel.delete({
            where: {
                id
            }
        })
    }

}