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
            <BarChart data={data} layout="vertical" margin={{ left: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <YAxis
                dataKey="region"
                type="category"
                interval={0}
                fontSize={12}
                textAnchor="end"
                tick={<CustomizedAxisTick />}
              />
              <XAxis type="number" domain={[0, "max"]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="digital" fill="#183145" />
              <Bar dataKey="classic" fill="#0692da" />
              <Bar dataKey="banner" fill="#0ec9912" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const CustomizedAxisTick = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={6} textAnchor="end" fill="#666" fontSize={12}>
        {payload.value.split("(")[1].split(")")[0]}
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
