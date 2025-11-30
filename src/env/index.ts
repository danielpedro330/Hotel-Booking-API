import "dotenv/config"
import z from "zod"

const envSchema = z.object({
    NODE_ENV: z.enum(['dev', 'test', 'production']).default('production'),
    JWT_SECRET: z.string(),
    PORT: z.coerce.number().default(3333),

    CLOUDINARY_CLOUD_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),

    MAILTRAP_HOST: z.string(),
    MAILTRAP_PORT: z.string(),
    MAILTRAP_USER: z.string(),
    MAILTRAP_PASS: z.string(),
})

const _env = envSchema.safeParse(process.env)
if (_env.success == false) {
    console.error('Invalid environment variable', _env.error.format())

    throw new Error('Invalid environment variable')
}

export const env = _env.data
