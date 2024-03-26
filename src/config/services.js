import axios from "axios";
import { devEndpoints as url } from "./endpoints";
import { format } from "date-fns";
import Cookies from "js-cookie";

const retrievePlanning = async (get, options = null) => {
  try {
    console.log(JSON.stringify(options));
    const response = await axios.get(url.planning, {
      params: {
        get: get,
        options: get === "areas" ? JSON.stringify(options) : null,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const retrieveSite = async (id) => {
  try {
    return await fetchSiteInformation(id);
  } catch (e) {
    console.log(e);
  }
};
const retrieveSiteAnalytics = async (id, option) => {
  try {
    return await fetchSiteInformation(id, option);
  } catch (e) {
    console.log(e);
  }
};
const retrieveSites = async (type = null) => {
  try {
    const response = await axios.get(url.sites, {
      params: {
        type: type,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    return response.data;
  } catch (e) {
    console.log(e);
  }
};
const retrieveSitesCount = async () => {
  try {
    const response = await axios.get(url.sites, {
      params: {
        count: true,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const fetchSiteInformation = async (id, options = null) => {
  const params = {
    id: id,
  };
  if (options) {
    params.from = format(new Date(options.from), "MM-dd-yyyy");
    params.to = format(new Date(options.to), "MM-dd-yyyy");
  }
  const response = await axios.get(url.sites, {
    params: params,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });

  if (response.data) {
    return response.data;
  }
};
export const useService = () => {
  return {
    retrievePlanning,
    retrieveSite,
    retrieveSites,
    retrieveSitesCount,
    retrieveSiteAnalytics,
  };
};
