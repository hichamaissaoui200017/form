// lib/sendToTelegram.ts

import axios from 'axios';
import * as fbq from './fpixel'; // Ensure this import path is correct based on your project structure

const TELEGRAM_BOT_TOKEN = '7171468484:AAHrIzqSBWAT-zRIlDAWnGZNtd-dw71tWYI';
const TELEGRAM_CHAT_ID = ['-4143007153', '-1002030599625'];

export async function sendToTelegram(message: string, fbmessage: object, userId: string) {
  // Send message to all specified Telegram chat IDs
  for (let chatId of TELEGRAM_CHAT_ID) {
    try {
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: message,
      });
      console.log(`Message sent to Telegram chat id ${chatId}`);
    } catch (error) {
      console.error(`Error sending message to Telegram chat id ${chatId}:`, error);
    }
  }

  // Send Facebook CompleteRegistration event
  try {
    const eventId = userId;
    fbq.event('CompleteRegistration', {}, { eventID: eventId });
    console.log('Facebook CompleteRegistration event sent.');

    // Send data to Facebook Graph API
    const response = await fetch(
      `https://graph.facebook.com/v20.0/1500816977533329/events?access_token=EAADjTOZBuizEBOZBiXCZAMOT3Yaj0TL09BS9nBAr4IRWa24abUQfF3pEYbqaea2tRrINrHC9EO22zlo8LkNm51EHzFVldZBLfGbh3u7V5lXmpi2p8YsAZBheYs2mKpvROxmRWj4d4JT0kZAkcJVAmBZBeANJOuVJLnxNqSySIdP97fzus9DuafOvX9P69ga5MwapwZDZD`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fbmessage),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error sending Facebook event:', error);
  }

  console.log(fbmessage);
}