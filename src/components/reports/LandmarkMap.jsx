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
  const { addMapImage, selectedLandmarks, showLandmarks } = useReport();
  const [coordinates] = useState({
    lat: parseFloat(site.latitude),
    lng: parseFloat(site.longitude),
  });
  const mapRef = useRef(null);
  const [zoom, setZoom] = useState(17);

  const selectedLandmark = useMemo(() => {
    return selectedLandmarks.find(
      (landmark) => landmark.site === site.site_code
    );
  }, [selectedLandmarks, site.site_code]);

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
      `color:red|icon:https://ooh.scmiph.com/assets/classic-sm.png|${site.latitude},${site.longitude}`
    );

    if (showLandmarks) {
      // Add markers for each selected landmark
      selectedLandmark?.landmarks.forEach((landmark, index) => {
        const { latitude, longitude } = landmark;
        params.append(
          "markers",
          `color:blue|label:${index + 1}|${latitude},${longitude}`
        );
      });
    }
    // Full URL for the static map image
    const mapURL = `${baseURL}?${params.toString()}`;
    console.log(mapURL);
    addMapImage(site.site_code, mapURL);
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
              {showLandmarks && selectedLandmark?.landmarks.length > 0 && (
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
