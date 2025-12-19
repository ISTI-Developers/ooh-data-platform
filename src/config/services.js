import axios from "axios";
import { devEndpoints as url } from "./endpoints";
import { format } from "date-fns";
import Cookies from "js-cookie";

const retrievePlanning = async (get, options = null) => {
  try {
    if (!Cookies.get("token")) return;
    const user = Cookies.get("user");
    if (!Cookies.get("token")) return;
    let params = {
      get: get,
      options: get === "areas" ? JSON.stringify(options) : null,
    };

    if (user) {
      const userData = JSON.parse(user);
      if (userData.company && userData.company === "Summit Media") {
        params.owner = userData.company;
      }
    }

    const response = await axios.get(url.planning, {
      params: params,
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
    if (!Cookies.get("token")) return;
    return await fetchSiteInformation(id);
  } catch (e) {
    console.log(e);
  }
};
const retrieveSiteAnalytics = async (id, option) => {
  try {
    if (!Cookies.get("token")) return;
    return await fetchSiteInformation(id, option);
  } catch (e) {
    if (e) {
      console.log(e);
      return { analytics: { error: true } };
    }
  }
};
const retrieveSites = async (type = null) => {
  const user = Cookies.get("user");
  try {
    if (!Cookies.get("token")) return;
    let params = {
      type: type,
    };

    if (user) {
      const userData = JSON.parse(user);
      if (userData.company && userData.company === "Summit Media") {
        params.owner = userData.company;
      }
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
  } catch (e) {
    console.log(e);
  }
};
const retrieveAvailableSites = async () => {
  if (!Cookies.get("token")) return;

  try {
    const response = await axios.get(url.sites + "/available", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    if (response.data) {
      return response.data;
    }
  } catch (e) {
    console.log(e);
  }
};
const retrieveSitesCount = async () => {
  if (!Cookies.get("token")) return;

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
const retrieveSitesBehaviors = async (data) => {
  try {
    const response = await axios.get(url.behaviors, {
      params: data,
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
const retrieveLandmarks = async () => {
  if (!Cookies.get("token")) return;

  try {
    const response = await axios.get(url.landmarks, {
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

const retrieveSiteImages = async (id) => {
  try {
    const response = await axios.get(url.siteImages + "/" + id, {
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
const retrieveAreas = async () => {
  try {
    const response = await axios.get(url.sites + "/areas", {
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
const retrieveAdditionalSiteDetails = async () => {
  if (!Cookies.get("token")) return;

  try {
    const response = await axios.get(url.sites + "/unis", {
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

export const useService = () => {
  return {
    retrievePlanning,
    retrieveSite,
    retrieveSites,
    retrieveSitesCount,
    retrieveAvailableSites,
    retrieveSiteAnalytics,
    retrieveSitesBehaviors,
    retrieveLandmarks,
    retrieveSiteImages,
    retrieveAreas,
    retrieveAdditionalSiteDetails,
  };
};
