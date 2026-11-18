import { apiRequest } from "./api";

export async function getUserItems(collection, userId) {
  const records = await apiRequest(`/${collection}?userId=${encodeURIComponent(userId)}`);
  return records[0]?.items ?? [];
}

export async function saveUserItems(collection, userId, items) {
  const records = await apiRequest(`/${collection}?userId=${encodeURIComponent(userId)}`);
  const record = records[0];
  const payload = { userId: String(userId), items };
  if (record) {
    await apiRequest(`/${collection}/${record.id}`, { method: "PATCH", body: JSON.stringify(payload) });
  } else {
    await apiRequest(`/${collection}`, { method: "POST", body: JSON.stringify(payload) });
  }
}
