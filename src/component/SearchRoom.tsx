'use client'

import { DatePicker, Select } from 'antd'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

interface SearchRoomProps {
  checkInDate?: string
  checkOutDate?: string
  minCapacity?: number
}

export default function SearchRoom({ 
  checkInDate, 
  checkOutDate, 
  minCapacity 
}: SearchRoomProps = {}) {
  const router = useRouter()
  const [dates, setDates] = useState<any>(null)
  const [guests, setGuests] = useState<number>(minCapacity || 1)

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      setDates([
        dayjs(checkInDate).toDate(),
        dayjs(checkOutDate).toDate()
      ])
    }
  }, [checkInDate, checkOutDate])

  useEffect(() => {
    if (minCapacity) {
      setGuests(minCapacity)
    }
  }, [minCapacity])

  // Generate options for number of guests (1-50)
  const guestOptions = Array.from({ length: 50 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} ${i + 1 === 1 ? 'Guest' : 'Guests'}`
  }))

  const handleSearch = () => {
    if (!dates || !dates[0] || !dates[1]) {
      alert('Please select check-in and check-out dates')
      return
    }

    const checkInDate = dayjs(dates[0]).format('YYYY-MM-DD')
    const checkOutDate = dayjs(dates[1]).format('YYYY-MM-DD')

    router.push(
      `/search?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&minCapacity=${guests}`
    )
  }

  return (
    <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-1 lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-in & Check-out
          </label>
          <RangePicker
            className="w-full"
            format="DD/MM/YYYY"
            value={dates ? [
              dayjs(dates[0]),
              dayjs(dates[1])
            ] : null}
            onChange={(dates) => {
              if (dates) {
                setDates([dates[0]?.toDate() || null, dates[1]?.toDate() || null])
              } else {
                setDates([null, null])
              }
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Guests
          </label>
          <Select
            className="w-full"
            value={guests}
            onChange={setGuests}
            options={guestOptions}
          />
        </div>
        <div>
          <button
            onClick={handleSearch}
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Search Availability
          </button>
        </div>
      </div>
    </div>
  )
}
