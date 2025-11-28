import { Room } from "@prisma/client";
import cloudinary from "@/lib/cloudinary";
import { RoomRepository } from "@/repositories/room-repository";

interface RoomUseCaseRequest {
    hotelId: string,
    number: string,  
    capacity: number
    price: number
    file?: { file: NodeJS.ReadableStream };
}

interface RoomUseCaseResponse {
    room: Room;
}

export class RoomUseCase {
    constructor(private _roomRepository: RoomRepository) {}

    async execute({
        hotelId,
        number,  
        capacity,
        price,
        file
    }: RoomUseCaseRequest): Promise<RoomUseCaseResponse> {

        let imageUrl: string | null = null;

        // Se tiver imagem, faz upload no Cloudinary
        if (file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "Rooms" },
                    (err, res) => {
                        if (err) reject(err);
                        else resolve(res);
                    }
                );

                file.file.pipe(stream);
            });

            imageUrl = (uploadResult as any).secure_url;
        }

        const room = await this._roomRepository.create({
            hotel: {
                connect: { id: hotelId }
            },
            number,
            capacity,
            price,
            imageUrl
        });

        return { room };
    }
}
