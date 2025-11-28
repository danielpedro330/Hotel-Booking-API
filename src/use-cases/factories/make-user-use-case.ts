import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { UserUseCase } from "../register";

export function makeUserUseCase() {
    const userRepository = new PrismaUserRepository()
    const userUseCase = new UserUseCase(userRepository)

    return userUseCase
}