import { useStations } from "~config/LRTContext";
import classNames from "classnames";
import { useImageUrl } from "~/misc/useImageUrl";
function PillarMapSiteOverview() {
  const Pillar = useImageUrl("Pillar.jpg");
  const { selectedPillar, queryAssetContracts } = useStations();

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

            <div className="space-y-4">
              <div>
                <p className="text-lg font-semibold text-gray-800">Pillar Overview</p>
                <hr className="border-gray-300" />
              </div>

              <div className="flex flex-col gap-3">
                <img
                  src={selectedPillar.imageURL ? selectedPillar.imageURL : Pillar}
                  alt="Pillar Visual"
                  className="w-full rounded-lg shadow-sm object-cover"
                />

                <div className="space-y-1 text-sm text-gray-700">
                  <p className="font-semibold text-base">{selectedPillar.viaduct_name}</p>
                  <p>{selectedPillar.asset_direction}</p>
                  <p>
                    Media Rental:{" "}
                    <span className="font-medium">₱{Number(selectedPillar.media_rental).toLocaleString()}</span>
                  </p>
                  <p>
                    1X Prod Cost:{" "}
                    <span className="font-medium">₱{Number(selectedPillar.prod_cost).toLocaleString()}</span>
                  </p>

                  <p>
                    Size: <span className="font-medium">{selectedPillar.size}</span>
                  </p>
                  <p>
                    Min Duration: <span className="font-medium">{selectedPillar.min_duration_months} months</span>
                  </p>
                  {selectedPillar.notes && <p className="italic text-gray-500">{selectedPillar.notes}</p>}
                  {selectedPillar.vat_exclusive && (
                    <p className="text-xs text-red-500 font-medium">**Rates are exclusive of VAT</p>
                  )}
                </div>
              </div>
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
