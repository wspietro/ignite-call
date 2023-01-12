// acessar o prisma para fazer querys apartir do nosso código

import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: ['query'], // log de todos os sqls/querys executadas no BD dentro do terminal, ver se tudo está conforme.
})
