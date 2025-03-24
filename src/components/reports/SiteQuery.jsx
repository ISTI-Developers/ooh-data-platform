import { useMemo } from "react";
import { useReport } from "~config/ReportContext";
import PropTypes from "prop-types";
import "jspdf-autotable";
export default function SiteQuery({ query, setSite, sites: siteList }) {
  const { sites } = useReport();

  const filteredSites = useMemo(() => {
    if (!sites) return;
    if (query?.length < 2) return;

    const sq = query.toLowerCase();

    const siteWithReports = siteList.map((item) =>
      item ? item.site.toLowerCase() : null
    );

    const results = sites.filter(
      (item) =>
        [
          item.site.toLowerCase(),
          item.city.toLowerCase(),
          item.region.toLowerCase(),
          item.address?.toLowerCase(),
          item.site_code?.toLowerCase(),
        ].some((value) => value && value.includes(sq)) &&
        !siteWithReports.includes(item.site.toLowerCase())
    );
    return results.length > 0 ? results : "No results found.";
  }, [query, siteList, sites]);

  return (
    filteredSites &&
    (typeof filteredSites === "object" ? (
      <ul
        id="search-list"
        className="bg-white absolute w-full z-[2] max-h-[175px] overflow-y-auto flex flex-col border-x border-b border-cyan-500"
      >
        {filteredSites.map((item) => {
          return (
            <li
              id={`search-${item.site_code}`}
              key={item.site_code}
              className="p-2 cursor-pointer hover:bg-slate-50"
              onClick={() => {
                setSite(item);
              }}
            >
              <p className="font-semibold">
                {item.site_code ?? item.site_code}
              </p>
              <p className="text-sm">
                {item.address ?? item.city + ", " + item.region}
              </p>
            </li>
          );
        })}
      </ul>
    ) : (
      <ul className="bg-white absolute w-full z-[2] p-2 text-slate-600">
        {filteredSites}
      </ul>
    ))
  );
}

SiteQuery.propTypes = {
  query: PropTypes.string,
  setSite: PropTypes.func,
  sites: PropTypes.array,
};
