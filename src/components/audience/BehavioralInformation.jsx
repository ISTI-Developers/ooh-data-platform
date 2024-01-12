import PropTypes from "prop-types";
import { useFunction } from "../../config/functions";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
function BehavioralInformation({ audiences = [] }) {
  const { capitalize, toSentenceCase, colors } = useFunction();

  const renderLabel = (contents) => {
    return (contents.percent * 100).toFixed(2) + "%";
  };
  const renderLegend = (responses) => {
    return (
      <div className="flex flex-wrap gap-1 text-sm text-slate-600 justify-center">
        {responses.map((entry, index) => (
          <p key={`item-${index}`} className="flex items-center">
            <span
              className="block w-2 h-2 mr-2"
              style={{ backgroundColor: colors[index] }}
            />
            {capitalize(entry.choice)}
          </p>
        ))}
      </div>
    );
  };
  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row">
        {audiences.map((res, index) => {
          const { question, responses } = res;

          return (
            <div key={index} className="w-full">
              <p className="text-main font-semibold border-b pb-1">
                {toSentenceCase(question)}
              </p>
              <ResponsiveContainer
                width={"100%"}
                height={350}
                className="w-full"
              >
                {res.category === "basic" ? (
                  <PieChart className="outline-none">
                    <Pie
                      data={responses}
                      dataKey="count"
                      nameKey="choice"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={110}
                      label={renderLabel}
                    >
                      {responses.map((entry, index) => {
                        entry.color = colors[index];
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            className="outline-none"
                          />
                        );
                      })}
                    </Pie>
                    <Tooltip content={<CustomToolTip />} />
                    <Legend
                      verticalAlign="top"
                      content={() => renderLegend(responses)}
                    />
                  </PieChart>
                ) : (
                  <BarChart data={responses}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="choice"
                      interval={0}
                      height={60}
                      angle={-40}
                      fontSize={12}
                      textAnchor="end"
                    />
                    <YAxis />
                    <Tooltip content={<CustomToolTip />} />
                    <Legend />
                    <Bar dataKey="count" fill={colors[index]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    </>
  );
}
function CustomToolTip({ active, payload }) {
  return (
    active && (
      <div className="bg-white shadow p-2 border">
        <p className="capitalize">{`${
          payload[0].name === "count"
            ? payload[0].payload.choice
            : payload[0].name
        }: ${Math.round(payload[0]?.value)}`}</p>
      </div>
    )
  );
}
CustomToolTip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
};
BehavioralInformation.propTypes = {
  audiences: PropTypes.array,
};

export default BehavioralInformation;
