import axios from "axios";
import { devEndpoints as url } from "./endpoints";
import Cookies from "js-cookie";

const retrievePlanning = async (get, options = null) => {
  try {
    const response = await axios.get(url.planning, {
      params: {
        get: get,
        options: options,
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

const retrieveSite = async (id) => {
  try {
    console.log("fetching...");
    const siteCache = Cookies.get("siteCache");
    if (siteCache) {
      const siteInformation = JSON.parse(siteCache);
      if (siteInformation.site_code === id) {
        return siteInformation;
      } else {
        await fetchSiteInformation(id);
      }
    } else {
      return await fetchSiteInformation(id);
    }
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

const fetchSiteInformation = async (id) => {
  const response = await axios.get(url.sites, {
    params: {
      id: id,
      // options: options,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.data) {
    Cookies.set("siteCache", JSON.stringify(response.data));
    return response.data;
  }
};
export const useService = () => {
  return { retrievePlanning, retrieveSite, retrieveSites, retrieveSitesCount };
};
