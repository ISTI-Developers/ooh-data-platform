/* eslint-disable react/prop-types */
import { Button, Label } from "flowbite-react";
import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { FaChartLine } from "react-icons/fa";
import { useReport } from "~config/ReportContext";
import { mainButtonTheme } from "~config/themes";
import classNames from "classnames";
import { useLocation } from "react-router-dom";
import { RiCloseLine } from "react-icons/ri";
import DeckItem from "~components/reports/DeckItem";
import SiteOptions from "~components/reports/SiteOptions";
import SiteList from "~components/reports/SiteList";
import DeckOptions from "~components/reports/DeckOptions";
function ReportDecks() {
  const { removeReport, onGeneratePowerpoint, setReports, setPriceDetails } =
    useReport();
  const [query, setQuery] = useState("");
  const [selectedSites, setSites] = useState([]);

  const { hash } = useLocation();

  return (
    <div className="w-full py-4">
      <div className="flex justify-between items-center">
        <p className="text-xl font-bold text-main flex items-center gap-2">
          Reports
          <span className="text-[#ec9912]">
            <FaChartLine />
          </span>
        </p>
      </div>
      <main className="relative scroll-pt-[3rem] grid grid-cols-[1fr_3fr] gap-4">
        <div className="w-full transition-all">
          <div className="flex flex-col gap-4 sticky top-4 w-full">
            <SiteOptions setQuery={setQuery} />
            <section className="row-[2/3] col-[1/3] bg-white p-4 space-y-2 rounded-md shadow">
              <SiteList setSites={setSites} query={query} />
            </section>
          </div>
        </div>
        {selectedSites.length > 0 ? (
          <section className="space-y-4 mt-2">
            <div className="flex gap-4 items-center sticky top-6 bg-white rounded-md shadow z-10">
              <Label className="whitespace-nowrap p-2">Selected Sites: </Label>
              <div className="flex items-center gap-2 overflow-x-auto w-full p-2 scrollbar-thin rounded-md snap-x snap-mandatory max-w-[50vw]">
                {selectedSites.map((site) => {
                  return (
                    <div
                      key={site.site_code}
                      className={classNames(
                        "flex items-center gap-2",
                        "p-2 py-0.5 text-white rounded-md whitespace-nowrap snap-start text-xs",
                        hash === `#${site.site_code}`
                          ? "bg-blue-900"
                          : "bg-blue-500"
                      )}
                    >
                      <a href={`#${site.site_code}`}>{site.site_code}</a>
                      <button
                        onClick={() => {
                          setSites((prev) => {
                            return prev.filter(
                              (item) => item.site_code !== site.site_code
                            );
                          });
                          removeReport(site.site_code);
                        }}
                      >
                        <RiCloseLine />
                      </button>
                    </div>
                  );
                })}
              </div>
              <Button
                type="button"
                color="warning"
                onClick={() => {
                  setSites([]);
                  setReports([]);
                  setPriceDetails([]);
                }}
                size="sm"
                processingSpinner={
                  <AiOutlineLoading className="h-6 w-6 animate-spin" />
                }
                theme={mainButtonTheme}
                className="bg-white text-main whitespace-nowrap m-2 rounded-md"
              >
                Clear
              </Button>
              <DeckOptions />
              <Button
                type="button"
                color="warning"
                onClick={onGeneratePowerpoint}
                size="sm"
                processingSpinner={
                  <AiOutlineLoading className="h-6 w-6 animate-spin" />
                }
                theme={mainButtonTheme}
                className="bg-[#ec9912] whitespace-nowrap m-2 rounded-md"
              >
                Generate Deck
              </Button>
            </div>
            {selectedSites.map(({ area, imageURL, ...site }) => {
              return (
                <DeckItem
                  site={site}
                  onClose={() => {
                    removeReport(site.site_code);
                    setSites((prev) => {
                      return prev.filter(
                        (item) => item.site_code !== site.site_code
                      );
                    });
                  }}
                  key={site.site_code}
                />
              );
            })}
          </section>
        ) : (
          <div className="transition-all flex items-center justify-center min-h-[65vh] bg-white bg-opacity-70 rounded-md shadow-md text-slate-600 font-semibold">
            Select a site to view its details
          </div>
        )}
      </main>
    </div>
  );
}

export default ReportDecks;
