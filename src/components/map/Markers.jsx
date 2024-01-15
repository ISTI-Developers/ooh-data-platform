import { AdvancedMarker } from "@vis.gl/react-google-maps";
import PropTypes from "prop-types";
import digital from "../../assets/digital.png";
import classic from "../../assets/classic.png";
import classNames from "classnames";
import { useFunction } from "~config/functions";

function Markers({ list, center, setCenter, setZoom }) {
  const { toUnderscored } = useFunction();
  return list.map((item, key) => {
    const position = { lat: item.latitude, lng: item.longitude };

    // Check if the coordinates are equal
    const isCentered =
      center.lat === position.lat && center.lng === position.lng;

    return (
      <AdvancedMarker
        position={position}
        key={item.site}
        onClick={(e) => {
          setZoom(17);
          setCenter(e.latLng.toJSON());
        }}
      >
        <div className="flex flex-col justify-center items-center">
          {isCentered && (
            <div
              className="mb-5 max-w-[250px] p-2 rounded bg-white shadow z-[1]"
              onClick={() => {
                window.location.href = "/audience/" + toUnderscored(item.site);
              }}
            >
              <img
                src="https://test-cdn.movingwalls.com/thumbnail_not_found-min.png"
                alt=""
                className="w-full"
              />
              <p className="font-semibold">{item.site}</p>
              <p className="">{item.area}</p>
              <p className="">{item.region}</p>
            </div>
          )}
          <img
            className={classNames(
              "w-10 transition-all",
              isCentered && "scale-150"
            )}
            src={item.type === "Digital" ? digital : classic}
            alt=""
          />
        </div>
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
