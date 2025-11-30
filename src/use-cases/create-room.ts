import { Room } from "@prisma/client";
import cloudinary from "@/lib/cloudinary";
import { RoomRepository } from "@/repositories/room-repository";

interface RoomUseCaseRequest {
    hotelId: string,
    number: string,  
    capacity: number
    price: number
    file?: { file: NodeJS.ReadableStream } | null; // multipart
    imageUrl?: string | null; // criação via JSON
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
        file,
        imageUrl
    }: RoomUseCaseRequest): Promise<RoomUseCaseResponse> {

        let finalImageUrl: string | null = imageUrl ?? null;
        
        // → Se houver arquivo, envia para Cloudinary
        if (file?.file) {
            const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
                const upload = cloudinary.uploader.upload_stream(
                    { folder: "hotels" },
                    (err, res) => {
                        if (err) return reject(err);
                        resolve(res as { secure_url: string });
                    }
                );

                file.file.pipe(upload);
            });

            finalImageUrl = uploadResult.secure_url;
        }

        const room = await this._roomRepository.create({
            hotel: {
                connect: { id: hotelId }
            },
            number,
            capacity,
            price,
            imageUrl: finalImageUrl
        });

        return { room };
    }
}
