import {
  Button,
  Label,
  Modal,
  TextInput,
  Tooltip as Tip,
} from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { FaArrowsRotate, FaChartLine } from "react-icons/fa6";
import { ReportProvider, useReport } from "~config/ReportContext";
import { defaultTextTheme, mainButtonTheme } from "~config/themes";
import PropTypes from "prop-types";
import { format } from "date-fns";
import classNames from "classnames";
import { generateRandomNumbers } from "~config/reports.test";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { AiOutlineLoading } from "react-icons/ai";

function Reports() {
  const { reports, addReport, show } = useReport();
  // const [reports, setReports] = useState([{ site: null, details: null }]);
  // const [charts, setCharts] = useState([]);

  // const addReport = () => {
  //   setReports([...reports, { site: null, details: null }]);
  // };

  // const updateReport = (index, newData) => {
  //   const newReports = reports.map((report, i) =>
  //     i === index ? newData : report
  //   );
  //   setReports(newReports);
  // };
  // const clearSite = (index) => {
  //   const tempReports = [...reports];
  //   const newReports = tempReports.find((_, i) => i === index);
  //   newReports.site = null;

  //   setReports(tempReports);
  // };
  // const removeReport = (index) => {
  //   setReports((current) => {
  //     return current.filter((_, i) => i !== index);
  //   });
  // };

  // const addChart = (site, chart) => {
  //   setCharts((prev) => {
  //     return [...prev, { site: site, chart: chart }];
  //   });
  // };
  // const deleteChart = (index) => {
  //   setCharts((prev) => {
  //     return prev.filter((_, i) => i !== index);
  //   });
  // };
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
            disabled
            color="warning"
            theme={mainButtonTheme}
            className="bg-[#ec9912] w-[150px]"
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
      <Modal show={show !== null} dismissible>
        <Modal.Header>
          Print {reports[show]?.site.site} Impressions
        </Modal.Header>
        <Modal.Body></Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            color="warning"
            processingSpinner={
              <AiOutlineLoading className="h-6 w-6 animate-spin" />
            }
            theme={mainButtonTheme}
            className="bg-[#ec9912] w-[150px]"
            onClick={() => console.log()}
          >
            Print
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function Report({ index, reportData, sites, count }) {
  const { updateReport, removeReport, clearSite } = useReport();
  const [query, setQuery] = useState("");
  const [site, setSite] = useState(null);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState(null);
  const [dates, setDates] = useState({
    from: new Date().setDate(new Date().getDate() - 30),
    to: new Date(),
  });
  const [canvases, setCanvases] = useState([]);

  const onDateChange = (e) => {
    const date = new Date(e.target.value);
    setDates((prev) => ({
      ...prev,
      [e.target.id]: date,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!site) {
      alert("Please select a site first.");
      return;
    }
    const from = format(dates.from, "yyyy-MM-dd");
    const to = format(dates.to, "yyyy-MM-dd");

    const analytics = generateRandomNumbers(from, to);
    const { daily, weekly, monthly } = analytics;

    const total = daily.reduce((sum, item) => sum + item.impressions, 0);

    const entries = {
      daily: Math.round(total / daily.length),
      weekly: Math.round(total / weekly.length),
      monthly: Math.round(total / monthly.length),
    };
    const finalAnalytics = {
      ...entries,
      entries: analytics,
    };

    setQuery("");
    setTitle(site.site);
    setDetails(finalAnalytics);
    updateReport(index, { site, details: finalAnalytics });
  };

  const onPrint = () => {
    const charts = canvases.slice(-3);
    const weeklyImpressions = details.entries.weekly.map((item) => {
      return [item.date, item.impressions.toLocaleString()];
    });

    const columns = [
      { title: "Week", dataKey: "date" },
      { title: "Impressions", dataKey: "impressions" },
    ];
    const pdf = new jsPDF("p", "mm", "legal");

    const pageWidth = pdf.internal.pageSize.getWidth();
    // const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.setFont("helvetica", "bold");
    pdf.text(`${title} Impressions`, 15, 15);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(
      `${format(new Date(dates.from), "MMMM d, yyyy")} - ${format(
        new Date(dates.to),
        "MMMM d, yyyy"
      )}`,
      15,
      21
    );
    pdf.line(15, 25, pageWidth - 15, 25);

    pdf.setFont("helvetica", "bold");
    pdf.text(`Weekly Impressions Breakdown`, 15, 32);
    pdf.autoTable({
      startY: 36, // Starting Y position for the table
      head: [columns.map((col) => col.title)], // Table headers
      body: weeklyImpressions, // Table data
      theme: "grid", // Optional: style the table
      headStyles: { fillColor: [0, 57, 107] }, // Optional: custom header styles
      margin: { top: 10 },
      styles: {
        cellPadding: 2,
        fontSize: 10,
        halign: "center",
        valign: "middle",
      },
      didDrawPage: function (data) {
        // Calculate the position for the next content
        const tableEndY = data.cursor.y + 10;
        pdf.setFont("helvetica", "bold");
        pdf.text("Charts", 15, tableEndY);
        pdf.setFont("helvetica", "normal");
        // pdf.text("Daily Impressions", 15, tableEndY + 6);
        pdf.addImage(charts[0], "PNG", 15, tableEndY + 2, 100, 80);
        pdf.addImage(charts[1], "PNG", 15, tableEndY + 82, 100, 80);
        pdf.addImage(charts[2], "PNG", 15, tableEndY + 164, 100, 80);
        // pdf.text("Weekly Impressions", 15, tableEndY + 56);
        // pdf.addImage(charts[1], "PNG", 15, tableEndY + 62);
        // pdf.text("Monthly Impressions", 15, tableEndY + 16);
        // pdf.addImage(charts[0], "PNG", 15, 30);
      },
    });
    pdf.save(`${title}.pdf`);
  };

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
                theme={defaultTextTheme}
                onChange={(e) => setQuery(e.target.value)}
              />
              <SiteQuery query={query} setSite={setSite} sites={sites} />
            </>
          )}
        </section>
        <div>
          <Label htmlFor="from" value="From: " />
          <input
            type="date"
            id="from"
            required
            value={format(new Date(dates.from), "yyyy-MM-dd")}
            className="border-gray-300"
            onChange={onDateChange}
          />
        </div>
        <div>
          <Label htmlFor="to" value="To: " />
          <input
            type="date"
            id="to"
            required
            value={format(new Date(dates.to), "yyyy-MM-dd")}
            className="border-gray-300"
            min={format(new Date(dates.from), "yyyy-MM-dd")}
            onChange={onDateChange}
          />
        </div>
        <Button
          type="submit"
          color="light"
          // disabled={query === ""}
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
              // setSite(null);
              // setDetails(null);
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
              <div className="flex items-center gap-1 ml-auto">
                <label htmlFor="title" className="font-semibold">
                  Title:{" "}
                </label>
                <input
                  id="title"
                  type="text"
                  className="bg-transparent border-x-0 border-t-0 border-b-2 border-main outline-none focus:ring-0"
                  placeholder="Enter file title and name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
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
                    setCanvases={setCanvases}
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
  const { toggleModal } = useReport();

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
      onClick={() => toggleModal(index)}
    >
      Print
    </Button>
  );
}
function SiteQuery({ query, setSite, sites: siteList }) {
  const [results, setResults] = useState(null);
  const { sites } = useReport();

  useEffect(() => {
    if (query?.length < 2) {
      setResults(null);
      return;
    }

    if (!sites) return;

    const siteWithReports = siteList.map((item) =>
      item ? item.site.toLowerCase() : null
    );
    const filteredSites = sites.filter(
      (item) =>
        item.site.toLowerCase().includes(query.toLowerCase()) &&
        !siteWithReports.includes(item.site.toLowerCase())
    );
    if (filteredSites.length !== 0) {
      setResults(filteredSites);
    } else {
      setResults("No sites found.");
    }
  }, [query, sites]);
  return (
    results &&
    (typeof results === "object" ? (
      <ul className="bg-white absolute w-full z-[2] max-h-[175px] overflow-y-auto flex flex-col border-x border-b border-cyan-500">
        {results.map((item) => {
          return (
            <li
              key={item.site_code}
              className="p-2 cursor-pointer hover:bg-slate-50"
              onClick={() => {
                setSite(item);
                setResults(null);
              }}
            >
              {item.site}
            </li>
          );
        })}
      </ul>
    ) : (
      <ul className="bg-white absolute w-full z-[2] p-2 text-slate-600">
        {results}
      </ul>
    ))
  );
}

