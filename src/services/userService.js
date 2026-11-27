import { apiRequest } from "./api";

export const getUsers = () => apiRequest("/users");
export const getAdmins = () => apiRequest("/admins");
export const createUser = (user) =>
  apiRequest("/users", { method: "POST", body: JSON.stringify(user) });
