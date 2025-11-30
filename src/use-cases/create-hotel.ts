import { HotelRepository } from "@/repositories/hotel-repository";
import { Hotel } from "@prisma/client";
import cloudinary from "@/lib/cloudinary";

interface HotelUseCaseRequest {
    name: string;
    location: string;
    file?: { file: NodeJS.ReadableStream } | null; // multipart
    imageUrl?: string | null; // criação via JSON
}

interface HotelUseCaseResponse {
    hotel: Hotel;
}

export class HotelUseCase {
    constructor(private _hotelRepository: HotelRepository) {}

    async execute({
        name,
        location,
        file,
        imageUrl
    }: HotelUseCaseRequest): Promise<HotelUseCaseResponse> {

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

        const hotel = await this._hotelRepository.create({
            name,
            location,
            imageUrl: finalImageUrl
        });

        return { hotel };
    }
}
