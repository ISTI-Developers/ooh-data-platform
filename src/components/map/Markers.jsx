import { AdvancedMarker } from "@vis.gl/react-google-maps";
import PropTypes from "prop-types";
import digital from "../../assets/digital.png";
import classic from "../../assets/classic.png";
import classNames from "classnames";

function Markers({ list, center, setCenter, setZoom }) {
  return list.map((item, key) => {
    const position = { lat: item.latitude, lng: item.longitude };

    // Check if the coordinates are equal
    const isCentered =
      center.lat === position.lat && center.lng === position.lng;

    return (
      <AdvancedMarker
        position={position}
        key={key}
        onClick={(e) => {
          setZoom(17);
          setCenter(e.latLng.toJSON());
        }}
      >
        <img
          className={classNames(
            "w-10 transition-all",
            isCentered && "scale-150"
          )}
          src={item.type === "Digital" ? digital : classic}
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
};

export default Markers;
