import { EmailAlreadyExistsError } from "@/use-cases/error/email-already-exists-error";
import { makeUserUseCase } from "@/use-cases/factories/make-user-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string(). email(),
        password: z.string().min(6)
    })

    try {
        const { name, email, password } = registerBodySchema.parse(request.body)

        const userUseCase = makeUserUseCase()

        const {user} = await userUseCase.execute({
            name,
            email,
            password
        })
    } catch (err) {
        if (err instanceof EmailAlreadyExistsError) {
            return reply.status(409).send({ message: err.message })

            throw err
        }
    }

    return reply.status(201).send()
}