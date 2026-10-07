import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function useSocket() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jc_token');
    if (!token) return;
    const url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const s = io(url, { auth: { token } });
    setSocket(s);
    return () => s.disconnect();
  }, []);

  return socket;
}