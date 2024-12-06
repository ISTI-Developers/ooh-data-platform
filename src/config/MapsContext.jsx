import React, { useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useService } from "./services";
import useData from "./useData";
import { useFunction } from "./functions";

const MapContext = React.createContext();

export function useMap() {
  return useContext(MapContext);
}

export default function MapProvider({ children }) {
  const { retrieveSites, retrieveLandmarks } = useService();
  const { toUnderscored, haversineDistance } = useFunction();
  const [sites, setSites] = useState([]);
  const [landmarks, setLandmarks] = useState([]);
  const [zoom, setZoom] = useState(6);
  const [query, setQuery] = useState("");
  const [selectedSite, setSelectedSite] = useState(null);
  const [visibleLandmarks, setVisibleLandmarks] = useState(null);
  const [selectedLandmark, setSelectedLandmark] = useState(null);

  const queryResults = useMemo(() => {
    if (!sites) return [];
    if (query.length < 4) return sites;

    const normalizedQuery = toUnderscored(query.toLowerCase());

    const includesQuery = (item) =>
      [item.site, item.unis_code, item.region, item.city, item.address]
        .map((field) => toUnderscored(field.toLowerCase()))
        .some((field) => field.includes(normalizedQuery));

    return sites.filter(includesQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, sites]);

  const nearbyLandmarks = useMemo(() => {
    if (!selectedSite || !landmarks) return [];

    const { latitude, longitude } = selectedSite;
    return landmarks.filter((lm) => {
      const midpoint = { lat: latitude, lng: longitude };
      const coordinates = { lat: lm.latitude, lng: lm.longitude };
      const distance = haversineDistance(midpoint, coordinates);
      return distance <= 200; // 200 meters
    });
  }, [haversineDistance, selectedSite, landmarks]);

  useEffect(() => {
    const setup = async () => {
      const data = await retrieveSites();
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

      setSites([
        ...data.map((item) => ({
          ...item,
          longitude: parseFloat(item.longitude),
          latitude: parseFloat(item.latitude),
        })),
      ]);
    };
    setup();
  }, []);

  const value = {
    zoom,
    sites,
    landmarks,
    queryResults,
    selectedSite,
    nearbyLandmarks,
    selectedLandmark,
    visibleLandmarks,
    setZoom,
    setQuery,
    setSelectedSite,
    setVisibleLandmarks,
    setSelectedLandmark,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

MapProvider.propTypes = {
  children: PropTypes.node,
};
