/* eslint-disable camelcase */
import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  // Retornar todos os horários disponíveis na data específica do calendário de um username
  // http//localhost:3000/api/users/teste/availability?date=2022-12-20
  const username = String(req.query.username)
  const { date } = req.query

  if (!date) {
    return res.status(400).json({ message: 'Date not provided.' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' })
  }

  const referenceDate = dayjs(String(date))
  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

  // validacao se a data não é passada
  if (isPastDate) {
    return res.json({ availability: [] })
  }

  // TimeInterval (intervalo de tempo disponivel pelo usuário)
  // x
  // scheduling (agendamenttos realizados)
  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })

  if (!userAvailability) {
    return res.json({ availability: [] })
  }

  // salvamos em minutos, converter em horas
  const { time_start_in_minutes, time_end_in_minutes } = userAvailability

  const startHour = time_start_in_minutes / 60 // 10
  const endHour = time_end_in_minutes / 60 // 18

  // [10, 11, 12, 13, 14, 15, 16, 17]
  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      return startHour + i
    },
  )

  return res.json({ possibleTimes })
}