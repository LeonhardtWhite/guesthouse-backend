import { Client } from "@line/bot-sdk";

export interface BookingNotificationPayload {
  id?: string;
  check_in: string;
  check_out: string;
  room_type: string;
  people: number;
  name: string;
  phone: string;
  need_pickup: boolean;
  line_user_id: string;
  line_display_name: string;
}

const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const channelSecret = process.env.LINE_CHANNEL_SECRET;
const hostOwnerUserId = process.env.HOST_OWNER_USER_ID;

const lineClient =
  channelAccessToken && channelSecret
    ? new Client({
        channelAccessToken,
        channelSecret,
      })
    : null;

export async function sendBookingNotification(booking: BookingNotificationPayload): Promise<void> {
  if (!lineClient || !hostOwnerUserId) {
    console.warn("LINE credentials or host owner user ID missing - skipping notification.");
    return;
  }

  const summary = [
    `🔔 新訂房通知`,
    `訂單ID: ${booking.id ?? "N/A"}`,
    `房型: ${booking.room_type}`,
    `入住: ${booking.check_in}`,
    `退房: ${booking.check_out}`,
    `人數: ${booking.people}`,
    `姓名: ${booking.name}`,
    `電話: ${booking.phone}`,
    `接送需求: ${booking.need_pickup ? "需要" : "不需要"}`,
    `LINE User: ${booking.line_display_name} (${booking.line_user_id})`,
  ].join("\n");

  await lineClient.pushMessage(hostOwnerUserId, {
    type: "text",
    text: summary,
  });
}
