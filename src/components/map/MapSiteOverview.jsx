import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useFunction } from "~config/functions";
import { useMap } from "~config/MapsContext";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { Badge } from "flowbite-react";

function MapSiteOverview(props) {
  const { toUnderscored } = useFunction();
  const {
    selectedSite,
    nearbyLandmarks,
    setSelectedLandmark,
    selectedLandmark,
  } = useMap();
  const [showPanel, togglePanel] = useState(false);

  const landmarks = useMemo(() => {
    if (nearbyLandmarks.length === 0) return [];

    return showPanel ? nearbyLandmarks : nearbyLandmarks.slice(0, 4);
  }, [showPanel, nearbyLandmarks]);
  return (
    <div
      className={classNames(
        "absolute top-0 right-0 bg-white w-full max-w-[35%] h-full p-4 shadow-xl transition-all scrollbar-thin overflow-y-auto",
        selectedSite !== null ? "translate-x-0" : "translate-x-[100%]",
        "flex flex-col gap-4"
      )}
    >
      {selectedSite && (
        <>
          <div>
            <p className="font-semibold">Site Overview</p>
            <hr />
          </div>
          <div className="flex flex-col gap-2">
            <img
              src={
                selectedSite.imageURL
                  ? selectedSite.imageURL
                  : "https://test-cdn.movingwalls.com/thumbnail_not_found-min.png"
              }
              alt=""
              className="w-full"
            />
            <p className="font-bold">{selectedSite.site_code}</p>
            <p className="text-xs">{selectedSite.address}</p>
          </div>
          <div className="bg-default space-y-2 p-2 rounded-md">
            <p className="font-semibold">Nearby landmarks</p>
            <div className="flex flex-wrap gap-4 w-full p-2 bg-default">
              {landmarks.length > 0 ? (
                <>
                  {landmarks.map((landmark) => {
                    const { display_name } = landmark;
                    return (
                      <Badge
                        color=""
                        onClick={() => setSelectedLandmark(landmark)}
                        className={classNames(
                          " pointer-events-auto cursor-pointer transition-all ",
                          selectedLandmark === landmark
                            ? "bg-green-300 text-green-700"
                            : "bg-secondary text-white hover:bg-secondary-hover"
                        )}
                        key={landmark.l_id}
                      >
                        {display_name}
                      </Badge>
                    );
                  })}
                </>
              ) : (
                <>No nearby landmarks</>
              )}
              <button
                className="ml-auto p-1.5 px-3 text-sm rounded-md bg-main-300 text-white"
                onClick={() => togglePanel((prev) => !prev)}
              >
                {showPanel ? "Hide" : "Show more"}
              </button>
            </div>
          </div>
          {/* {types && (
              <div className="flex flex-wrap gap-2">
                {types.map((type) => {
                  return (
                    <Badge
                      onClick={() => alert(type)}
                      key={type}
                      className="rounded-full"
                    >
                      {toSpaced(type)}
                    </Badge>
                  );
                })}
              </div>
            )} */}
          <Link
            to={`/audiences/${toUnderscored(selectedSite.site_code)}`}
            className="underline text-main-300"
          >
            View full information
          </Link>
        </>
      )}
    </div>
  );
}

MapSiteOverview.propTypes = {};

export default MapSiteOverview;
