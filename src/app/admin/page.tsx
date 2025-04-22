'use client';

import React, { useEffect, useState } from 'react';
import ThongKePage from './thong-ke/page';

const DashboardPage = () => {
  const [renderLayout, setRenderLayout] = useState<any>(null);

  useEffect(() => {
 
      setRenderLayout( <ThongKePage />);
   
  }, []);

  return renderLayout;
};
export default DashboardPage;
