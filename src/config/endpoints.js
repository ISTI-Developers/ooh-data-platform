const server =
  import.meta.env.MODE === "development"
    ? "http://localhost:20601"
    : "https://oohplatformapi.retailgate.tech:20601";
export default server;

export const devEndpoints = {
  login: server + "/user/login",
  roles: server + "/user/roles",
  register: server + "/user/register",
  email: server + "/user/email-verification",
  password: server + "/user/password-change",
  planning: server + "/dashboard/planning",
  sites: server + "/dashboard/sites",
  behaviors: server + "/dashboard/behaviors",
  landmarks: server + "/dashboard/landmarks",
  siteImages: server + "/dashboard/site_images",
  contracts: server + "/utasi/contracts",
  stations: server + "/utasi/stations",
};
