// import { useFunction } from "~config/functions";
import { useMap } from "~config/MapsContext";
import classNames from "classnames";
// import { Link } from "react-router-dom";
import PITX from "~assets/PITX.jpg";
import MCIA from "~assets/MCIA.jpg";
import LRT from "~assets/LRT.jpg";
function MapSiteOverview() {
  // const { toUnderscored } = useFunction();
  const { selectedSite } = useMap();
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
                selectedSite.StockName === "LRT" ||
                selectedSite.StockName === "LRT-ZR"
                  ? LRT
                  : selectedSite.StockName === "PITX" ||
                    selectedSite.StockName === "PITX - ZR"
                  ? PITX
                  : MCIA
              }
              alt=""
              className="w-full"
            />
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="font-bold">Sales Order Code:</div>
              <div>{selectedSite.SalesOrderCode || "N/A"}</div>
              <div className="font-bold">Sales Order Description:</div>
              <div>{selectedSite.cDesc || "N/A"}</div>
              {selectedSite.isActive === 1 ? (
                <>
                  <div className="font-bold">Available After:</div>
                  <div>
                    {selectedSite.DateRef2
                      ? new Date(selectedSite.DateRef2).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "N/A"}
                  </div>
                </>
              ) : (
                ""
              )}
              <div className="font-bold">Project Code:</div>
              <div>{selectedSite.ProjectCode || "N/A"}</div>
              <div className="font-bold">Project Description:</div>
              <div>{selectedSite.ProjectDesc || "N/A"}</div>
              <div className="font-bold">Quantity:</div>
              <div>{selectedSite.Qty || "N/A"}</div>
              <div className="font-bold">Unit Price:</div>
              <div>
                ₱
                {selectedSite.unitprice
                  ? new Intl.NumberFormat("en-US").format(
                      selectedSite.unitprice
                    )
                  : "N/A"}
              </div>
              <div className="font-bold">Net Amount:</div>
              <div>
                ₱
                {selectedSite.NetAmount
                  ? new Intl.NumberFormat("en-US").format(
                      selectedSite.NetAmount
                    )
                  : "N/A"}
              </div>
            </div>
          </div>
          {/* {selectedSite.SalesOrderCode ? (
            <Link
              to={`/audience/${toUnderscored(selectedSite.SalesOrderCode)}`}
              className="underline text-main-300"
            >
              View full information
            </Link>
          ) : ( */}
          <span className="text-gray-400 cursor-not-allowed">
            View full information
          </span>
          {/* )} */}
        </>
      )}
    </div>
  );
}

MapSiteOverview.propTypes = {};

export default MapSiteOverview;
