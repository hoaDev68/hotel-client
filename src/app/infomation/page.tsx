'use client'

import { MainClient } from '@/layout/MainClient'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { formatPrice } from '@/utils/formatPrice'
import dayjs from 'dayjs'

interface BookingDetails {
  roomType: string
  quantity: number
  price: number
}

export default function InformationPage() {
  const searchParams = useSearchParams()
  const [bookingDetails, setBookingDetails] = useState<BookingDetails[]>([])
  const [formData, setFormData] = useState({
    isCoupleBooking: 'false',
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    phone: '',
    countryCode: '+84'
  })

  const checkInDate = searchParams.get('checkInDate')
  const checkOutDate = searchParams.get('checkOutDate')
  const selectedRooms = searchParams.get('selectedRooms')

  useEffect(() => {
    if (selectedRooms) {
      setBookingDetails(JSON.parse(selectedRooms))
    }
  }, [selectedRooms])

  const calculateCancellationPolicy = () => {
    if (!checkInDate) return []

    const checkIn = dayjs(checkInDate)
    const today = dayjs()
    const daysUntilCheckIn = checkIn.diff(today, 'day')

    const policies = [
      {
        days: 5,
        refund: 100,
        description: 'hoàn tiền 100% đối trước 5 ngày đối với ngày checkin'
      },
      {
        days: 1,
        refund: 20,
        description: 'sau đó cứ 1 ngày giảm 20% '
      }
    ]

    return policies
  }

  const totalPrice = bookingDetails.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <MainClient>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Booking Form */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Thông tin của bạn</h2>
              

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Họ</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="e.g., John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tên</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="e.g., Smith"
                  />
                </div>
              </div>

              {/* Email Fields */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="space-y-6">
            {/* Booking Details */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">Thông tin đặt phòng</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Check-in</p>
                    <p className="text-gray-600">{dayjs(checkInDate).format('DD/MM/YYYY')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Check-out</p>
                    <p className="text-gray-600">{dayjs(checkOutDate).format('DD/MM/YYYY')}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Tóm tắt giá</h4>
                  {bookingDetails.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm mb-2">
                      <span>{item.roomType} x{item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">Chính sách hủy phòng</h3>
              <div className="space-y-2">
                {calculateCancellationPolicy().map((policy, index) => (
                  <p key={index} className="text-sm">
                    {policy.description}
                  </p>
                ))}
              </div>
            </div>

            {/* Book Now Button */}
            <button
              onClick={() => {
                // Handle booking submission
                console.log('Booking submitted:', {
                  customerDetails: formData,
                  bookingDetails,
                  checkInDate,
                  checkOutDate,
                  totalPrice
                })
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
             Thanh toán
            </button>
          </div>
        </div>
      </div>
    </MainClient>
  )
}
