// lib/sendToTelegram.ts
import axios from 'axios';

const TELEGRAM_BOT_TOKEN = '7171468484:AAHrIzqSBWAT-zRIlDAWnGZNtd-dw71tWYI';
const TELEGRAM_CHAT_ID = '-4143007153';

export async function sendToTelegram(message: string) {
  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
  }
}