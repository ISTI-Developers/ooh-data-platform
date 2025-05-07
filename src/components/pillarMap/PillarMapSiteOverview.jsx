import { useMemo, useState } from "react";
import { useStations } from "~config/LRTContext";
import classNames from "classnames";
import { Button } from "flowbite-react";
import Pillar from "~assets/Pillar.jpg";

function PillarMapSiteOverview(props) {
  const { selectedPillar, attachedContract, queryAssetContracts } = useStations();

  const contractedPillar = queryAssetContracts
    .filter((cp) => cp.pillar_id !== null && cp.pillar_id !== undefined)
    .map((cp) => cp.pillar_id);
  const isBooked = contractedPillar.includes(selectedPillar?.id);
  return (
    <>
      <div
        className={classNames(
          "absolute top-0 right-0 bg-white w-full max-w-[35%] h-full p-4 shadow-xl transition-all scrollbar-thin overflow-y-auto",
          selectedPillar !== null ? "translate-x-0" : "translate-x-[100%]",
          "flex flex-col gap-4"
        )}
      >
        {selectedPillar && (
          <div
            className={classNames("flex flex-col gap-4", {
              "opacity-50 pointer-events-none": isBooked,
            })}
          >
            {isBooked && (
              <div className="absolute top-3 right-3 bg-green-500 text-white font-bold text-lg px-4 py-1 rounded rotate-12">
                BOOKED
              </div>
            )}

            <div>
              <p className="font-semibold">Pillar Overview</p>
              <hr />
            </div>
            <div className="flex flex-col gap-2">
              <img src={selectedPillar.imageURL ? selectedPillar.imageURL : Pillar} alt="" className="w-full" />

              <p className="font-bold">{selectedPillar.viaduct_name}</p>
              <p className="text-xs">{selectedPillar.asset_direction}</p>
            </div>
          </div>
        )}
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
    </>
  );
}

PillarMapSiteOverview.propTypes = {};

export default PillarMapSiteOverview;
