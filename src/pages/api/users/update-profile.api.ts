// receber o nosso formulário e processar as informações dentro do registro do usuário
// usuário já está logado
// não precisamos de referências na rota, pois já está dentro dos cookies
// rota para cadastras os intervalos de tempo que o usuário tem disponível

// eslint-disable-next-line camelcase
import { unstable_getServerSession } from 'next-auth'
import { NextApiRequest, NextApiResponse } from 'next'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

const updateProfileBodySchema = z.object({
  bio: z.string(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'PUT') {
    return res.status(405).end()
  }

  const session = await unstable_getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (!session) {
    return res.status(401).end()
  }

  // parse dispara um erro caso a tipagem seja diferente do schema. Podemos usar o safeParse
  const { bio } = updateProfileBodySchema.parse(req.body)

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      bio,
    },
  })

  return res.status(204).end()
}
