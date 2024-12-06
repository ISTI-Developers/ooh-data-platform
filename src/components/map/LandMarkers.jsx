// import PropTypes from "prop-types";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import classNames from "classnames";
import { FaMapPin } from "react-icons/fa";
import { useMap } from "~config/MapsContext";

function LandMarkers() {
  const {
    visibleLandmarks,
    setSelectedLandmark,
    nearbyLandmarks,
    selectedLandmark,
  } = useMap();

  return visibleLandmarks.map((item) => {
    const position = {
      lat: parseFloat(item.latitude),
      lng: parseFloat(item.longitude),
    };
    return (
      <AdvancedMarker
        onClick={() => setSelectedLandmark(item)}
        key={item.l_id}
        position={position}
      >
        <div
          className={classNames(
            "relative",
            selectedLandmark === item && "pointer-events-none"
          )}
        >
          <FaMapPin
            className={classNames(
              "transition-all",
              selectedLandmark === item ? "text-3xl" : "text-xl",
              nearbyLandmarks.length === 0 || nearbyLandmarks.includes(item)
                ? "text-red-600"
                : "text-red-200"
            )}
          />
          {selectedLandmark === item && (
            <p className="absolute top-1/2 -translate-y-1/2 left-[100%] whitespace-nowrap bg-white p-2 px-2.5 border shadow">
              {item.display_name}
            </p>
          )}
        </div>
      </AdvancedMarker>
    );
  });
}

// LandMarkers.propTypes = {
//   landmarks: PropTypes.array,
// };

export default LandMarkers;
