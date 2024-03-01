import PropTypes from "prop-types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function BillboardGraph({ data, title }) {
  return (
    <div className="bg-white shadow p-4 w-full flex flex-col gap-4">
      <header className="text-xl font-bold text-main">{title}</header>
      <div className="flex gap-2 overflow-x-auto">
        <div className=" min-w-[768px] w-full">
          <ResponsiveContainer width={"100%"} height={120 + data.length * 60}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="region"
                type="category"
                interval={0}
                fontSize={12}
                textAnchor="end"
                tick={<CustomizedAxisTick />}
              />
              <YAxis type="number" domain={[0, "max"]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="digital" fill="#183145" />
              <Bar dataKey="classic" fill="#0692da" />
              <Bar dataKey="banner" fill="#ec9912" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
const CustomizedAxisTick = ({ x, y, payload }) => {
  let label = payload.value;

  //check if label has parenthesis
  const matches = label.match(/\(([^)]+)\)/);
  if (matches) {
    label = matches[1];
  }
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={6} textAnchor="end" fill="#666"  fontSize={12}>
        {label}
      </text>
    </g>
  );
};
BillboardGraph.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
};

CustomizedAxisTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.object,
};

export default BillboardGraph;
