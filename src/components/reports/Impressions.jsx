import { useEffect, useRef } from "react";
import { useReport } from "~config/ReportContext";
import PropTypes from "prop-types";
import { format } from "date-fns";
import "jspdf-autotable";
import html2canvas from "html2canvas";
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
import { useCampaigns } from "~config/Campaigns";

export default function Impressions({ title, impressions, site }) {
  const { addChart } = useCampaigns();
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

  useEffect(() => {
    const captureChart = async () => {
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL("image/png");
      addChart(site, title, imgData);
    };

    const timeout = setTimeout(captureChart, 1500);

    return () => clearTimeout(timeout);
  }, [site, title]);
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
            dataKey="period"
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

Impressions.propTypes = {
  title: PropTypes.string,
  impressions: PropTypes.array,
  active: PropTypes.bool,
  payload: PropTypes.object,
  label: PropTypes.string,
  site: PropTypes.object,
  setCanvases: PropTypes.func,
};
