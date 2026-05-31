import { createNotification } from "../Apis/NotificationApi.jsx";

export async function notify({ ownerId, type, action, title, message }) {
  if (!ownerId) return;

  await createNotification({
    owner: ownerId,
    type,
    action,
    title,
    message,
  });
}
