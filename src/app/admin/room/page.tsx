'use client';

import { useEffect, useState } from 'react';
import { Card, Row, Col, Tag, Typography, Button } from 'antd';
import { useRouter } from 'next/navigation';
import MainAdmin from '@/layout/MainAdmin';
import Image from 'next/image';

interface RoomData {
  _id: string;
  roomType: string;
  roomQuantity: number;
  price: number;
  capacity: number;
  information: string;
  image: string;
  description: string;
  status: string;
  bookingDetails: any[];
  __v: number;
}

const { Title, Text } = Typography;

export default function RoomAdminPage() {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:8080/room/admin/all');
        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }
        const result = await response.json();
        setRooms(result.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleRoomClick = (roomId: string) => {
    router.push(`/admin/room/${roomId}`);
  };

  return (
    <MainAdmin>
      <div className="p-6">
        <div className="flex justify-between items-center mb-16">
          <Title level={2}>Quản lý phòng</Title>
          <Button type="primary" className="bg-blue-500" onClick={() => router.push('/admin/room/new')}>
            Tạo phòng mới
          </Button>
        </div>
        <Row gutter={[16, 16]}>
          {rooms.map((room) => (
            <Col key={room._id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                onClick={() => handleRoomClick(room._id)}
                cover={
                  <div style={{ position: 'relative', height: '200px' }}>
                    <Image
                      src={room.image}
                      alt={room.roomType}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                }
                className="h-full"
              >
                <div className="flex flex-col gap-2">
                  <Title level={4} className="!mb-1">{room.roomType}</Title>
                  <div className="flex justify-between items-center">
                    <Text strong className="text-lg text-blue-600">
                      {room.price.toLocaleString('vi-VN')}đ
                    </Text>
                    <Tag color="blue">{room.capacity} người</Tag>
                  </div>
                  <Text className="text-gray-500">{room.information}</Text>
                  <div className="mt-2 flex justify-between items-center">
                    <Tag color="green">{room.roomQuantity} phòng</Tag>
                    <Text type="secondary">Click để xem chi tiết</Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </MainAdmin>
  );
}
