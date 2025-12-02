import { beforeAll, afterAll } from "vitest"
import { app } from "@/app"
import { prisma } from "@/lib/prisma"

beforeAll(async () => {
  try {
    // Conectar banco
    await prisma.$connect()
    // Inicializar Fastify sem abrir porta (para testes)
    await app.ready()
  } catch (err) {
    console.error("Erro no setup de testes:", err)
    throw err
  }
})

afterAll(async () => {
  try {
    await app.close()
    await prisma.$disconnect()
  } catch (err) {
    console.error("Erro ao finalizar testes:", err)
  }
})