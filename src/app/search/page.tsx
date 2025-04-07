'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Room } from '@/store/rooms/rooms.type'
import Image from 'next/image'
import { formatPrice } from '@/utils/formatPrice'
import { MainClient } from '@/layout/MainClient'
import SearchRoom from '@/component/SearchRoom'

interface SelectedRoom {
  roomId: string
  quantity: number
}

export default function SearchPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRooms, setSelectedRooms] = useState<SelectedRoom[]>([])
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchRooms = async () => {
      const checkInDate = searchParams.get('checkInDate')
      const checkOutDate = searchParams.get('checkOutDate')
      const minCapacity = searchParams.get('minCapacity')

      try {
        const response = await fetch(
          `http://localhost:8080/room/client/all?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&minCapacity=${minCapacity}`
        )
        const data = await response.json()
        setRooms(data.data)
      } catch (error) {
        console.error('Error fetching rooms:', error)
      }
    }

    fetchRooms()
  }, [searchParams])

  return (
    <MainClient>
    <div className="container mx-auto px-4 py-8">
      <SearchRoom 
        checkInDate={searchParams.get('checkInDate') || undefined}
        checkOutDate={searchParams.get('checkOutDate') || undefined}
        minCapacity={searchParams.get('minCapacity') ? parseInt(searchParams.get('minCapacity')!) : undefined}
      />
      <h1 className="text-3xl font-bold mb-6">Available Rooms</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b text-left">Room Type</th>
              <th className="px-6 py-3 border-b text-center">Capacity</th>
              <th className="px-6 py-3 border-b text-center">Price</th>
              <th className="px-6 py-3 border-b text-center">Options</th>
              <th className="px-6 py-3 border-b text-center">Select</th>
              <th className="px-6 py-3 border-b text-center w-1/4">Selected Rooms Summary</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room, index) => (
              <tr key={room._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="relative w-20 h-20 mr-4">
                      <Image
                        src={room.image}
                        alt={room.roomType}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{room.roomType}</h3>
                      <p className="text-sm text-gray-600">{room.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <span>{room.capacity} guests</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="font-semibold">{formatPrice(room.price)}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <ul className="text-sm text-gray-600">
                    <li>✓ Free cancellation</li>
                    <li>✓ Pay at property</li>
                  </ul>
                </td>
                <td className="px-6 py-4 text-center">
                  <select
                    className="border rounded px-2 py-1"
                    value={selectedRooms.find(r => r.roomId === room._id)?.quantity || 0}
                    onChange={(e) => {
                      const quantity = parseInt(e.target.value)
                      if (quantity === 0) {
                        setSelectedRooms(prev => prev.filter(r => r.roomId !== room._id))
                      } else {
                        setSelectedRooms(prev => {
                          const existing = prev.find(r => r.roomId === room._id)
                          if (existing) {
                            return prev.map(r => 
                              r.roomId === room._id ? { ...r, quantity } : r
                            )
                          }
                          return [...prev, { roomId: room._id, quantity }]
                        })
                      }
                    }}
                  >
                    {Array.from({ length: room.roomQuantity + 1 }, (_, i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-center" rowSpan={index === 0 ? rooms.length : undefined} style={{ display: index === 0 ? 'table-cell' : 'none' }}>
                  {selectedRooms.length > 0 ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        {selectedRooms.map((selectedRoom) => {
                          const room = rooms.find(r => r._id === selectedRoom.roomId);
                          if (!room) return null;
                          return (
                            <div key={selectedRoom.roomId} className="flex justify-between items-center text-sm">
                              <span>{room.roomType}</span>
                              <span>x{selectedRoom.quantity}</span>
                              <span>{formatPrice(room.price * selectedRoom.quantity)}</span>
                            </div>
                          );
                        })}
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between items-center font-bold">
                            <span>Total:</span>
                            <span>
                              {formatPrice(
                                selectedRooms.reduce((total, selectedRoom) => {
                                  const room = rooms.find(r => r._id === selectedRoom.roomId);
                                  return total + (room?.price || 0) * selectedRoom.quantity;
                                }, 0)
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button 
                        className="w-full cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                        onClick={() => {
                          const bookingDetails = selectedRooms.map(selectedRoom => {
                            const room = rooms.find(r => r._id === selectedRoom.roomId)
                            return {
                              roomType: room?.roomType || '',
                              quantity: selectedRoom.quantity,
                              price: room?.price || 0
                            }
                          })
                          
                          const params = new URLSearchParams({
                            checkInDate: searchParams.get('checkInDate') || '',
                            checkOutDate: searchParams.get('checkOutDate') || '',
                            selectedRooms: JSON.stringify(bookingDetails)
                          })
                          
                          window.location.href = `/infomation?${params.toString()}`
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No rooms selected</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </MainClient>

  )
}
