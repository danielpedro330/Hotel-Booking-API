import { InMemoryUserReposytory } from "@/repositories/in-Memory/register-in-Memory"
import { beforeEach, describe, expect, it } from "vitest"
import { UserUseCase } from "./register"
import { EmailAlreadyExistsError } from "./error/email-already-exists-error"
import { compare } from "bcryptjs"

let userRepository: InMemoryUserReposytory
let sut: UserUseCase

describe("Resgister Use Cases", () => {
    beforeEach(() => {
        userRepository = new InMemoryUserReposytory()
        sut = new UserUseCase(userRepository)
    })

    it("Should be able to register a user", async () => {
        const {user} = await sut.execute({
            name: "Daniel Joe",
            email: "daniel@gmail.com",
            password: "123456"
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it("Should hash user password upon registration", async () => {
        const {user} = await sut.execute({
            name: "Daniel Joe",
            email: "daniel@gmail.com",
            password: "123456"
        })

        const isPassWordCorrectlyHashed  = await compare("123456", user.password)

        expect(isPassWordCorrectlyHashed ).toEqual(true)
    })

    it("Should not be able to register a user same email", async () => {
        userRepository.create({
            name: "Daniel Joe1",
            email: "daniel@gmail.com",
            password: "123456"
        })

        expect(async () => await sut.execute({
            name: "Daniel Joe2",
            email: "daniel@gmail.com",
            password: "123456"
        })).rejects.toBeInstanceOf(EmailAlreadyExistsError)
    })
})