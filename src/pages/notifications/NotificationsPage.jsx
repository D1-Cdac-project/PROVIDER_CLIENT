import React from "react";
import { Card, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { providerSocketService } from "../../services/providerSocketService";
import { Bell, Check, Calendar, Star, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function NotificationsPage() {
  const notifications = providerSocketService.getNotifications();
  const markAsRead = providerSocketService.markAsRead;
  const markAllAsRead = providerSocketService.markAllAsRead;
  const removeNotification = providerSocketService.removeNotification;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "new_booking":
      case "updated_booking":
      case "deleted_booking":
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case "new_review":
        return <Star className="w-5 h-5 text-yellow-500" />;
      case "registration":
      case "approval":
        return <Bell className="w-5 h-5 text-gray-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationLink = (notification) => {
    switch (notification.type) {
      case "new_booking":
      case "updated_booking":
      case "deleted_booking":
        return notification.relatedId
          ? `/bookings/${notification.relatedId}`
          : "/bookings";
      case "new_review":
        return notification.relatedId
          ? `/reviews/${notification.relatedId}`
          : "/reviews";
      default:
        return "#";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <div className="flex space-x-2">
          <Button
            onClick={markAllAsRead}
            variant="outline"
            size="sm"
            disabled={
              notifications.length === 0 || notifications.every((n) => n.read)
            }
          >
            <Check className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
          <Button
            onClick={providerSocketService.clearNotifications}
            variant="outline"
            size="sm"
            disabled={notifications.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear all
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No notifications
              </h3>
              <p className="text-gray-500">You're all caught up!</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-colors ${
                !notification.read ? "bg-blue-50 border-blue-200" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {format(
                            new Date(notification.createdAt),
                            "MMM d, yyyy h:mm a"
                          )}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <Button
                            onClick={() => markAsRead(notification.id)}
                            variant="ghost"
                            size="sm"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}

                        <Button
                          onClick={() => removeNotification(notification.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Link
                        to={getNotificationLink(notification)}
                        className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                      >
                        View details →
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
