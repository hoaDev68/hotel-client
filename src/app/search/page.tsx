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
  const [rooms, setRooms] = useState<{ room: Room; availableQuantity: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRooms, setSelectedRooms] = useState<SelectedRoom[]>([])
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchRooms = async () => {
      const checkInDate = searchParams.get('checkInDate')
      const checkOutDate = searchParams.get('checkOutDate')
      const minCapacity = searchParams.get('minCapacity')

      try {
        setLoading(true)
        console.log('Fetching rooms with params:', { checkInDate, checkOutDate, minCapacity })
        
        const response = await fetch(
          `http://localhost:8080/room/client/all?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&minCapacity=${minCapacity}`
        )
        const data = await response.json()
        console.log('API Response:', data)
        
        // The API returns the array directly, not wrapped in a data property
        if (Array.isArray(data)) {
          console.log('Setting rooms:', data)
          setRooms(data)
        } else {
          console.log('Invalid data format received from API')
          setRooms([])
        }
      } catch (error) {
        console.error('Error fetching rooms:', error)
        setRooms([])
      } finally {
        setLoading(false)
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
      {loading ? (
        <div className="text-center py-4">
          <p>Loading available rooms...</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-4">
          <p>No rooms available for the selected dates.</p>
        </div>
      ) : (
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
            {rooms.map((roomData, index) => (
              <tr key={roomData.room._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="relative w-20 h-20 mr-4">
                      <Image
                        src={roomData.room.image}
                        alt={roomData.room.roomType}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{roomData.room.roomType}</h3>
                      <p className="text-sm text-gray-600">{roomData.room.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <span>{roomData.room.capacity} guests</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="font-semibold">{formatPrice(roomData.room.price)}</div>
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
                    value={selectedRooms.find(r => r.roomId === roomData.room._id)?.quantity || 0}
                    onChange={(e) => {
                      const quantity = parseInt(e.target.value)
                      if (quantity === 0) {
                        setSelectedRooms(prev => prev.filter(r => r.roomId !== roomData.room._id))
                      } else {
                        setSelectedRooms(prev => {
                          const existing = prev.find(r => r.roomId === roomData.room._id)
                          if (existing) {
                            return prev.map(r => 
                              r.roomId === roomData.room._id ? { ...r, quantity } : r
                            )
                          }
                          return [...prev, { roomId: roomData.room._id, quantity }]
                        })
                      }
                    }}
                  >
                    {Array.from({ length: roomData.availableQuantity + 1 }, (_, i) => (
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
                          const foundRoom = rooms.find(r => r.room._id === selectedRoom.roomId);
                          if (!foundRoom) return null;
                          return (
                            <div key={selectedRoom.roomId} className="flex justify-between items-center text-sm">
                              <span>{foundRoom.room.roomType}</span>
                              <span>x{selectedRoom.quantity}</span>
                              <span>{formatPrice(foundRoom.room.price * selectedRoom.quantity)}</span>
                            </div>
                          );
                        })}
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between items-center font-bold">
                            <span>Total:</span>
                            <span>
                              {formatPrice(
                                selectedRooms.reduce((total, selectedRoom) => {
                                  const roomData = rooms.find(r => r.room._id === selectedRoom.roomId);
                            const room = roomData?.room;
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
                            const roomData = rooms.find(r => r.room._id === selectedRoom.roomId)
                            return {
                              roomId: roomData?.room._id || '',
                              quantity: selectedRoom.quantity,
                              price: roomData?.room.price || 0
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
      )}
    </div>
    </MainClient>

  )
}