"use client";

import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Button, DatePicker, Select, Tag, Spin, Empty, Modal, message } from "antd";
import { useRouter } from "next/navigation";
import MainAdmin from "@/layout/MainAdmin";
import dayjs, { Dayjs } from "dayjs";
import { BookingStatus } from "@/config/constant";

const { Title, Text } = Typography;
const { Option } = Select;

interface BookingData {
    _id: string;
    customerName: string;
    roomType: string;
    status: string;
    checkInDate: string;
    checkOutDate: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: any;
}

const statusOptions = [
    { value: "", label: "Tất cả" },
    { value: BookingStatus.CONFIRMED, label: "Đã xác nhận" },
    { value: BookingStatus.CHECKED_IN, label: "Đã nhận phòng" },
    { value: BookingStatus.CHECKED_OUT, label: "Đã trả phòng" },
    { value: BookingStatus.CANCELLED, label: "Đã hủy" },
    { value: BookingStatus.NO_SHOW, label: "Không đến" },
    { value: BookingStatus.REFUNDED, label: "Đã hoàn tiền" },
];

export default function BookingAdminPage() {
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState<Dayjs>(dayjs());
    const [status, setStatus] = useState<string>("");
    const router = useRouter();

    // State cho modal xác nhận
    const [confirmModal, setConfirmModal] = useState<{open: boolean, bookingId?: string}>({open: false});
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                const dateStr = date.format("YYYY-MM-DD");
                const params = new URLSearchParams();
                params.append("date", dateStr);
                if (status) params.append("status", status);
                const response = await fetch(
                    `http://localhost:8080/bookings?${params.toString()}`
                );
                if (!response.ok) throw new Error("Failed to fetch bookings");
                const result = await response.json();
                setBookings(Array.isArray(result) ? result : []);
            } catch (error) {
                setBookings([]);
                // eslint-disable-next-line no-console
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [date, status]);

    return (
        <MainAdmin>
            <div className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">
                    <Title level={2}>Quản lý phiếu đặt phòng</Title>
                    <div className="flex gap-2 flex-wrap">
                        <DatePicker
                            value={date}
                            onChange={d => d && setDate(d)}
                            format="YYYY-MM-DD"
                            allowClear={false}
                            className="min-w-[140px]"
                        />
                        <Select
                            value={status}
                            style={{ minWidth: 120 }}
                            onChange={setStatus}
                        >
                            {statusOptions.map(opt => (
                                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                            ))}
                        </Select>
                        <Button type="primary" className="bg-blue-500" onClick={() => router.push("/admin/booking/new")}>Tạo phiếu mới</Button>
                    </div>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center min-h-[200px]"><Spin size="large" /></div>
                ) : bookings.length === 0 ? (
                    <Empty description="Không có phiếu đặt phòng nào cho ngày này" />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border-b text-center">STT</th>
                                    <th className="px-4 py-2 border-b text-left">Tên khách</th>
                                    <th className="px-4 py-2 border-b text-left">Số điện thoại</th>
                                    <th className="px-4 py-2 border-b text-left">Trạng thái</th>
                                    <th className="px-4 py-2 border-b text-center">Yêu cầu hủy</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking, index) => (
                                    <tr key={booking._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border-b text-center whitespace-nowrap">{index + 1}</td>
                                        <td
                                            className="px-4 py-2 border-b text-blue-600 cursor-pointer underline whitespace-nowrap"
                                            onClick={() => router.push(`/admin/booking/${booking._id}`)}
                                        >
                                            {booking.customerName}
                                        </td>
                                        <td className="px-4 py-2 border-b whitespace-nowrap">{booking.phoneNumber}</td>
                                        <td className="px-4 py-2 border-b whitespace-nowrap">
                                            <Tag
                                                color={
                                                    booking.status === BookingStatus.CONFIRMED ? "gold"
                                                        : booking.status === BookingStatus.CHECKED_IN ? "green"
                                                        : booking.status === BookingStatus.CHECKED_OUT ? "blue"
                                                        : booking.status === BookingStatus.CANCELLED ? "red"
                                                        : booking.status === BookingStatus.NO_SHOW ? "default"
                                                        : booking.status === BookingStatus.REFUNDED ? "purple"
                                                        : "default"
                                                }
                                            >
                                                {statusOptions.find(opt => opt.value === booking.status)?.label || booking.status}
                                            </Tag>
                                        </td>
                                        <td className="px-4 py-2 border-b text-center">
    {booking.isCancel === true && booking.status !== BookingStatus.CANCELLED ? (
        <Button danger size="small" onClick={() => setConfirmModal({open: true, bookingId: booking._id})}>
            Xác nhận yêu cầu
        </Button>
    ) : (
        <span>&nbsp;</span>
    )}
</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <Modal
                    open={confirmModal.open}
                    title="Xác nhận yêu cầu hủy phiếu đặt phòng"
                    onCancel={() => setConfirmModal({open: false})}
                    onOk={async () => {
                        if (!confirmModal.bookingId) return;
                        setConfirmLoading(true);
                        try {
                            await fetch(`http://localhost:8080/bookings/${confirmModal.bookingId}/status`, {
                                method: "PATCH",
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'CANCELLED' })
                            });
                            setConfirmModal({open: false});
                            const fetchBookings = async () => {
                                setLoading(true);
                                try {
                                    const dateStr = date.format("YYYY-MM-DD");
                                    const params = new URLSearchParams();
                                    params.append("date", dateStr);
                                    if (status) params.append("status", status);
                                    const response = await fetch(
                                        `http://localhost:8080/bookings?${params.toString()}`
                                    );
                                    if (!response.ok) throw new Error("Failed to fetch bookings");
                                    const result = await response.json();
                                    setBookings(Array.isArray(result) ? result : []);
                                } catch (error) {
                                    setBookings([]);
                                    // eslint-disable-next-line no-console
                                    console.error("Error fetching bookings:", error);
                                } finally {
                                    setLoading(false);
                                }
                            };
                            fetchBookings(); // reload lại dữ liệu
                            message.success('Đã chuyển trạng thái hủy thành công!');
                        } catch {
                            message.error('Có lỗi xảy ra, vui lòng thử lại.');
                        } finally {
                            setConfirmLoading(false);
                        }
                    }}
                    okText="Xác nhận hủy"
                    cancelText="Đóng"
                    confirmLoading={confirmLoading}
                >
                    Bạn có chắc chắn muốn xác nhận yêu cầu hủy phiếu đặt phòng này không?
                </Modal>
            </div>
        </MainAdmin>
    );
}
