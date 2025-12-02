import { User, Prisma, Role } from "@prisma/client";
import { UserRepository } from "../user-repository";
import { randomUUID } from "node:crypto";

export class InMemoryUserReposytory implements UserRepository {
    public items: User[] = []

    async findById(id: string) {
        const user = this.items.find(item => item.id === id)
        if(!user) {
            return null
        }

        return user
    }

    async findByEmail(email: string) {
        const user = this.items.find(item => item.email === email)
        if(!user) {
            return null
        }

        return user
    }

    async create(data: Prisma.UserCreateInput) {
        const user = {
            id: randomUUID(),
            name: data.name,
            email: data.email,
            password: data.password,
            role: Role.MEMBER,
            createdAt: new Date()
        }

        this.items.push(user)

        return user
    }

    async save(user: User): Promise<User> {
        const userIndex = this.items.findIndex(item => user.id == item.id)

        if (userIndex >= 0) {
            this.items[userIndex] = user
        }

        return user
    }

}