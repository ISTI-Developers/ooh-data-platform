import { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import bus from "~assets/bus.png";
import airplane from "~assets/airplane.png";
import train from "~assets/train.png";
import { useMap } from "~config/MapsContext";
import { Accordion } from "flowbite-react";
import { IoMdMenu } from "react-icons/io";
import { useFunction } from "~config/functions";
import { accordion } from "~config/themes";
function MapList({ updateMapCenter }) {
  const { setSelectedSite, queryContracts } = useMap();
  const { offsetCoordinate } = useFunction();
  const [showLocations, toggleLocations] = useState(false);
  return (
    queryContracts && (
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
            {["Available", "Unavailable"].map((status) => (
              <Accordion.Panel key={status}>
                <Accordion.Title className="capitalize">
                  {status}
                </Accordion.Title>
                <Accordion.Content>
                  <Accordion flush>
                    {[
                      ...new Set(
                        queryContracts
                          .filter(
                            (item) =>
                              item.isActive ===
                              (status === "Unavailable" ? 1 : 0)
                          )
                          .map((item) => item.StockName)
                      ),
                    ].map((stockName) => (
                      <Accordion.Panel key={stockName}>
                        <Accordion.Title className="capitalize">
                          {stockName}
                        </Accordion.Title>
                        <Accordion.Content>
                          <ul className="flex flex-col max-h-[375px] overflow-y-auto">
                            {queryContracts
                              .filter(
                                (item) =>
                                  item.StockName === stockName &&
                                  item.isActive ===
                                    (status === "Unavailable" ? 1 : 0)
                              )
                              .map((board, index) => {
                                const {
                                  SalesOrderCode,
                                  // StockDesc,
                                  // ProjectCode,
                                  ProjectDesc,
                                  Qty,
                                  unitprice,
                                  NetAmount,
                                } = board;

                                return (
                                  <li
                                    key={SalesOrderCode + index}
                                    className="flex gap-2 transition-all cursor-pointer p-2 hover:bg-gray-300"
                                    onClick={() => {
                                      toggleLocations(false);
                                      updateMapCenter(
                                        offsetCoordinate(
                                          board.latitude,
                                          board.longitude,
                                          20
                                        ),
                                        18
                                      );
                                      setSelectedSite(board);
                                    }}
                                  >
                                    <img
                                      src={
                                        stockName === "LRT" ||
                                        stockName === "LRT-ZR"
                                          ? train
                                          : stockName === "PITX" ||
                                            stockName === "PITX - ZR"
                                          ? bus
                                          : airplane
                                      }
                                      className="max-w-10"
                                    />
                                    <div>
                                      <p className="text-xs font-semibold">
                                        {SalesOrderCode}
                                      </p>
                                      <p className="text-[0.5rem] text-gray-500">
                                        {ProjectDesc}
                                      </p>
                                      <p className="text-[0.5rem] text-gray-500">
                                        Quantity: {Qty} | Unit Price:{" "}
                                        {unitprice} | Net: {NetAmount}
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
