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
          <ResponsiveContainer width={"100%"} height={500}>
            <BarChart data={data} margin={{ bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="region"
                interval={0}
                height={60}
                angle={-40}
                fontSize={12}
                textAnchor="end"
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="digital" fill="#183145" />
              <Bar dataKey="classic" fill="#0692da" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

BillboardGraph.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
};

BillboardGraph.propTypes = {};

export default BillboardGraph;
