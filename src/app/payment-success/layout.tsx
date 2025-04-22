import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Thanh toán thành công',
  description: 'Thanh toán thành công',
};

const PaymentSuccessLayout = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

export default PaymentSuccessLayout;
