import { AdvancedMarker } from "@vis.gl/react-google-maps";
import PropTypes from "prop-types";
import digital from "~/assets/digital.png";
import classic from "~/assets/classic.png";
import banner from "~/assets/banner.png";

function Marker({ site, position }) {
  return (
    <AdvancedMarker position={position}>
      <img
        className="transition-all duration-200 w-9 scale-150 z-10"
        src={
          site.type.toLowerCase() === "digital"
            ? digital
            : site.type.toLowerCase() === "classic"
            ? classic
            : banner
        }
        alt=""
      />
    </AdvancedMarker>
  );
}

Marker.propTypes = {
  position: PropTypes.object,
  site: PropTypes.object,
};

export default Marker;
