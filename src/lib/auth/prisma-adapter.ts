import { Adapter } from 'next-auth/adapters'
import { prisma } from '../prisma'

// Criando um adapter next auth
export function PrismaAdapter(): Adapter {
  return {
    async createUser(user) { }, // usuário já foi criado, iremos buscar o id nos cookies e atualizar o registro do user

    async getUser(id) {
      // metodo só é chamado após o usuário ser criado
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id,
        },
      })

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!, // ts não sabe que o método só será chamado após o user ser criado
        emailVerified: null,
        avatar_url: user.avatar_url!,
      }
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          email,
        },
      })

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar_url: user.avatar_url!,
      }
    },

    async getUserByAccount({ providerAccountId, provider }) { },

    async updateUser(user) { },

    async deleteUser(userId) { },

    async linkAccount(account) { },

    async unlinkAccount({ providerAccountId, provider }) { },

    async createSession({ sessionToken, userId, expires }) { },

    async getSessionAndUser(sessionToken) { },

    async updateSession({ sessionToken }) { },

    async deleteSession(sessionToken) { },

    async createVerificationToken({ identifier, expires, token }) { },

    async useVerificationToken({ identifier, token }) { },
  }
}
