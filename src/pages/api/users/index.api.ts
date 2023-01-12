// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { prisma } from '../../../lib/prisma'
import { setCookie } from 'nookies'
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

  // Cookies trafegados através dos cabeçalhos das nossas req e res
  // Obter cookies com req
  // Devolver cookies com res
  setCookie({ res }, '@ignitecall:userid', user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: '/',
  })

  // retornar usuário criado, status de recurso criado
  return res.status(201).json(user)
}
