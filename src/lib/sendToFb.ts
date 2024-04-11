// lib/sendToTelegram.ts
import axios from 'axios';
import * as fbq from "./fpixel";
import crypto from "crypto";


export async function sendToFb(message: string) {

    const sendData = {
        message: message
    };
    
    try {
        const response = await axios.post(`https://graph.facebook.com/v19.0/${process.env.FACEBOOK_PIXEL_ID}/events?access_token=${process.env.NEXT_PUBLIC_FBACCESSKEY}`, {
            data: [sendData],
            test_event_code: process.env.NEXT_PUBLIC_TEST_ID
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        console.log(response.data);
    } catch (error) {
        console.error('Error:', error);
    }
}
