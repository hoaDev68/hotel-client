"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Typography, Tag, Table, Descriptions, Image, Button, Spin, message } from "antd";
import dayjs from "dayjs";
import { BookingStatus } from "@/config/constant";
import MainAdmin from "@/layout/MainAdmin";

const { Title, Text } = Typography;

export default function BookingDetailAdminPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    if (!bookingId) return;
    const fetchBooking = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/bookings/${bookingId}`);
        if (!res.ok) throw new Error("Không lấy được thông tin phiếu đặt!");
        const data = await res.json();
        setBooking(data);
      } catch (e: any) {
        message.error(e.message || "Đã có lỗi xảy ra!");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) return <MainAdmin><div className="flex justify-center items-center min-h-[300px]"><Spin size="large" /></div></MainAdmin>;
  if (!booking) return <MainAdmin><div className="text-center text-red-500">Không tìm thấy phiếu đặt phòng</div></MainAdmin>;

  return (
    <MainAdmin>
      <div className="max-w-3xl mx-auto py-8 px-2">
        <Title level={2} className="mb-6">Chi tiết phiếu đặt phòng</Title>
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Tên khách hàng">{booking.customerName}</Descriptions.Item>
          <Descriptions.Item label="Email">{booking.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{booking.phoneNumber}</Descriptions.Item>
          <Descriptions.Item label="Ngày nhận phòng">{dayjs(booking.checkInDate).format("DD/MM/YYYY")}</Descriptions.Item>
          <Descriptions.Item label="Ngày trả phòng">{dayjs(booking.checkOutDate).format("DD/MM/YYYY")}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={
              booking.status === BookingStatus.CONFIRMED ? "gold"
                : booking.status === BookingStatus.CHECKED_IN ? "green"
                : booking.status === BookingStatus.CHECKED_OUT ? "blue"
                : booking.status === BookingStatus.CANCELLED ? "red"
                : booking.status === BookingStatus.NO_SHOW ? "default"
                : booking.status === BookingStatus.REFUNDED ? "purple"
                : "default"
            }>
              {booking.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Tổng tiền">
            <b>{booking.totalAmount?.toLocaleString('vi-VN')} đ</b>
          </Descriptions.Item>
          {booking.status !== BookingStatus.CANCELLED && (
            <Descriptions.Item label="Yêu cầu hủy">
              {booking.isCancel ? (
                <Tag color="red">Đã gửi yêu cầu hủy</Tag>
              ) : (
                <Tag color="default">Không</Tag>
              )}
            </Descriptions.Item>
          )}
        </Descriptions>

        <Title level={4} className="mt-8 mb-4">Danh sách phòng đã đặt</Title>
        <Table
          dataSource={booking.bookingDetails.map((d: any, idx: number) => ({ ...d, key: d._id || idx }))}
          pagination={false}
          bordered
          columns={[
            {
              title: "Ảnh phòng",
              dataIndex: ["room", "image"],
              key: "image",
              render: (img: string) => img ? <Image src={img.startsWith('http') ? img : `/uploads/images/${img}`} alt="Ảnh phòng" width={80} /> : <span>Không có ảnh</span>
            },
            {
              title: "Loại phòng",
              dataIndex: ["room", "roomType"],
              key: "roomType",
              render: (_: any, detail: any) => detail.room?.roomType || ""
            },
            {
              title: "Số lượng",
              dataIndex: "quantity",
              key: "quantity",
            },
            {
              title: "Đơn giá",
              dataIndex: "price",
              key: "price",
              width: 130,
              render: (price: number) => price?.toLocaleString('vi-VN') + " đ"
            },
            {
              title: "Thành tiền",
              key: "total",
              width: 150,
              render: (_: any, detail: any) => (detail.price * detail.quantity)?.toLocaleString('vi-VN') + " đ"
            },
            {
              title: "Mô tả",
              dataIndex: ["room", "description"],
              key: "description",
              render: (_: any, detail: any) => detail.room?.description || ""
            }
          ]}
        />
        <div className="mt-8">
          <Button onClick={() => router.back()}>Quay lại</Button>
        </div>
      </div>
    </MainAdmin>
  );
}
