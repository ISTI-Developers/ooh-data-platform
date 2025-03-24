/* eslint-disable react/prop-types */
import { Badge } from "flowbite-react";
import { useReport } from "~config/ReportContext";
import { badge } from "~config/themes";

const NearbyLandmarks = ({ nearbyLandmarks, site, asBadge = false }) => {
  const { selectedLandmarks, setLandmarks } = useReport();
  return (
    nearbyLandmarks && (
      <div className="flex flex-1 gap-2 flex-wrap">
        {nearbyLandmarks.map((landmark) => {
          const selectedLandmark = selectedLandmarks.find(
            (lm) => lm.site === site
          );
          const index =
            selectedLandmark?.landmarks.length > 0
              ? selectedLandmark?.landmarks.findIndex(
                  (item) => item === landmark
                )
              : -1;
          return asBadge ? (
            <Badge
              theme={badge}
              key={landmark.l_id}
              onClick={() =>
                setLandmarks((prev) => {
                  const siteIndex = prev.findIndex(
                    (item) => item.site === site
                  );
                  if (siteIndex !== -1) {
                    // If the site is found, update the landmarks for that site
                    const updatedLandmarks = prev[siteIndex].landmarks.includes(
                      landmark
                    )
                      ? prev[siteIndex].landmarks.filter(
                          (item) => item !== landmark
                        )
                      : [...prev[siteIndex].landmarks, landmark];

                    // Return a new array with the updated landmarks for the specific site
                    return [
                      ...prev.slice(0, siteIndex),
                      { ...prev[siteIndex], landmarks: updatedLandmarks },
                      ...prev.slice(siteIndex + 1),
                    ];
                  } else {
                    // If the site is not found, add the new landmark entry
                    return [...prev, { site, landmarks: [landmark] }];
                  }
                })
              }
              className="rounded-full p-2 py-1 cursor-pointer "
              color={index !== -1 ? "success" : "info"}
            >
              <p className="flex items-center gap-1">
                {index !== -1 && (
                  <p className="border border-green-500 rounded-full w-4 h-4 flex items-center justify-center p-2">
                    {index + 1}
                  </p>
                )}
                <p>{landmark.display_name}</p>
              </p>
            </Badge>
          ) : (
            <p key={landmark.l_id} className="text-xs">
              {landmark.display_name}
            </p>
          );
        })}
      </div>
    )
  );
};

export default NearbyLandmarks;
