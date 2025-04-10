// let server = "https://oohplatformapi.retailgate.tech:20601";
// server = "http://localhost:20601";
const server = window.location.hostname.includes("localhost")
  ? "http://localhost:20601"
  : "https://oohplatformapi.retailgate.tech:20601";

export const devEndpoints = {
  login: server + "/user/login",
  roles: server + "/user/roles",
  modules: server + "/user/modules",
  register: server + "/user/register",
  email: server + "/user/email-verification",
  password: server + "/user/password-change",
  planning: server + "/dashboard/planning",
  sites: server + "/dashboard/sites",
  behaviors: server + "/dashboard/behaviors",
  impressions: server + "/dashboard/impressions",
  landmarks: server + "/dashboard/landmarks",
  siteImages: server + "/dashboard/site_images",
};
