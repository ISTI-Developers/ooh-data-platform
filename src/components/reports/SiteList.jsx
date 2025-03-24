/* eslint-disable react/prop-types */
import classNames from "classnames";
import { differenceInDays, format, getMonth, getYear } from "date-fns";
import { Badge, Button, Label } from "flowbite-react";
import { useMemo, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { useFunction } from "~config/functions";
import { useMap } from "~config/MapsContext";
import { useReport } from "~config/ReportContext";
import { mainButtonTheme } from "~config/themes";

const SiteList = ({ setSites, query }) => {
  const { reports, sites, addReport, filters, showAvailable, toggleAvailable } =
    useReport();
  // const { retrieveAvailableSites } = useService();

  const [month, setMonth] = useState(0);

  const { landmarks } = useMap();
  const { haversineDistance, capitalizeFirst } = useFunction();

  const months = Array.from({ length: 12 }, (_, index) =>
    format(new Date(getYear(new Date()), index), "MMMM")
  );

  const onSelectAll = () => {
    const newSites = [...filteredSites];
    setSites((prev) => {
      const newItems = newSites.filter(
        (newSite) => !prev.some((item) => item.site_code === newSite.site_code)
      );
      return [...prev, ...newItems];
    });
    newSites.forEach((site) => {
      addReport(site);
    });
  };

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
        : filteredByPrice.filter(({ site, city, region, site_code }) =>
            [
              site.toLowerCase(),
              city.toLowerCase(),
              region.toLowerCase(),
              site_code.toLowerCase(),
            ].some((value) => value.includes(query.toLowerCase()))
          );
    return results.length > 0
      ? results.filter((result) =>
          reports.every((report) => report.site.site_code !== result.site_code)
        )
      : [];
  }, [sites, landmarks, filters, query, reports]);

  const disableSelect = useMemo(() => {
    return (
      (query === "" &&
        filters.landmarks.length === 0 &&
        filters.area.length === 0 &&
        filters.price.from === 0 &&
        filters.price.to === 0) ||
      filteredSites.length === 0
    );
  }, [filteredSites.length, filters, query]);

  const filterAvailability = useMemo(() => {
    if (filteredSites.length === 0) return [];

    const choice = parseInt(showAvailable);
    // Return the filtered list based on showAvailable condition
    return filteredSites.filter((site) => {
      const hasAvailable = site.availability ?? false;
      switch (choice) {
        case 0:
        default:
          return true;
        case 1:
          return hasAvailable
            ? differenceInDays(new Date(hasAvailable), new Date()) <= 60
            : false;
        case 2:
          // console.log(site.site_code, hasAvailable, differenceInDays(new Date(hasAvailable), new Date()) < 60)
          return hasAvailable
            ? differenceInDays(new Date(hasAvailable), new Date()) > 60
            : false;
        case 3:
          return hasAvailable
            ? getMonth(new Date(hasAvailable.substring(0, 10))) === month
            : false;
      }
    });
  }, [filteredSites, showAvailable, month]);

  return (
    <>
      <Button
        type="button"
        color="warning"
        size="sm"
        onClick={onSelectAll}
        processingSpinner={
          <AiOutlineLoading className="h-6 w-6 animate-spin" />
        }
        theme={mainButtonTheme}
        disabled={disableSelect}
        className={classNames(
          "bg-white hover:bg-slate-50 text-slate-700 whitespace-nowrap rounded-md",
          disableSelect ? "hidden" : ""
        )}
      >
        Select all
      </Button>
      <div className="flex gap-4 px-2">
        <div className="flex gap-4 items-center">
          <Label htmlFor="site_availability" value="Show: " />
          <select
            id="site_availability"
            className={classNames(
              "text-xs rounded-lg border-slate-300",
              showAvailable == 3 ? "font-semibold" : ""
            )}
            onChange={(e) => toggleAvailable(e.target.value)}
          >
            {["all", "available", "unavailable", "month"].map((value, idx) => {
              return (
                <option
                  key={`opt_${value}`}
                  value={idx}
                  selected={showAvailable === idx}
                >
                  {capitalizeFirst(value, "_")}
                </option>
              );
            })}
          </select>
        </div>
        {showAvailable == 3 && (
          <div className="flex items-center gap-4">
            <select
              id="sort"
              value={month}
              className="text-xs rounded-lg border-slate-300"
              onChange={(e) => setMonth(parseInt(e.target.value))}
            >
              {months.map((key, index) => {
                return (
                  <option key={key} value={index}>
                    {capitalizeFirst(key, "_")}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>
      <div className="max-h-[calc(100vh-24rem)] overflow-y-auto scrollbar-thin">
        {filterAvailability.map((site, index) => {
          return (
            <div
              role="checkbox"
              key={site.site_code + "_" + index}
              className="p-2 hover:bg-slate-50 cursor-pointer relative"
              onClick={() => {
                setSites((prev) => {
                  if (prev.includes(site)) {
                    return prev.filter(
                      (item) => item.site_code !== site.site_code
                    );
                  } else {
                    return [...prev, site];
                  }
                });
                addReport(site);
              }}
            >
              <div className="flex justify-between items-center">
                <p className="font-bold">{site.site_code}</p>
                <p className="text-xs">
                  {site.availability
                    ? format(
                        new Date(
                          new Date(site.availability).setDate(
                            new Date(site.availability).getDate() + 1
                          )
                        ),
                        "MMMM d, yyyy"
                      )
                    : null}
                </p>
              </div>
              <p className="text-xs">
                {capitalizeFirst(
                  site.address ?? `${site.city}, ${site.region}`
                )}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SiteList;
