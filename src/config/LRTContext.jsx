import React, { useContext, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useLRTapi } from "./LRT.api";
import { useFunction } from "./functions";

const StationContext = React.createContext();

export function useStations() {
  return useContext(StationContext);
}

export function StationProvider({ children }) {
  const {
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
    retrieveLandmarks,
  } = useLRTapi();

  const [stationData, setStationData] = useState([]);
  const [specs, setSpecs] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [assetContracts, setAssetContracts] = useState([]);
  const [externalAssetSpecs, setExternalAssetSpecs] = useState([]);
  const [attachedContract, setAttachedContract] = useState(null);

  const { toUnderscored, haversineDistance } = useFunction();
  const [pillars, setPillars] = useState([]);
  const [landmarks, setLandmarks] = useState([]);
  const [zoom, setZoom] = useState(6);
  const [query, setQuery] = useState("");
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [visibleLandmarks, setVisibleLandmarks] = useState(null);
  const [selectedLandmark, setSelectedLandmark] = useState(null);

  const queryResults = useMemo(() => {
    if (!pillars) return [];

    if (query.length < 4) return pillars;
    const normalizedQuery = toUnderscored(query.toLowerCase());

    const includesQuery = (item) =>
      [item.asset_direction, item.viaduct_name]
        .map((field) => toUnderscored(field?.toLowerCase() ?? ""))
        .some((field) => field.includes(normalizedQuery));

    return pillars.filter(includesQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, pillars]);

  const nearbyLandmarks = useMemo(() => {
    if (!selectedPillar || !landmarks) return [];

    const { latitude, longitude } = selectedPillar;
    return landmarks.filter((lm) => {
      const midpoint = { lat: latitude, lng: longitude };
      const coordinates = { lat: lm.latitude, lng: lm.longitude };
      const distance = haversineDistance(midpoint, coordinates);
      return distance <= 200; // 200 meters
    });
  }, [haversineDistance, selectedPillar, landmarks]);

  const queryExternalAssets = useMemo(() => {
    if (!externalAssetSpecs || !externalAssetSpecs.data) return [];
    return externalAssetSpecs.data;
  }, [externalAssetSpecs]);

  const queryAllStationsData = useMemo(() => {
    if (!stationData || !stationData.data) return [];
    return stationData.data;
  }, [stationData]);

  const querySpecs = useMemo(() => {
    if (!specs || !specs.data) return [];
    return specs.data;
  }, [specs]);

  const queryContracts = useMemo(() => {
    if (!contracts || !contracts.data) return [];
    return contracts.data;
  }, [contracts]);

  const queryAssetContracts = useMemo(() => {
    if (!assetContracts || !assetContracts.data) return [];
    return assetContracts.data;
  }, [assetContracts]);

  useEffect(() => {
    const setup = async () => {
      const contract = await retrieveContracts();
      const stationData = await retrieveAllStationDetails();
      const specsData = await retrieveSpecifications();
      const assetContract = await getContractFromAsset();
      const externalAssets = await getExternalAssetSpecs(8);
      setStationData(stationData);
      setSpecs(specsData);
      setContracts(contract);
      setAssetContracts(assetContract);
      setExternalAssetSpecs(externalAssets);

      const data = await getExternalAssetSpecs(9);
      const lms = await retrieveLandmarks();
      const modLms = lms.map((lm) => {
        let types = lm.types;
        types = types.replace("{", "");
        types = types.replace("}", "");
        types = types.split(",");
        return {
          ...lm,
          types: types,
        };
      });
      setLandmarks(modLms);
      setPillars([
        ...data.data.map((item) => ({
          ...item,
          longitude: parseFloat(item.longitude),
          latitude: parseFloat(item.latitude),
        })),
      ]);
    };
    setup();
  }, []);
  const values = {
    querySpecs,
    queryAllStationsData,
    queryContracts,
    queryAssetContracts,
    queryExternalAssets,
    attachedContract,
    setAttachedContract,
    updateAsset,
    updateParapetStatus,
    attachContract,
    getTrainAssets,
    getTrainAssetsSpecs,
    zoom,
    pillars,
    landmarks,
    queryResults,
    selectedPillar,
    nearbyLandmarks,
    selectedLandmark,
    visibleLandmarks,
    setZoom,
    setQuery,
    setSelectedPillar,
    setVisibleLandmarks,
    setSelectedLandmark,
  };

  return <StationContext.Provider value={values}>{children}</StationContext.Provider>;
}

StationProvider.propTypes = {
  children: PropTypes.node,
};
