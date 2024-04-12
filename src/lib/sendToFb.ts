// lib/sendToTelegram.ts
import axios from 'axios';
import * as fbq from "./fpixel";
import crypto from "crypto";


export async function sendToFb(message: string, userId: string) {
    const additionalData = {};

    const eventId: string = userId;
    const sendData = message;

    fbq.event("CompleteRegistration", additionalData, {eventID: eventId} )
    
    fetch(`https://graph.facebook.com/v19.0/1360447498681150/events?access_token=EAADjTOZBuizEBOz3SsFJrgiH2RBsZA9lyslZCZAYdpIaTYQYLBtjzSYZA3npWWm2fziZC9ghU7vEbyjuOxl3wtKYQVXX67Cq4JzqRjsm36gQeZCTOg4BxgetZBgKpSQlOUB29noxDVFJms0jVbivDvQlT4v2IUUxuyvQMPFmNuiF7AlIJLQmrAxzdumadaZAcnwknngZDZD`, {
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