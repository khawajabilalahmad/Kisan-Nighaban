import React, { useState, useEffect } from 'react';
import { ArrowLeft, CloudLightning, Droplets, Thermometer, Wind, CheckCircle2, AlertTriangle, Info, BellOff, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notificationsAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationsAPI.getNotifications();
      // Ensure it's an array
      if (Array.isArray(data)) {
        setNotifications(data);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent trigger click on the notification card
    try {
      await notificationsAPI.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success("Notification deleted!");
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const getStyleForType = (type) => {
    switch (type) {
      case 'danger':
        return 'bg-red-50 dark:bg-red-900/20 text-red-500 border-red-200 dark:border-red-900/50';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 border-yellow-200 dark:border-yellow-900/50';
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 text-green-500 border-green-200 dark:border-green-900/50';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-500 border-blue-200 dark:border-blue-900/50';
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'danger':
        return <CloudLightning size={24} />;
      case 'warning':
        return <AlertTriangle size={24} />;
      case 'success':
        return <CheckCircle2 size={24} />;
      default:
        return <Info size={24} />;
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading notifications...</div>;
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Notifications</h1>
        </div>
      </div>

      {/* List */}
      <div className="p-4 space-y-4 pb-28">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-400">
            <BellOff size={48} className="mb-4 opacity-50" />
            <p>No new notifications right now.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id}
              onClick={() => {
                if (!notif.is_read) handleMarkAsRead(notif.id);
                if (notif.farm_id) navigate(`/farms/${notif.farm_id}`);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                notif.is_read 
                  ? 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 opacity-75' 
                  : 'bg-white dark:bg-slate-800 border-primary/30 shadow-lg shadow-primary/5'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-2xl border ${getStyleForType(notif.notification_type)}`}>
                  {getIconForType(notif.notification_type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold ${notif.is_read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                      {notif.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                        {new Date(notif.created_at).toLocaleDateString()}
                      </span>
                      <button 
                        onClick={(e) => handleDelete(notif.id, e)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <p className={`text-sm mb-2 ${notif.is_read ? 'text-slate-500 dark:text-slate-400' : 'text-slate-600 dark:text-slate-300'}`}>
                    {notif.message_en || notif.message}
                  </p>
                  
                  {notif.farm_id && (
                    <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700/50 text-xs font-medium text-slate-600 dark:text-slate-400">
                      <span>Farm Associated</span>
                    </div>
                  )}
                </div>
                
                {!notif.is_read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 shrink-0"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
