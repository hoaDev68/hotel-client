"use client";

import { useState } from "react";
import { Input, Button, Typography, Spin, Empty, Tag, Modal, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { BookingStatus } from "@/config/constant";
import { MainClient } from "@/layout/MainClient";

const { Title, Text } = Typography;

interface BookingData {
  _id: string;
  customerName: string;
  phoneNumber: string;
  status: string;
  checkInDate: string;
  checkOutDate: string;
  [key: string]: any;
}

const statusOptions = [
  { value: BookingStatus.CONFIRMED, label: "Đã xác nhận" },
  { value: BookingStatus.CHECKED_IN, label: "Đã nhận phòng" },
  { value: BookingStatus.CHECKED_OUT, label: "Đã trả phòng" },
  { value: BookingStatus.CANCELLED, label: "Đã hủy" },
  { value: BookingStatus.NO_SHOW, label: "Không đến" },
  { value: BookingStatus.REFUNDED, label: "Đã hoàn tiền" },
];

export default function SearchBookingPage() {
    const [messageApi, contextHolder] = message.useMessage();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BookingData[]>([]);
  const [searched, setSearched] = useState(false);

  // Modal và xử lý yêu cầu hủy
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Hàm xác nhận hủy booking
  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    setCancelLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/bookings/${selectedBooking._id}/cancel`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Gửi yêu cầu hủy thất bại");
      messageApi.open({
        type: 'success',
        content: 'Đã gửi yêu cầu hủy phiếu đặt phòng!',
      });
      // Cập nhật lại trạng thái isCancel của booking trong results
      setResults(results => results.map(b => b._id === selectedBooking._id ? { ...b, isCancel: true } : b));
      setModalOpen(false);
      setSelectedBooking(null);
    } catch (e) {
        messageApi.open({
            type: 'error',
            content: 'Gửi yêu cầu hủy thất bại!',
          });
    } finally {
      setCancelLoading(false);
    }
  };


  const handleSearch = async () => {
    if (!phoneNumber.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      params.append("phoneNumber", phoneNumber.trim());
      const res = await fetch(`http://localhost:8080/bookings/search?${params.toString()}`);
      if (!res.ok) throw new Error("Không tìm thấy phiếu đặt phòng");
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <MainClient>
    {contextHolder}
    <div className="max-w-2xl mx-auto py-12 px-4 min-h-[60vh]">
      <Title level={2} className="text-center mb-8">Tra cứu phiếu đặt phòng</Title>
      <div className="flex gap-2 mb-8 justify-center">
        <Input
          placeholder="Vui lòng nhập số điện thoại của bạn"
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
          onPressEnter={handleSearch}
          maxLength={15}
          className="w-64"
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-[100px]"><Spin size="large" /></div>
      ) : searched && results.length === 0 ? (
        <Empty description="Không tìm thấy phiếu đặt phòng nào cho số điện thoại này" />
      ) : results.length > 0 ? (
        <div className="space-y-4">
          {results.map((booking) => (
            <div key={booking._id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between bg-white shadow-sm">
              <div>
                <Text strong>{booking.customerName}</Text> <br />
                <Text type="secondary">SĐT: {booking.phoneNumber}</Text><br />
                <Text>Nhận phòng: {dayjs(booking.checkInDate).format("DD/MM/YYYY")}</Text> - <Text>Trả phòng: {dayjs(booking.checkOutDate).format("DD/MM/YYYY")}</Text>
              </div>
              <div className="mt-2 md:mt-0 flex flex-col gap-2 items-end">
                <Tag color={
                  booking.status === BookingStatus.CONFIRMED ? "gold"
                    : booking.status === BookingStatus.CHECKED_IN ? "green"
                    : booking.status === BookingStatus.CHECKED_OUT ? "blue"
                    : booking.status === BookingStatus.CANCELLED ? "red"
                    : booking.status === BookingStatus.NO_SHOW ? "default"
                    : booking.status === BookingStatus.REFUNDED ? "purple"
                    : "default"
                }>
                  {statusOptions.find(opt => opt.value === booking.status)?.label || booking.status}
                </Tag>
                {booking.status === BookingStatus.CANCELLED ? (
                  <div className="text-red-500 font-semibold">
                    Yêu cầu hủy đã được xác nhận, chúng tôi sẽ hoàn tiền tương ứng đến bạn.
                  </div>
                ) : (
                  <Button
                    type="default"
                    danger
                    size="small"
                    disabled={booking.isCancel || booking.status === BookingStatus.CHECKED_IN}
                    onClick={() => {
                      if (booking.status === BookingStatus.CHECKED_IN) {
                        messageApi.open({
                          type: 'error',
                          content: 'Phiếu đặt phòng đã nhận phòng, không thể yêu cầu hủy.'
                        });
                        return;
                      }
                      setSelectedBooking(booking);
                      setModalOpen(true);
                    }}
                  >
                    {booking.isCancel ? "Đã gửi yêu cầu hủy" : "Yêu cầu hủy"}
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Modal
            open={modalOpen}
            title="Xác nhận yêu cầu hủy phiếu đặt phòng"
            onCancel={() => setModalOpen(false)}
            onOk={handleCancelBooking}
            okText="Xác nhận hủy"
            cancelText="Đóng"
            confirmLoading={cancelLoading}
          >
            {selectedBooking && (
              <div>
                <p><b>Khách hàng:</b> {selectedBooking.customerName}</p>
                <p><b>Các phòng đã đặt:</b></p>
                <ul className="list-disc pl-5">
                  {selectedBooking.bookingDetails && selectedBooking.bookingDetails.length > 0 ? (
                    selectedBooking.bookingDetails.map((detail: any, idx: number) => (
                      <li key={detail._id || idx}>
                        Phòng: <b>{detail.room?.roomType || detail.room || ""}</b> | Số lượng: <b>{detail.quantity}</b> | Giá: <b>{detail.price?.toLocaleString('vi-VN')}đ</b>
                      </li>
                    ))
                  ) : (
                    <li>Không có dữ liệu phòng</li>
                  )}
                </ul>
              </div>
            )}
          </Modal>
        </div>
      ) : null}
    </div>
    </MainClient>
  );
}
