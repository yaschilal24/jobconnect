import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import { notificationApi } from '../../api/notification.api';
import useSocket from '../../hooks/useSocket';

const MENU = [
  { to: '/seeker', label: 'Dashboard', icon: '📊', end: true },
  { to: '/seeker/applications', label: 'My Applications', icon: '📝' },
  { to: '/seeker/saved', label: 'Saved Jobs', icon: '❤️' },
  { to: '/seeker/profile', label: 'Profile', icon: '👤' },
  { to: '/seeker/notifications', label: 'Notifications', icon: '🔔' },
];

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    notificationApi.list()
      .then(({ data }) => setItems(data.notifications))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('notification', (n) => setItems((prev) => [n, ...prev]));
    return () => socket.off('notification');
  }, [socket]);

  const markAll = async () => {
    await notificationApi.markAllRead();
    setItems(items.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <DashboardLayout title="Notifications" items={MENU}>
      <div className="flex justify-end mb-4">
        <button onClick={markAll} className="btn-outline text-sm">Mark all read</button>
      </div>
      {loading ? <Spinner /> : items.length === 0 ? (
        <EmptyState title="No notifications" icon="🔔" />
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <div key={n.id} className={`card ${n.is_read ? '' : 'border-l-4 border-l-primary'}`}>
              <p className="font-medium">{n.title}</p>
              <p className="text-sm text-gray-600">{n.message}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}