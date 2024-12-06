import { AdvancedMarker } from "@vis.gl/react-google-maps";

function SelectedLandmarks({ landmarks = [] }) {
  return landmarks.map((landmark, index) => {
    const position = {
      lat: parseFloat(landmark.latitude),
      lng: parseFloat(landmark.longitude),
    };

    return (
      <AdvancedMarker key={landmark.l_id} position={position}>
        <p className="bg-green-200 text-green-500 border-green-500 border-2 p-1 px-2 rounded-full">
          {index + 1}
        </p>
      </AdvancedMarker>
    );
  });
}

export default SelectedLandmarks;
