import {
  Button,
  Datepicker,
  Label,
  TextInput,
  Tooltip as Tip,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { FaArrowsRotate, FaChartLine } from "react-icons/fa6";
import { useReport } from "~config/ReportContext";
import { mainButtonTheme } from "~config/themes";
import PropTypes from "prop-types";
import { format } from "date-fns";
import classNames from "classnames";
import "jspdf-autotable";
import { AiOutlineLoading } from "react-icons/ai";
import PrintAllModal from "~components/reports/PrintAllModal";
import ReportModal from "~components/reports/ReportModal";
import SiteQuery from "~components/reports/SiteQuery";
import Impressions from "~components/reports/Impressions";
import { useCampaigns } from "~config/Campaigns";

function Reports() {
  const { reports, addReport, toggleModal } = useCampaigns();
  const [enable, togglePrint] = useState(false);

  useEffect(() => {
    const printReady = () => togglePrint(true);
    const printWaiting = () => togglePrint(false);

    if (reports.some((item) => item.site == null)) {
      printWaiting();
    } else {
      printWaiting();
      const timeout = setTimeout(printReady, 1500);

      return () => clearTimeout(timeout);
    }
  }, [reports]);

  return (
    <>
      <div className="w-full py-4">
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold text-main flex items-center gap-2">
            Reports
            <span className="text-[#ec9912]">
              <FaChartLine />
            </span>
          </p>
          <Button
            type="button"
            color="information"
            disabled={!enable}
            theme={mainButtonTheme}
            className="bg-secondary-hover w-[150px] text-white"
            onClick={() => toggleModal("all")}
          >
            Print All
          </Button>
        </div>
        <div className="w-full py-2 space-y-4">
          {reports.map((report, index) => (
            <Report
              key={index}
              index={index}
              reportData={report}
              count={reports.length}
              sites={reports.map((rep) => rep.site)}
            />
          ))}
          <Button
            type="button"
            color="warning"
            disabled={reports[reports.length - 1].details === null}
            theme={mainButtonTheme}
            className="bg-[#ec9912] ml-auto"
            onClick={addReport}
          >
            Add another
          </Button>
        </div>
      </div>
      <PrintAllModal />
      <ReportModal />
    </>
  );
}

function Report({ index, reportData, sites, count }) {
  const { updateReport, removeReport, clearSite, fetchReport } = useCampaigns();
  const [active, setActive] = useState(true);
  const [query, setQuery] = useState("");
  const [site, setSite] = useState(null);
  const [details, setDetails] = useState(null);
  const [dates, setDates] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const onDateChange = (id, value) => {
    const date = new Date(value);
    setDates((prev) => ({
      ...prev,
      [id]: date,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!site) {
      alert("Please select a site first.");
      return;
    }
    const from = format(dates.from, "MM-dd-yyyy");
    const to = format(dates.to, "MM-dd-yyyy");
    const id = site.site;

    const { analytics } = await fetchReport(id, from, to);

    const {
      average_daily_impressions,
      average_weekly_impressions,
      average_monthly_impressions,
      impressions,
    } = analytics;

    const entries = {
      daily: average_daily_impressions,
      weekly: average_weekly_impressions,
      monthly: average_monthly_impressions,
    };

    const { daily } = impressions;
    const size = daily.length;
    const actualDates = {
      from: new Date(new Date(daily[0].period)),
      to: new Date(daily[size - 1].period),
    };
    const finalAnalytics = {
      ...entries,
      entries: impressions,
      dates: actualDates,
    };

    setQuery("");
    setDetails(finalAnalytics);
    updateReport(index, { site, details: finalAnalytics });
  };

  useEffect(() => {
    const timeout = setTimeout(() => setActive(false), 3000);

    return () => clearTimeout(timeout);
  }, []);
  return (
    <div className="space-y-6">
      <form
        className="flex gap-8 justify-between items-end"
        onSubmit={onSubmit}
      >
        <section className="relative w-full">
          {site ? (
            <div>
              <Label htmlFor="site" value="Selected Site" />
              <div className="flex justify-between border-b-2 border-slate-500 p-2">
                <p className="font-semibold">
                  {reportData.site?.site || site.site}
                </p>
                <Tip content="Change site" className="whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      clearSite(index);
                      setSite(null);
                      setDetails(null);
                    }}
                  >
                    <FaArrowsRotate />
                  </button>
                </Tip>
              </div>
            </div>
          ) : (
            <>
              <Label htmlFor="site" value="Search Site" />
              <TextInput
                type="search"
                // theme={defaultTextTheme}
                onChange={(e) => setQuery(e.target.value)}
              />
              <SiteQuery query={query} setSite={setSite} sites={sites} />
            </>
          )}
        </section>
        <div>
          <Label htmlFor="from" value="From: " />
          <Datepicker
            id="to"
            icon={null}
            required
            value={new Date(dates.from)}
            className="min-w-[200px]"
            theme={{
              views: {
                days: {
                  items: {
                    item: {
                      selected: "bg-[#1F487E] text-white",
                    },
                  },
                },
              },
            }}
            onChange={(date) =>
              onDateChange("from", format(new Date(date), "yyyy-MM-dd"))
            }
          />
        </div>
        <div>
          <Label htmlFor="to" value="To: " />
          <Datepicker
            id="to"
            icon={null}
            required
            value={new Date(dates.to)}
            className="min-w-[200px]"
            theme={{
              views: {
                days: {
                  items: {
                    item: {
                      selected: "bg-[#1F487E] text-white",
                    },
                  },
                },
              },
            }}
            minDate={new Date(dates.from)}
            onChange={(date) =>
              onDateChange("to", format(new Date(date), "yyyy-MM-dd"))
            }
          />
        </div>
        <Button
          type="submit"
          color="light"
          theme={mainButtonTheme}
          className="bg-[#1F487E] w-[200px]"
        >
          Show
        </Button>
        {count > 1 && (
          <Button
            type="button"
            color="failure"
            theme={mainButtonTheme}
            onClick={() => {
              setSite(null);
              setDetails(null);
              removeReport(index);
            }}
            className="bg-red-700 w-[150px]"
          >
            Remove
          </Button>
        )}
      </form>
      <section
        className={classNames(
          "bg-slate-200 w-full min-h-[300px] flex p-6 gap-6",
          active
            ? "pointer-events-none cursor-wait"
            : "pointer-events-auto cursor-default",
          !details ? "items-center justify-center" : "flex-col"
        )}
      >
        {!details ? (
          <p className="font-semibold text-lg text-slate-500">
            Please select a site and date range to show its impressions
          </p>
        ) : (
          <>
            <section className="flex justify-between items-center gap-2">
              <h2 className="text-xl font-bold">
                {reportData.site !== null ? reportData.site.site : site.site}{" "}
                Impressions
              </h2>
              <PrintButton index={index} />
            </section>
            <div className="grid grid-cols-3 gap-6">
              {["daily", "weekly", "monthly"].map((item) => {
                let analytics = reportData.details || details;

                return (
                  <Impressions
                    site={site}
                    key={item}
                    title={item}
                    impressions={[analytics[item], analytics.entries[item]]}
                  />
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function PrintButton({ index }) {
  const [active, setActive] = useState(false);
  const { toggleModal } = useCampaigns();

  useEffect(() => {
    const timeout = setTimeout(() => setActive(true), 1500);

    return () => clearTimeout(timeout);
  }, []);
  return (
    <Button
      type="button"
      color="warning"
      disabled={!active}
      isProcessing={!active}
      processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />}
      theme={mainButtonTheme}
      className="bg-[#ec9912] w-[150px]"
      onClick={() => {
        toggleModal(index);
      }}
    >
      Print
    </Button>
  );
}

PrintButton.propTypes = {
  index: PropTypes.number,
};

Report.propTypes = {
  index: PropTypes.number,
  count: PropTypes.number,
  reportData: PropTypes.object,
  updateReport: PropTypes.func,
  clearSite: PropTypes.func,
  removeReport: PropTypes.func,
  sites: PropTypes.array,
};

export default Reports;
