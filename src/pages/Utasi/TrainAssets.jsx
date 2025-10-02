// import React from "react";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "flowbite-react";
import { FaInfoCircle, FaArrowLeft } from "react-icons/fa";
import { useImageUrl } from "~/misc/useImageUrl";
import { useStations } from "~config/LRTContext";

const TrainAssets = ({ onBackTrain }) => {
  const handgrips = useImageUrl("handgrips.jpg");
  const overheadpanels = useImageUrl("overheadpanels.png");
  const seatdividersticker = useImageUrl("seatdividersticker.jpg");
  const seatdividersticker2 = useImageUrl("seatdividersticker2.png");
  const trainwrap = useImageUrl("trainwrap.jpg");
  const twoseaterwrap = useImageUrl("twoseaterwrap.jpg");

  const { trainAssets, trainSpecs, refreshAllTrainAssets, refreshTrainSpecs } = useStations();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [detailModal, setDetailModal] = useState(false);

  const headers = ["Assets", "Available", "Out of Order", "Booked"];

  const handleDetailModal = (asset) => {
    const matchedSpec = trainSpecs.find((spec) => spec.asset_id === asset.asset_id);
    setSelectedAsset(matchedSpec || asset);
    setDetailModal(true);
  };
  const refresh = async () => {
    setLoading(true);
    try {
      await refreshAllTrainAssets();
      await refreshTrainSpecs();
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
    <div className="container rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackTrain}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 active:scale-95 transition"
        >
          <FaArrowLeft />
          Back
        </button>
        <div className="flex gap-3">
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
      <h2 className="text-xl font-bold text-blue-500 mb-4">TRAIN ASSETS</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left bg-white rounded-lg shadow-md border-collapse">
          <thead className="text-gray-700 text-sm font-semibold">
            <tr>
              {headers.map((head, index) => (
                <th key={index} className="px-6 py-3">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trainAssets.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="capitalize">{item.asset_name}</span>
                    <div className="relative group">
                      <FaInfoCircle className="text-blue-500 cursor-pointer" onClick={() => handleDetailModal(item)} />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{item.available}</td>
                <td className="px-6 py-4">{item.out_of_order}</td>
                <td className="px-6 py-4">{item.booked}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Flowbite Modal */}
      <Modal show={detailModal} onClose={() => setDetailModal(false)} sizing="md">
        <Modal.Header className="capitalize">{selectedAsset?.asset_name || "Asset Details"}</Modal.Header>
        <Modal.Body>
          {selectedAsset ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <p>
                  <strong>Media Rental:</strong> ₱{Number(selectedAsset.media_rental).toLocaleString()}
                </p>
                <p>
                  <strong>Rate Card:</strong> ₱{Number(selectedAsset.ratecard).toLocaleString()}
                </p>
                <p>
                  <strong>Production Cost:</strong> ₱{Number(selectedAsset.prod_cost).toLocaleString()}
                </p>
                <p>
                  <strong>Min Duration:</strong> {selectedAsset.min_duration_months} months
                </p>
                <p>
                  <strong>VAT Exclusive:</strong> {selectedAsset.vat_exclusive ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Size:</strong> {selectedAsset.size || "N/A"}
                </p>
                <p>
                  <strong>Notes:</strong> {selectedAsset.notes || "N/A"}
                </p>
              </div>
              <div className="flex justify-center">
                {(() => {
                  const assetImages = {
                    3: overheadpanels,
                    4: [seatdividersticker, seatdividersticker2],
                    5: twoseaterwrap,
                    6: handgrips,
                    7: trainwrap,
                  };
                  const imageSrc = assetImages[selectedAsset.asset_id];
                  return Array.isArray(imageSrc) ? (
                    <div className="space-y-2">
                      {imageSrc.map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`Asset ${index + 1}`}
                          className="w-full h-auto rounded-lg shadow-md"
                        />
                      ))}
                    </div>
                  ) : (
                    <img src={imageSrc} alt="Asset" className="w-full h-auto rounded-lg shadow-md" />
                  );
                })()}
              </div>
            </div>
          ) : (
            <p>No asset details available.</p>
          )}
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={() => setDetailModal(false)}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
TrainAssets.propTypes = {
  onBackTrain: PropTypes.func,
};
export default TrainAssets;
