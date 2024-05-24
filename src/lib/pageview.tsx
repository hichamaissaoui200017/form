
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
  "test_event_code": "TEST81446"
};
  fetch(`https://graph.facebook.com/v20.0/1500816977533329/events?access_token=EAADjTOZBuizEBOZBiXCZAMOT3Yaj0TL09BS9nBAr4IRWa24abUQfF3pEYbqaea2tRrINrHC9EO22zlo8LkNm51EHzFVldZBLfGbh3u7V5lXmpi2p8YsAZBheYs2mKpvROxmRWj4d4JT0kZAkcJVAmBZBeANJOuVJLnxNqSySIdP97fzus9DuafOvX9P69ga5MwapwZDZD`, {
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
