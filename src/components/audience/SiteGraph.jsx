import PropTypes from "prop-types";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import classNames from "classnames";
import Loader from "~fragments/Loader";

function SiteGraph({ title, data, className, isFetching }) {
  if (!data) return;
  const avgImpressions =
    data.reduce((sum, current) => sum + current.impressions, 0) / data.length;
  const newImpressions = data.map((item) => ({
    ...item,
    average: avgImpressions,
  }));
  if (isFetching) {
    return (
      <div>
        <Loader height="17.75rem" />
      </div>
    );
  }
  if (newImpressions.length === 0) {
    return (
      <div
        className={classNames(
          "bg-white p-4 shadow flex flex-col gap-4 animate-fade h-[17.75rem]",
          className
        )}
      >
        <p className="bg-slate-200 text-slate-500 font-semibold h-full flex items-center justify-center rounded">
          No impressions found
        </p>
      </div>
    );
  }
  const keys = Object.keys(newImpressions[0]);

  return (
    <div
      className={classNames(
        "bg-white p-4 shadow flex flex-col gap-4 animate-fade",
        className
      )}
    >
      <header className="font-bold text-base text-main border-b-4 border-secondary pb-2">
        {title}
      </header>
      <ResponsiveContainer width={"100%"} height={200}>
        <LineChart width={"100%"} data={newImpressions} margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 6" />
          <XAxis dataKey={keys[0]} tick={<CustomLabel />} />
          <YAxis  
          // domain={['min','max']}
          />
          <Tooltip content={<CustomToolTip />} />
          <Legend />
          <Line
            type="linear"
            dataKey={keys[2]}
            stroke="#ec9912"
            strokeWidth={3}
            dot={null}
          />
          <Line
            type="monotone"
            dataKey={keys[1]}
            stroke="#84b6d8"
            strokeWidth={4}
            dot={{ fill: "#0692da", stroke: "#0692da", strokeWidth: 1 }}
            activeDot={{ fill: "#0692da" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomLabel({ x, y, payload }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} fill="#666">
        {format(new Date(payload.value), "MM/dd")}
      </text>
    </g>
  );
}

function CustomToolTip({ label, payload }) {
  return (
    payload &&
    label && (
      <div className="bg-white shadow p-2 border">
        <p>{format(new Date(label), "MMMM d, yyy")}</p>
        <p className="capitalize">{`${payload[0]?.dataKey}: ${Math.round(
          payload[0]?.value
        ).toLocaleString()}`}</p>
        <p className="capitalize">{`${
          payload[1]?.dataKey
        }: ${payload[1]?.value.toLocaleString()}`}</p>
      </div>
    )
  );
}
CustomToolTip.propTypes = {
  label: PropTypes.string,
  payload: PropTypes.array,
};
CustomLabel.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.object,
};
SiteGraph.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
  className: PropTypes.string,
  isFetching: PropTypes.bool,
};

export default SiteGraph;
