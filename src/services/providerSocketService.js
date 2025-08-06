import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { getProviderToken } from "../utils/providerCookieUtils";

const SOCKET_URL = "http://localhost:4000";

// Provider Socket Service for BookMyMandap
export const providerSocketService = {
  socket: null,
  notifications:
    JSON.parse(localStorage.getItem("providerNotifications")) || [],

  // Save notifications to localStorage
  saveNotifications: () => {
    localStorage.setItem(
      "providerNotifications",
      JSON.stringify(providerSocketService.notifications)
    );
  },

  // Initialize Socket.IO connection
  connect: (providerId) => {
    if (!providerId) {
      toast.error("Provider ID is required for socket connection");
      return;
    }

    const token = getProviderToken();
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    // Create socket connection with authentication token
    providerSocketService.socket = io(SOCKET_URL, {
      withCredentials: true,
      auth: { token },
    });

    // Handle connection
    providerSocketService.socket.on("connect", () => {
      console.log(
        "Connected to Socket.IO server:",
        providerSocketService.socket.id
      );
      // Join provider room
      providerSocketService.socket.emit("joinProviderRoom", providerId);
      toast.success("Connected to real-time updates");
    });

    // Handle new provider registration event
    providerSocketService.socket.on("newProviderRegistration", (data) => {
      console.log("New provider registered:", data);
      toast.success(
        `Welcome, ${data.provider.name}! Your account is pending approval.`
      );
      const notification = {
        id: data.id || `registration_${Date.now()}`,
        title: "New Provider Registration",
        message: `Welcome, ${data.provider.name}! Your account is pending approval.`,
        type: "registration",
        read: false,
        createdAt: new Date(),
      };
      if (
        !providerSocketService.notifications.some(
          (n) => n.id === notification.id
        )
      ) {
        providerSocketService.notifications.push(notification);
        providerSocketService.saveNotifications();
      }
    });

    // Handle login success event
    providerSocketService.socket.on("loginSuccess", (data) => {
      console.log("Login successful:", data);
      toast.success("Logged in successfully!");
    });

    // Handle approval status update
    providerSocketService.socket.on("approvalStatusUpdate", (data) => {
      console.log("Approval status updated:", data);
      const message =
        data.status === "approved"
          ? "Your provider account has been approved!"
          : "Your provider account was rejected.";
      toast[data.status === "approved" ? "success" : "error"](message);
      const notification = {
        id: data.id || `approval_${Date.now()}`,
        title: "Approval Status Update",
        message,
        type: "approval",
        read: false,
        createdAt: new Date(),
      };
      if (
        !providerSocketService.notifications.some(
          (n) => n.id === notification.id
        )
      ) {
        providerSocketService.notifications.push(notification);
        providerSocketService.saveNotifications();
      }
    });

    // Handle new booking notification
    providerSocketService.socket.on("new_booking", (data) => {
      console.log("New booking notification:", data);
      toast.success(data.message);
      const notification = {
        id: data.id,
        title: data.title,
        message: data.message,
        type: data.type,
        read: data.read,
        relatedId: data.relatedId,
        relatedModel: data.relatedModel,
        createdAt: new Date(data.createdAt),
      };
      if (
        !providerSocketService.notifications.some(
          (n) => n.id === notification.id
        )
      ) {
        providerSocketService.notifications.push(notification);
        providerSocketService.saveNotifications();
      }
    });

    // Handle deleted booking notification
    providerSocketService.socket.on("deleted_booking", (data) => {
      console.log("Booking deleted notification:", data);
      toast.error(data.message);
      const notification = {
        id: data.id,
        title: data.title,
        message: data.message,
        type: data.type,
        read: data.read,
        relatedId: data.relatedId,
        relatedModel: data.relatedModel,
        createdAt: new Date(data.createdAt),
      };
      if (
        !providerSocketService.notifications.some(
          (n) => n.id === notification.id
        )
      ) {
        providerSocketService.notifications.push(notification);
        providerSocketService.saveNotifications();
      }
    });

    // Handle updated booking notification
    providerSocketService.socket.on("updated_booking", (data) => {
      console.log("Booking updated notification:", data);
      toast.success(data.message);
      const notification = {
        id: data.id,
        title: data.title,
        message: data.message,
        type: data.type,
        read: data.read,
        relatedId: data.relatedId,
        relatedModel: data.relatedModel,
        createdAt: new Date(data.createdAt),
      };
      if (
        !providerSocketService.notifications.some(
          (n) => n.id === notification.id
        )
      ) {
        providerSocketService.notifications.push(notification);
        providerSocketService.saveNotifications();
      }
    });

    // Handle new review notification
    providerSocketService.socket.on("new_review", (data) => {
      console.log("New review notification:", data);
      toast.success(data.message);
      const notification = {
        id: data.id,
        title: data.title,
        message: data.message,
        type: data.type,
        read: data.read,
        relatedId: data.relatedId,
        relatedModel: data.relatedModel,
        createdAt: new Date(data.createdAt),
      };
      if (
        !providerSocketService.notifications.some(
          (n) => n.id === notification.id
        )
      ) {
        providerSocketService.notifications.push(notification);
        providerSocketService.saveNotifications();
      }
    });

    // Handle connection error
    providerSocketService.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      toast.error("Failed to connect to real-time updates");
    });

    // Handle disconnection
    providerSocketService.socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
      toast.error("Disconnected from real-time updates");
    });
  },

  // Disconnect from Socket.IO
  disconnect: () => {
    if (providerSocketService.socket) {
      providerSocketService.socket.disconnect();
      providerSocketService.socket = null;
      console.log("Provider socket disconnected");
    }
  },

  // Check if socket is connected
  isConnected: () => {
    return providerSocketService.socket?.connected || false;
  },

  // Get all notifications, sorted by createdAt (descending)
  getNotifications: () => {
    return [...providerSocketService.notifications].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  },

  // Get unread notification count
  getUnreadCount: () => {
    return providerSocketService.notifications.filter((n) => !n.read).length;
  },

  // Mark a notification as read
  markAsRead: (id) => {
    providerSocketService.notifications =
      providerSocketService.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      );
    providerSocketService.saveNotifications();
  },

  // Mark all notifications as read
  markAllAsRead: () => {
    providerSocketService.notifications =
      providerSocketService.notifications.map((notification) => ({
        ...notification,
        read: true,
      }));
    providerSocketService.saveNotifications();
  },

  // Remove a notification
  removeNotification: (id) => {
    providerSocketService.notifications =
      providerSocketService.notifications.filter(
        (notification) => notification.id !== id
      );
    providerSocketService.saveNotifications();
  },

  // Clear all notifications
  clearNotifications: () => {
    providerSocketService.notifications = [];
    providerSocketService.saveNotifications();
  },
};
