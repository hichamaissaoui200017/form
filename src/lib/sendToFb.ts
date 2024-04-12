// lib/sendToTelegram.ts
import axios from 'axios';
import * as fbq from "./fpixel";
import crypto from "crypto";


export async function sendToFb(message: string, userId: string) {
    const additionalData = {};

    const eventId: string = userId;
    const sendData = message;

    fbq.event("CompleteRegistration", additionalData, {eventID: eventId} )
    
    fetch(`https://graph.facebook.com/v19.0/${process.env.FACEBOOK_PIXEL_ID}/events?access_token=${process.env.PUBLIC_FBACCESSKEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "data": [
                    sendData
                ], "test_event_code": process.env.TEST_ID
            })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}