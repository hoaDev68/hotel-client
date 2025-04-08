'use client'

import { MainClient } from '@/layout/MainClient'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { formatPrice } from '@/utils/formatPrice'
import dayjs from 'dayjs'
import axios from 'axios'

interface BookingDetails {
  roomId: string;
  quantity: number;
  price: number;
  roomType?: string; // thêm roomType để hiển thị
}


interface BookingState {
  customerName: string
  email: string
  phoneNumber: string
  checkInDate: Date
  checkOutDate: Date
  totalAmount: number
  bookingDetails: BookingDetails[]
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

  const [showQR, setShowQR] = useState(false)
  const [bookingState, setBookingState] = useState<BookingState | null>(null)

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

  useEffect(() => {
    const fetchRooms = async () => {
      if (!selectedRooms) return;
  
      const parsedRooms: BookingDetails[] = JSON.parse(selectedRooms);
  
      // Gọi API lấy thông tin từng phòng
      const detailsWithRoomType = await Promise.all(
        parsedRooms.map(async (room) => {
          try {
            const res = await axios.get(`http://localhost:8080/room/${room.roomId}`);
            console.log("res",res);
            const roomType = res.data.data.roomType || 'Phòng chưa rõ';
            return { ...room, roomType };
          } catch (err) {
            console.error('Error fetching room info:', err);
            return { ...room, roomType: 'Không tìm thấy' };
          }
        })
      );
 
      setBookingDetails(detailsWithRoomType);
    };
  
    fetchRooms();
  }, [selectedRooms]);
  

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

            {!showQR ? (
              <button
                onClick={() => {
                  // Create booking state
                  const newBookingState: BookingState = {
                    customerName: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phoneNumber: formData.phone,
                    checkInDate: new Date(checkInDate || ''),
                    checkOutDate: new Date(checkOutDate || ''),
                    totalAmount: totalPrice,
                    bookingDetails: bookingDetails
                  }
                  setBookingState(newBookingState)
                  setShowQR(true)
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Thanh toán
              </button>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4">Quét mã QR để thanh toán</h3>
                <div className="flex flex-col items-center gap-4">
                  <div className="flex justify-center mb-4">
                    <img 
                      src={`https://img.vietqr.io/image/vietcombank-9946570455-compact2.png?amount=${totalPrice}&addInfo=ThanhToanTienPhong&accountName=NguyenQuocHuy`}
                      alt="QR Payment"
                      className="max-w-full h-auto"
                    />
                  </div>
                  <p className="text-center text-sm text-gray-600 mb-4">Vui lòng quét mã QR để thanh toán số tiền {formatPrice(totalPrice)}</p>
                  <button
                    onClick={async () => {
                      try {
                        // Step 1: Create booking details first
                        const bookingDetailsPromises = bookingDetails.map(detail => {
                          const bookingDetailData = {
                            room: detail.roomId, // This should be the room ID
                            quantity: detail.quantity,
                            price: detail.price,
                            discount: 0
                          };
                          console.log("bookingDetailData",bookingDetailData);
                          return axios.post('http://localhost:8080/bookingDetails', bookingDetailData);
                        });

                        // Wait for all booking details to be created
                        const bookingDetailsResponses = await Promise.all(bookingDetailsPromises);
                        
                        // Get the IDs of the created booking details
                        const bookingDetailIds = bookingDetailsResponses.map(response => response.data._id);

                        console.log("bookingDetailIds",bookingDetailIds);

                        // Step 2: Create the main booking with booking detail IDs
                        const bookingData = {
                          customerName: `${formData.firstName} ${formData.lastName}`,
                          email: formData.email,
                          phoneNumber: formData.phone,
                          checkInDate: checkInDate,
                          checkOutDate: checkOutDate,
                          totalAmount: totalPrice,
                          bookingDetails: bookingDetailIds // Now using the IDs instead of the full objects
                        };
                        console.log("bookingData",bookingData);
                        const response = await axios.post('http://localhost:8080/bookings', bookingData);
                        
                        if (response.status === 201 || response.status === 200) {
                          alert('Đặt phòng thành công!');
                          // Redirect to booking confirmation or home page
                          window.location.href = '/';
                        } else {
                          throw new Error('Đặt phòng thất bại');
                        }
                      } catch (error) {
                        if (axios.isAxiosError(error)) {
                          alert('Có lỗi xảy ra: ' + (error.response?.data?.message || 'Không thể kết nối đến server'));
                        } else {
                          alert('Có lỗi xảy ra khi xử lý đặt phòng');
                        }
                      }
                    }}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Hoàn tất đặt phòng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="checkout">
        
      </div>
    </MainClient>
  )
}
