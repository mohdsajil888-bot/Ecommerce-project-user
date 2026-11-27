import { apiRequest } from "./api";

export const getOrders = () => apiRequest("/orders");
export const createOrder = (order) =>
  apiRequest("/orders", { method: "POST", body: JSON.stringify(order) });
export const updateOrderStatus = (id, status) =>
  apiRequest(`/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
export const deleteOrder = (id) =>
  apiRequest(`/orders/${id}`, { method: "DELETE" });
