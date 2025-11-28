import { UserRepository } from "@/repositories/user-repository"
import { InvalidCredentialsError } from "./error/invalid-credentials-error"
import { compare } from "bcryptjs"
import { User } from "@prisma/client"

interface AuthenticateUseCaseRequest {
    email: string,
    password: string
}

interface AuthenticateUseCaseResponse {
    user: User
}

export class AuthenticateUseCase {
    constructor(private _userRepository: UserRepository) {}

    async execute({
        email,
        password
    }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
        const user = await this._userRepository.findByEmail(email)
        if(!user) {
            throw new InvalidCredentialsError()
        }

        const passwordVerification = await compare(password, user.password)
        if(!passwordVerification) {
            throw new InvalidCredentialsError()
        }

        return {
            user
        }

    }
}