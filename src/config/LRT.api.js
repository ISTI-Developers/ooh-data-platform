import { devEndpoints, headers } from "./endpoints";
import axios from "axios";

const retrieveAllStationDetails = async () => {
  try {
    const response = await axios.get(devEndpoints.stations + "/details", headers);
    return response.data;
  } catch (error) {
    console.error("Error retrieving station details:", error.message);
    throw error;
  }
};

const retrieveSpecifications = async () => {
  try {
    const response = await axios.get(devEndpoints.stations + "/specs", headers);
    return response.data;
  } catch (error) {
    console.error("Error retrieving specifications data:", error);
    throw error;
  }
};

const retrieveContracts = async (page = 1, limit = 10, search = "") => {
  try {
    const response = await axios.get(devEndpoints.contracts, {
      params: { page, limit, search },
      ...headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error retrieving contracts:", error.message);
    throw error;
  }
};

const getContractFromAsset = async () => {
  try {
    const response = await axios.get(`${devEndpoints.stations}/contracts`, headers);
    return response.data;
  } catch (error) {
    console.error("Error attaching contract:", error.response?.data || error.message);
    throw error;
  }
};
const getTrainAssets = async () => {
  try {
    const response = await axios.get(`${devEndpoints.trains}/assets`, headers);
    return response.data;
  } catch (error) {
    console.error("Error attaching contract:", error.response?.data || error.message);
    throw error;
  }
};
const getTrainAssetsSpecs = async () => {
  try {
    const response = await axios.get(`${devEndpoints.trains}/assetsSpecs`, headers);
    return response.data;
  } catch (error) {
    console.error("Error fetching train assets specs:", error.response?.data || error.message);
    throw error;
  }
};
const getExternalAssetSpecs = async (asset_id) => {
  try {
    const response = await axios.get(`${devEndpoints.trains}/external/specs/${asset_id}`, { headers });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching external specs:",
      error.response ? `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}` : error.message
    );
    throw error;
  }
};

const retrieveParapetsAvailability = async () => {
  try {
    const response = await axios.get(devEndpoints.availability + "/parapets", headers);
    return response.data;
  } catch (error) {
    console.error("Error retrieving parapets availability:", error.message);
  }
};
const retrieveBacklitsAvailability = async () => {
  try {
    const response = await axios.get(devEndpoints.availability + "/backlits", headers);
    return response.data;
  } catch (error) {
    console.error("Error retrieving backlits availability:", error.message);
  }
};
const retrieveTicketboothsAvailability = async () => {
  try {
    const response = await axios.get(devEndpoints.availability + "/ticketbooths", headers);
    return response.data;
  } catch (error) {
    console.error("Error retrieving ticketbooths availability:", error.message);
  }
};
const retrieveStairsAvailability = async () => {
  try {
    const response = await axios.get(devEndpoints.availability + "/stairs", headers);
    return response.data;
  } catch (error) {
    console.error("Error retrieving stairs availability:", error.message);
  }
};

export const useLRTapi = () => {
  return {
    retrieveAllStationDetails,
    retrieveSpecifications,
    retrieveContracts,
    getContractFromAsset,
    getTrainAssets,
    getTrainAssetsSpecs,
    getExternalAssetSpecs,
    retrieveParapetsAvailability,
    retrieveBacklitsAvailability,
    retrieveTicketboothsAvailability,
    retrieveStairsAvailability,
  };
};
