'use client'

import { MainClient } from "@/layout/MainClient";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Room } from "@/store/rooms/rooms.type";
import { instanceAxios } from "@/config/axios";
import Link from "next/link";
import ChatBox from "@/component/ChatBox/ChatBox";

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);


  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await instanceAxios.get('/room/admin/all');
        if (response.data && response.data.data) {
          setRooms(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);


  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <MainClient>
      <div className="container mx-auto px-4 py-16">
        {/* Chat Button */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="z-50 fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110"
        >
          <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>

        {isChatOpen && (
          <div className="fixed inset-0 z-50">
            <div className="flex items-end justify-end min-h-screen p-4">
              <div className="w-full max-w-md">
                <ChatBox onClose={() => setIsChatOpen(false)} />
              </div>
            </div>
          </div>
        )}
        {/* Hotel Master Rooms Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Hotel Master Rooms</h1>
          <p className="text-gray-600">Semper ac dolor vitae accumsan.</p>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mt-4"></div>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {rooms && rooms.map((room) => (
            <div key={room._id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative">
                <Image
                  src={room.image}
                  alt={`${room.roomType} Room`}
                  width={300}
                  height={250}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-lg">
                    {room.roomType}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{room.information}</p>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    <span>{room.capacity} người</span>
                  </div>
                  <div className="text-xl font-bold text-blue-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price)}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4">{room.description}</p>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                 <Link href={`/room/${room._id}`}>View Details</Link>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainClient>
  );
}
