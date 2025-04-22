'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { MainClient } from '@/layout/MainClient'

interface BookingDetail {
  room: {
    roomType: string
    price: number
  }
  checkInDate: string
  checkOutDate: string
  quantity: number
}

interface Booking {
  _id: string
  customerName: string
  phoneNumber: string
  totalAmount: number
  checkInDate: string
  checkOutDate: string
  bookingDetails: BookingDetail[]
}

export default function PaymentSuccessPage() {
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchBookingDetails = async () => {
      const bookingId = searchParams.get('bookingId')
      if (!bookingId) return

      try {
        const response = await fetch(`http://localhost:8080/bookings/${bookingId}`)
        const data = await response.json()
        setBooking(data)
      } catch (error) {
        console.error('Error fetching booking details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookingDetails()
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading booking details...</p>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Booking not found</p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  return (
   
  <MainClient>
   <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">SEAHOTEL</h1>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-semibold">Tên khách hàng</span>
              <span>{booking.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Số điện thoại</span>
              <span>{booking.phoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Ngày nhận phòng</span>
              <span>{formatDate(booking.checkInDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Ngày trả phòng</span>
              <span>{formatDate(booking.checkOutDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Giá phòng</span>
              <span>{formatPrice(booking.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainClient> 
  )
}