import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface Notification {
  id: string;
  message: string;
  created_at: string;
  [key: string]: any;
}

interface NotificationsProps {
  user: { id: string } | null;
}

const Notifications: React.FC<NotificationsProps> = ({ user }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setNotifications((data as Notification[]) || []);
    };
    fetchNotifications();
  }, [user]);

  const handleDelete = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  if (!user) return null;

  return (
    <div className="bg-zinc-900 p-4 rounded shadow max-w-md mx-auto mt-8">
      <h2 className="text-lg font-bold mb-4 text-red-500">Notifications</h2>
      {notifications.length === 0 ? (
        <div className="text-gray-400">No notifications yet.</div>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="bg-zinc-800 p-3 rounded flex justify-between items-center"
            >
              <div>
                <div className="text-sm text-gray-100">{n.message}</div>
                <div className="text-xs text-gray-400">
                  {new Date(n.created_at).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => handleDelete(n.id)}
                className="text-xs text-red-400 hover:text-red-600 ml-4"
                title="Delete notification"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
