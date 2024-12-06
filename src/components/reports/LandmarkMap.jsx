/* eslint-disable react/prop-types */
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useMemo } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useReport } from "~config/ReportContext";
import Marker from "./Marker";
import SelectedLandmarks from "./SelectedLandmarks";

const LandmarkMap = ({ site }) => {
  const { addMapImage, selectedLandmarks } = useReport();
  const [coordinates] = useState({
    lat: parseFloat(site.latitude),
    lng: parseFloat(site.longitude),
  });
  const mapRef = useRef(null);
  const [zoom, setZoom] = useState(15);

  const selectedLandmark = useMemo(() => {
    return selectedLandmarks.find(
      (landmark) => landmark.site === site.unis_code
    );
  }, [selectedLandmarks, site.unis_code]);

  const onMapGenerate = () => {
    const baseURL = "https://maps.googleapis.com/maps/api/staticmap";
    const params = new URLSearchParams({
      center: `${coordinates.lat},${coordinates.lng}`, // Center the map
      zoom: zoom, // Zoom level
      size: "300x300", // Image dimensions (can adjust to match your requirements)
      key: "AIzaSyCJK4xNqR28XgzEMDWDsHKcLyMPV04E6qE", // API key for access
    });
    // Add custom marker for `site`
    params.append(
      "markers",
      `color:red|label:S|${site.latitude},${site.longitude}`
    );

    // Add markers for each selected landmark
    selectedLandmark?.landmarks.forEach((landmark, index) => {
      const { latitude, longitude } = landmark;
      params.append(
        "markers",
        `color:blue|label:${index + 1}|${latitude},${longitude}`
      );
    });

    // Full URL for the static map image
    const mapURL = `${baseURL}?${params.toString()}`;
    addMapImage(site.unis_code, mapURL);
  };

  useEffect(() => {
    onMapGenerate();
  }, [selectedLandmarks]);
  return (
    <section>
      <div id="" ref={mapRef}>
        <APIProvider apiKey="AIzaSyCJK4xNqR28XgzEMDWDsHKcLyMPV04E6qE">
          <div className="relative h-[250px] w-[250px] overflow-hidden">
            <Map
              zoom={zoom}
              center={coordinates}
              mapId="bbe301bc60bb084c"
              streetViewControl={false}
              mapTypeControl={false}
              zoomControl={false}
              fullscreenControl={false}
              onZoomChanged={(event) => setZoom(event.detail.zoom)}
              onBoundsChanged={onMapGenerate}
            >
              {selectedLandmark?.landmarks.length > 0 && (
                <SelectedLandmarks landmarks={selectedLandmark?.landmarks} />
              )}
              <Marker site={site} position={coordinates} />
            </Map>
          </div>
        </APIProvider>
      </div>
    </section>
  );
};

export default LandmarkMap;