function Impressions({ title, impressions }) {
  const [average, data] = impressions;
  const chartRef = useRef(null);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md p-2">
          <p>{format(new Date(label), "MMMM d, yyyy")}</p>
          <p className="text-[#1F487E]">{`Impressions: ${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white p-4 flex flex-col gap-4" ref={chartRef}>
      <section>
        <p className="capitalize text-xl font-semibold">{title} Impressions</p>
        <p>
          Average:{" "}
          <span className="font-semibold text-xl">
            {average.toLocaleString()}
          </span>
        </p>
      </section>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => format(new Date(value), "MM-dd")}
            angle={-20}
            textAnchor="end"
          />
          <YAxis />
          <Tooltip content={CustomTooltip} />
          <Legend
            formatter={(value) =>
              value.charAt(0).toUpperCase() + value.slice(1)
            }
          />
          <Bar
            dataKey="impressions"
            fill="#1F487E"
            activeBar={
              <Rectangle fill="#ec9912" stroke="#1F487E" strokeWidth={4} />
            }
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

PrintButton.propTypes = {
  onClick: PropTypes.func,
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
SiteQuery.propTypes = {
  query: PropTypes.string,
  setSite: PropTypes.func,
  sites: PropTypes.array,
};
Impressions.propTypes = {
  title: PropTypes.string,
  impressions: PropTypes.array,
  active: PropTypes.bool,
  payload: PropTypes.object,
  label: PropTypes.string,
  site: PropTypes.object,
  setCanvases: PropTypes.func,
};
export default Reports;
