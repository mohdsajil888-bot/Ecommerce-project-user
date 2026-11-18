import { apiRequest } from "./api";
export const getOrders = () => apiRequest("/orders");
export const createOrder = (order) => apiRequest("/orders", { method: "POST", body: JSON.stringify(order) });
