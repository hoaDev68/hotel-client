import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Admin',
  description: 'admin',
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

export default AdminLayout;
