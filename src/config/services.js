import axios from "axios";
import { devEndpoints as url } from "./endpoints";
import Cookies from "js-cookie";
import { format } from "date-fns";

const retrievePlanning = async (get, options = null) => {
  try {
    const response = await axios.get(url.planning, {
      params: {
        get: get,
        options: get === "areas" ? JSON.stringify(options) : null,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const retrieveSite = async (id, options) => {
  try {
    // const siteCache = Cookies.get("siteCache");
    // const analyticsDate = Cookies.get("analyticsDate");
    // if (siteCache && analyticsDate) {
    //   const siteInformation = JSON.parse(siteCache);
    //   const dates = JSON.parse(analyticsDate);
    //   if (siteInformation.id === id && dates === options) {
    //     return siteInformation;
    //   } else {
    //     await fetchSiteInformation(id, options);
    //   }
    // } else {
    return await fetchSiteInformation(id, options);
    // }
  } catch (e) {
    console.log(e);
  }
};
const retrieveSites = async (type = null) => {
  try {
    const response = await axios.get(url.sites, {
      params: {
        type: type,
        // options: options,
      },
      headers: {
        "Content-Type": "application/json",
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
        // options: options,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const fetchSiteInformation = async (id, options) => {
  const response = await axios.get(url.sites, {
    params: {
      id: id,
      from: format(new Date(options.from), "MM-dd-yyyy"),
      to: format(new Date(options.to), "MM-dd-yyyy"),
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.data) {
    // Cookies.set("siteCache", JSON.stringify(response.data));
    // Cookies.set("analyticsDate", JSON.stringify(options));
    return response.data;
  }
};
export const useService = () => {
  return { retrievePlanning, retrieveSite, retrieveSites, retrieveSitesCount };
};
