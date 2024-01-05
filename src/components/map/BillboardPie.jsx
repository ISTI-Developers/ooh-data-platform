import PropTypes from "prop-types";
import { FaSquareFull } from "react-icons/fa";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";

function BillboardPie({ data, title }) {
  return (
    <div className="bg-white shadow p-4 w-1/2 flex flex-col gap-4">
      <header className="text-xl font-bold text-main">{title}</header>
      <div className="flex gap-2">
        <ul className="flex flex-col overflow-y-auto snap-y snap-mandatory">
          {data.map((item) => {
            return (
              <li
                key={item.region}
                className="text-sm flex items-start gap-1 snap-start"
              >
                <FaSquareFull
                  style={{ color: item.color }}
                  className="min-w-[14px]"
                />
                {item.region}
              </li>
            );
          })}
        </ul>
        <ResponsiveContainer width={"100%"} height={350}>
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Pie
              data={data}
              dataKey="count"
              nameKey="region"
              outerRadius={125}
              label
              fill="#B95446"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

BillboardPie.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
};

export default BillboardPie;
