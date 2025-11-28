import "dotenv/config"
import z from "zod"

const envSchema = z.object({
    NODE_ENV: z.enum(['dev', 'test', 'production']).default('production'),
    JWT_SERCRET: z.string(),
    PORT: z.coerce.number().default(3333),

    CLOUDINARY_CLOUD_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),

    MAIL_HOST: z.string(),
    MAIL_PORT: z.string(),
    MAIL_USER: z.string(),
    MAIL_PASS: z.string(),
})

const _env = envSchema.safeParse(process.env)
if (_env.success == false) {
    console.error('Invalid environment variable', _env.error.format())

    throw new Error('Invalid environment variable')
}

export const env = _env.data
