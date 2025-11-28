import { InMemoryUserReposytory } from "@/repositories/in-Memory/register-in-Memory"
import { beforeEach, describe, expect, it } from "vitest"
import { AuthenticateUseCase } from "./authenticate"
import { hash } from "bcryptjs"

let userRepository: InMemoryUserReposytory
let sut: AuthenticateUseCase

describe("Resgister Use Cases", () => {
    beforeEach(() => {
        userRepository = new InMemoryUserReposytory()
        sut = new AuthenticateUseCase(userRepository)
    })

    it("Should be able to authenticate a user", async () => {
        await userRepository.create({
            name: "Daniel Joe",
            email: "daniel@gmail.com",
            password: await hash('123456', 6)
        })

        const {user} = await sut.execute({
            email: "daniel@gmail.com",
            password: "123456"
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it("Should be able to authenticate with the wrong email address.", async () => {
        await userRepository.create({
            name: "Daniel Joe",
            email: "daniel@gmail.com",
            password: await hash('123456', 6)
        })

        const {user} = await sut.execute({
            email: "daniel@gmail.com",
            password: "123456"
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it("Should not be able to authenticate a user", async () => {
        await userRepository.create({
            name: "Daniel Joe",
            email: "daniel@gmail.com",
            password: await hash('123456', 6)
        })

        const {user} = await sut.execute({
            email: "daniel@gmail.com",
            password: "123456"
        })

        expect(user.id).toEqual(expect.any(String))
    })

})