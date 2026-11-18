import { apiRequest } from "./api";
export const getProducts = () => apiRequest("/products");
export const getProduct = (id) => apiRequest(`/products/${encodeURIComponent(id)}`);
export const updateProduct = (id, changes) => apiRequest(`/products/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(changes) });
