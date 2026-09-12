import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useNotifications } from '@/context/NotificationContext';
import {
  Bell,
  CheckCircle2,
  Clock,
  Layers,
  SlidersHorizontal,
  Truck,
  FileCheck,
  CheckCheck,
  Trash2,
  ExternalLink,
} from 'lucide-react';

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleNotificationClick = (notif: { id: string; read: boolean; link?: string }) => {
    if (!notif.read) {
      markAsRead(notif.id);
    }
    if (notif.link) {
      navigate(notif.link);
      setIsOpen(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'bid':
        return <SlidersHorizontal className="h-4 w-4 text-amber-600" />;
      case 'order':
        return <FileCheck className="h-4 w-4 text-blue-600" />;
      case 'listing':
        return <Layers className="h-4 w-4 text-emerald-600" />;
      case 'delivery':
        return <Truck className="h-4 w-4 text-teal-600" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    }
  };

  const getIconContainer = (type: string) => {
    switch (type) {
      case 'bid':
        return 'bg-amber-50 border-amber-200/80';
      case 'order':
        return 'bg-blue-50 border-blue-200/80';
      case 'listing':
        return 'bg-emerald-50 border-emerald-200/80';
      case 'delivery':
        return 'bg-teal-50 border-teal-200/80';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        aria-label="View notifications"
        aria-expanded={isOpen}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-extrabold text-white shadow-xs ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden"
          >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-bold text-black dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-black border border-neutral-200 dark:bg-neutral-900 dark:text-white dark:border-neutral-800">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="flex items-center space-x-1 text-[11px] font-medium text-black hover:underline dark:text-neutral-300"
                  title="Mark all as read"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>Mark read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="flex items-center space-x-1 text-[11px] text-neutral-400 hover:text-black dark:hover:text-white"
                  title="Clear all"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60">
            {notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="mx-auto h-7 w-7 text-neutral-300 dark:text-neutral-600" />
                <p className="mt-2 text-xs font-semibold text-black dark:text-white">
                  All caught up!
                </p>
                <p className="text-[11px] text-neutral-500">
                  No new telemetry or trade notifications.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`flex items-start space-x-3 p-3.5 transition cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 ${
                    !notif.read ? 'bg-neutral-100/70 dark:bg-neutral-900/60' : ''
                  }`}
                >
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${getIconContainer(notif.type)}`}>
                    {getIconForType(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0"></span>
                      )}
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600 line-clamp-2">
                      {notif.message}
                    </p>
                    <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 pt-0.5">
                      <Clock className="h-3 w-3" />
                      <span>{notif.timestamp}</span>
                      {notif.link && (
                        <span className="flex items-center space-x-0.5 text-emerald-700 font-semibold pl-1 hover:underline">
                          <span>View</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/70 p-2 text-center">
              <span className="text-[10px] text-slate-500">
                Connected to CarbonX Event Stream
              </span>
            </div>
          )}
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
