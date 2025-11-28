import { HotelRepository } from "@/repositories/hotel-repository";
import { Hotel } from "@prisma/client";
import cloudinary from "@/lib/cloudinary";

interface HotelUseCaseRequest {
    name: string;
    location: string;
    file?: { file: NodeJS.ReadableStream };
}

interface HotelUseCaseResponse {
    hotel: Hotel;
}

export class HotelUseCase {
    constructor(private _hotelRepository: HotelRepository) {}

    async execute({
        name,
        location,
        file
    }: HotelUseCaseRequest): Promise<HotelUseCaseResponse> {

        let imageUrl: string | null = null;

        // Se tiver imagem, faz upload no Cloudinary
        if (file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "hotels" },
                    (err, res) => {
                        if (err) reject(err);
                        else resolve(res);
                    }
                );

                file.file.pipe(stream);
            });

            imageUrl = (uploadResult as any).secure_url;
        }

        const hotel = await this._hotelRepository.create({
            name,
            location,
            imageUrl
        });

        return { hotel };
    }
}
