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

const timeIntervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      startTimeInMinutes: z.number(),
      endTimeInMinutes: z.number(),
    }),
  ),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
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
  const { intervals } = timeIntervalsBodySchema.parse(req.body)

  // sqlite não suporta inserções múltiplas no banco
  // await prisma.userTimeInterval.createMany

  await Promise.all(
    intervals.map((interval) => {
      return prisma.userTimeInterval.create({
        data: {
          week_day: interval.weekDay,
          time_start_in_minutes: interval.startTimeInMinutes,
          time_end_in_minutes: interval.endTimeInMinutes,
          user_id: session.user?.id,
        },
      })
    }),
  )

  return res.status(201).end()
}
