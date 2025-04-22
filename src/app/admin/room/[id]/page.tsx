'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, Tag, Typography, Button, Row, Col, List, Input, Upload, Modal, notification } from 'antd';
import MainAdmin from '@/layout/MainAdmin';
import Image from 'next/image';
import { UserOutlined,SmileOutlined, ExpandAltOutlined, WifiOutlined, CoffeeOutlined, ArrowLeftOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { RcFile } from 'antd/es/upload';
import ImageUploader from '@/component/upload/upload';
import AppConfirmModal from '@/component/AppConfirmModal/AppConfirmModal';
import { AppConfirmModalEnum } from '@/config/constant';

interface RoomData {
  _id: string;
  roomType: string;
  roomQuantity: number;
  price: number;
  size: number;
  capacity: number;
  information: string;
  image: string;
  description: string;
  status: string;
  bookingDetails: any[];
  __v: number;
  imageFile?: RcFile;
}

const { Title, Text } = Typography;

export default function RoomDetailPage() {
  const { id } = useParams(); // <-- Lấy id từ params
  const [room, setRoom] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa
  const [updatedRoom, setUpdatedRoom] = useState<RoomData | null>(null);
  const [modalDelete, setModalDelete] = useState<any>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();

  const fetchRoom = async () => {
    try {
      const response = await fetch(`http://localhost:8080/room/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch room');
      }
      const result = await response.json();
      setRoom(result.data);
      setUpdatedRoom(result.data); // Khởi tạo dữ liệu khi bắt đầu chỉnh sửa
    } catch (error) {
      console.error('Error fetching room:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      fetchRoom();
    }
  }, [id]);

  if (loading || !room) {
    return <div>Loading...</div>;
  }

  const amenities = [
    { icon: <WifiOutlined />, text: 'Wifi miễn phí' },
    { icon: <UserOutlined />, text: 'TV màn hình phẳng' },
    { icon: <ExpandAltOutlined />, text: 'Đồ vệ sinh cá nhân' },
    { icon: <CoffeeOutlined />, text: 'Ấm đun nước siêu tốc' },
  ];

  const NotificationSuccess = () => {
    api.open({
      message: 'Thành Công',
      description:
        'Cập nhật phòng thành công.',
      icon: <SmileOutlined style={{ color: '#3970b8' }} />,
    });
  };
  const NotificationError = () => {
    api.open({
      message: 'Thất Bại',
      description:
        'Cập nhật phòng thất bại.',
      icon: <SmileOutlined style={{ color: '#de3731' }} />,
    });
  };

  function handleSaveRoom() {
    if (updatedRoom) {
      fetch(`http://localhost:8080/room/${updatedRoom._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomType: updatedRoom.roomType,
          size: updatedRoom.size,
          price: updatedRoom.price,
          capacity: updatedRoom.capacity,
          description: updatedRoom.description,
          information: updatedRoom.information,
          image: updatedRoom.image,
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Room updated successfully:', data);
          NotificationSuccess();
          fetchRoom();
          setIsEditing(false);
        })
        .catch(error => {
          console.error('Error updating room:', error);
          NotificationError();
        });
    }
  }

  function handleCancelEdit() {
    setUpdatedRoom(room); // Đặt lại dữ liệu cũ
    setIsEditing(false);
  }

  function handleModalDelete(){
    setLoadingDelete(true);
    //gọi api delete room theo id
    fetch(`http://localhost:8080/room/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        console.log('Room deleted successfully:', data);
        router.push('/admin/room');
        setModalDelete(false);
      })
      .catch(error => console.error('Error deleting room:', error))
      .finally(() =>{
        setLoadingDelete(false);
        setModalDelete(false);
      });
  }
  
  return (
    <MainAdmin>
      {contextHolder}
      <div className="p-6">
        <ArrowLeftOutlined onClick={() => router.back()} />
        <div className="flex justify-between items-center mt-4 mb-8">
          <div>
            <Title level={2} className="!mb-2">{room.roomType}</Title>
            {/* <Tag color="gold">Reserved</Tag> */}
          </div>
          {!isEditing ? (
            <Button type="primary" className="bg-blue-500" onClick={() => setIsEditing(true)}>
              Cập nhật
            </Button>
          ) : (
            <>
              <Button danger onClick={handleCancelEdit}>Hủy</Button>
              <Button type="primary" onClick={handleSaveRoom}>Lưu</Button>
            </>
          )}
        </div>

        <Row gutter={[32, 32]}>
          <Col span={12}>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              {isEditing ? (
              <ImageUploader
              initialImage={updatedRoom?.image || room.image}
              onChange={(imageUrl) => {
                setUpdatedRoom({ ...updatedRoom!, image: imageUrl });
              }}
            />                    
              ) : (
                <div className="relative h-[400px] rounded-lg overflow-hidden">
                  <Image
                    src={room.image}
                    alt={room.roomType}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}

            </div>
          </Col>

          <Col span={12}>
            <Card className="h-full">
              <List
                itemLayout="horizontal"
                dataSource={[
                  {
                    label: 'Loại phòng', value: isEditing ? (
                      <Input
                        defaultValue={room.roomType}
                        onChange={(e) => setUpdatedRoom({ ...updatedRoom!, roomType: e.target.value })}
                      />
                    ) : room.roomType
                  },
                  {
                    label: 'Kích thước phòng', value: isEditing ? (
                      <Input
                        defaultValue={room.size}
                        onChange={(e) => setUpdatedRoom({ ...updatedRoom!, size: +e.target.value })}
                      />
                    ) : room.size + ' m2'
                  },
                  {
                    label: 'Giá', value: isEditing ? (
                      <Input
                        defaultValue={room.price}
                        onChange={(e) => setUpdatedRoom({ ...updatedRoom!, price: +e.target.value })}
                      />
                    ) : room.price + ' VNĐ/giờ'
                  },
                  {
                    label: 'Sức chứa', value: isEditing ? (
                      <Input
                        defaultValue={room.capacity}
                        onChange={(e) => setUpdatedRoom({ ...updatedRoom!, capacity: +e.target.value })}
                      />
                    ) : room.capacity + ' người'
                  },
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <div className="w-full flex justify-between">
                      <Text type="secondary">{item.label}</Text>
                      <Text strong>{item.value}</Text>
                    </div>
                  </List.Item>
                )}
              />
              <div className="mt-6">
                <Title level={5}>Tiện nghi căn hộ</Title>
                <List
                  grid={{ gutter: 16, column: 2 }}
                  dataSource={amenities}
                  renderItem={(item) => (
                    <List.Item>
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <Text>{item.text}</Text>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </Card>
          </Col>
        </Row>

        <Card className="mt-8">
          <Title level={4}>Thông tin chi tiết</Title>
          <Text className="block mt-4">
            {isEditing ? (
              <Input.TextArea
                defaultValue={room.description}
                onChange={(e) => setUpdatedRoom({ ...updatedRoom!, description: e.target.value })}
              />
            ) : room.description}
          </Text>
          <Text className="block mt-4">
            {isEditing ? (
              <Input.TextArea
                defaultValue={room.information}
                onChange={(e) => setUpdatedRoom({ ...updatedRoom!, information: e.target.value })}
              />
            ) : room.information}
          </Text>
        </Card>
      </div>
 
        <div className="flex justify-end p-6">
          <Button danger icon={<DeleteOutlined />}   onClick={() => {
              setModalDelete(true);
            }} />
        </div>
  

      <AppConfirmModal 
          type={AppConfirmModalEnum.delete}
          title="Xoá phòng"
          name=""
          content=""
          isVisible={!!modalDelete}
          onCancel={() => setModalDelete(undefined)}
          onOk={() => handleModalDelete()}
          loading={loadingDelete}
      />
    </MainAdmin>
  );
}
