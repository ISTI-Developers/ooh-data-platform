import axios from "axios";
import { devEndpoints as url } from "./endpoints";

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
      return response.data[0];
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
export const useService = () => {
  return { retrievePlanning, retrieveSite, retrieveSites, retrieveSitesCount };
};
