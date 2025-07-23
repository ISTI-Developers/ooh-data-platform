/* eslint-disable react/prop-types */
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import Markers from "./Markers";
import { Label, TextInput } from "flowbite-react";
import Select from "react-select";
import Loader from "~fragments/Loader";
import { defaultTextTheme } from "~config/themes";
import LandMarkers from "./LandMarkers";
import { useMap } from "~config/MapsContext";
import MapList from "./MapList";
import { useFunction } from "~config/functions";
const MapSiteOverview = lazy(() => import("./MapSiteOverview"));

function MapLocation() {
  const {
    queryResults,
    setQuery,
    setSelectedSite,
    visibleLandmarks,
    setVisibleLandmarks,
    zoom,
    setZoom,
    landmarks,
    setSelectedLandmark,
    filters,
    setFilters,
  } = useMap();
  const { toSpaced } = useFunction();

  const [center, setCenter] = useState({ lat: 12.8797, lng: 121.774 });

  const updateMapCenter = (coords, zoom) => {
    setZoom(() => zoom);
    setCenter(() => coords);
  };

  const onBoundsChanged = useCallback(
    (e) => {
      if (zoom < 17) {
        setVisibleLandmarks(null);
        return;
      }

      const { map } = e;
      const bounds = map.getBounds();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      const visibleMarkers = getMarkersWithinBounds(ne, sw);
      setVisibleLandmarks(visibleMarkers);
    },
    [zoom]
  );

  const getMarkersWithinBounds = (ne, sw) => {
    // Implement logic to filter or fetch markers based on bounds
    const allMarkers = [...landmarks];

    return allMarkers.filter(
      (marker) =>
        marker.latitude <= ne.lat() &&
        marker.latitude >= sw.lat() &&
        marker.longitude <= ne.lng() &&
        marker.longitude >= sw.lng()
    );
  };
  const landmarkTypes = useMemo(() => {
    if (!landmarks) return [];
    const types = landmarks
      .map((lm) => {
        return [...lm.types];
      })
      .flat();

    const interestList = [...new Set(types)];

    return interestList.map((item) => {
      return {
        value: item,
        label: toSpaced(item),
      };
    });
  }, [landmarks]);

  return queryResults ? (
    <div className="flex flex-col bg-white shadow p-4 pt-2 gap-4">
      <div className="flex gap-4">
        <div className="w-full">
          <Label value="Search site" />
          <TextInput
            type="search"
            theme={defaultTextTheme}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <Label value="Show landmarks near: " />
          <Select
            id="landmark"
            value={filters}
            options={landmarkTypes}
            onChange={setFilters}
            closeMenuOnSelect={false}
            className="min-w-[300px] capitalize"
            isMulti
          />
        </div>
      </div>
      <div className="relative flex gap-4 overflow-hidden">
        {/* LIST OF SITES */}
        <MapList updateMapCenter={updateMapCenter} />
        {/*MAP */}
        <APIProvider apiKey="AIzaSyCJK4xNqR28XgzEMDWDsHKcLyMPV04E6qE">
          <div className="relative min-h-[625px] w-full lg:w-3/4 overflow-hidden border">
            <Map
              zoom={zoom}
              center={center}
              mapId="daf109cb7449fd0d"
              streetViewControl={false}
              mapTypeControl={false}
              fullscreenControl={false}
              onZoomChanged={(e) => setZoom(e.detail.zoom)}
              onClick={() => {
                setSelectedSite(null);
                setSelectedLandmark(null);
              }}
              onBoundsChanged={onBoundsChanged}
            >
              <Markers center={center} setCenter={setCenter} />
              {visibleLandmarks && <LandMarkers />}
            </Map>
            <Suspense fallback={<>Loading...</>}>
              <MapSiteOverview />
            </Suspense>
          </div>
        </APIProvider>
      </div>
    </div>
  ) : (
    <MapLoader />
  );
}

const MapLoader = () => {
  return (
    <div className="relative flex flex-row bg-white shadow p-4 gap-4 h-[37.5rem]">
      <div className="w-full lg:w-1/4 flex flex-col gap-2">
        {Array(8)
          .fill(0)
          .map((idx) => {
            return <Loader key={idx} height="4rem" />;
          })}
      </div>
      <div className="w-full lg:w-3/4">
        <Loader height="35.5rem" />
      </div>
    </div>
  );
};

export default MapLocation;
