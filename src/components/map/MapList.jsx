import { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import banner from "~assets/banner.png";
import digital from "~assets/digital.png";
import classic from "~assets/classic.png";
import { useMap } from "~config/MapsContext";
import { Accordion } from "flowbite-react";
import { IoMdMenu } from "react-icons/io";
import { useFunction } from "~config/functions";
import { accordion } from "~config/themes";

function MapList({ updateMapCenter }) {
  const { queryResults, setSelectedSite } = useMap();
  const { offsetCoordinate } = useFunction();
  const [showLocations, toggleLocations] = useState(false);
  return (
    queryResults && (
      <>
        <div
          className={classNames(
            "absolute w-full h-full top-0 left-0 z-[1] bg-white transition-all lg:relative lg:w-1/4",
            !showLocations
              ? "-translate-x-full lg:translate-x-0"
              : "translate-x-0"
          )}
        >
          <Accordion flush theme={accordion}>
            {[
              ...new Set(queryResults.map((item) => item.type.toLowerCase())),
            ].map((type) => (
              <Accordion.Panel key={type}>
                <Accordion.Title className="capitalize">{type}</Accordion.Title>
                <Accordion.Content>
                  <ul className="flex flex-col max-h-[375px] overflow-y-auto">
                    {queryResults
                      .filter((item) => item.type.toLowerCase() === type)
                      .map((boards, index) => {
                        const {
                          unis_code,
                          site,
                          latitude,
                          longitude,
                          address,
                        } = boards;
                        return (
                          <li
                            key={site + index}
                            className="flex gap-2 transition-all cursor-pointer p-2 hover:bg-gray-300"
                            onClick={() => {
                              toggleLocations(false);
                              updateMapCenter(
                                offsetCoordinate(latitude, longitude, 20),
                                18
                              );
                              setSelectedSite(boards);
                            }}
                          >
                            <img
                              src={
                                type === "classic"
                                  ? classic
                                  : type === "digital"
                                  ? digital
                                  : banner
                              }
                              className="max-w-10"
                            />
                            <div>
                              <p className="text-xs font-semibold">
                                {unis_code}
                              </p>
                              <p className="text-[0.5rem] text-gray-500">
                                {address}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                </Accordion.Content>
              </Accordion.Panel>
            ))}
          </Accordion>
        </div>
        <button
          className={classNames(
            "absolute group top-0 left-0 z-[2] p-2 bg-[#ffffff] shadow flex items-center gap-1 lg:hidden",
            showLocations ? "opacity-50 hover:opacity-100" : "opacity-100"
          )}
          onClick={() => toggleLocations((prev) => !prev)}
        >
          <span className="hidden animate-fade group-hover:block">
            {!showLocations ? "Show" : "Hide"} sites
          </span>
          <IoMdMenu className="text-xl text-slate-700" />
        </button>
      </>
    )
  );
}

MapList.propTypes = {
  updateMapCenter: PropTypes.func,
};

export default MapList;
