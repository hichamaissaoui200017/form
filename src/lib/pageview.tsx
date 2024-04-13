
import getUserIP from './getUserIP';
import * as fbq from "./fpixel";
export async function pageview(userId: string) {
const additionalData = {};
fbq.event("ViewContent", additionalData, {eventID: userId} )
const ViewContent = {
    "data": [
      {
        "event_name": "ViewContent",
        "event_time": Math.floor(Date.now() / 1000),
        "action_source": "website",
        "event_id": userId,
        "event_source_url": window.location.href,
        "user_data": {
          "client_ip_address": await getUserIP(),
          "client_user_agent": navigator.userAgent
        }
      }
    ],
    "test_event_code": "TEST77801"
  };
  fetch(`https://graph.facebook.com/v19.0/1360447498681150/events?access_token=EAADjTOZBuizEBO9kSjtyrFOCr0usK23PspquJKTbZCbYEPXoWiTbaw4m8QXZAVkUGmDjFZCCi8bFngg2LEDt5drUFP12Kv33ORkybXDFd7X2KSZAySR9NWj56nwFF5pzsZAc7ywoLckzLXest0UhtldkiRkhFvizfhxRmMyw1IcS0QvsCWhLfPWMaBHZATNJR86KgZDZD`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(ViewContent)
  })
  .then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
}
