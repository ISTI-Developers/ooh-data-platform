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

export const useService = () => {
  return { retrievePlanning };
};
