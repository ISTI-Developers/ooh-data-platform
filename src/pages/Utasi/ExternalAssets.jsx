import { useState } from "react";
import PropTypes from "prop-types";
import { FaArrowLeft } from "react-icons/fa";
import { useStations } from "~config/LRTContext";
import { imageMap, imageMap2 } from "./utasi.const";
// import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import PillarMapLocation from "~components/pillarMap/PillarMapLocation";
import { ViaductCard } from "~components/ViaductCard";
import { Button } from "flowbite-react";
const ExternalAssets = ({ onBackExternal }) => {
  const { queryExternalAssets, queryAssetContracts } = useStations();
  const [selectedViaduct, setSelectedViaduct] = useState(null);
  const [isViaduct, setIsViaduct] = useState(true);
  const contractedViaduct = queryAssetContracts
    .filter((cv) => cv.viaduct_id !== null && cv.viaduct_id !== undefined)
    .map((cv) => cv.viaduct_id);

  const handleDetailsClick = (viaduct) => {
    setSelectedViaduct(viaduct);
  };
  const externalAssetsWithImages = queryExternalAssets.map((asset) => ({
    ...asset,
    picture: imageMap[asset.id] || null,
    picture2: imageMap2[asset.id] || null,
  }));
  const notes = selectedViaduct?.notes || "";
  const [firstPart, ...rest] = notes.split(",");

  return (
    <div className="container p-6">
      <div className="flex justify-between mb-4">
        <div className="flex space-x-2">
          <Button
            color="none"
            onClick={() => setIsViaduct(true)}
            className={`rounded-full px-4 ${
              isViaduct
                ? "bg-green-500 text-white"
                : "border border-green-500 text-green-500 bg-transparent hover:bg-green-100"
            }`}
          >
            Viaduct
          </Button>
          <Button
            color="none"
            onClick={() => setIsViaduct(false)}
            className={`rounded-full px-4 ${
              !isViaduct
                ? "bg-green-500 text-white"
                : "border border-green-500 text-green-500 bg-transparent hover:bg-green-100"
            }`}
          >
            Pillar
          </Button>
        </div>
        <button onClick={onBackExternal} className="flex items-center px-4 py-2 rounded hover:bg-gray-400">
          <FaArrowLeft />
          Back
        </button>
      </div>
      {isViaduct ? (
        <>
          <div className="grid grid-cols-4 gap-6  bg-gray-100">
            {externalAssetsWithImages.map((viaduct) => (
              <ViaductCard
                key={viaduct.id}
                viaduct={{
                  ...viaduct,
                  picture: imageMap[viaduct.id] || null,
                  isBooked: contractedViaduct.includes(viaduct.id),
                }}
                onDetailsClick={handleDetailsClick}
              />
            ))}
          </div>

          {selectedViaduct && (
            <div className="w-1/3 bg-white shadow-lg p-6 fixed right-0 top-0 h-full z-50 flex flex-col overflow-y-auto">
              <button className="self-end text-gray-600 hover:text-black" onClick={() => setSelectedViaduct(null)}>
                ✖
              </button>

              {selectedViaduct.viaduct_name && (
                <h3 className="text-lg font-bold text-green-400">{selectedViaduct.viaduct_name}</h3>
              )}
              <p className="text-sm text-gray-600 italic">*LRT-1 Line</p>
              {selectedViaduct.asset_direction && (
                <p className="text-sm text-gray-600 italic">*{selectedViaduct.asset_direction}</p>
              )}

              {selectedViaduct.viaduct_name &&
                (selectedViaduct.viaduct_name.includes("SB") ? (
                  <p className="text-sm text-gray-600 italic">*Southbound</p>
                ) : selectedViaduct.viaduct_name.includes("NB") ? (
                  <p className="text-sm text-gray-600 italic">*Northbound</p>
                ) : null)}

              {selectedViaduct.media_rental && (
                <p className="mt-3 font-bold text-gray-800">
                  MEDIA RENTAL:{" "}
                  <span className="font-normal">
                    ₱{Number(selectedViaduct.media_rental).toLocaleString()}/UNIT / MONTH
                  </span>
                </p>
              )}

              {selectedViaduct.prod_cost && (
                <p className="font-bold text-gray-800">
                  1X PROD. COST:{" "}
                  <span className="font-normal">₱{Number(selectedViaduct.prod_cost).toLocaleString()} PER UNIT</span>
                </p>
              )}

              {selectedViaduct.size && (
                <p className="font-bold text-gray-800">
                  SIZE APPROX.: <span className="font-normal">{selectedViaduct.size}</span>
                </p>
              )}

              {selectedViaduct.id === 1 && firstPart && firstPart.includes(":") && (
                <p className="font-bold text-gray-800">
                  {firstPart.split(":")[0]}: <span className="font-normal">{firstPart.split(":")[1]}</span>
                </p>
              )}

              {selectedViaduct.min_duration_months && (
                <p className="text-sm text-gray-600">*Minimum of {selectedViaduct.min_duration_months} months</p>
              )}

              {selectedViaduct.id !== 1 && firstPart && <p className="text-sm text-gray-600">**{firstPart}</p>}

              {selectedViaduct.id === 1 && <p className="text-sm text-gray-600">**Rates are exclusive of VAT</p>}

              {selectedViaduct.picture && (
                <img className="w-full rounded-md" src={selectedViaduct.picture} alt="Viaduct" />
              )}

              {rest.length > 0 && <p className="text-sm text-green-600">{rest.join(",")}</p>}
            </div>
          )}
        </>
      ) : (
        <>
          <PillarMapLocation />
        </>
      )}
    </div>
  );
};
ExternalAssets.propTypes = {
  onBackExternal: PropTypes.func,
};
export default ExternalAssets;
