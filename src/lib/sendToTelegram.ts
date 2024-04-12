// lib/sendToTelegram.ts
import axios from 'axios';
import * as fbq from "./fpixel";

const TELEGRAM_BOT_TOKEN = '7171468484:AAHrIzqSBWAT-zRIlDAWnGZNtd-dw71tWYI';
const TELEGRAM_CHAT_ID = '-4143007153';

export async function sendToTelegram(message: string, fbmessage: object, userId: string) {
  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
  }
  const eventId: string = userId;
  const sendData = fbmessage;
  const additionalData = {};
  fbq.event("CompleteRegistration", additionalData, {eventID: eventId} )
  console.log(fbmessage)
  fbq.event("CompleteRegistration", additionalData, {eventID: eventId} )

fetch(`https://graph.facebook.com/v19.0/1360447498681150/events?access_token=EAADjTOZBuizEBO9kSjtyrFOCr0usK23PspquJKTbZCbYEPXoWiTbaw4m8QXZAVkUGmDjFZCCi8bFngg2LEDt5drUFP12Kv33ORkybXDFd7X2KSZAySR9NWj56nwFF5pzsZAc7ywoLckzLXest0UhtldkiRkhFvizfhxRmMyw1IcS0QvsCWhLfPWMaBHZATNJR86KgZDZD`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(fbmessage)
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
.then(data => console.log(data))
.catch(error => console.error('Error:', error));}