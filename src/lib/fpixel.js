export const FB_PIXEL_ID = 1500816977533329;

export const pageview = () => {
  window.fbq("track", "PageView");
};

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name, options = {}, eventID = {}) => {
  window.fbq("track", name, options, eventID);
};
