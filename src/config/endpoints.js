const server = "http://ec2-3-110-165-7.ap-south-1.compute.amazonaws.com:20601";

export const devEndpoints = {
  login: server + "/user/login",
  register: server + "/user/register",
  planning: server + "/dashboard/planning",
  sites: server + "/dashboard/sites",
};
