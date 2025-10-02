import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaArrowLeft } from "react-icons/fa";
import { useStations } from "~config/LRTContext";
import { useUtasiImages } from "./utasi.const";
import PillarMapLocation from "~components/pillarMap/PillarMapLocation";
import { ViaductCard } from "~components/ViaductCard";
import { Button } from "flowbite-react";
import { useImageUrl } from "~/misc/useImageUrl";
const ExternalAssets = ({ onBackExternal }) => {
  const viad = useImageUrl("viad.jpg");
  const { imageMap, imageMap2 } = useUtasiImages();

  const { viaducts, refreshViaducts, refreshAssetContracts, refreshPillars } = useStations();
  const [selectedViaduct, setSelectedViaduct] = useState(null);
  const [isViaduct, setIsViaduct] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDetailsClick = (viaduct) => {
    setSelectedViaduct(viaduct);
  };
  const externalAssetsWithImages = viaducts.map((asset) => ({
    ...asset,
    picture: imageMap[asset.id] || null,
    picture2: imageMap2[asset.id] || null,
  }));
  const notes = selectedViaduct?.notes || "";
  const [firstPart, ...rest] = notes.split(",");

  const refresh = async () => {
    setLoading(true);
    try {
      await refreshViaducts();
      await refreshAssetContracts();
      await refreshPillars();
    } catch {
      setError("Failed to load train assets data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    refresh();
  }, []);

  if (error) return <p>Error: {error}</p>;
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
        <div className="flex gap-2">
          <button
            onClick={onBackExternal}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 active:scale-95 transition"
          >
            <FaArrowLeft />
            Back
          </button>
          {/* Refresh Button */}
          <button
            onClick={refresh}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-semibold shadow-md transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white"
            }`}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>
      {isViaduct ? (
        <>
          <div className="grid grid-cols-4 gap-6  bg-gray-100">
            {externalAssetsWithImages.map((viaduct) => (
              <ViaductCard
                key={viaduct.id}
                viaduct={{
                  ...viaduct,
                  picture: imageMap[viaduct.id] || viad,
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
