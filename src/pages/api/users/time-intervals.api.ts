// receber o nosso formulário e processar as informações dentro do registro do usuário
// usuário já está logado
// não precisamos de referências na rota, pois já está dentro dos cookies
// rota para cadastras os intervalos de tempo que o usuário tem disponível

// eslint-disable-next-line camelcase
import { unstable_getServerSession } from 'next-auth'
import { NextApiRequest, NextApiResponse } from 'next'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'

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

  return res.json({
    session,
  }) // API resolved without sending a response for /api/users/time-intervals, this may result in stalled requests.
}
