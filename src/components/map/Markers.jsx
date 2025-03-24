import { AdvancedMarker } from "@vis.gl/react-google-maps";
import PropTypes from "prop-types";
import digital from "~/assets/digital.png";
import classic from "~/assets/classic.png";
import banner from "~/assets/banner.png";
import classNames from "classnames";
import { useFunction } from "~config/functions";
import { useMap } from "~config/MapsContext";

function Markers({ center, setCenter }) {
  const { offsetCoordinate } = useFunction();
  const {
    queryResults,
    setZoom,
    setSelectedSite,
    setSelectedLandmark,
    selectedSite,
    zoom,
  } = useMap();

  return queryResults.map((item, index) => {
    const position = { lat: item.latitude, lng: item.longitude };
    const offsetPosition = offsetCoordinate(item.latitude, item.longitude, 20);

    // Check if the coordinates are equal
    const isCentered =
      center.lat === offsetPosition.lat && center.lng === offsetPosition.lng;

    const size = zoom < 10 ? zoom / 4 : zoom / 8;
    return (
      <AdvancedMarker
        position={position}
        key={item.site_code + "_" + index}
        onClick={(e) => {
          setZoom(18);
          const newCenter = offsetCoordinate(
            e.latLng.toJSON().lat,
            e.latLng.toJSON().lng,
            20
          );
          setCenter(newCenter);
          setSelectedLandmark(null);
          setSelectedSite(item);
        }}
      >
        <img
          style={{ width: `${size}rem` }}
          className={classNames(
            "transition-all duration-200",
            isCentered && item === selectedSite
              ? "scale-150 z-10"
              : "scale-100 -z-10"
          )}
          src={
            item.type.toLowerCase() === "digital"
              ? digital
              : item.type.toLowerCase() === "classic"
              ? classic
              : banner
          }
          alt=""
        />
      </AdvancedMarker>
    );
  });
}

Markers.propTypes = {
  list: PropTypes.array,
  center: PropTypes.object,
  setCenter: PropTypes.func,
  setZoom: PropTypes.func,
  setSite: PropTypes.func,
  site: PropTypes.object,
  zoom: PropTypes.number,
};

export default Markers;
