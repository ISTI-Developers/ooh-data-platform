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
const updateAsset = async (id, data) => {
  try {
    const response = await axios.put(`${devEndpoints.assets}/${id}`, data, headers);
    return response.data;
  } catch (e) {
    console.error("Update failed:", e.response?.data || e.message);
    throw e;
  }
};
const updateParapetStatus = async (station_id, asset_distinction, asset_id, status) => {
  try {
    const response = await axios.put(
      devEndpoints.parapets + "/status/update",
      {
        station_id,
        asset_distinction,
        asset_id,
        status,
      },
      headers
    );
    console.log("Parapet status updated:", response.data.message);
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data.message);
    } else {
      console.error("Error message:", error.message);
    }
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

const attachContract = async (contractData) => {
  try {
    const response = await axios.post(`${devEndpoints.contracts}/attach`, contractData, headers);

    return response.data;
  } catch (error) {
    console.error("Error attaching contract:", error.response?.data || error.message);
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
const trainAssetBook = async (id, qty) => {
  try {
    const response = await axios.put(`${devEndpoints.trains}/assets/book/${id}`, { qty }, { headers });
    return response.data;
  } catch (error) {
    console.error(
      "Error booking train asset:",
      error.response ? `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}` : error.message
    );
    throw error;
  }
};

const updateTrainAsset = async (id, avlbl, ood) => {
  try {
    const response = await axios.put(`${devEndpoints.trains}/assets/edit/${id}`, { avlbl, ood }, { headers });
    return response.data;
  } catch (error) {
    console.error(
      "Error booking train asset:",
      error.response ? `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}` : error.message
    );
    throw error;
  }
};
const updateAssetSpecs = async (id, payload) => {
  try {
    const response = await axios.put(`${devEndpoints.specs}/edit/${id}`, payload, { headers });
    return response.data;
  } catch (error) {
    console.error(
      "Error booking updating asset:",
      error.response ? `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}` : error.message
    );
    throw error;
  }
};
const unTagContract = async (id, backlitId, trainAssetId, qty) => {
  try {
    const response = await axios.delete(`${devEndpoints.contracts}/${id}`, {
      data: { backlitId, trainAssetId, qty },
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error untagging contract:",
      error.response ? `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}` : error.message
    );
    throw error;
  }
};

const retrieveLandmarks = async () => {
  try {
    const response = await axios.get(devEndpoints.landmarks, headers);
    return response.data;
  } catch (e) {
    console.log(e);
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
    console.error("Error retrieving parapets availability:", error.message);
  }
};

const addViaduct = async (data) => {
  try {
    const response = await axios.post(`${devEndpoints.trains}/external/addViaduct`, data, headers);
    return response.data;
  } catch (error) {
    console.error("Error adding viaduct:", error.message);
    throw error;
  }
};
const deleteViaduct = async (id, spec_id) => {
  try {
    const response = await axios.delete(`${devEndpoints.trains}/external/deleteViaduct/${id}/${spec_id}`, headers);
    return response.data;
  } catch (error) {
    console.error("Error deleting viaduct:", error.message);
    throw error;
  }
};
export const useLRTapi = () => {
  return {
    retrieveAllStationDetails,
    retrieveSpecifications,
    updateAsset,
    updateParapetStatus,
    retrieveContracts,
    attachContract,
    getContractFromAsset,
    getTrainAssets,
    getTrainAssetsSpecs,
    getExternalAssetSpecs,
    trainAssetBook,
    updateTrainAsset,
    retrieveLandmarks,
    unTagContract,
    retrieveParapetsAvailability,
    retrieveBacklitsAvailability,
    updateAssetSpecs,
    addViaduct,
    deleteViaduct,
  };
};
