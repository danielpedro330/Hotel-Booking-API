import { User } from "@prisma/client";
import { UserRepository } from "../repositories/user-repository";
import { EmailAlreadyExistsError } from "./error/email-already-exists-error";
import { hash } from "bcryptjs";

interface UserUseCaseResquest {
    name: string,
    email: string,
    password: string
}

interface UserUseCaseResponse {
    user:User
}

export class UserUseCase {
    constructor(private _userRepository: UserRepository) {}

    async execute({
        name,
        email,
        password
    }: UserUseCaseResquest): Promise<UserUseCaseResponse> {
        const userWithTheSameEmail = await this._userRepository.findByEmail(email)
        if (userWithTheSameEmail) {
            throw new EmailAlreadyExistsError()
        }

        const password_hash = await hash(password, 6)

        const user = await this._userRepository.create({
            name,
            email,
            password: password_hash, 
        })

        return {
            user
        }
    }
}