// let server = "https://oohplatformapi.retailgate.tech:20601";
// server = "http://localhost:20601";
import Cookies from "js-cookie";

const server = window.location.hostname.includes("localhost")
  ? "http://localhost:20601"
  : "https://ooh.unmg.com.ph:8000";
export const headers = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${Cookies.get("token")}`,
  },
};
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
  assets: server + "/utasi/asset",
  contracts: server + "/utasi/contracts",
  stations: server + "/utasi/stations",
  trains: server + "/utasi/train",
  parapets: server + "/utasi/parapets",
  availability: server + "/utasi/availability",
  specs: server + "/utasi/specs",
};
