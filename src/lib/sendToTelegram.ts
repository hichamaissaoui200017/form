// lib/sendToTelegram.ts
import axios from 'axios';
import * as fbq from "./fpixel";

const TELEGRAM_BOT_TOKEN = '7171468484:AAHrIzqSBWAT-zRIlDAWnGZNtd-dw71tWYI';
const TELEGRAM_CHAT_ID = ['-4143007153', '-1002030599625']; //'-4143007153';

export async function sendToTelegram(message: string, fbmessage: object, userId: string) {
  for (let i = 0; i < TELEGRAM_CHAT_ID.length; i++) {
  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID[i],
      text: message,
    });
  } catch (error) {
    console.error(`Error sending message to Telegram chat id ${TELEGRAM_CHAT_ID[i]}:`, error);
  }
}
  const eventId: string = userId;
  const sendData = fbmessage;
  const additionalData = {};
  fbq.event("CompleteRegistration", additionalData, {eventID: eventId} )
  console.log(fbmessage)
fetch(`https://graph.facebook.com/v20.0/1500816977533329/events?access_token=EAADjTOZBuizEBO3xo2vFTM1QWHZAQjZBuQNB9zYGdj6O92InRDU6r883qGg9BIaoNEEoWHfZBTuc8igEMSbUEcwpWvPJmXpJA0trFHmdHzoxHtsSSZBoBRq5B89YlONmeVHkyKgct6FnOtKMJMuQNl6nUv7dOCK1ri2S3DFJd9EIW5Kt4ELeRSggZCnStP1glvmAZDZD`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(fbmessage)})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
}