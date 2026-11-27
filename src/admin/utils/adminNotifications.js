import toast from "react-hot-toast";

const NOTIFICATION_KEY = "lindt-admin-notifications";

export const isAdminNotificationEnabled = () => {
  return localStorage.getItem(NOTIFICATION_KEY) !== "false";
};

export const setAdminNotificationEnabled = (enabled) => {
  localStorage.setItem(NOTIFICATION_KEY, String(enabled));
};

export const adminNotify = {
  success(message) {
    if (isAdminNotificationEnabled()) {
      toast.success(message);
    }
  },

  error(message) {
    if (isAdminNotificationEnabled()) {
      toast.error(message);
    }
  },
};