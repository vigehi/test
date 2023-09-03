import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Notice from './Notice';

const Layout = () => {
  const location = useLocation();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (location.state?.notice) {
      setNotice(location.state.notice);
    } else if (notice) {
      setNotice(null);
    }
  }, [location]);

  return (
    <div className="d-flex h-100 position-relative">
      <Sidebar />
      <main className="flex-grow-1 position-relative w-100 overflow-hidden">
        {notice && <Notice message={notice} closeHandler={setNotice} />}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
