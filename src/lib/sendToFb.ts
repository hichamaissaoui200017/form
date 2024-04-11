// lib/sendToTelegram.ts
import axios from 'axios';
import * as fbq from "./fpixel";
import crypto from "crypto";


export async function sendToFb(message: string) {

    const sendData = {
        message: message
    };
    
    try {
        const response = await axios.post(`https://graph.facebook.com/v19.0/1360447498681150/events?access_token=EAADjTOZBuizEBOz3SsFJrgiH2RBsZA9lyslZCZAYdpIaTYQYLBtjzSYZA3npWWm2fziZC9ghU7vEbyjuOxl3wtKYQVXX67Cq4JzqRjsm36gQeZCTOg4BxgetZBgKpSQlOUB29noxDVFJms0jVbivDvQlT4v2IUUxuyvQMPFmNuiF7AlIJLQmrAxzdumadaZAcnwknngZDZD`, {
            data: [message],
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
