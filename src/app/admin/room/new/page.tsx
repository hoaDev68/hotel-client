'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Typography,
  message,
  notification,
} from 'antd';
import { ArrowLeftOutlined,SmileOutlined } from '@ant-design/icons';
import ImageUploader from '@/component/upload/upload';
import MainAdmin from '@/layout/MainAdmin';

const { Title } = Typography;
const { TextArea } = Input;

const statusOptions = [
  { label: 'Trống', value: 'TRONG' },
  { label: 'Đang sử dụng', value: 'DANG_SU_DUNG' },
  { label: 'Đã đặt', value: 'DA_DAT' },
];

export default function CreateRoomPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [api, contextHolder] = notification.useNotification();

  const NotificationSuccess = () => {
    api.open({
      message: 'Thành Công',
      description:
        'Tạo mới phòng thành công.',
      icon: <SmileOutlined style={{ color: '#3970b8' }} />,
    });
};
  const NotificationError = () => {
    api.open({
      message: 'Thất Bại',
      description:
        'Tạo mới phòng thất bại.',
      icon: <SmileOutlined style={{ color: '#de3731' }} />,
    });
  };

  const handleCreateRoom = async (values: any) => {
    try {
      const payload = {
        ...values,
        image: imageUrl,
      };

      const response = await fetch('http://localhost:8080/room/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Tạo phòng thành công!');
        NotificationSuccess();
        setTimeout(() => {
          router.push('/admin/room');
        }, 1500); // Delay 1.5 giây
      } else {
        throw new Error(data.message || 'Lỗi tạo phòng');
        NotificationError();
      }
    } catch (error) {
      console.error('Error creating room:', error);
      message.error('Đã xảy ra lỗi khi tạo phòng');
    }
  };

  return (

    <MainAdmin>
      {contextHolder}
      <div className="p-6">
        <ArrowLeftOutlined onClick={() => router.back()} />
        <Title level={2} className="my-4">Tạo phòng mới</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleCreateRoom}
        initialValues={{
          roomQuantity: 1,
          status: 'TRONG',
        }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Loại phòng" name="roomType" rules={[{ required: true, message: 'Vui lòng nhập loại phòng' }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Số lượng phòng" name="roomQuantity" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Giá (VNĐ/giờ)" name="price" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Kích thước (m2)" name="size" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Sức chứa (người)" name="capacity" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Trạng thái" name="status" rules={[{ required: true }]}>
              <Select options={statusOptions} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Ảnh phòng">
              <ImageUploader
                initialImage=""
                onChange={(url) => setImageUrl(url)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Mô tả" name="description">
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Thông tin thêm" name="information">
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item className="text-right">
          <Button type="primary" htmlType="submit" className="bg-blue-500">
            Tạo phòng
          </Button>
        </Form.Item>
      </Form>
    </div>
    </MainAdmin>
  );
}
