import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { CaretLeft, CaretRight } from 'phosphor-react'
import { useMemo, useState } from 'react'
import { api } from '../../lib/axios'
import { getWeekDays } from '../../utils/get-week-days'
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from './styles'

interface CalendarWeek {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

type CalendarWeeks = CalendarWeek[]

interface BlockedDates {
  blockedWeekDays: number[]
}

interface CalendarProps {
  selectedDate: Date | null
  onDateSelected: (date: Date) => void
}

export function Calendar({ onDateSelected, selectedDate }: CalendarProps) {
  const [currentMonthAndYearDate, setCurrentMonthAndYearDate] = useState(() => {
    // só queremos mes e ano no momento, por isso dia 1
    // fn retorna o valor inicial
    // date = dia, day = dia da semana
    return dayjs().set('date', 1)
  })

  const router = useRouter()

  function handlePreviousMonth() {
    // dayjs
    const previousMonthDate = currentMonthAndYearDate.subtract(1, 'month')

    setCurrentMonthAndYearDate(previousMonthDate)
  }

  function handleNextMonth() {
    // dayjs
    const nextMonthDate = currentMonthAndYearDate.add(1, 'month')

    setCurrentMonthAndYearDate(nextMonthDate)
  }

  const shortWeekDay = getWeekDays({ short: true })

  // dayjs
  const currentMonth = currentMonthAndYearDate.format('MMMM')
  const currentYear = currentMonthAndYearDate.format('YYYY')

  const username = String(router.query.username)

  const { data: blockedDates } = useQuery<BlockedDates>(
    [
      'blocked-dates',
      currentMonthAndYearDate.get('year'),
      currentMonthAndYearDate.get('month'),
    ],
    async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year: currentMonthAndYearDate.get('year'),
          month: currentMonthAndYearDate.get('month'),
        },
      })
      return response.data
    },
  )

  const calendarWeeks = useMemo(() => {
    const daysInMonthArray = Array.from({
      length: currentMonthAndYearDate.daysInMonth(),
    }).map((_, i) => {
      return currentMonthAndYearDate.set('date', i + 1) // array com os dias do mês
    })

    const firstWeekDay = currentMonthAndYearDate.get('day') // retorna dia da semana 0-6

    const previousMonthFillArray = Array.from({
      length: firstWeekDay,
    })
      .map((_, i) => {
        return currentMonthAndYearDate.subtract(i + 1, 'day') // array com os últimas dias do mês anterior
      })
      .reverse()

    const lastDayInCurrentMonth = currentMonthAndYearDate.endOf('month')
    const lastWeekDay = lastDayInCurrentMonth.endOf('month').get('day')

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, i) => {
      return lastDayInCurrentMonth.add(i + 1, 'day') // array com os dias do mês seguinte
    })

    const calendarDays = [
      ...previousMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
      ...daysInMonthArray.map((date) => {
        return {
          date,
          disabled:
            date.endOf('day').isBefore(new Date()) ||
            blockedDates?.blockedWeekDays.includes(date.get('day')),
        }
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
    ]

    // cada semana é uma TR. fica mais fácil iterar sobre a semana do que sobre os dias
    const calendarWeeksReduce = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, originalArray) => {
        const isNewWeek = i % 7 === 0

        if (isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: originalArray.slice(i, i + 7),
          })
        }

        return weeks
      },
      [],
    )

    return calendarWeeksReduce
  }, [currentMonthAndYearDate, blockedDates])

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button onClick={handlePreviousMonth} title="Previous month">
            <CaretLeft />
          </button>
          <button onClick={handleNextMonth} title="Next month">
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDay.map((weekDay) => {
              return <th key={weekDay}>{weekDay}.</th>
            })}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ days, week }) => {
            return (
              <tr key={week}>
                {days.map(({ date, disabled }) => {
                  return (
                    <td key={date.toString()}>
                      <CalendarDay
                        onClick={() => onDateSelected(date.toDate())} // não é mais um objeto dayjs, data em api js
                        disabled={disabled}
                      >
                        {date.get('date')}
                      </CalendarDay>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
