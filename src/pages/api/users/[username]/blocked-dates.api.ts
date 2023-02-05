/* eslint-disable camelcase */
// import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import _difference from 'lodash/difference'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username)
  const { year, month } = req.query

  if (!year || !month) {
    return res.status(400).json({ message: 'Year or month not provided.' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' })
  }

  // buscar dias disponibilizados pelo usuário
  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: {
      week_day: true,
    },
    where: {
      user_id: user.id,
    },
  })

  const availableWeekDaysArray = availableWeekDays.map(
    (availableDay) => availableDay.week_day,
  )

  const blockedWeekDays = _difference(
    [0, 1, 2, 3, 4, 5, 6],
    availableWeekDaysArray,
  )

  return res.json({ blockedWeekDays })
}
