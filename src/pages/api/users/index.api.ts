// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { prisma } from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // especificar método da requisição
  if (req.method !== 'POST') {
    return res.status(405).end() // method not allowed, resposta sem nenhum corpo
  }

  const { name, username } = req.body

  // buscar por um usuário com mesmo username, para validação
  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (userExists) {
    return res.status(400).json({
      message: 'Username already taken',
    })
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  })

  // retornar usuário criado, status de recurso criado
  return res.status(201).json(user)
}
