// lib/sendToTelegram.ts
import axios from 'axios';
import * as fbq from "./fpixel";
import crypto from "crypto";


export async function sendToFb(message: string, userId: string) {
    const additionalData = {};
    const eventId: string = userId;
    const sendData = message;

    fbq.event("CompleteRegistration", additionalData, {eventID: eventId} )
    
    fetch(`https://graph.facebook.com/v19.0/1360447498681150/events?access_token=EAADjTOZBuizEBO9kSjtyrFOCr0usK23PspquJKTbZCbYEPXoWiTbaw4m8QXZAVkUGmDjFZCCi8bFngg2LEDt5drUFP12Kv33ORkybXDFd7X2KSZAySR9NWj56nwFF5pzsZAc7ywoLckzLXest0UhtldkiRkhFvizfhxRmMyw1IcS0QvsCWhLfPWMaBHZATNJR86KgZDZD`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "data": [
                    sendData
                ], "test_event_code": "TEST77801"
            })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}