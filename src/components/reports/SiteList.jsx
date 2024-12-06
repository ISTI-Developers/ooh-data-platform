/* eslint-disable react/prop-types */
import { useMemo } from "react";
import { useFunction } from "~config/functions";
import { useMap } from "~config/MapsContext";
import { useReport } from "~config/ReportContext";

const SiteList = ({ setSites, query }) => {
  const { reports, sites, addReport, filters } = useReport();
  const { landmarks } = useMap();
  const { haversineDistance, capitalizeFirst } = useFunction();

  const filteredSites = useMemo(() => {
    if (!sites) return [];

    // Create a set of landmark types for fast look-up
    const landmarkTypes = new Set(filters.landmarks.map((lm) => lm.value));

    // Precompute the set of areas for fast look-up
    const areasSet = new Set(filters.area.map((item) => item.label));

    // Filter landmarks based on the selected filters
    const filteredLandmarks = landmarks.filter((landmark) =>
      landmark.types.some((type) => landmarkTypes.has(type))
    );

    // Filter sites by area if there are area filters
    const filteredSitesByArea = filters.area.length
      ? sites.filter((site) => areasSet.has(site.city_name))
      : sites;
    // Filter sites by landmarks and distance if there are any landmark filters
    const filteredSitesByLandmarks = filters.landmarks.length
      ? filteredSitesByArea.filter((site) => {
          const { latitude, longitude } = site;
          return filteredLandmarks.some((landmark) => {
            const { latitude: landmarkLat, longitude: landmarkLng } = landmark;
            const distance = haversineDistance(
              { lat: latitude, lng: longitude },
              { lat: landmarkLat, lng: landmarkLng }
            );
            return distance <= 100;
          });
        })
      : filteredSitesByArea;

    const filteredByPrice = filteredSitesByLandmarks.filter((site) => {
      const { price } = site;

      // Case 1: Both from and to are 0, return all sites
      if (filters.price.from === 0 && filters.price.to === 0) {
        return true;
      }

      // Case 2: From is 0, so return sites that have price <= to
      if (filters.price.from === 0 && filters.price.to !== 0) {
        return price <= filters.price.to;
      }

      // Case 3: To is 0, so return sites that have price >= from
      if (filters.price.to === 0 && filters.price.from !== 0) {
        return price >= filters.price.from;
      }

      // Case 4: Both from and to are non-zero, return sites where price is within range
      return price >= filters.price.from && price <= filters.price.to;
    });

    const results =
      query.length === 0
        ? filteredByPrice
        : filteredByPrice.filter(
            ({ site, city, city_name, region, address, unis_code }) =>
              [
                site.toLowerCase(),
                city.toLowerCase(),
                region.toLowerCase(),
                address.toLowerCase(),
                city_name.toLowerCase(),
                unis_code.toLowerCase(),
              ].some((value) => value.includes(query))
          );
    return results.length > 0
      ? results.filter((result) =>
          reports.every((report) => report.site.unis_code !== result.unis_code)
        )
      : [];
  }, [sites, landmarks, filters, query, reports]);

  return (
    <div className="max-h-[calc(100vh-24rem)] overflow-y-auto scrollbar-thin">
      {/* <pre>{JSON.stringify(filteredSites.map(site => site.site), null, 2)}</pre> */}
      {filteredSites.map((site) => {
        return (
          <div
            role="checkbox"
            key={site.site}
            className="p-2 hover:bg-slate-50 cursor-pointer"
            onClick={() => {
              setSites((prev) => {
                if (prev.includes(site)) {
                  return prev.filter(
                    (item) => item.unis_code !== site.unis_code
                  );
                } else {
                  return [...prev, site];
                }
              });
              addReport(site);
            }}
          >
            <p className="font-bold">{site.unis_code}</p>
            <p className="text-xs">{capitalizeFirst(site.address)}</p>
          </div>
        );
      })}
    </div>
  );
};

export default SiteList;
