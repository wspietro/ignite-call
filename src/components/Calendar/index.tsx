import dayjs from 'dayjs'
import { CaretLeft, CaretRight } from 'phosphor-react'
import { useMemo, useState } from 'react'
import { getWeekDays } from '../../utils/get-week-days'
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from './styles'

export function Calendar() {
  const [currentMonthAndYearDate, setCurrentMonthAndYearDate] = useState(() => {
    // só queremos mes e ano no momento, por isso dia 1
    // fn retorna o valor inicial
    // date = dia, day = dia da semana
    return dayjs().set('date', 1)
  })

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
      ...previousMonthFillArray,
      ...daysInMonthArray,
      ...nextMonthFillArray,
    ]

    return calendarDays
  }, [currentMonthAndYearDate])

  console.log(calendarWeeks)

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
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <CalendarDay>1</CalendarDay>
            </td>
            <td>
              <CalendarDay disabled>2</CalendarDay>
            </td>
            <td>
              <CalendarDay>3</CalendarDay>
            </td>
          </tr>
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
