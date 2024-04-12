export const FB_PIXEL_ID = 1360447498681150;

export const pageview = () => {
  window.fbq("track", "PageView");
};

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name, options = {}, eventID = {}) => {
  window.fbq("track", name, options, eventID);
};
